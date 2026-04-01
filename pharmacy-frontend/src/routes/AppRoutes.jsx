import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';

// Customer Pages
import CustomerDashboard from '../pages/customer/Dashboard';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) {
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Customer Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRole="customer">
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
