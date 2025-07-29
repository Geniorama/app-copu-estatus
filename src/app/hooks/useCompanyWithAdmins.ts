import { useState, useEffect, useRef } from "react";
import { getUsersByCompanyId } from "@/app/utilities/helpers/fetchers";
import { CompanyWithUser, User } from "@/app/types";
import { Entry } from "contentful-management";

// Hook personalizado para obtener la compañía y los usuarios administradores
export const useCompanyWithAdmins = (companies: CompanyWithUser[]) => {
  const [updatedCompanies, setUpdatedCompanies] = useState<CompanyWithUser[] | null>(null);
  const [subUpdatedData, setSubUpdatedData] = useState<CompanyWithUser[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getRoleUser = async (user: Entry, signal: AbortSignal): Promise<string | null> => {
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
        signal,
      });

      if (response.ok) {
        const data = await response.json();
        return data.auth0User.role;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted');
        return null;
      }
      console.log('Error getting user role:', error);
    }
    return null;
  };

  const fetchUserByCompany = async (companyId: string) => {
    try {
      const res = await getUsersByCompanyId(companyId);
      return res;
    } catch (error) {
      console.log('Error fetching users by company:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAndUpdateCompanies = async () => {
      if (companies && companies.length > 0) {
        // Cancelar requests anteriores
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Crear nuevo AbortController
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setLoading(true);
        setError(null);
        
        try {
          const updatedData: CompanyWithUser[] = await Promise.all(
            companies.map(async (company) => {
              const users = company.id ? await fetchUserByCompany(company.id) : [];

              const adminUsers = [];
              for (const user of users) {
                // Verificar si la request fue cancelada
                if (signal.aborted) {
                  return {
                    ...company,
                    usersAdmin: [],
                  };
                }

                const role = await getRoleUser(user, signal);
                if (role === "admin") {
                  adminUsers.push({
                    ...user,
                    fname: user.fields.firstName["en-US"],
                    lname: user.fields.lastName["en-US"],
                    phone: user.fields.phone["en-US"],
                    status: user.fields.status["en-US"]
                  });
                }
              }

              return {
                ...company,
                usersAdmin: adminUsers,
              };
            })
          );

          // Verificar si la request fue cancelada antes de actualizar el estado
          if (!signal.aborted) {
            const companiesSuperior = updatedData.filter((company) => !company.superior);
            const companiesInferior = updatedData.filter((company) => company.superior);

            setUpdatedCompanies(companiesSuperior);
            setSubUpdatedData(companiesInferior);
          }
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            console.log('Request aborted');
            return;
          }
          console.error("Error al actualizar los datos de las compañías", error);
          setError("Error al cargar los datos de las compañías");
        } finally {
          if (!signal.aborted) {
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
        setUpdatedCompanies(null);
        setSubUpdatedData(null);
      }
    };

    fetchAndUpdateCompanies();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [companies]);

  return { updatedCompanies, subUpdatedData, loading, error };
};
