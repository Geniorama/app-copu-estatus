import { useState, useEffect } from "react";
import { CompanyResponse } from "@/app/types";
import { getAllCompanies } from "../utilities/helpers/fetchers";
import { OptionSelect } from "@/app/types";

export const useCompaniesOptions = () => {
  const [companiesOptions, setCompaniesOptions] = useState<OptionSelect[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getStoredCompanies = async () => {
      setLoading(true);
      const storedCompanies = localStorage.getItem("companiesOptions");

      if (storedCompanies) {
        setCompaniesOptions(JSON.parse(storedCompanies));
      } else {
        const companies = await getAllCompanies();
        if (companies) {
          const options = companies
            .map((company: CompanyResponse) => ({
              value: company.sys.id,
              name: company.fields.name["en-US"],
            }))
            .sort((a:OptionSelect, b:OptionSelect) => a.name.localeCompare(b.name));

          setCompaniesOptions(options);
          localStorage.setItem("companiesOptions", JSON.stringify(options));
        }
      }
      setLoading(false);
    };

    getStoredCompanies();
  }, []);

  return { companiesOptions, loading };
};
