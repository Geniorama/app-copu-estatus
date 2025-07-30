import { NextRequest, NextResponse } from "next/server";
import contentfulClient from "@/app/lib/contentful";

// Helper function to safely get localized field
const getLocalizedField = (field: unknown, locale: string = "en-US") => {
  if (field && typeof field === 'object' && field !== null && locale in field) {
    return (field as Record<string, unknown>)[locale];
  }
  return field || "";
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const superiorId = searchParams.get("superiorId");

    console.log('getSubCompanies - superiorId:', superiorId);

    if (!superiorId) {
      return NextResponse.json(
        { error: "superiorId es requerido" },
        { status: 400 }
      );
    }

    // Verificar configuración de Contentful
    console.log('Contentful client config:', {
      space: process.env.CONTENTFUL_SPACE_ID,
      hasToken: !!process.env.CONTENTFUL_API_TOKEN
    });

    // Consulta simple sin filtros problemáticos
    const response = await contentfulClient.getEntries({
      content_type: "company",
      limit: 100,
      order: ["fields.name"],
      include: 2,
    });

    // Filtrar manualmente las subcompañías
    const filteredItems = response.items.filter(item => {
      const superior = getLocalizedField(item.fields.superior);
      return superior && typeof superior === 'object' && 'sys' in superior && 
             (superior as { sys?: { id?: string } }).sys?.id === superiorId;
    });

    console.log('getSubCompanies - filtered items count:', filteredItems.length);

    const subCompanies = filteredItems.map((entry) => {
      try {
        return {
          id: entry.sys.id,
          name: getLocalizedField(entry.fields.name),
          businessName: getLocalizedField(entry.fields.businessName),
          logo: getLocalizedField(entry.fields.logo),
          status: getLocalizedField(entry.fields.status) ?? true,
          phone: getLocalizedField(entry.fields.phone),
          address: getLocalizedField(entry.fields.address),
          nit: getLocalizedField(entry.fields.nit),
          driveLink: getLocalizedField(entry.fields.driveLink),
          superior: getLocalizedField(entry.fields.superior),
        };
      } catch (mapError) {
        console.error("Error mapping entry:", mapError, "Entry:", entry);
        return null;
      }
    }).filter(Boolean);

    console.log('getSubCompanies - processed subCompanies:', subCompanies);

    return NextResponse.json({ subCompanies });
  } catch (error) {
    console.error("Error obteniendo subcompañías:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 