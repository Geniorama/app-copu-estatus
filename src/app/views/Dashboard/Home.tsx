"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "@/app/store";
import CardAction from "@/app/components/CardAction/CardAction";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import type { ChangeEvent } from "react";
import type { TableDataProps } from "@/app/types";
import TitleSection from "@/app/utilities/ui/TitleSection";
import { useRouter } from "next/navigation";
import { setUserData } from "@/app/store/features/userSlice";

const initialData: TableDataProps = {
  heads: ["ID", "Empresa", "Contacto", "Servicios", "Última modificación"],
  rows: [
    ["1", "Sancho BBDO", "Juan Pérez", "Servicio BBDO 1, Servicio BBDO 2", "1"],
    ["2", "Company XYZ", "Jane Doe", <a href='#' key={'link_example'} className='underline text-cp-primary'>Servicio XYZ</a>, "3"],
    ["3", "Sancho BBDO", "Juan Pérez", "Servicio BBDO 1, Servicio BBDO 2", "1"],
    ["4", "Company ABC", "Alice Smith", <a href='#' key={'link_example'} className='underline text-cp-primary'>Servicio ABC</a>, "2"],
  ],
};

export default function DashboardHome() {
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState<TableDataProps | null>(null);
  const { currentUser, userData } = useSelector((state: RootState) => state.user);
  const router = useRouter()
  const dispatch = useDispatch()

  const fetchUserData = async (auth0Id:string) => {
    try {
      const response = await fetch(`/api/user?auth0Id=${auth0Id}`);
  
      if (!response.ok) {
        throw new Error(`Error al obtener el usuario: ${response.statusText}`);
      }
  
      const userData = await response.json();
      console.log(userData); // Maneja los datos del usuario

      const transformData = {
        ...userData,
        fname: userData.firstName,
        lname: userData.lastName
      }
      dispatch(setUserData(transformData))
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };  

  useEffect(() => {
    if (currentUser) {
      setFilteredData(initialData); 
      fetchUserData(currentUser.user.sub)
    }
  }, [currentUser]);

  useEffect(() => {
    if (initialData && searchValue.trim()) {
      const filteredRows = initialData.rows.filter((row) =>
        row.some(
          (cell) =>
            typeof cell === "string" &&
            cell.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      setFilteredData(
        filteredRows.length > 0
          ? { heads: initialData.heads, rows: filteredRows }
          : null
      );
    } else {
      setFilteredData(initialData);
    }
  }, [searchValue, initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <div className="mb-5">
        <TitleSection title="Home" />
      </div>
      <div className="grid grid-cols-4 gap-5">
        <CardAction onClick={() => router.push('/dashboard/usuarios')} title="Crear usuario" icon="user" />
        <CardAction onClick={() => router.push('/dashboard/companias')} title="Crear empresa" icon="company" />
        <CardAction onClick={() => router.push('/dashboard/servicios')} title="Crear servicio" icon="service" />
        <CardAction onClick={() => router.push('/dashboard/contenidos')} title="Crear contenido" icon="content" />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Mis empresas asignadas</h3>
          <div>
            <Search onChange={handleChange} value={searchValue} />
          </div>
        </div>

        {filteredData ? (
          <Table data={filteredData} />
        ) : (
          <div className=" text-center p-5 mt-10 flex justify-center items-center">
            <p className="text-slate-400">No hay datos disponibles <br /> o no hay coincidencias con la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
