import { NextResponse, NextRequest } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");

  if (!serviceId) {
    return NextResponse.json({ error: "serviceId is required" }, { status: 400 });
  }

  try {
    const environment = await getContentfulEnvironment();
    const entries = await environment.getEntries({
      content_type: "content",
      "fields.service.sys.id": serviceId,
      "sys.publishedAt[exists]": true,
    });

    const items = entries.items;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "No entries found" }, { status: 404 });
    }

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching data from Contentful:", error);
    return NextResponse.json({ error: "Error fetching data from Contentful" }, { status: 500 });
  }
}