import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer 
      id="app-global-footer"
      className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs py-5 px-4 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">ACADS</span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline">Institutional Result Portal</span>
        </div>

        {/* User-requested exact attribution */}
        <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <span>@2026 designed and developed by</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
            | DAYAN
          </span>
        </div>
      </div>
    </footer>
  );
};
