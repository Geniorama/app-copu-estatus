"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/app/utilities/ui/Button";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import LinkCP from "@/app/utilities/ui/LinkCP";
import Modal from "@/app/components/Modal/Modal";
import FormCreateCompany from "@/app/components/Form/FormCreateCompany";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { TableDataProps } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import { useFetchCompanies } from "@/app/hooks/useFetchCompanies";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import BoxLogo from "@/app/utilities/ui/BoxLogo";
import ListServices from "@/app/utilities/ui/ListServices";
import type { Company } from "@/app/types";
import Spinner from "@/app/utilities/ui/Spinner";
import Switch from "@/app/utilities/ui/Switch";
import type { MouseEvent } from "react";
import { updateCompany } from "@/app/utilities/helpers/fetchers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useExportCSV from "@/app/hooks/useExportCSV";

export default function Companies() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);
  const [tableData, setTableData] = useState<TableDataProps | null>(null);
  const [editCompany, setEditCompany] = useState<Company | null>(null)
  const [success, setSuccess] = useState(false)
  const notify = (message: string) => toast(message);

  const headsTable = [
    "Logo",
    "Nombre empresa",
    "Grupo Whatsapp",
    "Servicios activos",
    "Última modificación",
    "Estado",
    "Acciones",
  ];

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
  }, [success]);

  const { originalData, loading } = useFetchCompanies(
    userData,
    fetchServicesByCompany,
    true
  );

  useEffect(() => {
    if (!loading) {
      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: rowsTable(originalData)
      };
      
      setTableData(originalData.length > 0 ? dataTable : null);
    }
  }, [loading, originalData]);

  useEffect(() => {
    const filteredData = originalData.filter((company) =>
      company?.name?.toLowerCase().includes(searchValue.toLowerCase())
    );

    const dataTable: TableDataProps = {
      heads: headsTable,
      rows: rowsTable(filteredData)
    };

    setTableData(filteredData.length > 0 ? dataTable : null);
  }, [searchValue, originalData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const exportToCSV = useExportCSV(originalData, ["name", "linkWhatsApp", "nit", "phone", "status"], `companies-${new Date().toISOString()}`)

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleEditCompany = (e:MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, companyId?:string) => {
    e.preventDefault()
    
    if(companyId){
      const filterCompany = originalData.find((company) => company.id === companyId)
      if(filterCompany){
        setEditCompany(filterCompany)
        setOpenModal(true)
      }
    }
  }

  const handleSwitch = async (companyId?: string) => {
    if (companyId) {
      const filterCompany = originalData.find((company) => company.id === companyId);
      console.log(filterCompany)
      if (filterCompany) {
        const updatedCompany = {
          id: filterCompany.id,
          status: !filterCompany.status,
        };
        console.log(updatedCompany)
        const response = await updateCompany(updatedCompany);
        console.log(response)
        notify("Compañía actualizada");
      }
    }
  };

  const rowsTable = (data: Company[]) => {
    const filteredData = data.map((company: Company) => [
      <BoxLogo key={company.id} url={company.logo || ""} />,
      company.name,
      company.linkWhatsApp ? (
        <LinkCP
          rel="noopener noreferrer"
          target="_blank"
          href={company.linkWhatsApp}
        >
          {company.linkWhatsApp}
        </LinkCP>
      ) : (
        <span className="text-slate-400">No existe link del grupo</span>
      ),
      <ListServices key={company.id} services={company.services} />,
      company.updatedAt,
      <Switch onClick={() => handleSwitch(company.id)} key={company.id} active={company.status || false} />,
      <LinkCP onClick={(e) => handleEditCompany(e, company.id)} key={company.id}>
        Editar
      </LinkCP>
    ]);

    return filteredData
  };

  const handleCreateCompany = (idCompany: string) => {
    console.log("New company id", idCompany);
    if(idCompany){
      setSuccess(true)
    }
  };
  
  const onSubmitEditCompany = (idCompany: string) => {
    console.log("New company id", idCompany);
    if(idCompany){
      setSuccess(true)
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setEditCompany(null)
  }

  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Compañías" />
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
      <Modal open={openModal} onClose={handleCloseModal}>
        <FormCreateCompany
          onClose={() => setOpenModal(false)}
          onSubmit={editCompany ? onSubmitEditCompany : handleCreateCompany}
          currentCompany={editCompany}
          action={editCompany ? 'edit': 'create'}
        />
      </Modal>

      <div className="mb-5">
        <TitleSection title="Compañías" />
      </div>
      <div className="flex gap-3 items-center justify-between">
        <Button onClick={() => { setEditCompany(null); setOpenModal(true);}} mode="cp-green">
          <span className="mr-3">Nueva compañía</span>
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <div className="flex gap-6 items-center">
          <LinkCP onClick={exportToCSV} href="#">Exportar CSV</LinkCP>
          <Search
            onReset={handleClearSearch}
            onChange={handleChange}
            value={searchValue}
          />
        </div>
      </div>

      {tableData ? (
        <Table data={tableData} />
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
