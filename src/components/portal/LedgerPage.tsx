import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Printer, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  BookOpen, 
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Filter
} from 'lucide-react';
import { Student, Course, Result } from '../../types';

interface LedgerPageProps {
  student: Student;
  courses: Course[];
  results: Result[];
  cgpaDisplay: string;
  totalCreditsEarned: number;
  selectedSemester?: number | 'all';
  onSelectSemester?: (sem: number | 'all') => void;
  onOpenPrintTranscript: (semester?: number | 'all') => void;
}

export const LedgerPage: React.FC<LedgerPageProps> = ({
  student,
  courses,
  results,
  cgpaDisplay,
  totalCreditsEarned,
  selectedSemester: propSelectedSemester,
  onSelectSemester,
  onOpenPrintTranscript,
}) => {
  // Default semester is the one used during account creation (student.semester)
  const [selectedSemester, setSelectedSemester] = useState<string>(() => {
    if (propSelectedSemester !== undefined) {
      return propSelectedSemester.toString();
    }
    return student.semester.toString();
  });

  React.useEffect(() => {
    if (propSelectedSemester !== undefined) {
      setSelectedSemester(propSelectedSemester.toString());
    }
  }, [propSelectedSemester]);

  const handleSemesterChange = (newSem: string) => {
    setSelectedSemester(newSem);
    if (onSelectSemester) {
      onSelectSemester(newSem === 'all' ? 'all' : Number(newSem));
    }
  };

  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const studentResults = results.filter(r => r.student_id === student.student_id);

  // Available semesters
  const resultSemesters = Array.from(new Set<number>(studentResults.map(r => r.semester))).sort((a, b) => a - b);
  const maxSemester = Math.max(student.semester, ...(resultSemesters.length > 0 ? resultSemesters : [1]));
  const availableSemesters = Array.from({ length: maxSemester }, (_, i) => i + 1);

  // Filtered results
  const filteredResults = studentResults.filter(r => {
    const matchesSemester = selectedSemester === 'all' || r.semester.toString() === selectedSemester;
    const matchesGrade = selectedGradeFilter === 'all' || r.grade.toUpperCase().startsWith(selectedGradeFilter);
    const course = courses.find(c => c.course_code === r.course_code);
    const courseName = course ? course.course_name.toLowerCase() : '';
    const courseCode = r.course_code.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = courseCode.includes(searchLower) || courseName.includes(searchLower);
    return matchesSemester && matchesGrade && matchesSearch;
  });

  // Calculate stats for current filter
  let filteredCredits = 0;
  let filteredQualityPts = 0;
  filteredResults.forEach(r => {
    const co = courses.find(c => c.course_code === r.course_code);
    const cr = co ? co.credit_hours : (r.credit_hours || 3);
    filteredCredits += cr;
    filteredQualityPts += r.grade_point * cr;
  });
  const filteredSGPA = filteredCredits > 0 ? (filteredQualityPts / filteredCredits).toFixed(2) : '0.00';

  const getGradeBadge = (grade: string) => {
    const g = grade.toUpperCase();
    if (g.startsWith('A')) return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    if (g.startsWith('B')) return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    if (g.startsWith('C')) return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  };

  const handleExportCSV = () => {
    const headers = ['Course Code', 'Course Title', 'Credit Hours', 'Marks Obtained', 'Total Marks', 'Grade', 'Grade Point', 'Quality Points', 'Semester', 'Academic Year'];
    const rows = filteredResults.map(r => {
      const co = courses.find(c => c.course_code === r.course_code);
      const cr = co ? co.credit_hours : 3;
      const qp = (r.grade_point * cr).toFixed(1);
      return [
        `"${r.course_code}"`,
        `"${co ? co.course_name : ''}"`,
        cr,
        r.marks_obtained,
        r.total_marks,
        `"${r.grade}"`,
        r.grade_point,
        qp,
        `"Sem ${r.semester}"`,
        `"${r.academic_year}"`
      ];
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${student.student_id}_Academic_Record.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Course Examination Ledger</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Verified term-by-term assessment marks, course grade points, and official credit recordings.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              id="btn-ledger-export-csv"
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors min-h-[40px]"
            >
              <Download className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
              <span>Export CSV</span>
            </button>
            <button
              id="btn-ledger-print-transcript"
              onClick={() => onOpenPrintTranscript(selectedSemester === 'all' ? 'all' : Number(selectedSemester))}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors min-h-[40px]"
              title={selectedSemester === 'all' ? 'Preview cumulative transcript' : `Preview Semester ${selectedSemester} transcript`}
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>Preview Transcript</span>
            </button>
          </div>
        </div>

        {/* Ledger Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-4 sm:pt-6 text-xs">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-0.5 text-[10px] sm:text-[11px]">Enrolled</span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">{studentResults.length} Modules</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-0.5 text-[10px] sm:text-[11px]">Earned Units</span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">{totalCreditsEarned} Credits</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-0.5 text-[10px] sm:text-[11px]">CGPA</span>
            <span className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">{cgpaDisplay} / 4.00</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-0.5 text-[10px] sm:text-[11px]">
              {selectedSemester === 'all' ? 'Filtered SGPA' : `Sem ${selectedSemester} SGPA`}
            </span>
            <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">{filteredSGPA}</span>
          </div>
        </div>
      </div>

      {/* Main Ledger Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Filters Toolbar */}
        <div className="p-3.5 sm:p-6 border-b border-slate-100 dark:border-slate-800 space-y-3 sm:space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Semester Pill Tabs with Account Default Indicator */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full lg:w-auto">
              <button
                onClick={() => handleSemesterChange('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedSemester === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                All ({studentResults.length})
              </button>
              {availableSemesters.map(sem => {
                const isDefaultSemester = sem === student.semester;
                const isSelected = selectedSemester === sem.toString();
                return (
                  <button
                    key={sem}
                    onClick={() => handleSemesterChange(sem.toString())}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>Sem {sem}</span>
                    {isDefaultSemester && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                        isSelected
                          ? 'bg-indigo-800 text-indigo-100'
                          : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900'
                      }`}>
                        Current
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Grade Filter & Search Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={selectedGradeFilter}
                  onChange={(e) => setSelectedGradeFilter(e.target.value)}
                  className="w-full sm:w-auto text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 pr-7 font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="all">All Letter Grades</option>
                  <option value="A">Grade A / A+</option>
                  <option value="B">Grade B / B+</option>
                  <option value="C">Grade C / C+</option>
                  <option value="F">Grade F</option>
                </select>
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>

              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text"
                  placeholder="Filter courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-2 font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Swipe cue on mobile */}
        <div className="sm:hidden px-4 py-2 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="font-medium text-slate-500 dark:text-slate-400">Course Ledger Record</span>
          <span>Scroll table &rarr;</span>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Course</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4 text-center">Credit Hours</th>
                <th className="py-3 px-4 text-center">Marks</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Grade Point</th>
                <th className="py-3 px-4 text-center">Quality Points</th>
                <th className="py-3 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                    No examination results found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredResults.map((res) => {
                  const course = courses.find(c => c.course_code === res.course_code);
                  const isExpanded = expandedRowId === res.id;
                  const creditHours = course ? course.credit_hours : 3;
                  const qualityPoints = (res.grade_point * creditHours).toFixed(1);

                  return (
                    <React.Fragment key={res.id}>
                      <tr className="hover:bg-slate-50 dark:bg-slate-950/80 transition-colors group">
                        <td className="py-3.5 px-6">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                              {res.course_code}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {course ? course.course_name : 'University Module'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Sem {res.semester}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {creditHours}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="w-24 mx-auto">
                            <div className="flex justify-between items-baseline text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-1">
                              <span>{res.marks_obtained}</span>
                              <span className="text-slate-400">/ {res.total_marks}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  res.marks_obtained >= 80 ? 'bg-emerald-500' :
                                  res.marks_obtained >= 65 ? 'bg-indigo-500' :
                                  res.marks_obtained >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${(res.marks_obtained / res.total_marks) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold border ${getGradeBadge(res.grade)}`}>
                            {res.grade}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                          {res.grade_point.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                          {qualityPoints}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <button
                            onClick={() => setExpandedRowId(isExpanded ? null : res.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                            title="View grading component details"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row Breakdown */}
                      {isExpanded && (
                        <tr className="bg-slate-50 dark:bg-slate-950/60">
                          <td colSpan={8} className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-3">
                              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 pb-2">
                                <span>Continuous Assessment & Component Scores</span>
                                <span>Academic Session: {res.academic_year}</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                  <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Internal Assessments & Quizzes</span>
                                  <div className="flex items-baseline justify-between mt-1">
                                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                                      {Math.round(res.marks_obtained * 0.3)} / 30
                                    </span>
                                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Verified</span>
                                  </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                  <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Midterm Examination</span>
                                  <div className="flex items-baseline justify-between mt-1">
                                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                                      {Math.round(res.marks_obtained * 0.2)} / 20
                                    </span>
                                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Verified</span>
                                  </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                  <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Final Comprehensive Exam</span>
                                  <div className="flex items-baseline justify-between mt-1">
                                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                                      {Math.round(res.marks_obtained * 0.5)} / 50
                                    </span>
                                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Passed</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Filtered Term Summary */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-semibold block text-[10px] sm:text-xs">Visible Modules</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{filteredResults.length} Courses</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-semibold block text-[10px] sm:text-xs">Visible Credits</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{filteredCredits} Units</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-semibold block text-[10px] sm:text-xs">Quality Points</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{filteredQualityPts.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">Period SGPA:</span>
            <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 font-mono font-black text-sm">
              {filteredSGPA}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
