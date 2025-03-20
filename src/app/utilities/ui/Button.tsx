interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: "cp-light" | "cp-dark" | "cp-green";
  fullWidthMobile?: boolean;
}

export function Button({ children, mode, fullWidthMobile, ...props }: ButtonProps) {
  const buttonClassMode =
    mode === "cp-green"
      ? "bg-cp-primary text-cp-dark hover:text-cp-primary hover:bg-cp-dark border-2 border-cp-primary"
      : mode === "cp-dark"
        ? "bg-cp-dark text-cp-light hover:bg-white hover:text-cp-dark border-2 border-cp-dark hover:border-white"
        : mode === "cp-light"
          ? "bg-cp-light text-cp-dark hover:bg-cp-dark hover:text-slate-100 border-solid border border-cp-dark" : '';

  return (
    <button
      className={`${fullWidthMobile && "w-full lg:w-auto"} flex justify-center items-center rounded-3xl ${buttonClassMode} px-4 py-2 text-base leading-none font-semibold shadow-sm transition-all duration-300 disabled:opacity-45 disabled:pointer-events-none`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
