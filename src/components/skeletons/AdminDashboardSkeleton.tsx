import React from 'react';
import { AdminTab } from '../../types';
import { Skeleton, SkeletonCard, SkeletonTableRow } from './SkeletonBase';

interface AdminDashboardSkeletonProps {
  activeTab: AdminTab;
}

export const AdminDashboardSkeleton: React.FC<AdminDashboardSkeletonProps> = ({ activeTab }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200" aria-label="Loading admin dashboard content">
      {/* 1. OVERVIEW TAB SKELETON */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Stats KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs flex items-center justify-between"
              >
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton variant="rounded" className="w-14 h-14 rounded-2xl" />
              </div>
            ))}
          </div>

          {/* Quick Search & Student Grade Lookup Card */}
          <SkeletonCard className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-72" />
              </div>
              <Skeleton className="h-6 w-32 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-full rounded-2xl" />
          </SkeletonCard>

          {/* 2-Column Section: Recent Results Ledger & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SkeletonCard className="p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-3.5 w-60" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4].map((idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-7 w-12 rounded-lg" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </SkeletonCard>
            </div>

            <div>
              <SkeletonCard className="space-y-4">
                <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-3.5 w-48" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((idx) => (
                    <Skeleton key={idx} className="h-12 w-full rounded-xl" />
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </SkeletonCard>
            </div>
          </div>
        </div>
      )}

      {/* 2. MANAGE STUDENTS TAB SKELETON */}
      {activeTab === 'manage_students' && (
        <div className="space-y-8">
          {/* Register New Student Form Card */}
          <SkeletonCard className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-3.5 w-64" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Skeleton className="h-11 w-40 rounded-xl" />
            </div>
          </SkeletonCard>

          {/* Students Directory & Filter */}
          <SkeletonCard className="p-0 overflow-hidden space-y-0">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3.5 w-56" />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
                <Skeleton className="h-10 w-36 rounded-xl shrink-0" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    {['Student', 'Matric / ID', 'Department', 'Semester', 'CGPA', 'Actions'].map((col, idx) => (
                      <th key={idx} className="px-6 py-4">
                        <Skeleton className="h-3 w-16" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row} className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton variant="circular" className="w-9 h-9" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-6 w-28 rounded-md" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-6 w-14 rounded-md" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Skeleton className="h-8 w-20 ml-auto rounded-lg" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SkeletonCard>
        </div>
      )}

      {/* 3. MANAGE COURSES TAB SKELETON */}
      {activeTab === 'manage_courses' && (
        <div className="space-y-8">
          <SkeletonCard className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-3.5 w-60" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Skeleton className="h-11 w-36 rounded-xl" />
            </div>
          </SkeletonCard>

          <SkeletonCard className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3.5 w-52" />
              </div>
              <Skeleton className="h-10 w-48 rounded-xl" />
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-4/5" />
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>
      )}

      {/* 4. UPLOAD RESULT TAB SKELETON */}
      {activeTab === 'upload_result' && (
        <SkeletonCard className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3.5 w-64" />
            </div>
          </div>

          <div className="space-y-5">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-8 w-16 rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </SkeletonCard>
      )}

      {/* 5. VIEW RESULTS TAB SKELETON */}
      {activeTab === 'view_results' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <SkeletonCard className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </SkeletonCard>

          {/* Results Table */}
          <SkeletonCard className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-3.5 w-60" />
              </div>
              <Skeleton className="h-6 w-24 rounded-lg" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    {['Student ID', 'Course Code', 'Marks', 'Grade', 'Points', 'Semester', 'Year'].map((col, idx) => (
                      <th key={idx} className="px-6 py-4">
                        <Skeleton className="h-3 w-16" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <SkeletonTableRow key={i} columns={7} />
                  ))}
                </tbody>
              </table>
            </div>
          </SkeletonCard>
        </div>
      )}
    </div>
  );
};
