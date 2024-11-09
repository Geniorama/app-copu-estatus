import { useCallback } from "react";

const useExportCSV = <T extends Record<string, string | number>>(
  data: T[],
  headers: string[],
  fileName: string
) => {
  const exportToCSV = useCallback(() => {
    const mappedData = data.map((item) => {
      return headers.reduce((acc, header) => {
        acc[header] = item[header];
        return acc;
      }, {} as Record<string, string | number>);
    });

    const rows = mappedData.map((item) =>
      headers.map((header) => {
        const value = item[header];
        return value !== undefined && value !== null ? value : "";
      })
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Crear el archivo CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
  }, [data, headers, fileName]);

  return exportToCSV;
};

export default useExportCSV;
