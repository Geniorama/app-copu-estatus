import Services from "@/app/views/Dashboard/Services"
import ServicesClient from "@/app/views/DashboardClient/ServicesClient"
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
  const session = await getSession();

  if (!session) {
   return redirect("/api/auth/login");
  }

  const { user } = session;
  const userRoleUri = "https://localhost:3000/roles";
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
