import { useState, useCallback } from "react";

export function useApiData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      setError("Error al obtener los datos");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchData, loading, error };
}
