"use client";

import { useState, useEffect } from "react";
import Button from "@/app/utilities/ui/Button";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import LinkCP from "@/app/utilities/ui/LinkCP";
import Modal from "@/app/components/Modal/Modal";
import FormCreateUser from "@/app/components/Form/FormCreateUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { TableDataProps } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";

const initialData: TableDataProps = {
  heads: ["ID", "Empresa", "Contacto", "Servicios", "Última modificación"],
  rows: [
    ["1", "Sancho BBDO", "Juan Pérez", "Servicio BBDO 1, Servicio BBDO 2", "1"],
    ["2", "Company XYZ", "Jane Doe", "<a href='' class='underline text-cp-primary'>Servicio XYZ</a>", "3"],
    // Otras filas...
  ],
};

export default function Users() {
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
        <FormCreateUser onClose={() => setOpenModal(false)} />
      </Modal>
      <div className="mb-5">
        <TitleSection title="Usuarios" />
      </div>
      <div className="flex gap-3 items-center justify-between">
        <Button onClick={() => setOpenModal(true)} mode="cp-green">
          <span className="mr-3">Nuevo usuario</span>
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
