import Users from "@/app/views/Dashboard/Users"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"

async function UsersPage() {
  return (
    <Users />
  )
}

export default withPageAuthRequired(UsersPage)
