import { useState, useEffect, useCallback } from "react";
import { Company, User, CompanyResponse } from "@/app/types";
import { getCompaniesByIds } from "../utilities/helpers/fetchers";
import { Entry } from "contentful-management";

// Datos de relleno para compañías cuando no hay datos reales
const mockCompanies: Company[] = [
  {
    id: "company-1",
    name: "TechCorp Solutions",
    logo: "https://via.placeholder.com/150x50/3B82F6/FFFFFF?text=TechCorp",
    address: "Calle 123 #45-67, Bogotá",
    phone: "+57 300 123 4567",
    linkWhatsApp: "https://wa.me/573001234567",
    nit: "900.123.456-7",
    businessName: "TechCorp Solutions SAS",
    driveLink: "https://drive.google.com/drive/folders/techcorp",
    status: true,
    services: [
      {
        id: "service-1-1",
        name: "Desarrollo Web",
        description: "Sitios web profesionales y aplicaciones web",
        companyId: "company-1",
        plan: "anual",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: true,
        features: []
      },
      {
        id: "service-1-2",
        name: "Marketing Digital",
        description: "Estrategias de marketing en redes sociales",
        companyId: "company-1",
        plan: "mensual",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: true,
        features: []
      }
    ]
  },
  {
    id: "company-2",
    name: "Digital Marketing Pro",
    logo: "https://via.placeholder.com/150x50/10B981/FFFFFF?text=Digital+Pro",
    address: "Avenida 7 #23-45, Medellín",
    phone: "+57 310 987 6543",
    linkWhatsApp: "https://wa.me/573109876543",
    nit: "800.987.654-3",
    businessName: "Digital Marketing Pro Ltda",
    driveLink: "https://drive.google.com/drive/folders/digitalpro",
    status: true,
    services: [
      {
        id: "service-2-1",
        name: "SEO y SEM",
        description: "Optimización para motores de búsqueda",
        companyId: "company-2",
        plan: "semestral",
        startDate: "2024-01-01",
        endDate: "2024-06-30",
        status: true,
        features: []
      }
    ]
  },
  {
    id: "company-3",
    name: "InnovateLab",
    logo: "https://via.placeholder.com/150x50/8B5CF6/FFFFFF?text=InnovateLab",
    address: "Carrera 15 #93-47, Bogotá",
    phone: "+57 315 456 7890",
    linkWhatsApp: "https://wa.me/573154567890",
    nit: "700.456.789-0",
    businessName: "InnovateLab SAS",
    driveLink: "https://drive.google.com/drive/folders/innovatelab",
    status: true,
    services: [
      {
        id: "service-3-1",
        name: "Inteligencia Artificial",
        description: "Soluciones de IA para empresas",
        companyId: "company-3",
        plan: "anual",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: true,
        features: []
      }
    ]
  },
  {
    id: "company-4",
    name: "CloudTech Solutions",
    logo: "https://via.placeholder.com/150x50/F59E0B/FFFFFF?text=CloudTech",
    address: "Calle 72 #10-23, Bogotá",
    phone: "+57 320 789 0123",
    linkWhatsApp: "https://wa.me/573207890123",
    nit: "600.789.012-3",
    businessName: "CloudTech Solutions SAS",
    driveLink: "https://drive.google.com/drive/folders/cloudtech",
    status: true,
    services: [
      {
        id: "service-4-1",
        name: "Migración a la Nube",
        description: "Servicios de migración y gestión en la nube",
        companyId: "company-4",
        plan: "personalizado",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: true,
        features: []
      }
    ]
  },
  {
    id: "company-5",
    name: "DataAnalytics Inc",
    logo: "https://via.placeholder.com/150x50/EF4444/FFFFFF?text=DataAnalytics",
    address: "Carrera 7 #26-20, Bogotá",
    phone: "+57 325 123 4567",
    linkWhatsApp: "https://wa.me/573251234567",
    nit: "500.123.456-7",
    businessName: "DataAnalytics Inc SAS",
    driveLink: "https://drive.google.com/drive/folders/dataanalytics",
    status: true,
    services: [
      {
        id: "service-5-1",
        name: "Big Data Analytics",
        description: "Análisis de datos masivos para empresas",
        companyId: "company-5",
        plan: "anual",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: true,
        features: []
      }
    ]
  },
  {
    id: "company-6",
    name: "MobileFirst Apps",
    logo: "https://via.placeholder.com/150x50/06B6D4/FFFFFF?text=MobileFirst",
    address: "Calle 85 #11-30, Bogotá",
    phone: "+57 330 456 7890",
    linkWhatsApp: "https://wa.me/573304567890",
    nit: "400.456.789-0",
    businessName: "MobileFirst Apps SAS",
    driveLink: "https://drive.google.com/drive/folders/mobilefirst",
    status: true,
    services: [
      {
        id: "service-6-1",
        name: "Desarrollo Móvil",
        description: "Aplicaciones móviles nativas e híbridas",
        companyId: "company-6",
        plan: "mensual",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: true,
        features: []
      }
    ]
  },
  {
    id: "company-7",
    name: "CyberSecurity Pro",
    logo: "https://via.placeholder.com/150x50/84CC16/FFFFFF?text=CyberSec",
    address: "Avenida 68 #80-77, Bogotá",
    phone: "+57 335 789 0123",
    linkWhatsApp: "https://wa.me/573357890123",
    nit: "300.789.012-3",
    businessName: "CyberSecurity Pro SAS",
    driveLink: "https://drive.google.com/drive/folders/cybersecurity",
    status: true,
    services: [
      {
        id: "service-7-1",
        name: "Ciberseguridad",
        description: "Protección y seguridad informática",
        companyId: "company-7",
        plan: "anual",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: true,
        features: []
      }
    ]
  },
  {
    id: "company-8",
    name: "GreenTech Solutions",
    logo: "https://via.placeholder.com/150x50/22C55E/FFFFFF?text=GreenTech",
    address: "Carrera 11 #93-94, Bogotá",
    phone: "+57 340 123 4567",
    linkWhatsApp: "https://wa.me/573401234567",
    nit: "200.123.456-7",
    businessName: "GreenTech Solutions SAS",
    driveLink: "https://drive.google.com/drive/folders/greentech",
    status: true,
    services: [
      {
        id: "service-8-1",
        name: "Tecnología Verde",
        description: "Soluciones tecnológicas sostenibles",
        companyId: "company-8",
        plan: "semestral",
        startDate: "2024-01-01",
        endDate: "2024-06-30",
        status: true,
        features: []
      }
    ]
  }
];

