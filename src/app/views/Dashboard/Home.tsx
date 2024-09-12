"use client"

import { useSelector } from "react-redux"
import { useEffect } from "react"
import { RootState } from "@/app/store"
import TitleSection from "@/app/utilities/ui/TitleSection"
import CardAction from "@/app/components/CardAction/CardAction"

export default function DashboardHome() {
  const {currentUser} = useSelector((state:RootState) => state.user)

  useEffect(() => {
    if(currentUser){
        console.log('Current user dashboard:',currentUser)
    }
  },[currentUser])

  return (
    <div>
      <TitleSection 
        title="Dashboard"
      />
      <hr className="my-4" />

      <div className="grid grid-cols-4 gap-5">
        <CardAction 
          title="Crear usuario"
          icon="user"
        />
        <CardAction 
          title="Crear empresa"
          icon="company"
        />
        <CardAction 
          title="Crear servicio"
          icon="service"
        />
        <CardAction 
          title="Crear contenido"
          icon="content"
        />
      </div>

      <div className="mt-8">
        <h3>Mis empresas asignadas</h3>
      </div>
    </div>
  )
}
