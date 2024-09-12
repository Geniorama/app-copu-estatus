interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: "light" | "dark" | "green";
}

export function Button({ children, mode, ...props }: ButtonProps) {
  return (
    <button
      className={`flex justify-center rounded-3xl ${
        mode === "green"
          ? "bg-cp-primary"
          : mode === "dark"
          ? "bg-cp-dark"
          : "bg-cp-light"
      } hover:bg-cp-dark px-12 py-2 text-base leading-none font-semibold text-cp-dark hover:text-cp-light shadow-sm transition-all duration-300`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
