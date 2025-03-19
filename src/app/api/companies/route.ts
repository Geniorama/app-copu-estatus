import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";
import type { Company } from "@/app/types";
import { Entry } from "contentful-management";

export async function GET(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const skip = (page - 1) * limit;

    const entries = await environment.getEntries({
      content_type: "company",
      "sys.publishedAt[exists]": true,
      limit,
      skip,
    });

    if (!entries.items || entries.items.length === 0) {
      return NextResponse.json(
        { message: "No companies found" },
        { status: 404 }
      );
    }

    // const companies = entries.items.map((item) => ({
    //   id: item.sys.id,
    //   name: item.fields.name?.["en-US"] || "",
    //   logo: item.fields.logo?.["en-US"] || "",
    //   address: item.fields.address?.["en-US"] || "",
    //   phone: item.fields.phone?.["en-US"] || "",
    //   linkWhatsApp: item.fields.whatsappLink?.["en-US"] || "",
    //   nit: item.fields.nit?.["en-US"] || "",
    //   businessName: item.fields.businessName?.["en-US"] || "",
    //   driveLink: item.fields.driveLink?.["en-US"] || "",
    //   superiorId: item.fields.superior?.["en-US"]?.sys?.id || null,
    // }));

    return NextResponse.json(
      {
        companies: entries.items,
        total: entries.total,
        totalPages: Math.ceil(entries.total / limit),
      },
      { status: 200 }
    );
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

    const fields: Entry['fields'] = {
      name: { "en-US": company.name },
      logo: { "en-US": company.logo || "" },
      address: { "en-US": company.address },
      phone: { "en-US": company.phone },
      whatsappLink: { "en-US": company.linkWhatsApp || "" },
      nit: { "en-US": company.nit || "" },
      businessName: { "en-US": company.businessName || "" },
    };

    if (company.driveLink) {
      fields.driveLink = { "en-US": company.driveLink };
    }

    if (company.superiorId) {
      fields.superior = {
        "en-US": {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: company.superiorId,
          },
        },
      };
    }

    const newEntry = await environment.createEntry("company", { fields });

    await newEntry.publish();

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
    const { id, superiorId, whatsAppLink, ...fieldsToUpdate } = updateCompany;

    if (!id) {
      return NextResponse.json(
        { error: "Company ID is required!" },
        { status: 400 }
      );
    }

    const entry = await environment.getEntry(id);

    Object.entries(fieldsToUpdate).forEach(([key, value]) => {
      entry.fields[key] = entry.fields[key] || {};
      entry.fields[key]["en-US"] = value || null;
    });
    
    if(whatsAppLink !== undefined) {
      entry.fields.whatsappLink = {
        "en-US": whatsAppLink.trim() ? whatsAppLink : null
      }
    }

    if (superiorId !== undefined) {
      entry.fields.superior = {
        "en-US": superiorId
          ? {
              sys: {
                type: "Link",
                linkType: "Entry",
                id: superiorId,
              },
            }
          : null,
      };
    }

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

    if (!id) {
      return NextResponse.json(
        { error: "Company ID is required!" },
        { status: 400 }
      );
    }

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
