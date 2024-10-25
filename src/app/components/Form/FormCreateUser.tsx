"use client";

import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Select from "@/app/utilities/ui/Select";
import Button from "@/app/utilities/ui/Button";
import type { Company, User } from "@/app/types";
import type { FormEvent, ChangeEvent } from "react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { randomBytes } from "crypto";

const initialData: User = {
  id: "",
  fname: "",
  lname: "",
  email: "",
  phone: "",
  role: "cliente",
  position: "",
  companies: null,
  status: true,
  linkWhatsApp: null,
  auth0Id: "",
};
interface FormCreateCompanyProps {
  onClose?: () => void;
  companies?: Company[];
}
interface OptionSelect {
  name: string;
  value: string;
}

export default function FormCreateUser({
  onClose,
  companies,
}: FormCreateCompanyProps) {
  const [user, setUser] = useState<User>(initialData);
  const [companiesOptions, setCompaniesOptions] = useState<
    OptionSelect[] | null
  >(null);

  useEffect(() => {
    if (user.auth0Id) {
      console.log(user);
    }
  }, [user.auth0Id]);

  const createUserInContentful = async (infoUser: User) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(infoUser),
      });
    } catch (error) {
      console.log("Error create user", error);
    }
  };

  const generatePassword = (length = 12) => {
    return randomBytes(length).toString("base64").slice(0, length);
  };

  if (companies) {
    const companiesForOptions: OptionSelect[] = companies.map((company) => ({
      name: company.name,
      value: company.id,
    }));

    setCompaniesOptions(companiesForOptions);
  }

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const password = generatePassword();

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás a punto de crear un nuevo usuario. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, crear usuario",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("/api/auth0-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...user, password }),
          });

          if (response.ok) {
            const auth0User = await response.json();
            if (auth0User) {
              const updatedUser = { ...user, auth0Id: auth0User.auth0Id }
              setUser(updatedUser);

              await createUserInContentful(updatedUser);

              Swal.fire({
                title: "Usuario creado",
                text: "El usuario ha sido creado exitosamente en Auth0.",
                icon: "success",
                confirmButtonText: "OK",
              }).then(() => {
                handleClose();
              });
            } else {
              console.log("No se encuentra el id");
            }
          } else {
            console.error(
              "Error al crear usuario en Auth0",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error al conectar con la API de Auth0", error);
        }
      } else {
        console.log("Creación de usuario cancelada");
      }
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setUser({
      ...user,
      [e.target.name]: value,
    });
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="w-full flex flex-col gap-3 bg-slate-100 p-8 rounded-lg"
    >
      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="fname" mode="cp-dark">
            Nombre(s) *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="fname"
            id="fname"
            mode="cp-dark"
            required
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="lname" mode="cp-dark">
            Apellido(s) *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="lname"
            id="lname"
            mode="cp-dark"
            required
            type="text"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="email" mode="cp-dark">
            Email *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="email"
            id="email"
            mode="cp-dark"
            required
            type="email"
          />
        </div>

        <div className="w-1/2">
          <Label htmlFor="phone" mode="cp-dark">
            Teléfono *
          </Label>
          <Input
            required
            onChange={(e) => handleChange(e)}
            name="phone"
            id="phone"
            mode="cp-dark"
            type="text"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="role" mode="cp-dark">
            Rol *
          </Label>
          <Select
            required
            onChange={(e) => handleChange(e)}
            defaultValue={initialData.role}
            mode="cp-dark"
            name="role"
            id="role"
            options={[
              { name: "Admin", value: "admin" },
              { name: "Cliente", value: "cliente" },
            ]}
            defaultOptionText="Selecciona una opción"
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="position" mode="cp-dark">
            Cargo *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="position"
            id="position"
            mode="cp-dark"
            type="text"
          />
        </div>
      </div>

      {user.role === "cliente" && (
        <div>
          <Label htmlFor="linkDrive" mode="cp-dark">
            Compañía(s) *
          </Label>
          <Select
            required={user.role === "cliente"}
            mode="cp-dark"
            disabled={!companies}
            options={companiesOptions || [{ name: "", value: "" }]}
            defaultOptionText="Selecciona una opción"
          />
        </div>
      )}

      <div className="flex gap-3 items-center justify-end mt-3">
        <div>
          <Button onClick={onClose} type="button" mode="cp-dark">
            Cerrar
          </Button>
        </div>
        <div>
          <Button mode="cp-green" type="submit">
            Crear usuario
          </Button>
        </div>
      </div>
    </form>
  );
}
