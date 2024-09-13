interface LinksProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { }

export function LinkCP({ children, ...props }: LinksProps) {
  return (
    <a
      className="underline text-cp-primary hover:text-cp-primary-hover"
      {...props}
    >
      {children}
    </a>
  )
}

export default LinkCP;