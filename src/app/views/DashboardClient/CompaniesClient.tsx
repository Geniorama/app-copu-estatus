"use client";

import TitleSection from "@/app/utilities/ui/TitleSection";
import CardCompany from "@/app/components/CardCompany/CardCompany";
import { useFetchCompanies } from "@/app/hooks/useFetchCompanies";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useCallback } from "react";
import type { CompanyWithUser } from "@/app/types";
import { useCompanyWithAdmins } from "@/app/hooks/useCompanyWithAdmins";
import Spinner from "@/app/utilities/ui/Spinner";


export default function CompaniesClient() {
  const { userData } = useSelector((state: RootState) => state.user);
  console.log(userData)

  const fetchServicesByCompany = useCallback(async (companyId: string) => {
    try {
      const response = await fetch(
        `/api/getServicesByCompany?companyId=${companyId}`
      );
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching services by company:", error);
      return [];
    }
  }, []);

  const { originalData: companies, loading: loadingOriginalData } = useFetchCompanies(
    userData,
    fetchServicesByCompany,
    false
  );

  const { updatedCompanies, subUpdatedData, loading } = useCompanyWithAdmins(companies);

  return (
    <div>
      <div className="mb-5">
        <TitleSection title="Mis Compañías" />
      </div>

      {loading || loadingOriginalData ? (
        <div className="w-full h-[70vh] flex justify-center items-center">
          <span className="text-8xl">
            <Spinner />
          </span>
        </div>
      ) : (
        <>
        {updatedCompanies && (
        <div className="flex flex-wrap flex-col lg:flex-row gap-4">
          {updatedCompanies.map((company: CompanyWithUser) => {
            const linkWhatsApp = `https://wa.me/${company.usersAdmin?.[0].phone?.replace(/\+/g, "")}` || "#";
            console.log(company)
            return(
              <CardCompany
                  key={company.id}
                  name={company.name || ""}
                  executiveLink={linkWhatsApp}
                  executiveName={
                    company.usersAdmin && company.usersAdmin.length > 0
                      ? `${company.usersAdmin[0].fname} ${company.usersAdmin[0].lname}` ||
                        ""
                      : "Sin administrador"
                  }
                  icon={company.logo}
                  handle={company.id}
                  active={company.status}
                />
            )
          })}
        </div>
      )}

      {subUpdatedData && subUpdatedData.length > 0 && (
        <div className="mb-5 mt-8">
          <div>
            <h2 className="font-bold">Subcompañias</h2>
            <div className="flex mt-4 flex-wrap flex-col lg:flex-row gap-4">
              {subUpdatedData.map((company: CompanyWithUser) => (
                <CardCompany
                  key={company.id}
                  name={company.name || ""}
                  executiveLink={`https://wa.me/${(company.usersAdmin?.[0].phone)?.replace(/\+/g, "")}` || "#"}
                  executiveName={
                    company.usersAdmin && company.usersAdmin.length > 0
                      ? `${company.usersAdmin[0].fname} ${company.usersAdmin[0].lname}` ||
                        ""
                      : "Sin administrador"
                  }
                  icon={company.logo}
                  handle={company.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="mt-5">
        Si deseas agregar otra compañía,{" "}
        <a
          className="underline text-cp-primary hover:text-cp-primary-hover"
          href="#"
          target="_blank"
        >
          ponte en contacto con COPU
        </a>
      </p>
      </>
      )}
    </div>
  );
}
