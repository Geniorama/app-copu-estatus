import Sidebar from "../Sidebar/Sidebar";
import NavBar from "../NavBar/NavBar";
import Content from "../Content/Content";
import Footer from "../Footer/Footer";
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
      <div className="w-5/6 text-slate-300 bg-black h-full flex flex-col justify-between">
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
