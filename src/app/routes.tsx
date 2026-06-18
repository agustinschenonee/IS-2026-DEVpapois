import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Home';
import { BookingWizard } from './pages/Book';
import { Reservations } from './pages/Reservations';
import { AdminDashboard } from './pages/Admin';
import { LoginPage } from './pages/LoginPage';
import { AppProvider, useAppContext } from './context/AppContext';

function ProtectedRoute() {
  const { currentUser, loading } = useAppContext();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Cargando...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function AdminRoute() {
  const { currentUser, currentUserRole, loading } = useAppContext();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUserRole !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}

function PublicOnlyRoute() {
  const { currentUser, loading } = useAppContext();
  if (loading) return null;
  if (currentUser) return <Navigate to="/" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: (
      <AppProvider>
        <Outlet />
      </AppProvider>
    ),
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: '/login', Component: LoginPage },
        ],
      },
      {
        path: '/',
        element: (
          <ProtectedRoute />
        ),
        children: [
          {
            element: <MainLayout />,
            children: [
              { index: true, Component: Dashboard },
              { path: 'book', Component: BookingWizard },
              { path: 'reservations', Component: Reservations },
            ],
          },
        ],
      },
      {
        path: '/',
        element: <AdminRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { path: 'admin', Component: AdminDashboard },
            ],
          },
        ],
      },
    ],
  },
]);
