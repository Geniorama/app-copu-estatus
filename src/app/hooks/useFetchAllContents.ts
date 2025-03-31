import { useState, useEffect } from "react";
import { getAllContents, getServiceById, getCompanyById } from "@/app/utilities/helpers/fetchers";
import type { Content } from "@/app/types";
import { Entry } from "contentful-management";



export function useFetchAllContents(hasUpdate: boolean, itemsPerPage: number = 3) {
  const [contents, setContents] = useState<Content[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllContents(itemsPerPage, currentPage);
        const contents = res.contents;
        if (contents) {
          const transformedData: Content[] = await Promise.all(
            contents.map(async (content: Entry) => {
              const serviceInfo = await getServiceById(content.fields.service["en-US"].sys.id);
              const companyInfo = await getCompanyById(serviceInfo.fields.company["en-US"].sys.id);

              let scope = 0;
              let impressions = 0;
              let interactions = 0;

              content.fields.socialLinksAndStatistics["en-US"].forEach(
                (social: {
                  statistics: {
                    scope: number;
                    impressions: number;
                    interactions: number;
                  };
                }) => {
                  scope += social.statistics.scope;
                  impressions += social.statistics.impressions;
                  interactions += social.statistics.interactions;
                }
              );

              return {
                id: content.sys.id,
                companyName: companyInfo.fields.name["en-US"] || "Sin compañía",
                serviceName: serviceInfo.fields.name["en-US"] || "Sin servicio",
                headline: content.fields.headline["en-US"] || "",
                publicationDate: content.fields.publicationDate["en-US"] || "",
                socialMediaInfo: content.fields.socialLinksAndStatistics["en-US"] || [],
                scope,
                impressions,
                interactions,
                type: content.fields.type["en-US"] || "Sin tipo",
                companyId: companyInfo.sys.id,
                serviceId: serviceInfo.sys.id,
              };
            })
          );

          setContents(transformedData);
        }

        setTotalPages(res.totalPages);
      } catch (error) {
        console.error("Error fetching contents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hasUpdate, currentPage, itemsPerPage]);

  return { contents, loading, currentPage, totalPages, setCurrentPage };
}
