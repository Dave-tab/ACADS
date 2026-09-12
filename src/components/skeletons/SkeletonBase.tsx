import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rounded' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rounded',
  width,
  height,
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded-md h-4 my-1';
      case 'rectangular':
        return 'rounded-none';
      case 'rounded':
      default:
        return 'rounded-xl';
    }
  };

  const style: React.CSSProperties = {
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  return (
    <div
      style={style}
      aria-hidden="true"
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-800/70 transition-colors ${getVariantClass()} ${className}`}
    />
  );
};

export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}> = ({ lines = 2, className = '', lastLineWidth = 'w-3/5' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          variant="text"
          className={`h-3.5 ${idx === lines - 1 && lines > 1 ? lastLineWidth : 'w-full'}`}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className = '', children }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs ${className}`}
    >
      {children}
    </div>
  );
};

export const SkeletonTableRow: React.FC<{
  columns: number;
  className?: string;
}> = ({ columns, className = '' }) => {
  return (
    <tr className={`border-b border-slate-100 dark:border-slate-800/80 ${className}`}>
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="px-6 py-4">
          <Skeleton
            className={`h-4 ${
              idx === 0
                ? 'w-28'
                : idx === 1
                ? 'w-36'
                : idx === columns - 1
                ? 'w-20 ml-auto'
                : 'w-20'
            }`}
          />
        </td>
      ))}
    </tr>
  );
};
