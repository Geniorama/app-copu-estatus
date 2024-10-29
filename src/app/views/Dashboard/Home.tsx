"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "@/app/store";
import CardAction from "@/app/components/CardAction/CardAction";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import type { ChangeEvent } from "react";
import type { Company, TableDataProps } from "@/app/types";
import TitleSection from "@/app/utilities/ui/TitleSection";
import { useRouter } from "next/navigation";
import { useFetchUserData } from "@/app/hooks/useFetchUserData";
import { useApiData } from "@/app/hooks/useApiData";
import Spinner from "@/app/utilities/ui/Spinner";

const initialData: TableDataProps = {
  heads: ["ID", "Empresa", "Contacto", "Servicios", "Última modificación"],
  rows: [
    ["1", "Sancho BBDO", "Juan Pérez", "Servicio BBDO 1, Servicio BBDO 2", "1"],
    ["2", "Company XYZ", "Jane Doe", <a href='#' key={'link_example'} className='underline text-cp-primary'>Servicio XYZ</a>, "3"],
    ["3", "Sancho BBDO", "Juan Pérez", "Servicio BBDO 1, Servicio BBDO 2", "1"],
    ["4", "Company ABC", "Alice Smith", <a href='#' key={'link_example'} className='underline text-cp-primary'>Servicio ABC</a>, "2"],
  ],
};

const headsTable = [
  "Logo",
  "Nombre empresa",
  "Teléfono",
];

export default function DashboardHome() {
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState<TableDataProps | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [tableData, setTableData] = useState<TableDataProps | null>(null);
  const [originalData, setOriginalData] = useState<Company[]>([]);
  const router = useRouter()
  const fetchUserData  = useFetchUserData()
  const { fetchData, loading } = useApiData();

  const LogoBox = (url:string) => {
    return(
      <div className="w-11 aspect-square rounded-full overflow-hidden bg-slate-950">
        {url && (
          <img src={url} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        )}
      </div>
    )
  }

  useEffect(() => {
    if (currentUser) { 
      fetchUserData(currentUser.user.sub)
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchCompanies = async() => {
      try {
        const companiesData = await fetchData("/api/companies");
        const transformData:Company[] = companiesData.map((company:any) => ({
          id: company.sys.id,
          name: company.fields.name?.["en-US"],
          logo: company.fields.logo?.["en-US"],
          phone: company.fields.phone?.["en-US"],
        }))

        console.log('companies data', transformData)

        const dataTable:TableDataProps = {
          heads: headsTable,
          rows: transformData.map((company: Company) => [
            LogoBox(company.logo || ''),
            company.name,
            company.phone
          ])
        } 

        setOriginalData(transformData)
        setTableData(dataTable)

      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }

    fetchCompanies()
  },[])

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

  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Home" />
        </div>
        <div className="w-full h-[70vh] flex justify-center items-center">
          <span className="text-8xl">
            <Spinner />
          </span>
        </div>
      </div>
    );
  }

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

        {tableData ? (
          <Table data={tableData} />
        ) : (
          <div className=" text-center p-5 mt-10 flex justify-center items-center">
            <p className="text-slate-400">No hay datos disponibles <br /> o no hay coincidencias con la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
