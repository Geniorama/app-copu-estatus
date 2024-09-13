interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

export function Textarea(props: Props) {
  return (
    <textarea
      className="block bg-transparent w-full rounded-md outline-none border-2 border-slate-300 text-cp-light py-3 px-4 placeholder:text-gray-400 focus-visible:border-cp-primary"
      {...props}
    />
  )
}

export default Textarea;
