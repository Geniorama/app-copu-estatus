"use client";

import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Select from "@/app/utilities/ui/Select";
import Button from "@/app/utilities/ui/Button";
import type { CompanyResponse, User } from "@/app/types";
import type { FormEvent, ChangeEvent } from "react";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { randomBytes } from "crypto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCamera } from "@fortawesome/free-solid-svg-icons";
import {
  fetchUploadImage,
  createUserInContentful,
  getAllCompanies,
} from "@/app/utilities/helpers/fetchers";

const initialData: User = {
  id: "",
  fname: "",
  lname: "",
  email: "",
  phone: "",
  role: "cliente",
  position: "",
  companies: null,
  status: true,
  linkWhatsApp: null,
  auth0Id: "",
};

interface FormCreateCompanyProps {
  onClose?: () => void;
  onSubmit?: (userInfo: User) => void;
  currentUser?: User | null;
}

interface OptionSelect {
  name: string;
  value: string;
}

export default function FormCreateUser({
  onClose,
  onSubmit,
  currentUser,
}: FormCreateCompanyProps) {
  const [user, setUser] = useState<User>(initialData);
  const [companiesOptions, setCompaniesOptions] = useState<
    OptionSelect[] | null
  >(null);
  const [imgProfile, setImgProfile] = useState<File | null>(null);
  const [imgProfilePreview, setImgProfilePreview] = useState<string | null>(
    null
  );
  const imageProfileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const getStoredCompanies = async () => {
      const storedCompanies = localStorage.getItem("companiesOptions");
      if (storedCompanies) {
        setCompaniesOptions(JSON.parse(storedCompanies));
      } else {
        const companies = await getAllCompanies();
        if (companies) {
          const options = companies.map((company: CompanyResponse) => ({
            value: company.sys.id,
            name: company.fields.name["en-US"],
          }));
          setCompaniesOptions(options);
          localStorage.setItem("companiesOptions", JSON.stringify(options)); // Guarda en localStorage
        }
      }
    };

    getStoredCompanies();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      if (currentUser.imageProfile) {
        setImgProfilePreview(currentUser.imageProfile);
      }
    } else {
      setUser(initialData);
    }
  }, [currentUser]);

  const generatePassword = (length = 12) => {
    return randomBytes(length).toString("base64").slice(0, length);
  };

  const handleClose = () => {
    setUser(initialData);
    setImgProfile(null);
    setImgProfilePreview(null);
    if (imageProfileRef.current) {
      imageProfileRef.current.value = "";
    }
    onClose && onClose();
  };

  const handleProfileClick = () => {
    imageProfileRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImgProfile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImgProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = generatePassword();

    Swal.fire({
      title: "¿Estás seguro?",
      text: user.auth0Id
        ? "Estás a punto de editar al usuario. ¿Deseas continuar?"
        : "Estás a punto de crear un nuevo usuario. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, crear usuario",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("/api/auth0-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...user, password }),
          });

          if (response.ok) {
            const auth0User = await response.json();
            const updatedUser = { ...user, auth0Id: auth0User.auth0Id };

            let fileProfileUrl = "";
            if (imgProfile) {
              const res = await fetchUploadImage(imgProfile);
              if (res) {
                fileProfileUrl = res;
              }
            }

            await createUserInContentful({
              ...updatedUser,
              imageProfile: fileProfileUrl,
            });
            onSubmit && onSubmit(updatedUser);

            Swal.fire({
              title: "Usuario creado",
              text: "El usuario ha sido creado exitosamente",
              icon: "success",
              confirmButtonText: "OK",
            }).then(handleClose);
          } else {
            console.error(
              "Error al crear usuario en Auth0",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error al conectar con la API de Auth0", error);
        }
      }
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleRemoveImage = () => {
    setImgProfile(null);
    setImgProfilePreview(null);
    if (imageProfileRef.current) {
      imageProfileRef.current.value = "";
    }
  };
  
  const handleClickCompanyOption = (companyId: string) => {
    const hasId = user.companiesId?.find((company) => company === companyId);
    
    if (hasId) {
      console.log('Ya está la empresa');
      const filterCompaniesId = user.companiesId?.filter((companyFilter) => companyFilter !== companyId);
      setUser({
        ...user,
        companiesId: filterCompaniesId, // Usamos el array filtrado
      });
    } else {
      console.log('No está la empresa');
      const addCompaniesId = [...(user.companiesId || []), companyId]; // Creamos una nueva copia con el ID añadido
      setUser({
        ...user,
        companiesId: addCompaniesId, // Establecemos el nuevo array con el ID añadido
      });
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-3 bg-slate-100 p-8 rounded-lg"
    >
      <div className="mb-3">
        <div className="bg-slate-400 w-20 aspect-square rounded-full overflow-hidden mx-auto relative">
          {imgProfilePreview ? (
            <img
              className="w-full h-full object-cover"
              src={imgProfilePreview}
              alt="Perfil"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center text-4xl">
              <FontAwesomeIcon icon={faUser} />
            </div>
          )}
          <div
            onClick={handleProfileClick}
            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 text-[40px] flex justify-center items-center text-cp-primary opacity-0 transition hover:opacity-100 cursor-pointer"
          >
            <FontAwesomeIcon icon={faCamera} />
          </div>
        </div>
        {imgProfilePreview && (
          <span
            onClick={handleRemoveImage}
            className="underline text-blue-600 text-xs cursor-pointer hover:opacity-70 text-center block mt-2"
          >
            Quitar imagen
          </span>
        )}
        <input
          ref={imageProfileRef}
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="fname" mode="cp-dark">
            Nombre(s) *
          </Label>
          <Input
            onChange={handleChange}
            name="fname"
            id="fname"
            mode="cp-dark"
            required
            value={user?.fname || ""}
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="lname" mode="cp-dark">
            Apellido(s) *
          </Label>
          <Input
            onChange={handleChange}
            name="lname"
            id="lname"
            mode="cp-dark"
            required
            value={user?.lname || ""}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="email" mode="cp-dark">
            Email *
          </Label>
          <Input
            onChange={handleChange}
            name="email"
            id="email"
            mode="cp-dark"
            required
            type="email"
            value={user?.email || ""}
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="phone" mode="cp-dark">
            Teléfono *
          </Label>
          <Input
            onChange={handleChange}
            name="phone"
            id="phone"
            mode="cp-dark"
            required
            value={user?.phone || ""}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="role" mode="cp-dark">
            Rol *
          </Label>
          <Select
            onChange={handleChange}
            name="role"
            id="role"
            mode="cp-dark"
            required
            value={user?.role || "cliente"}
            options={[
              { name: "Admin", value: "admin" },
              { name: "Cliente", value: "cliente" },
            ]}
            defaultOptionText="Selecciona una opción"
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="position" mode="cp-dark">
            Cargo *
          </Label>
          <Input
            onChange={handleChange}
            name="position"
            id="position"
            mode="cp-dark"
            value={user?.position || ""}
          />
        </div>
      </div>

      {companiesOptions && (
        <div>
          <Label htmlFor="company" mode="cp-dark">
            Compañía(s) *
          </Label>
          <div className="border-2 border-slate-400 rounded-md px-2">
            <ul className="max-h-28 overflow-y-scroll">
              {companiesOptions.map((option) => (
                <li onClick={() => handleClickCompanyOption(option.value)} className="flex items-center gap-2 py-1 text-cp-dark" key={option.value}>
                  <span className={`inline-block w-4 h-4 border-2 rounded-full ${user.companiesId?.find((companyId) => companyId === option.value) ? 'bg-cp-primary border-cp-primary': 'border-slate-400'}`}></span>
                  <span>{option.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button onClick={handleClose} mode="cp-light">
          Cancelar
        </Button>
        <Button type="submit" mode="cp-green">
          {user.auth0Id ? "Actualizar usuario" : "Crear usuario"}
        </Button>
      </div>
    </form>
  );
}
