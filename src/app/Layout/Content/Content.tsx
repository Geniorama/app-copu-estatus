"use client"

import type { ReactNode } from "react"

interface ContentProps {
    children: ReactNode
}

export default function Content({children}:ContentProps) {
  return (
    <main className="p-8 lg:max-h-[calc(100vh_-_120px)] md:overflow-y-scroll custom-scroll lg:min-h-[calc(100vh_-_120px)]">
        {children}
    </main>
  )
}
