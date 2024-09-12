interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

export function Textarea(props: Props) {
  return (
    <textarea
      className="block w-full rounded-md border-0 py-3 px-4 text-cp-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
      {...props}
    />
  )
}

export default Textarea;
