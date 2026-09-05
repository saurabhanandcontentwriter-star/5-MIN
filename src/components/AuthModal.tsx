import React, { useState } from 'react';
import { X, Mail, Shield, ArrowRight, Github, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; isPro: boolean }) => void;
  isDark: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isDark,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const name = email.split('@')[0];
      onLoginSuccess({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        isPro: true,
      });
      onClose();
    }, 600);
  };

  const handleOAuth = (provider: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        isPro: true,
      });
      onClose();
    }, 400);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="auth-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all ${
          isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-mono font-black text-zinc-950 text-sm">
              5M
            </div>
            <span className="font-bold text-sm tracking-tight font-mono">5MIN NEWS</span>
          </div>
          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-left mb-6">
          <h3 className="text-xl font-extrabold tracking-tight">
            {mode === 'signin' ? 'Welcome back to the wire' : 'Start your 5-minute briefings'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Access your personalized topics, instant breaking alerts, and AI summaries.
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-2 mb-5">
          <button
            id="oauth-google-btn"
            type="button"
            onClick={() => handleOAuth('Google')}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-200'
                : 'bg-zinc-50 border-zinc-300 hover:bg-zinc-100 text-zinc-800'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            id="oauth-github-btn"
            type="button"
            onClick={() => handleOAuth('GitHub')}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-200'
                : 'bg-zinc-50 border-zinc-300 hover:bg-zinc-100 text-zinc-800'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-zinc-800 w-full" />
          <span className="bg-zinc-950 px-3 text-[11px] font-mono text-zinc-500 uppercase absolute">
            Or with email
          </span>
        </div>

        {/* Email Magic Link Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              id="auth-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none font-sans transition ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-amber-500'
                  : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-amber-500'
              }`}
            />
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-95 transition disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Send Magic Link / Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-zinc-400">
          {mode === 'signin' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-amber-400 hover:underline font-medium"
              >
                Sign up free
              </button>
            </span>
          ) : (
            <span>
              Already subscribed?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-amber-400 hover:underline font-medium"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
