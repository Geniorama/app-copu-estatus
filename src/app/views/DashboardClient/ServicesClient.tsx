"use client";

import { useState, useEffect } from "react";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import type { Service, TableDataProps } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { getServicesByCompanyId } from "@/app/utilities/helpers/fetchers";
import { Entry } from "contentful-management";

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
  "Nombre servicio",
  "Fecha inicio",
  "Fecha vencimiento",
  "Estado",
];

export default function ServicesClient() {
  const [searchValue, setSearchValue] = useState("");
  const [originalData, setOriginalData] = useState<Service[]>([]);
  const [services, setServices] = useState<TableDataProps | null>(null);
  const { userData } = useSelector((state: RootState) => state.user);

  const fetchServices = async (companyIds: string[]) => {
    try {
      const allServices = await Promise.all(
        companyIds.map(async (companyId) => {
          const res = await getServicesByCompanyId(companyId);
          return res.map((service: Entry) => ({
            name: service.fields.name["en-US"],
            description: service.fields.description["en-US"],
            startDate: service.fields.startDate["en-US"],
            endDate: service.fields.endDate["en-US"],
            status: service.fields.status["en-US"],
            plan: service.fields.plan["en-US"],
          }));
        })
      );

      const mergedServices = allServices.flat();
      setOriginalData(mergedServices);
      setServices({
        heads: headsTable,
        rows: mergedServices.map((service) => [
          service.name,
          service.startDate,
          service.endDate,
          serviceStatus(service.status),
        ]),
      });
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
    }
  };

  useEffect(() => {
    if (userData?.companiesId?.length) {
      fetchServices(userData.companiesId);
    }
  }, [userData]);

  useEffect(() => {
    if (!searchValue.trim()) {
      setServices({
        heads: headsTable,
        rows: originalData.map((service) => [
          service.name,
          service.startDate,
          service.endDate,
          service.status && serviceStatus(service.status),
        ]),
      });
    } else {
      const filteredRows = originalData
        .filter((service) =>
          service.name.toLowerCase().includes(searchValue.toLowerCase())
        )
        .map((service) => [
          service.name,
          service.startDate,
          service.endDate,
          service.status && serviceStatus(service.status),
        ]);

      setServices(filteredRows.length ? { heads: headsTable, rows: filteredRows } : null);
    }
  }, [searchValue, originalData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <div className="mb-5">
        <TitleSection title="Servicios" />
      </div>

      <div className="flex gap-3 items-center justify-end">
        <div className="flex gap-6 items-center">
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
