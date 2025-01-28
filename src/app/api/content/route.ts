import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";
import type { Content } from "@/app/types";

export async function GET() {
  try {
    const environment = await getContentfulEnvironment();

    const entries = await environment.getEntries({
      content_type: "content",
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
    const content: Content = await request.json();

    // Crear la entrada en Contentful
    const newEntry = await environment.createEntry("content", {
      fields: {
        type: {
          "en-US": content.type || null,
        },
        headline: {
          "en-US": content.headline || null,
        },
        publicationDate: {
          "en-US": content.publicationDate || null,
        },
        service: {
          "en-US": content.service
            ? {
                sys: {
                  type: "Link",
                  linkType: "Entry",
                  id: content.service.id,
                },
              }
            : null,
        },
        socialLinksAndStatistics: {
          "en-US":
            content.socialMediaInfo?.map((info) => ({
              id: info.id,
              link: info.link || null,
              statistics: {
                scope: info.statistics?.scope || 0,
                impressions: info.statistics?.impressions || 0,
                interactions: info.statistics?.interactions || 0,
              },
            })) || null,
        },
      },
    });

    // Publicar la entrada recién creada
    await newEntry.publish();

    // Respuesta exitosa
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
    const updateContent = await request.json();
    const {
      id,
      headline,
      type,
      publicationDate,
      socialMediaInfo,
    } = updateContent;

    if (!id) {
      throw new Error("Content id is required!");
    }

    const entry = await environment.getEntry(id);

    // Actualiza los campos, permitiendo valores vacíos o null
    if (headline !== undefined) {
      entry.fields.headline = entry.fields.headline || {};
      entry.fields.headline["en-US"] = headline || null;
    }
    if (type !== undefined) {
      entry.fields.type = entry.fields.type || {};
      entry.fields.type["en-US"] = type || null;
    }
    if (publicationDate !== undefined) {
      entry.fields.publicationDate = entry.fields.publicationDate || {};
      entry.fields.publicationDate["en-US"] = publicationDate || null;
    }
    if (socialMediaInfo !== undefined) {
      entry.fields.socialLinksAndStatistics = entry.fields.socialLinksAndStatistics || {};
      entry.fields.socialLinksAndStatistics["en-US"] = socialMediaInfo || null;
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
