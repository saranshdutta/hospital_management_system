import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';
import toast from 'react-hot-toast';
import bgImage from '../../assets/login-bg.jpg';
import logoImg from '../../assets/medlogo.jpg';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Signup failed. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-slate-900 relative">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-tl from-blue-900/85 to-blue-500/70" />

        <div className="relative z-10 w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl mx-4 my-8">
          <div className="text-center mb-8">
            <img src={logoImg} alt="PharmaCare Logo" className="w-20 h-20 object-contain mx-auto mb-4 drop-shadow-md rounded-2xl bg-white p-2" />
            <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
            <p className="text-slate-500 mt-2">Join PharmaCare today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input label="Full Name" name="name" placeholder="" value={formData.name} onChange={handleChange} />
            <Input label="Email Address" name="email" type="email" placeholder="" value={formData.email} onChange={handleChange} />
            <Input label="Password" name="password" type="password" placeholder="" value={formData.password} onChange={handleChange} />
            <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
            <Button type="submit" className="w-full mt-6 py-2.5 text-lg font-semibold" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all">Sign in</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
