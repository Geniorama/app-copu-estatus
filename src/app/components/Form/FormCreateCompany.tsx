"use client";

import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Select from "@/app/utilities/ui/Select";
import Button from "@/app/utilities/ui/Button";
import type { Company } from "@/app/types";
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

const initialData: Company = {
  name: "",
  address: "",
  logo: "",
  phone: "",
  superior: undefined,
  driveLink: "",
  whatsappLink: "",
  businessName: "",
  nit: undefined,
};

interface FormCreateCompanyProps {
  onClose: () => void;
}

export default function FormCreateCompany({ onClose }: FormCreateCompanyProps) {
  const [company, setCompany] = useState<Company>(initialData);
  const [parentCompanies] =
    useState<{ value: string; name: string }[]>(optionsSelect);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás a punto de crear una nueva compañía. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, crear compañía",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Company for send", company);

        
        Swal.fire({
          title: "Compañía creada",
          text: "La compañía ha sido creada exitosamente",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          onClose();
        });
      } else {
        console.log("Creación de compañía cancelada");
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
      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="companyName" mode="cp-dark">
            Nombre compañía *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="name"
            id="companyName"
            mode="cp-dark"
            required
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="companyAddress" mode="cp-dark">
            Dirección *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="address"
            id="companyAddress"
            mode="cp-dark"
            required
            type="text"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="companyPhone" mode="cp-dark">
            Teléfono *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="phone"
            placeholder="Ej: +573001234567"
            id="companyPhone"
            mode="cp-dark"
            required
            type="number"
          />
        </div>

        <div className="w-1/2">
          <Label htmlFor="linkWp" mode="cp-dark">
            Link grupo whatsapp
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="whatsappLink"
            id="linkWp"
            mode="cp-dark"
            type="text"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="nit" mode="cp-dark">
            NIT *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="nit"
            id="nit"
            mode="cp-dark"
            required
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="businessName" mode="cp-dark">
            Razón social *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="businessName"
            id="businessName"
            mode="cp-dark"
            required
            type="text"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="parentConpany" mode="cp-dark">
          Compañía superior
        </Label>
        <Select
          mode="cp-dark"
          name="superior"
          id="parentConpany"
          options={parentCompanies}
          defaultOptionText="Selecciona una opción"
        />
      </div>

      <div>
        <Label htmlFor="linkDrive" mode="cp-dark">
          Estadísticas anteriores {"(Drive link)"}
        </Label>
        <Input
          onChange={(e) => handleChange(e)}
          name="driveLink"
          id="linkDrive"
          mode="cp-dark"
          type="text"
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
            Crear compañía
          </Button>
        </div>
      </div>
    </form>
  );
}
