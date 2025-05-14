import React from 'react';

interface SkeletonLoaderProps {
  type?: 'table' | 'card' | 'text';
  rows?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'table', 
  rows = 5,
  className = ''
}) => {
  if (type === 'table') {
    return (
      <div className={`animate-pulse ${className}`}>
        {/* Header skeleton */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        </div>
        {/* Rows skeleton */}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 py-3 border-b border-slate-700">
            <div className="h-10 w-10 bg-slate-700 rounded-full"></div>
            <div className="h-4 bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="h-32 bg-slate-700 rounded-lg mb-4"></div>
          <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-4 bg-slate-700 rounded mb-2"></div>
      ))}
    </div>
  );
};

export default SkeletonLoader; 