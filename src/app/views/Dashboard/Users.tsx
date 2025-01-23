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
import type { TableDataProps, User } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import type { Entry } from "contentful";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import type { MouseEvent } from "react";
import Spinner from "@/app/utilities/ui/Spinner";
import { usePathname, useSearchParams } from "next/navigation";
import Switch from "@/app/utilities/ui/Switch";
import BoxLogo from "@/app/utilities/ui/BoxLogo";
import {
  getAllUsers,
  updatedUserInContentful,
} from "@/app/utilities/helpers/fetchers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useExportCSV from "@/app/hooks/useExportCSV";
import Swal from "sweetalert2";

export default function Users() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [tableData, setTableData] = useState<TableDataProps | null>(null);
  const [originalData, setOriginalData] = useState<User[]>([]);
  const [userCreated, setUserCreated] = useState<User | null>(null);
  const [userEdited, setUserEdited] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const notify = (message: string) => toast(message);
  const searchParams = useSearchParams();
  const actionUrl = searchParams.get("action");

  const { currentUser } = useSelector((state: RootState) => state.user);
  const currentUserId = currentUser?.user.sub;
  const pathname = usePathname();

  const headsTable = [
    "", //Foto perfil
    "Correo",
    "Nombres(s)",
    "Apellido(s)",
    "Rol",
    "Estado",
    "Acciones",
  ];

  const exportToCSV = useExportCSV(
    originalData as Record<string, string | number>[],
    ["email", "fname", "lname", "role", "status"],
    `usuarios-${new Date().toISOString()}`
  );

  const fetchUsers = async () => {
    const res = await getAllUsers();

    if (res) {
      const transformData: User[] = res.map((user: Entry) => {
        return {
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
          companiesId:
            (user.fields.company as { "en-US": Entry[] })?.["en-US"].map(
              (company) => company.sys.id
            ) || null,
          position:
            (user.fields.position as { "en-US": string })?.["en-US"] || null,
        };
      });

      const filteredData = transformData.filter(
        (user) => user.auth0Id !== currentUserId
      );

      console.log(filteredData);
      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: rowsTable(filteredData),
      };

      setTableData(dataTable);
      setOriginalData(filteredData);
      setLoading(false);
    }
  };

  const sentEmailUserCreated = async (email: string, url: string) => {
    if (!email || email.trim() === "" || !url || url.trim() === "") {
      console.log("Faltan datos obligatorios");
      return;
    }

    try {
      const response = await fetch("/api/sendEmailTemplate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          templateId: 2,
          dynamicData: {
            email: email,
            reset_password_link: url,
          },
        }),
      });

      if (!response.ok) {
        console.error("Error al enviar correo de creación de usuario");
        return;
      }

      const data = await response.json();
      console.log("Correo enviado", data);
    } catch (error) {
      console.error(
        "Error al procesar la solicitud de envío de correo:",
        error
      );
    }
  };

  const sentEmailUserDeleted = async (email: string) => {
    if (!email || email.trim() === "") {
      console.log("Faltan datos obligatorios");
      return;
    }

    try {
      const response = await fetch("/api/sendEmailTemplate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          templateId: 3,
          dynamicData: {
            email: email,
          },
        }),
      });

      if (!response.ok) {
        console.error("Error al enviar correo de eliminación de usuario");
        return;
      }

      const data = await response.json();
      console.log("Correo enviado", data);
    } catch (error) {
      console.error(
        "Error al procesar la solicitud de envío de correo:",
        error
      );
    }
  };

  const handleReset = async (email: string) => {
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const { url } = await response.json();
        console.log(`Enlace enviado correctamente: ${url}`);
        if (url) {
          sentEmailUserCreated(email, url);
          return;
        }
      } else {
        const errorData = await response.json();
        console.log(errorData.error || "Error al enviar el enlace.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (userId?: string) => {
    if (!userId) {
      return;
    }

    const userInfo = originalData.find((user) => user.auth0Id === userId);
    setOpenModal(true);
    if (userInfo?.auth0Id) {
      setEditUser(userInfo);
    }
  };

  const handleSwitch = async (userId?: string) => {
    if (userId) {
      const filterUser = originalData.find((user) => user.auth0Id === userId);
      if (filterUser) {
        const updatedUser = {
          ...filterUser,
          status: !filterUser.status,
        };
        await updatedUserInContentful(updatedUser);
        notify("Usuario actualizado");
      }
    }
  };

  const handleClick = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    userId?: string
  ) => {
    e.preventDefault();
    handleEdit(userId);
  };

  const handleDeleteUser = async (auth0Id: string, email: string) => {
    if (!auth0Id || !email) {
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/deleteUser?auth0Id=${auth0Id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const data = await response.json();
          sentEmailUserDeleted(email);
          console.log(data.message);
          fetchUsers();
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Usuario eliminado exitosamente",
          });
          // Actualiza la lista de usuarios después de eliminar
          // fetchUsers();
        } else {
          const errorData = await response.json();
          console.log(errorData.error || "Error al eliminar el usuario.");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorData.error || "Error al eliminar el usuario.",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al procesar la solicitud.",
        });
      }
    }
  };

  const rowsTable = (data: User[]) => {
    const filteredData = data.map((user: User) => [
      <BoxLogo
        alt={`${user.fname} ${user.lname}`}
        type="user"
        key={user.email}
        url={user.imageProfile || ""}
      />,
      user.email,
      user.fname,
      user.lname,
      user.role,
      <Switch
        onClick={() => handleSwitch(user.auth0Id)}
        active={user.status || false}
        key={user.id}
      />,
      <div key={user.id} className="flex gap-5">
        <LinkCP onClick={(e) => handleClick(e, user.auth0Id)}>Editar</LinkCP>

        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDeleteUser(`${user.auth0Id}`, `${user.email}`)}
        >
          Borrar
        </button>
      </div>,
    ]);

    return filteredData;
  };

  useEffect(() => {
    if (actionUrl === "create") {
      setOpenModal(true);
    }
  }, [actionUrl]);

  useEffect(() => {
    fetchUsers();

    if (userCreated && userCreated.email) {
      handleReset(userCreated.email);
    }
  }, [pathname, userCreated, userEdited]);

  useEffect(() => {
    if (searchValue.trim() === "") {
      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: rowsTable(originalData),
      };
      setTableData(dataTable);
    } else {
      const filteredRows = originalData.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.fname?.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.lname?.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchValue.toLowerCase())
      );

      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: rowsTable(filteredRows),
      };
      setTableData(dataTable);
    }
  }, [searchValue, originalData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleCreateUser = (user: User) => {
    setUserCreated(user);
  };

  const handleEditedUser = (user: User) => {
    setUserEdited(user);
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

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditUser(null);
  };

  return (
    <div>
      <ToastContainer
        toastStyle={{ fontFamily: "inherit" }}
        progressClassName={"custom-progress-bar"}
      />
      <Modal open={openModal} onClose={handleCloseModal}>
        <FormCreateUser
          onSubmit={editUser ? handleEditedUser : handleCreateUser}
          onClose={() => setOpenModal(false)}
          currentUser={editUser}
          action={editUser ? "edit" : "create"}
        />
      </Modal>
      <div className="mb-5">
        <TitleSection title="Usuarios" />
      </div>
      <div className="flex gap-3 items-center justify-between">
        <Button
          onClick={() => {
            setEditUser(null);
            setOpenModal(true);
          }}
          mode="cp-green"
        >
          <span className="mr-3">Nuevo usuario</span>
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <div className="flex gap-6 items-center">
          <LinkCP
            href="#"
            onClick={(e) => {
              e.preventDefault();
              exportToCSV();
            }}
          >
            Exportar CSV
          </LinkCP>
          <Search
            onReset={() => setSearchValue("")}
            onChange={handleChange}
            value={searchValue}
          />
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
