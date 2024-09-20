interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  mode?: "cp-light" | "cp-dark";
}

export function Label({ children, mode, ...props }: Props) {
  const classMode =
    mode === "cp-dark"
      ? "text-cp-dark"
      : "text-slate-200";
  return (
    <label
      className={`block text-base font-medium leading-6 ${classMode} mb-1`}
      {...props}
    >
      {children}
    </label>
  )
}

export default Label;