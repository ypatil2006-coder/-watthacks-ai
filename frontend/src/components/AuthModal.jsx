import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';
import { ShieldCheck, UserCheck, Key, Building2, Zap, X, AlertCircle, Database } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, destinationName = null }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const formatAuthError = (err) => {
    if (err.response?.data?.error) {
      return err.response.data.error;
    }
    if (
      err.response?.status === 500 ||
      err.response?.status === 502 ||
      err.response?.status === 503 ||
      err.message?.includes('500') ||
      err.message?.includes('Network Error') ||
      err.code === 'ECONNREFUSED'
    ) {
      return 'Backend server is offline on port 5000. Start it in terminal: npm run dev:backend';
    }
    return err.message || 'Authentication error occurred';
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email: 'demo@watthacks.ai', password: 'demo_password_123' });
      if (res.success) {
        setSuccessMsg("⚡ JWT issued! Unlocking product workspace...");
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user);
          onClose();
        }, 600);
      }
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      let res;
      if (tab === 'login') {
        res = await loginUser({ email, password });
      } else {
        res = await registerUser({
          email,
          password,
          name,
          region: 'pune'
        });
      }

      if (res.success) {
        setSuccessMsg(tab === 'login' ? '⚡ JWT issued! Unlocking product...' : '⚡ Registered & JWT issued! Unlocking product...');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user);
          onClose();
        }, 700);
      }
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden text-slate-900">
        {/* Subtle Decorative Gradient Orb */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Product Access Gateway
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Database className="w-3 h-3" /> MongoDB Atlas
              </span>
              <span className="text-[11px] text-slate-500 font-medium">JWT & bcrypt</span>
            </div>
          </div>
        </div>

        {/* Gateway Target Callout */}
        <div className="mb-4 px-3 py-2 rounded-xl bg-slate-100/90 border border-slate-200/80 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Protected Destination
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              JWT REQUIRED
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-800 mt-0.5">
            {destinationName || "Autonomous Energy Workspace (OCR, Arbitrage, Console)"}
          </p>
        </div>

        {/* 1-Click Evaluator Demo Access */}
        <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" /> Hackathon Evaluator Fast Pass
            </span>
            <p className="text-[10px] text-slate-600">Bypass manual typing with 1-click test credentials</p>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm active:scale-95 disabled:opacity-50"
          >
            Instant Demo
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              tab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              tab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register Facility
          </button>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
            {error.includes('Register Facility') && (
              <button
                type="button"
                onClick={() => { setTab('register'); setError(null); }}
                className="text-left font-bold text-emerald-700 hover:underline pl-6 cursor-pointer"
              >
                → Click here to Register this account
              </button>
            )}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <UserCheck className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Director / Manager Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Yash Patil"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@hinjewadi-tech.com"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password (bcrypt hashed)
            </label>
            <input
              type="password"
              required
              minLength={tab === 'register' ? 6 : 1}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wider uppercase transition shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <>
                <Key className="w-3.5 h-3.5" />
                <span>{tab === 'login' ? 'Authenticate via JWT' : 'Create & Save to MongoDB'}</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-center text-slate-400">
          Statutory compliance: SEBI BRSR Principle 6 · MSEDCL TOD Tariff Benchmark
        </p>
      </div>
    </div>
  );
}
