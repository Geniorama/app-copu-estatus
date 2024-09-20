interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: "cp-light" | "cp-dark" | "cp-green";
}

export function Button({ children, mode, ...props }: ButtonProps) {
  const buttonClassMode =
    mode === "cp-green"
      ? "bg-cp-primary text-cp-dark hover:text-cp-primary hover:bg-cp-dark border-2 border-cp-primary"
      : mode === "cp-dark"
        ? "bg-cp-dark text-cp-light hover:bg-white hover:text-cp-dark border-2 border-cp-dark hover:border-white"
        : mode === "cp-light"
          ? "bg-cp-light text-cp-dark hover:bg-cp-dark border-solid border border-cp-dark" : '';

  return (
    <button
      className={`flex justify-center rounded-3xl ${buttonClassMode} px-12 py-2 text-base leading-none font-semibold shadow-sm transition-all duration-300`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
