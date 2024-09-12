"use client"

import type { ReactNode } from "react"

interface ContentProps {
    children: ReactNode
}

export default function Content({children}:ContentProps) {
  return (
    <main className="p-8">
        {children}
    </main>
  )
}
