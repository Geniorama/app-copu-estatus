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
    <form className="w-full flex flex-col gap-3 bg-slate-100 p-8 rounded-lg">
      <div className="flex gap-3">
        <div className="w-1/2">
          <Label mode="cp-dark">Nombre compañía</Label>
          <Input mode="cp-dark" required />
        </div>
        <div className="w-1/2">
          <Label mode="cp-dark">Dirección</Label>
          <Input mode="cp-dark" required type="text" />
        </div>
      </div>

      <div>
        <Label mode="cp-dark">Teléfono</Label>
        <Input mode="cp-dark" required type="number" />
      </div>

      <div>
        <Label mode="cp-dark">Link grupo whatsapp</Label>
        <Input mode="cp-dark" required type="text" />
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Label mode="cp-dark">NIT</Label>
          <Input mode="cp-dark" required />
        </div>
        <div className="w-1/2">
          <Label mode="cp-dark">Razón social</Label>
          <Input mode="cp-dark" required type="text" />
        </div>
      </div>

      <div>
        <Label mode="cp-dark">Compañía superior</Label>
        <Select options={optionsSelect} />
      </div>

      <div>
        <Label mode="cp-dark">Estadísticas anteriores {"(Drive link)"}</Label>
        <Input mode="cp-dark" required type="text" />
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
