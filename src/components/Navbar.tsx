import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, ShieldCheck, User, BookOpen, Bell, CheckCheck, Clock, ExternalLink, ChevronRight, X, Sun, Moon } from 'lucide-react';
import { Role, Student, AcademicNotice } from '../types';

interface NavbarProps {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentStudent: Student | null;
  adminUsername: string | null;
  onOpenGradingScale: () => void;
  notices: AcademicNotice[];
  onMarkNoticeRead: (id: string) => void;
  onMarkAllNoticesRead: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  currentStudent,
  adminUsername,
  onOpenGradingScale,
  notices = [],
  onMarkNoticeRead,
  onMarkAllNoticesRead,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [isNoticesOpen, setIsNoticesOpen] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notices.filter(n => !n.isRead).length;

  // Handle clicking outside to dismiss dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNoticesOpen(false);
      }
    }
    if (isNoticesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNoticesOpen]);

  const getCategoryBadge = (category: AcademicNotice['category']) => {
    switch (category) {
      case 'Examination':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Academic Senate':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Registry':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Deadlines':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand & Portal Title */}
        <div 
          onClick={() => setCurrentRole('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md group-hover:bg-indigo-600 transition-colors">
            <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight block">
              ACADS
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide uppercase block">
              Student Records & Result Portal
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Dark / Light Mode Toggle Button in Header */}
          {onToggleDarkMode && (
            <button
              id="nav-btn-theme-toggle"
              onClick={onToggleDarkMode}
              className="p-2 sm:px-3 sm:py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-center gap-1.5 text-xs font-semibold"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-slate-200">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline text-slate-700">Dark</span>
                </>
              )}
            </button>
          )}

          {/* Grading Scale Reference - Only shown inside authenticated portals, not on landing page */}
          {currentRole !== 'home' && currentRole !== 'admin_login' && currentRole !== 'student_login' && (
            <button
              id="nav-btn-grading-scale"
              onClick={onOpenGradingScale}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="View Institutional Grading Scale & GPA Formula"
            >
              <BookOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              Grading Scale
            </button>
          )}

          {/* Institutional Notice Board Bell Dropdown - Only shown inside authenticated portals, not on landing page */}
          {currentRole !== 'home' && currentRole !== 'admin_login' && currentRole !== 'student_login' && (
            <div className="relative" ref={dropdownRef}>
              <button
                id="nav-btn-notices-bell"
                onClick={() => setIsNoticesOpen(!isNoticesOpen)}
                className="relative p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors flex items-center justify-center"
                title="Institutional Notices & Official Bulletins"
                aria-label="Institutional Notices"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in-75">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Popover */}
              {isNoticesOpen && (
                <div 
                  id="nav-notices-popover"
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {/* Popover Header */}
                  <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-400" />
                        <h3 className="font-bold text-sm tracking-tight">Institutional Bulletins</h3>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {unreadCount} unread official announcement{unreadCount === 1 ? '' : 's'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllNoticesRead}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-300 hover:text-white px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900/10 hover:bg-white dark:bg-slate-900/20 transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notices List */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[60vh] overflow-y-auto">
                    {notices.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        No notices currently posted.
                      </div>
                    ) : (
                      notices.map((notice) => {
                        const isExpanded = selectedNoticeId === notice.id;
                        return (
                          <div
                            key={notice.id}
                            onClick={() => {
                              if (!notice.isRead) {
                                onMarkNoticeRead(notice.id);
                              }
                              setSelectedNoticeId(isExpanded ? null : notice.id);
                            }}
                            className={`p-3.5 transition-colors cursor-pointer text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                              !notice.isRead ? 'bg-indigo-50/40 dark:bg-indigo-950/30' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryBadge(notice.category)}`}>
                                {notice.category}
                              </span>
                              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                                <Clock className="w-3 h-3" />
                                <span>{notice.timeAgo}</span>
                                {!notice.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" title="Unread"></span>
                                )}
                              </div>
                            </div>

                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1">
                              {notice.title}
                            </h4>

                            <p className={`text-[11px] text-slate-600 dark:text-slate-400 ${isExpanded ? '' : 'line-clamp-2'}`}>
                              {notice.content}
                            </p>

                            {notice.author && (
                              <div className="mt-2 text-[10px] text-slate-400 font-medium flex items-center justify-between">
                                <span>{notice.author}</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                                  {isExpanded ? 'Show less' : 'Read more'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Popover Footer */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Official Academic Bulletins & Announcements
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Role Navigation Context */}
          {currentRole.startsWith('admin') && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 hidden md:inline">
                Administrator: <strong className="text-slate-900 dark:text-slate-100">{adminUsername || 'admin'}</strong>
              </span>
              <button
                id="nav-btn-admin-logout"
                onClick={() => setCurrentRole('home')}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {currentRole.startsWith('student') && (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {currentStudent?.name || 'Student'}
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                  {currentStudent?.student_id}
                </span>
              </div>
              <button
                id="nav-btn-student-logout"
                onClick={() => setCurrentRole('home')}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition-colors"
              >
                Exit Portal
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
