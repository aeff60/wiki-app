import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useUiStore } from '../../store/uiStore.js';
import { SearchBar } from '../search/SearchBar.jsx';

export function TopBar() {
  const { user, clearAuth } = useAuth();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 z-10">
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <span
        className="text-lg font-bold text-blue-600 cursor-pointer select-none"
        onClick={() => navigate('/')}
      >
        Wiki
      </span>

      <div className="flex-1 max-w-xl">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <span className="text-sm text-gray-600">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
