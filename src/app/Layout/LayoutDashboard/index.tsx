"use client"

import Sidebar from "../Sidebar/Sidebar";
import NavBar from "../NavBar/NavBar";
import Content from "../Content/Content";
import Footer from "../Footer/Footer";
import { ReactNode } from "react";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSidebarShow } from "@/app/store/features/settingsSlice";
import { usePathname } from "next/navigation";

interface LayoutDashboardProps {
  children: ReactNode;
}

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  const { sidebarShow } = useSelector((state: RootState) => state.settings)
  const dispatch = useDispatch()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const isMobile = window.innerWidth < 1024
    if (isMobile) {
      const handleClickOutside = (event: Event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
          dispatch(setSidebarShow(false))
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [sidebarRef, dispatch])

  useEffect(() => {
    const isMobile = window.innerWidth < 1024
    if (isMobile) {
      dispatch(setSidebarShow(false))
    }
  }, [pathname, dispatch])

  return (
    <div className="w-screen md:h-screen flex overflow-x-hidden">
      {sidebarShow && (
        <div ref={sidebarRef} className=" fixed lg:relative lg:w-1/6 border border-r-slate-700 border-black z-50 h-full bg-black">
          <Sidebar />
        </div>
      )}
      <div className="w-full lg:w-[82%] text-slate-300 bg-black lg:h-full flex flex-col justify-between box-border">
        <div>
          <NavBar />
          <Content>{children}</Content>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
