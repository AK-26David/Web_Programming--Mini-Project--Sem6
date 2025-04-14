import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * A wrapper component that checks if the user is authenticated
 * If authenticated, renders the child components
 * If not authenticated, redirects to the login page with a return path
 */
const PrivateRoute = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Return child routes if authenticated
  return <Outlet />;
};

export default PrivateRoute;