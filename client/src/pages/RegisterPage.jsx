import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { RegisterForm } from '../components/auth/RegisterForm.jsx';

export function RegisterPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create account</h1>
        <p className="text-sm text-gray-500 mb-6">Join your team wiki</p>
        <RegisterForm />
      </div>
    </div>
  );
}
