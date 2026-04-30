import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useUiStore } from '../../store/uiStore.js';
import { TopBar } from './TopBar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { ToastContainer } from '../ui/Toast.jsx';

export function AppShell() {
  const { isAuthenticated } = useAuth();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <aside className="w-60 flex-shrink-0 overflow-hidden">
            <Sidebar />
          </aside>
        )}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
