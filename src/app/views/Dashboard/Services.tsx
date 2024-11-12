"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/app/utilities/ui/Button";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import LinkCP from "@/app/utilities/ui/LinkCP";
import Modal from "@/app/components/Modal/Modal";
import FormCreateService from "@/app/components/Form/FormCreateService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { TableDataProps } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import { getAllServices } from "@/app/utilities/helpers/fetchers";
import Switch from "@/app/utilities/ui/Switch";
import { Service } from "@/app/types";
import { Entry } from "contentful-management";
import Spinner from "@/app/utilities/ui/Spinner";
import { usePathname } from "next/navigation";

const headsTable = [
  "Nombre servicio",
  "Tipo plan",
  "Fecha inicio",
  "Fecha finalización",
  "Estado",
  "Acciones",
];

export default function Services() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [services, setServices] = useState<TableDataProps | null>(null);
  const [originalData, setOriginalData] = useState<Service[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceForEdit, setServiceForEdit] = useState<Service | null>(null)
  const pathname = usePathname();

  const rowsTable = async (data: Service[]) => {
    if (data) {
      const filteredData = data.map((service: Service) => [
        service.name,
        service.plan,
        service.startDate,
        service.endDate,
        <Switch
          onClick={() => handleSwitch(service.id, data)}
          active={false}
          key={service.id}
        />,
        <LinkCP key={service.id}>Editar</LinkCP>,
      ]);

      return filteredData;
    }
  };

  const fetchServices = async () => {
    const response = await getAllServices();
    if (response) {
      const filteredData: Service[] = response.map((service: Entry) => ({
        id: service.sys.id,
        name: service.fields.name["en-US"],
        description: service.fields.description["en-US"],
        plan: service.fields.plan["en-US"],
        startDate: service.fields.startDate["en-US"],
        endDate: service.fields.endDate["en-US"],
      }));

      const tableData: TableDataProps = {
        heads: headsTable,
        rows: await rowsTable(filteredData) || [],
      };
      setOriginalData(filteredData);
      setServices(tableData);
      setLoading(false);
      console.log("Datos asignados a originalData:", filteredData);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [pathname]);

  const handleSwitch = useCallback(
    (serviceId?: string, data?:Service[]) => {
      if (!data) {
        console.warn("Datos aún no cargados");
        return;
      }
      console.log("service id", serviceId);
      console.log("original data", data);
      const filterService = data.find((service) => service.id === serviceId)
      if(filterService){
        setServiceForEdit(filterService)
      }
    },
    [originalData]
  );

  useEffect(() => {
    console.log(originalData);
  }, [originalData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <FormCreateService onClose={() => setOpenModal(false)} />
      </Modal>
      <div className="mb-5">
        <TitleSection title="Servicios" />
      </div>
      <div className="flex gap-3 items-center justify-between">
        <Button onClick={() => setOpenModal(true)} mode="cp-green">
          <span className="mr-3">Nuevo servicio</span>
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <div className="flex gap-6 items-center">
          <LinkCP href="#">Exportar CSV</LinkCP>
          <Search onChange={handleChange} value={searchValue} />
        </div>
      </div>

      {loading && !originalData ? (
        <div className="w-full h-[400px] flex justify-center items-center">
          <span className="text-8xl">
            <Spinner />
          </span>
        </div>
      ) : services ? (
        <Table data={services} />
      ) : (
        <div className="text-center p-5 mt-10 flex justify-center items-center">
          <p className="text-slate-400">
            No hay empresas asignadas <br /> o no hay coincidencias con la
            búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}
