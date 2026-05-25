import localforage from 'localforage';

async function getDb(): Promise<any> {
  const mod = await import('./db.json');
  return mod.default;
}

export function triggerLocalEvent() {
  window.dispatchEvent(new Event('local-storage-change'));
}

export async function uploadFile(path: string, file: File): Promise<string> {
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
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

function encodeUtf8Base64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function decodeUtf8Base64(b64: string): string {
  return decodeURIComponent(escape(atob(b64)));
}

export async function syncToGithub(key: string, data: any, token: string, repo: string) {
  try {
    const url = `https://api.github.com/repos/${repo}/contents/src/lib/db.json`;
    
    const res = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch database file metadata: ${res.statusText}`);
    }

    const fileInfo = await res.json();
    const sha = fileInfo.sha;
    
    // Decode base64 content
    const currentDbText = decodeUtf8Base64(fileInfo.content.replace(/\s/g, ''));
    const dbObj = JSON.parse(currentDbText);
    
    // Update key
    dbObj[key] = data;
    
    // Serialize and re-encode
    const updatedDbText = JSON.stringify(dbObj, null, 2);
    const encodedContent = encodeUtf8Base64(updatedDbText);
    
    // Commit changes
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `cms: update ${key} via online panel [skip ci]`,
        content: encodedContent,
        sha: sha,
        branch: 'main'
      })
    });

    if (!putRes.ok) {
      const errInfo = await putRes.json().catch(() => ({}));
      throw new Error(`Failed to commit changes: ${errInfo.message || putRes.statusText}`);
    }
    
    console.log(`Successfully committed and pushed ${key} to GitHub!`);
  } catch (e) {
    console.error('Failed to sync to GitHub', e);
    throw e;
  }
}

async function syncToFs(key: string, data: any) {
  if (import.meta.env.DEV) {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data })
      });
    } catch (e) {
      console.error('Failed to sync to FS', e);
    }
  } else {
    try {
      const token = localStorage.getItem('github_token') || await localforage.getItem('github_token');
      const repo = localStorage.getItem('github_repo') || await localforage.getItem('github_repo') || 'pankajvshnv/dreweb';
      if (token && typeof token === 'string' && token.trim() !== '') {
        await syncToGithub(key, data, token, repo);
      }
    } catch (e) {
      console.error('Failed to auto-sync to GitHub in production', e);
    }
  }
}

export async function getLocalData(path: string) {
  const db = await getDb();
  if (import.meta.env.DEV) {
    let data: any = await localforage.getItem(path);
    if (!data || data.length === 0 || Object.keys(data).length === 0) {
      const legacy = localStorage.getItem(path);
      if (legacy) {
        data = JSON.parse(legacy);
        await localforage.setItem(path, data);
        await syncToFs(path, data);
      } else {
        data = (db as any)[path] || (path.startsWith('settings_') ? {} : []);
      }
    } else {
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch(e) {}
      }
      const dbData = (db as any)[path];
      if (dbData) {
        if (Array.isArray(dbData) && Array.isArray(data)) {
          const missing = dbData.filter(dbItem => !data.some((item: any) => item.id === dbItem.id));
          if (missing.length > 0) {
            data = [...data, ...missing];
            await localforage.setItem(path, data);
          }
        } else if (typeof dbData === 'object' && dbData !== null && typeof data === 'object' && data !== null) {
          let updated = false;
          for (const key in dbData) {
            if (!(key in data)) {
              data[key] = dbData[key];
              updated = true;
            }
          }
          if (updated) {
            await localforage.setItem(path, data);
          }
        }
      }
    }
    return data || (path.startsWith('settings_') ? {} : []);
  } else {
    // In production, strictly read from the bundled db.json
    return (db as any)[path] || (path.startsWith('settings_') ? {} : []);
  }
}

export async function createDocument(path: string, data: any) {
  const items = await getLocalData(path);
  const id = Date.now().toString();
  const newItem = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.push(newItem);
  await localforage.setItem(path, items);
  await syncToFs(path, items);
  triggerLocalEvent();
  return id;
}

export async function updateDocument(path: string, id: string, data: any) {
  const items = await getLocalData(path);
  const index = items.findIndex((item: any) => item.id === id);
  if (index > -1) {
    items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
    await localforage.setItem(path, items);
    await syncToFs(path, items);
    triggerLocalEvent();
  }
}

export async function deleteDocument(path: string, id: string) {
  let items = await getLocalData(path);
  items = items.filter((item: any) => item.id !== id);
  await localforage.setItem(path, items);
  await syncToFs(path, items);
  triggerLocalEvent();
}

export async function getDocument(path: string, id: string) {
  const items = await getLocalData(path);
  return items.find((item: any) => item.id === id) || null;
}

// For settings
export async function getSettings(key: string) {
  return await getLocalData(`settings_${key}`);
}

export async function saveSettings(key: string, data: any) {
  const existing = await getSettings(key);
  const newSettings = { ...existing, ...data };
  await localforage.setItem(`settings_${key}`, newSettings);
  await syncToFs(`settings_${key}`, newSettings);
  triggerLocalEvent();
}

export async function updateDocumentsBatch(path: string, updates: {id: string, data: any}[]) {
  const items = await getLocalData(path);
  let changed = false;
  for (const update of updates) {
    const index = items.findIndex((item: any) => item.id === update.id);
    if (index > -1) {
      items[index] = { ...items[index], ...update.data, updatedAt: new Date().toISOString() };
      changed = true;
    }
  }
  if (changed) {
    await localforage.setItem(path, items);
    await syncToFs(path, items);
    triggerLocalEvent();
  }
}

