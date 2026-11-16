import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

interface AuthPageProps {
  setActivePage: (page: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ setActivePage }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, phone);
      }
      setActivePage('home');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'customer') => {
    try {
      if (role === 'admin') {
        await login('admin@luxestore.com', 'admin123');
      } else {
        await login('customer@luxestore.com', 'password123');
      }
      setActivePage('home');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
            L
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isLogin ? 'Welcome Back to LuxeStore' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {isLogin ? 'Enter your credentials to access your account' : 'Join our exclusive shopping community today'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-3.5 rounded-2xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="Amina Adebayo"
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-semibold"
                />
                <User className="absolute left-3.5 top-3 text-slate-400" size={16} />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="youremail@example.com"
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-semibold"
              />
              <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Password</label>
            <div className="relative">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-semibold"
              />
              <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Phone Number</label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+2348012345678"
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-semibold"
                />
                <Phone className="absolute left-3.5 top-3 text-slate-400" size={16} />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition shadow-md text-xs flex items-center justify-center gap-2"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In to Account' : 'Create Account'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Demo Accounts Quick Login */}
        <div className="border-t border-slate-100 pt-6 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Quick Demo Access</p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleDemoLogin('customer')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold transition"
            >
              Demo Customer
            </button>
            <button 
              onClick={() => handleDemoLogin('admin')}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 rounded-xl text-xs font-bold transition"
            >
              Demo Admin Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
