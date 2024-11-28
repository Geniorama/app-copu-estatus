import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  const environment = getContentfulEnvironment();

  if (!companyId) {
    return new Response(JSON.stringify({ error: "companyId es requerido" }), {
      status: 400,
    });
  }

  try {
    const response = await (await environment).getEntries({
      content_type: "user",
      "fields.company.sys.id": companyId,
      include: 3,
    });

    if (response.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "No se encontraron usuarios para esta compañía" }),
        { status: 404 }
      );
    }
    return NextResponse.json(response.items, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los usuarios de Contentful", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
