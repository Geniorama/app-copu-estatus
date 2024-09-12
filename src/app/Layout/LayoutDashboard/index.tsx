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
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="w-5/6 bg-cp-light text-cp-dark">
        <NavBar />
        <Content>
          {children}
        </Content>
      </div>
    </div>
  );
}
