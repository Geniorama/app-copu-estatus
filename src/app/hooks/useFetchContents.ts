import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Content } from '@/app/types';
import { getContentsByServiceId, getServicesByCompanyId, getCompanyById } from '@/app/utilities/helpers/fetchers';
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

        if (userData && userData.companies) {
          const allContents: Content[] = [];

          for (const company of userData.companies) {
            const services: Entry[] = await getServicesByCompanyId(company.sys.id);
            const companyData = await getCompanyById(company.sys.id);

            for (const service of services) {
              const serviceContents: Entry[] = await getContentsByServiceId(service.sys.id);
              if (serviceContents?.length > 0) {
                for (const content of serviceContents) {
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

                  allContents.push({
                    id: content.sys.id,
                    companyName: companyData.fields.name["en-US"],
                    companyId: companyData.sys.id,
                    type: content.fields.type["en-US"],
                    headline: content.fields.headline["en-US"],
                    publicationDate: content.fields.publicationDate["en-US"],
                    scope,
                    impressions,
                    interactions,
                    socialMediaInfo: content.fields.socialLinksAndStatistics["en-US"]
                  });
                }
              }
            }
          }

          setContents(allContents);
        }
      } catch (err) {
        setError('Error fetching contents');
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [userData]);

  return { contents, loading, error };
};

export default useFetchContents;