import { NextRequest, NextResponse } from "next/server";
import { getContentfulEnvironment } from "@/app/lib/contentfulManagement";
import type { User } from "@/app/types";
import { Entry } from "contentful-management";

export async function GET(request: NextRequest) {
  try {
    const environment = await getContentfulEnvironment();
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');

    const query: {
      content_type: string;
      include: number;
      "fields.role"?: string;
    } = {
      content_type: "user",
      include: 3,
    };

    if (role) {
      query["fields.role"] = role;
    }

    const response = await environment.getEntries(query);

    const users = response.items.map((entry: Entry) => ({
      id: entry.sys.id,
      fname: entry.fields.firstName?.["en-US"] || null,
      lname: entry.fields.lastName?.["en-US"] || null,
      email: entry.fields.email?.["en-US"] || null,
      role: entry.fields.role?.["en-US"] || null,
      phone: entry.fields.phone?.["en-US"] || null,
      imageProfile: entry.fields.imageProfile?.["en-US"] || null,
      status: entry.fields.status?.["en-US"] || null,
      auth0Id: entry.fields.auth0Id?.["en-US"] || null,
      companiesId: entry.fields.company?.["en-US"]?.map((company: Entry) => company.sys.id) || null,
      position: entry.fields.position?.["en-US"] || null,
    }));

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
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
        company: {
          "en-US": user.companiesId?.map((companyId) => ({
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: companyId
            }
          }))
        }
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
    const { auth0Id, ...updatedUserData }: Partial<User> = await request.json();

    if (!auth0Id) {
      return NextResponse.json(
        { error: "auth0Id es requerido para la actualización" },
        { status: 400 }
      );
    }

    // Obtener la entrada del usuario existente usando auth0Id
    const entries = await environment.getEntries({
      content_type: "user",
      "fields.auth0Id": auth0Id,
    });

    if (entries.items.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Obtener la entrada a actualizar
    const entry = entries.items[0];

    // Actualizar solo los campos que se proporcionaron
    if (updatedUserData.fname) {
      entry.fields.firstName["en-US"] = updatedUserData.fname;
    }
    if (updatedUserData.lname) {
      entry.fields.lastName["en-US"] = updatedUserData.lname;
    }
    if (updatedUserData.phone) {
      entry.fields.phone["en-US"] = updatedUserData.phone;
    }
    if (updatedUserData.role) {
      entry.fields.role["en-US"] = updatedUserData.role;
    }
    if (updatedUserData.imageProfile) {
      entry.fields.imageProfile["en-US"] = updatedUserData.imageProfile;
    }
    if (updatedUserData.position) {
      entry.fields.position["en-US"] = updatedUserData.position;
    }
    if (updatedUserData.linkWhatsApp) {
      entry.fields.linkWhatsApp["en-US"] = updatedUserData.linkWhatsApp;
    }
    if (updatedUserData.companies) {
      entry.fields.company["en-US"] = updatedUserData.companies.map((company) => ({
        sys: {
          type: "Link",
          linkType: "Entry",
          id: company.sys.id,
        },
      }));
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
