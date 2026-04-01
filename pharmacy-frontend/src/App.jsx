import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ 
          duration: 3000, 
          style: { background: '#fff', color: '#334155', boxShadow: '0 4px 14px 0 rgba(0,0,0,0.05)', borderRadius: '12px' } 
        }} />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
