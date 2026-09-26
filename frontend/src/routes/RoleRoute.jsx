import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_DEFAULT_ROUTES } from '../utils/constants';
import Loader from '../components/common/Loader';

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loader fullScreen text="Verifying permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(user.role)) {
    // Redirect user to their own role's default dashboard
    const redirectPath = ROLE_DEFAULT_ROUTES[user.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
