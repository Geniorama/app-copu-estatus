"use client";

import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Select from "@/app/utilities/ui/Select";
import Button from "@/app/utilities/ui/Button";
import type { User } from "@/app/types";
import type { FormEvent, ChangeEvent } from "react";
import { useState } from "react";
import Swal from "sweetalert2";

const optionsSelect = [
  {
    name: "Option 1",
    value: "option-1",
  },
  {
    name: "Option 2",
    value: "option-2",
  },
];

const initialData: User = {
  fname: "",
  lname: "",
  email: "",
  phone: "",
  role: "client",
  position: "",
  companies: [],
};

interface FormCreateCompanyProps {
  onClose: () => void;
}

export default function FormCreateUser({ onClose }: FormCreateCompanyProps) {
  const [user, setUser] = useState<User>(initialData);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás a punto de crear un nuevo usuario. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, crear usuario",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Company for send", user);

        Swal.fire({
          title: "Usuario creado",
          text: "El usuario ha sido creada exitosamente",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          onClose();
        });
      } else {
        console.log("Creación de usuario cancelada");
      }
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
            mode="cp-dark"
            name="role"
            id="role"
            options={optionsSelect}
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

      <div>
        <Label htmlFor="linkDrive" mode="cp-dark">
          Compañía(s) *
        </Label>
        <Select
          mode="cp-dark"
          options={optionsSelect}
          defaultOptionText="Selecciona una opción"
        />
      </div>

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
