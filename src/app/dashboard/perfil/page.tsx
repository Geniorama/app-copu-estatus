import Profile from "@/app/views/Dashboard/Profile"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"

async function ProfilePage() {
  return (
    <Profile />
  )
}

export default withPageAuthRequired(ProfilePage)
