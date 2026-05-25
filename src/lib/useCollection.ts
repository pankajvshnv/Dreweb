import { useState, useEffect } from 'react';
import { getLocalData } from './crud';

export function useCollection<T>(path: string, options?: any[]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = async () => {
      try {
        let items: any = await getLocalData(path);
        if (!items) items = [];

        // Sort by order if available, else fallback to reversed creation
        items.sort((a: any, b: any) => {
          const orderA = typeof a.order === 'number' ? a.order : 999999;
          const orderB = typeof b.order === 'number' ? b.order : 999999;
          if (orderA !== orderB) return orderA - orderB;
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        setData(items as T[]);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    handleStorageChange();
    window.addEventListener('local-storage-change', handleStorageChange);
    return () => {
      window.removeEventListener('local-storage-change', handleStorageChange);
    };
  }, [path]);

  return { data, loading, error };
}

