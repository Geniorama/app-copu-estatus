"use client";

import TitleSection from "@/app/utilities/ui/TitleSection";
import { formatNumber } from "@/app/utilities/helpers/formatters";
import StackedBarHome from "@/app/components/StackedBarHome/StackedBarHome";
import Table from "@/app/components/Table/Table";
import type { TableDataProps } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
// import Button from "@/app/utilities/ui/Button";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Company, Service, Content, CompanyResponse } from "@/app/types";
import CarouselCompaniesLogos from "@/app/components/CarouselCompaniesLogos/CarouselCompaniesLogos";
import { getCompaniesByIds, getUsersByCompanyId, getServicesByCompanyId, getContentsByServiceId } from "@/app/utilities/helpers/fetchers";
import { useCompanyStats } from "@/app/hooks/useCompanyStats";
import HomeSkeleton from "@/app/components/SkeletonLoader/HomeSkeleton";
import StatsSkeleton from "@/app/components/SkeletonLoader/StatsSkeleton";
import TableSkeleton from "@/app/components/SkeletonLoader/TableSkeleton";
import { Entry } from "contentful-management";
interface UserExecutive {
  name: string;
  position: string;
  whatsappUrl: string;
  phone: string;
  imageProfile: string;
}

export default function HomeClient() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [userExecutive, setUserExecutive] = useState<UserExecutive>({
    name: "",
    position: "",
    whatsappUrl: "",
    phone: "",
    imageProfile: "",
  });
  const [services, setServices] = useState<Partial<Service>[]>([]);
  const [recentContents, setRecentContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [contentsLoading, setContentsLoading] = useState(false);

  // Get all companies for the user from localStorage
  useEffect(() => {
    const fetchCompanies = async () => {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        setIsLoading(false);
        return;
      }
      const userDataParsed = JSON.parse(userData);
      
    const companiesIds = userDataParsed.companiesId || [];
      const companiesFetched = await getCompaniesByIds(companiesIds);
      if (companiesFetched) {
        const transformData = companiesFetched.companies.map((company: CompanyResponse) => ({
          id: company.sys.id,
          name: company.fields.name,
          logo: company.fields.logo,
          status: company.fields.status,
        }));

        // Only active companies
        const activeCompanies = transformData.filter((company: Company) => company.status);

        setCompanies(activeCompanies);
      }
      setIsLoading(false);
    };
    fetchCompanies();
  }, []);

  // Memoize company IDs to prevent infinite re-renders
  const companyIds = useMemo(() => {
    return companies.map(company => company.id).filter(Boolean) as string[];
  }, [companies]);

  // Get company statistics using custom hook
  const { stats: companyStats, loading: statsLoading, error: statsError } = useCompanyStats(companyIds);

  // Get the whatsapp url from the phone number
  const getWhatsappUrl = (phone: string) => {
    if (!phone) {
      return "";
    }
    return `https://wa.me/${phone}`;
  }

  // Get the user executive for the first company
  useEffect(() => {
    const fetchUserExecutive = async () => {
      if (!companies || companies.length === 0) {
        return;
      }
      const users = await getUsersByCompanyId(companies[0].id || "");

      if (!users) {
        return;
      }

      if (users.length > 0) {
       const usersExecutive = users.filter((user: Entry) => user.fields.role["en-US"] === "admin");
       if (usersExecutive.length > 0) {
        setUserExecutive({
          name: usersExecutive[0].fields.firstName["en-US"] + " " + usersExecutive[0].fields.lastName["en-US"],
          position: usersExecutive[0].fields.position["en-US"],
          whatsappUrl: getWhatsappUrl(usersExecutive[0].fields.phone["en-US"]),
          phone: usersExecutive[0].fields.phone["en-US"],
          imageProfile: usersExecutive[0].fields.imageProfile["en-US"],
        });
       }
      }
    };
    fetchUserExecutive();
  }, [companies]);

  // Get the services for all companies - only fisrt 3 services
  useEffect(() => {
    const fetchServices = async () => {
      if (!companies || companies.length === 0) {
        return;
      }
      
      setServicesLoading(true);
      const allServices: Entry[] = [];
      
      for (const company of companies) {
        if (company.id) {
          const servicesFetched = await getServicesByCompanyId(company.id, 3);
          if (servicesFetched && Array.isArray(servicesFetched)) {
            allServices.push(...servicesFetched);
          }
        }
      }
      
      const transformData = allServices.map((service: Entry) => ({
        id: service.sys.id,
        name: service.fields.name["en-US"],
        description: service.fields.description["en-US"],
        status: service.fields.status["en-US"],
        startDate: service.fields.startDate["en-US"],
        endDate: service.fields.endDate["en-US"],
      }));

      setServices(transformData.slice(0, 3));
      setServicesLoading(false);
    };
    fetchServices();
  }, [companies]);

  useEffect(() => {
    const fetchContents = async () => {
      if (!services || services.length === 0) {
        return;
      }

      setContentsLoading(true);
      const contentsFetched = await getContentsByServiceId(services[0].id || "");
      if (contentsFetched) {
        const transformData = contentsFetched.map((content: Entry) => ({
          id: content.sys.id,
          headline: content.fields.headline["en-US"],
          publicationDate: content.fields.publicationDate["en-US"],
          type: content.fields.type["en-US"],
        }));
        setRecentContents(transformData);
      }
      setContentsLoading(false);
    };
    fetchContents();
  }, [services]);

  // Memoize data objects to prevent unnecessary re-renders
  const dataServices: TableDataProps = useMemo(() => ({
    heads: ["Nombre", "Fecha inicio", "Fecha fin", ""],
    rows: services.map((service) => [
      <div key={service.id} className="flex items-center gap-2">
        <span
          key={service.id}
          className={`${
            service.status ? "bg-cp-primary" : "bg-red-500"
          } w-2 h-2 rounded-full inline-block mr-1`}
        ></span>{" "}
        <span className="whitespace-nowrap">{service.name}</span>
      </div>,
      service.startDate,
      service.endDate,
      <Link
        key={service.id}
        href={`/dashboard/servicios/${service.id}`}
        className="text-cp-primary hover:text-cp-primary-dark transition cursor-pointer hover:underline"
      >
        Ver
      </Link>,
    ]),
  }), [services]);

  const dataContents: TableDataProps = useMemo(() => ({
    heads: ["Nombre", "Fecha de publicación", "Tipo"],
    rows: recentContents.map((content: Content) => [
      content.headline,
      content.publicationDate,
      content.type ? content.type === "post" ? "Post" : "Web" : "No hay tipo",
    ]),
  }), [recentContents]);

  // Calcular estadísticas totales
  const totalStats = useMemo(() => {
    return companyStats.reduce((acc, company) => ({
      contenidos: acc.contenidos + company.contenidos,
      alcance: acc.alcance + company.alcance,
      interacciones: acc.interacciones + company.interacciones,
      impresiones: acc.impresiones + company.impresiones,
    }), {
      contenidos: 0,
      alcance: 0,
      interacciones: 0,
      impresiones: 0,
    });
  }, [companyStats]);

  // Mostrar skeleton mientras se cargan los datos iniciales
  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div>
      <TitleSection title="Home" />

      {/* Estadísticas totales */}
      {statsLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="flex flex-col lg:flex-row gap-5 mt-5">
          <div className="w-full lg:w-1/4 bg-slate-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
            <h2>Contenidos</h2>
            <span className="text-3xl font-bold">{formatNumber(totalStats.contenidos)}</span>
            <span className="text-sm text-slate-400">Total de contenidos</span>
          </div>
          <div className="w-full lg:w-1/4 bg-slate-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
            <h2>Alcance</h2>
            <span className="text-3xl font-bold">{formatNumber(totalStats.alcance)}</span>
            <span className="text-sm text-slate-400">Total de alcance</span>
          </div>
          <div className="w-full lg:w-1/4 bg-slate-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
            <h2>Interacciones</h2>
            <span className="text-3xl font-bold">{formatNumber(totalStats.interacciones)}</span>
            <span className="text-sm text-slate-400">Total de interacciones</span>
          </div>
          <div className="w-full lg:w-1/4 bg-slate-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
            <h2>Impresiones</h2>
            <span className="text-3xl font-bold">{formatNumber(totalStats.impresiones)}</span>
            <span className="text-sm text-slate-400">Total de impresiones</span>
          </div>
        </div>
      )}

      {/* Datos por compañía y contenidos recientes */}
      <div className="mt-5 flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-1/2 bg-slate-900 rounded-lg p-4">
          <h2>Datos por compañía</h2>
          {statsLoading ? (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-slate-400">Cargando estadísticas...</p>
            </div>
          ) : statsError ? (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-red-400">{statsError}</p>
            </div>
          ) : (
            <StackedBarHome data={companyStats} />
          )}
        </div>

        <div className="w-full lg:w-1/2 bg-slate-900 rounded-lg p-4">
          <h2>Contenidos recientes</h2>
          {contentsLoading ? (
            <div className="mt-5">
              <TableSkeleton rows={3} columns={3} />
            </div>
          ) : (
            <>
              <div className="mt-5 overflow-x-scroll w-full custom-scroll">
                <Table data={dataContents} />
              </div>
              <Link
                href={"/dashboard/contenidos"}
                className="text-slate-400 text-center flex justify-center items-center mt-2 hover:text-cp-primary hover:underline transition"
              >
                Ver todos
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-1/3 bg-slate-900 rounded-lg p-4">
          <h2>Contacto</h2>
          <div className="flex items-center gap-4 mt-6">
            <div className="w-32 h-32 bg-slate-800 rounded-full flex justify-center items-center">
              {userExecutive.imageProfile ? (
                <img src={userExecutive.imageProfile} alt="User Executive" className="w-full h-full object-cover rounded-full" />
              ) : (
                <FontAwesomeIcon
                  className="text-slate-400 size-10"
                  icon={faUser}
                />
              )}
            </div>
            <div>
              <h3>{userExecutive.name}</h3>
              <p className="mb-4 text-sm text-slate-400">
                {userExecutive.position}
              </p>
              {/* <Link
                href={userExecutive.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button fullWidthMobile mode="cp-light">
                  Grupo de WhatsApp
                </Button>
              </Link> */}
              <Link
                href={userExecutive.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cp-primary hover:underline transition mt-2 block"
              >
                Mensaje directo: {userExecutive.phone}
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 bg-slate-900 rounded-lg p-4">
          <h2>Mis compañías</h2>
          {companies.length > 0 ? (
            <div className="mt-5">
              <CarouselCompaniesLogos companies={companies} />
            </div>
          ) : (
            <div className="flex justify-center items-center mt-5 h-[100px]">
              <p className="text-slate-400 text-center">No hay compañías</p>
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/3 bg-slate-900 rounded-lg p-4">
          <h2>Mis servicios</h2>
          {servicesLoading ? (
            <div className="mt-0">
              <TableSkeleton rows={3} columns={4} />
            </div>
          ) : services.length > 0 ? (
            <div className="mt-0">
              <div className="mt-0 overflow-x-scroll w-full custom-scroll">
                <Table data={dataServices} />
              </div>
              <Link
                href={"/dashboard/servicios"}
                className="text-slate-400 text-center flex justify-center items-center mt-2 hover:text-cp-primary hover:underline transition"
              >
                Ver todos
              </Link>
            </div>
          ) : (
            <div className="flex justify-center items-center mt-5 h-[100px]">
              <p className="text-slate-400 text-center">No hay servicios</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
