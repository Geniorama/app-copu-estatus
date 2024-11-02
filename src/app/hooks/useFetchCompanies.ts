// useFetchCompanies.ts
import { useState, useEffect } from "react";
import { Company, User, Metadata, Sys, Service } from "@/app/types";

export const useFetchCompanies = (userData: User | undefined, fetchServicesByCompany: (companyId: string) => Promise<Service[]>) => {
  const [originalData, setOriginalData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAllCompanyServices = async () => {
      if (userData && userData.companies) {
        const transformDataForCompany = await Promise.all(
          userData.companies.map(async (company:{metadata: Metadata, sys: Sys, fields: Company}) => {
            const dateUpdatedAt = new Date(company.sys.updatedAt);
            const formattedDate = dateUpdatedAt.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            const services = await fetchServicesByCompany(company.sys.id);

            return {
              id: company.sys.id,
              logo: company.fields.logo,
              name: company.fields.name,
              address: company.fields.address,
              phone: company.fields.phone,
              linkWhatsApp: company.fields.linkWhatsApp,
              nit: company.fields.nit,
              businessName: company.fields.businessName,
              driveLink: company.fields.driveLink,
              superior: company.fields.superior,
              updatedAt: `${formattedDate}`,
              services: services,
            };
          })
        );

        setOriginalData(transformDataForCompany);
        setLoading(false);
      }
    };

    fetchAllCompanyServices();
  }, [userData, fetchServicesByCompany]);

  return { originalData, loading };
};
