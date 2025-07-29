"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import Button from "@/app/utilities/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faTable, faFilter, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import type { Content, OptionSelect, SocialListsProps } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import useFetchContents from "@/app/hooks/useFetchContents";
import {
  formattedDate,
  truncateText,
  formatNumber,
} from "@/app/utilities/helpers/formatters";
import { actionOptions } from "@/app/components/Form/FormCreateContent";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useFetchCompanies } from "@/app/hooks/useFetchCompanies";
import TableSkeleton from "@/app/components/SkeletonLoader/TableSkeleton";
import { ServiceOptionsProps } from "../../components/FilterContentBar/FilterContentBar";

interface AdvancedFiltersProps {
  company?: string;
  service?: string;
  actionType?: string;
  dateFrom?: string;
  dateTo?: string;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function ContentsClient() {
  const [searchValue, setSearchValue] = useState("");
  const [socialMediaCount, setSocialMediaCount] = useState(0);
  const [webSocialMediaCount, setWebSocialMediaCount] = useState(0);
  const [companiesData, setCompaniesData] = useState<OptionSelect[]>();
  const [servicesData, setServicesData] = useState<ServiceOptionsProps[]>();
  const [showFullView, setShowFullView] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersProps>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[1]); // 10 por defecto

  const { contents, loading } = useFetchContents();

  const { userData } = useSelector((state: RootState) => state.user);

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

  const { originalData: companies } = useFetchCompanies(
    userData,
    fetchServicesByCompany,
    false
  );

  const headsTableCompact = [
    "Compañía",
    "Servicio",
    "Titular",
    "Fecha Publicación",
    "Links",
  ];

  const headsTableFull = [
    "Compañía",
    "Servicio",
    "Tipo acción",
    "Titular",
    "Fecha Publicación",
    "Alcance",
    "Impresiones",
    "Interacciones",
    "Links",
  ];

  const showSocialLinks = (socialMediaInfo?: SocialListsProps[]) => {
    if (!socialMediaInfo || socialMediaInfo.length === 0) {
      return null;
    }

    // Filtrar solo enlaces válidos
    const validLinks = socialMediaInfo.filter(social => 
      social.link && 
      social.link.trim() !== '' && 
      social.link !== '#' &&
      social.link !== 'javascript:void(0)' &&
      social.link !== 'javascript:;'
    );

    if (validLinks.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {validLinks.map((social, index) => (
          <a
            key={index}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cp-primary hover:text-cp-primary-dark transition text-sm bg-slate-800 px-2 py-1 rounded hover:bg-slate-700"
            title={social.title || social.id}
          >
            {social.title || social.id || `Link ${index + 1}`}
          </a>
        ))}
      </div>
    );
  };

  const rowsTableCompact = (data: Content[]) => {
    return data.map((content) => [
      content.companyName || "Sin compañía",
      content.serviceName || "Sin servicio",
      <p title={content.headline} key={content.id}>
        {truncateText(content.headline || "", 30)}
      </p>,
      formattedDate(content.publicationDate),
      showSocialLinks(content.socialMediaInfo),
    ]);
  };

  const rowsTableFull = (data: Content[]) => {
    return data.map((content) => [
      content.companyName || "Sin compañía",
      content.serviceName || "Sin servicio",
      actionOptions.find((option) => option.value === content.type)?.name,
      <p title={content.headline} key={content.id}>
        {truncateText(content.headline || "", 30)}
      </p>,
      formattedDate(content.publicationDate),
      (content.scope && formatNumber(content.scope)) || "--",
      (content.impressions && formatNumber(content.impressions)) || "--",
      (content.interactions && formatNumber(content.interactions)) || "--",
      showSocialLinks(content.socialMediaInfo),
    ]);
  };

  useEffect(() => {
    if (companies) {
      const dataForServicesOptions: ServiceOptionsProps[] = companies.flatMap(
        (company) =>
          company.services?.map((service) => ({
            name: service.name || "",
            value: service.id || "",
            companyId: company.id,
          })) || []
      );

      if (dataForServicesOptions) {
        setServicesData(dataForServicesOptions);
      }

      const dataForOptions = companies.map((company) => ({
        name: company.name || "",
        value: company.id || "",
      }));

      setCompaniesData(dataForOptions);
    }
  }, [companies]);

