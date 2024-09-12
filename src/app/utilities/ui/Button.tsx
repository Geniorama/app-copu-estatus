interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export function Button({ children, ...props }: Props) {
  return (
    <button
      className="flex justify-center rounded-3xl bg-cp-primary hover:bg-cp-dark px-12 py-2 text-base leading-none font-semibold text-cp-dark hover:text-cp-light shadow-sm transition-all duration-300"
      {...props}
    >
      {children}
    </button>
  )
}

export default Button;