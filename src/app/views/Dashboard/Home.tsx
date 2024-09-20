"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "@/app/store";
import CardAction from "@/app/components/CardAction/CardAction";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import type { ChangeEvent } from "react"

const initialData = {
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
  const [filteredData, setFilteredData] = useState(initialData);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (currentUser) {
      console.log("Current user dashboard:", currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const filteredRows = initialData.rows.filter(row =>
      row.some(cell =>
        cell.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
    
    setFilteredData(prevData => ({
      ...prevData,
      rows: filteredRows,
    }));
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
            <Search
              onChange={handleChange}
              value={searchValue}
            />
          </div>
        </div>

        <Table data={filteredData} />
      </div>
    </div>
  );
}
