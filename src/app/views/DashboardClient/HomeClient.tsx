"use client"

import TitleSection from "@/app/utilities/ui/TitleSection";
import { formatNumber } from "@/app/utilities/helpers/formatters";
import StackedBarHome from "@/app/components/StackedBarHome/StackedBarHome";
import Table from "@/app/components/Table/Table";
import type { TableDataProps } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const data: TableDataProps = {
  heads: ["Titular", "Fecha de publicación", "Compañía"],
  rows: [],
};

export default function HomeClient() {
  return (
    <div>
      <TitleSection title="Home" />

      {/* Estadísticas totales */}
      <div className="flex gap-5 mt-5">
        <div className="w-1/4 bg-slate-900 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
          <h2>Contenidos</h2>
          <span className="text-3xl font-bold">{formatNumber(15000)}</span>
          <span className="text-sm text-slate-400">Total de contenidos</span>
        </div>
        <div className="w-1/4 bg-slate-900 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
          <h2>Alcance</h2>
          <span className="text-3xl font-bold">{formatNumber(15000)}</span>
          <span className="text-sm text-slate-400">Total de alcance</span>
        </div>
        <div className="w-1/4 bg-slate-900 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
          <h2>Interacciones</h2>
          <span className="text-3xl font-bold">{formatNumber(15000)}</span>
          <span className="text-sm text-slate-400">Total de interacciones</span>
        </div>
        <div className="w-1/4 bg-slate-900 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
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
        <div className="w-1/3 bg-slate-900 rounded-lg p-4">
          <h2>Mi ejecutivx asignadx</h2>
          <div className="flex items-center gap-4 mt-4">
              <div className="w-32 h-32 bg-slate-800 rounded-full flex justify-center items-center">
                <FontAwesomeIcon className="text-cp-primary size-10" icon={faUser} />
              </div>
              <div>
                <h3>Nombre del ejecutivo</h3>
                <p>Cargo del ejecutivo</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
