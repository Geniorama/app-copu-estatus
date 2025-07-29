"use client";

import TitleSection from "@/app/utilities/ui/TitleSection";
import CardCompany from "@/app/components/CardCompany/CardCompany";
import { useFetchCompanies } from "@/app/hooks/useFetchCompanies";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useCallback } from "react";
import type { CompanyWithUser } from "@/app/types";
import { useCompanyWithAdmins } from "@/app/hooks/useCompanyWithAdmins";
import CompaniesSkeleton from "@/app/components/SkeletonLoader/CompaniesSkeleton";


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

  const { updatedCompanies, subUpdatedData, loading, error } = useCompanyWithAdmins(companies);

  // Función para obtener el nombre de la compañía superior
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getSuperiorCompanyName = (superiorData: any) => {
    if (!superiorData) return null;
    
    // Si superiorData es un objeto con fields, extraer el nombre
    if (superiorData.fields && superiorData.fields.name) {
      return superiorData.fields.name;
    }
    
    return null;
  };

  // Función para crear el enlace de WhatsApp a partir del número de teléfono
  const createWhatsAppLink = (phoneNumber: string | undefined) => {
    if (!phoneNumber) return "#";
    
    // Limpiar el número de teléfono (remover espacios, guiones, paréntesis, etc.)
    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Si el número no empieza con código de país, agregar +57 (Colombia)
    let formattedNumber = cleanNumber;
    if (!cleanNumber.startsWith('+')) {
      if (cleanNumber.startsWith('57')) {
        formattedNumber = '+' + cleanNumber;
      } else if (cleanNumber.startsWith('0')) {
        formattedNumber = '+57' + cleanNumber.substring(1);
      } else {
        formattedNumber = '+57' + cleanNumber;
      }
    }
    
    // Remover el + para el enlace de WhatsApp
    const whatsappNumber = formattedNumber.replace('+', '');
    
    return `https://wa.me/${whatsappNumber}`;
  };

  // Mostrar skeleton mientras se cargan los datos
  if (loading || loadingOriginalData) {
    return (
      <CompaniesSkeleton 
        mainCompaniesCount={companies?.length || 3}
        subCompaniesCount={subUpdatedData?.length || 0}
      />
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div>
        <div className="mb-5">
          <TitleSection title="Mis Compañías" />
        </div>
        <div className="text-center p-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-cp-primary text-white px-4 py-2 rounded hover:bg-cp-primary-dark"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <TitleSection title="Mis Compañías" />
      </div>

      {updatedCompanies && (
        <div className="flex flex-wrap flex-col lg:flex-row gap-4">
          {updatedCompanies.map((company: CompanyWithUser) => {
            const adminUser = company.usersAdmin && company.usersAdmin.length > 0 ? company.usersAdmin[0] : null;
            const executiveLink = createWhatsAppLink(adminUser?.phone);
            console.log('Main Company:', company.name, 'UsersAdmin:', company.usersAdmin, 'Superior:', company.superior);
            console.log('Admin User:', adminUser?.fname, adminUser?.lname, 'Phone:', adminUser?.phone, 'WhatsApp Link:', executiveLink);
            return(
              <CardCompany
                  key={company.id}
                  name={company.name || ""}
                  executiveLink={executiveLink}
                  executiveName={
                    adminUser
                      ? `${adminUser.fname} ${adminUser.lname}` || ""
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
              {subUpdatedData.map((company: CompanyWithUser) => {
                const superiorCompanyName = getSuperiorCompanyName(company.superior);
                const adminUser = company.usersAdmin && company.usersAdmin.length > 0 ? company.usersAdmin[0] : null;
                const executiveLink = createWhatsAppLink(adminUser?.phone);
                console.log('Sub Company:', company.name, 'Superior:', company.superior, 'SuperiorName:', superiorCompanyName);
                console.log('Sub Company UsersAdmin:', company.usersAdmin);
                console.log('Sub Admin User:', adminUser?.fname, adminUser?.lname, 'Phone:', adminUser?.phone, 'WhatsApp Link:', executiveLink);
                
                return (
                  <CardCompany
                    key={company.id}
                    name={company.name || ""}
                    executiveLink={executiveLink}
                    executiveName={
                      adminUser
                        ? `${adminUser.fname} ${adminUser.lname}` || ""
                        : "Sin administrador"
                    }
                    icon={company.logo}
                    handle={company.id}
                    active={company.status}
                    companySuperior={superiorCompanyName}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      <p className="mt-5">
        Si deseas agregar otra compañía,{" "}
        <a
          className="underline text-cp-primary hover:text-cp-primary-hover"
          href="https://wa.link/3ur7qr"
          target="_blank"
        >
          ponte en contacto con COPU
        </a>
      </p>
    </div>
  );
}
