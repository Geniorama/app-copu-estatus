"use client";

import { useEffect, useState } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import type { User } from "@/app/types";
import FormUpdateUser from "@/app/components/Form/FormUpdateUser";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const initialData: User = {
  id:"",
  fname: "Venus María",
  lname: "Del perpetuo socorro",
  email: "comunicaciones@copu.media",
  phone: "+573008976543",
  role: "cliente",
  position: "",
  companies: [],
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const {userData} = useSelector((state:RootState) => state.user)

  useEffect(() => {
    if(userData){
      setUser(userData)
    }
  },[userData])
  

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   Swal.fire({
  //     title: "¿Estás seguro?",
  //     text: "Estás a punto de crear un nuevo usuario. ¿Deseas continuar?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Sí, crear usuario",
  //     cancelButtonText: "Cancelar",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       console.log("Company for send", user);

  //       Swal.fire({
  //         title: "Usuario creado",
  //         text: "El usuario ha sido creada exitosamente",
  //         icon: "success",
  //         confirmButtonText: "OK",
  //       }).then(() => {
  //       });
  //     } else {
  //       console.log("Creación de usuario cancelada");
  //     }
  //   });
  // };

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setUser({
  //     ...user,
  //     [e.target.name]: value,
  //   });
  // };

  return (
    <>
      <div className="mb-5">
        <TitleSection title="Mi perfil" />
      </div>
      <div className=" mt-10">
        <div className="bg-slate-400 w-32 aspect-square rounded-full overflow-hidden mx-auto relative">
          <img className="w-full h-full object-cover" src={user?.imageProfile} alt="" />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 text-[40px] flex justify-center items-center text-cp-primary opacity-0 transition hover:opacity-100 cursor-pointer">
            <FontAwesomeIcon icon={faCamera} />
          </div>
        </div>

        <div className="text-center mt-5">
          <p>{user?.fname} {user?.lname}</p>
          <p>{user?.email}</p>
          <p>{user?.phone}</p>
          {/* <a href="#" target="blank" className="text-cp-primary underline hover:text-cp-primary-hover transition">Link Whatsapp</a> */}
        </div>

        <hr className="w-full border-slate-500 my-7" />

        <div className="text-left">
          <h2 className="font-bold mb-7">Editar perfil</h2>
          <FormUpdateUser
            onClose={() => console.log('close')}
            defaultData={user}
          />
        </div>
      </div>
    </>
  );
}
