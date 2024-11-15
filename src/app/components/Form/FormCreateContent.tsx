"use client";

import type { OptionSelect } from "@/app/types";
import Input from "@/app/utilities/ui/Input";
import Select from "@/app/utilities/ui/Select";
import Label from "@/app/utilities/ui/Label";
import Button from "@/app/utilities/ui/Button";
import { useState } from "react";
import type { SocialListsProps } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const actionOptions: OptionSelect[] = [
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

export default function FormCreateContent() {
  const [activeStep, setActiveStep] = useState(1);

  const handleNextStep = () => {
    if (activeStep < 3) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (activeStep > 1) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
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
            activeStep >= 2
              ? "bg-cp-primary text-cp-dark"
              : "bg-slate-300 text-slate-600"
          }`}
        >
          2
        </span>
        <span
          className={`w-9 aspect-square flex justify-center items-center rounded-full ${
            activeStep === 3
              ? "bg-cp-primary text-cp-dark"
              : "bg-slate-300 text-slate-600"
          }`}
        >
          3
        </span>
      </div>
      {activeStep === 1 && (
        <fieldset className="flex flex-col gap-4">
          <legend className="text-cp-dark mb-5 font-bold text-2xl">
            1. Información General
          </legend>
          <div className="w-full">
            <Label mode="cp-dark">Tipo acción</Label>
            <Select mode="cp-dark" options={actionOptions} />
          </div>
          <div className="w-full">
            <Label mode="cp-dark">Titular*</Label>
            <Input mode="cp-dark" />
          </div>
          <div className="w-full">
            <Label mode="cp-dark">Fecha publicación*</Label>
            <Input type="date" mode="cp-dark" />
          </div>
          <div className="w-full">
            <Label mode="cp-dark">Servicio asociado*</Label>
            <Select mode="cp-dark" options={actionOptions} />
          </div>
        </fieldset>
      )}

      {activeStep === 2 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-cp-dark mb-5 font-bold text-2xl">
            2. Enlaces
          </legend>

          {socialList &&
            socialList.map((item) => (
              <div key={item.id} className="w-full">
                <Label htmlFor={item.id} mode="cp-dark">
                  {item.title}
                </Label>
                <Input id={item.id} mode="cp-dark" name={item.title} />
              </div>
            ))}
        </fieldset>
      )}

      {activeStep === 3 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-cp-dark mb-5 font-bold text-2xl">
            3. Estadísticas
          </legend>

          {socialList &&
            socialList.map((item) => (
              <div key={item.id} className="w-full">
                <div className="p-2 px-3 bg-slate-200 shadow-sm flex items-center justify-between">
                  <span className="text-cp-dark text-sm">{item.title}</span>
                  <FontAwesomeIcon
                    className="text-cp-dark text-sm"
                    icon={faPlus}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                    <input type="text" className="w-full h-8 p-2" placeholder="Alcance" />
                    <input type="text" className="w-full h-8 p-2" placeholder="Impresiones" />
                    <input type="text" className="w-full h-8 p-2" placeholder="Interacciones" />
                </div>
              </div>
            ))}
        </fieldset>
      )}
      <div className=" mt-4 flex items-center justify-between gap-2">
        {activeStep === 3 && (
          <a href="#" className="text-cp-dark underline text-sm">
            Saltar este paso
          </a>
        )}
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            mode="cp-light"
            onClick={handlePreviousStep}
            disabled={activeStep === 1}
          >
            Anterior
          </Button>
          {activeStep < 3 ? (
            <Button type="button" mode="cp-green" onClick={handleNextStep}>
              Siguiente
            </Button>
          ) : (
            <Button mode="cp-green" type="submit">
              Finalizar
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
