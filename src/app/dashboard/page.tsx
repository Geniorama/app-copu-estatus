import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import DashboardClientWrapper from "./DashboardWrapper";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Dashboard',
  viewport: 'width=device-width, initial-scale=1',
};

async function HomeDashboard() {
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

  return (
    <DashboardClientWrapper user={user} userRole={userRole} />
  );
}

export default withPageAuthRequired(HomeDashboard);
