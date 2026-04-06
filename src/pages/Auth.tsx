import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tractor, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { storage } from '../utils/storage';
import api from '../utils/api';

const Auth: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const res: any = await api.login(formData.email, formData.password);
        if (res?.token) {
          storage.saveToken(res.token);
          storage.saveUser({ id: String(res.user.id || res.user?.id || '1'), name: res.user.name || '', email: res.user.email, isAdmin: res.user.isAdmin });
          navigate('/dashboard');
        }
      } else {
        await api.register(formData.name, formData.email, formData.password);
        const res: any = await api.login(formData.email, formData.password);
        if (res?.token) {
          storage.saveToken(res.token);
          storage.saveUser({ id: String(res.user.id || res.user?.id || '1'), name: res.user.name || '', email: res.user.email, isAdmin: res.user.isAdmin });
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Auth error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-emerald-900 flex flex-col md:flex-row items-stretch font-sans">
      <div className="hidden md:flex w-1/2 bg-emerald-900 text-white p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full blur-3xl opacity-50 -mr-48 -mt-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-700 rounded-full blur-3xl opacity-30 -ml-48 -mb-48"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Tractor className="w-12 h-12 text-emerald-400" />
            <span className="text-3xl font-black tracking-tight">FarmTrack Pro</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
            Cultivate <br />
            <span className="text-emerald-400 underline decoration-8 underline-offset-8">Better Data</span>.
          </h2>
          <p className="text-xl text-emerald-100 max-w-lg leading-relaxed">
            The modern OS for your farm. Track growth, analyze profit, and outgrow the competition.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {[
            'Real-time weather tracking',
            'Market price fluctuations',
            'Expense & profit analytics',
            'Multi-crop management'
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4 text-emerald-100 font-bold">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              {feature}
            </div>
          ))}
          <p className="pt-10 text-emerald-300 font-bold italic">"Empowering the backbone of our economy"</p>
        </div>
      </div>

      <div className="flex-1 bg-white flex items-center justify-center p-8 md:p-20 relative rounded-t-[40px] md:rounded-l-[80px] md:rounded-tr-none mt-20 md:mt-0 shadow-2xl">
        <div className="max-w-md w-full">
          <div className="md:hidden flex items-center gap-3 mb-10">
            <Tractor className="w-10 h-10 text-emerald-600" />
            <span className="text-2xl font-black text-stone-900">FarmTrack Pro</span>
          </div>
          
          <h1 className="text-4xl font-black text-stone-900 mb-2 leading-tight tracking-tight">
            {mode === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
          </h1>
          <p className="text-stone-500 font-medium mb-10">
            {mode === 'login' 
              ? 'Enter your credentials to manage your farm.' 
              : 'Join thousands of farmers tracking their success.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-14 pr-6 py-5 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 transition-all font-bold text-stone-900 shadow-sm"
                  onChange={handleChange}
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
              <input
                required
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full pl-14 pr-6 py-5 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 transition-all font-bold text-stone-900 shadow-sm"
                onChange={handleChange}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
              <input
                required
                name="password"
                type="password"
                placeholder="Password"
                className="w-full pl-14 pr-6 py-5 bg-stone-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 transition-all font-bold text-stone-900 shadow-sm"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all hover:scale-[1.02] shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-2"
            >
              {mode === 'login' ? 'Sign In' : 'Create Free Account'} <ArrowRight className="w-6 h-6" />
            </button>
          </form>

          <div className="mt-6 p-4 bg-stone-50 rounded-lg text-sm text-stone-700">
            <div className="font-bold mb-2">Demo accounts (use for quick login)</div>
            <ul className="list-disc list-inside text-sm">
              <li>Alice: alice@example.com / Password123!</li>
              <li>Bob: bob@example.com / Password123!</li>
              <li>Carla: carla@example.com / Password123!</li>
            </ul>
            <div className="mt-3 text-xs text-stone-500">Made by Paul Sarfo — 2026</div>
          </div>

          <div className="mt-10 pt-10 border-t border-stone-100 flex flex-col items-center gap-6">
            <p className="text-stone-500 font-bold">
              {mode === 'login' ? "Don't have an account?" : "Already a member?"}
              <Link to={mode === 'login' ? '/register' : '/login'} className="text-emerald-600 ml-2 hover:underline">
                {mode === 'login' ? 'Join FarmTrack Pro' : 'Sign in here'}
              </Link>
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Enterprise grade security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
