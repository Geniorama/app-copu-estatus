import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";
import type { Company } from "@/app/types";

// Obtener todas las empresas
export async function GET() {
  try {
    const environment = await getContentfulEnvironment();

    const entries = await environment.getEntries({
      content_type: 'company',
      limit: 5
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

// Crear una nueva empresa
export async function POST(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const company:Company = await request.json();

    const newEntry = await environment.createEntry('company', {
      fields: {
        name: {
          'en-US': company.name
        },
        address: {
          'en-US': company.address 
        },
        phone: {
          'en-US': company.phone
        },
        whatsappLink: {
          'en-US': company.whatsAppLink || undefined
        },
        nit: {
          'en-US': company.nit || undefined
        },
        businessName: {
          'en-US': company.businessName || undefined
        },
        driveLink:{
          'en-US': company.driveLink || undefined
        }
      }
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating entry in Contentful:', error);
    return NextResponse.json({ error: 'Error creating entry in Contentful' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const { id, fields } = await request.json();

    const entry = await environment.getEntry(id);

    // Actualiza los campos que vienen en la solicitud
    for (const key in fields) {
      entry.fields[key] = { 'en-US': fields[key] };
    }

    const updatedEntry = await entry.update();

    return NextResponse.json(updatedEntry, { status: 200 });
  } catch (error) {
    console.error('Error updating entry in Contentful:', error);
    return NextResponse.json({ error: 'Error updating entry in Contentful' }, { status: 500 });
  }
}

// Eliminar una empresa
export async function DELETE(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const { id } = await request.json();

    await environment.deleteEntry(id);

    return NextResponse.json({ message: 'Entry deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting entry in Contentful:', error);
    return NextResponse.json({ error: 'Error deleting entry in Contentful' }, { status: 500 });
  }
}
