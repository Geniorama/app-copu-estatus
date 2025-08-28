import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import DashboardClientWrapper from "./DashboardWrapper";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Copu estatus | Dashboard',
  viewport: 'width=device-width, initial-scale=1',
};

async function HomeDashboard() {
  const userRoleUri = process.env.NEXT_PUBLIC_ROLE_URL || 'https://estatus.copu.media/roles';
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  const { user } = session;
  
  // Intentar obtener el rol del usuario de diferentes fuentes
  let userRole = user[userRoleUri];
  
  // Si no se encuentra el rol, intentar con campos alternativos
  if (!userRole) {
    userRole = user['https://estatus.copu.media/roles'] || 
               user['https://estatus.copu.media/role'] ||
               user['http://estatus.copu.media/roles'] ||
               user['role'] ||
               user['roles'] ||
               'cliente'; // Valor por defecto
  }

  // Log para debugging
  console.log('User object:', user);
  console.log('UserRoleUri:', userRoleUri);
  console.log('UserRole found:', userRole);

  return (
    <DashboardClientWrapper user={user} userRole={userRole} />
  );
}

export default withPageAuthRequired(HomeDashboard);
