"use client";

import { useState, useEffect } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import Table from "@/app/components/Table/Table";
import type { TableDataProps, Company, Service, Content } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faBuilding,
  faCheckCircle,
  faTimesCircle,
  faArrowLeft,
  faUsers,
  faChartLine,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { formatNumber, formattedDate } from "@/app/utilities/helpers/formatters";
import BoxLogo from "@/app/utilities/ui/BoxLogo";
import CompanyDetailSkeleton from "@/app/components/SkeletonLoader/CompanyDetailSkeleton";
import { getCompanyById, getServicesByCompanyId, getContentsByServiceId, getSubCompanies } from "@/app/utilities/helpers/fetchers";

interface CompanyDetailClientProps {
  companyId: string;
}

interface CompanyStats {
  totalServices: number;
  activeServices: number;
  totalContents: number;
  totalScope: number;
  totalImpressions: number;
  totalInteractions: number;
}

export default function CompanyDetailClient({
  companyId,
}: CompanyDetailClientProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [subCompanies, setSubCompanies] = useState<Company[]>([]);
  const [superiorCompany, setSuperiorCompany] = useState<Company | null>(null);
  const [stats, setStats] = useState<CompanyStats>({
    totalServices: 0,
    activeServices: 0,
    totalContents: 0,
    totalScope: 0,
    totalImpressions: 0,
    totalInteractions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanyData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Obtener información de la compañía
        const companyData = await getCompanyById(companyId);
        if (!companyData) {
          throw new Error("Compañía no encontrada");
        }

        console.log('Raw Company Data:', companyData);
        console.log('Company Fields:', companyData.fields);
        console.log('Company Superior Field:', companyData.fields?.superior);

        // Obtener servicios de la compañía
        const servicesData = await getServicesByCompanyId(companyId);
        if (!servicesData) {
          console.warn("No se pudieron obtener los servicios de la compañía");
        }
        console.log('Services Data:', servicesData);
        
        // Obtener contenidos de todos los servicios
        const allContents: Content[] = [];
        if (servicesData && Array.isArray(servicesData)) {
          await Promise.all(servicesData.map(async (service: Service) => {
            if (service.id) {
              const serviceContents = await getContentsByServiceId(service.id);
              if (serviceContents && Array.isArray(serviceContents)) {
                console.log(`Contents for service ${service.id}:`, serviceContents);
                allContents.push(...serviceContents);
              } else {
                console.log(`No contents found for service ${service.id}`);
              }
            }
          }));
        }

        console.log('All Contents:', allContents);

        // Obtener compañía superior si existe
        let superiorCompanyData: Company | null = null;
        if (companyData.fields?.superior?.["en-US"]?.sys?.id) {
          try {
            const superiorId = companyData.fields.superior["en-US"].sys.id;
            const superiorEntry = await getCompanyById(superiorId);
            if (superiorEntry) {
              superiorCompanyData = {
                id: superiorEntry.sys?.id,
                name: superiorEntry.fields?.name?.["en-US"] || "",
                businessName: superiorEntry.fields?.businessName?.["en-US"] || "",
                nit: superiorEntry.fields?.nit?.["en-US"] || "",
                phone: superiorEntry.fields?.phone?.["en-US"] || "",
                address: superiorEntry.fields?.address?.["en-US"] || "",
                driveLink: superiorEntry.fields?.driveLink?.["en-US"] || "",
                status: superiorEntry.fields?.status?.["en-US"] ?? true,
                logo: superiorEntry.fields?.logo?.["en-US"] || "",
                superior: superiorEntry.fields?.superior?.["en-US"] || null,
              };
            }
            console.log('Superior Company Data:', superiorCompanyData);
          } catch (superiorError) {
            console.log("Error obteniendo compañía superior:", superiorError);
          }
        }

        // Obtener subcompañías (compañías que tienen esta como superior)
        let subCompaniesData: Company[] = [];
        if (companyData.sys?.id) {
          try {
            console.log('Calling getSubCompanies with ID:', companyData.sys.id);
            console.log('Company ID type:', typeof companyData.sys.id);
            console.log('Company ID value:', companyData.sys.id);
            
            const subCompaniesResult = await getSubCompanies(companyData.sys.id);
            console.log('getSubCompanies result:', subCompaniesResult);
            console.log('getSubCompanies result type:', typeof subCompaniesResult);
            console.log('getSubCompanies result is array:', Array.isArray(subCompaniesResult));
            
            if (subCompaniesResult && Array.isArray(subCompaniesResult)) {
              subCompaniesData = subCompaniesResult;
            }
            console.log('Sub Companies Data:', subCompaniesData);
          } catch (subCompaniesError) {
            console.log("Error obteniendo subcompañías:", subCompaniesError);
          }
        } else {
          console.log('No company ID found for subcompanies query');
          console.log('companyData.sys:', companyData.sys);
        }

        // Calcular estadísticas
        const totalServices = servicesData && Array.isArray(servicesData) ? servicesData.length : 0;
        const activeServices = servicesData && Array.isArray(servicesData) ? servicesData.filter((service: Service) => service.status).length : 0;
        const totalContents = allContents.length;
        const totalScope = allContents.reduce((sum, content) => sum + (content.scope || 0), 0);
        const totalImpressions = allContents.reduce((sum, content) => sum + (content.impressions || 0), 0);
        const totalInteractions = allContents.reduce((sum, content) => sum + (content.interactions || 0), 0);

        // Transformar datos de la compañía de forma segura
        const transformCompanyData = {
          id: companyData.sys?.id,
          name: companyData.fields?.name?.["en-US"] || "",
          businessName: companyData.fields?.businessName?.["en-US"] || "",
          nit: companyData.fields?.nit?.["en-US"] || "",
          phone: companyData.fields?.phone?.["en-US"] || "",
          address: companyData.fields?.address?.["en-US"] || "",
          driveLink: companyData.fields?.driveLink?.["en-US"] || "",
          status: companyData.fields?.status?.["en-US"] ?? true,
          logo: companyData.fields?.logo?.["en-US"] || "",
          superior: companyData.fields?.superior?.["en-US"] || null,
        }

        console.log('Transformed Company Data:', transformCompanyData);

        setCompany(transformCompanyData);
        setServices(servicesData && Array.isArray(servicesData) ? servicesData : []);
        setContents(allContents);
        setSubCompanies(subCompaniesData);
        setSuperiorCompany(superiorCompanyData);
        setStats({
          totalServices,
          activeServices,
          totalContents,
          totalScope,
          totalImpressions,
          totalInteractions,
        });

        console.log('Company Detail Data:', {
          company: companyData,
          services: servicesData,
          contents: allContents,
          superior: superiorCompanyData,
          stats: {
            totalServices,
            activeServices,
            totalContents,
            totalScope,
            totalImpressions,
            totalInteractions,
          }
        });

      } catch (err) {
        console.error("Error cargando datos de la compañía:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [companyId]);

  // Mostrar error si existe
  if (error) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Detalle de Compañía" />
        </div>
        <div className="text-center p-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-cp-primary text-white px-4 py-2 rounded hover:bg-cp-primary-dark"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const servicesData: TableDataProps = {
    heads: [
      "Servicio",
      "Descripción",
      "Fecha Inicio",
      "Fecha Fin",
      "Plan",
      "Estado",
      "Acciones Web",
      "Acciones Post",
    ],
    rows: services.map((service) => [
      service.name,
      service.description,
      formattedDate(service.startDate),
      formattedDate(service.endDate),
      service.plan,
      <span
        key={service.id}
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          service.status
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        <FontAwesomeIcon
          icon={service.status ? faCheckCircle : faTimesCircle}
          className="mr-1"
        />
        {service.status ? "Activo" : "Inactivo"}
      </span>,
      service.accionWebYRss,
      service.accionPostRss,
    ]),
  };

  console.log('Services for table:', services);
  console.log('Services table data:', servicesData);

  const contentsData: TableDataProps = {
    heads: [
      "Servicio",
      "Titular",
      "Fecha Publicación",
      "Tipo",
      "Alcance",
      "Impresiones",
      "Interacciones",
      "Links",
    ],
    rows: contents.map((content) => [
      content.serviceName,
      content.headline,
      formattedDate(content.publicationDate),
      content.type,
      formatNumber(content.scope || 0),
      formatNumber(content.impressions || 0),
      formatNumber(content.interactions || 0),
      <div key={content.id} className="flex flex-wrap gap-2">
        {content.socialMediaInfo && content.socialMediaInfo.length > 0 ? (
          content.socialMediaInfo.map((social, index) => (
            <a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cp-primary hover:text-cp-primary-dark transition text-sm bg-slate-800 px-2 py-1 rounded"
              title={social.title}
            >
              {social.title || `Link ${index + 1}`}
            </a>
          ))
        ) : (
          <span className="text-slate-400 text-sm">Sin links</span>
        )}
      </div>,
    ]),
  };

  console.log('Contents for table:', contents);
  console.log('Contents table data:', contentsData);

  if (loading) {
    return <CompanyDetailSkeleton />;
  }

  if (!company) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Detalle de Compañía" />
        </div>
        <div className="text-center p-5 mt-10">
          <p className="text-slate-400">Compañía no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header con botón de regreso */}
      <div className="mb-5">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/dashboard/companias"
            className="flex items-center gap-2 text-cp-primary hover:text-cp-primary-dark transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Volver a Compañías</span>
          </Link>
        </div>
        <TitleSection title={`${company.name}`} />
      </div>

      {/* Información de la compañía y estadísticas en 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Columna izquierda - Información de la compañía */}
        <div className="bg-slate-800 rounded-lg p-6">
          {/* Logo y nombre de la compañía */}
          <div className="flex items-center gap-0 mb-6">
            <div className="w-20 h-20 flex justify-start items-center">
              <BoxLogo url={company.logo || ""} type="logo" />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-slate-200">{company.name}</h2>
              {company.businessName && company.businessName !== company.name && (
                <p className="text-slate-400">{company.businessName}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faBuilding} className="text-cp-primary text-xl" />
              <div>
                <h3 className="font-semibold text-slate-200">Razón Social</h3>
                <p className="text-slate-400">{company.businessName || company.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faGlobe} className="text-cp-primary text-xl" />
              <div>
                <h3 className="font-semibold text-slate-200">NIT</h3>
                <p className="text-slate-400">{company.nit || "No disponible"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faCalendar} className="text-cp-primary text-xl" />
              <div>
                <h3 className="font-semibold text-slate-200">Teléfono</h3>
                <p className="text-slate-400">{company.phone || "No disponible"}</p>
              </div>
            </div>
            {company.address && (
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faGlobe} className="text-cp-primary text-xl" />
                <div>
                  <h3 className="font-semibold text-slate-200">Dirección</h3>
                  <p className="text-slate-400">{company.address}</p>
                </div>
              </div>
            )}
            {company.driveLink && (
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faChartLine} className="text-cp-primary text-xl" />
                <div>
                  <h3 className="font-semibold text-slate-200">Estadísticas Anteriores</h3>
                  <a
                    href={company.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cp-primary hover:text-cp-primary-dark transition"
                  >
                    Ver en Google Drive
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha - Compañías relacionadas */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-slate-200 mb-4">Compañías Relacionadas</h3>
          
          {/* Compañía Superior */}
          {superiorCompany && (
            <div className="mb-6">
              <h4 className="font-semibold text-slate-300 mb-3">Compañía Superior</h4>
              <Link
                href={`/dashboard/companias/${superiorCompany.id}`}
                className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
              >
                <BoxLogo url={superiorCompany.logo || ""} type="logo" />
                <div className="flex-1">
                  <p className="font-medium text-slate-200">{superiorCompany.name}</p>
                  <p className="text-sm text-slate-400">{superiorCompany.businessName}</p>
                </div>
              </Link>
            </div>
          )}

          {/* Subcompañías */}
          {subCompanies.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-300 mb-3">Subcompañías</h4>
              <div className="space-y-2">
                {subCompanies.map((subCompany) => (
                  <Link
                    key={subCompany.id}
                    href={`/dashboard/companias/${subCompany.id}`}
                    className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
                  >
                    <BoxLogo url={subCompany.logo || ""} type="logo" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-200">{subCompany.name}</p>
                      <p className="text-sm text-slate-400">{subCompany.businessName}</p>
                      {!subCompany.status && (
                        <span className="text-xs text-red-400">Inactiva</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!superiorCompany && subCompanies.length === 0 && (
            <p className="text-slate-400 text-center py-4">No hay compañías relacionadas</p>
          )}
        </div>
      </div>

      {/* Estadísticas en una sola fila con 3 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <FontAwesomeIcon icon={faUsers} className="text-cp-primary text-3xl mb-2" />
          <h3 className="text-xl font-bold text-slate-200">Servicios</h3>
          <p className="text-4xl font-bold text-cp-primary">{stats.totalServices}</p>
          <p className="text-sm text-slate-400">{stats.activeServices} activos</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <FontAwesomeIcon icon={faChartLine} className="text-cp-primary text-3xl mb-2" />
          <h3 className="text-xl font-bold text-slate-200">Contenidos</h3>
          <p className="text-4xl font-bold text-cp-primary">{stats.totalContents}</p>
          <p className="text-sm text-slate-400">publicaciones</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <FontAwesomeIcon icon={faGlobe} className="text-cp-primary text-3xl mb-2" />
          <h3 className="text-xl font-bold text-slate-200">Alcance Total</h3>
          <p className="text-4xl font-bold text-cp-primary">{formatNumber(stats.totalScope)}</p>
          <p className="text-sm text-slate-400">personas alcanzadas</p>
        </div>
      </div>

      {/* Servicios */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-200">Servicios recientes</h2>
          <Link
            href={`/dashboard/servicios?company=${companyId}`}
            className="text-cp-primary hover:text-cp-primary-dark transition font-medium"
          >
            Ver todo →
          </Link>
        </div>
        <Table data={servicesData} />
      </div>

      {/* Contenidos */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-200">Contenidos recientes</h2>
          <Link
            href={`/dashboard/contenidos?company=${companyId}`}
            className="text-cp-primary hover:text-cp-primary-dark transition font-medium"
          >
            Ver todo →
          </Link>
        </div>
        <Table data={contentsData} />
      </div>
    </div>
  );
}