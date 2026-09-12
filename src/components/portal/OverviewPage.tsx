import React from 'react';
import { 
  Award, 
  BookOpen, 
  TrendingUp, 
  BrainCircuit, 
  Printer, 
  Camera, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  ShieldCheck, 
  BarChart3, 
  Building2, 
  Calendar,
  Sparkles,
  ArrowUpRight,
  GraduationCap,
  Clock
} from 'lucide-react';
import { Student, Course, Result } from '../../types';
import { PortalTab } from '../StudentSidebar';

interface OverviewPageProps {
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
  latestSem: number;
  latestSGPA: string;
  profilePhoto?: string;
  setActiveTab: (tab: PortalTab) => void;
  onOpenAiAdvisor: () => void;
  onOpenPrintTranscript: () => void;
  onOpenPhotoModal: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
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
  latestSem,
  latestSGPA,
  profilePhoto,
  setActiveTab,
  onOpenAiAdvisor,
  onOpenPrintTranscript,
  onOpenPhotoModal,
}) => {
  const studentResults = results.filter(r => r.student_id === student.student_id);
  const latestResults = studentResults.filter(r => r.semester === latestSem).slice(0, 3);
  const remainingCredits = Math.max(0, degreeRequiredCredits - totalCreditsEarned);

  // Recent grades helper
  const getGradeBadge = (grade: string) => {
    const g = grade.toUpperCase();
    if (g.startsWith('A')) return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    if (g.startsWith('B')) return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    if (g.startsWith('C')) return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* 1. COMPACT STUDENT WELCOME & IDENTITY BANNER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            {/* Avatar & Key Profile Identity */}
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-5">
              <div 
                onClick={onOpenPhotoModal}
                className="relative group cursor-pointer shrink-0 mt-0.5 sm:mt-0"
                title="Click to update profile photo"
              >
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-md shadow-indigo-100 dark:shadow-none overflow-hidden ring-2 sm:ring-3 ring-slate-100 dark:ring-slate-800">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    student.name.charAt(0)
                  )}
                </div>
                <div className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center" title="Active Enrollment">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                    {student.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 whitespace-nowrap">
                    Semester {student.semester}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1 whitespace-nowrap ${standingInfo.badgeClass}`}>
                    <Award className="w-3 h-3" />
                    {standingInfo.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{student.student_id}</span>
                  <span>•</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">B.Sc. {student.department}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-slate-500 dark:text-slate-400">{student.email}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
              <button
                id="btn-overview-ask-ai"
                onClick={onOpenAiAdvisor}
                className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-xs transition-all text-xs sm:text-sm min-h-[42px]"
              >
                <BrainCircuit className="w-4 h-4 shrink-0" />
                <span>Ask AI Advisor</span>
              </button>

              <button
                id="btn-overview-print"
                onClick={onOpenPrintTranscript}
                className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-all text-xs sm:text-sm min-h-[42px]"
              >
                <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                <span>Transcript</span>
              </button>
            </div>
          </div>

          {/* STREAMLINED ESSENTIAL METRICS STRIP (3 Clean Metrics, No Card Clutter) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Cumulative CGPA</span>
                <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{cgpaDisplay} <span className="text-xs font-normal text-slate-400">/ 4.00</span></span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {honorsClass}
              </span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Degree Completion</span>
                <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{totalCreditsEarned} <span className="text-xs font-normal text-slate-400">/ {degreeRequiredCredits} Units</span></span>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                {degreeProgressPercent}% Done
              </span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Latest Term SGPA</span>
                <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{latestSGPA} <span className="text-xs font-normal text-slate-400">(Sem {latestSem})</span></span>
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                Active Term
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED PORTAL GATEWAYS (Connecting to the other Sidebar Pages) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Academic Portal Portfolios</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Access full ledger reports, graduation audits, analytics, and faculty advisory</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* GATEWAY 1: EXAMINATION LEDGER */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 flex flex-col justify-between hover:border-indigo-200 hover:shadow-md transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900">
                  {studentResults.length} Completed Courses
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                Examination Ledger
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Detailed verified course results, letter marks, quality points, and printable grade records.
              </p>

              {/* Mini preview list of recent courses */}
              <div className="space-y-1.5 mb-4">
                {latestResults.map(r => {
                  const co = courses.find(c => c.course_code === r.course_code);
                  return (
                    <div key={r.id} className="p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="truncate mr-2 min-w-0">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 mr-1.5">{r.course_code}</span>
                        <span className="text-slate-600 dark:text-slate-400 truncate">{co ? co.course_name : ''}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border shrink-0 ${getGradeBadge(r.grade)}`}>
                        {r.grade}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              id="btn-gateway-ledger"
              onClick={() => setActiveTab('ledger')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn min-h-[42px]"
            >
              <span>Open Examination Ledger</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* GATEWAY 2: DEGREE AUDIT */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 flex flex-col justify-between hover:border-indigo-200 hover:shadow-md transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900">
                  {degreeProgressPercent}% Completed
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                Degree Audit & Graduation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Curriculum credit verification, general education breadth, and conferment requirements.
              </p>

              {/* Progress bar */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 mb-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Undergraduate Pathway</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{totalCreditsEarned} / {degreeRequiredCredits} Units</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${degreeProgressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <span>Minimum 2.00 CGPA (Passed: {cgpaDisplay})</span>
                  <span>{remainingCredits} units remaining</span>
                </div>
              </div>
            </div>

            <button
              id="btn-gateway-audit"
              onClick={() => setActiveTab('audit')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn min-h-[42px]"
            >
              <span>View Degree Audit Report</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* GATEWAY 3: PERFORMANCE ANALYTICS */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 flex flex-col justify-between hover:border-indigo-200 hover:shadow-md transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 px-2.5 py-1 rounded-lg border border-violet-100 dark:border-violet-900">
                  Ascending Trajectory
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 transition-colors">
                Performance Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Semester-by-semester GPA trends, letter grade distribution curves, and academic growth indices.
              </p>

              {/* Highlight metrics */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Exemplary Grades (A)</span>
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5 block">
                    {studentResults.filter(r => r.grade.startsWith('A')).length} Courses
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Honors Quality Rate</span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                    {Math.round((studentResults.filter(r => r.grade.startsWith('A')).length / (studentResults.length || 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <button
              id="btn-gateway-analytics"
              onClick={() => setActiveTab('analytics')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-violet-600 dark:hover:bg-violet-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn min-h-[42px]"
            >
              <span>Explore Performance Analytics</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* GATEWAY 4: ADVISORY & AI COUNSELOR */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 flex flex-col justify-between hover:border-indigo-200 hover:shadow-md transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-900">
                  Faculty Assigned
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                Academic Advisory & AI
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Consult with Prof. R. Henderson, Ph.D. or engage the intelligent 24/7 AI Academic Counselor.
              </p>

              {/* Advisor Card snippet */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 mb-4 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Faculty Advisor:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Prof. R. Henderson</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Advisory Office:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Turing Hall, Suite 402</span>
                </div>
              </div>
            </div>

            <button
              id="btn-gateway-advisory"
              onClick={() => setActiveTab('advisory')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-amber-600 dark:hover:bg-amber-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn min-h-[42px]"
            >
              <span>Consult Advisor & AI Counselor</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. ACADEMIC ANNOUNCEMENTS / ATTESTATION NOTICES */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Academic Records Notices</h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Current Term</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/50">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 block mb-0.5">Digital Transcript Attestation Window</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Official academic transcript attestation is now open for scholarship, employer, and graduate program submissions. Standard turnaround is 48 business hours.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Upcoming Add / Drop & Registration Deadlines</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Course module change requests for Semester 5 will open on schedule. Please verify curriculum pre-requisites via your Degree Audit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
