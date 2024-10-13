"use client";

import TitleSection from "@/app/utilities/ui/TitleSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import {
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Select from "@/app/utilities/ui/Select";
import "chart.js/auto";
import dynamic from "next/dynamic";
import Table from "@/app/components/Table/Table";
import type { TableDataProps } from "@/app/types";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BoxNotices from "./BoxNotices";

const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
  ssr: false,
});

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

const data = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "GeeksforGeeks Pie Chart",
      data: [65, 59, 80, 81, 56], // Estos datos deben representar partes de un todo
      backgroundColor: [
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
      ],
      borderColor: [
        "rgba(75, 192, 192, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export default function DashboardHomeClient() {
  const notify = (message: string) => toast(message);

  const handleCopyText = async (textToCopy:string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      notify('Enlace copiado al portapapeles')
    } catch (err) {
      console.error('Error al copiar: ', err);
    }
  };


  const actionLinkButtons = (link: string | null) => {
    if(!link){
      return(
        <p>Sin enlace</p>
      )
    }

    return (
      <div className="flex gap-3 text-xl">
        <button  onClick={() => handleCopyText(link)} className="inline-block text-cp-primary hover:text-cp-primary-hover" title="Copiar Url">
          <FontAwesomeIcon icon={faClone} />
        </button>
        <a className="inline-block text-cp-primary hover:text-cp-primary-hover" title="Abrir enlace" target="_blank" href={link}>
          <FontAwesomeIcon icon={faUpRightFromSquare} />
        </a>
      </div>
    );
  };
  const initialDataTable: TableDataProps = {
    heads: [
      "ID",
      "Tipo acción",
      "Fecha publicación",
      "Url Web",
      "Url IG",
      "Url FB",
      "Url LK",
      "Url YT",
      "Url Tk",
    ],
    rows: [
      [
        "1",
        "Post en social media",
        "1 feb 2025",
        actionLinkButtons('https://instagram.com'),
        actionLinkButtons('https://facebook.com'),
        actionLinkButtons('https://linkedin.com'),
        actionLinkButtons('https://instagram.com'),
        actionLinkButtons(null),
        actionLinkButtons('https://instagram.com')
      ],

      [
        "2",
        "Post en social media",
        "13 feb 2025",
        actionLinkButtons('https://instagram.com'),
        actionLinkButtons('https://facebook.com'),
        actionLinkButtons('https://linkedin.com'),
        actionLinkButtons('https://instagram.com'),
        actionLinkButtons(null),
        actionLinkButtons('https://instagram.com')
      ],
      // Otras filas...
    ],
  };
  const [entries] = useState<TableDataProps>(initialDataTable);

  return (
    <div>
      <ToastContainer toastStyle={{ fontFamily: 'inherit' }} progressClassName={'custom-progress-bar'} />
      <div className="mb-5">
        <TitleSection title="Home" />
      </div>
      <BoxNotices />
      <div>
        <div className="py-3 mt-2 flex items-center gap-3 justify-end">
          <span>Filtrar por fecha:</span>
          <div>
            <Select options={[{ value: "1", name: "Último mes" }]} />
          </div>
        </div>

        <div className=" flex gap-3">
          <div className="w-1/4">
            <h3 className="font-bold mb-3">CONTENIDOS</h3>
            <Pie data={data} />
          </div>

          <div className="w-3/4">
            <h3 className="font-bold mb-3">ESTADÍSTICAS</h3>
            <div className=" flex gap-2">
              <div className=" w-1/3 bg-slate-800 p-4">
                <h4>Alcance</h4>
                <Line data={data} />
              </div>

              <div className=" w-1/3 bg-slate-800 p-4">
                <h4>Impresiones</h4>
              </div>

              <div className=" w-1/3 bg-slate-800 p-4">
                <h4>Interacciones</h4>
              </div>
            </div>

            <a
              className="my-4 inline-block bg-cp-primary text-cp-dark p-2 rounded-md px-3 hover:bg-cp-primary-hover"
              target="_blank"
              href="#"
            >
              <FontAwesomeIcon icon={faGoogleDrive} />
              <span className="ml-2">Estadísticas anteriores</span>
            </a>
          </div>
        </div>

        <div className="mt-10 mb-4">
          <h3 className="font-bold mb-3">Publicaciones recientes</h3>
          {entries && (
            <div>
              <Table data={entries} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
