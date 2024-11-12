import { useState } from "react"

interface SwitchProps {
    active: boolean
    onClick?: () => void
}

export default function Switch({active, onClick}:SwitchProps) {
  const [isActive, setIsActive] = useState(active)

  const toggleState = () => {
    setIsActive(!isActive)
    onClick && onClick()
  }

  return (
    <div onClick={toggleState} className='rounded-full h-6 w-12 bg-slate-500 cursor-pointer'>
        <span className={`h-full transition aspect-square block rounded-full shadow-md ${isActive ? 'bg-cp-primary translate-x-6' : 'bg-slate-400'}`}></span>
    </div>
  )
}
