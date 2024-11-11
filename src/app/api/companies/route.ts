import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";
import type { Company } from "@/app/types";

export async function GET() {
  try {
    const environment = await getContentfulEnvironment();

    const entries = await environment.getEntries({
      content_type: "company",
      "sys.publishedAt[exists]": true,
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
        superior: {
          "en-US": {
            sys: {
              type: "Link",
              linkType: "Entry",
              id: company.superiorId,
            },
          },
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

export async function PATCH(request: NextRequest) {
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
      superiorId,
      driveLink,
    } = updateCompany;

    if (!id) {
      throw new Error("Company id is required!");
    }

    const entry = await environment.getEntry(id);

    // Actualiza los campos, permitiendo valores vacíos o null
    if (name !== undefined) {
      entry.fields.name = entry.fields.name || {};
      entry.fields.name["en-US"] = name || null;
    }
    if (businessName !== undefined) {
      entry.fields.businessName = entry.fields.businessName || {};
      entry.fields.businessName["en-US"] = businessName || null;
    }
    if (linkWhatsApp !== undefined) {
      entry.fields.whatsappLink = entry.fields.whatsappLink || {};
      entry.fields.whatsappLink["en-US"] = linkWhatsApp || null;
    }
    if (logo !== undefined) {
      entry.fields.logo = entry.fields.logo || {};
      entry.fields.logo["en-US"] = logo || null;
    }
    if (typeof status === "boolean") {
      entry.fields.status = entry.fields.status || {};
      entry.fields.status["en-US"] = status;
    }
    if (email !== undefined) {
      entry.fields.email = entry.fields.email || {};
      entry.fields.email["en-US"] = email || null;
    }
    if (phone !== undefined) {
      entry.fields.phone = entry.fields.phone || {};
      entry.fields.phone["en-US"] = phone || null;
    }
    if (address !== undefined) {
      entry.fields.address = entry.fields.address || {};
      entry.fields.address["en-US"] = address || null;
    }
    if (nit !== undefined) {
      entry.fields.nit = entry.fields.nit || {};
      entry.fields.nit["en-US"] = nit || null;
    }
    if (driveLink !== undefined) {
      entry.fields.driveLink = entry.fields.driveLink || {};
      entry.fields.driveLink["en-US"] = driveLink || null;
    }
    if (superiorId !== undefined) {
      entry.fields.superior = entry.fields.superior || {};
      entry.fields.superior["en-US"] = superiorId
        ? {
            sys: {
              type: "Link",
              linkType: "Entry",
              id: superiorId,
            },
          }
        : null;
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
