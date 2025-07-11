import CompanyDetailClient from "@/app/views/DashboardClient/CompanyDetailClient"
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Detalle de Compañía - Dashboard',
  viewport: 'width=device-width, initial-scale=1',
};

async function CompanyDetailPage(props: { params?: Record<string, string | string[]> }) {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  const companyId = props.params?.id as string;
  return <CompanyDetailClient companyId={companyId} />;
}

export default withPageAuthRequired(CompanyDetailPage) 