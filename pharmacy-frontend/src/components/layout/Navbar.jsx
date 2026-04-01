import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.jpg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-panel sticky top-0 z-50 h-20 flex items-center justify-between px-8 border-b border-indigo-50/50">
      <div className="flex items-center gap-3">
        <img 
          src={logoImg} 
          alt="PharmaCare Logo" 
          className="w-12 h-12 object-contain rounded-xl shadow-sm"
        />
        <span className="text-2xl font-black text-gradient hidden sm:block tracking-tight">PharmaCare</span>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-sm font-bold text-indigo-900 bg-white/60 px-5 py-2.5 rounded-full border border-indigo-50 shadow-sm backdrop-blur-md">
          <User className="w-4 h-4 text-blue-600" />
          <span>{user?.name || 'User'}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm bg-white/50 border border-white hover:border-red-100"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
