import Input from "@/app/utilities/ui/Input";
import Label from "@/app/utilities/ui/Label";
import Select from "@/app/utilities/ui/Select";
import Button from "@/app/utilities/ui/Button";

const optionsSelect = [
  {
    name: "Option 1",
    value: "option-1",
  },
  {
    name: "Option 2",
    value: "option-2",
  },
];

export default function FormCreateCompany() {
  return (
    <form className="w-full flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="w-1/2">
          <Label>Nombre compañía</Label>
          <Input required />
        </div>
        <div className="w-1/2">
          <Label>Dirección</Label>
          <Input required type="text" />
        </div>
      </div>

      <div>
        <Label>Teléfono</Label>
        <Input required type="number" />
      </div>

      <div>
        <Label>Link grupo whatsapp</Label>
        <Input required type="text" />
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label>NIT</Label>
          <Input required />
        </div>
        <div className="w-1/2">
          <Label>Razón social</Label>
          <Input required type="text" />
        </div>
      </div>

      <div>
        <Label>Compañía superior</Label>
        <Select options={optionsSelect} />
      </div>

      <div>
        <Label>Estadísticas anteriores {"(Drive link)"}</Label>
        <Input required type="text" />
      </div>

      <div className="flex gap-3 items-center justify-end mt-3">
        <div>
          <Button type="button" mode="cp-dark">Cerrar</Button>
        </div>
        <div>
          <Button mode="cp-green" type="submit">Crear compañía</Button>
        </div>
      </div>
    </form>
  );
}
