"use client";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/app/store";
import CardAction from "@/app/components/CardAction/CardAction";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";

export default function DashboardHome() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (currentUser) {
      console.log("Current user dashboard:", currentUser);
    }
  }, [currentUser]);

  const tableData = {
    heads: ["ID", "Company", "Contact", "Services", "Quantity"],
    rows: [
      [
        "1",
        "Sancho BBDO",
        "Juan Pérez",
        "Servicio BBDO 1, Servicio BBDO 2",
        "1",
      ],
      ["2", "Company XYZ", "Jane Doe", "<a href='' class='underline text-cp-primary'>Servicio XYZ</a>", "3"],
      // más filas
    ],
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-5">
        <CardAction title="Crear usuario" icon="user" />
        <CardAction title="Crear empresa" icon="company" />
        <CardAction title="Crear servicio" icon="service" />
        <CardAction title="Crear contenido" icon="content" />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Mis empresas asignadas</h3>
          <div>
            <Search />
          </div>
        </div>

        <Table data={tableData} />
      </div>
    </div>
  );
}
