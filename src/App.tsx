import React, { useState, useEffect } from 'react';
import { Role, Student, Course, Result, AcademicNotice } from './types';
import { INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_RESULTS, INITIAL_NOTICES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AdminLoginModal } from './components/AdminLoginModal';
import { StudentLoginModal } from './components/StudentLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentPortal } from './components/StudentPortal';
import { GradingScaleModal } from './components/GradingScaleModal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('home');
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
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

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Core application state
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [results, setResults] = useState<Result[]>(INITIAL_RESULTS);
  const [notices, setNotices] = useState<AcademicNotice[]>(INITIAL_NOTICES);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const handleRefreshData = async () => {
    setIsLoadingData(true);
    try {
      const [resStudents, resCourses, resResults, resNotices] = await Promise.all([
        fetch('/api/students').then((res) => res.json()).catch(() => []),
        fetch('/api/courses').then((res) => res.json()).catch(() => []),
        fetch('/api/results').then((res) => res.json()).catch(() => []),
        fetch('/api/notices').then((res) => res.json()).catch(() => []),
      ]);
      if (Array.isArray(resStudents) && resStudents.length > 0) setStudents(resStudents);
      if (Array.isArray(resCourses) && resCourses.length > 0) setCourses(resCourses);
      if (Array.isArray(resResults) && resResults.length > 0) setResults(resResults);
      if (Array.isArray(resNotices) && resNotices.length > 0) setNotices(resNotices);
    } catch (err) {
      console.error('Failed to load data from backend:', err);
    } finally {
      // Graceful display buffer for skeleton transition
      setTimeout(() => {
        setIsLoadingData(false);
      }, 450);
    }
  };

  useEffect(() => {
    handleRefreshData();
  }, []);

  const handleMarkNoticeRead = async (noticeId: string) => {
    setNotices(prev => prev.map(n => n.id === noticeId ? { ...n, isRead: true } : n));
    try {
      await fetch(`/api/notices/${noticeId}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      // In-memory state is already updated optimistically
      console.warn('Backend sync for notice read was offline or unavailable:', err);
    }
  };

  const handleMarkAllNoticesRead = async () => {
    // Optimistic immediate update so UI responds instantly
    setNotices(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      const res = await fetch('/api/notices/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        // Fallback retry with PUT
        await fetch('/api/notices/mark-all-read', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (err) {
      // Graceful degradation: in-memory state is maintained without crashing
      console.warn('Backend sync for mark all notices read was offline or unavailable:', err);
    }
  };

  // Grading scale modal state
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);

  // Handlers
  const handleAddStudent = (newStudentData: Omit<Student, 'id' | 'created_at'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: students.length + 1,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setStudents([newStudent, ...students]);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(s => s.student_id !== studentId));
    setResults(results.filter(r => r.student_id !== studentId));
  };

  const handleAddCourse = (newCourseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...newCourseData,
      id: courses.length + 1,
    };
    setCourses([...courses, newCourse]);
  };

  const handleAddResult = async (newResultData: Omit<Result, 'id' | 'uploaded_at'>) => {
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResultData)
      });
      const data = await res.json();
      if (data && data.id) {
        setResults([data, ...results]);
        return;
      }
    } catch (err) {
      console.error('Failed to save result to backend:', err);
    }
    // Fallback local state update
    const newResult: Result = {
      ...newResultData,
      id: results.length + 1,
      uploaded_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setResults([newResult, ...results]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-600 selection:text-white transition-colors duration-200">
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentStudent={currentStudent}
        adminUsername={adminUsername}
        onOpenGradingScale={() => setIsGradingModalOpen(true)}
        notices={notices}
        onMarkNoticeRead={handleMarkNoticeRead}
        onMarkAllNoticesRead={handleMarkAllNoticesRead}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="flex-1">
        {currentRole === 'home' && (
          <LandingPage
            setCurrentRole={setCurrentRole}
            onOpenGradingScale={() => setIsGradingModalOpen(true)}
            onPreviewDemo={() => {
              if (students.length > 0) {
                setCurrentStudent(students[0]);
                setCurrentRole('student_portal');
              }
            }}
          />
        )}

        {currentRole === 'admin_login' && (
          <AdminLoginModal
            setCurrentRole={setCurrentRole}
            setAdminUsername={setAdminUsername}
          />
        )}

        {currentRole === 'admin_dashboard' && (
          <AdminDashboard
            students={students}
            courses={courses}
            results={results}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onAddCourse={handleAddCourse}
            onAddResult={handleAddResult}
            isLoading={isLoadingData}
            onRefresh={handleRefreshData}
          />
        )}

        {currentRole === 'student_login' && (
          <StudentLoginModal
            setCurrentRole={setCurrentRole}
            students={students}
            setCurrentStudent={setCurrentStudent}
          />
        )}

        {currentRole === 'student_portal' && currentStudent && (
          <StudentPortal
            student={currentStudent}
            courses={courses}
            results={results}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            isLoading={isLoadingData}
            onRefresh={handleRefreshData}
          />
        )}
      </main>

      <Footer />

      <GradingScaleModal
        isOpen={isGradingModalOpen}
        onClose={() => setIsGradingModalOpen(false)}
      />
    </div>
  );
}
