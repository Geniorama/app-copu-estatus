"use client"

import { useSelector } from "react-redux"
import { useEffect } from "react"
import { RootState } from "@/app/store"
import TitleSection from "@/app/utilities/ui/TitleSection"

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
    </div>
  )
}
