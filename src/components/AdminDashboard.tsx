import React, { useState } from 'react';
import { 
  Users, BookOpen, FileSpreadsheet, PlusCircle, LayoutDashboard, 
  Trash2, Search, Filter, RefreshCw, CheckCircle2, AlertCircle, Award,
  X, Eye, EyeOff, ExternalLink
} from 'lucide-react';
import { Student, Course, Result, AdminTab } from '../types';
import { calculateGPA } from '../data/mockData';
import { AdminDashboardSkeleton } from './skeletons/AdminDashboardSkeleton';

interface AdminDashboardProps {
  students: Student[];
  courses: Course[];
  results: Result[];
  onAddStudent: (student: Omit<Student, 'id' | 'created_at'>) => void;
  onDeleteStudent: (studentId: string) => void;
  onAddCourse: (course: Omit<Course, 'id'>) => void;
  onAddResult: (result: Omit<Result, 'id' | 'uploaded_at'>) => void;
  isLoading?: boolean;
  onRefresh?: () => Promise<void> | void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  courses,
  results,
  onAddStudent,
  onDeleteStudent,
  onAddCourse,
  onAddResult,
  isLoading = false,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
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

  // Search and Filter State for Students
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState('');
  const [overviewStudentQuery, setOverviewStudentQuery] = useState('');

