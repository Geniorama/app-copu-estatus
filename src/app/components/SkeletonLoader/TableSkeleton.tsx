interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 3, columns = 3 }: TableSkeletonProps) {
  return (
    <div className="animate-pulse">
      {/* Header de la tabla */}
      <div className="flex gap-4 mb-4">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="h-4 bg-slate-700 rounded flex-1"></div>
        ))}
      </div>
      
      {/* Filas de la tabla */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-slate-700 rounded flex-1"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 