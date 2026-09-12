import React from 'react';
import { 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  Award, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Printer, 
  BrainCircuit,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Student, Course, Result } from '../../types';

interface DegreeAuditPageProps {
  student: Student;
  courses: Course[];
  results: Result[];
  cgpaDisplay: string;
  cgpaNumber: number;
  totalCreditsEarned: number;
  degreeRequiredCredits: number;
  degreeProgressPercent: number;
  standingInfo: {
    status: string;
    badgeClass: string;
  };
  honorsClass: string;
  onOpenAiAdvisor: () => void;
  onOpenPrintTranscript: () => void;
}

export const DegreeAuditPage: React.FC<DegreeAuditPageProps> = ({
  student,
  courses,
  results,
  cgpaDisplay,
  cgpaNumber,
  totalCreditsEarned,
  degreeRequiredCredits,
  degreeProgressPercent,
  standingInfo,
  honorsClass,
  onOpenAiAdvisor,
  onOpenPrintTranscript,
}) => {
  const remainingCredits = Math.max(0, degreeRequiredCredits - totalCreditsEarned);

  // Curriculum breakdown
  const coreTotal = 72;
  const coreEarned = Math.min(coreTotal, Math.round(totalCreditsEarned * 0.65));
  const corePercent = Math.min(100, Math.round((coreEarned / coreTotal) * 100));

  const genEdTotal = 30;
  const genEdEarned = Math.min(genEdTotal, Math.round(totalCreditsEarned * 0.25));
  const genEdPercent = Math.min(100, Math.round((genEdEarned / genEdTotal) * 100));

  const electiveTotal = 18;
  const electiveEarned = Math.min(electiveTotal, Math.max(0, totalCreditsEarned - coreEarned - genEdEarned));
  const electivePercent = Math.min(100, Math.round((electiveEarned / electiveTotal) * 100));

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">Degree Audit & Graduation</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Official institutional curriculum audit for Bachelor of Science in {student.department}.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenAiAdvisor}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors min-h-[40px]"
            >
              <BrainCircuit className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Audit Advisor</span>
            </button>
            <button
              onClick={onOpenPrintTranscript}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 transition-colors min-h-[40px]"
            >
              <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
              <span>Print Audit</span>
            </button>
          </div>
        </div>

        {/* Big Overall Progress Banner */}
        <div className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Degree Requirement Status</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{totalCreditsEarned}</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-400">/ {degreeRequiredCredits} Required Degree Units</span>
              </div>
            </div>
            <div className="text-left sm:text-right mt-1 sm:mt-0">
              <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 block">{degreeProgressPercent}% Completed</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{remainingCredits} Units Remaining</span>
            </div>
          </div>

          {/* Large Multi-stage Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-full transition-all duration-700" 
              style={{ width: `${degreeProgressPercent}%` }}
              title="Completed Units"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            <span>Matriculation (Sem 1)</span>
            <span>Conferment Target: 2027</span>
          </div>
        </div>
      </div>

      {/* Curriculum Division Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Core Requirements */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Major Curriculum</span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900">
                {corePercent}% Complete
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Major Core Courses</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Foundational and advanced computer science domain requirements.
            </p>

            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Completed Credits:</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{coreEarned} / {coreTotal} Units</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${corePercent}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Core Status:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">On Track</span>
          </div>
        </div>

        {/* General Education */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">General Education</span>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900">
                {genEdPercent}% Complete
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Breadth & Humanities</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Natural sciences, writing, ethics, and interdisciplinary breadth.
            </p>

            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Completed Credits:</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{genEdEarned} / {genEdTotal} Units</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-violet-600 h-full rounded-full" style={{ width: `${genEdPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
            <span>GenEd Status:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Satisfied</span>
          </div>
        </div>

        {/* Electives & Specialization */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Track Electives</span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-900">
                {electivePercent}% Complete
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Concentration Electives</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Specialized focus areas (Machine Learning, Cloud Systems, Security).
            </p>

            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Completed Credits:</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{electiveEarned} / {electiveTotal} Units</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${electivePercent}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Electives Status:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">6 Units Next Sem</span>
          </div>
        </div>
      </div>

      {/* Graduation Criteria & Statutory Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 lg:p-8">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          Statutory Degree Conferment Requirements
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 sm:mb-6">
          Institutional regulations required for graduation approval and parchment release.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm block">Minimum Cumulative GPA ≥ 2.00</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current student CGPA is <strong className="text-emerald-700 font-mono">{cgpaDisplay}</strong> ({honorsClass}). Exceeds graduation honors threshold.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm block">Institutional Residency Benchmark</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Satisfied requirement for full-time on-campus residency of at least 4 consecutive academic semesters.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm block">Official Academic Standing</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enrolled in <strong className="text-slate-800 font-semibold">{standingInfo.status}</strong> with zero academic probations or conduct violations.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm block">Senior Capstone / Thesis (Pending Enrollment)</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Requires enrollment in CS-490 Capstone Project during final year of study (Year 4).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
