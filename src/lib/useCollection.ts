import { useState, useEffect, useCallback } from 'react';

// Global event to trigger re-fetches across all mounted hooks
const REFRESH_EVENT = 'dreweb-collection-refresh';

export function triggerCollectionRefresh() {
  window.dispatchEvent(new Event(REFRESH_EVENT));
}

export function useCollection<T>(path: string, _options?: any[]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/${path}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const items: any[] = await res.json();

      // Sort by order if available, else by created date desc
      items.sort((a: any, b: any) => {
        const orderA = typeof a.order === 'number' ? a.order : 999999;
        const orderB = typeof b.order === 'number' ? b.order : 999999;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.createdAt || b.created_at || 0).getTime() - new Date(a.createdAt || a.created_at || 0).getTime();
      });

      setData(items as T[]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    fetchData();
    window.addEventListener(REFRESH_EVENT, fetchData);
    return () => window.removeEventListener(REFRESH_EVENT, fetchData);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
