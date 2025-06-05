"use client";

import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Select from "@/app/utilities/ui/Select";
import Button from "@/app/utilities/ui/Button";
import type { User } from "@/app/types";
import type { FormEvent, ChangeEvent } from "react";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { randomBytes } from "crypto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCamera } from "@fortawesome/free-solid-svg-icons";
import {
  fetchUploadImage,
  createUserInContentful,
  updatedUserInContentful,
} from "@/app/utilities/helpers/fetchers";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { fetchCompaniesOptions } from "@/app/store/features/companiesSlice";

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
  action?: 'create' | 'edit'
}

export default function FormCreateUser({
  onClose,
  onSubmit,
  currentUser,
  action = 'create'
}: FormCreateCompanyProps) {
  const [user, setUser] = useState<User>(initialData);
  const [imgProfile, setImgProfile] = useState<File | null>(null);
  const [imgProfilePreview, setImgProfilePreview] = useState<string | null>(
    null
  );
  const imageProfileRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>()
  const { options } = useSelector((state: RootState) => state.companies)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCompaniesOptions())
  },[dispatch])

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      if (currentUser.imageProfile) {
        setImgProfilePreview(currentUser.imageProfile);
      }
    } else {
      setUser(initialData);
      setImgProfilePreview(null);
      setImgProfile(null)
      if(imageProfileRef.current){
        imageProfileRef.current.value=""
      }
    }
  }, [currentUser, imageProfileRef]);

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

  const handleSubmitUpdateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!user.companiesId || user.companiesId.length === 0){
      console.log("No se ha seleccionado ninguna compañía");
      return
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás a punto de editar al usuario. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar usuario",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
            let fileProfileUrl = imgProfilePreview;
            if (imgProfile) {
              const res = await fetchUploadImage(imgProfile);
              if (res) {
                fileProfileUrl = res;
              }
            }

            if (!imgProfilePreview && !imgProfile) {
              fileProfileUrl = "";
            }

            const userPayload = { ...user, ...(fileProfileUrl && { imageProfile: fileProfileUrl }) };
            await updatedUserInContentful(userPayload);

            onSubmit && onSubmit(user);

            Swal.fire({
              title: "Usuario actualizado",
              text: "El usuario ha sido actualizado exitosamente",
              icon: "success",
              confirmButtonText: "OK",
            }).then(handleClose);
        } catch (error) {
          console.error("Error al actualizar en contentful", error);
        }
      }
    });
  };

  const handleSubmitCreateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!user.companiesId || user.companiesId.length === 0){
      setError("Debes seleccionar al menos una compañía");
      return
    }

    const password = generatePassword();

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás a punto de crear un nuevo usuario. ¿Deseas continuar?",
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
            body: JSON.stringify({ action: 'create', user: {...user, password} }),
          });

          const data = await response.json();

          if (response.ok) {
            const auth0User = data;
            const updatedUser = { ...user, auth0Id: auth0User.auth0Id };

            let fileProfileUrl = "";
            if (imgProfile) {
              const res = await fetchUploadImage(imgProfile);
              if (res) {
                fileProfileUrl = res;
              }
            }

            const userPayload = { ...updatedUser, ...(fileProfileUrl && { imageProfile: fileProfileUrl }) };
            await createUserInContentful(userPayload);
            onSubmit && onSubmit(updatedUser);

            Swal.fire({
              title: "Usuario creado",
              text: "El usuario ha sido creado exitosamente",
              icon: "success",
              confirmButtonText: "OK",
            }).then(handleClose);
          } else {
            if (response.status === 409) {
              Swal.fire({
                title: "Error",
                text: "El usuario ya existe en el sistema",
                icon: "error",
                confirmButtonText: "OK",
              });
            } else {
              Swal.fire({
                title: "Error",
                text: data.error || "Error al crear el usuario",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          }
        } catch (error) {
          console.error("Error al conectar con la API de Auth0", error);
          Swal.fire({
            title: "Error",
            text: "Error al conectar con el sistema",
            icon: "error",
            confirmButtonText: "OK",
          });
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

  const handleChangePhone = (phone: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      phone
    }))
  }

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
      const filterCompaniesId = user.companiesId?.filter((companyFilter) => companyFilter !== companyId);
      setUser({
        ...user,
        companiesId: filterCompaniesId,
      });
    } else {
      const addCompaniesId = [...(user.companiesId || []), companyId]; 
      setUser({
        ...user,
        companiesId: addCompaniesId,
      });
    }
  };
  

  return (
    <form
      onSubmit={action === 'edit' ? handleSubmitUpdateUser : handleSubmitCreateUser}
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
          <PhoneInput 
             value={user?.phone || ""}
             onChange={(phone) => handleChangePhone(phone)}
             defaultCountry="co"
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

      {options && (
        <div>
          <Label htmlFor="company" mode="cp-dark">
            Compañía(s) *
          </Label>
          <div className="border-2 border-slate-400 rounded-md">
            <ul className="max-h-32 overflow-y-scroll custom-scroll">
              {options.map((option) => (
                <li onClick={() => handleClickCompanyOption(option.value)} className="flex text-sm items-center gap-2 p-2 hover:bg-slate-200 text-cp-dark cursor-pointer" key={option.value}>
                  <span className={`inline-block w-4 h-4 border-2 rounded-full ${user.companiesId?.find((companyId) => companyId === option.value) ? 'bg-cp-primary border-cp-primary': 'border-slate-400'}`}></span>
                  <span>{option.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <Button onClick={handleClose} mode="cp-light">
          Cancelar
        </Button>
        <Button type="submit" mode="cp-green">
          {action === 'edit' ? "Actualizar usuario" : "Crear usuario"}
        </Button>
      </div>
    </form>
  );
}
