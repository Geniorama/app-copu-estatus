import { useState, useEffect } from "react";
import type { OptionSelect, Service } from "../types";
import { getAllServices } from "../utilities/helpers/fetchers";
import type { Entry } from "contentful-management";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchCompaniesOptions } from "../store/features/companiesSlice";

interface FetchServicesProps {
  hasUpdate?: boolean
}

export function useFetchServices({hasUpdate}: FetchServicesProps) {
  const [dataServices, setDataServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch<AppDispatch>()
  const {options} = useSelector((state: RootState) => state.companies)

  useEffect(() => {
    dispatch(fetchCompaniesOptions())
  },[])

  const getCompanyName = (companyId?:string, companies?: OptionSelect[]) => {
    if(companyId && companies){
        const filterCompany = companies.find((company) => company.value === companyId)
        return filterCompany?.name
    }
  }

  useEffect(() => {
    const fetchServices = async () => {
        setLoading(true)
        const res = await getAllServices();
        const transformData = res.map((service: Entry) => ({
          id: service.sys.id,
          name: service.fields.name["en-US"],
          description: service.fields.description["en-US"],
          plan: service.fields.plan["en-US"],
          startDate: service.fields.startDate["en-US"],
          endDate: service.fields.endDate["en-US"],
          status: service.fields.status["en-US"],
          company: service.fields.company["en-US"],
          companyName: getCompanyName(service.fields.company["en-US"].sys.id, options),
          companyId: service.fields.company["en-US"].sys.id
        }));
        console.log(transformData)
        setDataServices(transformData)
        setLoading(false)
      };

    fetchServices()
  },[options, hasUpdate])

  return {dataServices, loading}
}
