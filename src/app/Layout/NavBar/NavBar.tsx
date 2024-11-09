"use client";

import Profile from "@/app/utilities/ui/Profile";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import type { User } from "@/app/types";
import useLogout from "@/app/hooks/useLogout";
import { useDispatch } from "react-redux";
import { setUserData } from "@/app/store/features/userSlice";
import { getUserByAuth0Id } from "@/app/utilities/helpers/fetchers";

export default function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const { currentUser, userData } = useSelector(
    (state: RootState) => state.user
  );
  const handleLogout = useLogout();

  useEffect(() => {
    if (currentUser) {
      const auth0Id = currentUser.user.sub;
      if (auth0Id) {
        const fetchUser = async () => {
          const response = await getUserByAuth0Id(currentUser.user.sub);
          if (response) {
            const transformData:User = {
              id: '',
              fname: response.firstName['en-US'],
              lname: response.lastName['en-US'],
              position: response.position['en-US'],
              email: response.email['en-US'],
              phone: response.phone['en-US'],
              role: response.role['en-US'],
              imageProfile: response.imageProfile['en-US'],
              companies: response.company['en-US'],
              companiesId: response.company['en-US'].map((company:any) => (company.sys.id))
            }
            dispatch(setUserData(transformData));
          }
        };

        fetchUser();
      }
    }
  }, [currentUser, dispatch]);

  const handleClickOutside = useCallback((event: Event) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenu(false);
    }
  }, []);

  useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="p-3 flex justify-between items-center border-b-slate-700 border border-black">
      <h1 className="text-md font-bold">Copu Estatus</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm">{userData?.fname}</span>
        <div className="relative" ref={menuRef}>
          <Profile
            image={userData?.imageProfile}
            onClick={() => setOpenMenu(!openMenu)}
          />
          {openMenu && (
            <nav className="absolute right-0 w-[200px] bg-slate-100 rounded-sm mt-2 shadow-md z-50">
              <ul className="text-cp-dark text-sm">
                <li className="hover:bg-slate-200">
                  <Link className="block p-2 py-3" href="/dashboard/perfil">
                    Mi perfil
                  </Link>
                </li>
                <hr />
                <li className="hover:bg-slate-200">
                  <Link
                    href={"#"}
                    className="block p-2 py-3"
                    onClick={(e) => handleLogout(e)}
                  >
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
