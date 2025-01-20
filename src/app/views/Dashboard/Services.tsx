"use client";

import { useState, useEffect } from "react";
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
import { useFetchServices } from "@/app/hooks/useFetchServices";
import Switch from "@/app/utilities/ui/Switch";
import { Service } from "@/app/types";
import Spinner from "@/app/utilities/ui/Spinner";
import { updateService } from "@/app/utilities/helpers/fetchers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formattedDate } from "@/app/utilities/helpers/formatters";
import { useSearchParams } from "next/navigation";

const headsTable = [
  "Nombre servicio",
  "Tipo plan",
  "Fecha inicio",
  "Fecha finalización",
  "Compañía",
  "Estado",
  "Acciones",
];

export default function Services() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [services, setServices] = useState<TableDataProps | null>(null);
  const [serviceForEdit, setServiceForEdit] = useState<Service | null>(null);
  const [hasUpdate, setHasUpdate] = useState(false)
  const { dataServices, loading } = useFetchServices({
    hasUpdate: hasUpdate
  });
  const notify = (message: string) => toast(message);
  const searchParams = useSearchParams();
  const actionUrl = searchParams.get("action");

  const handleSwitch = async (serviceId?: string) => {
    if (serviceId) {
      const filterService = dataServices.find(
        (service) => service.id === serviceId
      );
      if (filterService) {
        const updatedService = {
          ...filterService,
          status: !filterService.status,
        };

        if (updatedService) {
          await updateService(updatedService);
          notify("Servicio actualizado");
        }
      } else {
        console.log("No se encuentra el servicio");
      }
    }
  };

  const handleEditService = (service?: Service) => {
    if (service) {
      console.log(service);
      setServiceForEdit(service);
      setOpenModal(true);
    }
  };  

  const rowsTable = (data: Service[]) => {
    const filteredData = data.map((service) => [
      service.name,
      <span key={service.id} className=" capitalize">{service.plan}</span>,
      formattedDate(service.startDate),
      formattedDate(service.endDate),
      service.companyName,
      <Switch
        onClick={() => handleSwitch(service.id)}
        key={service.id}
        active={service.status || false}
      />,
      <LinkCP onClick={() => handleEditService(service)} key={service.id}>
        Editar
      </LinkCP>,
    ]);

    return filteredData;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (actionUrl === "create") {
      setOpenModal(true);
    }
  }, [actionUrl]);

  useEffect(() => {
    if (dataServices) {
      setServices({
        heads: headsTable,
        rows: rowsTable(dataServices),
      });
    }
  }, [dataServices, hasUpdate]);

  useEffect(() => {
    if (searchValue.trim() === "") {
      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: rowsTable(dataServices),
      };
      setServices(dataTable);
    } else {
      const filteredRows = dataServices.filter(
        (service) =>
          service.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          service.companyName?.toLowerCase().includes(searchValue.toLowerCase())
      );

      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: rowsTable(filteredRows),
      };
      setServices(dataTable);
    }
  }, [searchValue, dataServices]);

  const onSubmitForm = (serviceId?: string) => {
    if(serviceId){
      console.log(serviceId)
    } 
    setHasUpdate(true);
  }

  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Servicios" />
        </div>
        <div className="w-full h-[70vh] flex justify-center items-center">
          <span className="text-8xl">
            <Spinner />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer
        toastStyle={{ fontFamily: "inherit" }}
        progressClassName={"custom-progress-bar"}
      />
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <FormCreateService
          onClose={() => setOpenModal(false)}
          currentService={serviceForEdit}
          action={serviceForEdit ? "edit" : "create"}
          onSubmit={onSubmitForm}
        />
      </Modal>
      <div className="mb-5">
        <TitleSection title="Servicios" />
      </div>
      <div className="flex gap-3 items-center justify-between">
        <Button onClick={() => {
          setServiceForEdit(null)
          setOpenModal(true)
        }} mode="cp-green">
          <span className="mr-3">Nuevo servicio</span>
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <div className="flex gap-6 items-center">
          <LinkCP href="#">Exportar CSV</LinkCP>
          <Search onReset={() => setSearchValue("")} onChange={(e) => handleChange(e)} value={searchValue} />
        </div>
      </div>

      {loading ? (
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
