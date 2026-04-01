import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence } from 'framer-motion';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';

// Customer Pages
import CustomerDashboard from '../pages/customer/Dashboard';
import CustomerMedicines from '../pages/customer/Medicines';
import CustomerProfile from '../pages/customer/Profile';
import CustomerRecords from '../pages/customer/Records';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminContacts from '../pages/admin/Contacts';
import AdminOrders from '../pages/admin/Orders';
import AdminPatients from '../pages/admin/Patients';
import AdminStock from '../pages/admin/Stock';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) {
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
  }
  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Customer Routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRole="customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/medicines" element={<ProtectedRoute allowedRole="customer"><CustomerMedicines /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRole="customer"><CustomerProfile /></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute allowedRole="customer"><CustomerRecords /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/contacts" element={<ProtectedRoute allowedRole="admin"><AdminContacts /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRole="admin"><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/patients" element={<ProtectedRoute allowedRole="admin"><AdminPatients /></ProtectedRoute>} />
        <Route path="/admin/stock" element={<ProtectedRoute allowedRole="admin"><AdminStock /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
