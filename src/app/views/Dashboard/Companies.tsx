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

export default function Companies() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);
  const [tableData, setTableData] = useState<TableDataProps | null>(null);
  const [companiesForm, setCompaniesForm] = useState<Company[] | null>(null);

  const headsTable = [
    "Logo",
    "Nombre empresa",
    "Grupo Whatsapp",
    "Servicios activos",
    "Última modificación",
    "Estado",
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
  }, []);

  const { originalData, loading } = useFetchCompanies(
    userData,
    fetchServicesByCompany,
    true
  );

  useEffect(() => {
    if (!loading) {
      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: originalData.map((company: Company) => [
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
          <ListServices key={company.id} services={company.services || null} />,
          company.updatedAt,
          <Switch key={company.id} active={true} />,
        ]),
      };
      setCompaniesForm(originalData);

      // Set table data or null if no companies found
      setTableData(originalData.length > 0 ? dataTable : null);
    }
  }, [loading, originalData]);

  useEffect(() => {
    const filteredData = originalData.filter((company) =>
      company?.name?.toLowerCase().includes(searchValue.toLowerCase())
    );

    const dataTable: TableDataProps = {
      heads: headsTable,
      rows: filteredData.map((company: Company) => [
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
        <Switch key={company.id} active={true} />,
      ]),
    };

    setTableData(filteredData.length > 0 ? dataTable : null);
  }, [searchValue, originalData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

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

  const handleCreateCompany = (idCompany: string) => {
    console.log('New company id', idCompany)
  }

  return (
    <div>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <FormCreateCompany
          companies={companiesForm}
          onClose={() => setOpenModal(false)}
          onSubmit={handleCreateCompany}
        />
      </Modal>

      <div className="mb-5">
        <TitleSection title="Compañías" />
      </div>
      <div className="flex gap-3 items-center justify-between">
        <Button onClick={() => setOpenModal(true)} mode="cp-green">
          <span className="mr-3">Nueva compañía</span>
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <div className="flex gap-6 items-center">
          <LinkCP href="#">Exportar CSV</LinkCP>
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
