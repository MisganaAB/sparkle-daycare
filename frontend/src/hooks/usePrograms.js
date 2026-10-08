import { useState, useEffect } from 'react';
import { getCurrentProgram, getPrograms } from '../services/api';

export function useCurrentProgram() {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentProgram()
      .then(setProgram)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { program, loading, error };
}

export function useAllPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    getPrograms()
      .then(setPrograms)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return { programs, loading, error, reload: load };
}