  // Add Student Form State
  const [newStudentId, setNewStudentId] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('password123');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newDepartment, setNewDepartment] = useState('Computer Science');
  const [newSemester, setNewSemester] = useState(1);
  const [studentMsg, setStudentMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add Course Form State
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCreditHours, setNewCreditHours] = useState(3);
  const [newCourseDept, setNewCourseDept] = useState('Computer Science');
  const [courseMsg, setCourseMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Upload Result Form State
  const [resStudentId, setResStudentId] = useState('');
  const [resCourseCode, setResCourseCode] = useState('');
  const [resMarks, setResMarks] = useState('');
  const [resTotalMarks, setResTotalMarks] = useState('100');
  const [resSemester, setResSemester] = useState(1);
  const [resAcademicYear, setResAcademicYear] = useState('2024-2025');
  const [resultMsg, setResultMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters for View Results
  const [filterStudent, setFilterStudent] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  // Handle Add Student
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentMsg(null);

    if (students.some(s => s.student_id.toLowerCase() === newStudentId.trim().toLowerCase())) {
      setStudentMsg({ type: 'error', text: 'Student ID already exists in the system.' });
      return;
    }

    onAddStudent({
      student_id: newStudentId.trim().toUpperCase(),
      name: newName.trim(),
      email: newEmail.trim(),
      password: newPassword,
      department: newDepartment,
      semester: Number(newSemester),
    });

    setStudentMsg({ type: 'success', text: `Student ${newName} added successfully!` });
    setNewStudentId('');
    setNewName('');
    setNewEmail('');
  };

  // Handle Upload Result
  const handleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResultMsg(null);

    const obtained = parseFloat(resMarks);
    const total = parseFloat(resTotalMarks);

    if (isNaN(obtained) || isNaN(total) || obtained < 0 || obtained > total) {
      setResultMsg({ type: 'error', text: 'Please enter valid marks obtained and total marks.' });
      return;
    }

    const { grade, grade_point } = calculateGPA(obtained, total);

    // Check duplicate
    const exists = results.some(
      r => r.student_id === resStudentId && 
           r.course_code === resCourseCode && 
           r.semester === Number(resSemester) && 
           r.academic_year === resAcademicYear.trim()
    );

    if (exists) {
      setResultMsg({ type: 'error', text: 'Result for this student, course, and semester already exists.' });
      return;
    }

    onAddResult({
      student_id: resStudentId,
      course_code: resCourseCode,
      marks_obtained: obtained,
      total_marks: total,
      grade,
      grade_point,
      semester: Number(resSemester),
      academic_year: resAcademicYear.trim(),
    });

    setResultMsg({ type: 'success', text: `Result uploaded successfully! Assigned Grade: ${grade} (${grade_point})` });
    setResMarks('');
  };

  // Handle Add Course
  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCourseMsg(null);

    if (courses.some(c => c.course_code.toLowerCase() === newCourseCode.trim().toLowerCase())) {
      setCourseMsg({ type: 'error', text: 'Course code already exists in the catalog.' });
      return;
    }

    onAddCourse({
      course_code: newCourseCode.trim().toUpperCase(),
      course_name: newCourseName.trim(),
      credit_hours: Number(newCreditHours),
      department: newCourseDept,
    });

    setCourseMsg({ type: 'success', text: `Course ${newCourseCode} added successfully!` });
    setNewCourseCode('');
    setNewCourseName('');
  };

  // Filtered Results
  const filteredResults = results.filter(r => {
    const student = students.find(s => s.student_id === r.student_id);
    const studentName = student ? student.name.toLowerCase() : '';
    const matchStudent = filterStudent === '' || 
      r.student_id.toLowerCase().includes(filterStudent.toLowerCase()) || 
      studentName.includes(filterStudent.toLowerCase());
    
    const matchCourse = filterCourse === '' || r.course_code.toLowerCase().includes(filterCourse.toLowerCase());
    const matchSem = filterSemester === '' || r.semester.toString() === filterSemester;

    return matchStudent && matchCourse && matchSem;
  });

  // Filtered Students for Manage Students Directory
  const filteredStudents = students.filter(st => {
    const q = studentSearch.trim().toLowerCase();
    const matchesSearch = !q || 
      st.student_id.toLowerCase().includes(q) || 
      st.name.toLowerCase().includes(q) ||
      st.email.toLowerCase().includes(q);
    const matchesDept = !studentDeptFilter || st.department === studentDeptFilter;
    return matchesSearch && matchesDept;
  });

  // Matching Students for Dashboard Overview Quick Search
  const overviewMatchingStudents = overviewStudentQuery.trim()
    ? students.filter(st => {
        const q = overviewStudentQuery.trim().toLowerCase();
        return st.student_id.toLowerCase().includes(q) || 
               st.name.toLowerCase().includes(q) ||
               st.email.toLowerCase().includes(q);
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('manage_students')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'manage_students'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Manage Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('manage_courses')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'manage_courses'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Manage Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('upload_result')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'upload_result'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Upload Result
          </button>
          <button
            onClick={() => setActiveTab('view_results')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'view_results'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            View All Results ({results.length})
          </button>
        </div>

        {/* Sync / Refresh Academic Records Button */}
        <button
          id="btn-admin-sync-records"
          type="button"
          onClick={handleRefresh}
          disabled={isDataLoading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors disabled:opacity-60"
          title="Refresh and sync all academic records from backend"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isDataLoading ? 'animate-spin text-indigo-600' : 'text-slate-500 dark:text-slate-400'}`} />
          <span>{isDataLoading ? 'Syncing...' : 'Sync Records'}</span>
        </button>
      </div>

      {/* RENDER SKELETON STATE DURING DATA FETCHING */}
      {isDataLoading ? (
        <AdminDashboardSkeleton activeTab={activeTab} />
      ) : (
        <>
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-3xl shadow-lg shadow-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium mb-1">Total Students</p>
                <h3 className="text-4xl font-extrabold">{students.length}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900/10 flex items-center justify-center backdrop-blur-xs">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-600 to-violet-700 text-white p-6 rounded-3xl shadow-lg shadow-violet-100 flex items-center justify-between">
              <div>
                <p className="text-violet-200 text-sm font-medium mb-1">Total Results Uploaded</p>
                <h3 className="text-4xl font-extrabold">{results.length}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900/10 flex items-center justify-center backdrop-blur-xs">
                <FileSpreadsheet className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6 rounded-3xl shadow-lg shadow-emerald-100 flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm font-medium mb-1">Available Courses</p>
                <h3 className="text-4xl font-extrabold">{courses.length}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900/10 flex items-center justify-center backdrop-blur-xs">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Quick Student Search Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Quick Student Search
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Instant filter by student name, ID, or email to inspect records or jump directly to grades
                </p>
              </div>
              {overviewStudentQuery.trim() && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                  {overviewMatchingStudents.length} match{overviewMatchingStudents.length === 1 ? '' : 'es'}
                </span>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                id="overview-student-search-input"
                type="text"
                value={overviewStudentQuery}
                onChange={(e) => setOverviewStudentQuery(e.target.value)}
                placeholder="Search student by name or Matric No (e.g. 2024235020409 or Alex)..."
                className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
              {overviewStudentQuery && (
                <button
                  type="button"
                  onClick={() => setOverviewStudentQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Matching Student Results preview */}
            {overviewStudentQuery.trim() && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                {overviewMatchingStudents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {overviewMatchingStudents.map(st => (
                      <div
                        key={st.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900">
                              {st.student_id}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              Sem {st.semester}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{st.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{st.department}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('manage_students');
                              setStudentSearch(st.student_id);
                            }}
                            className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Users className="w-3 h-3 text-indigo-500" />
                            Manage
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('view_results');
                              setFilterStudent(st.student_id);
                            }}
                            className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <Eye className="w-3 h-3" />
                            Results
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    No registered students found matching <span className="font-semibold text-slate-800 dark:text-slate-200">"{overviewStudentQuery}"</span>.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Results Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Uploaded Results</h3>
              {results.length > 0 && (
                <button
                  id="btn-view-all-results-dash"
                  onClick={() => setActiveTab('view_results')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View all &rarr;
                </button>
              )}
            </div>
            {results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Student ID</th>
                      <th className="px-6 py-4">Student Name</th>
                      <th className="px-6 py-4">Course</th>
                      <th className="px-6 py-4">Marks</th>
                      <th className="px-6 py-4">Grade</th>
                      <th className="px-6 py-4">Semester</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.slice(0, 6).map((r) => {
                      const st = students.find(s => s.student_id === r.student_id);
                      const co = courses.find(c => c.course_code === r.course_code);
                      return (
                        <tr key={r.id} className="hover:bg-slate-50 dark:bg-slate-950/60 transition-colors">
                          <td className="px-6 py-4 font-mono font-semibold text-indigo-600">{r.student_id}</td>
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{st ? st.name : 'Unknown'}</td>
                          <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{co ? co.course_name : r.course_code}</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{r.marks_obtained} / {r.total_marks}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {r.grade} ({r.grade_point})
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Sem {r.semester}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div id="empty-recent-results-placeholder" className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 text-indigo-600">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">No Academic Results Yet</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                  No course examination marks or semester grades have been uploaded to the system yet.
                </p>
                <button
                  id="btn-upload-first-result-dash"
                  onClick={() => setActiveTab('upload_result')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Upload First Result
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE STUDENTS */}
      {activeTab === 'manage_students' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Add New Student Account
            </h3>

            {studentMsg && (
              <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm ${
                studentMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {studentMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" /> : <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />}
                <span>{studentMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleStudentSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Matric Number / Student ID
                  </label>
                  <input
                    type="text"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    required
                    placeholder="e.g. 2024235020409"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    placeholder="e.g. Jane Doe"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    placeholder="jane.doe@school.edu"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Portal Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Enter student portal password"
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      title={showNewPassword ? "Hide password" : "Show password"}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Department
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Current Semester
                  </label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>{sem}th Semester</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all"
              >
                Add Student Account
              </button>
            </form>
          </div>

          {/* Students List Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Registered Students Directory</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Search, filter, and review student accounts enrolled in the system
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full">
                  {studentSearch || studentDeptFilter
                    ? `${filteredStudents.length} of ${students.length} Found`
                    : `${students.length} Total`}
                </span>
              </div>
            </div>

            {/* Quick Search and Filter Bar */}
            {students.length > 0 && (
              <div className="p-4 bg-slate-50/70 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    id="admin-student-search-input"
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Filter students by name or Matric No (e.g. 2024235020409, Jane)..."
                    className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-2xs"
                  />
                  {studentSearch && (
                    <button
                      type="button"
                      onClick={() => setStudentSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="w-full sm:w-auto flex items-center gap-2">
                  <select
                    value={studentDeptFilter}
                    onChange={(e) => setStudentDeptFilter(e.target.value)}
                    className="w-full sm:w-auto px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-2xs"
                  >
                    <option value="">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                    <option value="Engineering">Engineering</option>
                  </select>

                  {(studentSearch || studentDeptFilter) && (
                    <button
                      type="button"
                      onClick={() => { setStudentSearch(''); setStudentDeptFilter(''); }}
                      className="px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors whitespace-nowrap"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {students.length > 0 ? (
              filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4">Student ID</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4">Semester</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50 dark:bg-slate-950/60 transition-colors">
                          <td className="px-6 py-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                            <span className="bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900">
                              {st.student_id}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{st.name}</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{st.email}</td>
                          <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{st.department}</td>
                          <td className="px-6 py-4 text-slate-700 dark:text-slate-300">Sem {st.semester}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setActiveTab('view_results');
                                  setFilterStudent(st.student_id);
                                }}
                                className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors"
                                title={`View academic results for ${st.name}`}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete student ${st.name}?`)) {
                                    onDeleteStudent(st.student_id);
                                  }
                                }}
                                className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
                                title="Delete student"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div id="no-matching-students-placeholder" className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                    <Search className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">No Matching Students Found</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                    {studentSearch && studentDeptFilter
                      ? `No students in ${studentDeptFilter} match "${studentSearch}".`
                      : studentSearch
                      ? `No student accounts found matching ID or name "${studentSearch}".`
                      : `No students found in ${studentDeptFilter}.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentSearch('');
                      setStudentDeptFilter('');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Search & Filters
                  </button>
                </div>
              )
            ) : (
              <div id="empty-students-placeholder" className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 text-indigo-600">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">No Students Registered Yet</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                  The student directory is currently empty. Register your first student account using the form above to begin managing profiles and grades.
                </p>
                <button
                  id="btn-add-first-student-focus"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    const input = document.querySelector<HTMLInputElement>('input[placeholder="e.g. 2024235020409"]');
                    if (input) input.focus();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add First Student
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: MANAGE COURSES */}
      {activeTab === 'manage_courses' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Add New Course to Catalog
            </h3>

            {courseMsg && (
              <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm ${
                courseMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {courseMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" /> : <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />}
                <span>{courseMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleCourseSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    required
                    placeholder="e.g. CS105"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    required
                    placeholder="e.g. Artificial Intelligence"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Credit Hours
                  </label>
                  <select
                    value={newCreditHours}
                    onChange={(e) => setNewCreditHours(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
                  >
                    {[1, 2, 3, 4, 5].map(ch => (
                      <option key={ch} value={ch}>{ch} Credit Hours</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Department
                  </label>
                  <select
                    value={newCourseDept}
                    onChange={(e) => setNewCourseDept(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all"
              >
                Add Course to Catalog
              </button>
            </form>
          </div>

          {/* Courses List Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Institutional Course Catalog</h3>
              <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full">
                {courses.length} Courses
              </span>
            </div>
            {courses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Course Code</th>
                      <th className="px-6 py-4">Course Name</th>
                      <th className="px-6 py-4">Credit Hours</th>
                      <th className="px-6 py-4">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courses.map((co) => (
                      <tr key={co.id} className="hover:bg-slate-50 dark:bg-slate-950/60 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-indigo-600">{co.course_code}</td>
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{co.course_name}</td>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{co.credit_hours} Credits</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{co.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div id="empty-courses-placeholder" className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 text-indigo-600">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">No Courses in Catalog</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                  There are no academic courses registered in the curriculum yet. Add course codes, titles, and credit units above to build the catalog.
                </p>
                <button
                  id="btn-add-first-course-focus"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    const input = document.querySelector<HTMLInputElement>('input[placeholder="e.g. CS105"]');
                    if (input) input.focus();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add First Course
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: UPLOAD RESULT */}
      {activeTab === 'upload_result' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-10 animate-in fade-in duration-200">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-indigo-600" />
            Upload Student Academic Result
          </h3>

          {resultMsg && (
            <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm ${
              resultMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {resultMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" /> : <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />}
              <span>{resultMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleResultSubmit} className="space-y-6">
            {students.length === 0 && (
              <div id="alert-no-students-upload" className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>No students registered yet. Please register at least one student before uploading results.</span>
                </div>
                <button
                  type="button"
                  id="btn-goto-students-tab"
                  onClick={() => setActiveTab('manage_students')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                >
                  Register Student
                </button>
              </div>
            )}

            {courses.length === 0 && (
              <div id="alert-no-courses-upload" className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>No courses found in catalog. Please add at least one course before uploading results.</span>
                </div>
                <button
                  type="button"
                  id="btn-goto-courses-tab"
                  onClick={() => setActiveTab('manage_courses')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                >
                  Add Course
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Select Student
              </label>
              <select
                value={resStudentId}
                onChange={(e) => setResStudentId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
              >
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.student_id} - {s.name} ({s.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Select Course
              </label>
              <select
                value={resCourseCode}
                onChange={(e) => setResCourseCode(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
              >
                <option value="">-- Choose Course --</option>
                {courses.map(c => (
                  <option key={c.course_code} value={c.course_code}>
                    {c.course_code} - {c.course_name} ({c.credit_hours} Credits)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Marks Obtained
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={resMarks}
                  onChange={(e) => setResMarks(e.target.value)}
                  required
                  placeholder="e.g. 88"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Total Marks
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={resTotalMarks}
                  onChange={(e) => setResTotalMarks(e.target.value)}
                  required
                  placeholder="e.g. 100"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Semester
                </label>
                <select
                  value={resSemester}
                  onChange={(e) => setResSemester(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>{sem}th Semester</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={resAcademicYear}
                  onChange={(e) => setResAcademicYear(e.target.value)}
                  required
                  placeholder="e.g. 2024-2025"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            {resMarks !== '' && !isNaN(parseFloat(resMarks)) && !isNaN(parseFloat(resTotalMarks)) && (
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-sm">
                <span className="text-indigo-900 font-medium">Auto-Calculated Grade Preview:</span>
                <span className="font-bold text-indigo-700 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-indigo-200 shadow-2xs">
                  {calculateGPA(parseFloat(resMarks), parseFloat(resTotalMarks)).grade} 
                  {' '}(GP: {calculateGPA(parseFloat(resMarks), parseFloat(resTotalMarks)).grade_point})
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all"
            >
              Upload & Calculate Result
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: VIEW ALL RESULTS */}
      {activeTab === 'view_results' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {results.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div id="empty-all-results-placeholder" className="p-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 text-indigo-600">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">No Academic Results Available</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                  There are no examination grades or course result entries recorded in the system yet.
                </p>
                <button
                  id="btn-upload-first-result-empty-all"
                  onClick={() => setActiveTab('upload_result')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Upload First Result
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Filters Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-600" />
                  Filter Results
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Student ID or Name</label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={filterStudent}
                        onChange={(e) => setFilterStudent(e.target.value)}
                        placeholder="Search student..."
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Course Code</label>
                    <input
                      type="text"
                      value={filterCourse}
                      onChange={(e) => setFilterCourse(e.target.value)}
                      placeholder="e.g. CS101"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Semester</label>
                    <select
                      value={filterSemester}
                      onChange={(e) => setFilterSemester(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                    >
                      <option value="">All Semesters</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>{sem}th Semester</option>
                      ))}
                    </select>
                  </div>
                </div>
                {(filterStudent || filterCourse || filterSemester) && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => { setFilterStudent(''); setFilterCourse(''); setFilterSemester(''); }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">All Academic Results ({filteredResults.length})</h3>
                </div>
                {filteredResults.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-6 py-4">Student ID</th>
                          <th className="px-6 py-4">Student Name</th>
                          <th className="px-6 py-4">Course</th>
                          <th className="px-6 py-4">Marks</th>
                          <th className="px-6 py-4">Grade</th>
                          <th className="px-6 py-4">Grade Point</th>
                          <th className="px-6 py-4">Semester</th>
                          <th className="px-6 py-4">Academic Year</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredResults.map(r => {
                          const st = students.find(s => s.student_id === r.student_id);
                          const co = courses.find(c => c.course_code === r.course_code);
                          return (
                            <tr key={r.id} className="hover:bg-slate-50 dark:bg-slate-950/60 transition-colors">
                              <td className="px-6 py-4 font-mono font-semibold text-indigo-600">{r.student_id}</td>
                              <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{st ? st.name : 'Unknown'}</td>
                              <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{co ? co.course_name : r.course_code}</td>
                              <td className="px-6 py-4 font-semibold text-slate-800">{r.marks_obtained} / {r.total_marks}</td>
                              <td className="px-6 py-4">
                                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  {r.grade}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{r.grade_point}</td>
                              <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Sem {r.semester}</td>
                              <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">{r.academic_year}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div id="empty-filtered-results-placeholder" className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4 text-slate-500 dark:text-slate-400">
                      <Search className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">No Matching Results Found</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                      No student records match the active search criteria or semester filter.
                    </p>
                    <button
                      id="btn-reset-filters-placeholder"
                      onClick={() => { setFilterStudent(''); setFilterCourse(''); setFilterSemester(''); }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl border border-slate-300 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
        </>
      )}
    </div>
  );
};
