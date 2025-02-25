import { useState, useEffect, useCallback } from "react";
import {
  Company,
  User,
  CompanyResponse,
} from "@/app/types";
import { getCompaniesByIds } from "../utilities/helpers/fetchers";
import { Entry } from "contentful-management";

export const useFetchCompanies = (
  userData: User | undefined,
  fetchServicesByCompany: (companyId: string) => Promise<Entry[]>,
  fetchAll: boolean = false
) => {
  const [originalData, setOriginalData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // Función que ejecuta el proceso de obtención de empresas
  const fetchAllCompanyServices = useCallback(async () => {
    let companies;

    try {
      setLoading(true); // Asegurarse de que se marca como "cargando" antes de comenzar

      if (fetchAll) {
        const response = await fetch("/api/companies");
        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }
        const data = await response.json();

        if (data) {
          companies = data.map((company: CompanyResponse) => ({
            ...company,
            fields: {
              name: company.fields.name["en-US"],
              logo: company.fields.logo?.["en-US"],
              address: company.fields.address["en-US"],
              phone: company.fields.phone["en-US"],
              linkWhatsApp: company.fields.whatsappLink?.["en-US"],
              nit: company.fields.nit?.["en-US"],
              businessName: company.fields.businessName?.["en-US"],
              driveLink: company.fields.driveLink?.["en-US"],
              superior: company.fields.superior?.["en-US"],
              status: company.fields.status?.["en-US"],
              superiorId: company.fields.superior?.["en-US"]?.sys?.id || null
            },
          }));
        }
      } else if (userData && userData.companiesId) {
        const data = await getCompaniesByIds(userData.companiesId as string[]);
        companies = data;
      }

      if (companies) {
        const transformDataForCompany = await Promise.all(
          companies.map(
            async (company: Entry) => {
              const dateUpdatedAt = new Date(company.sys.updatedAt);
              const formattedDate = dateUpdatedAt.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              const services = await fetchServicesByCompany(company.sys.id);

              return {
                id: company.sys.id,
                logo: company.fields.logo || "",
                name: company.fields.name,
                address: company.fields.address,
                phone: company.fields.phone,
                linkWhatsApp: company.fields.whatsappLink,
                nit: company.fields.nit,
                businessName: company.fields.businessName,
                driveLink: company.fields.driveLink,
                superior: company.fields.superior,
                superiorId: company.fields.superior?.sys.id || null,
                updatedAt: `${formattedDate}`,
                services: services.map((service) => ({
                  id: service.sys.id,
                  name: service.fields.name['en-US'],
                  description: service.fields.description['en-US'],
                  company: service.fields.company['en-US'],
                  plan: service.fields.plan['en-US'],
                  startDate: service.fields.startDate['en-US'],
                  endDate: service.fields.endDate['en-US'],
                  status: service.fields.status['en-US']
                })),
                status: company.fields.status
              };
            }
          )
        );

        setOriginalData(transformDataForCompany);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching companies:", err);
        setError(err.message);
      } else {
        console.error("Unknown error fetching companies:", err);
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false); // Solo se desactiva cuando el proceso de obtención termina
    }
  }, [userData, fetchServicesByCompany, fetchAll]);

  // Ejecutar la función de obtención de empresas solo cuando sea necesario
  useEffect(() => {
    fetchAllCompanyServices();

    return () => {
      setOriginalData([]);
      setLoading(true);
      setError(null);
    };
  }, [fetchAllCompanyServices]); // Dependencia de la función optimizada

  return { originalData, loading, error };
};
