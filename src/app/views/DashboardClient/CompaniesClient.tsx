"use client";

import type { TableDataProps } from "@/app/types";
import TitleSection from "@/app/utilities/ui/TitleSection";
import CardCompany from "@/app/components/CardCompany/CardCompany";


export default function CompaniesClient() {
  // const [companies, setCompanies] = useState<TableDataProps | null>(initialData);

  return (
    <div>
      
      <div className="mb-5">
        <TitleSection title="Mis Compañías" />
      </div>
      
      <div className="flex flex-wrap flex-col lg:flex-row gap-4">
        <CardCompany
          name="Sancho BBDO"
          executiveLink="#"
          executiveName="Venus María"
          icon={"https://trabajosihay.la/wp-content/uploads/jobsearch-user-files/Sin-ti%CC%81tulo-1-5.png"}
        />
      </div>


      <div className="mb-5 mt-8">
        <div>
          <h2 className="font-bold">Subcompañias</h2>
          <div className="flex mt-4 flex-wrap flex-col lg:flex-row gap-4">
            <CardCompany 
              name="OMD"
              executiveLink="#"
              executiveName="Venus María"
              companySuperior={"Sancho BBDO"}
              icon={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ32LOL6SwltWTw_eCDTtt2U2y6U-81zAMdWw&s"}
            />

            <CardCompany 
              name="OMD"
              executiveLink="#"
              executiveName="Venus María"
              companySuperior={"Sancho BBDO"}
              icon={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ32LOL6SwltWTw_eCDTtt2U2y6U-81zAMdWw&s"}
            />
          </div>
        </div>
      </div>

      <p className="mt-5">Si deseas agregar otra compañía, <a className="underline text-cp-primary hover:text-cp-primary-hover" href="#" target="_blank">ponte en contacto con COPU</a></p>

    </div>
  );
}
