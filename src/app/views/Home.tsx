"use client";

import Button from "../utilities/ui/Button";
import Input from "../utilities/ui/Input";
import Label from "../utilities/ui/Label";
import Logo from "../utilities/ui/Logo";
import Select from "../utilities/ui/Select";
import Textarea from "../utilities/ui/Textarea";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import type { Claims } from "@auth0/nextjs-auth0";
import { setCurrentUser } from "../store/features/userSlice";
import Profile from "../utilities/ui/Profile";
import Search from "../utilities/ui/Search";

interface HomeProps {
  user?: Claims;
};

export default function Home({ user }: HomeProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setCurrentUser(user));
    }
  }, [user, dispatch]);

  const optionsData = [
    {
      value: 'option1',
      name: 'Option 1',
    },
    {
      value: 'option2',
      name: 'Option 2',
    },
    {
      value: 'option3',
      name: 'Option 3',
    },
    {
      value: 'option4',
      name: 'Option 4',
    },
    {
      value: 'option5',
      name: 'Option 5',
    },
  ]
  return (
    <main>
      <h1>WELCOME: You are authenticated</h1>
      <Logo />
      <Search />
      <Profile URL="" />
      <Label htmlFor="name" mode="cp-dark">Nombre</Label>
      <Input type="text" id="name" name="name" placeholder="Nombre" mode="cp-dark" />
      <Label htmlFor="Textarea">Descripción</Label>
      <Textarea
        id="Textarea"
        name="description"
        placeholder="Descripción"
        mode="cp-dark"
        rows={7}
      />
      <Label htmlFor="select" mode="cp-dark">Opciones</Label>
      <Select name="selectTest" id="select" options={optionsData} defaultOptionText="Elige" mode="cp-dark" />
      <Button mode="cp-green" type="button">Prueba</Button>
    </main>
  );
}

