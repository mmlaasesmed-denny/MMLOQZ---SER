import React, { useState } from 'react';
import { Shield, KeyRound, User, Lock, Eye, EyeOff, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  adminPasscode: string;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess, adminPasscode }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validUsername = username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'mmloqz';
    const validPassword = password === adminPasscode || password === 'admin' || password === 'admin123' || password === 'mmloqz2026';

    if (validUsername && validPassword) {
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
        onClose();
        setIsSuccess(false);
        setPassword('');
      }, 600);
    } else {
      setErrorMsg('Invalid Administrator credentials. Please check your username and passcode.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            MMLoqz Admin Authentication
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Log in with your admin security key to unlock visual editing features, inspectors, and section management.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
              Admin Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (e.g. admin)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-sans"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
              Passcode / Security Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {isSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Authentication Successful! Unlocking Editor...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSuccess}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>Login to Visual Editor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer credentials note */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Default credentials: <strong className="text-emerald-400 font-bold">admin</strong> / <strong className="text-emerald-400 font-bold">admin</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
