export default function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Título */}
      <div className="h-8 bg-slate-700 rounded w-32 mb-5"></div>

      {/* Estadísticas totales */}
      <div className="flex flex-col lg:flex-row gap-5 mt-5">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="w-full lg:w-1/4 bg-slate-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
            <div className="h-4 bg-slate-600 rounded w-20"></div>
            <div className="h-8 bg-slate-600 rounded w-16"></div>
            <div className="h-3 bg-slate-600 rounded w-24"></div>
          </div>
        ))}
      </div>

      {/* Datos por compañía y contenidos recientes */}
      <div className="mt-5 flex flex-col lg:flex-row gap-5">
        {/* Datos por compañía */}
        <div className="w-full lg:w-1/2 bg-slate-900 rounded-lg p-4">
          <div className="h-6 bg-slate-700 rounded w-32 mb-4"></div>
          <div className="h-[300px] bg-slate-800 rounded"></div>
        </div>

        {/* Contenidos recientes */}
        <div className="w-full lg:w-1/2 bg-slate-900 rounded-lg p-4">
          <div className="h-6 bg-slate-700 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-3">
                <div className="h-4 bg-slate-700 rounded flex-1"></div>
                <div className="h-4 bg-slate-700 rounded w-20"></div>
                <div className="h-4 bg-slate-700 rounded w-12"></div>
              </div>
            ))}
          </div>
          <div className="h-4 bg-slate-700 rounded w-16 mx-auto mt-4"></div>
        </div>
      </div>

      {/* Sección inferior */}
      <div className="mt-5 flex flex-col lg:flex-row gap-5">
        {/* Contacto */}
        <div className="w-full lg:w-1/3 bg-slate-900 rounded-lg p-4">
          <div className="h-6 bg-slate-700 rounded w-20 mb-6"></div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 bg-slate-800 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-slate-700 rounded w-24"></div>
              <div className="h-3 bg-slate-700 rounded w-32"></div>
              <div className="h-4 bg-slate-700 rounded w-28"></div>
            </div>
          </div>
        </div>

        {/* Mis compañías */}
        <div className="w-full lg:w-1/3 bg-slate-900 rounded-lg p-4">
          <div className="h-6 bg-slate-700 rounded w-24 mb-5"></div>
          <div className="flex gap-3 justify-center">
            {[1, 2, 3].map((item) => (
              <div key={item} className="w-16 h-16 bg-slate-800 rounded"></div>
            ))}
          </div>
        </div>

        {/* Mis servicios */}
        <div className="w-full lg:w-1/3 bg-slate-900 rounded-lg p-4">
          <div className="h-6 bg-slate-700 rounded w-24 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-3">
                <div className="h-4 bg-slate-700 rounded flex-1"></div>
                <div className="h-4 bg-slate-700 rounded w-20"></div>
                <div className="h-4 bg-slate-700 rounded w-20"></div>
                <div className="h-4 bg-slate-700 rounded w-8"></div>
              </div>
            ))}
          </div>
          <div className="h-4 bg-slate-700 rounded w-16 mx-auto mt-4"></div>
        </div>
      </div>
    </div>
  );
} 