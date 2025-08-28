// app/api/auth/[auth0]/route.js
import { handleAuth } from '@auth0/nextjs-auth0';
import auth0Config from '@/app/lib/auth0';

export const GET = handleAuth(auth0Config);
export const POST = handleAuth(auth0Config);