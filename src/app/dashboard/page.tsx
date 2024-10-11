import DashboardHome from "../views/Dashboard/Home";
import DashboardHomeClient from "../views/DashboardClient/Home";
import { getSession } from "@auth0/nextjs-auth0";

async function HomeDashboard() {
  const session = await getSession();

  if (session) {
    const { user } = session
    const userRoleUri = "https://localhost:3000/roles";
    const userRole = user[userRoleUri];

    if (userRole === "admin") {
      return <DashboardHome />;
    }

    return <DashboardHomeClient />;
  }

}

export default HomeDashboard;
