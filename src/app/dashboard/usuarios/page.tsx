import Users from "@/app/views/Dashboard/Users"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Usuarios - Dashboard',
  description: 'This is the service page',
  viewport: 'width=device-width, initial-scale=1',
};

async function UsersPage() {
  return (
    <Users />
  )
}

export default withPageAuthRequired(UsersPage)
