import Services from "@/app/views/Dashboard/Services"
import ServicesClient from "@/app/views/DashboardClient/ServicesClient"
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Servicios - Dashboard',
  viewport: 'width=device-width, initial-scale=1',
};

async function ServicesPage() {
  const userRoleUri = `${process.env.NEXT_PUBLIC_ROLE_URL}`;
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  const { user } = session;
  
  if (!userRoleUri) {
    throw new Error('NEXT_PUBLIC_ROLE_URL is not defined');
  }

  const userRole = user[userRoleUri];

  switch (userRole) {
    case "admin":
      return <Services />;
    case "cliente":
      return <ServicesClient />;
    default:
      return <ServicesClient />;
  }
}

export default withPageAuthRequired(ServicesPage)
