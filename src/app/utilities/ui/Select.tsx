interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: {
    value: string;
    name: string;
  }[];
  defaultOptionText?: string;
  mode?: "cp-light" | "cp-dark";
}

export function Select({ options, defaultOptionText = 'Selecciona una opción', mode, ...props }: Props) {
  const classMode =
    mode === "cp-dark"
      ? "border-gray-400 text-cp-dark placeholder:text-gray-400"
      : "border-slate-300 text-cp-light placeholder:text-gray-400";
  const classOptions =
    mode === "cp-dark"
      ? "text-cp-dark bg-cp-light"
      : "text-slate-300 bg-cp-dark";
  return (
    <select
      className={`block bg-transparent w-full rounded-md outline-none border-2 focus-visible:border-cp-primary py-3 px-4 ${classMode}`}
      {...props}
    >v
      <option className={`${classOptions}`} disabled selected>{defaultOptionText}</option>
      {options.map(option => <option key={option.value} className={`${classOptions}`} value={option.value}>{option.name}</option>)}

    </select>
  )
}

export default Select;