"use client";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import type { Claims } from "@auth0/nextjs-auth0";
import { setCurrentUser } from "../store/features/userSlice";

type HomeProps = {
  user?: Claims
}

export default function Home({user}:HomeProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    if(user){
      dispatch(setCurrentUser(user))
    }
  },[user])
  return (
    <main>
      <h1>WELCOME: You are authenticated</h1>
    </main>
  );
}
