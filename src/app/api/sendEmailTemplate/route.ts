import { NextResponse } from "next/server";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export async function POST(req: Request) {
  const API_KEY = process.env.BREVO_API_KEY;

  console.log('Iniciando envío de email template');
  console.log('BREVO_API_KEY configurada:', !!API_KEY);

  if (!API_KEY) {
    console.error('BREVO_API_KEY no encontrada en variables de entorno');
    return NextResponse.json(
      { error: "Clave API de Brevo no encontrada. Verifique la variable BREVO_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const { to, templateId, dynamicData } = await req.json();

    console.log('Datos recibidos:', { to, templateId, dynamicData });

    if (!to || !templateId || !dynamicData) {
      console.error('Datos faltantes:', { to: !!to, templateId: !!templateId, dynamicData: !!dynamicData });
      return NextResponse.json(
        { error: "Faltan datos obligatorios: 'to', 'templateId' o 'dynamicData'." },
        { status: 400 }
      );
    }

    // Datos del correo con plantilla
    const emailData = {
      sender: { name: "Copu Estatus", email: "noreply@copu.media" },
      to: [{ email: to }],
      templateId,
      params: dynamicData,
    };

    console.log('Datos del email a enviar:', emailData);

    // Enviar la solicitud a Brevo
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify(emailData),
    });

    console.log('Respuesta de Brevo - Status:', response.status);
    console.log('Respuesta de Brevo - OK:', response.ok);

    if (response.ok) {
      const responseData = await response.json();
      console.log('Email enviado correctamente:', responseData);
      return NextResponse.json(
        { message: "Email enviado correctamente" },
        { status: 200 }
      );
    } else {
      const errorData = await response.json();
      console.error('Error de Brevo:', errorData);
      return NextResponse.json(
        { 
          error: "Error enviando el correo", 
          details: errorData,
          status: response.status 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en sendEmailTemplate:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { 
        error: "Error en la solicitud", 
        details: errorMessage,
        type: 'network_error'
      },
      { status: 500 }
    );
  }
}

