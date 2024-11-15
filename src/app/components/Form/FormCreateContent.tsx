"use client";

import type { Content, OptionSelect } from "@/app/types";
import Input from "@/app/utilities/ui/Input";
import Select from "@/app/utilities/ui/Select";
import Label from "@/app/utilities/ui/Label";
import Button from "@/app/utilities/ui/Button";
import { useState } from "react";
import type { SocialListsProps } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import type { ChangeEvent } from "react";

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [infoContent, setInfoContent] = useState<Content | null>({
    id: "",
    headline: "",
    pubDate: "",
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
  });
  

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

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    console.log(name + ": " + value);

    setInfoContent((prevState) => ({
      ...prevState,
      id: "",
      [name]: value,
    }));

    console.log(infoContent);
  };

  const handleSocialChange = (
    e: ChangeEvent<HTMLInputElement>,
    socialId: string
  ) => {
    const { name, value } = e.target;
  
    setInfoContent((prevState) => {
      if (!prevState) return null;
  
      const updatedSocialMediaInfo = prevState.socialMediaInfo?.map((social) => {
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
      });
  
      return {
        ...prevState,
        socialMediaInfo: updatedSocialMediaInfo,
      };
    });

    console.log(infoContent)
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
              value={infoContent?.type}
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
              name="pubDate"
              onChange={(e) => handleChange(e)}
              type="date"
              mode="cp-dark"
              value={infoContent?.pubDate || ''}
            />
          </div>
          <div className="w-full">
            <Label mode="cp-dark">Servicio asociado*</Label>
            <Select
              name="service"
              onChange={(e) => handleChange(e)}
              mode="cp-dark"
              options={actionOptions}
            />
          </div>
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
                        infoContent?.socialMediaInfo?.find((social) => social.id === item.id)
                          ?.link || ""
                      }
                    />
                    <div className="flex gap-2 mt-2">
                      <input
                        name="statistics.scope"
                        type="number"
                        className="w-full h-8 p-2 border outline-none focus:border-cp-primary text-cp-dark"
                        placeholder="Alcance"
                        min={0}
                        onChange={(e) => handleSocialChange(e, item.id)}
                        value={
                          infoContent?.socialMediaInfo?.find((social) => social.id === item.id)
                            ?.statistics?.scope || 0
                        }
                      />
                      <input
                        name="statistics.impressions"
                        type="number"
                        className="w-full h-8 p-2 border outline-none focus:border-cp-primary text-cp-dark"
                        placeholder="Impresiones"
                        min={0}
                        onChange={(e) => handleSocialChange(e, item.id)}
                        value={
                          infoContent?.socialMediaInfo?.find((social) => social.id === item.id)
                            ?.statistics?.impressions || 0
                        }
                      />
                      <input
                        name="statistics.interactions"
                        type="number"
                        className="w-full h-8 p-2 border outline-none focus:border-cp-primary text-cp-dark"
                        placeholder="Interacciones"
                        min={0}
                        onChange={(e) => handleSocialChange(e, item.id)}
                        value={
                          infoContent?.socialMediaInfo?.find((social) => social.id === item.id)
                            ?.statistics?.interactions || 0
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
        </fieldset>
      )}
      <div className="flex gap-2 justify-end mt-4">
        <Button
          type="button"
          mode="cp-light"
          onClick={handlePreviousStep}
          disabled={activeStep === 1}
        >
          Anterior
        </Button>
        {activeStep < 2 ? (
          <Button type="button" mode="cp-green" onClick={handleNextStep}>
            Siguiente
          </Button>
        ) : (
          <Button mode="cp-green" type="submit">
            Finalizar
          </Button>
        )}
      </div>
    </form>
  );
}
