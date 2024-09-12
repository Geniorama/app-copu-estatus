interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> { }

export function Select({ children, ...props }: Props) {
  return (
    <select
      className="block w-full rounded-md border-0 py-3 px-4 text-cp-dark shadow-sm ring-1 ring-inset ring-gray-300"
      {...props}
    >
      {children}
    </select>
  )
}

export default Select;