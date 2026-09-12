import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, RefreshCw, LayoutDashboard, FileText, ShieldCheck, TrendingUp, Building2 } from 'lucide-react';
import { Student, Course, Result } from '../types';
import { calculateCGPA, getHonorsClassification, getAcademicStanding } from '../data/mockData';
import { AiAdvisorModal } from './AiAdvisorModal';
import { PrintTranscriptModal } from './PrintTranscriptModal';
import { UpdateProfilePhotoModal } from './UpdateProfilePhotoModal';
import { StudentSidebar, PortalTab } from './StudentSidebar';
import { OverviewPage } from './portal/OverviewPage';
import { LedgerPage } from './portal/LedgerPage';
import { DegreeAuditPage } from './portal/DegreeAuditPage';
import { AnalyticsPage } from './portal/AnalyticsPage';
import { AdvisoryPage } from './portal/AdvisoryPage';
import { StudentPortalSkeleton } from './skeletons/StudentPortalSkeleton';

interface StudentPortalProps {
  student: Student;
  courses: Course[];
  results: Result[];
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  isLoading?: boolean;
  onRefresh?: () => Promise<void> | void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ 
  student, 
  courses, 
  results,
  isLoading = false,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<PortalTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [isPrintOpen, setIsPrintOpen] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [isLocalRefreshing, setIsLocalRefreshing] = useState(false);

  const isDataLoading = isLoading || isLocalRefreshing;

