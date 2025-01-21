import Contents from "@/app/views/Dashboard/Contents"
import ContentsClient from "@/app/views/DashboardClient/ContentsClient"
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { redirect } from "next/navigation"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contenidos - Dashboard',
  viewport: 'width=device-width, initial-scale=1',
};

async function ContentsPage() {
  const userRoleUri = `${process.env.NEXT_PUBLIC_ROLE_URL}`;
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  const { user } = session;
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
