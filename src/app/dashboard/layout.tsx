import LayoutDashboard from "../Layout/LayoutDashboard"
interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({children}:LayoutProps) {
  return (
    <LayoutDashboard>
      {children}
    </LayoutDashboard>
  )
}
