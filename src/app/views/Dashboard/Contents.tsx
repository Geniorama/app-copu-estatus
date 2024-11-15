"use client";

import { useState, useEffect } from "react";
import Button from "@/app/utilities/ui/Button";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import LinkCP from "@/app/utilities/ui/LinkCP";
import Modal from "@/app/components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { TableDataProps } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import FilterContentBar from "../FilterContentBar";
import FormCreateContent from "@/app/components/Form/FormCreateContent";

const initialData: TableDataProps = {
  heads: [
    "ID",
    "Tipo acción",
    "Titular",
    "Fecha Publicación",
    "Url Web",
    "Url IG",
    "Url FB",
    "Url LK",
    "",
  ],
  rows: [
    [
      "1",
      "Post en social media",
      "Titular del post",
      "1 feb 2024",
      <a href='#' key={'link_1'} className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>,
      <a href='#' key={'link_2'} className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>,
      <a href='#' key={'link_3'} className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>,
      "Sin enlace",
      <a href='#' key="editar" className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Editar</a>,
    ],
    [
      "2",
      "Post en social media",
      "Titular del post",
      "1 feb 2024",
      <a href='#' key={'link_1'} className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>,
      <a href='#' key={'link_2'} className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>,
      <a href='#' key={'link_3'} className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>,
      "Sin enlace",
      <a href='#' key="editar" className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Editar</a>,
    ],
    [
      "3",
      "Post en social media",
      "Titular del post",
      "1 feb 2024",
      <a href='#' key={'link_1'} className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>,
      <a href='#' key={'link_2'} className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>,
      <a href='#' key={'link_3'} className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>,
      "Sin enlace",
      <a href='#' key="editar" className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Editar</a>,
    ],
    [
      "4",
      "Post en social media",
      "Titular del post",
      "1 feb 2024",
      <a
        key={"link"}
        target="_blank"
        href="https://facebook.com"
        className="underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap"
      >
        Link
      </a>,
      <a href='#' key={'link_2'} className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>,
      <a href='#' key={'link_3'} className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>,
      "Sin enlace",
      <a href='#' key="editar" className='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Editar</a>,
    ],
    // Otras filas...
  ],
};

const companiesData = [
  {
    value: "company1",
    name: "Company 1",
  },
  {
    value: "company2",
    name: "Company 2",
  },
  {
    value: "company3",
    name: "Company 3",
  },
  {
    value: "company4",
    name: "Company 4",
  },
  {
    value: "company5",
    name: "Company 5",
  },
];

export default function Contents() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [services, setSevices] = useState<TableDataProps | null>(initialData);

  useEffect(() => {
    if (initialData && searchValue.trim()) {
      const filteredRows = initialData.rows.filter((row) =>
        row.some(
          (cell) =>
            typeof cell === "string" &&
            cell.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      setSevices(
        filteredRows.length > 0
          ? { heads: initialData.heads, rows: filteredRows }
          : null
      );
    } else {
      setSevices(initialData);
    }
  }, [searchValue, initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <FormCreateContent />
      </Modal>
      <div className="mb-5">
        <TitleSection title="Contenidos" />
      </div>
      <FilterContentBar 
        companies={companiesData}
        onFilter={(data) => console.log(data)}
      />
      <div className="flex gap-4 mb-8 justify-center">
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 hover:outline hover:outline-offset-1 text-center">
          <h3 className="text-xl font-bold">Post en social media</h3>
          <span className="text-8xl">190</span>
        </div>
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 hover:outline hover:outline-offset-1 text-center">
          <h3 className="text-xl font-bold">Artículos web</h3>
          <span className="text-8xl">190</span>
        </div>
      </div>
      
      <div className="flex gap-3 items-center justify-between">
        <Button onClick={() => setOpenModal(true)} mode="cp-green">
          <span className="mr-3">Nuevo contenido</span>
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <div className="flex gap-6 items-center">
          <LinkCP href="#">Exportar CSV</LinkCP>
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
