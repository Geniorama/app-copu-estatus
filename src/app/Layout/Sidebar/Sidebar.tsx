"use client";

import Link from "next/link";
import { menuDashboard } from "@/app/utilities/data/menus/menuDashboard";
import { usePathname } from "next/navigation";
import Logo from "@/app/utilities/ui/Logo";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [menuData, setMenuData] = useState(menuDashboard)
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.user)


  useEffect(() => {
    if(currentUser){
      const userRoleUri = "https://localhost:3000/roles";
      const role =  currentUser.user[userRoleUri]

      console.log(currentUser.user)
      
      if(role === 'cliente'){
        const updatedMenu = menuDashboard.filter((item) => item.path !== '/dashboard/usuarios')

        setMenuData(updatedMenu)
      }
    }
  },[currentUser])

  return (
    <div className="p-8 h-full flex flex-col justify-between">
      <div>
        <div className="px-10">
          <Logo mode="cp-primary-light" />
        </div>
        <hr className="border-slate-600 my-5" />

        <nav className="mt-10">
          <ul>
            {menuData.map((item) => (
              <>
                <li>
                  <Link
                    href={item.path || "/"}
                    className={`tracking-wide hover:text-cp-primary transition active:text-cp-primary ${
                      pathname === item.path && "text-cp-primary"
                    }`}
                  >
                    {item.icon && (
                      <span className="text-sm mr-2">
                        {item.icon}
                      </span>
                    )}
                    {item.name}
                  </Link>
                </li>
                <hr className="border-slate-600 my-6" />
              </>
            ))}
          </ul>
        </nav>
      </div>

      {/* BOTTOM SIDEBAR */}
      <div>
        <Link
          className="text-slate-300 hover:text-cp-primary-hover"
          href={"/api/auth/logout"}
        >
          Cerrar sesión
        </Link>
      </div>
    </div>
  );
}