  const handleRefresh = async () => {
    setIsLocalRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }
    } finally {
      setIsLocalRefreshing(false);
    }
  };

  // Default semester is the one used during account creation (student.semester)
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>(student.semester);
  const [transcriptSemester, setTranscriptSemester] = useState<number | 'all'>(student.semester);

  const handleOpenPrintTranscript = (semester?: number | 'all') => {
    setTranscriptSemester(semester !== undefined ? semester : selectedSemester);
    setIsPrintOpen(true);
  };
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  const storageKey = `student_profile_photo_${student.student_id}`;
  const [profilePhoto, setProfilePhoto] = useState<string>(() => {
    return student.profile_photo || localStorage.getItem(storageKey) || '';
  });

  const handleSavePhoto = async (photoUrl: string) => {
    setProfilePhoto(photoUrl);
    localStorage.setItem(storageKey, photoUrl);
    try {
      await fetch(`/api/students/${student.student_id}/photo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_photo: photoUrl })
      });
    } catch (err) {
      console.error('Failed to update photo in backend:', err);
    }
  };

  const studentResults = results.filter(r => r.student_id === student.student_id);
  const cgpaNumber = Number(calculateCGPA(student.student_id, results, courses));
  const cgpaDisplay = cgpaNumber > 0 ? cgpaNumber.toFixed(2) : '0.00';

  // Total credits earned
  let totalCreditsEarned = 0;
  studentResults.forEach(r => {
    const co = courses.find(c => c.course_code === r.course_code);
    const cr = co ? co.credit_hours : 3;
    if (r.grade_point > 0) {
      totalCreditsEarned += cr;
    }
  });

  const degreeRequiredCredits = 120;
  const degreeProgressPercent = Math.min(100, Math.round((totalCreditsEarned / degreeRequiredCredits) * 100));

  // Available semesters
  const availableSemesters: number[] = Array.from(
    new Set<number>(studentResults.map(r => r.semester))
  ).sort((a: number, b: number) => a - b);

  // Latest semester SGPA
  const latestSem = availableSemesters.length > 0 ? Math.max(...availableSemesters) : student.semester;
  const latestSemResults = studentResults.filter(r => r.semester === latestSem);
  let latestSemPts = 0;
  let latestSemCreds = 0;
  latestSemResults.forEach(r => {
    const co = courses.find(c => c.course_code === r.course_code);
    const cr = co ? co.credit_hours : 3;
    latestSemPts += r.grade_point * cr;
    latestSemCreds += cr;
  });
  const latestSGPA = latestSemCreds > 0 ? (latestSemPts / latestSemCreds).toFixed(2) : '0.00';

  const standingInfo = getAcademicStanding(cgpaNumber);
  const honorsClass = getHonorsClassification(cgpaNumber);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-200">
      {/* Production Left Navigation Sidebar */}
      <StudentSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        profilePhoto={profilePhoto}
        cgpa={cgpaDisplay}
        totalCredits={totalCreditsEarned}
        totalCoursesCount={studentResults.length}
        degreeProgressPercent={degreeProgressPercent}
        academicStanding={standingInfo}
        availableSemesters={availableSemesters}
        selectedSemester={selectedSemester}
        onSelectSemester={setSelectedSemester}
        onOpenAiAdvisor={() => setIsAiOpen(true)}
        onOpenPrintTranscript={handleOpenPrintTranscript}
        onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        {/* Mobile Top Bar: Drawer Trigger, Sync & Quick CGPA */}
        <div className="lg:hidden flex items-center justify-between gap-2 pb-1">
          <button
            id="btn-toggle-mobile-sidebar"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold transition-colors shadow-2xs shrink-0"
            aria-label="Open portal console drawer"
          >
            <Menu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden xs:inline">Student</span> Console
          </button>
          
          <div className="flex items-center gap-2">
            <button
              id="btn-student-mobile-sync"
              onClick={handleRefresh}
              disabled={isDataLoading}
              title="Refresh academic data from server"
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDataLoading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900 whitespace-nowrap">
              CGPA: {cgpaDisplay}
            </span>
          </div>
        </div>

        {/* Mobile Balanced Tab Navigation Bar (Direct 1-tap switching without opening drawer) */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            id="btn-mobile-tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
          <button
            id="btn-mobile-tab-ledger"
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ledger'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ledger</span>
          </button>
          <button
            id="btn-mobile-tab-audit"
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit</span>
          </button>
          <button
            id="btn-mobile-tab-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
          <button
            id="btn-mobile-tab-advisory"
            onClick={() => setActiveTab('advisory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'advisory'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Advisory</span>
          </button>
        </div>

        {/* Desktop Top Sync Bar */}
        <div className="hidden lg:flex items-center justify-between pb-1 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
              {activeTab === 'overview' ? 'Academic Overview' : activeTab === 'ledger' ? 'Examination Ledger' : activeTab === 'audit' ? 'Degree Completion Audit' : activeTab === 'analytics' ? 'Performance Analytics' : 'Academic Advisory'}
            </span>
            <span>&bull;</span>
            <span>Session 2024-2025</span>
          </div>
          <button
            id="btn-student-desktop-sync"
            onClick={handleRefresh}
            disabled={isDataLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs shadow-2xs transition-colors disabled:opacity-60"
            title="Refresh student records and calculated standing"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDataLoading ? 'animate-spin text-indigo-600' : 'text-slate-500 dark:text-slate-400'}`} />
            <span>{isDataLoading ? 'Syncing...' : 'Sync Records'}</span>
          </button>
        </div>

        {/* ACTIVE PAGE CONTENT ROUTER OR SKELETON */}
        {isDataLoading ? (
          <StudentPortalSkeleton activeTab={activeTab} />
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewPage
                student={student}
                courses={courses}
                results={results}
                cgpaDisplay={cgpaDisplay}
                cgpaNumber={cgpaNumber}
                totalCreditsEarned={totalCreditsEarned}
                degreeRequiredCredits={degreeRequiredCredits}
                degreeProgressPercent={degreeProgressPercent}
                standingInfo={standingInfo}
                honorsClass={honorsClass}
                latestSem={latestSem}
                latestSGPA={latestSGPA}
                profilePhoto={profilePhoto}
                setActiveTab={setActiveTab}
                onOpenAiAdvisor={() => setIsAiOpen(true)}
                onOpenPrintTranscript={handleOpenPrintTranscript}
                onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
              />
            )}

            {activeTab === 'ledger' && (
              <LedgerPage
                student={student}
                courses={courses}
                results={results}
                cgpaDisplay={cgpaDisplay}
                totalCreditsEarned={totalCreditsEarned}
                selectedSemester={selectedSemester}
                onSelectSemester={setSelectedSemester}
                onOpenPrintTranscript={handleOpenPrintTranscript}
              />
            )}

            {activeTab === 'audit' && (
              <DegreeAuditPage
                student={student}
                courses={courses}
                results={results}
                cgpaDisplay={cgpaDisplay}
                cgpaNumber={cgpaNumber}
                totalCreditsEarned={totalCreditsEarned}
                degreeRequiredCredits={degreeRequiredCredits}
                degreeProgressPercent={degreeProgressPercent}
                standingInfo={standingInfo}
                honorsClass={honorsClass}
                onOpenAiAdvisor={() => setIsAiOpen(true)}
                onOpenPrintTranscript={handleOpenPrintTranscript}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsPage
                student={student}
                courses={courses}
                results={results}
                cgpaDisplay={cgpaDisplay}
                cgpaNumber={cgpaNumber}
                honorsClass={honorsClass}
              />
            )}

            {activeTab === 'advisory' && (
              <AdvisoryPage
                student={student}
                courses={courses}
                results={results}
                cgpaDisplay={cgpaDisplay}
                totalCreditsEarned={totalCreditsEarned}
                onOpenPrintTranscript={handleOpenPrintTranscript}
                onOpenFullAiModal={() => setIsAiOpen(true)}
              />
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      <AiAdvisorModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        student={student}
        courses={courses}
        results={results}
      />

      <PrintTranscriptModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        student={student}
        courses={courses}
        results={results}
        initialSemester={transcriptSemester}
      />

      <UpdateProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentImage={profilePhoto}
        onSave={handleSavePhoto}
      />

    </div>
  );
};
