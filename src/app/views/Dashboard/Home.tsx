"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "@/app/store";
import CardAction from "@/app/components/CardAction/CardAction";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import type { ChangeEvent } from "react";
import type { TableDataProps } from "@/app/types";

const initialData: TableDataProps = {
  heads: ["ID", "Empresa", "Contacto", "Servicios", "Última modificación"],
  rows: [
    ["1", "Sancho BBDO", "Juan Pérez", "Servicio BBDO 1, Servicio BBDO 2", "1"],
    ["2", "Company XYZ", "Jane Doe", "<a href='' class='underline text-cp-primary'>Servicio XYZ</a>", "3"],
    ["3", "Sancho BBDO", "Juan Pérez", "Servicio BBDO 1, Servicio BBDO 2", "1"],
    ["4", "Company ABC", "Alice Smith", "<a href='' class='underline text-cp-primary'>Servicio ABC</a>", "2"],
  ],
};

export default function DashboardHome() {
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState<TableDataProps | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (currentUser) {
      console.log("Current user dashboard:", currentUser);
      setFilteredData(initialData);
    }
  }, [currentUser]);

  // Filtrar filas basadas en el valor de búsqueda
  useEffect(() => {
    if (initialData && searchValue.trim()) {
      const filteredRows = initialData.rows.filter((row) =>
        row.some((cell: string) =>
          cell.toLowerCase().includes(searchValue.toLowerCase())
        )
      );

      setFilteredData((prevData) =>
        filteredRows.length > 0
          ? {
              heads: prevData?.heads || initialData.heads,
              rows: filteredRows,
            }
          : null
      );
    } else {
      setFilteredData(initialData);
    }
  }, [searchValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-5">
        <CardAction title="Crear usuario" icon="user" />
        <CardAction title="Crear empresa" icon="company" />
        <CardAction title="Crear servicio" icon="service" />
        <CardAction title="Crear contenido" icon="content" />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Mis empresas asignadas</h3>
          <div>
            <Search onChange={handleChange} value={searchValue} />
          </div>
        </div>

        {filteredData ? (
          <Table data={filteredData} />
        ) : (
          <div className=" text-center p-5 mt-10 flex justify-center items-center">
            <p className="text-slate-400">No hay datos disponibles <br /> o no hay coincidencias con la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
