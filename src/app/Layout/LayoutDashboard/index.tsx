import Sidebar from "../Sidebar/Sidebar";
import NavBar from "../NavBar/NavBar";
import Content from "../Content/Content";
import { ReactNode } from "react";

interface LayoutDashboardProps {
  children: ReactNode;
}

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/6 border border-r-slate-700 border-black">
        <Sidebar />
      </div>
      <div className="w-5/6 text-cp-light bg-black">
        <NavBar />
        <Content>
          {children}
        </Content>
      </div>
    </div>
  );
}
