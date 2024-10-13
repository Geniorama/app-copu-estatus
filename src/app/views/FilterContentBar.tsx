import Label from "../utilities/ui/Label";
import Input from "../utilities/ui/Input";
import Select from "../utilities/ui/Select";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { FilterDataProps } from "../types";

interface FilterContentBarProps {
  companies: { value: string; name: string }[];
  onFilter: (data: FilterDataProps) => void;
  onCleanForm?: () => void;
}

const initialData: FilterDataProps = {
  company: "",
  startDate: "",
  endDate: "",
};

export default function FilterContentBar({
  companies,
  onFilter,
  onCleanForm,
}: FilterContentBarProps) {
  const [selectedValues, setSelectedValues] = useState(initialData);
  const [disabledButton, setDisabledButton] = useState(true);
  const [showTags, setShowTags] = useState(false);

  useEffect(() => {
    if (
      selectedValues.company ||
      selectedValues.endDate ||
      selectedValues.startDate
    ) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [selectedValues]);

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;

    setSelectedValues({
      ...selectedValues,
      [name]: value,
    });

    setShowTags(false)
  };

  const handleFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter(selectedValues);
    setShowTags(true)
  };

  const handleCleanForm = () => {
    setSelectedValues(initialData);
    setShowTags(false)
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
            <Label mode="cp-light" htmlFor="compny">
              Compañía
            </Label>
            <Select
              id="company"
              options={companies}
              value={selectedValues.company || ""}
              onChange={(e) => handleChange(e)}
              defaultOptionText="Todas las empresas"
              name="company"
              mode="cp-light"
            />
          </div>
          <div>
            <Label mode="cp-light" htmlFor="startDate">
              Fecha Inicio
            </Label>
            <Input
              type="date"
              mode="cp-light"
              id="startDate"
              value={selectedValues.startDate}
              onChange={(e) => handleChange(e)}
              name="startDate"
              placeholder="Fecha inicio"
            />
          </div>
          <div>
            <Label mode="cp-light" htmlFor="endDate">
              Fecha Fin
            </Label>
            <Input
              type="date"
              mode="cp-light"
              id="endDate"
              value={selectedValues.endDate}
              onChange={(e) => handleChange(e)}
              name="endDate"
              placeholder="Fecha fin"
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

            {!disabledButton && (
              <button
                onClick={handleCleanForm}
                className="underline hover:text-white"
              >
                Limpiar
              </button>
            )}
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

          {selectedValues.startDate && (
            <span className="bg-slate-300 rounded-sm inline-block px-2 py-1 text-cp-dark text-xs">
              <b>Fecha inicio:</b> {selectedValues.startDate}
            </span>
          )}

          {selectedValues.endDate && (
            <span className="bg-slate-300 rounded-sm inline-block px-2 py-1 text-cp-dark text-xs">
              <b>Fecha fin:</b> {selectedValues.endDate}
            </span>
          )}
        </div>
      )}
    </>
  );
}
