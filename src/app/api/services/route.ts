import {  NextResponse, NextRequest } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";
import type { Service } from "@/app/types";


export async function GET(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const skip = (page - 1) * limit;

    const entries = await environment.getEntries({
      content_type: 'service',
      include: 4,
      limit,
      skip,
      order: "fields.name"
    });

    const items = entries.items;
    
    console.log('Services API - Total entries:', entries.total);
    console.log('Services API - Items count:', items?.length || 0);
    
    if (!items || items.length === 0) {
      console.log('Services API - No items found, returning empty array');
      return NextResponse.json({ items: [], totalPages: 1 }, { status: 200 });
    }
    
    console.log('Services API - Returning items and totalPages');
    return NextResponse.json({items, totalPages: Math.ceil(entries.total / limit)}, { status: 200 });
  } catch (error) {
    console.error('Error fetching data from Contentful:', error);
    return NextResponse.json({ error: 'Error fetching data from Contentful' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const { name, description, startDate, endDate, plan, status, companyId, features, accionWebYRss, accionPostRss }: Service = await request.json();

    if (!name || !description || !startDate || !endDate || !plan || typeof status !== "boolean" || !companyId || !features || !accionWebYRss || !accionPostRss) {
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
        accionPostRss: { "en-US": Number(accionPostRss) },
        accionWebYRss: { "en-US": Number(accionWebYRss) },
        company: {
          "en-US": {
            sys: {
              type: "Link",
              linkType: "Entry",
              id: companyId,
            },
          },
        },
        features: { "en-US": features }
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
    if(updatedServiceData.accionPostRss){
      entry.fields.accionPostRss["en-US"] = Number(updatedServiceData.accionPostRss);
    }
    if(updatedServiceData.accionWebYRss){
      entry.fields.accionWebYRss["en-US"] = Number(updatedServiceData.accionWebYRss);
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
    if(updatedServiceData.features && updatedServiceData.features.length > 0){
      entry.fields.features["en-US"] = updatedServiceData.features;
    }

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