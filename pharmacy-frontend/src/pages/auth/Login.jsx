import React, { useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';
import toast from 'react-hot-toast';
import { User, ShieldCheck } from 'lucide-react';
import bgImage from '../../assets/login-bg.jpg';
import logoImg from '../../assets/medlogo.jpg';

const LoginForm = memo(({ role, onLogin, loading }) => {
  const [email, setEmail] = useState(role === 'admin' ? 'admin@pharmacare.com' : '');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Email Address"
        type="email"
        placeholder={role === 'admin' ? 'admin@pharmacare.com' : 'you@example.com'}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-blue-50/30 border-blue-100/50 focus:bg-white transition-all duration-200"
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-blue-50/30 border-blue-100/50 focus:bg-white transition-all duration-200"
      />
      <Button
        type="submit"
        className="w-full py-3 text-lg font-bold mt-4 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-transform"
        disabled={loading}
      >
        {loading ? 'Authenticating...' : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
      </Button>
    </form>
  );
});

export default function Login() {
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[10s] scale-105 hover:scale-100"
          style={{ backgroundImage: `url(${bgImage})`, filter: 'brightness(0.4)' }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/40 via-transparent to-blue-600/30" />

        <div className="relative z-10 w-full max-w-md mx-4">
          <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-8 border border-white/20 transform transition-all duration-300">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-white rounded-2xl shadow-sm mb-4 border border-blue-50">
                <img src={logoImg} alt="Logo" className="w-12 h-12 object-contain" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">PharmaCare</h1>
              <p className="text-slate-500 mt-2 font-medium">Your Health, Our Priority</p>
            </div>

            <div className="flex p-1.5 bg-blue-50/50 rounded-2xl mb-8 border border-blue-100/50">
              <button
                onClick={() => setRole('user')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  role === 'user'
                    ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <User className={`w-4 h-4 ${role === 'user' ? 'text-red-500' : ''}`} />
                User
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  role === 'admin'
                    ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${role === 'admin' ? 'text-blue-600' : ''}`} />
                Admin
              </button>
            </div>

            <LoginForm role={role} onLogin={handleLogin} loading={loading} />

            <div className="mt-8 text-center pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-600 font-medium">
                New to PharmaCare?{' '}
                <Link to="/signup" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
