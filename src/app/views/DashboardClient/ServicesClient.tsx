"use client";

import { useState, useEffect } from "react";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import type { TableDataProps } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import BoxNotices from "./BoxNotices";


const serviceStatus = (status:boolean) => {
  if(status){
    return(
      <>
        <span className="w-2 h-2 bg-cp-primary inline-block rounded-full mr-1"></span><span>Activo</span>
      </>
    )
  }

  return(
    <>
      <span className="w-2 h-2 bg-gray-400 inline-block rounded-full mr-1"></span><span>Inactivo</span>
    </>
  )
}

const initialData: TableDataProps = {
  heads: ["ID", "Nombre servicio", "Fecha inicio", "Fecha vencimiento", "Compañia", "Estado"],
  rows: [
    ["1", "Servicio 1", "10 oct 2024", "10 oct 2025", "Sancho BBDO", serviceStatus(true)],
    ["2", "Servicio 2", "10 oct 2024", "10 oct 2025", "Sancho BBDO", serviceStatus(false)]
    // Otras filas...
  ],
};

export default function ServicesClient() {
  const [searchValue, setSearchValue] = useState("");
  const [services, setServices] = useState<TableDataProps | null>(initialData);

  useEffect(() => {
    if (initialData && searchValue.trim()) {
      const filteredRows = initialData.rows.filter((row) =>
        row.some(
          (cell) =>
            typeof cell === "string" &&
            cell.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      setServices(
        filteredRows.length > 0
          ? { heads: initialData.heads, rows: filteredRows }
          : null
      );
    } else {
      setServices(initialData);
    }
  }, [searchValue, initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <div className="mb-5">
        <TitleSection title="Servicios" />
      </div>
      <div className="my-5">
        <BoxNotices />
      </div>
      <div className="flex gap-3 items-center justify-end">
        <div className="flex gap-6 items-center">
          {/* <LinkCP href="#">Exportar CSV</LinkCP> */}
          <Search onChange={handleChange} value={searchValue} />
        </div>
      </div>

      {services ? (
        <Table data={services} />
      ) : (
        <div className="text-center p-5 mt-10 flex justify-center items-center">
          <p className="text-slate-400">
            No hay datos disponibles o no hay coincidencias con la búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}