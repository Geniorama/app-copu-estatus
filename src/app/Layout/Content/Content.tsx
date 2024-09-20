"use client"

import type { ReactNode } from "react"

interface ContentProps {
    children: ReactNode
}

export default function Content({children}:ContentProps) {
  return (
    <main className="p-8 max-h-[calc(100vh_-_120px)] overflow-y-scroll custom-scroll">
        {children}
    </main>
  )
}
