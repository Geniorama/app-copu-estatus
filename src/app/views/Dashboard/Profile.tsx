"use client";

import { useEffect, useState, useRef } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faUser } from "@fortawesome/free-solid-svg-icons";
import type { User } from "@/app/types";
import FormUpdateUser from "@/app/components/Form/FormUpdateUser";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const { userData } = useSelector((state: RootState) => state.user);

  const imageProfileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  return (
    <>
      <div className="mb-5">
        <TitleSection title="Mi perfil" />
      </div>
      <div className=" mt-10">
        <div>
          <div className="bg-slate-400 w-32 aspect-square rounded-full overflow-hidden mx-auto relative">
            {user?.imageProfile ? (
              <img
                className="w-full h-full object-cover"
                src={user?.imageProfile}
                alt=""
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center text-6xl">
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 text-[40px] flex justify-center items-center text-cp-primary opacity-0 transition hover:opacity-100 cursor-pointer">
              <FontAwesomeIcon icon={faCamera} />
            </div>
          </div>
          <input ref={imageProfileRef} className=" hidden" type="file" name="" id="" />
        </div>

        <div className="text-center mt-5">
          <p>
            {user?.fname} {user?.lname}
          </p>
          <p>{user?.email}</p>
          <p>{user?.phone}</p>
          <a
            href="#"
            target="blank"
            className="text-cp-primary underline hover:text-cp-primary-hover transition"
          >
            Cambiar contraseña
          </a>
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
