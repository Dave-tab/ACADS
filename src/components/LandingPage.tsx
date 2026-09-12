import React from 'react';
import { ShieldCheck, User, Award, BookOpen, BarChart3, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Role } from '../types';

interface LandingPageProps {
  setCurrentRole: (role: Role) => void;
  onOpenGradingScale: () => void;
  onPreviewDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentRole, onOpenGradingScale, onPreviewDemo }) => {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full text-center my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          ACADS &bull; Academic Performance & Grade Management Portal
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-6 leading-[1.1]">
          ACADS <br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Student Result Management
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          A comprehensive institutional platform for securely managing student grades, calculating semester GPA and cumulative CGPA, and tracking academic progress in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            id="landing-btn-admin-login"
            onClick={() => setCurrentRole('admin_login')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-5 h-5" />
            Admin Dashboard Login
            <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
          </button>

          <button
            id="landing-btn-student-login"
            onClick={() => setCurrentRole('student_login')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-indigo-200 dark:border-slate-800 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <User className="w-5 h-5" />
            Student Portal Login
            <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
          </button>
        </div>

        {onPreviewDemo && (
          <div className="mb-14">
            <button
              id="btn-quick-preview-portal"
              onClick={onPreviewDemo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-slate-800/80 hover:bg-indigo-100 dark:hover:bg-slate-800 border border-indigo-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
              Preview Live Student Portal UI (Alex Morgan &bull; 2024235020409)
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        )}

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Admin Dashboard</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Upload and manage student results, student records, and courses securely.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Student Portal</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Students can log in with their Matric Number (e.g. 2024235020409) to review grades, GPA, and transcripts.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">GPA & CGPA Engine</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Automatic grade calculation and weighted cumulative GPA across all semesters.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Secure Access</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Role-based authentication with session protection and input validation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
