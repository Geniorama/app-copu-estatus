import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Content } from '@/app/types';
import { getContentsByServiceId, getServicesByCompanyId, getCompaniesByIds } from '@/app/utilities/helpers/fetchers';
import { Entry } from 'contentful-management';

const useFetchContents = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener datos del usuario desde localStorage como fallback
        let companiesIds: string[] = [];
        
        if (userData?.companiesId) {
          companiesIds = userData.companiesId;
        } else {
          const localStorageData = localStorage.getItem("userData");
          if (localStorageData) {
            const parsedData = JSON.parse(localStorageData);
            companiesIds = parsedData.companiesId || [];
          }
        }

        if (!companiesIds || companiesIds.length === 0) {
          setContents([]);
          setLoading(false);
          return;
        }

        // Obtener todas las compañías de una vez
        const companiesResponse = await getCompaniesByIds(companiesIds);
        if (!companiesResponse || !companiesResponse.companies) {
          setContents([]);
          setLoading(false);
          return;
        }

        const allContents: Content[] = [];

        // Procesar cada compañía
        for (const company of companiesResponse.companies) {
          try {
            const companyId = company.sys.id;
            const companyName = company.fields.name || "Compañía sin nombre";
            
            // Obtener servicios de la compañía
            const services: Entry[] = await getServicesByCompanyId(companyId);

            // Procesar cada servicio
            for (const service of services) {
              try {
                const serviceContents: Entry[] = await getContentsByServiceId(service.sys.id);
                
                if (serviceContents?.length > 0) {
                  // Procesar cada contenido
                  for (const content of serviceContents) {
                    try {
                      let scope = 0;
                      let impressions = 0;
                      let interactions = 0;
                      let socialMediaInfo = [];

                      // Procesar estadísticas de redes sociales
                      if (content.fields.socialLinksAndStatistics?.["en-US"]) {
                        socialMediaInfo = content.fields.socialLinksAndStatistics["en-US"];
                        
                        content.fields.socialLinksAndStatistics["en-US"].forEach(
                          (social: {
                            statistics: {
                              scope: number;
                              impressions: number;
                              interactions: number;
                            };
                          }) => {
                            if (social.statistics) {
                              scope += social.statistics.scope || 0;
                              impressions += social.statistics.impressions || 0;
                              interactions += social.statistics.interactions || 0;
                            }
                          }
                        );
                      }

                      allContents.push({
                        id: content.sys.id,
                        companyName: companyName,
                        companyId: companyId,
                        serviceId: service.sys.id,
                        serviceName: service.fields.name?.["en-US"] || "Servicio sin nombre",
                        type: content.fields.type?.["en-US"] || "post",
                        headline: content.fields.headline?.["en-US"] || "Sin título",
                        publicationDate: content.fields.publicationDate?.["en-US"] || "",
                        scope,
                        impressions,
                        interactions,
                        socialMediaInfo
                      });
                    } catch (contentError) {
                      console.error('Error processing content:', contentError);
                    }
                  }
                }
              } catch (serviceError) {
                console.error(`Error fetching contents for service ${service.sys.id}:`, serviceError);
              }
            }
          } catch (companyError) {
            console.error(`Error processing company ${company.sys.id}:`, companyError);
          }
        }

        setContents(allContents);
      } catch (err) {
        console.error('Error fetching contents:', err);
        setError('Error al cargar los contenidos');
        setContents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [userData]);

  return { contents, loading, error };
};

export default useFetchContents;