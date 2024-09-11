"use client";

import Button from "../utilities/ui/Button";
import Input from "../utilities/ui/Input";
import Label from "../utilities/ui/Label";
import Logo from "../utilities/ui/Logo";
import Select from "../utilities/ui/Select";
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
      <Label htmlFor="selectTest">
        Opciones
      </Label>
      <Select
        name="selectTest"
        id="select"
      >
        <option>United States</option>
        <option>Canada</option>
        <option>Mexico</option>
      </Select>
      <Button type="button">Prueba</Button>
    </main>
  );
}
