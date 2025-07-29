export default function CompanyCardSkeleton() {
  return (
    <div className="bg-slate-800 rounded-md p-5 flex gap-4 items-center animate-pulse">
      {/* Skeleton para el logo */}
      <div className="w-20 aspect-square bg-slate-700 rounded-full flex justify-center items-center">
        <div className="w-8 h-8 bg-slate-600 rounded"></div>
      </div>

      {/* Skeleton para el contenido */}
      <div className="flex-1">
        {/* Skeleton para el badge (si existe) */}
        <div className="h-4 bg-slate-700 rounded w-16 mb-2"></div>
        
        {/* Skeleton para el nombre de la compañía */}
        <div className="h-8 bg-slate-700 rounded w-48 mb-2"></div>
        
        {/* Skeleton para el ejecutivo */}
        <div className="h-4 bg-slate-700 rounded w-32"></div>
      </div>
    </div>
  );
} 