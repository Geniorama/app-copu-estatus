"use client";

import type { Content, OptionSelect } from "@/app/types";
import Input from "@/app/utilities/ui/Input";
import Select from "@/app/utilities/ui/Select";
import Label from "@/app/utilities/ui/Label";
import Button from "@/app/utilities/ui/Button";
import { useEffect, useState } from "react";
import type { SocialListsProps } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import type { ChangeEvent } from "react";
import { useFetchServices } from "@/app/hooks/useFetchServices";
import { createContent, updateContent } from "@/app/utilities/helpers/fetchers";
import Swal from "sweetalert2";
import type { FormEvent } from "react";

export const actionOptions: OptionSelect[] = [
  {
    name: "Post en social media",
    value: "post",
  },

  {
    name: "Artículo en la web y social media",
    value: "web",
  },
];

const socialList: SocialListsProps[] = [
  {
    id: "webcopu",
    title: "Web Copu",
  },

  {
    id: "facebook",
    title: "Facebook",
  },

  {
    id: "instagram",
    title: "Instagram",
  },

  {
    id: "linkedin",
    title: "Linked In",
  },

  {
    id: "xtwitter",
    title: "X (Twitter)",
  },

  {
    id: "tiktok",
    title: "Tik Tok",
  },

  {
    id: "youtube",
    title: "YouTube",
  },

  {
    id: "threads",
    title: "Threads",
  },
];

interface FormCreateContentProps {
    onSubmit?: (contentId?:string) => void;
    onClose: () => void;
    action?: "create" | "edit";
    currentContent?: Content | null;
}

const initialData: Content = {
  id: "",
  headline: "",
  publicationDate: "",
  service: undefined,
  socialMediaInfo: socialList.map((item) => ({
    id: item.id,
    link: "",
    statistics: {
      scope: 0,
      impressions: 0,
      interactions: 0,
    },
  })),
};

