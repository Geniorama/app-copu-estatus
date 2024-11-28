"use client";

import TitleSection from "@/app/utilities/ui/TitleSection";
import CardCompany from "@/app/components/CardCompany/CardCompany";
import { useFetchCompanies } from "@/app/hooks/useFetchCompanies";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useCallback, useEffect, useState } from "react";
import { getUsersByCompanyId } from "@/app/utilities/helpers/fetchers";
import { Company, User } from "@/app/types";
import { Entry } from "contentful-management";

export interface CompanyWithUser extends Company {
  usersAdmin?: User[] | null;
}

export default function CompaniesClient() {
  const { userData } = useSelector((state: RootState) => state.user);
  const [updatedCompanies, setUpdatedCompanies] = useState<
    CompanyWithUser[] | null
  >(null);
  const [subUpdatedData, setSubUpdatedData] = useState<
    CompanyWithUser[] | null
  >(null);

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

  const { originalData: companies } = useFetchCompanies(
    userData,
    fetchServicesByCompany,
    false
  );

  const fetchUserByCompany = async (companyId: string) => {
    const res = await getUsersByCompanyId(companyId);
    return res;
  };

  const getRoleUser = async (user: Entry) => {
    const fieldsUser = user.fields;

    const userData: User = {
      auth0Id: fieldsUser.auth0Id["en-US"],
    };

    try {
      const response = await fetch("/api/auth0-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "getRole", user: userData }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        return data.auth0User.role; // Asegúrate de que el rol está en 'data.role'
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  useEffect(() => {
    const fetchAndUpdateCompanies = async () => {
      if (companies) {
        try {
          const updatedData: CompanyWithUser[] = await Promise.all(
            companies.map(async (company) => {
              // Obtener los usuarios de la empresa
              const users = company.id
                ? await fetchUserByCompany(company.id)
                : [];

              // Filtrar usuarios con rol 'admin'
              const adminUsers = [];
              for (const user of users) {
                const role = await getRoleUser(user); // Obtener el rol del usuario
                if (role === "admin") {
                  adminUsers.push({
                    ...user,
                    fname: user.fields.firstName["en-US"],
                    lname: user.fields.lastName["en-US"],
                  });
                }
              }

              console.log("admin users", adminUsers);

              return {
                ...company,
                usersAdmin: adminUsers, // Solo los usuarios con rol 'admin'
              };
            })
          );

          const companiesSuperior = updatedData.filter(
            (company) => !company.superior
          );
          const companiesInferior = updatedData.filter(
            (company) => company.superior
          );

          if (companiesSuperior) {
            setUpdatedCompanies(companiesSuperior);
          }

          if (companiesInferior) {
            setSubUpdatedData(companiesInferior);
          }
        } catch (error) {
          console.error(
            "Error al actualizar los datos de las compañías",
            error
          );
        }
      }
    };

    fetchAndUpdateCompanies();
  }, [companies]);

  return (
    <div>
      <div className="mb-5">
        <TitleSection title="Mis Compañías" />
      </div>

      {updatedCompanies && (
        <div className="flex flex-wrap flex-col lg:flex-row gap-4">
          {updatedCompanies.map((company: CompanyWithUser) => (
            <CardCompany
              key={company.id}
              name={company.name || ""}
              executiveLink={company.usersAdmin?.[0].linkWhatsApp || "#"}
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
                  executiveLink={company.usersAdmin?.[0].linkWhatsApp || "#"}
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
    </div>
  );
}
