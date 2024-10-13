"use client";

import TitleSection from "@/app/utilities/ui/TitleSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@/app/utilities/ui/Button";
import { useState } from "react";
import Select from "@/app/utilities/ui/Select";
import "chart.js/auto";
import dynamic from "next/dynamic";
import Table from "@/app/components/Table/Table";
import type { TableDataProps } from "@/app/types";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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


  const actionLinkButtons = (link: string) => {
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
        actionLinkButtons('https://instagram.com'),
        actionLinkButtons('https://instagram.com')
      ],
      // Otras filas...
    ],
  };
  const [showNotice, setShowNotice] = useState(true);
  const [entries] = useState<TableDataProps>(initialDataTable);

  return (
    <div>
      <ToastContainer theme="dark" toastStyle={{ fontFamily: 'inherit' }} progressClassName={'custom-progress-bar'} />
      <div className="mb-5">
        <TitleSection title="Home" />
      </div>
      <div className=" flex gap-3">
        {showNotice && (
          <div className="bg-slate-800 p-6 rounded-md">
            <p>
              Tu servicio <span>[NOMBRE SERVICIO]</span> está próximo a vencer
            </p>
            <p className="font-bold text-lg my-3 text-cp-primary">
              El día 6 de marzo de 2025
            </p>
            <div className="flex gap-3 items-center mt-5">
              <a
                className="cursor-pointer underline"
                onClick={() => setShowNotice(false)}
              >
                Descartar mensaje
              </a>
              <div>
                <Button mode="cp-green">Renovar servicio</Button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-slate-800 p-6 rounded-md flex-grow">
          <div className=" flex flex-col gap-3 justify-center items-center">
            <div className="w-20">
              <img
                className="w-full aspect-square object-cover rounded-full"
                src="https://img.freepik.com/foto-gratis/mujer-joven-hermosa-sueter-rosa-calido-aspecto-natural-sonriente-retrato-aislado-cabello-largo_285396-896.jpg?t=st=1728569983~exp=1728573583~hmac=f90ae583fe402cc1b6e30853c7ddaea46bae4d5e32b180bd4ba70418ff79f087&w=740"
                alt=""
              />
            </div>
            <div className="w-full text-center">
              <p className="text-xl">
                Hola soy, <span className="font-bold">Venus María</span>
              </p>
              <p>Tu ejecutiva de cuenta</p>
              <p className="text-xs mt-3">Contáctame si tienes dudas</p>
              <ul className="mt-2 text-2xl flex gap-5 justify-center">
                <li>
                  <a
                    className="text-cp-primary hover:text-cp-primary-hover"
                    target="_blank"
                    href="#"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </a>
                </li>
                <li>
                  <a
                    className="text-cp-primary hover:text-cp-primary-hover"
                    target="_blank"
                    href="#"
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className=" bg-cp-primary gap-2 cursor-pointer hover:bg-cp-primary-hover text-cp-dark flex flex-col justify-center items-center text-xl text-center p-6 rounded-md">
          <span className="text-3xl">
            <FontAwesomeIcon icon={faWhatsapp} />
          </span>
          <h3 className="font-bold">GRUPO WHATSAPP</h3>
        </div>
      </div>

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