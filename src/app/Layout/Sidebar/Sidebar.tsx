"use client";

import Link from "next/link";
import { menuDashboard } from "@/app/utilities/data/menus/menuDashboard";
import { usePathname } from "next/navigation";
import Logo from "@/app/utilities/ui/Logo";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="p-8 h-full flex flex-col justify-between">
      <div>
        <div className="px-10">
            <Logo mode="cp-primary-light" />
        </div>
        <hr className="border-slate-600 my-5" />

        <nav className="mt-10">
          <ul>
            {menuDashboard.map((item) => (
              <>
                <li>
                  <Link
                    href={item.path || "/"}
                    className={`tracking-wide hover:text-cp-primary transition active:text-cp-primary ${
                      pathname === item.path && "text-cp-primary"
                    }`}
                  >
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
        <Link className="text-slate-300 hover:text-cp-primary-hover" href={"/api/auth/logout"}>Cerrar sesión</Link>
      </div>
    </div>
  );
}
