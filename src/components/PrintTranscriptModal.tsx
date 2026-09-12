import React, { useState, useEffect } from 'react';
import { X, Printer, GraduationCap, Download, Calendar, Filter } from 'lucide-react';
import { Student, Course, Result } from '../types';
import { calculateCGPA } from '../data/mockData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PrintTranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  courses: Course[];
  results: Result[];
  initialSemester?: number | 'all';
}

export const PrintTranscriptModal: React.FC<PrintTranscriptModalProps> = ({
  isOpen,
  onClose,
  student,
  courses,
  results,
  initialSemester,
}) => {
  // Default to student.semester (the one used during account creation) or passed initialSemester
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>(() => {
    return initialSemester !== undefined ? initialSemester : student.semester;
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedSemester(initialSemester !== undefined ? initialSemester : student.semester);
    }
  }, [isOpen, initialSemester, student.semester]);

  if (!isOpen) return null;

  const allStudentResults = results.filter(r => r.student_id === student.student_id);
  const resultSemesters = Array.from(new Set<number>(allStudentResults.map(r => r.semester))).sort((a, b) => a - b);
  const maxSemester = Math.max(student.semester, ...(resultSemesters.length > 0 ? resultSemesters : [1]));
  const availableSemesters = Array.from({ length: maxSemester }, (_, i) => i + 1);

  const displayedResults = selectedSemester === 'all'
    ? allStudentResults
    : allStudentResults.filter(r => r.semester === selectedSemester);

  const isCumulative = selectedSemester === 'all';

  // Calculate SGPA for selected term or cumulative CGPA
  let totalGradePoints = 0;
  let totalCreditHours = 0;
  displayedResults.forEach(r => {
    const co = courses.find(c => c.course_code === r.course_code);
    const credits = co ? co.credit_hours : (r.credit_hours || 3);
    totalGradePoints += r.grade_point * credits;
    totalCreditHours += credits;
  });

  const displayedGPA = totalCreditHours > 0 ? (totalGradePoints / totalCreditHours).toFixed(2) : '0.00';
  const fullCGPA = calculateCGPA(student.student_id, results, courses);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text('UNIVERSITY ACADEMIC RECORDS & ARCHIVES', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    const docSubtitle = isCumulative
      ? 'OFFICIAL CERTIFIED CUMULATIVE ACADEMIC TRANSCRIPT OF RECORDS'
      : `OFFICIAL CERTIFIED TERM TRANSCRIPT - SEMESTER ${selectedSemester}`;
    doc.text(docSubtitle, 14, 26);

    // Student Info
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Student Name: ${student.name}`, 14, 38);
    doc.text(`Student ID: ${student.student_id}`, 14, 45);
    doc.text(`Department: ${student.department}`, 120, 38);
    doc.text(
      isCumulative
        ? `Cumulative CGPA: ${fullCGPA} / 4.00`
        : `Term SGPA (Sem ${selectedSemester}): ${displayedGPA} / 4.00`,
      120,
      45
    );

    // Table Data
    const tableRows = displayedResults.map(r => {
      const co = courses.find(c => c.course_code === r.course_code);
      return [
        r.course_code,
        co ? co.course_name : r.course_code,
        co ? co.credit_hours.toString() : '3',
        `${r.marks_obtained}/${r.total_marks}`,
        r.grade,
        r.grade_point.toString(),
        `Sem ${r.semester}`
      ];
    });

    autoTable(doc, {
      startY: 55,
      head: [['Code', 'Course Title', 'Credits', 'Marks', 'Grade', 'GP', 'Sem']],
      body: tableRows.length > 0 ? tableRows : [['-', 'No courses recorded for this semester', '-', '-', '-', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 9, cellPadding: 3 },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, finalY + 15);
    doc.text('EduGrade Pro Secure Institutional Document', 14, finalY + 21);

    const filename = isCumulative
      ? `${student.student_id}_Cumulative_Transcript.pdf`
      : `${student.student_id}_Semester_${selectedSemester}_Transcript.pdf`;
    doc.save(filename);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 print:shadow-none print:m-0 print:max-w-none print:w-full">
        {/* Header - Hidden when printing */}
        <div className="px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm sm:text-base">Official Academic Transcript Preview</h3>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span> PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Semester Navigator Toolbar (Print Hidden) */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Select Transcript Semester:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedSemester('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSemester === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Semesters (Cumulative)
            </button>
            {availableSemesters.map(sem => {
              const isDefaultEnrolled = sem === student.semester;
              const isSelected = selectedSemester === sem;
              return (
                <button
                  key={sem}
                  type="button"
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span>Semester {sem}</span>
                  {isDefaultEnrolled && (
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
        </div>

        {/* Printable Transcript Document */}
        <div className="p-6 sm:p-12 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 space-y-6 sm:space-y-8">
          {/* Institutional Header */}
          <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <GraduationCap className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              UNIVERSITY ACADEMIC RECORDS & TRANSCRIPTS
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 font-semibold">
              {isCumulative 
                ? 'Official Certified Cumulative Academic Transcript of Records' 
                : `Official Certified Term Record • Semester ${selectedSemester}`}
            </p>
          </div>

          {/* Student Bio Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm">
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase block">Student Name</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{student.name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase block">Student ID</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{student.student_id}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase block">Department</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{student.department}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase block">
                {isCumulative ? 'Cumulative CGPA' : `Sem ${selectedSemester} SGPA`}
              </span>
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-base">
                {isCumulative ? fullCGPA : displayedGPA} / 4.00
              </span>
            </div>
          </div>

          {/* Scope Indicator Banner */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl text-xs text-indigo-900 dark:text-indigo-200">
            <span className="font-semibold">
              {isCumulative
                ? `Cumulative Transcript: Showing all completed semesters on record (${displayedResults.length} courses total)`
                : `Semester ${selectedSemester} Transcript: Showing course records for Semester ${selectedSemester}`}
            </span>
            <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
              {totalCreditHours} Units Earned
            </span>
          </div>

          {/* Results Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Course Title</th>
                  <th className="px-4 py-3 text-center">Credits</th>
                  <th className="px-4 py-3 text-center">Marks</th>
                  <th className="px-4 py-3 text-center">Grade</th>
                  <th className="px-4 py-3 text-center">GP</th>
                  <th className="px-4 py-3 text-center">Sem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayedResults.length > 0 ? (
                  displayedResults.map((r, idx) => {
                    const co = courses.find(c => c.course_code === r.course_code);
                    const credits = co ? co.credit_hours : 3;
                    return (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                        <td className="px-4 py-2.5 font-mono font-semibold text-indigo-600 dark:text-indigo-400">{r.course_code}</td>
                        <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">{co ? co.course_name : r.course_code}</td>
                        <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-400">{credits}</td>
                        <td className="px-4 py-2.5 text-center font-semibold text-slate-700 dark:text-slate-300">{r.marks_obtained}/{r.total_marks}</td>
                        <td className="px-4 py-2.5 text-center font-bold text-indigo-600 dark:text-indigo-400">{r.grade}</td>
                        <td className="px-4 py-2.5 text-center font-semibold text-slate-700 dark:text-slate-300">{r.grade_point}</td>
                        <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-400">Sem {r.semester}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                      No course results found on record for Semester {selectedSemester}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Verification & Sign-off Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
            <div>
              <p>Generated on: {new Date().toLocaleDateString()} &bull; ACADS Official Records</p>
              <p className="mt-1 text-slate-400 dark:text-slate-500">This is an official computer-generated institutional document.</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="w-32 border-b border-slate-400 dark:border-slate-600 mb-1 mx-auto sm:mx-0"></div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Authorized Academic Registrar</span>
            </div>
          </div>
        </div>

        {/* Footer Actions - Hidden when printing */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3 print:hidden">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Default semester: Semester {student.semester} (Set during registration)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
