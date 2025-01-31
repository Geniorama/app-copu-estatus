"use client";

import { useState, useEffect, useCallback } from "react";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import LinkCP from "@/app/utilities/ui/LinkCP";
import type { Content, OptionSelect, TableDataProps } from "@/app/types";
import type { ChangeEvent } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import FilterContentBar from "../FilterContentBar";
import type { FilterDataProps } from "@/app/types";
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
import Spinner from "@/app/utilities/ui/Spinner";
import { ServiceOptionsProps } from "../FilterContentBar";

export default function ContentsClient() {
  const [searchValue, setSearchValue] = useState("");
  const [tableContents, setTableContents] = useState<TableDataProps | null>(
    null
  );
  const [socialMediaCount, setSocialMediaCount] = useState(0);
  const [webSocialMediaCount, setWebSocialMediaCount] = useState(0);
  const [companiesData, setCompaniesData] = useState<OptionSelect[]>();
  const [servicesData, setServicesData] = useState<ServiceOptionsProps[]>();

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

  const headsTable = [
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

  const rowsTable = (data: Content[]) => {
    return data.map((content) => [
      content.companyName || "Sin compañía",
      actionOptions.find((option) => option.value === content.type)?.name,
      <p title={content.headline} key={content.id}>
        {truncateText(content.headline || "", 30)}
      </p>,
      formattedDate(content.publicationDate),
      (content.scope && formatNumber(content.scope)) || "--",
      (content.impressions && formatNumber(content.impressions)) || "--",
      (content.interactions && formatNumber(content.interactions)) || "--",
      ...[
        "webcopu",
        "instagram",
        "facebook",
        "linkedin",
        "xtwitter",
        "tiktok",
        "youtube",
        "threads",
      ].map((id) =>
        showSocialLink(
          content.socialMediaInfo?.find((social) => social.id === id)?.link
        )
      ),
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

  useEffect(() => {
    if (contents) {
      let filteredData = contents;

      if (searchValue.trim() !== "") {
        const searchLower = searchValue.toLowerCase();
        filteredData = contents.filter(
          (content) =>
            content.companyName?.toLowerCase().includes(searchLower) ||
            content.type?.toLowerCase().includes(searchLower) ||
            content.headline?.toLowerCase().includes(searchLower)
        );
      }

      // Contar tipos de publicaciones visibles
      const countSocialMedia = filteredData.filter(
        (content) => content.type === "post"
      ).length;
      const countWebArticles = filteredData.filter(
        (content) => content.type === "web"
      ).length;

      setSocialMediaCount(countSocialMedia);
      setWebSocialMediaCount(countWebArticles);

      const transformData = filteredData.map((content: Content) => ({
        companyName: content.companyName || "",
        type: content.type || "",
        headline: content.headline || "",
        publicationDate: content.publicationDate || "",
        scope: content.scope || 0,
        impressions: content.impressions || 0,
        interactions: content.interactions || 0,
        socialMediaInfo: content.socialMediaInfo,
      }));

      setTableContents({
        heads: headsTable,
        rows: rowsTable(transformData),
      });
    }
  }, [contents, searchValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleFilterBar = (data: FilterDataProps) => {
    if (contents) {
      let filteredData = contents;

      // Filtrar por compañía
      if (data.company) {
        filteredData = filteredData.filter(
          (content) => content.companyId === data.company
        );
      }

      // Filtrar por servicio
      if (data.service) {
        // Buscar compañías que tienen el servicio seleccionado
        const companiesWithService = companies?.filter((company) =>
          company.services?.some((service) => service.id === data.service)
        );

        // Obtener los IDs de esas compañías
        const companyIds = companiesWithService?.map((company) => company.id);

        // Filtrar los contenidos que pertenecen a esas compañías
        filteredData = filteredData.filter((content) =>
          companyIds?.includes(content.companyId)
        );
      }

      // Filtrar por fecha de publicación
      if (data.publicationDate) {
        filteredData = filteredData.filter(
          (content) => content.publicationDate === data.publicationDate
        );
      }

      // Contar tipos de publicaciones visibles
      const countSocialMedia = filteredData.filter(
        (content) => content.type === "post"
      ).length;
      const countWebArticles = filteredData.filter(
        (content) => content.type === "web"
      ).length;

      setSocialMediaCount(countSocialMedia);
      setWebSocialMediaCount(countWebArticles);

      const transformData = filteredData.map((content: Content) => ({
        companyName: content.companyName || "",
        type: content.type || "",
        headline: content.headline || "",
        publicationDate: content.publicationDate || "",
        scope: content.scope || 0,
        impressions: content.impressions || 0,
        interactions: content.interactions || 0,
        socialMediaInfo: content.socialMediaInfo,
      }));

      setTableContents({
        heads: headsTable,
        rows: rowsTable(transformData),
      });
    }
  };

  const resetFilters = () => {
    if (contents) {
      // Transformar los datos originales para la tabla
      const transformData = contents.map((content: Content) => ({
        companyName: content.companyName || "",
        type: content.type || "",
        headline: content.headline || "",
        publicationDate: content.publicationDate || "",
        scope: content.scope || 0,
        impressions: content.impressions || 0,
        interactions: content.interactions || 0,
        socialMediaInfo: content.socialMediaInfo,
      }));

      // Restaurar la tabla con los datos originales
      setTableContents({
        heads: headsTable,
        rows: rowsTable(transformData),
      });

      // Restaurar contadores de publicaciones
      setSocialMediaCount(
        contents.filter((content) => content.type === "post").length
      );
      setWebSocialMediaCount(
        contents.filter((content) => content.type === "web").length
      );
    }
  };

  if (loading) {
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
      <div className="mb-5">
        <TitleSection title="Contenidos" />
      </div>
      {companiesData && (
        <FilterContentBar
          companies={companiesData}
          services={servicesData}
          onFilter={(data) => handleFilterBar(data)}
          onCleanForm={resetFilters}
        />
      )}
      <div className="flex gap-4 mb-8 justify-center">
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 hover:outline hover:outline-offset-1 text-center">
          <h3 className="text-xl font-bold">Post en social media</h3>
          <span className="text-8xl">{socialMediaCount}</span>
        </div>
        <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 hover:outline hover:outline-offset-1 text-center">
          <h3 className="text-xl font-bold">Artículos web</h3>
          <span className="text-8xl">{webSocialMediaCount}</span>
        </div>
      </div>
      <div className="flex gap-3 items-center justify-end">
        <div className="flex gap-6 items-center">
          <Search onChange={handleChange} value={searchValue} />
        </div>
      </div>

      {tableContents ? (
        <Table data={tableContents} />
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
