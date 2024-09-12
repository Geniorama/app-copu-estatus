import Home from "./views/Home";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getSession } from "@auth0/nextjs-auth0";

async function HomePage() {
  const session = await getSession();
  
  const user = session?.user

  if(!user){
    console.log("No hay usuario autenticado");
    return <div>No estás autenticado</div>;
  }

  return <Home user={user}/>
}

export default withPageAuthRequired(HomePage)
