"use client";

import Button from "@/app/utilities/ui/Button";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import { useEffect, useState } from "react";
import LinkCP from "@/app/utilities/ui/LinkCP";
import type { TableDataProps } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { ChangeEvent } from "react";
import Modal from "@/app/components/Modal/Modal";
import FormCreateCompany from "@/app/components/Form/FormCreateCompany";

const initialData: TableDataProps = {
  heads: ["ID", "Empresa", "Contacto", "Servicios", "Última modificación"],
  rows: [
    ["1", "Sancho BBDO", "Juan Pérez", "Servicio BBDO 1, Servicio BBDO 2", "1"],
    [
      "2",
      "Company XYZ",
      "Jane Doe",
      "<a href='' class='underline text-cp-primary'>Servicio XYZ</a>",
      "3",
    ],
    ["3", "Sancho BBDO", "Juan Pérez", "Servicio BBDO 1, Servicio BBDO 2", "1"],
    [
      "4",
      "Company ABC",
      "Alice Smith",
      "<a href='' class='underline text-cp-primary'>Servicio ABC</a>",
      "2",
    ],
    [
      "2",
      "Company XYZ",
      "Jane Doe",
      "<a href='' class='underline text-cp-primary'>Servicio XYZ</a>",
      "3",
    ],
    ["3", "Sancho BBDO", "Juan Pérez", "Servicio BBDO 1, Servicio BBDO 2", "1"],
    [
      "4",
      "Company ABC",
      "Alice Smith",
      "<a href='' class='underline text-cp-primary'>Servicio ABC</a>",
      "2",
    ],
  ],
};

export default function Companies() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false)
  const [companies, setCompanies] = useState<TableDataProps | null>(
    initialData
  );

  // Filtrar filas basadas en el valor de búsqueda
  useEffect(() => {
    if (initialData && searchValue.trim()) {
      const filteredRows = initialData.rows.filter((row) =>
        row.some((cell: string) =>
          cell.toLowerCase().includes(searchValue.toLowerCase())
        )
      );

      setCompanies((prevData) =>
        filteredRows.length > 0
          ? {
              heads: prevData?.heads || initialData.heads,
              rows: filteredRows,
            }
          : null
      );
    } else {
      setCompanies(initialData);
    }
  }, [searchValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <Modal open={openModal}>
        <FormCreateCompany />
      </Modal>
      <div className="flex gap-3 items-center justify-between">
        <div>
          <Button onClick={() => setOpenModal(true)} mode="cp-green">
            <span className="mr-3">Nueva compañía</span>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
        <div className="flex gap-6 items-center">
          <LinkCP href="#">Exportar CSV</LinkCP>
          <div>
            <Search onChange={handleChange} value={searchValue} />
          </div>
        </div>
      </div>

      <div>
        {companies ? (
          <Table data={companies} />
        ) : (
          <div className=" text-center p-5 mt-10 flex justify-center items-center">
            <p className="text-slate-400">
              No hay datos disponibles <br /> o no hay coincidencias con la
              búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
