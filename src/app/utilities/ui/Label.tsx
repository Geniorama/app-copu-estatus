interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> { }

export function Label({ children, ...props }: Props) {
  return (
    <label
      className="block text-base font-medium leading-6 text-cp-dark mb-1"
      {...props}
    >
      {children}
    </label>
  )
}

export default Label;