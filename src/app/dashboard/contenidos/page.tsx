import Contents from "@/app/views/Dashboard/Contents"
import ContentsClient from "@/app/views/DashboardClient/ContentsClient"
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { redirect } from "next/navigation"

async function ContentsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  const { user } = session;
  const userRoleUri = "https://localhost:3000/roles";
  const userRole = user[userRoleUri];

  switch (userRole) {
    case "admin":
      return <Contents />;
    case "cliente":
      return <ContentsClient />;
    default:
      return <ContentsClient />;
  }
}

export default withPageAuthRequired(ContentsPage)
