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
import Spinner from "@/app/utilities/ui/Spinner";
import BoxLogo from "@/app/utilities/ui/BoxLogo";

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

  useEffect(() => {
    const loadCompanyData = async () => {
      setLoading(true);

      // Datos simulados de la compañía
      const mockCompany: Company = {
        id: companyId,
        name: "TechCorp Solutions",
        businessName: "TechCorp Solutions S.A.",
        address: "123 Tech Street, Silicon Valley, CA",
        phone: "+1 (555) 123-4567",
        linkWhatsApp: "+15551234567",
        nit: "900.123.456-7",
        driveLink: "https://drive.google.com/drive/folders/techcorp-stats",
        status: true,
        // logo: "/img/logo-techcorp.png",
      };

      // Datos simulados de compañía superior
      const mockSuperiorCompany: Company = {
        id: "superior-1",
        name: "Global Tech Holdings",
        businessName: "Global Tech Holdings S.A.",
        address: "456 Corporate Ave, Business District, CA",
        phone: "+1 (555) 987-6543",
        status: true,
        // logo: "/img/logo-global-tech.png",
      };

      // Datos simulados de subcompañías
      const mockSubCompanies: Company[] = [
        {
          id: "sub-1",
          name: "TechCorp Mobile",
          businessName: "TechCorp Mobile S.A.",
          status: true,
          // logo: "/img/logo-mobile.png",
        },
        {
          id: "sub-2",
          name: "TechCorp Cloud",
          businessName: "TechCorp Cloud S.A.",
          status: true,
          // logo: "/img/logo-cloud.png",
        },
        {
          id: "sub-3",
          name: "TechCorp AI",
          businessName: "TechCorp AI S.A.",
          status: false,
          // logo: "/img/logo-ai.png",
        },
      ];

      // Datos simulados de servicios
      const mockServices: Service[] = [
        {
          id: "service-1",
          name: "COP-1001-2024",
          description: "Servicio de desarrollo web completo",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          plan: "anual",
          status: true,
          features: [
            { title: "Desarrollo Frontend", quantity: 1 },
            { title: "Desarrollo Backend", quantity: 1 },
            { title: "Base de Datos", quantity: 1 },
          ],
          companyName: "TechCorp Solutions",
          accionWebYRss: 5,
          accionPostRss: 10,
        },
        {
          id: "service-2",
          name: "COP-1002-2024",
          description: "Servicio de marketing digital",
          startDate: "2024-02-01",
          endDate: "2024-12-31",
          plan: "anual",
          status: true,
          features: [
            { title: "Gestión Redes Sociales", quantity: 1 },
            { title: "Creación de Contenido", quantity: 1 },
            { title: "Análisis de Métricas", quantity: 1 },
          ],
          companyName: "TechCorp Solutions",
          accionWebYRss: 3,
          accionPostRss: 8,
        },
        {
          id: "service-3",
          name: "COP-1003-2024",
          description: "Servicio de consultoría IT",
          startDate: "2024-03-01",
          endDate: "2024-12-31",
          plan: "anual",
          status: false,
          features: [
            { title: "Auditoría de Sistemas", quantity: 1 },
            { title: "Optimización de Procesos", quantity: 1 },
          ],
          companyName: "TechCorp Solutions",
          accionWebYRss: 2,
          accionPostRss: 5,
        },
      ];

      // Datos simulados de contenidos
      const mockContents: Content[] = [
        {
          id: "1",
          companyName: "TechCorp Solutions",
          companyId: companyId,
          serviceId: "service-1",
          serviceName: "COP-1001-2024",
          type: "post",
          headline: "Nuevas tendencias en desarrollo web para 2024",
          publicationDate: "2024-01-15",
          scope: 15000,
          impressions: 25000,
          interactions: 1200,
          socialMediaInfo: [
            {
              id: "instagram",
              title: "Instagram",
              link: "https://instagram.com/techcorp/post1",
              statistics: { scope: 8000, impressions: 12000, interactions: 600 }
            },
            {
              id: "facebook",
              title: "Facebook",
              link: "https://facebook.com/techcorp/post1",
              statistics: { scope: 4000, impressions: 8000, interactions: 300 }
            },
            {
              id: "linkedin",
              title: "LinkedIn",
              link: "https://linkedin.com/company/techcorp/post1",
              statistics: { scope: 3000, impressions: 5000, interactions: 300 }
            }
          ]
        },
        {
          id: "2",
          companyName: "TechCorp Solutions",
          companyId: companyId,
          serviceId: "service-2",
          serviceName: "COP-1002-2024",
          type: "web",
          headline: "Estrategias efectivas de marketing digital",
          publicationDate: "2024-01-14",
          scope: 22000,
          impressions: 35000,
          interactions: 1800,
          socialMediaInfo: [
            {
              id: "webcopu",
              title: "Web",
              link: "https://techcorp.com/blog/marketing-digital",
              statistics: { scope: 15000, impressions: 25000, interactions: 1200 }
            },
            {
              id: "linkedin",
              title: "LinkedIn",
              link: "https://linkedin.com/company/techcorp/post2",
              statistics: { scope: 7000, impressions: 10000, interactions: 600 }
            }
          ]
        },
        {
          id: "3",
          companyName: "TechCorp Solutions",
          companyId: companyId,
          serviceId: "service-1",
          serviceName: "COP-1001-2024",
          type: "post",
          headline: "Inteligencia Artificial en el desarrollo de software",
          publicationDate: "2024-01-13",
          scope: 18000,
          impressions: 28000,
          interactions: 1500,
          socialMediaInfo: [
            {
              id: "instagram",
              title: "Instagram",
              link: "https://instagram.com/techcorp/post3",
              statistics: { scope: 10000, impressions: 15000, interactions: 800 }
            },
            {
              id: "facebook",
              title: "Facebook",
              link: "https://facebook.com/techcorp/post3",
              statistics: { scope: 5000, impressions: 8000, interactions: 400 }
            },
            {
              id: "xtwitter",
              title: "X (Twitter)",
              link: "https://twitter.com/techcorp/post3",
              statistics: { scope: 3000, impressions: 5000, interactions: 300 }
            }
          ]
        },
      ];

      // Calcular estadísticas
      const totalServices = mockServices.length;
      const activeServices = mockServices.filter(service => service.status).length;
      const totalContents = mockContents.length;
      const totalScope = mockContents.reduce((sum, content) => sum + (content.scope || 0), 0);
      const totalImpressions = mockContents.reduce((sum, content) => sum + (content.impressions || 0), 0);
      const totalInteractions = mockContents.reduce((sum, content) => sum + (content.interactions || 0), 0);

      setCompany(mockCompany);
      setServices(mockServices);
      setContents(mockContents);
      setSubCompanies(mockSubCompanies);
      setSuperiorCompany(mockSuperiorCompany);
      setStats({
        totalServices,
        activeServices,
        totalContents,
        totalScope,
        totalImpressions,
        totalInteractions,
      });
      setLoading(false);
    };

    loadCompanyData();
  }, [companyId]);

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

  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Detalle de Compañía" />
        </div>
        <div className="w-full h-[70vh] flex justify-center items-center">
          <span className="text-8xl">
            <Spinner />
          </span>
        </div>
      </div>
    );
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