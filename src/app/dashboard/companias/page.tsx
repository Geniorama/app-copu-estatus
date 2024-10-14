import Companies from "@/app/views/Dashboard/Companies"
import CompaniesClient from "@/app/views/DashboardClient/CompaniesClient"
import { getSession } from "@auth0/nextjs-auth0"
import { redirect } from "next/navigation"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"

async function CompaniesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  const { user } = session;
  const userRoleUri = "https://localhost:3000/roles";
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
