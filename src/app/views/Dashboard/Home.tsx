"use client"

import { useSelector } from "react-redux"
import { useEffect } from "react"
import { RootState } from "@/app/store"
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
        <h3 className="text-xl font-bold">Mis empresas asignadas</h3>

        <table className="w-full mt-4 text-slate-300 bg-gray-800">
          <thead className="text-slate-200 bg-gray-900">
            <tr className="">
              <th className="p-2 py-4 uppercase text-sm text-left">Id</th>
              <th className="p-2 py-4 uppercase text-sm text-left">Nombre empresa</th>
              <th className="p-2 py-4 uppercase text-sm text-left">Contacto</th>
              <th className="p-2 py-4 uppercase text-sm text-left">Servicios activos</th>
              <th className="p-2 py-4 uppercase text-sm text-left">Última modificación</th>
            </tr>
          </thead>
          <tbody>
              <tr className="bg-gray-700">
                <td className="p-2 py-4 text-sm text-left">1</td>
                <td className="p-2 py-4 text-sm text-left">Sancho BBDO</td>
                <td className="p-2 py-4 text-sm text-left">Juan Pérez</td>
                <td className="p-2 py-4 text-sm text-left">
                  <a className="underline text-cp-primary" href="">Servicio BBDO 1</a>, {" "}
                  <a className="underline text-cp-primary" href="">Servicio BBDO 2</a>
                </td>
                <td className="p-2 py-4 text-sm text-left">1</td>
              </tr>

              <tr className="">
                <td className="p-2 py-4 text-sm text-left">1</td>
                <td className="p-2 py-4 text-sm text-left">Sancho BBDO</td>
                <td className="p-2 py-4 text-sm text-left">Juan Pérez</td>
                <td className="p-2 py-4 text-sm text-left">
                  <a className="underline text-cp-primary" href="">Servicio BBDO 1</a>, {" "}
                  <a className="underline text-cp-primary" href="">Servicio BBDO 2</a>
                </td>
                <td className="p-2 py-4 text-sm text-left">1</td>
              </tr>

              <tr className="bg-gray-700">
                <td className="p-2 py-4 text-sm text-left">1</td>
                <td className="p-2 py-4 text-sm text-left">Sancho BBDO</td>
                <td className="p-2 py-4 text-sm text-left">Juan Pérez</td>
                <td className="p-2 py-4 text-sm text-left">
                  <a className="underline text-cp-primary" href="">Servicio BBDO 1</a>, {" "}
                  <a className="underline text-cp-primary" href="">Servicio BBDO 2</a>
                </td>
                <td className="p-2 py-4 text-sm text-left">1</td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
