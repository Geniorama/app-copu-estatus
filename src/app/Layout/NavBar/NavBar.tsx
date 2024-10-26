"use client";

import Profile from "@/app/utilities/ui/Profile";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import type { User } from "@/app/types";
import useLogout from "@/app/hooks/useLogout";

export default function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const {userData} = useSelector((state:RootState) => state.user)
  const handleLogout = useLogout()

  useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

  useEffect(() => {
    if(userData){
      setUserInfo(userData)
    }
  },[userData])

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  

  return (
    <div className=" p-3 flex justify-between items-center border-b-slate-700 border border-black">
      <h1 className="text-md font-bold">Copu Estatus</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm">{userInfo?.fname}</span>
        <div className="relative" ref={menuRef}>
          <Profile image={userInfo?.imageProfile} onClick={() => setOpenMenu(!openMenu)} />
          {openMenu && (
            <nav className="absolute right-0 w-[200px] bg-slate-100 rounded-sm mt-2 shadow-md">
              <ul className="text-cp-dark text-sm">
                <li className="hover:bg-slate-200">
                  <Link className="block p-2 py-3" href="/dashboard/perfil">
                    Mi perfil
                  </Link>
                </li>
                <hr />
                <li className="hover:bg-slate-200">
                  <Link href={'#'} className="block p-2 py-3" onClick={(e) => handleLogout(e)}>
                    Cerrar sesión
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
