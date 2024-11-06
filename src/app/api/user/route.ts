import { NextRequest } from "next/server";
import contentfulClient from "@/app/lib/contentful";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const auth0Id = searchParams.get("auth0Id");

  if (!auth0Id) {
    return new Response(JSON.stringify({ error: "auth0Id es requerido" }), {
      status: 400,
    });
  }

  try {
    const response = await contentfulClient.getEntries({
      content_type: "user",
      "fields.auth0Id": auth0Id,
      include: 3
    });

    if (response.items.length === 0) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
        status: 404,
      });
    }

    const user = response.items[0].fields;
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error al obtener el usuario de Contentful", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}

