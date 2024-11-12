"use client";

import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Textarea from "@/app/utilities/ui/Textarea";
import Select from "@/app/utilities/ui/Select";
import Button from "@/app/utilities/ui/Button";
import type { Service } from "@/app/types";
import type { FormEvent, ChangeEvent } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import { useCompaniesOptions } from "@/app/hooks/useCompaniesOptions";

const optionsPlan = [
  {
    name: "Anual",
    value: "anual",
  },
  {
    name: "Semestral",
    value: "semestral",
  },
  {
    name: "Mensual",
    value: "mensual",
  },
  {
    name: "Personalizado",
    value: "personalizado",
  },
];

const initialData: Service = {
  name: "",
  description: "",
  startDate: `${new Date()}`,
  endDate: `${new Date()}`,
  plan: null,
  company: null,
};

interface FormCreateServiceProps {
  onClose: () => void;
}

export default function FormCreateService({ onClose }: FormCreateServiceProps) {
  const [company, setCompany] = useState<Service>(initialData);
  const {companiesOptions} = useCompaniesOptions()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás a punto de crear un nuevo servicio. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, crear servicio",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("service for send", company);

        Swal.fire({
          title: "Servicio creado",
          text: "El servicio ha sido creado exitosamente",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          onClose();
        });
      } else {
        console.log("Creación de servicio cancelada");
      }
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompany({
      ...company,
      [e.target.name]: value,
    });
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="w-full flex flex-col gap-3 bg-slate-100 p-8 rounded-lg"
    >
      <div className="w-full">
        <Label htmlFor="name" mode="cp-dark">
          Nombre servicio *
        </Label>
        <Input
          onChange={(e) => handleChange(e)}
          name="name"
          id="name"
          mode="cp-dark"
          required
        />
      </div>

      <div>
        <Label htmlFor="description" mode="cp-dark">
          Descripción
        </Label>
        <Textarea id="description" mode="cp-dark" name="description" />
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="startDate" mode="cp-dark">
            Fecha inicio *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="startDate"
            placeholder="Ej: +573001234567"
            id="startDate"
            mode="cp-dark"
            required
            type="date"
          />
        </div>

        <div className="w-1/2">
          <Label htmlFor="endDate" mode="cp-dark">
            Fecha finalización *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="endDate"
            id="endDate"
            mode="cp-dark"
            type="date"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="nit" mode="cp-dark">
            Plan *
          </Label>
          <Select 
            mode="cp-dark" 
            options={optionsPlan} 
            required
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="parentConpany" mode="cp-dark">
            Compañía *
          </Label>
          <Select
            mode="cp-dark"
            name="superior"
            id="parentConpany"
            options={companiesOptions}
            defaultOptionText="Selecciona una opción"
            required
          />
        </div>
      </div>

      <div className="flex gap-3 items-center justify-end mt-3">
        <div>
          <Button onClick={onClose} type="button" mode="cp-dark">
            Cerrar
          </Button>
        </div>
        <div>
          <Button mode="cp-green" type="submit">
            Crear servicio
          </Button>
        </div>
      </div>
    </form>
  );
}
