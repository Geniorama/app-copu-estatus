"use client"

import TitleSection from "@/app/utilities/ui/TitleSection";
import { formatNumber } from "@/app/utilities/helpers/formatters";
import StackedBarHome from "@/app/components/StackedBarHome/StackedBarHome";
import Table from "@/app/components/Table/Table";
import type { TableDataProps } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Button from "@/app/utilities/ui/Button";
import { useState } from "react";
import Link from "next/link";
import type { Company, Service } from "@/app/types";
import CarouselCompaniesLogos from "@/app/components/CarouselCompaniesLogos/CarouselCompaniesLogos";

const data: TableDataProps = {
  heads: ["Titular", "Fecha de publicación", "Compañía"],
  rows: [],
};

export default function HomeClient() {
  const [groupWhatsapp, setGroupWhatsapp] = useState('https://wa.me/573178521212');
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Servicio 1",
      description: "Descripción del servicio 1",
      features: [],
      status: true,
      startDate: "2021-01-01",
      endDate: "2021-01-01",
    },
  ])
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "Compañía 1",
      logo: "https://placehold.co/500x500",
    },
    {
      id: "2",
      name: "Compañía 2",
      logo: "https://placehold.co/500x500",
    },
    {
      id: "3",
      name: "Compañía 3",
      logo: "https://placehold.co/500x500",
    },
    {
      id: "4",
      name: "Compañía 4",
      logo: "https://placehold.co/500x500",
    },
  ]);

  const dataServices: TableDataProps = {
    heads: ["Nombre", "Fecha de fin", "Estado"],
    rows: services.map((service) => [service.name, service.startDate, service.status ? "Activo" : "Inactivo"]),
  };


  return (
    <div>
      <TitleSection title="Home" />

      {/* Estadísticas totales */}
      <div className="flex gap-5 mt-5">
        <div className="w-1/4 bg-slate-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
          <h2>Contenidos</h2>
          <span className="text-3xl font-bold">{formatNumber(15000)}</span>
          <span className="text-sm text-slate-400">Total de contenidos</span>
        </div>
        <div className="w-1/4 bg-slate-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
          <h2>Alcance</h2>
          <span className="text-3xl font-bold">{formatNumber(15000)}</span>
          <span className="text-sm text-slate-400">Total de alcance</span>
        </div>
        <div className="w-1/4 bg-slate-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
          <h2>Interacciones</h2>
          <span className="text-3xl font-bold">{formatNumber(15000)}</span>
          <span className="text-sm text-slate-400">Total de interacciones</span>
        </div>
        <div className="w-1/4 bg-slate-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
          <h2>Impresiones</h2>
          <span className="text-3xl font-bold">{formatNumber(15000)}</span>
          <span className="text-sm text-slate-400">Total de impresiones</span>
        </div>
      </div>

      {/* Datos por compañía y contenidos recientes */}
      <div className="mt-5 flex gap-5">
        <div className="w-1/2 bg-slate-900 rounded-lg p-4">
          <h2>Datos por compañía</h2>
          <StackedBarHome />
        </div>

        <div className="w-1/2 bg-slate-900 rounded-lg p-4">
          <h2>Contenidos recientes</h2>
          <Table data={data} />
        </div>
      </div>

      <div className="mt-5 flex gap-5">
        <div className="lg:w-1/3 bg-slate-900 rounded-lg p-4">
          <h2>Contacto</h2>
          <div className="flex items-center gap-4 mt-4">
              <div className="w-32 h-32 bg-slate-800 rounded-full flex justify-center items-center">
                <FontAwesomeIcon className="text-slate-400 size-10" icon={faUser} />
              </div>
              <div>
                <h3>Nombre del ejecutivo</h3>
                <p className="mb-4 text-sm text-slate-400">Cargo del ejecutivo</p>
                
                <Link href={groupWhatsapp} target="_blank" rel="noopener noreferrer">
                  <Button fullWidthMobile mode="cp-light">Enviar mensaje</Button>
                </Link>
              </div>
            </div>
        </div>

        <div className="lg:w-1/3 bg-slate-900 rounded-lg p-4">
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

        <div className="lg:w-1/3 bg-slate-900 rounded-lg p-4">
          <h2>Mis servicios</h2>
          {services.length > 0 ? (
            <div className="mt-5">
              <div className="mt-0 overflow-x-scroll w-full custom-scroll">
                <Table data={dataServices} />
              </div>
              <Link href={'/dashboard/client/services'} className="text-slate-400 text-center flex justify-center items-center mt-2 hover:text-cp-primary hover:underline transition">Ver todos</Link>
            </div>
          ) : (
            <div className="flex justify-center items-center mt-5 h-[100px]">
              <p className="text-slate-400 text-center">No hay servicios</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
