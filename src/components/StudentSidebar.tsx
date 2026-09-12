import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  BrainCircuit, 
  Printer, 
  Camera, 
  GraduationCap, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon
} from 'lucide-react';
import { Student } from '../types';

export type PortalTab = 'overview' | 'ledger' | 'audit' | 'analytics' | 'advisory';

interface StudentSidebarProps {
  activeTab: PortalTab;
  setActiveTab: (tab: PortalTab) => void;
  student: Student;
  profilePhoto?: string;
  cgpa: string;
  totalCredits: number;
  totalCoursesCount: number;
  degreeProgressPercent: number;
  academicStanding: {
    status: string;
    badgeClass: string;
  };
  availableSemesters?: number[];
  selectedSemester?: number | 'all';
  onSelectSemester?: (sem: number | 'all') => void;
  onOpenAiAdvisor: () => void;
  onOpenPrintTranscript: (semester?: number | 'all') => void;
  onOpenPhotoModal: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  activeTab,
  setActiveTab,
  student,
  profilePhoto,
  cgpa,
  totalCredits,
  totalCoursesCount,
  degreeProgressPercent,
  academicStanding,
  availableSemesters,
  selectedSemester,
  onSelectSemester,
  onOpenAiAdvisor,
  onOpenPrintTranscript,
  onOpenPhotoModal,
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
  isDarkMode,
  setIsDarkMode,
}) => {
  const navItems = [
    {
      id: 'overview' as PortalTab,
      label: 'Academic Overview',
      shortLabel: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      description: 'Summary dashboard & key metrics'
    },
    {
      id: 'ledger' as PortalTab,
      label: 'Examination Ledger',
      shortLabel: 'Ledger',
      icon: FileText,
      badge: `${totalCoursesCount}`,
      description: 'Course marks, grades & quality points'
    },
    {
      id: 'audit' as PortalTab,
      label: 'Degree Audit',
      shortLabel: 'Audit',
      icon: ShieldCheck,
      badge: `${degreeProgressPercent}%`,
      description: 'Graduation progress & requirement checklist'
    },
    {
      id: 'analytics' as PortalTab,
      label: 'Performance Analytics',
      shortLabel: 'Analytics',
      icon: TrendingUp,
      badge: null,
      description: 'CGPA trajectory & grade distribution'
    },
    {
      id: 'advisory' as PortalTab,
      label: 'Advisory & AI Counselor',
      shortLabel: 'Advisory',
      icon: BrainCircuit,
      badge: 'AI 2.5',
      badgeClass: 'bg-indigo-100 text-indigo-700 font-bold',
      description: 'Faculty office & personalized recommendations'
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="student-app-sidebar"
        className={`fixed lg:sticky top-0 lg:top-18 z-50 lg:z-30 h-screen lg:h-[calc(100vh-4.5rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out flex flex-col justify-between shrink-0 shadow-xl lg:shadow-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'w-72 max-w-[85vw] sm:w-80 lg:w-68'}`}
      >
        {/* Top Header / Portal Branding */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'lg:justify-center w-full' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight block">Student Console</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Degree Candidate Portal</span>
                </div>
              )}
            </div>

            {/* Close on Mobile */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Mini Metric Strip (when not collapsed) */}
          {!isCollapsed && (
            <div className="mt-4 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block">Cumulative GPA</span>
                <span className="text-base font-black text-slate-900 dark:text-slate-100 dark:text-white tracking-tight">{cgpa}</span>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block">Degree Units</span>
                <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">{totalCredits} / 120</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace Navigation
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group text-left ${
                  isActive
                    ? 'bg-slate-900 dark:bg-indigo-500/20 text-white dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 dark:hover:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800/80'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-indigo-400 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:text-slate-300 dark:group-hover:text-slate-300'
                }`} />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${
                        item.badgeClass || (isActive ? 'bg-white dark:bg-slate-900/20 dark:bg-indigo-500/30 text-white dark:text-indigo-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400')
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {/* Semester Navigator Section */}
          {!isCollapsed && onSelectSemester && (
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Semester Navigator
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  Default: Sem {student.semester}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 px-2">
                <button
                  type="button"
                  onClick={() => onSelectSemester('all')}
                  className={`py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all text-center ${
                    selectedSemester === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                  title="View all semesters"
                >
                  All
                </button>
                {((availableSemesters && availableSemesters.length > 0)
                  ? Array.from(new Set([...availableSemesters, student.semester])).sort((a, b) => a - b)
                  : [1, 2, 3]
                ).map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => onSelectSemester(sem)}
                    className={`py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all text-center relative ${
                      selectedSemester === sem
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                    title={`View Semester ${sem}${sem === student.semester ? ' (Account Enrolled Term)' : ''}`}
                  >
                    Sem {sem}
                    {sem === student.semester && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tools Section */}
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
            {!isCollapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Official Utilities
              </div>
            )}

            <button
              id="sidebar-btn-print-transcript"
              onClick={() => {
                onOpenPrintTranscript(selectedSemester);
                setIsMobileOpen(false);
              }}
              title="Print Official Transcript"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${
                isCollapsed ? 'justify-center px-2' : ''
              }`}
            >
              <Printer className="w-4 h-4 text-slate-400 shrink-0" />
              {!isCollapsed && <span>Print Transcript</span>}
            </button>

            <button
              id="sidebar-btn-ai-counselor"
              onClick={() => {
                onOpenAiAdvisor();
                setIsMobileOpen(false);
              }}
              title="Launch AI Academic Counselor"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-900/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-800/60 transition-all mt-1 ${
                isCollapsed ? 'justify-center px-2' : ''
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-semibold">AI Counselor</span>
                  <span className="text-[10px] bg-indigo-200/70 dark:bg-indigo-800/70 text-indigo-800 dark:text-indigo-200 font-bold px-1.5 py-0.2 rounded">
                    Ask
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Footer: Student Profile Tag */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center justify-between mb-3">
            {!isCollapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Appearance
              </span>
            )}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div 
              onClick={onOpenPhotoModal}
              className="relative cursor-pointer shrink-0 group"
              title="Update profile photo"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden">
                {profilePhoto ? (
                  <img src={profilePhoto} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  student.name.charAt(0)
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{student.name}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">{student.student_id}</span>
                  <span>•</span>
                  <span>Sem {student.semester}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
