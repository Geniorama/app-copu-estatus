import CompanyCardSkeleton from "./CompanyCardSkeleton";

interface CompaniesSkeletonProps {
  mainCompaniesCount?: number;
  subCompaniesCount?: number;
}

export default function CompaniesSkeleton({ 
  mainCompaniesCount = 3, 
  subCompaniesCount = 2 
}: CompaniesSkeletonProps) {
  return (
    <div>
      {/* Skeleton para el título */}
      <div className="mb-5">
        <div className="h-8 bg-slate-700 rounded w-48 animate-pulse"></div>
      </div>

      {/* Skeleton para las compañías principales */}
      <div className="flex flex-wrap flex-col lg:flex-row gap-4">
        {Array.from({ length: mainCompaniesCount }).map((_, index) => (
          <CompanyCardSkeleton key={index} />
        ))}
      </div>

      {/* Skeleton para las subcompañías (si existen) */}
      {subCompaniesCount > 0 && (
        <div className="mb-5 mt-8">
          <div>
            {/* Skeleton para el título de subcompañías */}
            <div className="h-6 bg-slate-700 rounded w-32 mb-4 animate-pulse"></div>
            
            <div className="flex mt-4 flex-wrap flex-col lg:flex-row gap-4">
              {Array.from({ length: subCompaniesCount }).map((_, index) => (
                <CompanyCardSkeleton key={`sub-${index}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skeleton para el texto de contacto */}
      <div className="mt-5">
        <div className="h-4 bg-slate-700 rounded w-96 animate-pulse"></div>
      </div>
    </div>
  );
} 