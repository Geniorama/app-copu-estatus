import Label from "../utilities/ui/Label";
import Input from "../utilities/ui/Input";
import Select from "../utilities/ui/Select";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { FilterDataProps, OptionSelect } from "../types";
import { formattedDate } from "../utilities/helpers/formatters";

export interface ServiceOptionsProps extends OptionSelect {
  companyId?: string;
}

interface FilterContentBarProps {
  companies: OptionSelect[];
  services?: ServiceOptionsProps[] | null;
  onFilter: (data: FilterDataProps) => void;
  onCleanForm?: () => void;
}

const initialData: FilterDataProps = {
  company: "",
  service: "",
  publicationDate: "",
};

export default function FilterContentBar({
  companies,
  services,
  onFilter,
  onCleanForm,
}: FilterContentBarProps) {
  const [selectedValues, setSelectedValues] = useState(initialData);
  const [disabledButton, setDisabledButton] = useState(true);
  const [showTags, setShowTags] = useState(false);
  const [servicesByCompany, setServicesByCompany] = useState<OptionSelect[]>(
    []
  );

  const sortedCompanies = [...companies].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (
      selectedValues.publicationDate ||
      selectedValues.service
    ) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [selectedValues]);

  useEffect(() => {
    if (services) {
      const options = services.map((service) => ({
        value: service.value,
        name: service.name,
      }));

      setServicesByCompany(options);
    }
  }, [services]);

  useEffect(() => {
    if (services && selectedValues.company) {
      const filterOptions = services.filter(
        (service) => service.companyId === selectedValues.company
      );
      setServicesByCompany(filterOptions);
    }
  }, [services, selectedValues.company]);

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    
    setSelectedValues({
      ...selectedValues,
      [name]: value,
    });

    setShowTags(false);
  };

  const handleFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter(selectedValues);
    setShowTags(true);
  };

  const handleCleanForm = () => {
    setSelectedValues(initialData);
    setShowTags(false);
    if (onCleanForm) {
      onCleanForm();
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4 mt-16 items-end">
        <span>Total Contenidos</span>
        <form
          onSubmit={(e) => handleFilter(e)}
          className="flex items-end gap-4"
        >
          <div>
            <Label mode="cp-light" htmlFor="company">
              Compañía
            </Label>
            <Select
              id="company"
              options={sortedCompanies}
              value={selectedValues.company || ""}
              onChange={(e) => handleChange(e)}
              defaultOptionText="Todas las empresas"
              name="company"
              mode="cp-light"
            />
          </div>

          <div>
            <Label mode="cp-light" htmlFor="subcompany">
              Subcompañía
            </Label>
            <Select
              id="company"
              options={sortedCompanies}
              value={selectedValues.company || ""}
              onChange={(e) => handleChange(e)}
              defaultOptionText="Todas las empresas"
              name="company"
              mode="cp-light"
            />
          </div>

          <div>
            <Label mode="cp-light" htmlFor="compny">
              Servicio
            </Label>
            <Select
              id="service"
              options={servicesByCompany}
              value={selectedValues.service || ""}
              onChange={(e) => handleChange(e)}
              defaultOptionText="Todos los servicios"
              name="service"
              mode="cp-light"
            />
          </div>
          <div>
            <Label mode="cp-light" htmlFor="startDate">
              Fecha Publicación
            </Label>
            <Input
              type="date"
              mode="cp-light"
              id="publicationDate"
              value={selectedValues.publicationDate}
              onChange={(e) => handleChange(e)}
              name="publicationDate"
              placeholder="Fecha inicio"
            />
          </div>
          <div className=" flex gap-3">
            <button
              disabled={disabledButton}
              type="submit"
              className=" disabled:bg-slate-500 bg-cp-primary text-cp-dark h-[45px] rounded-sm px-3 font-bold hover:bg-cp-primary-hover"
            >
              Aplicar
            </button>
          </div>
        </form>
      </div>

      <hr className=" border-slate-500 mb-4" />

      {showTags && (
        <div className="flex gap-2 mb-4">
          {selectedValues.company && (
            <span className="bg-slate-300 rounded-sm inline-block px-2 py-1 text-cp-dark text-xs">
              <b>Compañía:</b>{" "}
              {
                companies.find(
                  (company) => company.value === selectedValues.company
                )?.name
              }
            </span>
          )}

          {selectedValues.service && (
            <span className="bg-slate-300 rounded-sm inline-block px-2 py-1 text-cp-dark text-xs">
              <b>Servicio:</b>{" "}
              {
                servicesByCompany.find(
                  (service) => service.value === selectedValues.service
                )?.name
              }
            </span>
          )}

          {selectedValues.publicationDate && (
            <span className="bg-slate-300 rounded-sm inline-block px-2 py-1 text-cp-dark text-xs">
              <b>Fecha publicación:</b>{" "}
              {formattedDate(selectedValues.publicationDate)}
            </span>
          )}

          {!disabledButton && (
            <button
              onClick={handleCleanForm}
              className="underline text-red-600 hover:text-white text-xs ml-3"
            >
              Limpiar
            </button>
          )}

          {/* {selectedValues.endDate && (
            <span className="bg-slate-300 rounded-sm inline-block px-2 py-1 text-cp-dark text-xs">
              <b>Fecha fin:</b> {selectedValues.endDate}
            </span>
          )} */}
        </div>
      )}
    </>
  );
}