  const applyAdvancedFilters = (data: Content[]) => {
    let filteredData = data;

    // Filtro por compañía
    if (advancedFilters.company) {
      filteredData = filteredData.filter(
        (content) => content.companyId === advancedFilters.company
      );
    }

    // Filtro por servicio
    if (advancedFilters.service) {
      filteredData = filteredData.filter(
        (content) => content.serviceId === advancedFilters.service
      );
    }

    // Filtro por tipo de acción
    if (advancedFilters.actionType) {
      filteredData = filteredData.filter(
        (content) => content.type === advancedFilters.actionType
      );
    }

    // Filtro por intervalo de fechas
    if (advancedFilters.dateFrom || advancedFilters.dateTo) {
      filteredData = filteredData.filter((content) => {
        if (!content.publicationDate) return false;
        
        const publicationDate = new Date(content.publicationDate);
        const fromDate = advancedFilters.dateFrom ? new Date(advancedFilters.dateFrom) : null;
        const toDate = advancedFilters.dateTo ? new Date(advancedFilters.dateTo) : null;

        if (fromDate && toDate) {
          return publicationDate >= fromDate && publicationDate <= toDate;
        } else if (fromDate) {
          return publicationDate >= fromDate;
        } else if (toDate) {
          return publicationDate <= toDate;
        }
        
        return true;
      });
    }

    return filteredData;
  };

  // Aplicar filtros y búsqueda
  const filteredContents = useMemo(() => {
    if (!contents) return [];

    let filteredData = contents;

    // Filtrar contenidos que tienen enlaces sociales válidos
    filteredData = filteredData.filter((content) => {
      if (!content.socialMediaInfo || content.socialMediaInfo.length === 0) {
        return false;
      }

      // Verificar que al menos un enlace sea válido
      const hasValidLinks = content.socialMediaInfo.some(social => 
        social.link && 
        social.link.trim() !== '' && 
        social.link !== '#' &&
        social.link !== 'javascript:void(0)' &&
        social.link !== 'javascript:;'
      );

      return hasValidLinks;
    });

    // Aplicar filtros avanzados
    filteredData = applyAdvancedFilters(filteredData);

    // Aplicar búsqueda
    if (searchValue.trim() !== "") {
      const searchLower = searchValue.toLowerCase();
      filteredData = filteredData.filter(
        (content) =>
          content.companyName?.toLowerCase().includes(searchLower) ||
          content.serviceName?.toLowerCase().includes(searchLower) ||
          content.type?.toLowerCase().includes(searchLower) ||
          content.headline?.toLowerCase().includes(searchLower)
      );
    }

    return filteredData;
  }, [contents, searchValue, advancedFilters]);

  // Paginación
  const totalPages = Math.ceil(filteredContents.length / pageSize);
  const paginatedContents = filteredContents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Calcular tableContents con useMemo
  const tableContents = useMemo(() => {
    if (filteredContents.length > 0) {
      const transformData = paginatedContents.map((content: Content) => ({
        companyName: content.companyName || "",
        serviceName: content.serviceName || "",
        type: content.type || "",
        headline: content.headline || "",
        publicationDate: content.publicationDate || "",
        scope: content.scope || 0,
        impressions: content.impressions || 0,
        interactions: content.interactions || 0,
        socialMediaInfo: content.socialMediaInfo,
      }));

      return {
        heads: showFullView ? headsTableFull : headsTableCompact,
        rows: showFullView ? rowsTableFull(transformData) : rowsTableCompact(transformData),
      };
    }
    return null;
  }, [filteredContents, paginatedContents, showFullView]);

  // useEffect para contar tipos de publicaciones visibles
  useEffect(() => {
    if (filteredContents.length > 0) {
      // Contar tipos de publicaciones visibles
      const countSocialMedia = filteredContents.filter(
        (content) => content.type === "post"
      ).length;
      const countWebArticles = filteredContents.filter(
        (content) => content.type === "web"
      ).length;

      setSocialMediaCount(countSocialMedia);
      setWebSocialMediaCount(countWebArticles);
    } else {
      setSocialMediaCount(0);
      setWebSocialMediaCount(0);
    }
  }, [filteredContents]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setPage(1); // Reiniciar a la primera página al buscar
  };

