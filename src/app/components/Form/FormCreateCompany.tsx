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
import {
  createCompanyInContentful,
  fetchUploadImage,
} from "@/app/utilities/helpers/fetchers";
import { updateCompany } from "@/app/utilities/helpers/fetchers";
// import { useCompaniesOptions } from "@/app/hooks/useCompaniesOptions";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { fetchCompaniesOptions, addCompanyOption } from "@/app/store/features/companiesSlice";

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
  currentCompany?: Company | null;
  onSubmit?: (idCompany: string) => void;
  action?: "create" | "edit";
}

export default function FormCreateCompany({
  onClose,
  onSubmit,
  action = "create",
  currentCompany,
}: FormCreateCompanyProps) {
  const [company, setCompany] = useState<Company>(initialData);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadFileUrl, setUploadFileUrl] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>()
  const { options } = useSelector((state: RootState) => state.companies);

  const handleLogoClick = () => {
    logoRef.current?.click();
  };

  const handleRemoveImage = () => {
    setLogoImage(null);
    setCompany({ ...company, logo: "" });
    setLogoPreview(null);
    if (logoRef.current) {
      logoRef.current.value = "";
    }
  };

  useEffect(() => {
    dispatch(fetchCompaniesOptions());
  }, [dispatch]);

  useEffect(() => {
    if (currentCompany) {
      console.log('currentCompany', currentCompany);
      setCompany(currentCompany);
      if (currentCompany.logo) {
        setLogoPreview(currentCompany.logo);
      }
    } else {
      setCompany(initialData);
      handleRemoveImage();
    }
  }, [currentCompany]);

  useEffect(() => {
    if (action === "create") {
      setCompany(initialData);
      handleRemoveImage();
    }
  }, [action]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneChange = (phone: string) => {
    setCompany({
      ...company,
      phone,
    });
  };

  const handleSubmitUpdateCompany = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás a punto de actualizar una compañía. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar compañía",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let finalLogoUrl = logoPreview;
          if (logoImage) {
            const res = await fetchUploadImage(logoImage);
            if(res){
              finalLogoUrl = res
              setLogoPreview(res);
            } else {
              console.log('No se detectó logo')
            }
          }

          if(!logoPreview && !logoImage){
            finalLogoUrl=""
          }

          const bodyCompany = ({
            id: company.id,
            name: company.name,
            address: company.address,
            phone: company.phone,
            whatsAppLink: company.linkWhatsApp,
            nit: company.nit,
            businessName: company.businessName,
            driveLink: company.driveLink,
            superiorId: company.superiorId,
            logo: finalLogoUrl,
          })

          await updateCompany(bodyCompany)

          if(onSubmit && company.id){
            onSubmit(company.id)
          }

          Swal.fire({
            title: "Compañía actualizada",
            text: "La compañía ha sido actualizada exitosamente",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            onClose();
          });
        } catch (error) {}
      } else {
        console.log("actualización de compañía cancelada");
      }
    });
  };

  const handleSubmitCreateCompany = async (e: FormEvent<HTMLFormElement>) => {
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
        let finalLogoUrl = "";
        if (logoImage && !uploadFileUrl) {
          const fetchLogo = await fetchUploadImage(logoImage);
          if(fetchLogo){
            finalLogoUrl = fetchLogo
            setUploadFileUrl(finalLogoUrl);
          }
        }
  
        const newCompanyContentful = await createCompanyInContentful({
          ...company,
          logo: finalLogoUrl,
        });
  
        if (onSubmit && newCompanyContentful) {
          console.log('newCompanyContentful', newCompanyContentful);
          dispatch(addCompanyOption({
            value:  newCompanyContentful.sys.id,
            name: newCompanyContentful.fields.name['en-US']
          }))
          console.log('options', options);
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

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCompany({
      ...company,
      [e.target.name]: value,
    });
  };

  const handleClose = () => {
    setCompany(initialData);
    handleRemoveImage();
    onClose && onClose();
  };

  const filterCompaniesOptions = () => {
    if(company.id){
      const companiesOptions = options.filter((option) => option.value !== company.id)
      return companiesOptions
    } else {
      return options
    }
  }

  return (
    <form
      onSubmit={
        action === "edit"
          ? handleSubmitUpdateCompany
          : handleSubmitCreateCompany
      }
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
            value={company.name}
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
            value={company.address}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="companyPhone" mode="cp-dark">
            Teléfono
          </Label>
          <PhoneInput
            defaultCountry="co"
            onChange={(phone) => handlePhoneChange(phone)}
            value={company.phone}
          />
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
            value={company.linkWhatsApp}
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
            value={company.nit}
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
            value={company.businessName}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="parentConpany" mode="cp-dark">
          Compañía superior
        </Label>
        <Select
          mode="cp-dark"
          name="superiorId"
          id="parentConpany"
          onChange={(e) => handleChange(e)}
          options={
            options
              ? [...filterCompaniesOptions(), { name: "Sin superior", value: "" }]
              : []
          }
          // defaultOptionText="Selecciona una opción"
          value={company.superiorId || ""}
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
          value={company.driveLink}
        />
      </div>

      <div className="flex gap-3 items-center justify-end mt-3">
        <div>
          <Button onClick={handleClose} type="button" mode="cp-light">
            Cerrar
          </Button>
        </div>
        <div>
          <Button mode="cp-green" type="submit">
            {action === "edit" ? "Actualizar compañía" : "Crear compañía"}
          </Button>
        </div>
      </div>
    </form>
  );
}
