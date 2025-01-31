"use client";

import { useState, useEffect, useCallback } from "react";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import type { Service, TableDataProps } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { getServicesByCompanyId } from "@/app/utilities/helpers/fetchers";
import { Entry } from "contentful-management";
import { useFetchCompanies } from "@/app/hooks/useFetchCompanies";
import LinkCP from "@/app/utilities/ui/LinkCP";
import Modal from "@/app/components/Modal/Modal";

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
  "Fecha inicio",
  "Fecha vencimiento",
  "Estado",
  "Acciones"
];

export default function ServicesClient() {
  const [searchValue, setSearchValue] = useState("");
  const [originalData, setOriginalData] = useState<Service[]>([]);
  const [services, setServices] = useState<TableDataProps | null>(null);
  const [previewService, setPreviewService] = useState<Service | null>(null)
  const { userData } = useSelector((state: RootState) => state.user);

  const fetchServicesByCompany = useCallback(async (companyId: string) => {
      try {
        const response = await fetch(
          `/api/getServicesByCompany?companyId=${companyId}`
        );
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching services by company:", error);
        return [];
      }
  }, []);

  const {originalData: companies} = useFetchCompanies(userData, fetchServicesByCompany, false)


  const fetchServices = async (companyIds: string[]) => {
    try {
      const allServices = await Promise.all(
        companyIds.map(async (companyId) => {
          const res = await getServicesByCompanyId(companyId);
          return res.map((service: Entry) => {
            const companyName = companies.find((company) => company.id === companyId)?.name
            console.log(service)
            return {
              companyName: companyName,
              name: service.fields.name["en-US"],
              description: service.fields.description["en-US"],
              startDate: service.fields.startDate["en-US"],
              endDate: service.fields.endDate["en-US"],
              status: service.fields.status["en-US"],
              plan: service.fields.plan["en-US"],
              features: service.fields.features?.["en-US"]
            }
          });
        })
      );

      const mergedServices = allServices.flat();

      console.log('mergedServices', mergedServices)

      setOriginalData(mergedServices);
      setServices({
        heads: headsTable,
        rows: mergedServices.map((service) => [
          service.companyName,
          service.name,
          service.startDate,
          service.endDate,
          serviceStatus(service.status),
          <LinkCP onClick={() => setPreviewService(service)} key={service.id}>Ver servicio</LinkCP>
        ]),
      });
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
    }
  };
  

  useEffect(() => {
    if (userData?.companiesId?.length && companies.length > 0) {
      fetchServices(userData.companiesId);
    }
  }, [userData, companies]);

  useEffect(() => {
    if (!searchValue.trim()) {
      setServices({
        heads: headsTable,
        rows: originalData.map((service) => [
          service.companyName,
          service.name,
          service.startDate,
          service.endDate,
          serviceStatus(service.status || false),
          <LinkCP onClick={() => setPreviewService(service)} key={service.id}>Ver servicio</LinkCP>
        ]),
      });
    } else {
      const filteredRows = originalData
        .filter((service) =>
          service.name.toLowerCase().includes(searchValue.toLowerCase())
        )
        .map((service) => [
          service.companyName,
          service.name,
          service.startDate,
          service.endDate,
          serviceStatus(service.status || false),
          <LinkCP onClick={() => setPreviewService(service)} key={service.id}>Ver servicio</LinkCP>
        ]);

      setServices(filteredRows.length ? { heads: headsTable, rows: filteredRows } : null);
    }
  }, [searchValue, originalData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      {previewService && (
        <Modal open={true} onClose={() => setPreviewService(null)}>
          <div className="bg-cp-light text-cp-dark p-7 rounded-sm">
            <h5>
              <span className="text-xl font-bold">{previewService.name}</span> -{" "}
              <span>{previewService.companyName}</span>
            </h5>
            {previewService.description && (
              <p className="text-sm mt-2">
                {previewService.description}
              </p>
            )}
            {previewService.features && (
              <div className="mt-5 bg-cp-dark p-4 text-cp-light border-sm">
                <h3 className="font-medium text-lg">Incluye</h3>
                <ul className="mt-4 text-xs">
                  {previewService.features.map((feature) => (
                    <>
                      <li>
                        {feature.quantity && (
                          <span className="inline-flex w-[16px] h-[16px] bg-cp-primary justify-center items-center rounded-full mr-1 text-cp-dark">
                            {feature.quantity}
                          </span>
                        )}
                        <span>
                          {feature.title}
                        </span>
                      </li>
                      <hr className="my-3 border-slate-500" />
                    </>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}
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
