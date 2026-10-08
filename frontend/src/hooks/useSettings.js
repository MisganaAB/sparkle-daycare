import { useState, useEffect } from 'react';
import { getSettings } from '../services/api';

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading, error };
}
