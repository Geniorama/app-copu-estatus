"use client";

import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Button from "@/app/utilities/ui/Button";
import type { User } from "@/app/types";
import type { FormEvent, ChangeEvent } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import TitleSection from "@/app/utilities/ui/TitleSection";

const initialData: User = {
  fname: "",
  lname: "",
  email: "",
  phone: "",
  role: "client",
  position: "",
  companies: [],
};

export default function Profile() {
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
    <>
      <div className="mb-5">
        <TitleSection title="Mi perfil" />
      </div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-9/12 m-auto flex flex-col flex-wrap gap-3 p-8 rounded-lg"
      >
        <div className="flex gap-3">
          <div className="w-40 h-40 rounded-full m-auto bg-slate-700 flex items-center justify-center">
            <Label mode="cp-light">Subir foto</Label>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-1/2">
            <Label htmlFor="fname" mode="cp-light">
              Nombre(s) *
            </Label>
            <Input
              onChange={(e) => handleChange(e)}
              name="fname"
              id="fname"
              mode="cp-light"
              required
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="lname" mode="cp-light">
              Apellido(s) *
            </Label>
            <Input
              onChange={(e) => handleChange(e)}
              name="lname"
              id="lname"
              mode="cp-light"
              required
              type="text"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-1/2">
            <Label htmlFor="email" mode="cp-light">
              Email *
            </Label>
            <Input
              onChange={(e) => handleChange(e)}
              name="email"
              id="email"
              mode="cp-light"
              required
              type="email"
            />
          </div>

          <div className="w-1/2">
            <Label htmlFor="phone" mode="cp-light">
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

        <div className="w-full flex gap-3">
          <div className="w-full">
            <Label htmlFor="whatsapp" mode="cp-light">
              Link whatsApp
            </Label>
            <Input
              onChange={(e) => handleChange(e)}
              name="whatsapp"
              id="whatsapp"
              mode="cp-light"
              type="url"
            />
          </div>
        </div>

        <div className="flex gap-3 items-center justify-end mt-3">
          <div>
            <Button mode="cp-green" type="submit">
              Crear usuario
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
