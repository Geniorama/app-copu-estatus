"use client";

import TitleSection from "@/app/utilities/ui/TitleSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
// import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback } from "react";
import Select from "@/app/utilities/ui/Select";
import Table from "@/app/components/Table/Table";
import type { TableDataProps } from "@/app/types";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formattedDate } from "@/app/utilities/helpers/formatters";
import type { Content } from "@/app/types";
import LinkCP from "@/app/utilities/ui/LinkCP";
import { actionOptions } from "@/app/components/Form/FormCreateContent";
import { truncateText, formatNumber } from "@/app/utilities/helpers/formatters";
import useFetchContents from "@/app/hooks/useFetchContents";
import Spinner from "@/app/utilities/ui/Spinner";
import { getUsersByCompanyId } from "@/app/utilities/helpers/fetchers";
import { Entry } from "contentful-management";
import { useFetchCompanies } from "@/app/hooks/useFetchCompanies";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

export default function DashboardHomeClient() {
  const [entries, setEntries] = useState<TableDataProps>();
  const [totalScope, setTotalScope] = useState<number>(0);
  const [totalImpressions, setTotalImpressions] = useState<number>(0);
  const [totalInteractions, setTotalInteractions] = useState<number>(0);
  const [totalWeb, setTotalWeb] = useState<number>(0);
  const [totalSocialMedia, setTotalSocialMedia] = useState<number>(0);
  const { contents, loading } = useFetchContents();
  const [userManager, setUserManager] = useState<Entry | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null)

  const handleCompanyClick = (companyId?: string) => {
    if (!companyId) return;
    companyId === selectedCompany ? setSelectedCompany(null) : setSelectedCompany(companyId);
  };

  const headsTable: TableDataProps["heads"] = [
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

  const rowsTable = (data: Content[]) => {
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

    return result;
  };

  const filteredContents = selectedCompany
    ? contents.filter((content) => content.companyId === selectedCompany)
    : contents;

  useEffect(() => {
    if (filteredContents) {
      setEntries({
        rows: rowsTable(filteredContents),
        heads: headsTable,
      });

      const totalScope = filteredContents.reduce(
        (acc, content) => acc + (content.scope ?? 0),
        0
      );
      setTotalScope(totalScope);

      const totalImpressions = filteredContents.reduce(
        (acc, content) => acc + (content.impressions ?? 0),
        0
      );
      setTotalImpressions(totalImpressions);

      const totalInteractions = filteredContents.reduce(
        (acc, content) => acc + (content.interactions ?? 0),
        0
      );
      setTotalInteractions(totalInteractions);

      const totalWebPosts = filteredContents.reduce(
        (acc, content) => acc + (content.type === "web" ? 1 : 0),
        0
      );
      setTotalWeb(totalWebPosts);

      const totalSocialMediaPosts = filteredContents.reduce(
        (acc, content) => acc + (content.type === "post" ? 1 : 0),
        0
      );
      setTotalSocialMedia(totalSocialMediaPosts);
    }
  }, [filteredContents]);

  useEffect(() => {
    if (contents) {
      setEntries({
        rows: rowsTable(contents),
        heads: headsTable,
      });

      const firstContent = contents[0];
      if (firstContent && firstContent.companyId) {
        getUsersByCompanyId(firstContent.companyId).then((users: Entry[]) => {
          const manager = users.find(
            (user: Entry) => user.fields.role["en-US"] === "admin"
          );
          if (manager) {
            console.log("manager", manager);
            setUserManager(manager);
          }
        });
      }

      const totalScope = contents.reduce(
        (acc, content) => acc + (content.scope ?? 0),
        0
      );
      setTotalScope(totalScope);

      const totalImpressions = contents.reduce(
        (acc, content) => acc + (content.impressions ?? 0),
        0
      );
      setTotalImpressions(totalImpressions);

      const totalInteractions = contents.reduce(
        (acc, content) => acc + (content.interactions ?? 0),
        0
      );
      setTotalInteractions(totalInteractions);

      const totalWebPosts = contents.reduce(
        (acc, content) => acc + (content.type === "web" ? 1 : 0),
        0
      );
      setTotalWeb(totalWebPosts);

      const totalSocialMediaPosts = contents.reduce(
        (acc, content) => acc + (content.type === "post" ? 1 : 0),
        0
      );
      setTotalSocialMedia(totalSocialMediaPosts);
    }
  }, [contents]);

  useEffect(() => {
    if (companies && selectedCompany) {
      const companyName = companies.find((company) => company.id === selectedCompany)?.name
      if(companyName){
        setCompanyName(companyName)
      }
    }
  }, [companies, selectedCompany]);

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
      <ToastContainer
        toastStyle={{ fontFamily: "inherit" }}
        progressClassName={"custom-progress-bar"}
      />
      <div className="mb-5">
        <TitleSection title="Home" />
      </div>
      <div className=" flex gap-3">
        {userManager && (
          <div className="bg-slate-800 p-6 rounded-md flex-grow max-w-sm">
            <div className=" flex flex-col gap-3 justify-center items-center">
              <div className="w-20">
                {userManager?.fields.imageProfile?.["en-US"] && (
                  <img
                    className="w-full aspect-square object-cover rounded-full"
                    src={userManager.fields.imageProfile["en-US"]}
                    alt=""
                  />
                )}
              </div>
              <div className="w-full text-center">
                <p className="text-xl">
                  Hola, soy{" "}
                  <span className="font-bold">
                    {userManager?.fields.firstName?.["en-US"]}
                  </span>
                </p>
                <p>Tu ejecutiva/o de cuenta</p>
                <p className="text-xs mt-3">Contáctame si tienes dudas</p>
                <ul className="mt-2 text-2xl flex gap-5 justify-center">
                  <li>
                    <a
                      className="text-cp-primary hover:text-cp-primary-hover"
                      target="_blank"
                      href={`https://wa.me/${userManager?.fields.phone?.["en-US"]}?text=Hola ${userManager?.fields.firstName?.["en-US"]}, tengo preguntas sobre mi contenido`}
                    >
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-cp-primary hover:text-cp-primary-hover"
                      target="_blank"
                      href={`mailto:${userManager?.fields.email?.["en-US"]}`}
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {companies &&
          companies.length > 0 &&
          companies.map((company) => (
            <div
              onClick={() => handleCompanyClick(company.id)}
              key={company.id}
              className={`p-6 rounded-md text-center cursor-pointer transition ${
                company.id === selectedCompany
                  ? "bg-cp-primary"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-slate-400 border border-slate-700">
                {company.logo && (
                  <img className="w-full h-full" src={company.logo} alt="" />
                )}
              </div>
              <div>
                <h2
                  className={`text-sm font-bold ${
                    company.id === selectedCompany
                      ? "text-cp-dark"
                      : "text-white"
                  }`}
                >
                  {company.name}
                </h2>
              </div>
            </div>
          ))}
      </div>
      <div>
        <div className="flex items-center justify-between">
          <div>
            {!selectedCompany ? (
              <span className="bg-slate-200 text-cp-dark font-bold text-sm p-1 px-2 rounded-sm inline-block">Todas las compañías</span>
            ) : (
              <span className="bg-slate-200 text-cp-dark font-bold text-sm p-1 px-2 rounded-sm inline-block">{companyName}</span>
            )}
          </div>

          <div className="py-3 mt-2 flex items-center gap-3 justify-end">
            <span>Filtrar por fecha:</span>
            <div>
              <Select options={[{ value: "1", name: "Último mes" }]} />
            </div>
          </div>
        </div>

        <div className=" flex gap-3">
          <div className="w-2/5">
            <h3 className="font-bold mb-3">CONTENIDOS</h3>
            <div className="flex gap-2">
              <div className="w-full text-cp-dark bg-slate-200 p-8 rounded-lg hover:outline-3 text-center">
                <h3 className="text-lg font-bold min-h-14">
                  Post Social Media
                </h3>
                <span className="text-8xl">
                  {formatNumber(totalSocialMedia)}
                </span>
              </div>

              <div className="w-full text-cp-dark bg-slate-200 p-8 rounded-lg hover:outline-3 text-center">
                <h3 className="text-lg font-bold min-h-14">
                  Artículo web y Post Social Media
                </h3>
                <span className="text-8xl">{formatNumber(totalWeb)}</span>
              </div>
            </div>
          </div>

          <div className="w-3/5">
            <h3 className="font-bold mb-3">ESTADÍSTICAS</h3>
            <div className=" flex gap-2">
              <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 text-center">
                <h3 className="text-xl font-bold min-h-14">Total Alcance</h3>
                <span className="text-8xl">{formatNumber(totalScope)}</span>
              </div>
              <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 text-center">
                <h3 className="text-xl font-bold min-h-14">
                  Total Impresiones
                </h3>
                <span className="text-8xl">
                  {formatNumber(totalImpressions)}
                </span>
              </div>
              <div className="w-full max-w-xs text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 text-center">
                <h3 className="text-xl font-bold min-h-14">
                  Total Interacciones
                </h3>
                <span className="text-8xl">
                  {formatNumber(totalInteractions)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <a
            className="my-4 inline-block bg-cp-primary text-cp-dark p-2 rounded-md px-3 hover:bg-cp-primary-hover"
            target="_blank"
            href="#"
          >
            <FontAwesomeIcon icon={faGoogleDrive} />
            <span className="ml-2">Estadísticas anteriores</span>
          </a>
        </div>

        <div className="mt-10 mb-4">
          <h3 className="font-bold mb-3">Publicaciones recientes</h3>
          {entries && entries.rows.length > 0 && (
            <div>
              <Table data={entries} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
