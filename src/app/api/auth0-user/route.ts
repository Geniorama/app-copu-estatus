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

const getAuth0User = async (token: string, userId: string) => {
  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error obteniendo usuario de Auth0:', errorData);
    throw new Error('Error obteniendo usuario de Auth0');
  }

  const user = await response.json();
  return {
    id: user.user_id,
    email: user.email,
    role: user.app_metadata?.role || 'Sin rol asignado',
  };
};

  

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
    const { action, user } = await req.json();

    const token = await getAuth0Token();

    if (action === 'create') {
      const auth0Id = await createAuth0User(token, user);
      return NextResponse.json({ auth0Id }, { status: 200 });
    } else if (action === 'getRole') {
      const auth0User = await getAuth0User(token, user.auth0Id);
      return NextResponse.json({ auth0User }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: 'Acción no válida. Usa "create" o "getRole".' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error en la API de Auth0:', error);
    return NextResponse.json({ message: 'Error en la API de Auth0' }, { status: 500 });
  }
}
