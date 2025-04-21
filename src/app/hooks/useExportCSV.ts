import { useCallback } from "react";

const useExportCSV = <T extends Record<string, string | number | boolean | null | undefined>>(
  data: T[],
  headersMap: Record<string, string>, // Mapeo de encabezados personalizados
  fileName: string
) => {
  /**
   * Función para exportar datos a un archivo CSV.
   * @param {T[]} data - Datos a exportar.
   * @param {Record<string, string>} headersMap - Mapeo de encabezados personalizados.
   * @param {string} fileName - Nombre del archivo CSV a descargar.
   */
  
  const exportToCSV = useCallback(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("No hay datos para exportar.");
      return;
    }

    const headers = Object.keys(headersMap);
    const keys = Object.values(headersMap);

    const rows = data.map((item) =>
      keys.map((key) => {
        const value = item[key];
        return value !== undefined && value !== null ? value : "";
      })
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
  }, [data, headersMap, fileName]);

  return exportToCSV;
};

export default useExportCSV;