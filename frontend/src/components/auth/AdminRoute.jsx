import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated && user?.role !== 'admin') {
      toast.error('Access denied: Admin privileges required');
    }
  }, [user, isAuthenticated, isCheckingAuth]);

  if (isCheckingAuth) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
