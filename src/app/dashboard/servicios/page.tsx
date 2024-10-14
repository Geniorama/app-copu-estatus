import Services from "@/app/views/Dashboard/Services"
import ServicesClient from "@/app/views/DashboardClient/ServicesClient"
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
  const userRoleUri = process.env.NEXT_PUBLIC_ROLE_URL;
  const session = await getSession();

  if (!session) {
   return redirect("/api/auth/login");
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
