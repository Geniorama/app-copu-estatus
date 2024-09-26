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
import Label from "@/app/utilities/ui/Label";
import Select from "@/app/utilities/ui/Select";
import Input from "@/app/utilities/ui/Input";

const initialData: TableDataProps = {
  heads: ["ID", "Tipo acción", "Titular", "Fecha Publicación", "Url Web", "Url IG", "Url FB", "Url LK", ""],
  rows: [
    ["1", "Post en social media", "Titular del post", "1 feb 2024", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>", "Sin enlace", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Editar</a>"],
    ["2", "Post en social media", "Titular del post", "1 feb 2024", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>", "Sin enlace", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Editar</a>"],
    ["3", "Post en social media", "Titular del post", "1 feb 2024", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>", "Sin enlace", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Editar</a>"],
    ["4", "Post en social media", "Titular del post", "1 feb 2024", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Link</a>", "Sin enlace", "<a href='#' class='underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap'>Editar</a>"],
    // Otras filas...
  ],
};

const companiesData = [
  {
    value: 'company1',
    name: 'Company 1',
  },
  {
    value: 'company2',
    name: 'Company 2',
  },
  {
    value: 'company3',
    name: 'Company 3',
  },
  {
    value: 'company4',
    name: 'Company 4',
  },
  {
    value: 'company5',
    name: 'Company 5',
  },
];

export default function Contents() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [services, setSevices] = useState<TableDataProps | null>(initialData);

  useEffect(() => {
    if (initialData && searchValue.trim()) {
      const filteredRows = initialData.rows.filter((row) =>
        row.some((cell: string) =>
          cell.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      setSevices(filteredRows.length > 0 ? { heads: initialData.heads, rows: filteredRows } : null);
    } else {
      setSevices(initialData);
    }
  }, [searchValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <FormCreateService onClose={() => setOpenModal(false)} />
      </Modal>
      <div className="mb-5">
        <TitleSection title="Contenidos" />
      </div>
      <div className="flex justify-between mb-8 mt-16 items-center">
        <span>Total Contenidos</span>
        <form action="" className="flex items-center gap-4">
          <div>
            <Label mode="cp-light" htmlFor="compny">Empresa</Label>
            <Select
              id="company"
              options={companiesData}
              defaultOptionText="Empresa"
              name="company"
              mode="cp-light" />
          </div>
          <div>
            <Label mode="cp-light" htmlFor="startDate">Fecha Inicio</Label>
            <Input
              type="date"
              mode="cp-light"
              id="startDate"
              name="startDate"
              placeholder="Fecha inicio"
            />
          </div>
          <div>
            <Label mode="cp-light" htmlFor="endDate">Fecha Fin</Label>
            <Input
              type="date"
              mode="cp-light"
              id="endDate"
              name="endDate"
              placeholder="Fecha fin"
            />
          </div>
        </form>
      </div>
      <div className="flex gap-4 mb-8">
        <div className="w-full max-w-xs cursor-pointer text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 hover:outline hover:outline-offset-1 text-center hover:bg-cp-primary hover:text-cp-dark transition">
          <h3 className="text-xl font-bold">Post en social media</h3>
          <span className="text-8xl">190</span>
        </div>
        <div className="w-full max-w-xs cursor-pointer text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 hover:outline hover:outline-offset-1 text-center hover:bg-cp-primary hover:text-cp-dark transition">
          <h3 className="text-xl font-bold">Artículo web</h3>
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
