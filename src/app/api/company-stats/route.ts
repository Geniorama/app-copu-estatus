import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";

export async function GET(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const { searchParams } = new URL(request.url);
    const companyIds = searchParams.get("companyIds");

    if (!companyIds) {
      return NextResponse.json(
        { error: "companyIds parameter is required" },
        { status: 400 }
      );
    }

    const companyIdsArray = companyIds.split(",");
    const statsByCompany = [];

    for (const companyId of companyIdsArray) {
      try {
        // Obtener la compañía
        const company = await environment.getEntry(companyId);
        const companyName = company.fields.name?.["en-US"] || "Compañía sin nombre";

        // Obtener servicios de la compañía
        const services = await environment.getEntries({
          content_type: "service",
          "fields.company.sys.id": companyId,
          "sys.publishedAt[exists]": true,
        });

        // Obtener contenidos de todos los servicios de la compañía
        const serviceIds = services.items.map(service => service.sys.id);
        let allContents: { fields: { socialLinksAndStatistics?: { [key: string]: unknown } } }[] = [];
        
        if (serviceIds.length > 0) {
          const contents = await environment.getEntries({
            content_type: "content",
            "fields.service.sys.id[in]": serviceIds.join(","),
            "sys.publishedAt[exists]": true,
          });
          allContents = contents.items;
        }

        // Calcular estadísticas
        let totalScope = 0;
        let totalImpressions = 0;
        let totalInteractions = 0;
        const totalContents = allContents.length;

        // Procesar estadísticas de cada contenido
        allContents.forEach((content) => {
          const socialLinksAndStats = content.fields.socialLinksAndStatistics?.["en-US"];
          if (socialLinksAndStats && Array.isArray(socialLinksAndStats)) {
            socialLinksAndStats.forEach((stat) => {
              if (stat.statistics) {
                totalScope += stat.statistics.scope || 0;
                totalImpressions += stat.statistics.impressions || 0;
                totalInteractions += stat.statistics.interactions || 0;
              }
            });
          }
        });

        statsByCompany.push({
          name: companyName,
          alcance: totalScope,
          impresiones: totalImpressions,
          interacciones: totalInteractions,
          contenidos: totalContents,
        });

      } catch (error) {
        console.error(`Error processing company ${companyId}:`, error);
        // Continuar con la siguiente compañía si hay error
        continue;
      }
    }

    if (statsByCompany.length === 0) {
      return NextResponse.json(
        { message: "No data found for the provided companies" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        stats: statsByCompany,
        total: statsByCompany.length,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching company statistics:", error);
    return NextResponse.json(
      { error: "Error fetching company statistics" },
      { status: 500 }
    );
  }
}