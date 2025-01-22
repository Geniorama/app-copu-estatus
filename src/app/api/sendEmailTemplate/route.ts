import { NextResponse } from "next/server";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export async function POST(req: Request) {
  const API_KEY = process.env.BREVO_API_KEY;

  if (!API_KEY) {
    return NextResponse.json(
      { error: "Clave API no encontrada" },
      { status: 500 }
    );
  }

  try {
    const { to, templateId, dynamicData } = await req.json();

    if (!to || !templateId || !dynamicData) {
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

    if (response.ok) {
      return NextResponse.json(
        { message: "Email enviado correctamente" },
        { status: 200 }
      );
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Error enviando el correo", details: errorData },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error en la solicitud", details: (error as Error).message },
      { status: 500 }
    );
  }
}

