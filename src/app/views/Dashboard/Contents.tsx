"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/app/utilities/ui/Button";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import LinkCP from "@/app/utilities/ui/LinkCP";
import Modal from "@/app/components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { Content, OptionSelect, TableDataProps } from "@/app/types";
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

interface FiltersProps {
  companiesIds?: string[];
  servicesIds?: string[];
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
  const [filteredData, setFilteredData] = useState<Content[] | null>(null);
  const [editContent, setEditContent] = useState<Content | null>(null);
  const [openMenuFilter, setOpenMenuFilter] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const actionUrl = searchParams.get("action");
  const menuFilterRef = useRef<HTMLDivElement>(null);
  const [openFilterCompany, setOpenFilterCompany] = useState(false);
  const [openFilterService, setOpenFilterService] = useState(false);
  const [showItems, setShowItems] = useState(5);

  const headsTable = [
    "Compañía",
    // "Servicio",
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
    }
  }, [openFilterCompany]);

  useEffect(() => {
    if(openFilterService) {
      setOpenFilterCompany(false);
    }
  }, [openFilterService]);

  useEffect(() => {
    if (dataServices) {
      console.log("dataServices", dataServices);
    }
  }, [dataServices]);

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

  const rowsTable = (data: Content[]) => {
    const result = data.map((content) => [
      content.companyName || "Sin compañía",
      // content.serviceName || "Sin servicio",
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
        heads: headsTable,
        rows: rowsTable(data),
      };
      setContents(tableData);
    }
  }, [data, loadingContents]);

  useEffect(() => {
    if (filteredData) {
      const filterWebContents = filteredData.filter(
        (post) => post.type === "web"
      );
      const filterSocialContents = filteredData.filter(
        (post) => post.type === "post"
      );

      if (filterWebContents) {
        setPostWebCount(filterWebContents.length);
      }

      if (filterSocialContents) {
        setPostSocialCount(filterSocialContents.length);
      }
    } else {
      if (originalData) {
        const filterWebContents = originalData.filter(
          (post) => post.type === "web"
        );
        const filterSocialContents = originalData.filter(
          (post) => post.type === "post"
        );

        if (filterWebContents) {
          setPostWebCount(filterWebContents.length);
        }

        if (filterSocialContents) {
          setPostSocialCount(filterSocialContents.length);
        }
      }
    }
  }, [filteredData, originalData]);

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
      heads: headsTable,
      rows: rowsTable(filtered),
    };

    setContents(tableDataFiltered);
    setFilteredData(filtered);
  }, [searchValue, originalData]);

  useEffect(() => {
    if(!openMenuFilter){
      setOpenFilterCompany(false);
      setOpenFilterService(false);
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

  useEffect(() => {
    if (!originalData) return;

    if (!filters || (!filters.companiesIds?.length && !filters.servicesIds?.length)) {
      setContents({
        heads: headsTable,
        rows: rowsTable(originalData),
      });
      return;
    }

    console.log('originalData from filters', originalData);

    const filtered = originalData.filter((content) => {
    const companyMatch = !filters.companiesIds?.length || filters.companiesIds.includes(`${content.companyId}`);
    const serviceMatch = !filters.servicesIds?.length || filters.servicesIds.includes(`${content.serviceId}`);

      return companyMatch && serviceMatch;
    });

    console.log('filtered', filtered);

    const tableDataFiltered: TableDataProps = {
      heads: headsTable,
      rows: rowsTable(filtered),
    };

    setContents(tableDataFiltered);
    setFilteredData(filtered);
  }, [filters, originalData]);

  const exportToCSV = useExportCSV(
    originalData as Record<string, string | number>[],
    [
      "headline",
      "type",
      "publicationDate",
      "scope",
      "impressions",
      "interactions",
      "socialMediaInfo",
    ],
    `contents-${new Date().toISOString()}`
  );

  if (loadingContents) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Contenidos" />
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
      {/* {companiesData && (
        <FilterContentBar
          companies={companiesData}
          services={optionsServices}
          onFilter={handleFilterBar}
          onCleanForm={handleClearFilter}
        />
      )} */}
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mb-8 justify-center">
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 text-center">
          <h3 className="text-lg font-bold min-h-14">Post en social media</h3>
          <span className="text-6xl">{postSocialCount}</span>
        </div>
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 text-center">
          <h3 className="text-lg font-bold min-h-14">
            Artículo web y post en social media
          </h3>
          <span className="text-6xl">{postWebCount}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <Button fullWidthMobile onClick={handleOpenCreateModal} mode="cp-green">
          <span className="mr-3">Nuevo contenido</span>
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <div className="flex gap-6 items-center mt-4 md:mt-0">
          <LinkCP onClick={exportToCSV} href="#">
            Exportar CSV
          </LinkCP>
          <Search onChange={handleChange} value={searchValue} />
          <div className="relative w-full lg:w-auto" ref={menuFilterRef}>
            <Button
              onClick={() => setOpenMenuFilter(!openMenuFilter)}
              mode={`${filters?.companiesIds?.length || filters?.servicesIds?.length ? "cp-green" : "cp-dark"}`}
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
                  
                  {openFilterService && (
                    <>
                      <hr className="my-2" />
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
              </div>
            )}
          </div>
        </div>
      </div>

      {contents && contents.rows.length > 0 ? (
        <>
          <Table data={contents} />

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
