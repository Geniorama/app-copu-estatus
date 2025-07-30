import { NextResponse } from "next/server";

// Tipado del request body
interface ResetPasswordRequest {
  email: string;
}

// Función para obtener el token de la API de Management
async function getManagementToken(): Promise<string> {
  // Verificar que las variables de entorno estén configuradas
  if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_CLIENT_SECRET) {
    console.error("Variables de entorno de Auth0 no configuradas:", {
      domain: !!process.env.AUTH0_DOMAIN,
      clientId: !!process.env.AUTH0_CLIENT_ID,
      clientSecret: !!process.env.AUTH0_CLIENT_SECRET
    });
    throw new Error("Configuración de Auth0 incompleta");
  }

  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error al obtener el token de la API de Management:", errorData);
    throw new Error(`Error al obtener el token de la API de Management: ${errorData.error || errorData.message || 'Error desconocido'}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Función para obtener el user_id a partir del email
async function getUserIdByEmail(token: string, email: string): Promise<string> {
  if (!process.env.AUTH0_DOMAIN) {
    throw new Error("AUTH0_DOMAIN no configurado");
  }

  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users-by-email?email=${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error al obtener el user_id:", errorData);
    throw new Error(`Error al obtener el user_id: ${errorData.error || errorData.message || 'Error desconocido'}`);
  }

  const data = await response.json();
  if (data.length === 0) {
    throw new Error("Usuario no encontrado.");
  }

  return data[0].user_id;
}

// Ruta para manejar el restablecimiento de contraseña
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: ResetPasswordRequest = await req.json();

    if (!body.email) {
      return NextResponse.json({ error: "El email es obligatorio." }, { status: 400 });
    }

    console.log('Iniciando proceso de reset password para:', body.email);

    // Verificar configuración de Auth0 antes de proceder
    const auth0Config = {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET
    };

    console.log('Configuración de Auth0:', {
      domain: !!auth0Config.domain,
      clientId: !!auth0Config.clientId,
      clientSecret: !!auth0Config.clientSecret
    });

    if (!auth0Config.domain || !auth0Config.clientId || !auth0Config.clientSecret) {
      return NextResponse.json(
        { 
          error: "Configuración de Auth0 incompleta. Verifique las variables de entorno: AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET" 
        }, 
        { status: 500 }
      );
    }

    const token = await getManagementToken();
    console.log('Token obtenido correctamente');

    const userId = await getUserIdByEmail(token, body.email);
    console.log('User ID obtenido:', userId);

    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/tickets/password-change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        client_id: process.env.AUTH0_CLIENT_ID,
        mark_email_as_verified: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al generar el enlace de restablecimiento:", errorData);
      throw new Error(errorData.message || errorData.error || "Error al generar el enlace de restablecimiento.");
    }

    const data = await response.json();
    console.log('Ticket generado correctamente:', data);
    return NextResponse.json({ url: data.ticket }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error al procesar la solicitud:", error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `No se pudo procesar la solicitud: ${errorMessage}` },
      { status: 500 }
    );
  }
}