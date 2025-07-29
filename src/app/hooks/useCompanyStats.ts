import { useState, useEffect, useRef } from "react";
import { getCompanyStats } from "@/app/utilities/helpers/fetchers";

interface CompanyStats {
  name: string;
  alcance: number;
  impresiones: number;
  interacciones: number;
  contenidos: number;
}

export const useCompanyStats = (companyIds: string[]) => {
  const [stats, setStats] = useState<CompanyStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevCompanyIdsRef = useRef<string[]>([]);

  useEffect(() => {
    // Check if companyIds have actually changed
    const companyIdsString = JSON.stringify(companyIds);
    const prevCompanyIdsString = JSON.stringify(prevCompanyIdsRef.current);
    
    if (companyIdsString === prevCompanyIdsString) {
      return; // Skip if companyIds haven't changed
    }

    prevCompanyIdsRef.current = companyIds;

    const fetchStats = async () => {
      if (!companyIds || companyIds.length === 0) {
        setStats([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getCompanyStats(companyIds);
        if (data) {
          setStats(data);
        } else {
          setStats([]);
        }
      } catch (err) {
        setError("Error al cargar las estadísticas de las compañías");
        console.error("Error fetching company stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [companyIds]);

  return { stats, loading, error };
};