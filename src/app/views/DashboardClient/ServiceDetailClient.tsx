"use client";

import { useState, useEffect } from "react";
import TitleSection from "@/app/utilities/ui/TitleSection";
import Table from "@/app/components/Table/Table";
import ServiceStatsChart from "@/app/components/ServiceStatsChart/ServiceStatsChart";
import ServiceActionsSummary from "@/app/components/ServiceActionsSummary/ServiceActionsSummary";
import type { TableDataProps, Service, Content } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faBuilding,
  faCheckCircle,
  faTimesCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { formatNumber } from "@/app/utilities/helpers/formatters";

interface ServiceDetailClientProps {
  serviceId: string;
}

export default function ServiceDetailClient({
  serviceId,
}: ServiceDetailClientProps) {
  const [service, setService] = useState<Service | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos - aquí deberías hacer la llamada a tu API
    const loadServiceData = async () => {
      setLoading(true);

      // Datos simulados del servicio
      const mockService: Service = {
        id: serviceId,
        name: "Servicio de Marketing Digital",
        description:
          "Servicio completo de marketing digital que incluye gestión de redes sociales, creación de contenido y análisis de métricas.",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        plan: "anual",
        status: true,
        features: [
          { title: "Entradas Marketing Dealers", quantity: 3 },
          { title: "Speakers Congreso Adictos", quantity: 20 },
          { title: "Entradas Congreso Adictos", quantity: 1 },
          { title: "Entradas Cannes Lions", quantity: 12 },
        ],
        companyName: "Compañía Ejemplo",
        accionWebYRss: 5,
        accionPostRss: 10,
      };

      // Datos simulados de contenidos
      const mockContents: Content[] = [
        {
          id: "1",
          headline: "Nuevo producto lanzado",
          publicationDate: "2024-01-15",
          type: "Social Media",
          scope: 1500,
          impressions: 3000,
          interactions: 250,
          serviceName: "Servicio de Marketing Digital",
          socialMediaInfo: [
            {
              id: "1",
              title: "Facebook",
              link: "https://facebook.com/post/123",
              statistics: {
                scope: 800,
                impressions: 1500,
                interactions: 120,
              },
            },
            {
              id: "2",
              title: "Instagram",
              link: "https://instagram.com/p/abc123",
              statistics: {
                scope: 700,
                impressions: 1500,
                interactions: 130,
              },
            },
          ],
        },
        {
          id: "2",
          headline: "Promoción especial de verano",
          publicationDate: "2024-01-10",
          type: "Social Media",
          scope: 1200,
          impressions: 2400,
          interactions: 180,
          serviceName: "Servicio de Marketing Digital",
          socialMediaInfo: [
            {
              id: "3",
              title: "Twitter",
              link: "https://twitter.com/status/456",
              statistics: {
                scope: 600,
                impressions: 1200,
                interactions: 90,
              },
            },
            {
              id: "4",
              title: "LinkedIn",
              link: "https://linkedin.com/posts/789",
              statistics: {
                scope: 600,
                impressions: 1200,
                interactions: 90,
              },
            },
          ],
        },
        {
          id: "3",
          headline: "Testimonio de cliente satisfecho",
          publicationDate: "2024-01-05",
          type: "Social Media",
          scope: 800,
          impressions: 1600,
          interactions: 120,
          serviceName: "Servicio de Marketing Digital",
          socialMediaInfo: [
            {
              id: "5",
              title: "Web",
              link: "https://ejemplo.com/blog/testimonio",
              statistics: {
                scope: 400,
                impressions: 800,
                interactions: 60,
              },
            },
            {
              id: "6",
              title: "Facebook",
              link: "https://facebook.com/post/def456",
              statistics: {
                scope: 400,
                impressions: 800,
                interactions: 60,
              },
            },
          ],
        },
      ];

      setService(mockService);
      setContents(mockContents);
      setLoading(false);
    };

    loadServiceData();
  }, [serviceId]);

  const dataContents: TableDataProps = {
    heads: [
      "Titular",
      "Fecha",
      "Tipo",
      "Alcance",
      "Impresiones",
      "Interacciones",
      "Links",
    ],
    rows: contents.map((content) => [
      content.headline,
      content.publicationDate,
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cp-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-slate-400">
          Servicio no encontrado
        </h2>
        <Link
          href="/dashboard/servicios"
          className="text-cp-primary hover:underline mt-4 inline-block"
        >
          Volver a servicios
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header con botón de regreso */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/servicios"
          className="flex items-center gap-2 text-slate-400 hover:text-cp-primary transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Volver a servicios
        </Link>
      </div>

      <TitleSection title={service.name} />

      {/* Información del servicio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Detalles principales */}
        <div className="lg:col-span-2 bg-slate-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Información del servicio
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faBuilding}
                className="text-slate-400 w-4"
              />
              <span className="text-slate-300">
                Compañía: {service.companyName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-slate-400 w-4"
              />
              <span className="text-slate-300">
                Período: {service.startDate} - {service.endDate}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {service.status ? (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500 w-4"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="text-red-500 w-4"
                />
              )}
              <span
                className={`${
                  service.status ? "text-green-500" : "text-red-500"
                }`}
              >
                Estado: {service.status ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400">Plan:</span>
              <span className="text-cp-primary font-medium capitalize">
                {service.plan}
              </span>
            </div>
          </div>

          {service.description && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Descripción</h3>
              <p className="text-slate-300 leading-relaxed">
                {service.description}
              </p>
            </div>
          )}
        </div>

        {/* Características del servicio */}
        <div className="bg-slate-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Características</h2>

          <div className="space-y-2">
            {service.features.map((feature, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-slate-800 rounded-lg text-sm"
              >
                <span className="text-slate-300">{feature.title}</span>
                {feature.quantity && (
                  <span className="text-cp-primary font-medium">
                    {feature.quantity}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Métricas del servicio */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-lg font-medium mb-3">Total Acciones</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Acciones Web y RSS:</span>
                <span className="text-cp-primary">{service.accionWebYRss}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Acciones Post RSS:</span>
                <span className="text-cp-primary">{service.accionPostRss}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-2">
                <span className="text-slate-400 font-bold text-lg">Total General:</span>
                <span className="text-cp-primary font-bold text-lg">
                  {service.accionPostRss && service.accionWebYRss
                    ? service.accionPostRss + service.accionWebYRss
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de acciones y estadísticas */}
      {contents.length > 0 && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumen de acciones */}
          <div className="bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Resumen de acciones</h2>
            <ServiceActionsSummary service={service} contents={contents} />
          </div>
          {/* Resumen de estadísticas */}
          <div className="bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">
              Resumen de estadísticas
            </h2>
            <ServiceStatsChart contents={contents} />
          </div>
        </div>
      )}

      {/* Contenidos relacionados */}
      <div className="mt-8 bg-slate-900 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Contenidos</h2>
          <span className="text-slate-400 text-sm">
            {contents.length} contenido{contents.length !== 1 ? "s" : ""}
          </span>
        </div>

        {contents.length > 0 ? (
          <div className="overflow-x-auto">
            <Table data={dataContents} />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400">
              No hay contenidos relacionados con este servicio
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
