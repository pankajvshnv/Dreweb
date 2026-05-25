import { useState, useEffect } from 'react';
import { getLocalData } from './crud';

export function useDocumentBySlug<T>(path: string, slug: string | undefined) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const items: any = await getLocalData(path);
        const item = items?.find((i: any) => i.slug === slug);
        
        if (item) {
          setData(item as T & {id: string});
        } else {
          setData(null);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path, slug]);

  return { data, loading, error };
}
