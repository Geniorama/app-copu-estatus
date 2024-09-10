"use client";

import Button from "../utilities/ui/Button";
import Input from "../utilities/ui/Input";
import Textarea from "../utilities/ui/Textarea";

export default function Home() {

  return (
    <main>
      <h1>WELCOME: You are authenticated</h1>
      <Input
        type="text"
        id="text"
        placeholder="Input Type text"
      />
      <Textarea
        id="Textarea"
        placeholder="Descripción"
        rows={7}
      />
      <Button type="button">Prueba</Button>
    </main>
  );
}
