import React, { useState } from 'react';
import {
  Mail,
  Sun,
  Moon,
  Zap,
  CheckCircle2,
  Send,
  Loader2,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewsletterSectionProps {
  isDark: boolean;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ isDark }) => {
  const [selectedDigest, setSelectedDigest] = useState<'morning' | 'evening' | 'breaking'>('morning');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, cadence: selectedDigest }),
      });
      const data = await res.json();
      setSubscribed(true);
      setSubscribeMessage(data.message || `Subscribed to 5-Minute ${selectedDigest} briefing!`);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch {
      setSubscribed(true);
      setSubscribeMessage(`Subscribed ${email} to 5-Minute ${selectedDigest} briefing!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="newsletter-digests-container" className="max-w-5xl mx-auto py-4 space-y-8">
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          <span>ZERO-FLUFF INTELLIGENCE DIGESTS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Read Less, Know Everything in 5 Minutes
        </h1>
        <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Join 12,400+ founders, investors, and engineers receiving synthesized breaking changes right in their inbox.
        </p>
      </div>

      {/* Cadence Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Morning Brief */}
        <div
          onClick={() => setSelectedDigest('morning')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedDigest === 'morning'
              ? 'border-amber-500 bg-amber-500/10 shadow-md'
              : isDark
              ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              : 'bg-white border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs text-amber-400 font-bold">08:00 AM IST</span>
          </div>
          <h3 className="font-bold text-sm mb-1">5-Minute Morning Brief</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Overnight global developments, Asian market openings, and top 5 strategic headlines before your standup.
          </p>
        </div>

        {/* Evening Brief */}
        <div
          onClick={() => setSelectedDigest('evening')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedDigest === 'evening'
              ? 'border-amber-500 bg-amber-500/10 shadow-md'
              : isDark
              ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              : 'bg-white border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs text-indigo-400 font-bold">06:00 PM IST</span>
          </div>
          <h3 className="font-bold text-sm mb-1">5-Minute Evening Wrap</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            US market close analysis, regulatory decisions, venture rounds, and key tech shifts that finalized today.
          </p>
        </div>

        {/* Breaking Alerts */}
        <div
          onClick={() => setSelectedDigest('breaking')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedDigest === 'breaking'
              ? 'border-amber-500 bg-amber-500/10 shadow-md'
              : isDark
              ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              : 'bg-white border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs text-red-400 font-bold">Instant &lt; 5m</span>
          </div>
          <h3 className="font-bold text-sm mb-1">Breaking-News Alerts</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Direct push notifications & emails only for Tier-1 catastrophic or market-moving events (Score 95+).
          </p>
        </div>
      </div>

      {/* Subscription Form */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border ${
          isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}
      >
        {subscribed ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-lg text-zinc-100">You're on the list!</h3>
            <p className="text-xs text-zinc-400">{subscribeMessage}</p>
            <button
              onClick={() => setSubscribed(false)}
              className="mt-3 text-xs text-amber-400 underline font-mono"
            >
              Subscribe another email or change cadence
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase font-semibold mb-2">
                Delivering: <span className="text-amber-400 font-bold uppercase">{selectedDigest} Brief</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="newsletter-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border outline-none font-sans transition ${
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-amber-500'
                      : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-amber-500'
                  }`}
                />
                <button
                  id="newsletter-subscribe-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition hover:brightness-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Subscribe</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                No ads or promotional spam
              </span>
              <span>•</span>
              <span>1-click unsubscribe</span>
            </div>
          </form>
        )}
      </div>

      {/* Live Email Mockup Preview */}
      <div
        className={`rounded-3xl border overflow-hidden shadow-2xl ${
          isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
        }`}
      >
        <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-zinc-500">Subject: [5MIN BRIEF] OpenAI Sub-50ms Agent, Fed Liquidity, India Chip Package</span>
          </div>
          <span className="text-[10px] text-zinc-500">Inbox Preview</span>
        </div>

        <div className="p-6 sm:p-8 max-w-2xl mx-auto bg-zinc-950 text-zinc-200 space-y-5 font-sans">
          <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-zinc-950 font-black flex items-center justify-center font-mono text-xs">
                5M
              </div>
              <span className="font-bold text-sm font-mono tracking-tight">5MIN NEWS BRIEFING</span>
            </div>
            <span className="text-xs font-mono text-zinc-500">08:00 AM • 3-Min Read</span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <h2 className="text-lg font-extrabold text-white">Good morning. Here is what shifted in the world.</h2>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
              <div className="font-bold text-amber-400 text-xs font-mono">01. ARTIFICIAL INTELLIGENCE</div>
              <h3 className="font-semibold text-white">OpenAI releases autonomous reactive agent framework</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Tokens dropped 68% and tool orchestration latency plunged under 50ms with direct browser memory syncing.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
              <div className="font-bold text-emerald-400 text-xs font-mono">02. MARKETS & LIQUIDITY</div>
              <h3 className="font-semibold text-white">Fed adjusts overnight repo collateral discount mechanism</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                S&P futures reacted with an immediate +32pt swing within 4 minutes of the unannounced technical release.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
              <div className="font-bold text-orange-400 text-xs font-mono">03. INDIA TECH</div>
              <h3 className="font-semibold text-white">Cabinet clears ₹24,000 Cr quantum and wafer testing corridor</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Facilities targeted for Bengaluru and Gujarat with 50% capex fiscal support.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono text-center">
            Sent by 5MIN NEWS • Everything important that changed in the last 5 minutes.
          </div>
        </div>
      </div>
    </div>
  );
};
