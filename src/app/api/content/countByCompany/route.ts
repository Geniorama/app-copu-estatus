import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";

export async function GET(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const { searchParams } = new URL(request.url);

    // Obtener los IDs de las compañías desde los parámetros de la URL
    const companyIdsParam = searchParams.get("companyIds");
    const companyIds = companyIdsParam ? companyIdsParam.split(",") : null;

    if (!companyIds || companyIds.length === 0) {
      return NextResponse.json(
        { message: "Company IDs are required" },
        { status: 400 }
      );
    }

    // Obtener todos los servicios relacionados con las compañías
    const services = await environment.getEntries({
      content_type: "service",
      "fields.company.sys.id[in]": companyIds.join(","),
      limit: 1000, // Ajusta según la cantidad de servicios
    });

    const serviceIds = services.items.map((service) => service.sys.id);

    if (serviceIds.length === 0) {
      return NextResponse.json(
        { message: "No services found for the specified companies" },
        { status: 404 }
      );
    }

    // Obtener todos los contenidos relacionados con los servicios encontrados
    const contents = await environment.getEntries({
      content_type: "content",
      "fields.service.sys.id[in]": serviceIds.join(","),
      "sys.publishedAt[exists]": true,
      limit: 1000, // Ajusta según la cantidad de contenidos
      
    });

    if (!contents.items || contents.items.length === 0) {
      return NextResponse.json(
        { message: "No contents found for the specified companies" },
        { status: 404 }
      );
    }

    // Agrupar y contar por tipo de contenido (web y post)
    const countByType = contents.items.reduce((acc, item) => {
      const type = item.fields.type?.["en-US"] || "unknown";

      if (!acc[type]) {
        acc[type] = 0;
      }

      acc[type] += 1;

      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(
      {
        countByType, // Conteo por tipo de contenido
        contents: contents.items.map((content) => ({
          id: content.sys.id,
          type: content.fields.type?.["en-US"] || "unknown",
          headline: content.fields.headline?.["en-US"] || "No headline",
          publicationDate: content.fields.publicationDate?.["en-US"] || null,
          serviceId: content.fields.service?.["en-US"]?.sys?.id || null,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching contents by company:", error);
    return NextResponse.json(
      { error: "Error fetching contents by company" },
      { status: 500 }
    );
  }
}