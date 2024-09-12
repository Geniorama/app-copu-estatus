interface Props extends React.InputHTMLAttributes<HTMLInputElement> { }

export function Input(props: Props) {
  return (
    <input
      className="block w-full rounded-md border-0 py-3 px-4 text-cp-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:cp-primary"
      {...props}
    />
  )
}

export default Input;