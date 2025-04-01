"use client";

import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Textarea from "@/app/utilities/ui/Textarea";
import Select from "@/app/utilities/ui/Select";
import Button from "@/app/utilities/ui/Button";
import type { Service, FeatureService } from "@/app/types";
import type { FormEvent, ChangeEvent } from "react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useCompaniesOptions } from "@/app/hooks/useCompaniesOptions";
import { updateService, createService } from "@/app/utilities/helpers/fetchers";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  accionPostRss: 0,
  accionWebYRss: 0,
  startDate: "",
  endDate: "",
  plan: "mensual",
  companyId: "",
  status: true,
  features: [],
  
};

interface FormCreateServiceProps {
  onSubmit?: (serviceId?: string) => void;
  onClose: () => void;
  currentService?: Service | null;
  action?: "create" | "edit";
}

export default function FormCreateService({
  onClose,
  currentService,
  action,
  onSubmit,
}: FormCreateServiceProps) {
  const [service, setService] = useState<Service>(initialData);
  const { companiesOptions } = useCompaniesOptions();
  const [newFeature, setNewFeature] = useState<FeatureService>({
    title: "",
    quantity: 0,
  });

  useEffect(() => {
    if (currentService) {
      setService(currentService);
    }
  }, [currentService]);

  const handleAddFeature = (data: FeatureService) => {
    if (!data || !data.title) {
      console.log("No se ha ingresado información de la característica");
      return;
    }
    setService((prev) => ({
      ...prev,
      features: [...prev.features, data],
    }));
  };

  const handleDeleteFeature = (index: number) => {
    const newListFeatures = service.features.filter((_, i) => i !== index);
    setService((prev) => ({
      ...prev,
      features: newListFeatures,
    }));
  };

  const handleChangesFeature = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewFeature({
      ...newFeature,
      [e.target.name]: value,
    });
  };

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
          const res = await updateService(service);

          if (res) {
            onSubmit && onSubmit(service.id);
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
          console.log(error);
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await createService(service);

          if (res) {
            onSubmit && onSubmit(service.id);

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

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) => {
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
      companyId: value,
    });
  };

  return (
    <form
      onSubmit={(e) =>
        action === "edit" ? handleSubmitEdit(e) : handleSubmitCreate(e)
      }
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
          Tipo de plan
        </Label>
        <Textarea
          id="description"
          mode="cp-dark"
          name="description"
          value={service.description}
          onChange={(e) => handleChange(e)}
        />
      </div>

      <div>
        <Label htmlFor="description" mode="cp-dark">
          Acciones
        </Label>
        <div>
          {service.features?.length > 0 && (
            <ul className="text-cp-dark my-3">
              {service.features.map((feature, index) => {
                console.log('feature', feature)
                const qty = parseInt(`${feature.quantity}`) || 0
                console.log('qty', qty)

                return(
                  <>
                    <li className="flex gap-3 items-center justify-between">
                      <p className="text-sm">
                        {qty > 0 && (
                          <span className="inline-flex w-[16px] h-[16px] bg-cp-primary justify-center items-center rounded-full text-[10px] font-bold mr-1">
                            {feature.quantity}{" "}
                          </span>
                        )}
                        <span>{feature.title}</span>
                      </p>
                      <button
                        className="text-xs hover:underline text-red-500"
                        onClick={() => handleDeleteFeature(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                      </button>
                    </li>
                    <hr className="my-1"/>
                  </>
                )
              })}
            </ul>
          )}
        </div>
        <div className="flex gap-1 items-center">
          <div className="w-[70%]">
            <Input
              name="title"
              onChange={(e) => handleChangesFeature(e)}
              placeholder="Escribe el título"
              mode="cp-dark"
            />
          </div>
          <div className="w-[20%]">
            <Input
              name="quantity"
              onChange={(e) => handleChangesFeature(e)}
              type="number"
              placeholder="Cant"
              mode="cp-dark"
            />
          </div>
          <div className="w-[10%] d-flex items-center justify-center">
            <button
              onClick={() => handleAddFeature(newFeature)}
              type="button"
              className="w-[40px] h-[40px] bg-cp-primary text-cp-dark rounded-full flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="accionWebYRss" mode="cp-dark">
            Artículos web y post en RSS*
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="accionWebYRss"
            id="accionWebYRss"
            mode="cp-dark"
            required
            type="number"
            value={service.accionWebYRss || 0}
          />
        </div>

        <div className="w-1/2">
          <Label htmlFor="accionPostRss" mode="cp-dark">
            Posts en RSS*
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="accionPostRss"
            id="accionPostRss"
            mode="cp-dark"
            required
            type="number"
            value={service.accionPostRss || 0}
          />
        </div>
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
            value={service.startDate || ""}
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
            value={service.endDate || ""}
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
            value={service.plan?.toLocaleLowerCase() || ""}
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
            value={service.companyId || ""}
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
            {action === "edit" ? "Actualizar servicio" : "Crear servicio"}
          </Button>
        </div>
      </div>
    </form>
  );
}
