import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';

// ★★★ FIX: Add `requiresAdmin` prop ★★★
const ProtectedRoute = ({ allowedTypes, requiresAdmin = false }) => {
  const [user] = useLocalStorage('user', null);

  // 1. Check if a user is logged in (Authentication)
  // This part remains the same.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if the user has the correct permissions (Authorization)

  // ★★★ FIX: New logic for admin check ★★★
  // If this route requires admin privileges, check the `isAdmin` flag.
  if (requiresAdmin) {
    // If the route requires admin but the user is NOT an admin, redirect.
    if (!user.isAdmin) {
      return <Navigate to="/" replace />;
    }
    // If the user IS an admin, they are authorized.
    return <Outlet />;
  }

  // ★★★ FIX: Existing logic for type-based check ★★★
  // If the route is restricted by type, check the `allowedTypes` array.
  if (allowedTypes) {
    // If the user's type is not in the allowed list, redirect.
    if (!allowedTypes.includes(user.type)) {
      return <Navigate to="/" replace />;
    }
  }

  // 3. If all checks pass, render the child component.
  return <Outlet />;
};

export default ProtectedRoute;