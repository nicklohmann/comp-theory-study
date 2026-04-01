import { NavLink, useLocation } from 'react-router-dom';
import { TOPICS } from '../data/topics';
import { DarkModeToggle } from './DarkModeToggle';
import { StatusDot } from './StatusSelector';

const NAV = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/topics',
    label: 'Topic Explorer',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    to: '/quiz',
    label: 'Practice Quiz',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    to: '/exam-prep',
    label: 'Exam Prep',
    badge: true,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

export function Sidebar({ dark, onToggleDark, progress, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 flex flex-col
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
              CT
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">CompTheory</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Study App</div>
            </div>
          </div>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>

        {/* Main nav */}
        <nav className="px-3 pt-4 space-y-1">
          {NAV.map(({ to, label, icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
              }
            >
              {icon}
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-amber-900 leading-none">
                  NEW
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Topics list */}
        <div className="px-3 pt-5 pb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1 mb-2">
            Topics
          </p>
          <div className="space-y-0.5 overflow-y-auto max-h-64 lg:max-h-none">
            {TOPICS.map((topic) => (
              <NavLink
                key={topic.id}
                to={`/topics/${topic.id}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link text-xs ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                }
              >
                <StatusDot status={progress[topic.id] ?? 'not-started'} />
                <span className="truncate">{topic.title}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Computational Theory · Spring 2026
          </p>
        </div>
      </aside>
    </>
  );
}
