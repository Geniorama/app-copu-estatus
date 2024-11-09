import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { RootState } from "@/app/store";
import CardAction from "@/app/components/CardAction/CardAction";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import type { ChangeEvent } from "react";
import type { Company, TableDataProps } from "@/app/types";
import TitleSection from "@/app/utilities/ui/TitleSection";
import { useRouter } from "next/navigation";
import Spinner from "@/app/utilities/ui/Spinner";
import { useFetchCompanies } from "@/app/hooks/useFetchCompanies";
import BoxLogo from "@/app/utilities/ui/BoxLogo";
import ListServices from "@/app/utilities/ui/ListServices";
import LinkCP from "@/app/utilities/ui/LinkCP";

const headsTable = [
  "Logo",
  "Nombre empresa",
  "Grupo Whatsapp",
  "Servicios activos",
  "Última modificación",
];

export default function DashboardHome() {
  const [searchValue, setSearchValue] = useState("");
  const { userData } = useSelector((state: RootState) => state.user);
  const [tableData, setTableData] = useState<TableDataProps | null>(null);
  const [hasFetchedData, setHasFetchedData] = useState(false); // Control de si los datos fueron cargados
  const router = useRouter();

  const fetchServicesByCompany = useCallback(async (companyId: string) => {
    try {
      const response = await fetch(
        `/api/getServicesByCompany?companyId=${companyId}`
      );
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching services by company:", error);
      return [];
    }
  }, []);

  const { originalData, loading } = useFetchCompanies(
    userData,
    fetchServicesByCompany
  );

  useEffect(() => {
    if (!loading && originalData.length > 0) {
      const filteredData = originalData.filter((company) =>
        company?.name?.toLowerCase().includes(searchValue.toLowerCase())
      );

      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: filteredData.map((company: Company) => [
          <BoxLogo key={company.id} url={company.logo || ""} />,
          company.name,
          company.linkWhatsApp ? (
            <LinkCP
              rel="noopener noreferrer"
              target="_blank"
              href={company.linkWhatsApp}
            >
              {company.linkWhatsApp}
            </LinkCP>
          ) : (
            <span className="text-slate-400">No existe link del grupo</span>
          ),
          <ListServices key={company.id} services={company.services || null} />,
          company.updatedAt,
        ]),
      };

      setTableData(filteredData.length > 0 ? dataTable : null);
      setHasFetchedData(true); // Marcar que los datos han sido cargados
    }
  }, [loading, originalData, searchValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

  return (
    <div>
      <div className="mb-5">
        <TitleSection title="Home" />
      </div>
      <div className="grid grid-cols-4 gap-5">
        <CardAction
          onClick={() => router.push("/dashboard/usuarios")}
          title="Crear usuario"
          icon="user"
        />
        <CardAction
          onClick={() => router.push("/dashboard/companias")}
          title="Crear empresa"
          icon="company"
        />
        <CardAction
          onClick={() => router.push("/dashboard/servicios")}
          title="Crear servicio"
          icon="service"
        />
        <CardAction
          onClick={() => router.push("/dashboard/contenidos")}
          title="Crear contenido"
          icon="content"
        />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Mis empresas asignadas</h3>
          <div>
            <Search
              onReset={handleClearSearch}
              onChange={handleChange}
              value={searchValue}
            />
          </div>
        </div>

        {loading && !hasFetchedData ? (
          <div className="w-full h-[400px] flex justify-center items-center">
            <span className="text-8xl">
              <Spinner />
            </span>
          </div>
        ) : tableData ? (
          <Table data={tableData} />
        ) : (
          <div className="text-center p-5 mt-10 flex justify-center items-center">
            <p className="text-slate-400">
              No hay empresas asignadas <br /> o no hay coincidencias con la
              búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
