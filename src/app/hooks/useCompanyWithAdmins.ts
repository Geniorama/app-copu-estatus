import { useState, useEffect } from "react";
import { getUsersByCompanyId } from "@/app/utilities/helpers/fetchers";
import { CompanyWithUser, User } from "@/app/types";
import { Entry } from "contentful-management";

// Hook personalizado para obtener la compañía y los usuarios administradores
export const useCompanyWithAdmins = (companies: CompanyWithUser[]) => {
  const [updatedCompanies, setUpdatedCompanies] = useState<CompanyWithUser[] | null>(null);
  const [subUpdatedData, setSubUpdatedData] = useState<CompanyWithUser[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getRoleUser = async (user: Entry): Promise<string | null> => {
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
        return data.auth0User.role;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  const fetchUserByCompany = async (companyId: string) => {
    const res = await getUsersByCompanyId(companyId);
    return res;
  };

  useEffect(() => {
    const fetchAndUpdateCompanies = async () => {
      if (companies && companies.length > 0) {
        setLoading(true);
        try {
          const updatedData: CompanyWithUser[] = await Promise.all(
            companies.map(async (company) => {
              const users = company.id ? await fetchUserByCompany(company.id) : [];

              const adminUsers = [];
              for (const user of users) {
                const role = await getRoleUser(user);
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

          const companiesSuperior = updatedData.filter((company) => !company.superior);
          const companiesInferior = updatedData.filter((company) => company.superior);

          setUpdatedCompanies(companiesSuperior);
          setSubUpdatedData(companiesInferior);
        } catch (error) {
          console.error("Error al actualizar los datos de las compañías", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchAndUpdateCompanies();
  }, [companies]);

  return { updatedCompanies, subUpdatedData, loading };
};
