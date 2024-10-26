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
import type { Company, TableDataProps, User } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import type { Entry } from "contentful";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import type { MouseEvent } from "react";
import Spinner from "@/app/utilities/ui/Spinner";
import { usePathname } from "next/navigation";

export default function Users() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [tableData, setTableData] = useState<TableDataProps | null>(null);
  const [originalData, setOriginalData] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [userCreated, setUserCreated] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useSelector((state: RootState) => state.user);
  const currentUserId = currentUser?.user.sub;
  const pathname = usePathname()

  const headsTable = [
    "Correo",
    "Nombres(s)",
    "Apellido(s)",
    "Rol",
    "Estado",
    "Acciones",
  ];

  const handleEdit = (userId?: string) => {
    if (!userId) {
      return;
    }

    const userInfo = originalData.find((user) => user.auth0Id === userId);
    setOpenModal(true);
    console.log(userInfo);
  };

  const handleClick = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    userId?: string
  ) => {
    e.preventDefault();
    handleEdit(userId);
  };

  const editButton = (userId?: string) => {
    return (
      <a
        href="#"
        className="cursor-pointer text-cp-primary hover:underline"
        onClick={(e) => handleClick(e, userId)}
      >
        Editar
      </a>
    );
  };

  const getAllUsers = async () => {
    try {
      const fetchUsers = await fetch("/api/users");
      if (fetchUsers.ok) {
        const res = await fetchUsers.json();
        const transformData: User[] = res.map((user: Entry) => ({
          id: user.sys.id,
          fname:
            (user.fields.firstName as { "en-US": string })?.["en-US"] || null,
          lname:
            (user.fields.lastName as { "en-US": string })?.["en-US"] || null,
          email: (user.fields.email as { "en-US": string })?.["en-US"] || null,
          role: (user.fields.role as { "en-US": string })?.["en-US"] || null,
          phone: (user.fields.phone as { "en-US": string })?.["en-US"] || null,
          imageProfile:
            (user.fields.imageProfile as { "en-US": string })?.["en-US"] ||
            null,
          status:
            (user.fields.status as { "en-US": string })?.["en-US"] || null,
          auth0Id:
            (user.fields.auth0Id as { "en-US": string })?.["en-US"] || null,
        }));

        const filteredData = transformData.filter(
          (user) => user.auth0Id !== currentUserId
        );

        const dataTable: TableDataProps = {
          heads: headsTable,
          rows: filteredData.map((user: User) => [
            user.email,
            user.fname,
            user.lname,
            user.role,
            user.status ? "Activo" : "Inactivo",
            editButton(user.auth0Id),
          ]),
        };

        setTableData(dataTable);
        setOriginalData(filteredData);
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCompanies = async () => {
    try {
      const res = await fetch("/api/companies");
      if (res.ok) {
        const data = await res.json();
        console.log("companies", data);
      }
    } catch (error) {
      console.log("Error data companies", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [pathname]);

  useEffect(() => {
    if (searchValue.trim() === "") {
      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: originalData.map((user: User) => [
          user.email,
          user.fname,
          user.lname,
          user.role,
          user.status ? "Activo" : "Inactivo",
          editButton(user.auth0Id),
        ]),
      };
      setTableData(dataTable);
    } else {
      const filteredRows = originalData.filter(
        (user) =>
          user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.fname.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.lname.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchValue.toLowerCase()) ||
          (user.status ? "Activo" : "Inactivo")
            .toLowerCase()
            .includes(searchValue.toLowerCase())
      );

      const dataTable: TableDataProps = {
        heads: ["Correo", "Nombres(s)", "Apellido(s)", "Rol", "Estado"],
        rows: filteredRows.map((user: User) => [
          user.email,
          user.fname,
          user.lname,
          user.role,
          user.status ? "Activo" : "Inactivo",
        ]),
      };
      setTableData(dataTable);
    }
  }, [searchValue, originalData]);

  useEffect(() => {
    setLoading(true)
    getAllUsers();
  }, [userCreated]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleCreateUser = (user: User) => {
    setUserCreated(user);
    console.log("user created", user);
  };

  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Usuarios" />
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
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <FormCreateUser
          onSubmit={handleCreateUser}
          onClose={() => setOpenModal(false)}
          companies={companies}
        />
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

      {tableData && tableData.rows.length > 0 ? (
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
