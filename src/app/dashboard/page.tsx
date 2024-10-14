import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import DashboardClientWrapper from "./DashboardWrapper";

async function HomeDashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  const { user } = session;
  const userRoleUri = "https://localhost:3000/roles";
  const userRole = user[userRoleUri];

  return (
    <DashboardClientWrapper user={user} userRole={userRole} />
  );
}

export default HomeDashboard;
