import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from './ui';

/**
 * ProtectedRoute — wraps routes that require authentication.
 * Optionally requires a minimum role (minRole).
 */
const ProtectedRoute = ({ children, minRole, redirectTo = '/login' }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Checking session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (minRole && !hasRole(minRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
