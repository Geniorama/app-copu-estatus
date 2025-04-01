import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";

export async function GET(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const { searchParams } = new URL(request.url);

    // Obtener los IDs de los servicios desde los parámetros de la URL
    const serviceIdsParam = searchParams.get("serviceIds");
    const serviceIds = serviceIdsParam ? serviceIdsParam.split(",") : null;

    // Obtener todas las entradas de tipo "content"
    const entries = await environment.getEntries({
      content_type: "content",
      "sys.publishedAt[exists]": true,
      limit: 1000, // Ajusta según la cantidad de registros
    });

    const items = entries.items;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "No entries found" },
        { status: 404 }
      );
    }

    // Filtrar si se especificaron IDs de servicios
    const filteredItems = serviceIds
      ? items.filter((item) => serviceIds.includes(item.fields.service?.["en-US"]?.sys?.id))
      : items;

    // Agrupar y contar por servicio y tipo
    const countByServiceAndType = filteredItems.reduce((acc, item) => {
      const serviceId = item.fields.service?.["en-US"]?.sys?.id || "unknown";
      const type = item.fields.type?.["en-US"] || "unknown";

      if (!acc[serviceId]) {
        acc[serviceId] = { web: 0, post: 0 };
      }

      if (type === "web" || type === "post") {
        acc[serviceId][type as "web" | "post"] += 1;
      }

      return acc;
    }, {} as Record<string, { web: number; post: number }>);

    // Calcular el total global de "web" y "post" si no se especifican serviceIds
    let totalWeb = 0;
    let totalPost = 0;

    if (!serviceIds) {
      Object.values(countByServiceAndType).forEach((service) => {
        totalWeb += service.web;
        totalPost += service.post;
      });
    }

    return NextResponse.json(
      {
        countByServiceAndType, // Conteo por servicio y tipo
        total: serviceIds ? undefined : { web: totalWeb, post: totalPost }, // Total global si no se especifican serviceIds
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching content count by service and type:", error);
    return NextResponse.json(
      { error: "Error fetching content count by service and type" },
      { status: 500 }
    );
  }
}