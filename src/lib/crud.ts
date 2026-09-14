import { supabase, isSupabaseConfigured } from './supabase';
import localforage from 'localforage';

export function triggerLocalEvent() {
  window.dispatchEvent(new Event('local-storage-change'));
}

export async function uploadFile(path: string, file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('media').getPublicUrl(filePath);
        return data.publicUrl;
      }
    } catch (e) {
      console.warn('Supabase storage upload fallback to Base64:', e);
    }
  }

  // Fallback to compressed base64 if storage bucket is not configured
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

// ----------------------------------------------------
// READ DATA (PostgreSQL Supabase Table / Fallback)
// ----------------------------------------------------
export async function getLocalData(path: string) {
  const cleanTable = path.replace('settings_', '');

  if (isSupabaseConfigured && supabase) {
    try {
      if (path.startsWith('settings_')) {
        const { data, error } = await supabase
          .from('settings')
          .select('data')
          .eq('key', cleanTable)
          .single();
        
        if (!error && data) return data.data;
        return {};
      }

      const { data, error } = await supabase
        .from(cleanTable)
        .select('*');

      if (!error && data) return data;
    } catch (e) {
      console.warn(`Supabase fetch failed for ${path}, falling back to local cache`, e);
    }
  }

  // Localforage / Local Storage Fallback
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
// CREATE DOCUMENT (PostgreSQL Supabase Table)
// ----------------------------------------------------
export async function createDocument(path: string, data: any) {
  const cleanTable = path;
  const id = data.id || Date.now().toString();
  const newItem = {
    ...data,
    id,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from(cleanTable).insert([newItem]);
      if (error) console.error(`Supabase insert error on ${cleanTable}:`, error);
    } catch (e) {
      console.error(`Supabase createDocument exception:`, e);
    }
  }

  // Update local cache & notify subscribers
  const items = (await getLocalData(path)) || [];
  if (Array.isArray(items)) {
    items.push(newItem);
    await localforage.setItem(path, items);
  }
  triggerLocalEvent();
  return id;
}

// ----------------------------------------------------
// UPDATE DOCUMENT (PostgreSQL Supabase Table)
// ----------------------------------------------------
export async function updateDocument(path: string, id: string, data: any) {
  const cleanTable = path;
  const updateData = { ...data, updatedAt: new Date().toISOString() };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from(cleanTable)
        .update(updateData)
        .eq('id', id);
      
      if (error) console.error(`Supabase update error on ${cleanTable}:`, error);
    } catch (e) {
      console.error(`Supabase updateDocument exception:`, e);
    }
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
// DELETE DOCUMENT (PostgreSQL Supabase Table)
// ----------------------------------------------------
export async function deleteDocument(path: string, id: string) {
  const cleanTable = path;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from(cleanTable)
        .delete()
        .eq('id', id);
      
      if (error) console.error(`Supabase delete error on ${cleanTable}:`, error);
    } catch (e) {
      console.error(`Supabase deleteDocument exception:`, e);
    }
  }

  let items = (await getLocalData(path)) || [];
  if (Array.isArray(items)) {
    items = items.filter((item: any) => item.id !== id);
    await localforage.setItem(path, items);
  }
  triggerLocalEvent();
}

export async function getDocument(path: string, id: string) {
  const items = await getLocalData(path);
  if (Array.isArray(items)) {
    return items.find((item: any) => item.id === id) || null;
  }
  return null;
}

// ----------------------------------------------------
// SETTINGS (PostgreSQL Supabase Table)
// ----------------------------------------------------
export async function getSettings(key: string) {
  return await getLocalData(`settings_${key}`);
}

export async function saveSettings(key: string, data: any) {
  const existing = await getSettings(key);
  const newSettings = { ...existing, ...data };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, data: newSettings, updatedAt: new Date().toISOString() }, { onConflict: 'key' });
      
      if (error) console.error(`Supabase saveSettings error:`, error);
    } catch (e) {
      console.error(`Supabase saveSettings exception:`, e);
    }
  }

  await localforage.setItem(`settings_${key}`, newSettings);
  triggerLocalEvent();
}

export async function updateDocumentsBatch(path: string, updates: { id: string; data: any }[]) {
  for (const update of updates) {
    await updateDocument(path, update.id, update.data);
  }
}
