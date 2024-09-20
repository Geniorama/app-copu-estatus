interface LinksProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { }

export function LinkCP({ children, ...props }: LinksProps) {
  return (
    <a
      className="underline text-cp-primary hover:text-cp-primary-hover inline-block whitespace-nowrap"
      {...props}
    >
      {children}
    </a>
  )
}

export default LinkCP;