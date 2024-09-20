interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: Props) {
  return (
    <input
      className="block bg-transparent w-full rounded-md outline-none border-2 border-slate-300 text-cp-light py-2 px-4 placeholder:text-gray-400 focus-visible:border-cp-primary"
      {...props}
    />
  );
}

export default Input;
