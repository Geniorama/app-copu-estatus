"use client";

import Link from "next/link";
import { menuDashboard } from "@/app/utilities/data/menus/menuDashboard";
import { usePathname } from "next/navigation";
import Logo from "@/app/utilities/ui/Logo";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useState, useEffect } from "react";
import useLogout from "@/app/hooks/useLogout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { setSidebarShow } from "@/app/store/features/settingsSlice";
import { useDispatch } from "react-redux";

export default function Sidebar() {
  const [menuData, setMenuData] = useState(menuDashboard)
  const pathname = usePathname();
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state: RootState) => state.user)
  
  const handleLogout = useLogout()

  const closeSidebar = () => {
    dispatch(setSidebarShow(false))
  }

  useEffect(() => {
    if(currentUser){
      const userRoleUri = `${process.env.NEXT_PUBLIC_ROLE_URL}`;
      const role =  currentUser.user[userRoleUri]
      if(role === 'cliente'){
        const updatedMenu = menuDashboard.filter((item) => item.path !== '/dashboard/usuarios')

        setMenuData(updatedMenu)
      }
    }
  },[currentUser])

  return (
    <div className="p-8 h-full flex flex-col justify-between">
      <div>
        <div className="px-10 relative">
          <Logo mode="cp-primary-light" />
          <button className=" absolute -right-4 -top-4 text-2xl lg:hidden" onClick={closeSidebar}>
            <FontAwesomeIcon icon={faClose} className="text-slate-300" />
          </button>
        </div>
        <hr className="border-slate-600 my-5" />

        <nav className="mt-10">
          <ul>
            {menuData.map((item) => (
              <>
                <li >
                  <Link
                    href={item.path || "/"}
                    className={`tracking-wide block hover:text-cp-primary transition active:text-cp-primary py-4 2xl:py-6 ${
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
                <hr className="border-slate-600" />
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