export default function FormCreateContent({onSubmit, onClose, currentContent, action}:FormCreateContentProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [optionsServices, setOptionsServices] = useState<OptionSelect[] | null>(
    null
  );
  const [infoContent, setInfoContent] = useState<Content | null>(initialData);


  const { dataServices, loading } = useFetchServices({ hasUpdate: undefined });

  const handleNextStep = () => {
    if (activeStep < 3) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const handlePreviousStep = () => {
    if (activeStep > 1) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  useEffect(() => {
    if (!loading && dataServices) {
      const convertToOption: OptionSelect[] = dataServices.map((service) => ({
        name: service.name || '',
        value: service.id || ''
      }))

      if(convertToOption){
        setOptionsServices(convertToOption)
      }
    }
  }, [dataServices, loading]);

  useEffect(() => {
    if (currentContent && action === "edit") {
      console.log("currentContent", currentContent);
      setInfoContent(currentContent);
    } else {
      setInfoContent(initialData);
    }
  }, [currentContent, action]);

  const handleChangeService = (e: ChangeEvent<HTMLSelectElement>) => {
    const {value} = e.target

    if(value){
      const filterService = dataServices.find((service) => service.id === value)

      setInfoContent((prevState) => ({
        ...prevState,
        service: filterService
      }))
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setInfoContent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSocialChange = (
    e: ChangeEvent<HTMLInputElement>,
    socialId: string
  ) => {
    const { name, value } = e.target;

    setInfoContent((prevState) => {
      if (!prevState) return null;

      const updatedSocialMediaInfo = prevState.socialMediaInfo?.map(
        (social) => {
          if (social.id === socialId) {
            if (name.startsWith("statistics.")) {
              const key = name.split(".")[1];

              return {
                ...social,
                statistics: {
                  ...social.statistics,
                  [key]: Number(value),
                },
              };
            }

            return {
              ...social,
              [name]: value,
            };
          }
          return social;
        }
      );

      return {
        ...prevState,
        socialMediaInfo: updatedSocialMediaInfo,
      };
    });
  };

  const handleSubmitUpdateContent = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás a punto de editar un contenido. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar contenido",
      cancelButtonText: "Cancelar",
    }).then( async (result) => {
      if (result.isConfirmed) {
        try {
          if(infoContent){
            const res = await updateContent(infoContent)
            if(res){
              onSubmit && onSubmit(res.sys.id)
              
              Swal.fire({
                title: "Contenido editado",
                text: "El contenido se ha editado exitosamente",
                icon: "success",
                confirmButtonText: "OK",
              }).then(() => {
                onClose();
              });
            }
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        console.log("Edición de contenido cancelada");
      }
    });
  }

  const handleSubmitCreate = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás a punto de crear un nuevo contenido. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, crear contenido",
      cancelButtonText: "Cancelar",
    }).then( async (result) => {
      if (result.isConfirmed) {
        try {
          if(infoContent){
            const res = await createContent(infoContent)
            if(res){
              onSubmit && onSubmit(res.sys.id)
              
              Swal.fire({
                title: "Contenido creado",
                text: "El contenido se ha creado exitosamente",
                icon: "success",
                confirmButtonText: "OK",
              }).then(() => {
                onClose();
              });
            }
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        console.log("Creación de contenido cancelada");
      }
    });
    
  }

  return (
    <form
      onSubmit={
        action === "edit" ? handleSubmitUpdateContent : handleSubmitCreate
      }
      className="w-full bg-slate-100 p-8 rounded-lg"
    >
      <div className="flex gap-4 justify-center mb-5">
        <span
          className={`w-9 aspect-square flex justify-center items-center rounded-full ${
            activeStep >= 1
              ? "bg-cp-primary text-cp-dark"
              : "bg-slate-300 text-slate-600"
          }`}
        >
          1
        </span>
        <span
          className={`w-9 aspect-square flex justify-center items-center rounded-full ${
            activeStep === 2
              ? "bg-cp-primary text-cp-dark"
              : "bg-slate-300 text-slate-600"
          }`}
        >
          2
        </span>
      </div>
      {activeStep === 1 && (
        <fieldset className="flex flex-col gap-4">
          <legend className="text-cp-dark mb-5 font-bold text-2xl">
            1. Información General
          </legend>
          <div className="w-full">
            <Label mode="cp-dark">Tipo acción</Label>
            <Select
              name="type"
              onChange={(e) => handleChange(e)}
              mode="cp-dark"
              options={actionOptions}
              value={infoContent?.type || ''}
              defaultOptionText="Selecciona una opción"
            />
          </div>
          <div className="w-full">
            <Label mode="cp-dark">Titular*</Label>
            <Input
              name="headline"
              onChange={(e) => handleChange(e)}
              mode="cp-dark"
              value={infoContent?.headline}
            />
          </div>
          <div className="w-full">
            <Label mode="cp-dark">Fecha publicación*</Label>
            <Input
              name="publicationDate"
              onChange={(e) => handleChange(e)}
              type="date"
              mode="cp-dark"
              value={infoContent?.publicationDate || ""}
            />
          </div>
          {optionsServices && (
            <div className="w-full">
              <Label mode="cp-dark">Servicio asociado*</Label>
              <Select
                name="service"
                onChange={(e) => handleChangeService(e)}
                mode="cp-dark"
                options={optionsServices}
                value={infoContent?.service?.id || infoContent?.serviceId  || ''}
                defaultOptionText="Selecciona una opción"
              />
            </div>
          )}
        </fieldset>
      )}

      {activeStep === 2 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-cp-dark mb-5 font-bold text-2xl">
            2. Enlaces y estadísticas
          </legend>

          {socialList &&
            socialList.map((item) => (
              <div key={item.id} className="w-full">
                <div
                  onClick={() => toggleExpand(item.id)}
                  className={`p-2 px-3 ${
                    expandedId === item.id
                      ? "bg-slate-600 text-cp-primary"
                      : "bg-slate-200 text-cp-dark"
                  } shadow-sm flex items-center justify-between cursor-pointer`}
                >
                  <span className="text-sm">{item.title}</span>
                  {expandedId === item.id ? (
                    <FontAwesomeIcon
                      className="text-cp-primary text-sm"
                      icon={faMinus}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="text-cp-dark text-sm"
                      icon={faPlus}
                    />
                  )}
                </div>
                {expandedId === item.id && (
                  <div>
                    <input
                      name="link"
                      type="text"
                      className="w-full h-8 p-2 border outline-none focus:border-cp-primary text-cp-dark mt-2"
                      placeholder="Link"
                      min={0}
                      onChange={(e) => handleSocialChange(e, item.id)}
                      value={
                        infoContent?.socialMediaInfo?.find(
                          (social) => social.id === item.id
                        )?.link || ""
                      }
                    />
                    <div className="flex gap-2 mt-2">
                      <div>
                        <label htmlFor="scope" className="text-cp-dark text-xs">Alcance</label>
                        <input
                          id="scope"
                          name="statistics.scope"
                          type="number"
                          className="w-full h-8 p-2 border outline-none focus:border-cp-primary text-cp-dark"
                          placeholder="Alcance"
                          min={0}
                          onChange={(e) => handleSocialChange(e, item.id)}
                          value={
                            infoContent?.socialMediaInfo?.find(
                              (social) => social.id === item.id
                            )?.statistics?.scope || 0
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="impressions" className="text-cp-dark text-xs">Impresiones</label>
                        <input
                          id="impressions"
                          name="statistics.impressions"
                          type="number"
                          className="w-full h-8 p-2 border outline-none focus:border-cp-primary text-cp-dark"
                          placeholder="Impresiones"
                          min={0}
                          onChange={(e) => handleSocialChange(e, item.id)}
                          value={
                            infoContent?.socialMediaInfo?.find(
                              (social) => social.id === item.id
                            )?.statistics?.impressions || 0
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="interactions" className="text-cp-dark text-xs">Interacciones</label>
                        <input
                          id="interactions"
                          name="statistics.interactions"
                          type="number"
                          className="w-full h-8 p-2 border outline-none focus:border-cp-primary text-cp-dark"
                          placeholder="Interacciones"
                          min={0}
                          onChange={(e) => handleSocialChange(e, item.id)}
                          value={
                            infoContent?.socialMediaInfo?.find(
                              (social) => social.id === item.id
                            )?.statistics?.interactions || 0
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </fieldset>
      )}
      <div className="mt-4 flex gap-2 justify-between items-center">
        <button className="text-cp-dark text-sm underline hover:opacity-60 transition" onClick={onClose}>
          Cancelar
        </button>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            mode="cp-light"
            onClick={handlePreviousStep}
            disabled={activeStep === 1}
          >
            Anterior
          </Button>
          {activeStep === 1 ? (
            <Button type="button" mode="cp-green" onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleNextStep()
            }}>
              Siguiente
            </Button>
          ) : (
            <Button disabled={activeStep === 1} mode="cp-green" type="submit">
              Finalizar
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
