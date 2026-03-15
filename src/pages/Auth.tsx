import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import type { Page } from '../types';

interface AuthProps {
  onNavigate: (page: Page) => void;
}

export default function Auth({ onNavigate }: AuthProps) {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (mode === 'register' && !name) { setError('Please enter your name'); return; }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      onNavigate('dashboard');
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-glow to-emerald-deep flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-lg shadow-emerald-glow/20 animate-float">
            Oz
          </div>
          <h1 className="text-2xl font-bold oz-gradient-text">{t('welcomeMsg')}</h1>
          <p className="text-sm text-obsidian-400 mt-1">{t('authSubtitle')}</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in-delay">
          {/* Tabs */}
          <div className="flex mb-6 bg-obsidian-800 rounded-lg p-1">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'login' ? 'bg-emerald-glow/20 text-emerald-bright' : 'text-obsidian-400 hover:text-white'
              }`}
            >
              {t('signIn')}
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'register' ? 'bg-emerald-glow/20 text-emerald-bright' : 'text-obsidian-400 hover:text-white'
              }`}
            >
              {t('signUp')}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-alert/10 border border-red-alert/30 text-red-400 text-sm animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="oz-input w-full pl-10 pr-4 py-3 rounded-lg text-sm text-white placeholder-obsidian-500"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
              <input
                type="email"
                placeholder={t('email')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="oz-input w-full pl-10 pr-4 py-3 rounded-lg text-sm text-white placeholder-obsidian-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder={t('password')}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="oz-input w-full pl-10 pr-10 py-3 rounded-lg text-sm text-white placeholder-obsidian-500"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-white"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs text-emerald-glow hover:text-emerald-bright transition-colors">
                  {t('forgotPassword')}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="oz-btn w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? t('signIn') : t('signUp')}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo login hint */}
          <div className="mt-4 p-3 rounded-lg bg-obsidian-800/50 border border-obsidian-600/30">
            <p className="text-[11px] text-obsidian-400 text-center">
              💡 Demo: Use any email & password to sign in. Your data is stored locally.
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-obsidian-500 mt-4">
          JWT-secured authentication • 256-bit encryption
        </p>
      </div>
    </div>
  );
}
