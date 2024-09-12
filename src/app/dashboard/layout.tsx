import React from 'react'

interface LayoutDashboardProps {
    children: React.ReactNode
}

export default function LayoutDashboard({children}:LayoutDashboardProps) {
  return (
    <div>
        {children}
    </div>
  )
}
