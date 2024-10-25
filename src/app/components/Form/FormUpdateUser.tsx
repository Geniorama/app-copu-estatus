"use client";

import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Button from "@/app/utilities/ui/Button";
import type { User } from "@/app/types";
import type { FormEvent, ChangeEvent } from "react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const initialData: User = {
  id: "",
  fname: "",
  lname: "",
  email: "",
  phone: "",
  role: "client",
};

interface FormCreateCompanyProps {
  onClose?: () => void;
  defaultData?: User | null;
}

export default function FormUpdateUser({ onClose, defaultData }: FormCreateCompanyProps) {
  const [user, setUser] = useState<User>(initialData);

  useEffect(() => {
    if(defaultData){
        setUser(defaultData)
    }
  },[defaultData])
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás a punto de cambiar tu información de usuario. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar usuario",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Company for send", user);

        Swal.fire({
          title: "Usuario creado",
          text: "La información se ha actualizado exitosamente",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
         if(onClose){
            onClose();
         }
        });
      } else {
        console.log("Actualización de usuario cancelada");
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
      className="w-full flex flex-col gap-3 rounded-lg"
    >
      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="fname">
            Nombre(s) *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="fname"
            id="fname"
            required
            value={user.fname}
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="lname">
            Apellido(s) *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="lname"
            id="lname"
            required
            type="text"
            value={user.lname}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="email">
            Email *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="email"
            id="email"
            required
            type="email"
            value={user.email}
          />
        </div>

        <div className="w-1/2">
          <Label htmlFor="phone">
            Teléfono *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="phone"
            id="phone"
            type="text"
            value={user.phone}
          />
        </div>
      </div>

      <div className="flex gap-3 items-center justify-end mt-3">
        <div>
          <Button mode="cp-green" type="submit">
            Guardar
          </Button>
        </div>
      </div>
    </form>
  );
}
