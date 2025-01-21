import Profile from "@/app/views/Dashboard/Profile"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mi Perfil - Dashboard',
  viewport: 'width=device-width, initial-scale=1',
};

async function ProfilePage() {
  return (
    <Profile />
  )
}

export default withPageAuthRequired(ProfilePage)
