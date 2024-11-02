import { User } from '@/app/types';
import { NextResponse } from 'next/server';

const getAuth0Token = async () => {
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: 'client_credentials',
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error obteniendo token de Auth0:', errorData);
      throw new Error('Error obteniendo token de Auth0');
    }
    const data = await response.json();
    return data.access_token;
};

interface UserForAuth extends User {
  password: string
}
  

const createAuth0User = async (token: string, user: UserForAuth) => {
  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: user.email,
      given_name: user.fname,
      family_name: user.lname,
      connection: 'Username-Password-Authentication',
      password: user.password,
      app_metadata: {
        role: user.role,
      },
    }),
  });

  if (!response.ok) throw new Error('Error creando usuario en Auth0');
  const data = await response.json();
  return data.user_id;
};

export async function POST(req: Request) {
  try {
    const user = await req.json();
    const token = await getAuth0Token();
    const auth0Id = await createAuth0User(token, user);

    return NextResponse.json({ auth0Id }, { status: 200 });
  } catch (error) {
    console.error('Error en la creación de usuario:', error);
    return NextResponse.json({ message: 'Error creando usuario en Auth0' }, { status: 500 });
  }
}
