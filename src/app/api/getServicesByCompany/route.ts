import { NextRequest } from "next/server";
import contentfulClient from "@/app/lib/contentful";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");

  if (!companyId) {
    return new Response(JSON.stringify({ error: "companyId es requerido" }), {
      status: 400,
    });
  }

  try {
    const response = await contentfulClient.getEntries({
      content_type: "service",
      "fields.company.sys.id": companyId,
    });

    if (response.items.length === 0) {
      return new Response(JSON.stringify({ error: "No se encontraron servicios" }), {
        status: 404,
      });
    }

    const services = response.items.map((item) => item.fields);
    return new Response(JSON.stringify(services), { status: 200 });
  } catch (error) {
    console.error("Error al obtener los servicios de Contentful", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
