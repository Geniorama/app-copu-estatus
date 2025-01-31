"use client";

import { useState, useEffect } from "react";
import Table from "@/app/components/Table/Table";
import Search from "@/app/utilities/ui/Search";
import LinkCP from "@/app/utilities/ui/LinkCP";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import type { Content, TableDataProps } from "@/app/types";
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

const companiesData = [
  { value: "company1", name: "Company 1" },
  { value: "company2", name: "Company 2" },
  { value: "company3", name: "Company 3" },
  { value: "company4", name: "Company 4" },
  { value: "company5", name: "Company 5" },
];

export default function ContentsClient() {
  const [searchValue, setSearchValue] = useState("");
  const [tableContents, setTableContents] = useState<TableDataProps | null>(
    null
  );
  const [socialMediaCount, setSocialMediaCount] = useState(0);
  const [webSocialMediaCount, setWebSocialMediaCount] = useState(0);

  const { contents } = useFetchContents();

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
    console.log(data);
  };

  return (
    <div>
      <div className="mb-5">
        <TitleSection title="Contenidos" />
      </div>
      <FilterContentBar
        companies={companiesData}
        onFilter={(data) => handleFilterBar(data)}
      />
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
          <LinkCP href="#">
            <FontAwesomeIcon icon={faGoogleDrive} />
            <span className="ml-1">Estadísticas anteriores</span>
          </LinkCP>
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
