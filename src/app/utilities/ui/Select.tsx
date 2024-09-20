interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: {
    value: string;
    name: string;
  }[];
  defaultOptionText?: string;
}

export function Select({ options, defaultOptionText = 'Selecciona una opción', ...props }: Props) {
  return (
    <select
      className="block bg-transparent w-full rounded-md outline-none border-2 border-slate-300 text-cp-light py-2 px-4 placeholder:text-gray-400 focus-visible:border-cp-primary"
      {...props}
    >v
      <option className="text-slate-300 bg-cp-dark" disabled selected>{defaultOptionText}</option>
      {options.map(option => <option key={option.value} className="text-slate-300 bg-cp-dark" value={option.value}>{option.name}</option>)}

    </select>
  )
}

export default Select;