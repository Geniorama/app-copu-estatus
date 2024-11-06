"use client";

import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Button from "@/app/utilities/ui/Button";
import type { User } from "@/app/types";
import type { FormEvent, ChangeEvent } from "react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface FormCreateCompanyProps {
  onClose?: () => void;
  defaultData?: User | null;
}

export default function FormUpdateUser({
  onClose,
  defaultData,
}: FormCreateCompanyProps) {
  const [originalData, setOriginalData] = useState<User | null>(null);
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (defaultData) {
      setOriginalData(defaultData);
      setUser(defaultData);
    }
  }, [defaultData]);

  const hasChanges = () => {
    return JSON.stringify(user) !== JSON.stringify(originalData);
  };

  useEffect(() => {
    setIsChanged(hasChanges());
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    }).then(async (result) => {
      if (result.isConfirmed && user) {
        try {
          const response = await fetch(`/api/users`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          });

          if (!response.ok) {
            throw new Error("Error al actualizar el usuario");
          }

          const updatedUser = await response.json();
          console.log(updatedUser)
          Swal.fire({
            title: "Usuario actualizado",
            text: "La información se ha actualizado exitosamente",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            if (onClose) {
              onClose();
            }
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar la información del usuario",
            icon: "error",
          });
          console.error("Error al actualizar el usuario:", error);
        }
      } else {
        console.log("Actualización de usuario cancelada");
      }
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-3 rounded-lg"
    >
      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="fname">Nombre(s) *</Label>
          <Input
            onChange={handleChange}
            name="fname"
            id="fname"
            required
            value={user?.fname || ""}
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="lname">Apellido(s) *</Label>
          <Input
            onChange={handleChange}
            name="lname"
            id="lname"
            required
            type="text"
            value={user?.lname || ""}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="email">Email *</Label>
          <Input
            readOnly
            disabled
            name="email"
            id="email"
            required
            type="email"
            value={user?.email || ""}
          />
        </div>

        <div className="w-1/2">
          <Label htmlFor="phone">Teléfono *</Label>
          <Input
            onChange={handleChange}
            name="phone"
            id="phone"
            type="text"
            value={user?.phone || ""}
          />
        </div>
      </div>

      <div className="flex gap-3 items-center justify-end mt-3">
        <div>
          <Button disabled={!isChanged} mode="cp-green" type="submit">
            Actualizar
          </Button>
        </div>
      </div>
    </form>
  );
}
