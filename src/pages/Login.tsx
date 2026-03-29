import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        login(data.token, {
          id: data.user.id,
          name: `${data.user.firstName} ${data.user.lastName}`,
          email: data.user.email,
          role: data.user.role,
        });
        navigate(data.user.role === 'admin' ? '/admin' : '/account');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img src="/images/logo.png" alt="QIYU" className="h-12 w-auto" />
            <div className="text-left">
              <div className="font-display text-2xl text-gray-800">QIYU</div>
              <div className="text-xs text-gray-400 tracking-widest -mt-1">TECH</div>
            </div>
          </Link>
          <h1 className="mt-6 text-2xl font-display text-gray-800">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-blue hover:underline font-medium">Create one free</Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
              <ShieldCheck size={16} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" required autoComplete="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="#" className="text-xs text-brand-blue hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'} required autoComplete="current-password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-brand-blue" />
              <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">Remember me for 30 days</label>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-brand-blue text-white font-semibold py-3.5 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Trust badges */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-green-500" />SSL Secured</span>
            <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-green-500" />Privacy Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
