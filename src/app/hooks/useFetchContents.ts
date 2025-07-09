import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { Content } from '@/app/types';
import { getContentsByServiceId, getServicesByCompanyId, getCompanyById } from '@/app/utilities/helpers/fetchers';
import { Entry } from 'contentful-management';

// Datos de relleno para mostrar cuando no hay datos reales
const mockContents: Content[] = [
  {
    id: "1",
    companyName: "TechCorp Solutions",
    companyId: "company-1",
    serviceId: "service-1-1",
    serviceName: "COP-1001-2024",
    type: "post",
    headline: "Nuevas tendencias en desarrollo web para 2024",
    publicationDate: "2024-01-15",
    scope: 15000,
    impressions: 25000,
    interactions: 1200,
    socialMediaInfo: [
      {
        id: "instagram",
        title: "Instagram",
        link: "https://instagram.com/techcorp/post1",
        statistics: { scope: 8000, impressions: 12000, interactions: 600 }
      },
      {
        id: "facebook",
        title: "Facebook",
        link: "https://facebook.com/techcorp/post1",
        statistics: { scope: 4000, impressions: 8000, interactions: 300 }
      },
      {
        id: "linkedin",
        title: "LinkedIn",
        link: "https://linkedin.com/company/techcorp/post1",
        statistics: { scope: 3000, impressions: 5000, interactions: 300 }
      }
    ]
  },
  {
    id: "2",
    companyName: "Digital Marketing Pro",
    companyId: "company-2",
    serviceId: "service-2-1",
    serviceName: "COP-1002-2024",
    type: "web",
    headline: "Estrategias efectivas de SEO para pequeñas empresas",
    publicationDate: "2024-01-14",
    scope: 22000,
    impressions: 35000,
    interactions: 1800,
    socialMediaInfo: [
      {
        id: "webcopu",
        title: "Web",
        link: "https://digitalmarketingpro.com/blog/seo-estrategias",
        statistics: { scope: 15000, impressions: 25000, interactions: 1200 }
      },
      {
        id: "linkedin",
        title: "LinkedIn",
        link: "https://linkedin.com/company/digitalmarketingpro/post1",
        statistics: { scope: 7000, impressions: 10000, interactions: 600 }
      }
    ]
  },
  {
    id: "3",
    companyName: "InnovateLab",
    companyId: "company-3",
    serviceId: "service-3-1",
    serviceName: "COP-1003-2024",
    type: "post",
    headline: "Inteligencia Artificial en el sector financiero",
    publicationDate: "2024-01-13",
    scope: 18000,
    impressions: 28000,
    interactions: 1500,
    socialMediaInfo: [
      {
        id: "instagram",
        title: "Instagram",
        link: "https://instagram.com/innovatelab/post1",
        statistics: { scope: 10000, impressions: 15000, interactions: 800 }
      },
      {
        id: "facebook",
        title: "Facebook",
        link: "https://facebook.com/innovatelab/post1",
        statistics: { scope: 5000, impressions: 8000, interactions: 400 }
      },
      {
        id: "xtwitter",
        title: "X (Twitter)",
        link: "https://twitter.com/innovatelab/post1",
        statistics: { scope: 3000, impressions: 5000, interactions: 300 }
      }
    ]
  },
  {
    id: "4",
    companyName: "CloudTech Solutions",
    companyId: "company-4",
    serviceId: "service-4-1",
    serviceName: "COP-1004-2024",
    type: "web",
    headline: "Migración a la nube: Guía completa para empresas",
    publicationDate: "2024-01-12",
    scope: 25000,
    impressions: 40000,
    interactions: 2200,
    socialMediaInfo: [
      {
        id: "webcopu",
        title: "Web",
        link: "https://cloudtechsolutions.com/blog/migracion-nube",
        statistics: { scope: 18000, impressions: 30000, interactions: 1600 }
      },
      {
        id: "linkedin",
        title: "LinkedIn",
        link: "https://linkedin.com/company/cloudtech/post1",
        statistics: { scope: 7000, impressions: 10000, interactions: 600 }
      }
    ]
  },
  {
    id: "5",
    companyName: "DataAnalytics Inc",
    companyId: "company-5",
    serviceId: "service-5-1",
    serviceName: "COP-1005-2024",
    type: "post",
    headline: "Big Data y análisis predictivo en retail",
    publicationDate: "2024-01-11",
    scope: 12000,
    impressions: 20000,
    interactions: 900,
    socialMediaInfo: [
      {
        id: "instagram",
        title: "Instagram",
        link: "https://instagram.com/dataanalytics/post1",
        statistics: { scope: 6000, impressions: 10000, interactions: 500 }
      },
      {
        id: "facebook",
        title: "Facebook",
        link: "https://facebook.com/dataanalytics/post1",
        statistics: { scope: 4000, impressions: 6000, interactions: 300 }
      },
      {
        id: "youtube",
        title: "YouTube",
        link: "https://youtube.com/dataanalytics/video1",
        statistics: { scope: 2000, impressions: 4000, interactions: 100 }
      }
    ]
  },
  {
    id: "6",
    companyName: "MobileFirst Apps",
    companyId: "company-6",
    serviceId: "service-6-1",
    serviceName: "COP-1006-2024",
    type: "post",
    headline: "Desarrollo de apps móviles nativas vs híbridas",
    publicationDate: "2024-01-10",
    scope: 16000,
    impressions: 25000,
    interactions: 1300,
    socialMediaInfo: [
      {
        id: "instagram",
        title: "Instagram",
        link: "https://instagram.com/mobilefirst/post1",
        statistics: { scope: 9000, impressions: 14000, interactions: 700 }
      },
      {
        id: "facebook",
        title: "Facebook",
        link: "https://facebook.com/mobilefirst/post1",
        statistics: { scope: 5000, impressions: 8000, interactions: 400 }
      },
      {
        id: "tiktok",
        title: "TikTok",
        link: "https://tiktok.com/@mobilefirst/video1",
        statistics: { scope: 2000, impressions: 3000, interactions: 200 }
      }
    ]
  },
  {
    id: "7",
    companyName: "CyberSecurity Pro",
    companyId: "company-7",
    serviceId: "service-7-1",
    serviceName: "COP-1007-2024",
    type: "web",
    headline: "Ciberseguridad en la era del trabajo remoto",
    publicationDate: "2024-01-09",
    scope: 30000,
    impressions: 45000,
    interactions: 2500,
    socialMediaInfo: [
      {
        id: "webcopu",
        title: "Web",
        link: "https://cybersecuritypro.com/blog/trabajo-remoto",
        statistics: { scope: 20000, impressions: 30000, interactions: 1800 }
      },
      {
        id: "linkedin",
        title: "LinkedIn",
        link: "https://linkedin.com/company/cybersecuritypro/post1",
        statistics: { scope: 10000, impressions: 15000, interactions: 700 }
      }
    ]
  },
  {
    id: "8",
    companyName: "GreenTech Solutions",
    companyId: "company-8",
    serviceId: "service-8-1",
    serviceName: "COP-1008-2024",
    type: "post",
    headline: "Tecnología sostenible para un futuro verde",
    publicationDate: "2024-01-08",
    scope: 14000,
    impressions: 22000,
    interactions: 1100,
    socialMediaInfo: [
      {
        id: "instagram",
        title: "Instagram",
        link: "https://instagram.com/greentech/post1",
        statistics: { scope: 8000, impressions: 12000, interactions: 600 }
      },
      {
        id: "facebook",
        title: "Facebook",
        link: "https://facebook.com/greentech/post1",
        statistics: { scope: 4000, impressions: 7000, interactions: 300 }
      },
      {
        id: "threads",
        title: "Threads",
        link: "https://threads.net/@greentech/post1",
        statistics: { scope: 2000, impressions: 3000, interactions: 200 }
      }
    ]
  }
];

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

          // Si no hay datos reales, usar datos de relleno
          if (allContents.length === 0) {
            setContents(mockContents);
          } else {
            setContents(allContents);
          }
        } else {
          // Si no hay userData, usar datos de relleno
          setContents(mockContents);
        }
      } catch (err) {
        console.error('Error fetching contents:', err);
        setError('Error fetching contents');
        // En caso de error, también usar datos de relleno
        setContents(mockContents);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [userData]);

  return { contents, loading, error };
};

export default useFetchContents;