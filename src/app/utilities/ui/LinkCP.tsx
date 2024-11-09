interface LinksProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { }

export function LinkCP({ children, ...props }: LinksProps) {
  return (
    <a
      className="hover:underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap cursor-pointer"
      {...props}
    >
      {children}
    </a>
  )
}

export default LinkCP;