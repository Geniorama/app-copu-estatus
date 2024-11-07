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
import { v4 as uuidv4 } from "uuid";

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
  companies?: CompanyResponse[] | null;
}
interface OptionSelect {
  name: string;
  value: string;
}

export default function FormCreateUser({
  onClose,
  onSubmit,
  companies,
}: FormCreateCompanyProps) {
  const [user, setUser] = useState<User>(initialData);
  const [companiesOptions, setCompaniesOptions] = useState<
    OptionSelect[] | null
  >(null);
  const [imgProfile, setImgProfile] = useState<File | null>(null);
  const [imgProfilePreview, setImgProfilePreview] = useState<string | null>(
    null
  );

  const imageProfileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const updateCompaniesFields = companies?.map((company) => ({
      value: `${company.sys.id}`,
      name: `${company.fields.name["en-US"]}`,
    }));

    setCompaniesOptions(updateCompaniesFields || null);
  }, [companies]);

  const fetchUploadImage = async (file: File): Promise<string | null> => {
    try {
      const uniqueFileName = `${uuidv4()}-${file.name.replace(/\s+/g, "_")}`;
      const formData = new FormData();
      formData.append("file", file, uniqueFileName);
      const result = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        console.error("File upload failed");
        return null;
      }

      const { fileUrl } = await result.json();
      return fileUrl;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const createUserInContentful = async (infoUser: User) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(infoUser),
      });
      console.log(res);
    } catch (error) {
      console.log("Error create user", error);
    }
  };

  const generatePassword = (length = 12) => {
    return randomBytes(length).toString("base64").slice(0, length);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  const handleProfileClick = () => {
    imageProfileRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file);
      setImgProfile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImgProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeCompany = (e: ChangeEvent<HTMLSelectElement>) => {
    const idCompany = e.target.value;

    if (companies) {
      const filterCompany = companies.filter(
        (company) => company.sys.id === idCompany
      );

      setUser({
        ...user,
        companies: filterCompany,
      });

      console.log(user);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
            body: JSON.stringify({ ...user, password }),
          });

          if (response.ok) {
            const auth0User = await response.json();
            if (auth0User) {
              const updatedUser = { ...user, auth0Id: auth0User.auth0Id };
              setUser(updatedUser);
              let fileProfileUrl = ''

              if(imgProfile){
                const res = await fetchUploadImage(imgProfile)
                if(res){
                  fileProfileUrl = res
                }
              }

              await createUserInContentful({...updatedUser, imageProfile: fileProfileUrl});

              if (onSubmit) {
                onSubmit(updatedUser);
              }

              Swal.fire({
                title: "Usuario creado",
                text: "El usuario ha sido creado exitosamente",
                icon: "success",
                confirmButtonText: "OK",
              }).then(() => {
                handleClose();
              });
            } else {
              console.log("No se encuentra el id");
            }
          } else {
            console.error(
              "Error al crear usuario en Auth0",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error al conectar con la API de Auth0", error);
        }
      } else {
        console.log("Creación de usuario cancelada");
      }
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setUser({
      ...user,
      [e.target.name]: value,
    });
  };

  const handleRemoveImage = () => {
    setImgProfile(null);
    setImgProfilePreview(null);
    if(imageProfileRef.current){
      imageProfileRef.current.value = ""
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="w-full flex flex-col gap-3 bg-slate-100 p-8 rounded-lg"
    >
      <div className="mb-3">
        <div className="bg-slate-400 w-20 aspect-square rounded-full overflow-hidden mx-auto relative">
          {imgProfilePreview ? (
            <img
              className="w-full h-full object-cover"
              src={imgProfilePreview}
              alt=""
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center text-4xl">
              <FontAwesomeIcon icon={faUser} />
            </div>
          )}
          <div onClick={handleProfileClick} className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 text-[40px] flex justify-center items-center text-cp-primary opacity-0 transition hover:opacity-100 cursor-pointer">
            <FontAwesomeIcon icon={faCamera} />
          </div>
        </div>
        {imgProfilePreview && (
          <span
            onClick={handleRemoveImage}
            className=" underline text-blue-600 text-xs cursor-pointer hover:opacity-70 text-center block mt-2"
          >
            Quitar imagen
          </span>
        )}
        <input
          ref={imageProfileRef}
          className=" hidden"
          type="file"
          name=""
          id=""
          onChange={(e)=>handleFileChange(e)}
        />
      </div>
      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="fname" mode="cp-dark">
            Nombre(s) *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="fname"
            id="fname"
            mode="cp-dark"
            required
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="lname" mode="cp-dark">
            Apellido(s) *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="lname"
            id="lname"
            mode="cp-dark"
            required
            type="text"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="email" mode="cp-dark">
            Email *
          </Label>
          <Input
            onChange={(e) => handleChange(e)}
            name="email"
            id="email"
            mode="cp-dark"
            required
            type="email"
          />
        </div>

        <div className="w-1/2">
          <Label htmlFor="phone" mode="cp-dark">
            Teléfono *
          </Label>
          <Input
            required
            onChange={(e) => handleChange(e)}
            name="phone"
            id="phone"
            mode="cp-dark"
            type="text"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label htmlFor="role" mode="cp-dark">
            Rol *
          </Label>
          <Select
            required
            onChange={(e) => handleChange(e)}
            defaultValue={initialData.role}
            mode="cp-dark"
            name="role"
            id="role"
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
            onChange={(e) => handleChange(e)}
            name="position"
            id="position"
            mode="cp-dark"
            type="text"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="linkDrive" mode="cp-dark">
          Compañía(s) *
        </Label>
        <Select
          required={user.role === "cliente"}
          mode="cp-dark"
          disabled={!companies}
          onChange={(e) => handleChangeCompany(e)}
          options={companiesOptions || [{ name: "", value: "" }]}
          defaultOptionText="Selecciona una opción"
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
            Crear usuario
          </Button>
        </div>
      </div>
    </form>
  );
}
