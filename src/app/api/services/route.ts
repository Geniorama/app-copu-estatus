import {  NextResponse, NextRequest } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";
import type { Service } from "@/app/types";


export async function GET() {
  try {
    const environment = await getContentfulEnvironment();

    const entries = await environment.getEntries({
      content_type: 'service',
      include: 4
    });

    const items = entries.items;
    
    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'No entries found' }, { status: 404 });
    }
    
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Error fetching data from Contentful:', error);
    return NextResponse.json({ error: 'Error fetching data from Contentful' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const { name, description, startDate, endDate, plan, status, companyId }: Service = await request.json();

    if (!name || !description || !startDate || !endDate || !plan || typeof status !== "boolean") {
      return NextResponse.json(
        { error: "Todos los campos son requeridos para crear un servicio" },
        { status: 400 }
      );
    }

    const newEntry = await environment.createEntry("service", {
      fields: {
        name: { "en-US": name },
        description: { "en-US": description },
        startDate: { "en-US": startDate },
        endDate: { "en-US": endDate },
        plan: { "en-US": plan },
        status: { "en-US": status },
        company: {
          "en-US": {
            sys: {
              type: "Link",
              linkType: "Entry",
              id: companyId,
            },
          },
        },
      },
    });

    const publishedEntry = await newEntry.publish();

    return NextResponse.json(publishedEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating entry in Contentful:", error);
    return NextResponse.json(
      { error: "Error creating entry in Contentful" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const { id, ...updatedServiceData }: Partial<Service> = await request.json();

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

    // Actualizar solo los campos que se proporcionaron
    if (updatedServiceData.name) {
      entry.fields.name["en-US"] = updatedServiceData.name;
    }
    if (updatedServiceData.description) {
      entry.fields.description["en-US"] = updatedServiceData.description;
    }
    if (updatedServiceData.startDate) {
      entry.fields.startDate["en-US"] = updatedServiceData.startDate;
    }
    if (updatedServiceData.endDate) {
      entry.fields.endDate["en-US"] = updatedServiceData.endDate;
    }
    if (updatedServiceData.plan) {
      entry.fields.plan["en-US"] = updatedServiceData.plan;
    }
    if (typeof updatedServiceData.status === "boolean") {
      entry.fields.status["en-US"] = updatedServiceData.status;
    }
    if (updatedServiceData.company) {
      entry.fields.company["en-US"] = {
        sys: {
          type: "Link",
          linkType: "Entry",
          id: updatedServiceData.companyId,
        },
      };
    }

    // Guardar y publicar la entrada actualizada
    const updatedEntry = await entry.update();
    const publishedEntry = await updatedEntry.publish();

    return NextResponse.json(publishedEntry, { status: 200 });
  } catch (error) {
    console.error("Error updating entry in Contentful:", error);
    return NextResponse.json(
      { error: "Error updating entry in Contentful" },
      { status: 500 }
    );
  }
}