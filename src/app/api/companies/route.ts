import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";
import type { Company } from "@/app/types";

export async function GET() {
  try {
    const environment = await getContentfulEnvironment();

    const entries = await environment.getEntries({
      content_type: "company",
    });

    const items = entries.items;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "No entries found" },
        { status: 404 }
      );
    }

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching data from Contentful:", error);
    return NextResponse.json(
      { error: "Error fetching data from Contentful" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const company: Company = await request.json();

    const newEntry = await environment.createEntry("company", {
      fields: {
        name: {
          "en-US": company.name,
        },
        logo: {
          "en-US": company.logo || undefined,
        },
        address: {
          "en-US": company.address,
        },
        phone: {
          "en-US": company.phone,
        },
        whatsappLink: {
          "en-US": company.linkWhatsApp || undefined,
        },
        nit: {
          "en-US": company.nit || undefined,
        },
        businessName: {
          "en-US": company.businessName || undefined,
        },
        driveLink: {
          "en-US": company.driveLink || undefined,
        },
      },
    });

    newEntry.publish();

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating entry in Contentful:", error);
    return NextResponse.json(
      { error: "Error creating entry in Contentful" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const updateCompany = await request.json();
    const {
      id,
      name,
      businessName,
      linkWhatsApp,
      logo,
      status,
      email,
      phone,
      address,
      nit,
      superior
    } = updateCompany;

    if (!id) {
      throw new Error("Company id is required!");
    }

    const entry = await environment.getEntry(id);

    // Actualiza los campos que vienen en la solicitud
    if (name) {
      entry.fields.name = entry.fields.name || {};
      entry.fields.name["en-US"] = name;
    }
    if (businessName) {
      entry.fields.businessName = entry.fields.businessName || {};
      entry.fields.businessName["en-US"] = businessName;
    }
    if (linkWhatsApp) {
      entry.fields.whatsappLink = entry.fields.whatsappLink || {};
      entry.fields.whatsappLink["en-US"] = linkWhatsApp;
    }
    if (logo) {
      entry.fields.logo = entry.fields.logo || {};
      entry.fields.logo["en-US"] = logo;
    }

    if (typeof status === "boolean") {
      entry.fields.status = entry.fields.status || {};
      entry.fields.status["en-US"] = status;
    }
    
    if (email) {
      entry.fields.email = entry.fields.email || {};
      entry.fields.email["en-US"] = email;
    }

    if (phone) {
      entry.fields.phone = entry.fields.phone || {};
      entry.fields.phone["en-US"] = phone;
    }
    if (address) {
      entry.fields.address = entry.fields.address || {};
      entry.fields.address["en-US"] = address;
    }
    if (nit) {
      entry.fields.nit = entry.fields.nit || {};
      entry.fields.nit["en-US"] = nit;
    }
    if (superior) {
      entry.fields.superior = entry.fields.superior || {};
      entry.fields.superior["en-US"] = superior;
    }

    // Guardar la entrada actualizada y publicarla
    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    return NextResponse.json(updatedEntry, { status: 200 });
  } catch (error) {
    console.error("Error updating entry in Contentful:", error);
    return NextResponse.json(
      { error: "Error updating entry in Contentful" },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const { id } = await request.json();

    await environment.deleteEntry(id);

    return NextResponse.json(
      { message: "Entry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting entry in Contentful:", error);
    return NextResponse.json(
      { error: "Error deleting entry in Contentful" },
      { status: 500 }
    );
  }
}
