import { useState, useEffect, useCallback } from 'react';
import { getGallery } from '../services/api';

export function useGallery({ category = 'all', limit = 12 } = {}) {
  const [images, setImages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(
    async (page = 1, append = false) => {
      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const cat = category === 'all' ? undefined : category;
        const res = await getGallery({ category: cat, page, limit });

        setImages((prev) => (append ? [...prev, ...res.data] : res.data));
        setPagination(res.pagination);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category, limit]
  );

  useEffect(() => {
    fetch(1, false);
  }, [fetch]);

  const loadMore = () => {
    if (pagination.page < pagination.pages) {
      fetch(pagination.page + 1, true);
      setPagination((p) => ({ ...p, page: p.page + 1 }));
    }
  };

  return { images, pagination, loading, loadingMore, error, loadMore };
}
