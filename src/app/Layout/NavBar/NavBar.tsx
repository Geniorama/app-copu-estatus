"use client";

import Profile from "@/app/utilities/ui/Profile";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

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
        <span className="text-sm">Venus María</span>
        <div className="relative" ref={menuRef}>
          <Profile image="https://img.freepik.com/psd-gratis/3d-ilustracion-persona-gafas-sol_23-2149436178.jpg?t=st=1729866108~exp=1729869708~hmac=c79f9f1e04e06651a4c2c99bada68ef8750803a3a9f91aaa35ccc72b7507e52e&w=826" onClick={() => setOpenMenu(!openMenu)} />
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
                  <Link className="block p-2 py-3" href="/api/auth/logout">
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
