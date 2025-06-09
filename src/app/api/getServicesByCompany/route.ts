import { NextRequest } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");

  if (!companyId) {
    return new Response(JSON.stringify({ error: "companyId es requerido" }), {
      status: 400,
    });
  }

  try {
    const environment = await getContentfulEnvironment()
    const response = await environment.getEntries({
      content_type: "service",
      "fields.company.sys.id": companyId,
      limit: 3,
    });

    return new Response(JSON.stringify(response.items), { status: 200 });
  } catch (error) {
    console.error("Error al obtener los servicios de Contentful", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
