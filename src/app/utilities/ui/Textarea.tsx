interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  mode?: "cp-light" | "cp-dark";
}

export function Textarea({ mode, ...props }: Props) {
  const classMode =
    mode === "cp-dark"
      ? "border-gray-400 text-cp-dark placeholder:text-gray-400"
      : "border-slate-300 text-cp-light placeholder:text-gray-400";
  return (
    <textarea
      className={`block bg-transparent w-full rounded-md outline-none border-2 py-3 px-4 focus-visible:border-cp-primary ${classMode}`}
      {...props}
    />
  )
}

export default Textarea;
