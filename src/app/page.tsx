import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

async function HomePage() {
  const session = await getSession();
  const user = session?.user

  if(!user){
    console.log("No hay usuario autenticado");
    return <div>No estás autenticado</div>;
  }

  redirect('/dashboard');
}

export default withPageAuthRequired(HomePage)
