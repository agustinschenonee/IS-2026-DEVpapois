import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';
import {
  Building2,
  CalendarDays,
  CalendarClock,
  Settings,
  LogOut,
  ShieldAlert,
  UserCircle,
  Moon,
  Sun,
  Menu,
  X,
} from 'lucide-react';

export function MainLayout() {
  const { currentUser, currentUserRole, logout } = useAppContext();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const avatarLetter = currentUser?.nombre?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div
                className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
                onClick={() => { navigate('/'); closeMobileMenu(); }}
              >
                <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
                  <Building2 size={24} />
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight hidden sm:block">DevPapois</span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-emerald-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                    }`
                  }
                >
                  <CalendarDays className="mr-2" size={18} />
                  Inicio
                </NavLink>
                <NavLink
                  to="/book"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-emerald-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                    }`
                  }
                >
                  <CalendarClock className="mr-2" size={18} />
                  Reservar
                </NavLink>
                <NavLink
                  to="/reservations"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-emerald-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                    }`
                  }
                >
                  <CalendarDays className="mr-2" size={18} />
                  Mis Reservas
                </NavLink>
                {currentUserRole === 'admin' && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-emerald-500 text-gray-900 dark:text-white'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                      }`
                    }
                  >
                    <Settings className="mr-2" size={18} />
                    Admin
                  </NavLink>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                title="Alternar tema oscuro"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
                {currentUserRole === 'admin'
                  ? <><ShieldAlert size={15} className="text-amber-500" /> Admin</>
                  : <><UserCircle size={15} /> {currentUser?.nombre ?? 'Usuario'}</>
                }
              </div>

              <div className="hidden sm:flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                {avatarLetter}
              </div>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Salir</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="pt-2 pb-3 space-y-1 px-4">
              {[
                { to: '/', label: 'Inicio', icon: <CalendarDays size={20} /> },
                { to: '/book', label: 'Reservar', icon: <CalendarClock size={20} /> },
                { to: '/reservations', label: 'Mis Reservas', icon: <CalendarDays size={20} /> },
                ...(currentUserRole === 'admin' ? [{ to: '/admin', label: 'Admin', icon: <Settings size={20} /> }] : []),
              ].map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <span className="mr-3">{icon}</span>
                  {label}
                </NavLink>
              ))}
              <button
                onClick={() => { closeMobileMenu(); handleLogout(); }}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-3" size={20} />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
