import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    // Mock authentication
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@pharmacy.com' && password === 'admin') {
        login({ name: 'System Admin', role: 'admin', email });
        navigate('/admin');
      } else if (email === 'user@example.com' && password === 'password') {
        login({ name: 'John Doe', role: 'customer', email });
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Try admin@pharmacy.com/admin or user@example.com/password');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1586015555751-6388798e2dc4?auto=format&fit=crop&q=80&w=2000)' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/80 to-blue-600/60" />

      <div className="relative z-10 w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl mx-4 my-8 transition-all duration-500 transform opacity-100 scale-100 translate-y-0">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold font-sans shadow-lg mx-auto mb-4">
            P
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

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
  );
}
