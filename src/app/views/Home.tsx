"use client";

import Button from "../utilities/ui/Button";
import Input from "../utilities/ui/Input";
import Label from "../utilities/ui/Label";
import Logo from "../utilities/ui/Logo";
import Textarea from "../utilities/ui/Textarea";

export default function Home() {

  return (
    <main>
      <h1>WELCOME: You are authenticated</h1>
      <Logo />
      <Label htmlFor="name">
        Nombre
      </Label>
      <Input
        type="text"
        id="name"
        name="name"
        placeholder="Nombre"
      />
      <Label htmlFor="name">
        Descripción
      </Label>
      <Textarea
        id="Textarea"
        name="description"
        placeholder="Descripción"
        rows={7}
      />
      <Button type="button">Prueba</Button>
    </main>
  );
}
