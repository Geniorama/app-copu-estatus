"use client";

import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Select from "@/app/utilities/ui/Select";
import Button from "@/app/utilities/ui/Button";
import type { Company } from "@/app/types";
import type { FormEvent, ChangeEvent } from "react";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { createCompanyInContentful, fetchUploadImage } from "@/app/utilities/helpers/fetchers";

const initialData: Company = {
  name: "",
  address: "",
  logo: "",
  phone: "",
  superior: null,
  driveLink: "",
  linkWhatsApp: "",
  businessName: "",
  nit: "",
};

interface FormCreateCompanyProps {
  onClose: () => void;
  companies?: Company[] | null;
  onSubmit?: (idCompany: string) => void;
}

export default function FormCreateCompany({
  onClose,
  companies,
  onSubmit,
}: FormCreateCompanyProps) {
  const [newCompany, setNewCompany] = useState<Company>(initialData);
  const [parentCompanies, setParentCompanies] = useState<
    { value: string; name: string }[] | null
  >(null);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadFileUrl, setUploadFileUrl] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement | null>(null);

  const handleLogoClick = () => {
    logoRef.current?.click();
  };

  useEffect(() => {
    if (companies) {
      const dataForSelect = companies.map((company) => ({
        name: company.name,
        value: company.id,
      }));
      setParentCompanies(dataForSelect as { value: string; name: string }[]);
    }
  }, [companies]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file);
      setLogoImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneChange = (phone: string) => {
    setNewCompany({
      ...newCompany,
      phone,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        let finalLogoUrl = uploadFileUrl;
        if (logoImage && !uploadFileUrl) {
          finalLogoUrl = await fetchUploadImage(logoImage);
          setUploadFileUrl(finalLogoUrl)
        }

        if (!finalLogoUrl) {
          console.log("No hay logo disponible aún");
          return;
        }

        // Procede a crear la compañía con la URL del logo
        const newCompanyContentful = await createCompanyInContentful({
          ...newCompany,
          logo: finalLogoUrl,
        });

        if (onSubmit && newCompanyContentful) {
          console.log("newCompanyContentful", newCompanyContentful);
          onSubmit(newCompanyContentful.sys.id);
        }

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
    setNewCompany({
      ...newCompany,
      [e.target.name]: value,
    });
  };

  const handleRemoveImage = () => {
    setLogoImage(null);
    setNewCompany({ ...newCompany, logo: "" }); // Eliminar el nombre de la imagen en el estado
    setLogoPreview(null); // Limpiar la previsualización
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="w-full flex flex-col gap-3 bg-slate-100 p-8 rounded-lg"
    >
      <div>
        <div
          onClick={handleLogoClick}
          className="bg-slate-300 text-slate-500 w-20 aspect-square rounded-full flex justify-center items-center relative cursor-pointer"
        >
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Logo Previsualización"
              className="w-20 h-20 object-cover rounded-full border border-slate-300 absolute top-0 left-0"
            />
          ) : (
            <span>Logo</span>
          )}

          <div className="absolute w-full h-full flex justify-center items-center text-2xl text-cp-primary bg-slate-500 rounded-full bg-opacity-70 opacity-0 hover:opacity-100">
            <FontAwesomeIcon icon={faCamera} />
          </div>
        </div>

        {logoPreview && (
          <span
            onClick={handleRemoveImage}
            className=" underline text-blue-600 text-xs cursor-pointer hover:opacity-70"
          >
            Quitar imagen
          </span>
        )}
        <input
          onChange={handleFileChange}
          className="hidden"
          ref={logoRef}
          type="file"
          name=""
          id=""
          accept="image/*"
        />
      </div>

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
          <PhoneInput
            defaultCountry="co"
            onChange={(phone) => handlePhoneChange(phone)}
            value={newCompany.phone}
          />
          {/* <Input
            onChange={(e) => handleChange(e)}
            name="phone"
            placeholder="Ej: +573001234567"
            id="companyPhone"
            mode="cp-dark"
            required
            type="tel"
          /> */}
        </div>

        <div className="w-1/2">
          <Label htmlFor="linkWp" mode="cp-dark">
            Link grupo whatsapp
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="linkWhatsApp"
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
          options={parentCompanies || []}
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