export const useFetchCompanies = (
  userData: User | undefined,
  fetchServicesByCompany: (companyId: string) => Promise<Entry[]>,
  fetchAll: boolean = false,
  itemsPerPage: number = 6,
) => {
  const [originalData, setOriginalData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllCompanyServices = useCallback(async (page = 1) => {
    let companies;
    
    try {
      setLoading(true);
      setCurrentPage(page);

      if (fetchAll) {
        const response = await fetch(`/api/companies?page=${page}&limit=${itemsPerPage}`);
        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }
        const data = await response.json();

        if (data.companies.length > 0) {
          companies = data.companies.map((company: CompanyResponse) => ({
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

          setTotalPages(data.totalPages);
        }
      } else if (userData && userData.companiesId) {
        const data = await getCompaniesByIds(userData.companiesId as string[], page, itemsPerPage);
        const companiesMap = data?.companies;
        
        // Debug: Verificar el campo superior en las compañías
        console.log('Companies from API:', companiesMap?.map(c => ({
          id: c.sys.id,
          name: c.fields.name?.["en-US"],
          superior: c.fields.superior?.["en-US"]
        })));
        
        const companiesUpdated = companiesMap.map((company: Entry) => ({
          ...company,
          fields: {
            ...company.fields,
            linkWhatsApp: company.fields.whatsappLink,
            status: company.fields.status?.["en-US"] ?? true,
            // Preservar el campo superior original sin procesar
            superior: company.fields.superior,
            superiorId: company.fields.superior?.["en-US"]?.sys?.id || null,
          }
        }))

        // Debug: Verificar el campo superior después del mapeo
        console.log('Companies after mapping:', companiesUpdated?.map(c => ({
          id: c.sys.id,
          name: c.fields.name?.["en-US"],
          superior: c.fields.superior,
          superiorId: c.fields.superiorId
        })));

        companies = companiesUpdated;

        setTotalPages(data?.totalPages || 1);
      }

      if (companies) {
        const transformDataForCompany = await Promise.all(
          companies.map(async (company: Entry) => {
            const dateUpdatedAt = new Date(company.sys.updatedAt);
            const formattedDate = dateUpdatedAt.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            const services = await fetchServicesByCompany(company.sys.id);

            const transformedCompany = {
              id: company.sys.id,
              logo: company.fields.logo || "",
              name: company.fields.name,
              address: company.fields.address,
              phone: company.fields.phone,
              linkWhatsApp: company.fields.linkWhatsApp,
              nit: company.fields.nit,
              businessName: company.fields.businessName,
              driveLink: company.fields.driveLink,
              superior: company.fields.superior,
              superiorId: company.fields.superiorId,
              updatedAt: `${formattedDate}`,
              services: services.map((service) => ({
                id: service.sys.id,
                name: service.fields.name["en-US"],
                description: service.fields.description["en-US"],
                company: service.fields.company["en-US"],
                plan: service.fields.plan["en-US"],
                startDate: service.fields.startDate["en-US"],
                endDate: service.fields.endDate["en-US"],
                status: service.fields.status["en-US"],
              })),
              status: company.fields.status,
            };

            // Debug: Verificar el campo superior en la transformación
            console.log('Transformed Company:', {
              id: transformedCompany.id,
              name: transformedCompany.name,
              superior: transformedCompany.superior,
              superiorId: transformedCompany.superiorId
            });

            return transformedCompany;
          })
        );

        setOriginalData(transformDataForCompany);
      } else {
        // Si no hay datos reales, usar datos de relleno
        setOriginalData(mockCompanies);
        setTotalPages(Math.ceil(mockCompanies.length / itemsPerPage));
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching companies:", err);
        setError(err.message);
      } else {
        console.error("Unknown error fetching companies:", err);
        setError("An unknown error occurred.");
      }
      // En caso de error, usar datos de relleno
      setOriginalData(mockCompanies);
      setTotalPages(Math.ceil(mockCompanies.length / itemsPerPage));
    } finally {
      setLoading(false);
    }
  }, [userData, fetchServicesByCompany, fetchAll, itemsPerPage]);

  useEffect(() => {
    fetchAllCompanyServices(currentPage);

    return () => {
      setOriginalData([]);
      setLoading(true);
      setError(null);
    };
  }, [fetchAllCompanyServices, currentPage]);

  return {
    originalData,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchAllCompanyServices
  };
};
