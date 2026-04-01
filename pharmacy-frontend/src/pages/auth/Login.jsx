import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';
import toast from 'react-hot-toast';
import bgImage from '../../assets/login-bg.jpg';
import logoImg from '../../assets/logo.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    // Mock authentication
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@pharmacy.com' && password === 'admin') {
        login({ name: 'System Admin', role: 'admin', email });
        toast.success('Welcome back, Admin!');
        navigate('/admin');
      } else if (email === 'user@example.com' && password === 'password') {
        login({ name: 'John Doe', role: 'customer', email });
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials. Try admin@pharmacy.com/admin');
      }
    }, 1000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-slate-900 relative">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/80 to-blue-600/60" />

        <div className="relative z-10 w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl mx-4 my-8 transition-all duration-500 transform opacity-100 scale-100 translate-y-0">
          <div className="text-center mb-8">
            <img 
              src={logoImg} 
              alt="PharmaCare Logo" 
              className="w-20 h-20 object-contain mx-auto mb-4 drop-shadow-md rounded-2xl bg-white p-2"
            />
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@pharmacy.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full py-2.5 text-lg font-semibold mt-4"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
