"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/app/utilities/ui/Button";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import LinkCP from "@/app/utilities/ui/LinkCP";
import Modal from "@/app/components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faList, faTable } from "@fortawesome/free-solid-svg-icons";
import type { Content, OptionSelect, TableDataProps, User } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
// import FilterContentBar from "../../components/FilterContentBar/FilterContentBar";
import FormCreateContent from "@/app/components/Form/FormCreateContent";
import Spinner from "@/app/utilities/ui/Spinner";
import { actionOptions } from "@/app/components/Form/FormCreateContent";
import { formattedDate } from "@/app/utilities/helpers/formatters";
import { fetchCompaniesOptions } from "@/app/store/features/companiesSlice";
import { AppDispatch } from "@/app/store";
import { useDispatch } from "react-redux";
import { useFetchServices } from "@/app/hooks/useFetchServices";
import type { ServiceOptionsProps } from "../../components/FilterContentBar/FilterContentBar";
// import type { FilterDataProps } from "@/app/types";
import useExportCSV from "@/app/hooks/useExportCSV";
import { truncateText } from "@/app/utilities/helpers/formatters";
import { useSearchParams } from "next/navigation";
import { formatNumber } from "@/app/utilities/helpers/formatters";
import { useFetchAllContents } from "@/app/hooks/useFetchAllContents";
import Pagination from "@/app/components/Pagination/Pagination";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import Label from "@/app/utilities/ui/Label";
import SkeletonLoader from "@/app/utilities/ui/SkeletonLoader";

interface FiltersProps {
  companiesIds?: string[];
  servicesIds?: string[];
  usersIds?: string[];
}

interface ServiceCountProps {
  post: number,
  web: number
}

