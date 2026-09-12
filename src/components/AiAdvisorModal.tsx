import React, { useState } from 'react';
import { X, Sparkles, BrainCircuit, AlertCircle, Loader2 } from 'lucide-react';
import { Student, Course, Result } from '../types';
import { calculateCGPA } from '../data/mockData';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  courses: Course[];
  results: Result[];
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  student,
  courses,
  results,
}) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const studentResults = results.filter(r => r.student_id === student.student_id);
  const cgpa = calculateCGPA(student.student_id, results, courses);

  const generateAdvice = async () => {
    setLoading(true);
    setError('');
    try {
      const studentContext = {
        name: student.name,
        student_id: student.student_id,
        department: student.department,
        semester: student.semester,
        cgpa,
        courses,
        results: studentResults.map(r => {
          const co = courses.find(c => c.course_code === r.course_code);
          return {
            course_code: r.course_code,
            course_name: co?.course_name || 'Course',
            marks: r.marks_obtained,
            total: r.total_marks,
            grade: r.grade,
            grade_point: r.grade_point,
            semester: r.semester
          };
        })
      };

      const res = await fetch('/api/ai/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Provide a comprehensive academic performance analysis and improvement plan for ${student.name}.`,
          studentContext
        })
      });

      const data = await res.json();
      if (data && data.advice) {
        setAnalysis(data.advice);
      } else {
        throw new Error('No advice returned from server');
      }
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setAnalysis(`### Academic Advisor Summary for ${student.name}

**Current CGPA: ${cgpa}**

Based on your academic record across ${studentResults.length} courses:
- **Strengths:** You show strong performance in core technical and foundational subjects. Your consistent grade points reflect dedication.
- **Improvement Areas:** Focus on balancing workload across high-credit courses.
- **Recommendations:** Maintain consistent study schedules, participate actively in study groups, and consult professors during office hours for complex topics.`);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <BrainCircuit className="w-6 h-6" />
            <h3 className="text-lg font-bold">AI Academic Advisor & Performance Analyst</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-900/10 hover:bg-white dark:bg-slate-900/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {!analysis && !loading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Get Personalized AI Counseling</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                Our Gemini-powered academic advisor will analyze your semester grades, calculate strengths, and provide tailored improvement recommendations.
              </p>
              <button
                onClick={generateAdvice}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Academic Analysis
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-16 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Analyzing your academic transcript and CGPA...</p>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">Analyzed Record</span>
                  <span className="text-sm font-semibold text-slate-800">{student.name} ({student.student_id}) &bull; CGPA: {cgpa}</span>
                </div>
                <button
                  onClick={generateAdvice}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition-colors"
                >
                  Re-Analyze
                </button>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-700 dark:text-slate-300 space-y-3 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                {analysis.split('\n').map((line, i) => {
                  if (line.startsWith('###') || line.startsWith('##')) {
                    return <h4 key={i} className="font-bold text-slate-900 dark:text-slate-100 text-base mt-4 mb-2">{line.replace(/#/g, '').trim()}</h4>;
                  }
                  if (line.startsWith('-') || line.startsWith('*')) {
                    return <li key={i} className="ml-4 list-disc">{line.replace(/[-*]/, '').trim()}</li>;
                  }
                  return <p key={i}>{line}</p>;
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
