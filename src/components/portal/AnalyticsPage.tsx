import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Award, 
  BookOpen, 
  ArrowUpRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Student, Course, Result } from '../../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface AnalyticsPageProps {
  student: Student;
  courses: Course[];
  results: Result[];
  cgpaDisplay: string;
  cgpaNumber: number;
  honorsClass: string;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  student,
  courses,
  results,
  cgpaDisplay,
  cgpaNumber,
  honorsClass,
}) => {
  const studentResults = results.filter(r => r.student_id === student.student_id);

  // Grade Counts
  const aCount = studentResults.filter(r => r.grade.startsWith('A')).length;
  const bCount = studentResults.filter(r => r.grade.startsWith('B')).length;
  const otherCount = studentResults.filter(r => !r.grade.startsWith('A') && !r.grade.startsWith('B')).length;
  const honorsRate = Math.round((aCount / (studentResults.length || 1)) * 100);

  // Semester Progression Map for chart
  const semesterMap: { [sem: number]: { points: number; count: number } } = {};
  studentResults.forEach(r => {
    if (!semesterMap[r.semester]) {
      semesterMap[r.semester] = { points: 0, count: 0 };
    }
    const course = courses.find(c => c.course_code === r.course_code);
    const credits = course ? course.credit_hours : 3;
    semesterMap[r.semester].points += r.grade_point * credits;
    semesterMap[r.semester].count += credits;
  });

  let runningPts = 0;
  let runningCreds = 0;
  const progressionData = Object.keys(semesterMap)
    .sort((a, b) => Number(a) - Number(b))
    .map(sem => {
      const s = Number(sem);
      runningPts += semesterMap[s].points;
      runningCreds += semesterMap[s].count;
      const cgpaVal = runningCreds > 0 ? (runningPts / runningCreds).toFixed(2) : '0.00';
      const semGpaVal = semesterMap[s].count > 0 ? (semesterMap[s].points / semesterMap[s].count).toFixed(2) : '0.00';
      return {
        semester: `Sem ${s}`,
        semNumber: s,
        credits: semesterMap[s].count,
        qualityPoints: semesterMap[s].points,
        sgpa: Number(semGpaVal),
        cgpa: Number(cgpaVal)
      };
    });

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Academic Performance Analytics</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              GPA progression trajectory, grade curves, and longitudinal academic standing trends.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              {honorsClass}
            </span>
          </div>
        </div>

        {/* Snapshot Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-4 sm:pt-6 text-xs">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-0.5 text-[10px] sm:text-[11px]">Cumulative CGPA</span>
            <span className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">{cgpaDisplay} / 4.00</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-0.5 text-[10px] sm:text-[11px]">Honors Quality</span>
            <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">{honorsRate}% Exemplary</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-0.5 text-[10px] sm:text-[11px]">Completed Terms</span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">{progressionData.length} Semesters</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-0.5 text-[10px] sm:text-[11px]">Trajectory State</span>
            <span className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">Ascending</span>
          </div>
        </div>
      </div>

      {/* Main Trajectory Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              Longitudinal CGPA Progression Trajectory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Cumulative vs Semester Performance Trend across completed terms</p>
          </div>
          <div className="flex items-center gap-4 text-xs pt-1 sm:pt-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 bg-indigo-600 rounded"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">CGPA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 bg-emerald-500 rounded border-dashed"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">SGPA</span>
            </div>
          </div>
        </div>

        {progressionData.length > 0 ? (
          <div className="h-60 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressionData}>
                <defs>
                  <linearGradient id="analyticsCgpaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 4]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="cgpa" 
                  name="Cumulative CGPA" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#analyticsCgpaGrad)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="sgpa" 
                  name="Semester SGPA" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#10b981' }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            No semester results recorded.
          </div>
        )}
      </div>

      {/* Grade Distribution & Semester Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Grade Distribution Matrix */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                Grade Distribution Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 sm:mb-6">Distribution across {studentResults.length} registered course modules</p>

            <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">Grade A / A+ (Exemplary)</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Marks ≥ 80%</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-200">{aCount}</span>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 block">Grade B / B+ (Competent)</span>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400">Marks 65% – 79%</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-indigo-900 dark:text-indigo-200">{bCount}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Other Grades (Passing)</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Marks 50% – 64%</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200">{otherCount}</span>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium block">Overall Honors Quality Rate:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5 block">
              {honorsRate}% of courses achieved Grade A tier
            </span>
          </div>
        </div>

        {/* Semester-by-Semester Comparison Table */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            Semester Comparative Performance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Audited credits, quality points, and GPA progression across each completed semester
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[480px]">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Semester</th>
                  <th className="py-2.5 px-3 text-center">Credit Hours</th>
                  <th className="py-2.5 px-3 text-center">Quality Points</th>
                  <th className="py-2.5 px-3 text-center">Term SGPA</th>
                  <th className="py-2.5 px-3 text-center">Cumulative CGPA</th>
                  <th className="py-2.5 px-3 text-right">Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {progressionData.map(item => (
                  <tr key={item.semNumber} className="hover:bg-slate-50 dark:bg-slate-950/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {item.semester}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {item.credits} Units
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {item.qualityPoints.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                      {item.sgpa.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-extrabold text-indigo-600">
                      {item.cgpa.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        First Class
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
