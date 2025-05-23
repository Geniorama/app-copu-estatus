interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  mode?: "cp-light" | "cp-dark";
}

export function Input({ mode, ...props }: Props) {
  const classMode =
    mode === "cp-dark"
      ? "border-gray-400 text-cp-dark placeholder:text-gray-400"
      : "border-slate-300 text-cp-light placeholder:text-gray-400";
  return (
    <input
      className={` disabled:opacity-40  text-md min-h-11 block bg-transparent w-full rounded-md outline-none border-2 py-2 px-4 focus-visible:border-cp-primary ${classMode}`}
      {...props}
    />
  );
}

export default Input;
