import localforage from 'localforage';

export function triggerLocalEvent() {
  window.dispatchEvent(new Event('local-storage-change'));
}

// ----------------------------------------------------
// UPLOAD FILE API (Express VPS)
// ----------------------------------------------------
export async function uploadFile(path: string, file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
  } catch (e) {
    console.warn('VPS upload API error, fallback to Base64:', e);
  }

  // Base64 Compression Fallback
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max_size = 1200;

        if (width > height) {
          if (width > max_size) {
            height = Math.round((height * max_size) / width);
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width = Math.round((width * max_size) / height);
            height = max_size;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          resolve(compressedBase64);
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// ----------------------------------------------------
// READ DATA (API Query)
// ----------------------------------------------------
export async function getLocalData(path: string) {
  try {
    const res = await fetch(`/api/${path}`);
    if (res.ok) {
      const data = await res.json();
      await localforage.setItem(path, data);
      return data;
    }
  } catch (e) {
    console.warn(`API fetch failed for /api/${path}, reading from local cache:`, e);
  }

  // Fallback to local cache
  let data: any = await localforage.getItem(path);
  if (!data) {
    const legacy = localStorage.getItem(path);
    if (legacy) {
      try { data = JSON.parse(legacy); } catch (e) {}
    }
  }
  return data || (path.startsWith('settings_') ? {} : []);
}

// ----------------------------------------------------
// CREATE DOCUMENT (API Post)
// ----------------------------------------------------
export async function createDocument(path: string, data: any) {
  const id = data.id || Date.now().toString();
  const newItem = {
    ...data,
    id,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await fetch(`/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
  } catch (e) {
    console.error(`API create error for /api/${path}:`, e);
  }

  const items = (await getLocalData(path)) || [];
  if (Array.isArray(items)) {
    const idx = items.findIndex((item: any) => item.id === id);
    if (idx >= 0) {
      items[idx] = newItem;
    } else {
      items.unshift(newItem);
    }
    await localforage.setItem(path, items);
  }
  triggerLocalEvent();
  return id;
}

// ----------------------------------------------------
// UPDATE DOCUMENT (API Post)
// ----------------------------------------------------
export async function updateDocument(path: string, id: string, data: any) {
  const updateData = { ...data, id, updatedAt: new Date().toISOString() };

  try {
    await fetch(`/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
  } catch (e) {
    console.error(`API update error for /api/${path}:`, e);
  }

  const items = (await getLocalData(path)) || [];
  if (Array.isArray(items)) {
    const index = items.findIndex((item: any) => item.id === id);
    if (index > -1) {
      items[index] = { ...items[index], ...updateData };
      await localforage.setItem(path, items);
    }
  }
  triggerLocalEvent();
}

// ----------------------------------------------------
// DELETE DOCUMENT (API Delete)
// ----------------------------------------------------
export async function deleteDocument(path: string, id: string) {
  try {
    await fetch(`/api/${path}/${id}`, {
      method: 'DELETE',
    });
  } catch (e) {
    console.error(`API delete error for /api/${path}/${id}:`, e);
  }

  let items = (await getLocalData(path)) || [];
  if (Array.isArray(items)) {
    items = items.filter((item: any) => item.id !== id);
    await localforage.setItem(path, items);
  }
  triggerLocalEvent();
}

export async function getDocument(path: string, id: string) {
  try {
    const res = await fetch(`/api/${path}/${id}`);
    if (res.ok) {
      const item = await res.json();
      if (item && item.id) return item;
    }
  } catch (e) {
    console.warn(`Direct fetch for /api/${path}/${id} failed, falling back to cache:`, e);
  }

  const items = await getLocalData(path);
  if (Array.isArray(items)) {
    return items.find((item: any) => item.id === id) || null;
  }
  return null;
}

// ----------------------------------------------------
// SETTINGS
// ----------------------------------------------------
export async function getSettings(key: string) {
  return await getLocalData(`settings_${key}`);
}

export async function saveSettings(key: string, data: any) {
  const existing = await getSettings(key);
  const newSettings = { ...existing, ...data };

  try {
    await fetch(`/api/settings_${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    });
  } catch (e) {
    console.error(`API saveSettings error for settings_${key}:`, e);
  }

  await localforage.setItem(`settings_${key}`, newSettings);
  triggerLocalEvent();
}

export async function updateDocumentsBatch(path: string, updates: { id: string; data: any }[]) {
  for (const update of updates) {
    await updateDocument(path, update.id, update.data);
  }
}
