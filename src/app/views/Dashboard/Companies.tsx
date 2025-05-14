"use client";

import { useState, useEffect, useRef } from "react";
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
import type { Company, User } from "@/app/types";
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
import { getAllUsers } from "@/app/utilities/helpers/fetchers";
import Label from "@/app/utilities/ui/Label";
import { addCompanyOption, removeCompanyOption, fetchCompaniesOptions } from "@/app/store/features/companiesSlice";
import { useDispatch } from "react-redux";
import type { ThunkDispatch, AnyAction } from "@reduxjs/toolkit";

interface FiltersProps {
  users?: { id: string; name: string }[];
}

const headsTable = [
  "Logo",
  "Nombre empresa",
  "Grupo Whatsapp",
  "Servicios activos",
  "Última modificación",
  "Estado",
  "Acciones",
];

export default function Companies() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);
  const [tableData, setTableData] = useState<TableDataProps | null>(null);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [success, setSuccess] = useState(false);
  const notify = (message: string) => toast(message);
  const searchParams = useSearchParams();
  const actionUrl = searchParams.get("action");
  const [filters, setFilters] = useState<FiltersProps>();
  const [usersAdmin, setUsersAdmin] = useState<User[]>([]);
  const [openMenuFilter, setOpenMenuFilter] = useState(false);
  const menuFilterRef = useRef<HTMLDivElement>(null);
  const [showItems, setShowItems] = useState(5);
  const [openFilterCompany, setOpenFilterCompany] = useState(false);
  const [openFilterService, setOpenFilterService] = useState(false);
  const [openFilterUser, setOpenFilterUser] = useState(false);

  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

  const fetchServicesByCompany = useFetchServicesByCompany();

  const {
    originalData,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchAllCompanyServices,
  } = useFetchCompanies(userData, fetchServicesByCompany, true, showItems);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchAllCompanyServices(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchAllCompanyServices(currentPage - 1);
    }
  };

  const toggleUserFilter = (userId: string) => {
    const user = usersAdmin.find((user) => user.id === userId);
    if (user && user.id) {
      const userFilter = filters?.users?.find(
        (userMap) => userMap.id === userId
      );
      if (userFilter) {
        setFilters({
          ...filters,
          users:
            filters?.users?.filter((userMap) => userMap.id !== userId) || [],
        });
      } else {
        setFilters({
          ...filters,
          users: [
            ...(filters?.users || []),
            {
              id: user.id,
              name: `${user.fname || ''} ${user.lname || ''}`,
            },
          ],
        });
      }
    }
  };

  useEffect(() => {
    dispatch(fetchCompaniesOptions());
  }, [dispatch]);

  useEffect(() => {
    if(openFilterCompany) {
      setOpenFilterService(false);
      setOpenFilterUser(false);
    }
  }, [openFilterCompany]);

  useEffect(() => {
    if(openFilterService) {
      setOpenFilterCompany(false);
      setOpenFilterUser(false);
    }
  }, [openFilterService]);

  useEffect(() => {
    if(openFilterUser) {
      setOpenFilterCompany(false);
      setOpenFilterService(false);
    }
  }, [openFilterUser]);

  useEffect(() => {
    if (success) {
      fetchAllCompanyServices(currentPage);
      setSuccess(false);
    }
  }, [success, fetchAllCompanyServices, currentPage]);

  useEffect(() => {
    if (!loading) {
      const dataTable: TableDataProps = {
        heads: headsTable,
        rows: rowsTable(originalData),
      };
      setTableData(originalData.length > 0 ? dataTable : null);
    }
  }, [loading, originalData]);

  useEffect(() => {
    if (actionUrl === "create") {
      setOpenModal(true);
    }
  }, [actionUrl]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers(100);
      if (result.users) {
        const usersAdmin = result.users.filter(
          (user: User) => user.role === "admin"
        );

        usersAdmin.sort((a: User, b: User) => {
          const nameA = `${a.fname} ${a.lname}`.toLowerCase();
          const nameB = `${b.fname} ${b.lname}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });

        setUsersAdmin(usersAdmin);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (filters?.users && filters.users.length > 0) {
      const usersSelected = filters.users.map((user) => user.id);
      const mapUsers = usersAdmin.filter((user): user is User & { id: string } => 
        typeof user.id === 'string' && usersSelected.includes(user.id)
      );

      const companyIds = new Set(
        mapUsers.flatMap((user) => user.companiesId || [])
      );

      const filteredCompanies = originalData.filter((company): company is Company & { id: string } => 
        typeof company.id === 'string' && companyIds.has(company.id)
      );

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
      rows: rowsTable(filteredData),
    };

    setTableData(filteredData.length > 0 ? dataTable : null);
  }, [searchValue, originalData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const exportToCSV = useExportCSV(
    originalData as Record<string, string | number>[],
    {
      name: "Nombre",
      linkWhatsApp: "Grupo WhatsApp",
      nit: "NIT",
      phone: "Teléfono",
      status: "Estado"
    },
    `companies-${new Date().toISOString()}`
  );

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleEditCompany = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    companyId?: string
  ) => {
    e.preventDefault();

    if (companyId) {
      const filterCompany = originalData.find(
        (company) => company.id === companyId
      );

      if (filterCompany) {
        setEditCompany(filterCompany);
        setOpenModal(true);
      }
    }
  };

  const handleShowItems = (value: string) => {
    setShowItems(parseInt(value));
    setCurrentPage(1);
    fetchAllCompanyServices(1);
  };

  const handleSwitch = async (companyId?: string) => {
    if (companyId) {
      const filterCompany = originalData.find(
        (company) => company.id === companyId
      );
      if (filterCompany) {
        const statusForUpdate = filterCompany.status

        const updatedCompany = {
          id: filterCompany.id,
          status: !statusForUpdate,
        };
        
        const response = await updateCompany(updatedCompany);
        
        if(response) {
          if(!statusForUpdate){
            dispatch(addCompanyOption({
              name: filterCompany.name,
              value: filterCompany.id
            }));
          } else {
            dispatch(removeCompanyOption({
              name: filterCompany.name,
              value: filterCompany.id
            }));
          }
          notify("Estado actualizado correctamente");
        }
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
      <Switch
        onClick={() => handleSwitch(company.id)}
        key={company.id}
        active={company.status || false}
      />,
      <LinkCP
        onClick={(e) => handleEditCompany(e, company.id)}
        key={company.id}
      >
        Editar
      </LinkCP>,
    ]);

    return filteredData;
  };

  const handleCreateCompany = (idCompany: string) => {
    console.log("New company id", idCompany);
    if (idCompany) {
      setSuccess(true);
      console.log("Company created");
    }
  };

  const onSubmitEditCompany = (idCompany: string) => {
    console.log("Edit company id", idCompany);
    if (idCompany) {
      setSuccess(true);
      console.log("success", success);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditCompany(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        menuFilterRef.current &&
        !menuFilterRef.current.contains(event.target as Node)
      ) {
        setOpenMenuFilter(false);
      }
    };

    if (openMenuFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuFilter]);

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
          action={editCompany ? "edit" : "create"}
        />
      </Modal>

      <div className="mb-5">
        <TitleSection title="Compañías" />
      </div>
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        <Button
          onClick={() => {
            setEditCompany(null);
            setOpenModal(true);
          }}
          mode="cp-green"
          fullWidthMobile
        >
          <span className="mr-3">Nueva compañía</span>
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <div className="flex flex-col lg:flex-row gap-6 items-center mt-4 lg:mt-0">
          <LinkCP onClick={exportToCSV} href="#">
            Exportar CSV
          </LinkCP>
          <Search
            onReset={handleClearSearch}
            onChange={handleChange}
            value={searchValue}
          />
          <div className="relative w-full lg:w-auto" ref={menuFilterRef}>
            <Button
              onClick={() => setOpenMenuFilter(!openMenuFilter)}
              mode={`${
                filters?.users && filters?.users?.length > 0
                  ? "cp-green"
                  : "cp-dark"
              }`}
              fullWidthMobile
            >
              <FontAwesomeIcon className="mr-2" icon={faFilter} />
              <span className="block">Filtros</span>
            </Button>
            {openMenuFilter && (
              <div className="bg-cp-light absolute right-0 p-4 min-w-64 rounded-md text-cp-dark text-sm z-50 top-12">
                {usersAdmin.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-600 text-md">
                      Ejecutiva/o
                    </span>
                    <hr className="my-2" />
                    <div className="space-y-2">
                      {usersAdmin.map((user: User) => {
                        if (typeof user.id !== 'string') return null;
                        const userId = user.id;
                        return (
                          <div
                            onClick={() => toggleUserFilter(userId)}
                            key={userId}
                            className="flex items-center gap-2 cursor-pointer hover:opacity-60"
                          >
                            <span
                              className={`w-3 h-3 block border rounded-sm shadow-sm ${
                                filters?.users?.find(
                                  (userMap) => userMap.id === userId
                                )
                                  ? "bg-cp-primary border-cp-primary"
                                  : "border-slate-400"
                              }`}
                            ></span>
                            <span>
                              {user.fname || ''} {user.lname || ''}
                            </span>
                          </div>
                        );
                      })}
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
          <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
            {totalPages > 1 &&
              (!filters?.users ||
                (filters.users !== undefined && filters.users.length < 1)) && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onNext={nextPage}
                  onPrev={prevPage}
                  setCurrentPage={setCurrentPage}
                />
              )}

            <div className="flex items-center gap-3">
              <Label className="text-xs" mode="cp-light" htmlFor="showItems">
                Mostrar
              </Label>
              <select
                name="showItems"
                id="showItems"
                onChange={(e) => handleShowItems(e.target.value)}
                value={showItems.toString()}
                className="text-xs bg-black text-white p-1 rounded-sm border border-slate-300"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
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
