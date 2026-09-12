import React from 'react';
import { X, Award, CheckCircle2 } from 'lucide-react';

interface GradingScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GradingScaleModal: React.FC<GradingScaleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const gradingTable = [
    { range: '90 - 100%', grade: 'A+', points: '4.0', desc: 'Exceptional' },
    { range: '85 - 89%', grade: 'A', points: '3.7', desc: 'Outstanding' },
    { range: '80 - 84%', grade: 'A-', points: '3.3', desc: 'Excellent' },
    { range: '75 - 79%', grade: 'B+', points: '3.0', desc: 'Very Good' },
    { range: '70 - 74%', grade: 'B', points: '2.7', desc: 'Good' },
    { range: '65 - 69%', grade: 'B-', points: '2.3', desc: 'Competent' },
    { range: '60 - 64%', grade: 'C+', points: '2.0', desc: 'Satisfactory' },
    { range: '55 - 59%', grade: 'C', points: '1.7', desc: 'Adequate' },
    { range: '50 - 54%', grade: 'C-', points: '1.3', desc: 'Passing' },
    { range: '45 - 49%', grade: 'D', points: '1.0', desc: 'Marginal Pass' },
    { range: 'Below 45%', grade: 'F', points: '0.0', desc: 'Fail' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 bg-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6" />
            <h3 className="text-lg font-bold">Standard Grading & GPA Scale</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-900/10 hover:bg-white dark:bg-slate-900/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Cumulative GPA (CGPA) is calculated as the weighted average of grade points across all courses, weighted by course credit hours.
          </p>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Percentage</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Grade Point</th>
                  <th className="px-4 py-3">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gradingTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:bg-slate-950/80 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{row.range}</td>
                    <td className="px-4 py-2.5 font-bold text-indigo-600">{row.grade}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300">{row.points}</td>
                    <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400 text-xs">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