export default function Contents() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [contents, setContents] = useState<TableDataProps | null>({
    heads: [],
    rows: [],
  });
  const [hasUpdate, setHasUpdate] = useState(false);
  const [postWebCount, setPostWebCount] = useState(0);
  const [postSocialCount, setPostSocialCount] = useState(0);
  // const [optionsServices, setOptionsServices] = useState<ServiceOptionsProps[] | null>(null);
  const [originalData, setOriginalData] = useState<Content[] | null>(null);
  const [filters, setFilters] = useState<FiltersProps>();
  // const [filteredData, setFilteredData] = useState<Content[] | null>(null);
  const [editContent, setEditContent] = useState<Content | null>(null);
  const [openMenuFilter, setOpenMenuFilter] = useState(false);
  const [usersAdmin, setUsersAdmin] = useState<User[]>([]);
  const [openFilterUser, setOpenFilterUser] = useState(false);
  const [showFullView, setShowFullView] = useState(false);
  const [loadingCount, setLoadingCount] = useState(false)

  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const actionUrl = searchParams.get("action");
  const menuFilterRef = useRef<HTMLDivElement>(null);
  const [openFilterCompany, setOpenFilterCompany] = useState(false);
  const [openFilterService, setOpenFilterService] = useState(false);
  const [showItems, setShowItems] = useState(5);

  const headsTableCompact = [
    "Compañía",
    "Titular",
    "Fecha Publicación",
    "",
  ];

  const headsTableFull = [
    "Compañía",
    "Tipo acción",
    "Titular",
    "Fecha Publicación",
    "Alcance",
    "Impresiones",
    "Interacciones",
    "Web",
    "IG",
    "FB",
    "LK",
    "X",
    "TK",
    "YT",
    "TH",
    "",
  ];

  const showSocialLink = (link?: string) => {
    if (link) {
      return (
        <LinkCP target="_blank" href={link}>
          Link
        </LinkCP>
      );
    }

    return <p className="text-slate-400">N/A</p>;
  };


  // 4M04OTBWMMxA7G1f0BTmgh - dentsu

  const getContentsCountByService = async () => {
    let fetchApi

    if ((filters?.companiesIds ?? []).length > 0) {
      return;
    }

    if(!filters || (!filters?.servicesIds || filters.servicesIds?.length < 1)){
      fetchApi = "/api/content/count"
    } else {
      const strServices = (filters.servicesIds).toString()
      fetchApi = `/api/content/count?serviceIds=${strServices}`
    }

    if(fetchApi){
      const res = await fetch(fetchApi)
      if(res.ok){
        const data = await res.json()
        const contents:ServiceCountProps[] = data.countByServiceAndType;

        console.log('contents', contents)

        // Agrupar todos los tipos "web" y "post"
        let totalWeb = 0;
        let totalPost = 0;

        Object.values(contents).forEach((service) => {
          totalWeb += service.web;
          totalPost += service.post;
        });

        // Puedes actualizar el estado o realizar otras acciones con los totales
        setPostWebCount(totalWeb);
        setPostSocialCount(totalPost);
        setLoadingCount(false)
      }
    }
  }

  const getContentsCountByCompany = async() => {
    if(!filters || (!filters?.companiesIds || filters.companiesIds?.length < 1)){
      return
    }

    const strCompanies = (filters.companiesIds).toString()
    const res = await fetch(`/api/content/countByCompany?companyIds=${strCompanies}`)
    if(res.ok){
      const data = await res.json()
      const contents:{web: number, post: number} = data.countByType;
      
      setPostWebCount(contents.web);
      setPostSocialCount(contents.post);
      setLoadingCount(false)
    }
  }

  const { options: companiesData } = useSelector(
    (state: RootState) => state.companies
  );
  const { dataServices, loading: loadingServices } = useFetchServices({
    hasUpdate,
    itemsPerPage: 100,
  });

  useEffect(() => {
    dispatch(fetchCompaniesOptions());
  }, []);

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
    const fetchUsersAdmin = async () => {
      try {
        const res = await fetch('/api/users?role=admin');
        if (res.ok) {
          const data = await res.json();
          setUsersAdmin(data.users);
        }
      } catch (error) {
        console.error('Error fetching admin users:', error);
      }
    };

    fetchUsersAdmin();
  }, []);

  useEffect(() => {
    if (dataServices && !loadingServices) {
      const options: ServiceOptionsProps[] = dataServices.map((service) => ({
        value: service.id || "",
        name: service.name,
        companyId: service.companyId || "",
      }));

      if (options) {
        console.log("options services", options);
        // setOptionsServices(options);
      }
    }
  }, [dataServices, loadingServices]);

  useEffect(() => {
    if (actionUrl === "create") {
      setOpenModal(true);
    }
  }, [actionUrl]);

  const handleEditContent = (contentId?: string) => {
    if (!contentId || !originalData) {
      console.log("No content ID or originalData is not available");
      return;
    }
    const content = originalData?.find((content) => content.id === contentId);

    if (content) {
      setEditContent(content);
      setOpenModal(true);
    }
  };

  const rowsTableCompact = (data: Content[]) => {
    const result = data.map((content) => [
      content.companyName || "Sin compañía",
      <p title={content.headline} key={content.id}>
        {truncateText(content.headline || "", 30)}
      </p>,
      formattedDate(content.publicationDate),
      <LinkCP onClick={() => handleEditContent(content.id)} key={content.id}>
        Editar
      </LinkCP>,
    ]);

    return result;
  };

  const rowsTableFull = (data: Content[]) => {
    const result = data.map((content) => [
      content.companyName || "Sin compañía",
      actionOptions.find((option) => option.value === content.type)?.name,
      <p title={content.headline} key={content.id}>
        {truncateText(content.headline || "", 30)}
      </p>,
      formattedDate(content.publicationDate),
      (content.scope && formatNumber(content.scope)) || "--",
      (content.impressions && formatNumber(content.impressions)) || "--",
      (content.interactions && formatNumber(content.interactions)) || "--",
      showSocialLink(
        content.socialMediaInfo?.find((social) => social.id === "webcopu")?.link
      ),
      showSocialLink(
        content.socialMediaInfo?.find((social) => social.id === "instagram")
          ?.link
      ),
      showSocialLink(
        content.socialMediaInfo?.find((social) => social.id === "facebook")
          ?.link
      ),
      showSocialLink(
        content.socialMediaInfo?.find((social) => social.id === "linkedin")
          ?.link
      ),
      showSocialLink(
        content.socialMediaInfo?.find((social) => social.id === "xtwitter")
          ?.link
      ),
      showSocialLink(
        content.socialMediaInfo?.find((social) => social.id === "tiktok")?.link
      ),
      showSocialLink(
        content.socialMediaInfo?.find((social) => social.id === "youtube")?.link
      ),
      showSocialLink(
        content.socialMediaInfo?.find((social) => social.id === "threads")?.link
      ),
      <LinkCP onClick={() => handleEditContent(content.id)} key={content.id}>
        Editar
      </LinkCP>,
    ]);

    return result;
  };

  const {
    contents: data,
    loading: loadingContents,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useFetchAllContents(hasUpdate, showItems);

  useEffect(() => {
    setLoadingCount(true);
    if(!loadingContents){
      getContentsCountByService();
    }
  },[filters?.servicesIds, loadingContents, showItems])

  useEffect(() => {
    setLoadingCount(true);
    getContentsCountByCompany();
  },[filters?.companiesIds, showItems])

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (data && !loadingContents) {
      setOriginalData(data);
      const tableData: TableDataProps = {
        heads: showFullView ? headsTableFull : headsTableCompact,
        rows: showFullView ? rowsTableFull(data) : rowsTableCompact(data),
      };
      setContents(tableData);
    }
  }, [data, loadingContents, showFullView]);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSubmitForm = (contentId?: string) => {
    if (contentId) {
      setHasUpdate(true);
    }
  };

  const handleOpenCreateModal = () => {
    setOpenModal(true);
    setEditContent(null);
  };

  useEffect(() => {
    if (!originalData) return;

    const lowerSearchValue = searchValue.toLowerCase();

    const filtered = originalData.filter((content) => {
      const idMatch = content.id?.toLowerCase().includes(lowerSearchValue);
      const typeMatch = actionOptions
        .find((option) => option.value === content.type)
        ?.name?.toLowerCase()
        .includes(lowerSearchValue);
      const headlineMatch = content.headline
        ?.toLowerCase()
        .includes(lowerSearchValue);

      return idMatch || typeMatch || headlineMatch;
    });

    const tableDataFiltered: TableDataProps = {
      heads: showFullView ? headsTableFull : headsTableCompact,
      rows: showFullView ? rowsTableFull(filtered) : rowsTableCompact(filtered),
    };

    setContents(tableDataFiltered);
    // setFilteredData(filtered);
  }, [searchValue, originalData, showFullView]);

  useEffect(() => {
    if(!openMenuFilter){
      setOpenFilterCompany(false);
      setOpenFilterService(false);
      setOpenFilterUser(false);
    }

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

  const handleShowItems = (value: string) => {
    setShowItems(parseInt(value));
    setCurrentPage(1);
    setLoadingCount(true);
    getContentsCountByService();
  };

  const handleFilterCompany = (companyId: string) => {
    if (!originalData) return;
  
    setFilters((prevFilters) => {
      const existingIds = prevFilters?.companiesIds || [];
  
      if (existingIds.includes(companyId)) {
        return {
          ...prevFilters,
          companiesIds: existingIds.filter((id) => id !== companyId),
        };
      } else {
        return {
          ...prevFilters,
          companiesIds: [...existingIds, companyId],
        };
      }
    });
  };

  const handleFilterService = (serviceId: string) => {
    if (!originalData) return;

    setFilters((prevFilters) => {
      const existingIds = prevFilters?.servicesIds || [];

      if (existingIds.includes(serviceId)) {
        return {
          ...prevFilters,
          servicesIds: existingIds.filter((id) => id !== serviceId),
        };
      } else {
        return {
          ...prevFilters,
          servicesIds: [...existingIds, serviceId],
        };
      }
    });

    console.log("filters", filters);
  };

  const handleFilterUser = (userId: string) => {
    if (!originalData) return;

    setFilters((prevFilters) => {
      const existingIds = prevFilters?.usersIds || [];

      if (existingIds.includes(userId)) {
        return {
          ...prevFilters,
          usersIds: existingIds.filter((id) => id !== userId),
        };
      } else {
        return {
          ...prevFilters,
          usersIds: [...existingIds, userId],
        };
      }
    });
  };

  useEffect(() => {
    if (!originalData) return;

    if (!filters || (!filters.companiesIds?.length && !filters.servicesIds?.length && !filters.usersIds?.length)) {
      setContents({
        heads: showFullView ? headsTableFull : headsTableCompact,
        rows: showFullView ? rowsTableFull(originalData) : rowsTableCompact(originalData),
      });
      return;
    }

    const filtered = originalData.filter((content) => {
      const companyMatch = !filters.companiesIds?.length || filters.companiesIds.includes(`${content.companyId}`);
      const serviceMatch = !filters.servicesIds?.length || filters.servicesIds.includes(`${content.serviceId}`);
      const userMatch = !filters.usersIds?.length || 
        (content.companyId && filters.usersIds.some(userId => 
          usersAdmin.find(user => user.id === userId)?.companiesId?.includes(content.companyId || '')));

      return companyMatch && serviceMatch && userMatch;
    });

    const tableDataFiltered: TableDataProps = {
      heads: showFullView ? headsTableFull : headsTableCompact,
      rows: showFullView ? rowsTableFull(filtered) : rowsTableCompact(filtered),
    };

    setContents(tableDataFiltered);
  }, [filters, originalData, usersAdmin, showFullView]);

  const headersMap = {
    "headline": "Titular",
    "type": "Tipo acción",
    "publicationDate": "Fecha Publicación",
    "scope": "Alcance",
    "impressions": "Impresiones",
    "interactions": "Interacciones",
    "web": "Web",
    "ig": "Instagram", 
    "fb": "Facebook",
    "lk": "LinkedIn",
    "x": "X",
    "tk": "TikTok",
    "yt": "YouTube",
    "th": "Threads",
  }

  const dataForExport = originalData?.map((content) => {
    return(
      {
        headline: content.headline,
        type: actionOptions.find((option) => option.value === content.type)?.name,
        publicationDate: formattedDate(content.publicationDate),
        scope: content.scope,
        impressions: content.impressions,
        interactions: content.interactions,
        web: content.socialMediaInfo?.find((social) => social.id === "webcopu")?.link,
        ig: content.socialMediaInfo?.find((social) => social.id === "instagram")?.link,
        fb: content.socialMediaInfo?.find((social) => social.id === "facebook")?.link,
        lk: content.socialMediaInfo?.find((social) => social.id === "linkedin")?.link,
        x: content.socialMediaInfo?.find((social) => social.id === "xtwitter")?.link,
        tk: content.socialMediaInfo?.find((social) => social.id === "tiktok")?.link,
        yt: content.socialMediaInfo?.find((social) => social.id === "youtube")?.link,
        th: content.socialMediaInfo?.find((social) => social.id === "threads")?.link,
      }
    )
  })

  const exportToCSV = useExportCSV(dataForExport as Record<string, string | number>[], headersMap, `contents-${new Date().toISOString()}`)

  if (loadingContents) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Contenidos" />
        </div>
        <div className="w-full h-[70vh] flex flex-col justify-center items-center px-4">
          <div className="w-full max-w-7xl">
            <SkeletonLoader type="table" rows={5} className="w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <FormCreateContent
          onSubmit={handleSubmitForm}
          onClose={() => setOpenModal(false)}
          action={editContent ? "edit" : "create"}
          currentContent={editContent}
        />
      </Modal>
      <div className="mb-5">
        <TitleSection title="Contenidos" />
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mb-8 justify-center">
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 text-center">
          <h3 className="text-lg font-bold min-h-14">Post en social media</h3>
          <span className="text-6xl text-center">
            {loadingCount ? (
              <Spinner className="mx-auto" />
            ):(
              postSocialCount
            )}
          </span>
        </div>
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 text-center">
          <h3 className="text-lg font-bold min-h-14">
            Artículo web y post en social media
          </h3>
          <span className="text-6xl">
            {loadingCount ? (
              <Spinner className="mx-auto" />
            ):(
              postWebCount
            )}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex gap-3">
          <Button fullWidthMobile onClick={handleOpenCreateModal} mode="cp-green">
            <span className="mr-3">Nuevo contenido</span>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          <Button
            onClick={() => setShowFullView(!showFullView)}
            mode="cp-dark"
            className="text-sm"
          >
            <span className="mr-3">{showFullView ? "Vista Compacta" : "Vista Completa"}</span>
            <FontAwesomeIcon icon={showFullView ? faTable : faList} />
          </Button>
        </div>

        <div className="flex gap-6 items-center mt-4 md:mt-0">
          <LinkCP onClick={exportToCSV} href="#">
            Exportar CSV
          </LinkCP>
          <Search onChange={handleChange} value={searchValue} />
          <div className="relative w-full lg:w-auto" ref={menuFilterRef}>
            <Button
              onClick={() => setOpenMenuFilter(!openMenuFilter)}
              mode={`${filters?.companiesIds?.length || filters?.servicesIds?.length || filters?.usersIds?.length ? "cp-green" : "cp-dark"}`}
              fullWidthMobile
            >
              <FontAwesomeIcon className="mr-2" icon={faFilter} />
              <span className="block">Filtros</span>
            </Button>
            {openMenuFilter && (
              <div className="bg-cp-light absolute space-y-5 right-0 p-4 min-w-64 rounded-md text-cp-dark text-sm z-50 top-12">
                <div>
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenFilterCompany(!openFilterCompany)}>
                    <span className="font-bold text-slate-600 text-md">
                      Compañía ({companiesData?.length})
                    </span>

                    <span>
                      <FontAwesomeIcon
                        icon={openFilterCompany ? faCaretUp : faCaretDown}
                        className="ml-2 text-slate-700"
                      />
                    </span>
                  </div>
                  <hr className="my-2" />
                  {openFilterCompany && (
                    <div className="space-y-2 max-h-48 overflow-y-scroll custom-scroll">
                      {companiesData &&
                        companiesData.length > 0 &&
                        companiesData.map((company: OptionSelect) => (
                          <div
                            key={company.value}
                            className=" flex items-center gap-2 cursor-pointer hover:opacity-60"
                            onClick={() => handleFilterCompany(company.value)}
                          >
                            <span
                              className={`w-3 h-3 block border  rounded-sm shadow-sm ${filters?.companiesIds?.includes(company.value) ? "border-cp-primary bg-cp-primary" : "border-slate-400"}`}
                            ></span>
                            <span>{company.name}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenFilterService(!openFilterService)}>
                    <span className="font-bold text-slate-600 text-md">
                      Servicio ({dataServices?.length})
                    </span>

                    <span>
                      <FontAwesomeIcon
                        icon={openFilterService ? faCaretUp : faCaretDown}
                        className="ml-2 text-slate-700"
                      />
                    </span>
                  </div>
                  <hr className="my-2" />
                  {openFilterService && (
                    <>
                      <div className="space-y-2 max-h-48 overflow-y-scroll custom-scroll">
                      {dataServices &&
                        dataServices.length > 0 &&
                        dataServices.map((service) => (
                          <div
                            onClick={() => handleFilterService(`${service.id}`)}
                            key={service.id}
                            className=" flex items-center gap-2 cursor-pointer hover:opacity-60"
                          >
                            <span
                              className={`w-3 h-3 block border  rounded-sm shadow-sm ${filters?.servicesIds?.includes(`${service.id}`) ? "border-cp-primary bg-cp-primary" : "border-slate-400"}`}
                            ></span>
                            <span>{service.name}</span>
                          </div>
                        ))}
                    </div>
                    </>
                  )}
                </div>

                {usersAdmin.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenFilterUser(!openFilterUser)}>
                      <span className="font-bold text-slate-600 text-md">
                        Ejecutiva/o ({usersAdmin.length})
                      </span>

                      <span>
                        <FontAwesomeIcon
                          icon={openFilterUser ? faCaretUp : faCaretDown}
                          className="ml-2 text-slate-700"
                        />
                      </span>
                    </div>
                    
                    {openFilterUser && (
                      <>
                        <hr className="my-2" />
                        <div className="space-y-2 max-h-48 overflow-y-scroll custom-scroll">
                          {usersAdmin.map((user) => (
                            <div
                              onClick={() => handleFilterUser(user.id || '')}
                              key={user.id}
                              className="flex items-center gap-2 cursor-pointer hover:opacity-60"
                            >
                              <span
                                className={`w-3 h-3 block border rounded-sm shadow-sm ${
                                  filters?.usersIds?.includes(user.id || '')
                                    ? "border-cp-primary bg-cp-primary"
                                    : "border-slate-400"
                                }`}
                              ></span>
                              <span>{`${user.fname} ${user.lname}`}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {contents && contents.rows.length > 0 ? (
        <>
          <Table data={contents} className={showFullView ? "" : "compact-view"} />

          <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
            {totalPages > 1 && (
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
                <option value="500">500</option>
                <option value="1000">1000</option>
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
