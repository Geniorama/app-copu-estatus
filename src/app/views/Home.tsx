"use client";

import Button from "../utilities/ui/Button";
import Input from "../utilities/ui/Input";

export default function Home() {

  return (
    <main>
      <h1>WELCOME: You are authenticated</h1>
      <Input
        type="text"
        id="text"
        placeholder="Input Type text"
      />
      <Button type="button">Prueba</Button>
    </main>
  );
}
