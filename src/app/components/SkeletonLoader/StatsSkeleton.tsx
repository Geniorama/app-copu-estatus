interface StatsSkeletonProps {
  count?: number;
}

export default function StatsSkeleton({ count = 4 }: StatsSkeletonProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-5 mt-5">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-full lg:w-1/4 bg-slate-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2 animate-pulse">
          <div className="h-4 bg-slate-600 rounded w-20"></div>
          <div className="h-8 bg-slate-600 rounded w-16"></div>
          <div className="h-3 bg-slate-600 rounded w-24"></div>
        </div>
      ))}
    </div>
  );
} 