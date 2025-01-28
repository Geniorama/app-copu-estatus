import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";

export async function PATCH(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const { id, status }: { id: string; status: boolean } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "serviceId es requerido para la actualización" },
        { status: 400 }
      );
    }

    // Obtener la entrada del servicio existente usando serviceId
    const entry = await environment.getEntry(id);

    if (!entry) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar solo el campo status
    entry.fields.status = entry.fields.status || {};
    entry.fields.status["en-US"] = status;

    // Guardar y publicar la entrada actualizada
    const updatedEntry = await entry.update();
    const publishedEntry = await updatedEntry.publish();

    return NextResponse.json(publishedEntry, { status: 200 });
  } catch (error) {
    console.error("Error updating entry in Contentful:", error);
    return NextResponse.json(
      { error: `Error updating entry in Contentful: ${error}` },
      { status: 500 }
    );
  }
}