import ServiceDetailClient from "@/app/views/DashboardClient/ServiceDetailClient"
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Detalle de Servicio - Dashboard',
  viewport: 'width=device-width, initial-scale=1',
};

async function ServiceDetailPage(props: { params?: Record<string, string | string[]> }) {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  const serviceId = props.params?.id as string;
  return <ServiceDetailClient serviceId={serviceId} />;
}

export default withPageAuthRequired(ServiceDetailPage) 