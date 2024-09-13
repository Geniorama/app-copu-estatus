import Profile from "@/app/utilities/ui/Profile"
import TitleSection from "@/app/utilities/ui/TitleSection"

export default function NavBar() {
  return (
    <div className=' p-3 flex justify-between items-center border-b-slate-700 border border-black'>
      <TitleSection title="Dashboard" />
      <div className="flex items-center gap-3">
        <span className="text-sm">Venus María</span>
        <Profile URL="" />
      </div>
    </div>
  )
}
