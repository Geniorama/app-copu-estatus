import { Service } from "@/app/types";
import React from "react";

interface ListServicesProps {
    services?: Service[] | null
}

export default function ListServices({services}:ListServicesProps) {
  return (
    <ul>
      {services && services.length > 0 ? (
        services.map((service, i) => (
          <li key={i}>
            <a href="#">{service.name}</a>
          </li>
        ))
      ) : (
        <li className="text-slate-400">No hay servicios disponibles</li>
      )}
    </ul>
  );
}
