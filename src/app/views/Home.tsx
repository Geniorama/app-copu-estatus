"use client";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import type { Claims } from "@auth0/nextjs-auth0";
import { setCurrentUser } from "../store/features/userSlice";
import Button from "../utilities/ui/Button";
import Input from "../utilities/ui/Input";
import Label from "../utilities/ui/Label";
import Logo from "../utilities/ui/Logo";
import Select from "../utilities/ui/Select";
import Textarea from "../utilities/ui/Textarea";

interface HomeProps {
  user?: Claims;
};

export default function Home({ user }: HomeProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setCurrentUser(user));
    }
  }, [user]);

  return (
    <main>
      <h1>WELCOME: You are authenticated</h1>
      <Logo />
      <Label htmlFor="name">Nombre</Label>
      <Input type="text" id="name" name="name" placeholder="Nombre" />
      <Label htmlFor="name">Descripción</Label>
      <Textarea
        id="Textarea"
        name="description"
        placeholder="Descripción"
        rows={7}
      />
      <Label htmlFor="selectTest">Opciones</Label>
      <Select name="selectTest" id="select">
        <option>United States</option>
        <option>Canada</option>
        <option>Mexico</option>
      </Select>
      <Button mode="dark" type="button">
        Prueba
      </Button>
    </main>
  );
}

