import Companies from "@/app/views/Dashboard/Companies"
import CompaniesClient from "@/app/views/DashboardClient/CompaniesClient"
import { getSession } from "@auth0/nextjs-auth0"
import { redirect } from "next/navigation"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Compañías - Dashboard',
  viewport: 'width=device-width, initial-scale=1',
};

async function CompaniesPage() {
  const userRoleUri = `${process.env.NEXT_PUBLIC_ROLE_URL}`;
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  const { user } = session;
  const userRole = user[userRoleUri];

  switch (userRole) {
    case "admin":
      return <Companies />;
    case "cliente":
      return <CompaniesClient />;
    default:
      return <CompaniesClient />;
  }
}

export default withPageAuthRequired(CompaniesPage)
