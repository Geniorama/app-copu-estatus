import DashboardHome from "../views/Dashboard/Home";
import DashboardHomeClient from "../views/DashboardClient/Home";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

async function HomeDashboard() {
  const session = await getSession();

  if(!session){
    redirect('/api/auth/login')
  }

  const { user } = session
    const userRoleUri = "https://localhost:3000/roles";
    const userRole = user[userRoleUri];

    switch (userRole) {
      case 'admin':
        return <DashboardHome />;
      case 'cliente':
        return <DashboardHomeClient />;
      default:
        return <DashboardHomeClient />;
    }
}

export default HomeDashboard;
