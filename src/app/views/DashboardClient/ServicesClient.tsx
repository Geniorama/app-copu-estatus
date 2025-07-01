"use client";

import { useState, useMemo } from "react";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import type { Service, TableDataProps } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import Link from "next/link";

const serviceStatus = (status: boolean) => (
  <div className="flex items-center">
    <span
      className={`w-2 h-2 rounded-full mr-1 ${
        status ? "bg-cp-primary" : "bg-gray-400"
      }`}
    ></span>
    <span>{status ? "Activo" : "Inactivo"}</span>
  </div>
);

const headsTable = [
  "Compañía",
  "Nombre servicio",
  "Plan",
  "Fecha inicio",
  "Fecha vencimiento",
  "Estado",
  "Acciones"
];

// Datos simulados de servicios
const mockServices: Service[] = Array.from({ length: 15 }).map((_, i) => ({
  id: (i + 1).toString(),
  companyName: `Compañía ${((i % 3) + 1)}`,
  name: `Servicio ${i + 1}`,
  description: `Descripción del servicio ${i + 1}`,
  startDate: `2024-0${((i % 12) + 1).toString().padStart(2, "0")}-01`,
  endDate: `2024-12-31`,
  status: i % 2 === 0,
  plan: "anual",
  features: [
    { title: "Característica A", quantity: 3 },
    { title: "Característica B", quantity: 5 }
  ],
  accionWebYRss: 5,
  accionPostRss: 10
}));

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function ServicesClient() {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  // Filtrado por búsqueda
  const filteredServices = useMemo(() => {
    if (!searchValue.trim()) return mockServices;
    return mockServices.filter((service) =>
      service.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  // Paginación
  const totalPages = Math.ceil(filteredServices.length / pageSize);
  const paginatedServices = filteredServices.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const services: TableDataProps = {
    heads: headsTable,
    rows: paginatedServices.map((service) => [
      service.companyName,
      service.name,
      service.plan ? service.plan.charAt(0).toUpperCase() + service.plan.slice(1) : '',
      service.startDate,
      service.endDate,
      serviceStatus(service.status || false),
      <Link
        key={service.id}
        href={`/dashboard/servicios/${service.id}`}
        className="text-cp-primary hover:text-cp-primary-dark transition cursor-pointer hover:underline"
      >
        Ver
      </Link>
    ]),
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setPage(1); // Reiniciar a la primera página al buscar
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1); // Reiniciar a la primera página al cambiar el tamaño
  };

  return (
    <div>
      <div className="mb-5">
        <TitleSection title="Servicios" />
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
        <div className="flex gap-6 items-center">
          <Search 
            onChange={handleChange} 
            value={searchValue} 
            onReset={() => { setSearchValue(""); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-slate-400 text-sm">Resultados por página:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="bg-slate-800 text-slate-200 rounded px-2 py-1"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <Table data={services} />

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-cp-primary text-white" : "bg-slate-800 text-slate-300"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
