export default function CompanyDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header con botón de regreso */}
      <div className="mb-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-6 bg-slate-700 rounded w-32"></div>
        </div>
        <div className="h-8 bg-slate-700 rounded w-64"></div>
      </div>

      {/* Información de la compañía y estadísticas en 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Columna izquierda - Información de la compañía */}
        <div className="bg-slate-800 rounded-lg p-6">
          {/* Logo y nombre de la compañía */}
          <div className="flex items-center gap-0 mb-6">
            <div className="w-20 h-20 bg-slate-700 rounded-full"></div>
            <div className="ml-4">
              <div className="h-8 bg-slate-700 rounded w-48 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-32"></div>
            </div>
          </div>

          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-slate-700 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-700 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-slate-700 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha - Compañías relacionadas */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="h-6 bg-slate-700 rounded w-48 mb-4"></div>
          
          {/* Compañía Superior */}
          <div className="mb-6">
            <div className="h-4 bg-slate-700 rounded w-32 mb-3"></div>
            <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
              <div className="w-12 h-12 bg-slate-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-600 rounded w-32 mb-1"></div>
                <div className="h-3 bg-slate-600 rounded w-24"></div>
              </div>
            </div>
          </div>

          {/* Subcompañías */}
          <div>
            <div className="h-4 bg-slate-700 rounded w-24 mb-3"></div>
            <div className="space-y-2">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                  <div className="w-12 h-12 bg-slate-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-600 rounded w-28 mb-1"></div>
                    <div className="h-3 bg-slate-600 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas en una sola fila con 3 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-slate-800 p-6 rounded-lg text-center">
            <div className="w-12 h-12 bg-slate-700 rounded mx-auto mb-2"></div>
            <div className="h-6 bg-slate-700 rounded w-24 mx-auto mb-2"></div>
            <div className="h-10 bg-slate-700 rounded w-16 mx-auto mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-20 mx-auto"></div>
          </div>
        ))}
      </div>

      {/* Servicios */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 bg-slate-700 rounded w-48"></div>
          <div className="h-6 bg-slate-700 rounded w-20"></div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          {/* Header de la tabla */}
          <div className="grid grid-cols-8 gap-4 mb-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-4 bg-slate-700 rounded"></div>
            ))}
          </div>
          {/* Filas de la tabla */}
          {[...Array(3)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-8 gap-4 mb-3">
              {[...Array(8)].map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-slate-700 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Contenidos */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 bg-slate-700 rounded w-48"></div>
          <div className="h-6 bg-slate-700 rounded w-20"></div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          {/* Header de la tabla */}
          <div className="grid grid-cols-8 gap-4 mb-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-4 bg-slate-700 rounded"></div>
            ))}
          </div>
          {/* Filas de la tabla */}
          {[...Array(3)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-8 gap-4 mb-3">
              {[...Array(8)].map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-slate-700 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 