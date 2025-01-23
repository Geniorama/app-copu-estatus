import { NextRequest } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

async function deleteUserFromAuth0(auth0Id: string) {
  try {
    // Obtener token de acceso de Auth0
    const tokenResponse = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
        grant_type: "client_credentials",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Error al obtener el token de Auth0");
    }

    const { access_token } = await tokenResponse.json();

    // Borrar usuario en Auth0
    const deleteResponse = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users/${auth0Id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!deleteResponse.ok) {
      throw new Error("Error al borrar el usuario en Auth0");
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar usuario de Auth0:", error);
    return false;
  }
}

async function deleteUserFromContentful(auth0Id: string) {
  try {
    const environment = await getContentfulEnvironment();

    // Buscar usuario en Contentful
    const response = await environment.getEntries({
      content_type: "user",
      "fields.auth0Id": auth0Id,
    });

    if (response.items.length === 0) {
      throw new Error("Usuario no encontrado en Contentful");
    }

    const entry = response.items[0];

    // Borrar usuario en Contentful
    await entry.unpublish();
    await entry.delete();

    return true;
  } catch (error) {
    console.error("Error al eliminar usuario de Contentful:", error);
    return false;
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const auth0Id = searchParams.get("auth0Id");

  if (!auth0Id) {
    return new Response(JSON.stringify({ error: "auth0Id es requerido" }), {
      status: 400,
    });
  }

  // Borrar usuario en ambos sistemas
  const contentfulResult = await deleteUserFromContentful(auth0Id);
  const auth0Result = await deleteUserFromAuth0(auth0Id);

  if (contentfulResult && auth0Result) {
    return new Response(
      JSON.stringify({ message: "Usuario eliminado exitosamente" }),
      { status: 200 }
    );
  } else {
    return new Response(
      JSON.stringify({ error: "Error al eliminar el usuario en uno o ambos sistemas" }),
      { status: 500 }
    );
  }
}
