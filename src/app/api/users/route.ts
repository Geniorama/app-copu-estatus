import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";
import type { User } from "@/app/types";

export async function GET() {
  try {
    const environment = await getContentfulEnvironment();

    const entries = await environment.getEntries({
      content_type: "user",
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
    const user:User = await request.json();

    const newEntry = await environment.createEntry("user", {
      fields: {
        firstName: {
          "en-US": user.fname,
        },
        lastName: {
          "en-US": user.lname,
        },
        email: {
          "en-US": user.email,
        },
        phone: {
          "en-US": user.phone,
        },
        role: {
          "en-US": user.role,
        },
        imageProfile: {
          "en-US": user.imageProfile,
        },
        position: {
          "en-US": user.position,
        },
        auth0Id: {
          "en-US": user.auth0Id,
        },
        linkWhatsApp: {
          "en-US": user.linkWhatsApp,
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
