import React from 'react';
import { PortalTab } from '../StudentSidebar';
import { Skeleton, SkeletonCard, SkeletonTableRow } from './SkeletonBase';

interface StudentPortalSkeletonProps {
  activeTab: PortalTab;
}

export const StudentPortalSkeleton: React.FC<StudentPortalSkeletonProps> = ({ activeTab }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200" aria-label="Loading student portal content">
      {/* 1. OVERVIEW PAGE SKELETON */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome & Profile Header Banner */}
          <SkeletonCard className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-5">
                <Skeleton variant="circular" className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 sm:h-7 w-48 sm:w-64" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-5 w-32 rounded-md" />
                    <Skeleton className="h-5 w-36 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <Skeleton className="h-10 w-28 rounded-xl" />
                <Skeleton className="h-10 w-36 rounded-xl" />
                <Skeleton className="h-10 w-28 rounded-xl" />
              </div>
            </div>
          </SkeletonCard>

          {/* 4 Academic KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton variant="rounded" className="w-8 h-8 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-4/5" />
              </SkeletonCard>
            ))}
          </div>

          {/* 2-Column Section: Degree Progress & Recent Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SkeletonCard className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3.5 w-64" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3.5 w-16" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {[1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2"
                    >
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  ))}
                </div>
              </SkeletonCard>
            </div>

            <div>
              <SkeletonCard className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-7 w-12 rounded-lg" />
                    </div>
                  ))}
                </div>
              </SkeletonCard>
            </div>
          </div>
        </div>
      )}

      {/* 2. LEDGER PAGE SKELETON */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          {/* Header Card */}
          <SkeletonCard className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton variant="rounded" className="w-9 h-9 rounded-xl" />
                  <Skeleton className="h-7 w-64" />
                </div>
                <Skeleton className="h-3.5 w-80 max-w-full" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-24 rounded-xl" />
                <Skeleton className="h-9 w-44 rounded-xl" />
              </div>
            </div>

            {/* 4 Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1.5"
                >
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Table Container */}
          <SkeletonCard className="p-0 overflow-hidden">
            {/* Toolbar Filters */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                {[1, 2, 3, 4, 5].map((pill) => (
                  <Skeleton key={pill} className="h-8 w-16 rounded-xl shrink-0" />
                ))}
              </div>
              <Skeleton className="h-9 w-full sm:w-56 rounded-xl" />
            </div>

            {/* Table Rows */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    {['Course Code', 'Title', 'Units', 'Score', 'Grade', 'Point', 'Status'].map((h, i) => (
                      <th key={i} className="px-6 py-4">
                        <Skeleton className="h-3 w-16" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6].map((row) => (
                    <SkeletonTableRow key={row} columns={7} />
                  ))}
                </tbody>
              </table>
            </div>
          </SkeletonCard>
        </div>
      )}

      {/* 3. DEGREE AUDIT PAGE SKELETON */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <SkeletonCard className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-3.5 w-72" />
              </div>
              <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full rounded-full" />
            </div>
          </SkeletonCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((card) => (
              <SkeletonCard key={card} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="space-y-2 pt-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    >
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                  ))}
                </div>
              </SkeletonCard>
            ))}
          </div>
        </div>
      )}

      {/* 4. ANALYTICS PAGE SKELETON */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <SkeletonCard className="p-6 sm:p-8">
            <div className="space-y-2 pb-6 border-b border-slate-100 dark:border-slate-800">
              <Skeleton className="h-7 w-60" />
              <Skeleton className="h-3.5 w-80 max-w-full" />
            </div>
            {/* Pulsing Chart Simulation */}
            <div className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="h-64 sm:h-80 w-full rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-end p-6 gap-6">
                {[40, 65, 55, 80, 70, 90, 85].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <Skeleton
                      className="w-full rounded-xl"
                      style={{ height: `${h}%` } as React.CSSProperties}
                    />
                    <Skeleton className="h-3 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </SkeletonCard>

          {/* Grade Distribution Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} className="p-4 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-2 w-full rounded-full" />
              </SkeletonCard>
            ))}
          </div>
        </div>
      )}

      {/* 5. ADVISORY PAGE SKELETON */}
      {activeTab === 'advisory' && (
        <div className="space-y-6">
          <SkeletonCard className="p-6 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <Skeleton variant="circular" className="w-14 h-14 shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-3.5 w-64" />
              </div>
            </div>

            {/* Chat message bubbles */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2 max-w-xl">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/40 space-y-2 max-w-md ml-auto">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 ml-auto" />
              </div>
            </div>

            {/* Prompt suggestions */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[1, 2, 3].map((p) => (
                <Skeleton key={p} className="h-8 w-48 rounded-xl" />
              ))}
            </div>

            {/* Input box */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </SkeletonCard>
        </div>
      )}
    </div>
  );
};
