import { NextRequest, NextResponse } from "next/server";
import contentfulClient from "@/app/lib/contentful";

export async function POST(request: NextRequest) {
  try {
    // Leer el cuerpo de la solicitud para obtener los IDs de las compañías
    const { ids , page = 1, limit = 6 }: { ids: string[]; page?: number; limit?: number } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Se requiere un array 'ids' con al menos un ID" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Obtener las entradas de Contentful con los IDs especificados
    const response = await contentfulClient.getEntries({
      content_type: "company", // Asegúrate de que este sea el nombre correcto del tipo de contenido
      "sys.id[in]": ids,
      limit,
      skip
    });

    // Mapear y extraer solo los campos necesarios
    const companies = response.items

    return NextResponse.json({
      companies,
      total: response.total,
      totalPages: Math.ceil(response.total / limit),
      currentPage: page
    }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las compañías de Contentful:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
