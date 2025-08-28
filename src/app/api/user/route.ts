import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";
import type { User } from "@/app/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const auth0Id = searchParams.get("auth0Id");

  if (!auth0Id) {
    return NextResponse.json(
      { error: "auth0Id es requerido" },
      { status: 400 }
    );
  }

  try {
    const environment = await getContentfulEnvironment();
    
    const response = await environment.getEntries({
      content_type: "user",
      "fields.auth0Id": auth0Id,
      include: 3,
    });

    if (response.items.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const user = response.items[0].fields;
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el usuario de Contentful", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { auth0Id, ...updatedUserData }: Partial<User> = await request.json();

  if (!auth0Id) {
    return NextResponse.json(
      { error: "auth0Id es requerido" },
      { status: 400 }
    );
  }

  try {
    const environment = await getContentfulEnvironment();

    // Buscar el usuario con el auth0Id proporcionado
    const response = await environment.getEntries({
      content_type: "user",
      "fields.auth0Id": auth0Id,
      include: 3,
    });

    if (response.items.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const entry = response.items[0];

    // Asegurarse de que cada campo esté definido antes de modificarlo, permitiendo valores vacíos o null
    if (updatedUserData.fname !== undefined) {
      entry.fields.firstName = entry.fields.firstName || {};
      entry.fields.firstName["en-US"] = updatedUserData.fname || null;
    }

    if (updatedUserData.lname !== undefined) {
      entry.fields.lastName = entry.fields.lastName || {};
      entry.fields.lastName["en-US"] = updatedUserData.lname || null;
    }

    if (updatedUserData.phone !== undefined) {
      entry.fields.phone = entry.fields.phone || {};
      entry.fields.phone["en-US"] = updatedUserData.phone || null;
    }

    if (updatedUserData.role !== undefined) {
      entry.fields.role = entry.fields.role || {};
      entry.fields.role["en-US"] = updatedUserData.role || null;
    }

    if (updatedUserData.imageProfile !== undefined) {
      entry.fields.imageProfile = entry.fields.imageProfile || {};
      entry.fields.imageProfile["en-US"] = updatedUserData.imageProfile || null;
    }

    if (updatedUserData.position !== undefined) {
      entry.fields.position = entry.fields.position || {};
      entry.fields.position["en-US"] = updatedUserData.position || null;
    }

    if (updatedUserData.linkWhatsApp !== undefined) {
      entry.fields.linkWhatsApp = entry.fields.linkWhatsApp || {};
      entry.fields.linkWhatsApp["en-US"] = updatedUserData.linkWhatsApp || null;
    }

    if (typeof updatedUserData.status === "boolean") {
      entry.fields.status = entry.fields.status || {};
      entry.fields.status["en-US"] = updatedUserData.status;
      console.log("Valor de status actualizado:", entry.fields.status["en-US"]);
    }

    if (updatedUserData.companiesId !== undefined) {
      entry.fields.company = entry.fields.company || {};
      entry.fields.company["en-US"] = updatedUserData.companiesId
        ? updatedUserData.companiesId.map((company) => ({
            sys: {
              type: "Link",
              linkType: "Entry",
              id: company,
            },
          }))
        : null;
    }

    // Actualizar la entrada en Contentful
    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    return NextResponse.json(
      { message: "Usuario actualizado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar el usuario en Contentful", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

