import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { usePermissions } from '../../hooks/usePermissions.js';

export function ProtectedRoute({ minRole, children }) {
  const { isAuthenticated } = useAuth();
  const { can } = usePermissions();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (minRole && !can(minRole)) return <Navigate to="/" replace />;
  return children;
}
