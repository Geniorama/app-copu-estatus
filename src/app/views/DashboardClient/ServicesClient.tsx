"use client";

import { useState, useMemo, useEffect } from "react";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import type { Service, TableDataProps, CompanyResponse } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import Link from "next/link";
import { getCompaniesByIds, getServicesByCompanyId } from "@/app/utilities/helpers/fetchers";
import TableSkeleton from "@/app/components/SkeletonLoader/TableSkeleton";
import { Entry } from "contentful-management";
import { formattedDate } from "@/app/utilities/helpers/formatters";

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

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function ServicesClient() {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener compañías y servicios del usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos del usuario desde localStorage
        const userData = localStorage.getItem("userData");
        if (!userData) {
          setLoading(false);
          return;
        }
        
        const userDataParsed = JSON.parse(userData);
        const companiesIds = userDataParsed.companiesId || [];
        
        if (companiesIds.length === 0) {
          setLoading(false);
          return;
        }

        // Obtener compañías
        const companiesFetched = await getCompaniesByIds(companiesIds);
        if (!companiesFetched) {
          setLoading(false);
          return;
        }

        // Obtener servicios de todas las compañías
        const allServices: Service[] = [];
        
        for (const companyId of companiesIds) {
          const servicesFetched = await getServicesByCompanyId(companyId, 100);
          if (servicesFetched && Array.isArray(servicesFetched)) {
            const company = companiesFetched.companies?.find((c: CompanyResponse) => c.sys.id === companyId);
            const companyName = company?.fields?.name || "Compañía sin nombre";
            
            const transformServices = servicesFetched.map((service: Entry) => ({
              id: service.sys.id,
              companyName: companyName,
              name: service.fields.name["en-US"],
              description: service.fields.description["en-US"],
              startDate: service.fields.startDate["en-US"],
              endDate: service.fields.endDate["en-US"],
              status: service.fields.status["en-US"],
              plan: service.fields.plan?.["en-US"] || null,
              features: service.fields.features?.["en-US"] || [],
              accionWebYRss: service.fields.accionWebYRss?.["en-US"] || 0,
              accionPostRss: service.fields.accionPostRss?.["en-US"] || 0,
            }));
            
            allServices.push(...transformServices);
          }
        }
        
        setServices(allServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrado por búsqueda
  const filteredServices = useMemo(() => {
    if (!searchValue.trim()) return services;
    return services.filter((service) =>
      service.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      service.companyName?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, services]);

  // Paginación
  const totalPages = Math.ceil(filteredServices.length / pageSize);
  const paginatedServices = filteredServices.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const tableData: TableDataProps = {
    heads: headsTable,
    rows: paginatedServices.map((service) => [
      service.companyName || "Sin compañía",
      service.name || "Sin nombre",
      service.plan ? service.plan.charAt(0).toUpperCase() + service.plan.slice(1) : 'Sin plan',
      formattedDate(service.startDate) || "Sin fecha",
      formattedDate(service.endDate) || "Sin fecha",
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

  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Servicios" />
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
          <div className="flex gap-6 items-center">
            <div className="h-10 bg-slate-700 rounded w-64 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 bg-slate-700 rounded w-32 animate-pulse"></div>
            <div className="h-8 bg-slate-700 rounded w-16 animate-pulse"></div>
          </div>
        </div>
        <TableSkeleton rows={10} columns={7} />
      </div>
    );
  }

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

      {services.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-slate-400 text-center">No hay servicios disponibles</p>
        </div>
      ) : (
        <>
          <Table data={tableData} />

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
        </>
      )}
    </div>
  );
}
