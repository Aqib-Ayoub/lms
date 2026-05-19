import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  { to: '/student', icon: '📊', label: 'Dashboard' },
  { to: '/student/courses', icon: '📚', label: 'My Courses' },
  { to: '/courses', icon: '🔍', label: 'Browse Courses' },
];

const instructorLinks = [
  { to: '/instructor', icon: '📊', label: 'Dashboard' },
  { to: '/instructor/courses', icon: '📋', label: 'Manage Courses' },
  { to: '/instructor/create', icon: '➕', label: 'Create Course' },
  { to: '/courses', icon: '🔍', label: 'Browse All' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const links = user?.role === 'instructor' ? instructorLinks : studentLinks;

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-[calc(100vh-4rem)]">
      <div className="flex-1 p-4 space-y-1 pt-6">
        {links.map(({ to, icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </Link>
          );
        })}
      </div>

      {/* User info at bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium"
        >
          🚪 Sign out
        </button>
      </div>
    </aside>
  );
}
