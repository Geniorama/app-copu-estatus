import TitleSection from "@/app/utilities/ui/TitleSection"

export default function NavBar() {
  return (
    <div className=' p-3 flex justify-between items-center border-b-slate-700 border border-black'>
        <TitleSection  title="Dashboard"/>
        <div className="flex items-center gap-3">
          <span className="text-sm">Venus María</span>
          <div className='w-10 h-10 bg-slate-800 rounded-full'>
          {/* Avatar */}
          </div>
        </div>
    </div>
  )
}