  const handleFilterChange = (field: keyof AdvancedFiltersProps, value: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value || undefined
    }));
    setPage(1); // Reiniciar a la primera página al filtrar
  };

  const clearFilters = () => {
    setAdvancedFilters({});
    setSearchValue("");
    setPage(1); // Reiniciar a la primera página al limpiar
  };

  const hasActiveFilters = () => {
    return Object.values(advancedFilters).some(value => value !== undefined && value !== "");
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1); // Reiniciar a la primera página al cambiar el tamaño
  };

  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Contenidos con Enlaces" />
        </div>
        
        {/* Skeleton para las estadísticas */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          <div className="w-full max-w-xs bg-slate-800 p-8 rounded-lg animate-pulse">
            <div className="h-6 bg-slate-700 rounded mb-4"></div>
            <div className="h-24 bg-slate-700 rounded"></div>
          </div>
          <div className="w-full max-w-xs bg-slate-800 p-8 rounded-lg animate-pulse">
            <div className="h-6 bg-slate-700 rounded mb-4"></div>
            <div className="h-24 bg-slate-700 rounded"></div>
          </div>
        </div>

        {/* Skeleton para los controles */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="h-10 bg-slate-700 rounded w-64 animate-pulse"></div>
            <div className="h-10 bg-slate-700 rounded w-24 animate-pulse"></div>
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-6 items-center mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <div className="h-4 bg-slate-700 rounded w-32 animate-pulse"></div>
              <div className="h-8 bg-slate-700 rounded w-16 animate-pulse"></div>
            </div>
            <div className="h-10 bg-slate-700 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton para la tabla */}
        <TableSkeleton rows={10} columns={showFullView ? 9 : 5} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <TitleSection title="Contenidos con Enlaces" />
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 hover:outline hover:outline-offset-1 text-center">
          <h3 className="text-xl font-bold">Post en social media</h3>
          <span className="text-8xl">{socialMediaCount}</span>
        </div>
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 hover:outline hover:outline-offset-1 text-center">
          <h3 className="text-xl font-bold">Artículos web</h3>
          <span className="text-8xl">{webSocialMediaCount}</span>
        </div>
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 hover:outline hover:outline-offset-1 text-center">
          <h3 className="text-xl font-bold">Total contenidos</h3>
          <span className="text-8xl">{contents?.length || 0}</span>
          <p className="text-sm text-slate-400 mt-2">
            {socialMediaCount + webSocialMediaCount} (post + web)
          </p>
        </div>
      </div>

      {/* Panel de filtros expandible */}
      {openFilters && (
        <div className="bg-slate-800 p-4 sm:p-6 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtro por compañía */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Compañía
              </label>
              <select
                value={advancedFilters.company || ""}
                onChange={(e) => handleFilterChange("company", e.target.value)}
                className="w-full bg-slate-700 text-slate-200 rounded px-3 py-2 border border-slate-600 focus:border-cp-primary focus:outline-none"
              >
                <option value="">Todas las compañías</option>
                {companiesData?.map((company) => (
                  <option key={company.value} value={company.value}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por servicio */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Servicio
              </label>
              <select
                value={advancedFilters.service || ""}
                onChange={(e) => handleFilterChange("service", e.target.value)}
                className="w-full bg-slate-700 text-slate-200 rounded px-3 py-2 border border-slate-600 focus:border-cp-primary focus:outline-none"
              >
                <option value="">Todos los servicios</option>
                {servicesData?.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por tipo de acción */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tipo de acción
              </label>
              <select
                value={advancedFilters.actionType || ""}
                onChange={(e) => handleFilterChange("actionType", e.target.value)}
                className="w-full bg-slate-700 text-slate-200 rounded px-3 py-2 border border-slate-600 focus:border-cp-primary focus:outline-none"
              >
                <option value="">Todos los tipos</option>
                {actionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtros de fecha - uno al lado del otro */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filtro por fecha desde */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Fecha inicio
                  </label>
                  <input
                    type="date"
                    value={advancedFilters.dateFrom || ""}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                    className="w-full bg-slate-700 text-slate-200 rounded px-3 py-2 border border-slate-600 focus:border-cp-primary focus:outline-none"
                  />
                </div>

                {/* Filtro por fecha hasta */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Fecha fin
                  </label>
                  <input
                    type="date"
                    value={advancedFilters.dateTo || ""}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                    className="w-full bg-slate-700 text-slate-200 rounded px-3 py-2 border border-slate-600 focus:border-cp-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <Search onChange={handleChange} value={searchValue} />
          <Button
            onClick={() => setOpenFilters(!openFilters)}
            mode={hasActiveFilters() ? "cp-green" : "cp-dark"}
            fullWidthMobile
          >
            <FontAwesomeIcon className="mr-2" icon={faFilter} />
            <span className="block">Filtros</span>
            <FontAwesomeIcon 
              className="ml-2" 
              icon={openFilters ? faCaretUp : faCaretDown} 
            />
          </Button>
          {hasActiveFilters() && (
            <Button
              onClick={clearFilters}
              mode="cp-dark"
              fullWidthMobile
            >
              Limpiar
            </Button>
          )}
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-6 items-center mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-slate-400 text-sm whitespace-nowrap">Resultados por página:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="bg-slate-800 text-slate-200 rounded px-2 py-1 text-sm"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <Button
            onClick={() => setShowFullView(!showFullView)}
            mode="cp-dark"
            fullWidthMobile
          >
            <span className="mr-3">{showFullView ? "Vista Compacta" : "Vista Completa"}</span>
            <FontAwesomeIcon icon={showFullView ? faTable : faList} />
          </Button>
        </div>
      </div>

      {tableContents ? (
        <Table data={tableContents} />
      ) : (
        <div className="text-center p-5 mt-10 flex justify-center items-center">
          <p className="text-slate-400">
            No hay contenidos con enlaces sociales disponibles o no hay coincidencias con la búsqueda.
          </p>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded transition ${
                page === i + 1
                  ? "bg-cp-primary text-white" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Información de paginación */}
      {filteredContents.length > 0 && (
        <div className="text-center mt-4 text-slate-400 text-sm">
          Mostrando {((page - 1) * pageSize) + 1} a {Math.min(page * pageSize, filteredContents.length)} de {filteredContents.length} resultados
        </div>
      )}
    </div>
  );
}
