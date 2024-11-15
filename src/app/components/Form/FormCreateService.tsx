"use client";

import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Textarea from "@/app/utilities/ui/Textarea";
import Select from "@/app/utilities/ui/Select";
import Button from "@/app/utilities/ui/Button";
import type { Service } from "@/app/types";
import type { FormEvent, ChangeEvent } from "react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useCompaniesOptions } from "@/app/hooks/useCompaniesOptions";
import { updateService, createService } from "@/app/utilities/helpers/fetchers";

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
  startDate: "",
  endDate: "",
  plan: null,
  companyId: "",
  status: true,
};

interface FormCreateServiceProps {
  onSubmit?: (serviceId?: string) => void;
  onClose: () => void;
  currentService?: Service | null;
  action?: 'create' | 'edit';
}

export default function FormCreateService({ onClose, currentService, action, onSubmit }: FormCreateServiceProps) {
  const [service, setService] = useState<Service>(initialData);
  const {companiesOptions} = useCompaniesOptions()

  useEffect(() => {
    if(currentService){
      setService(currentService)
    }
  },[currentService])

  const handleSubmitEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás a punto de actualizar un nuevo servicio. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar servicio",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await updateService(service)

          if(res){
            onSubmit && onSubmit(service.id)
            Swal.fire({
              title: "Servicio actualizado",
              text: "El servicio ha sido actualizado exitosamente",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              onClose();
            });
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        console.log("Actualización de servicio cancelada");
      }
    });
  };

  const handleSubmitCreate = (e: FormEvent<HTMLFormElement>) => {
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
    }).then( async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await createService(service)

          if(res){
            onSubmit && onSubmit(service.id)

            Swal.fire({
              title: "Servicio creado",
              text: "El servicio ha sido creado exitosamente",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              onClose();
            });
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Creación de servicio cancelada");
      }
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setService({
      ...service,
      [e.target.name]: value,
    });
  };

  const handleChangeCompany = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setService({
      ...service,
      companyId: value
    });
  }

  return (
    <form
      onSubmit={(e) => action === 'edit' ? handleSubmitEdit(e) : handleSubmitCreate(e)}
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
          value={service.name}
        />
      </div>

      <div>
        <Label htmlFor="description" mode="cp-dark">
          Descripción
        </Label>
        <Textarea 
          id="description" 
          mode="cp-dark" 
          name="description" 
          value={service.description}
          onChange={(e) => handleChange(e)}
        />
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
            value={service.startDate || ''}
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
            value={service.endDate || ''}
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
            name="plan"
            value={(service.plan)?.toLocaleLowerCase() || ''}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="parentConpany" mode="cp-dark">
            Compañía *
          </Label>
          <Select
            mode="cp-dark"
            name="company"
            id="company"
            options={companiesOptions}
            defaultOptionText="Selecciona una opción"
            required
            value={service.companyId || ''}
            onChange={(e) => handleChangeCompany(e)}
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
            {action === 'edit' ? 'Actualizar servicio': 'Crear servicio'}
          </Button>
        </div>
      </div>
    </form>
  );
}
