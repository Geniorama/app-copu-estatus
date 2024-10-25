"use client";

import Link from "next/link";
import { menuDashboard } from "@/app/utilities/data/menus/menuDashboard";
import { usePathname } from "next/navigation";
import Logo from "@/app/utilities/ui/Logo";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { resetCurrentUser } from "@/app/store/features/userSlice";

export default function Sidebar() {
  const [menuData, setMenuData] = useState(menuDashboard)
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const dispatch = useDispatch()


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

  const handleLogout = (e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    e.preventDefault()
    dispatch(resetCurrentUser())
    router.push('/api/auth/logout')
  }

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
          href={"#"}
          onClick={(e) => handleLogout(e)}
        >
          Cerrar sesión
        </Link>
      </div>
    </div>
  );
}
