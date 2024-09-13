import React from 'react'

interface TitleSectionProps {
    title: string
}

export default function TitleSection({title}:TitleSectionProps) {
  return (
    <h1 className="text-xl font-bold text-slate-200">{title}</h1>
  )
}
