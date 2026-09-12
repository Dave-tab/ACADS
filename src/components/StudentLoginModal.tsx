import React, { useState } from 'react';
import { User, KeyRound, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Role, Student } from '../types';

interface StudentLoginModalProps {
  setCurrentRole: (role: Role) => void;
  students: Student[];
  setCurrentStudent: (student: Student) => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  setCurrentRole,
  students,
  setCurrentStudent,
}) => {
  const [studentId, setStudentId] = useState('2024235020409');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const found = students.find(
        (s) => s.student_id.toLowerCase() === studentId.trim().toLowerCase()
      );

      if (found) {
        setCurrentStudent(found);
        setCurrentRole('student_portal');
      } else {
        setError('Matriculation number not found. Try demo matric: 2024235020409 or 2024235020410');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-violet-200 dark:shadow-none">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Student Portal Login</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Access your grades, CGPA, and course results</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="student-login-matric" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Matriculation Number / Student ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="student-login-matric"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white dark:focus:bg-slate-900 transition-all font-mono"
                placeholder="e.g. 2024235020409"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">Format: 13-digit academic matric number</p>
          </div>

          <div>
            <label htmlFor="student-login-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                id="student-login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
                placeholder="Enter your student password"
              />
              <button
                type="button"
                id="btn-toggle-student-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              id="student-login-submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-md shadow-violet-200 dark:shadow-none transition-all disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In to Student Portal'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            id="student-login-back-home"
            onClick={() => setCurrentRole('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <span className="text-xs text-slate-400 font-medium">Demo Matric: 2024235020409</span>
        </div>
      </div>
    </div>
  );
};
