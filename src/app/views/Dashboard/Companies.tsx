"use client";

import { useState, useEffect } from "react";
import Button from "@/app/utilities/ui/Button";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import LinkCP from "@/app/utilities/ui/LinkCP";
import Modal from "@/app/components/Modal/Modal";
import FormCreateCompany from "@/app/components/Form/FormCreateCompany";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { TableDataProps } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import { useFetchCompanies } from "@/app/hooks/useFetchCompanies";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import BoxLogo from "@/app/utilities/ui/BoxLogo";
import ListServices from "@/app/utilities/ui/ListServices";
import type { Company } from "@/app/types";
import Spinner from "@/app/utilities/ui/Spinner";
import Switch from "@/app/utilities/ui/Switch";
import type { MouseEvent } from "react";
import { updateCompany } from "@/app/utilities/helpers/fetchers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useExportCSV from "@/app/hooks/useExportCSV";
import { useSearchParams } from "next/navigation";
import Pagination from "@/app/components/Pagination/Pagination";
import { useFetchServicesByCompany } from "@/app/hooks/useFetchServicesByCompany";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { getUsersByCompanyId } from "@/app/utilities/helpers/fetchers";
import { Entry } from "contentful-management";

interface FiltersProps {
  users?: {id: string, name: string}[]
}

