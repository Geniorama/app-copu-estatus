"use client";

import { useEffect, useState, useRef } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faUser } from "@fortawesome/free-solid-svg-icons";
import type { User } from "@/app/types";
import FormUpdateUser from "@/app/components/Form/FormUpdateUser";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import type { ChangeEvent } from "react";
import Swal from "sweetalert2";
import { updatedUserInContentful } from "@/app/utilities/helpers/fetchers";
import { fetchUploadImage } from "@/app/utilities/helpers/fetchers";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const { userData, currentUser } = useSelector(
    (state: RootState) => state.user
  );

  const imageProfileRef = useRef<HTMLInputElement | null>(null);

  const handleReset = async () => {
    setMessage("");
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const { url } = await response.json();
        setMessage(`Enlace enviado correctamente: ${url}`);
        console.log(`Enlace enviado correctamente: ${url}`);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Error al enviar el enlace.");
        console.log(errorData.error || "Error al enviar el enlace.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error al procesar la solicitud.");
    }
  };

  useEffect(() => {
    if (userData && currentUser) {
      const userDataWithAuth0Id = {
        ...userData,
        auth0Id: currentUser.user.sub,
      };

      setEmail(`${userData.email}`);
      setUser(userDataWithAuth0Id);
      if(userData.imageProfile){
        setPrevImage(userData.imageProfile)
      }
    }
  }, [userData, currentUser]);

  const onClickImage = () => {
    if(imageProfileRef.current){
      imageProfileRef.current.click()
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result as string;
        // setPrevImage(newImage);

        Swal.fire({
          html: `<div class="text-center">
            <img class="w-[100px] aspect-square mx-auto rounded-full object-cover overflow-hidden" src="${newImage}" />
            <p class="mt-3">Estás a punto de actualizar tu foto de perfil. ¿Deseas continuar?</p>
          </div>`,
          title: "¿Estás seguro/a?",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, cambiar foto de perfil",
          cancelButtonText: "Cancelar",
        }).then(async(result) => {
          if(result.isConfirmed){
            if(user){
              try {
                const fileUrl = await fetchUploadImage(file)
                if(fileUrl){
                      console.log('file url', fileUrl)
                      const userWithChangeImage = {
                      ...user,
                      imageProfile: fileUrl
                  }
                  const res = await updatedUserInContentful(userWithChangeImage)
                  if(res){
                    Swal.fire({
                      title: "Imagen actualizada",
                      text: "Tu foto de perfil se ha actualizado exitosamente",
                      icon: "success",
                      confirmButtonText: "OK",
                    }).then(() => {
                      setPrevImage(newImage);
                    })
                  }
                } else {
                  console.log('No se encontró una url de imagen')
                }
              } catch (error) {
                console.log('Error al cargar imagen', error)
              }
            }
          } else if(result.isDenied){
            if(imageProfileRef.current){
              imageProfileRef.current.value = ""
            }
          }
        })
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="mb-5">
        <TitleSection title="Mi perfil" />
      </div>
      <div className=" mt-10">
        <div>
          <div className="bg-slate-400 w-32 aspect-square rounded-full overflow-hidden mx-auto relative">
            {prevImage ? (
              <img
                className="w-full h-full object-cover"
                src={prevImage}
                alt=""
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center text-6xl">
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
            <div onClick={onClickImage} className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 text-[40px] flex justify-center items-center text-cp-primary opacity-0 transition hover:opacity-100 cursor-pointer">
              <FontAwesomeIcon icon={faCamera} />
            </div>
          </div>
          <input
            ref={imageProfileRef}
            className=" hidden"
            type="file"
            name=""
            id=""
            onChange={(e) => handleFileChange(e)}
          />
        </div>

        <div className="text-center mt-2">
          <p className="text-2xl">
            {user?.fname} {user?.lname}
          </p>
          <p>{user?.position}</p>
          <div className="text-sm mt-3">
            <p>{user?.email}</p>
            <p>{user?.phone}</p>
            <button
              onClick={handleReset}
              className="text-cp-primary underline hover:text-cp-primary-hover transition"
            >
              Cambiar contraseña
            </button>
          </div>
        </div>

        <hr className="w-full border-slate-500 my-7" />

        <div className="text-left">
          <h2 className="font-bold mb-7">Editar perfil</h2>
          <FormUpdateUser
            onClose={() => console.log("close")}
            defaultData={user}
          />
        </div>
      </div>
    </>
  );
}