export default function Companies() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);
  const [tableData, setTableData] = useState<TableDataProps | null>(null);
  const [editCompany, setEditCompany] = useState<Company | null>(null)
  const [success, setSuccess] = useState(false)
  const notify = (message: string) => toast(message);
  const searchParams = useSearchParams();
  const actionUrl = searchParams.get('action')
  const [filters, setFilters] = useState<FiltersProps>()
  const [usersAdmin, setUsersAdmin] = useState<Entry[]>([])
  const [openMenuFilter, setOpenMenuFilter] = useState(false)

  const headsTable = [
    "Logo",
    "Nombre empresa",
    "Grupo Whatsapp",
    "Servicios activos",
    "Última modificación",
    "Estado",
    "Acciones",
  ];

  const fetchServicesByCompany = useFetchServicesByCompany()

  const { originalData, loading, currentPage, setCurrentPage, totalPages } = useFetchCompanies(
    userData,
    fetchServicesByCompany,
    true,
    6
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  } 

  const toggleUserFilter = (userId: string) => {
    const user = usersAdmin.find((user) => user.sys.id === userId);
    if (user) {
      const userFilter = filters?.users?.find((userMap) => userMap.id === userId);
      if (userFilter) {
        setFilters({
          ...filters,
          users: filters?.users?.filter((userMap) => userMap.id !== userId) || []
        });
      } else {
        setFilters({
          ...filters,
          users: [...(filters?.users || []), { id: user.sys.id, name: `${user.fields.firstName["en-US"]} ${user.fields.lastName["en-US"]}` }]
        });
      }
    }
  };

  const fetchUsersByCompany = async (companyId: string) => {
    const response = await getUsersByCompanyId(companyId); 
    if(response){
      return response
    }
  }

  useEffect(() => {
    if (!loading) {
      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: rowsTable(originalData),
      };
  
      setTableData(originalData.length > 0 ? dataTable : null);
  
      console.log("originalData", originalData);
  
      if (originalData.length > 0) {
        const fetchUsers = async () => {
          const usersByCompany = await Promise.all(
            originalData.map(async (company) =>
              company.id ? fetchUsersByCompany(company.id) : null
            )
          );
  
          // Flatten the array and filter out duplicates
          const allUsers = usersByCompany.flat().filter(Boolean);
          console.log("allUsers", allUsers);
  
          // Use a Map to remove duplicates
          const userMap = new Map();
          allUsers.forEach(user => {
            if (user && user.sys.id) {
              userMap.set(user.sys.id, user);
            }
          });
  
          const uniqueUsers = Array.from(userMap.values());
          if(uniqueUsers.length > 0){
            const uniqueUsersAdmin = uniqueUsers.filter((user) => user.fields.role["en-US"].includes("admin"));
            setUsersAdmin(uniqueUsersAdmin);
          }
        };
  
        fetchUsers();
      }
    }
  }, [loading, originalData, currentPage, success]);
  

  useEffect(() => {
    if(actionUrl === "create"){
      setOpenModal(true)
    }
  }, [actionUrl])

  useEffect(() => {
    if (filters?.users && filters.users.length > 0) {
      console.log('filters', filters);
      const usersSelected = filters.users.map((user) => user.id);
      const mapUsers = usersAdmin.filter((user) => usersSelected.includes(user.sys.id));
      console.log('mapUsers', mapUsers);
  
      // Obtener los IDs de las compañías de los usuarios seleccionados
      const companyIds = new Set(
        mapUsers.flatMap((user) => user.fields.company["en-US"].map((company:Entry) => company.sys.id))
      );
  
      // Filtrar las compañías originales utilizando los IDs obtenidos
      const filteredCompanies = originalData.filter((company) => companyIds.has(company.id));
      console.log('filteredCompanies', filteredCompanies);
  
      // Actualizar los datos de la tabla con las compañías filtradas
      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: rowsTable(filteredCompanies),
      };
  
      setTableData(filteredCompanies.length > 0 ? dataTable : null);
    } else {
      // Si no hay filtros, mostrar todas las compañías
      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: rowsTable(originalData),
      };
  
      setTableData(originalData.length > 0 ? dataTable : null);
    }
  }, [filters, originalData, currentPage]);

  useEffect(() => {
    const filteredData = originalData.filter((company) =>
      company?.name?.toLowerCase().includes(searchValue.toLowerCase())
    );

    const dataTable: TableDataProps = {
      heads: headsTable,
      rows: rowsTable(filteredData)
    };

    setTableData(filteredData.length > 0 ? dataTable : null);
  }, [searchValue, originalData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const exportToCSV = useExportCSV(originalData as Record<string, string | number>[], ["name", "linkWhatsApp", "nit", "phone", "status"], `companies-${new Date().toISOString()}`)

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleEditCompany = (e:MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, companyId?:string) => {
    e.preventDefault()
    
    if(companyId){
      const filterCompany = originalData.find((company) => company.id === companyId)

      console.log('originalData', originalData)
      console.log('filterCompany', filterCompany)
      if(filterCompany){
        setEditCompany(filterCompany)
        setOpenModal(true)
      }
    }
  }

  const handleSwitch = async (companyId?: string) => {
    if (companyId) {
      const filterCompany = originalData.find((company) => company.id === companyId);
      console.log(filterCompany)
      if (filterCompany) {
        const updatedCompany = {
          id: filterCompany.id,
          status: !filterCompany.status,
        };
        console.log(updatedCompany)
        const response = await updateCompany(updatedCompany);
        console.log(response)
        notify("Compañía actualizada");
      }
    }
  };

  const rowsTable = (data: Company[]) => {
    const filteredData = data.map((company: Company) => [
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
      <ListServices key={company.id} services={company.services} />,
      company.updatedAt,
      <Switch onClick={() => handleSwitch(company.id)} key={company.id} active={company.status || false} />,
      <LinkCP onClick={(e) => handleEditCompany(e, company.id)} key={company.id}>
        Editar
      </LinkCP>
    ]);

    return filteredData
  };

  const handleCreateCompany = (idCompany: string) => {
    console.log("New company id", idCompany);
    if(idCompany){
      setSuccess(true)
    }
  };
  
  const onSubmitEditCompany = (idCompany: string) => {
    console.log("New company id", idCompany);
    if(idCompany){
      setSuccess(true)
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setEditCompany(null)
  }

  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Compañías" />
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
      <ToastContainer
        toastStyle={{ fontFamily: "inherit" }}
        progressClassName={"custom-progress-bar"}
      />
      <Modal open={openModal} onClose={handleCloseModal}>
        <FormCreateCompany
          onClose={() => setOpenModal(false)}
          onSubmit={editCompany ? onSubmitEditCompany : handleCreateCompany}
          currentCompany={editCompany}
          action={editCompany ? 'edit': 'create'}
        />
      </Modal>

      <div className="mb-5">
        <TitleSection title="Compañías" />
      </div>
      <div className="flex gap-3 items-center justify-between">
        <Button onClick={() => { setEditCompany(null); setOpenModal(true);}} mode="cp-green">
          <span className="mr-3">Nueva compañía</span>
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <div className="flex gap-6 items-center">
          <LinkCP onClick={exportToCSV} href="#">Exportar CSV</LinkCP>
          <Search
            onReset={handleClearSearch}
            onChange={handleChange}
            value={searchValue}
          />
          <div className="relative">
            <Button onClick={() => setOpenMenuFilter(!openMenuFilter)} mode={`${filters?.users && filters?.users?.length > 0 ? 'cp-green' : 'cp-dark'}`}>
              <FontAwesomeIcon className="mr-2" icon={faFilter}/>
              <span className="block">Filtros</span>
              {/* <span className="w-5 h-5 bg-black inline-flex justify-center items-center ml-2 text-xs rounded-[50%]">3</span> */}
            </Button>
            {openMenuFilter && (
              <div className="bg-cp-light absolute right-0 p-4 min-w-64 rounded-md text-cp-dark text-sm z-50 top-12">
                {usersAdmin.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-600 text-md">Ejecutiva/o</span>
                    <hr className="my-2" />
                    <div className="space-y-2">
                      {usersAdmin.map((user) => (
                        <div onClick={() => toggleUserFilter(user.sys.id)} key={user.sys.id} className=" flex items-center gap-2 cursor-pointer hover:opacity-60">
                          <span className={`w-3 h-3 block border  rounded-sm shadow-sm ${filters?.users?.find((userMap) => userMap.id === user.sys.id) ? "bg-cp-primary border-cp-primary" : "border-slate-400"}`}></span>
                          <span>{user.fields.firstName["en-US"]} {user.fields.lastName["en-US"]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {tableData ? (
        <>
          <Table data={tableData} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            onNext={nextPage}
            onPrev={prevPage}
          />
        </>
      ) : (
        <div className="text-center p-5 mt-10 flex justify-center items-center">
          <p className="text-slate-400">
            No hay datos disponibles o no hay coincidencias con la búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}
