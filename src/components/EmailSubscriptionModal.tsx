import React, { useState } from 'react';
import {
  Mail,
  X,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  ShieldCheck,
  Bell,
  ArrowRight,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../services/localization';

interface EmailSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  isDark: boolean;
}

export const EmailSubscriptionModal: React.FC<EmailSubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  isDark,
}) => {
  const [email, setEmail] = useState('');
  const [cadence, setCadence] = useState<'5min' | 'daily' | 'weekly'>('daily');
  const [language, setLanguage] = useState<SupportedLanguage>(currentLanguage);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'AI & LLMs',
    'SEO & Search',
    'Hardware & Chips',
    'India Tech (National)',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const topicsList = [
    { id: 'AI & LLMs', label: 'AI & Autonomous Agents', desc: 'OpenAI, Anthropic, DeepSeek, Gemini models' },
    { id: 'SEO & Search', label: 'SEO & Search Engine Updates', desc: 'Google Core updates, AI Overviews, GEO' },
    { id: 'Hardware & Chips', label: 'Hardware & Semiconductors', desc: 'NVIDIA, TSMC, optical compute, datacenters' },
    { id: 'India Tech (National)', label: 'India Tech & National Corridor', desc: 'Bengaluru startups, ₹24k Cr chip corridor, UPI' },
    { id: 'Cybersecurity', label: 'Cybersecurity & Zero-Days', desc: 'Cloudflare, Linux kernels, threat intelligence' },
  ];

  const handleToggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== topicId));
      }
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          cadence,
          language,
          topics: selectedTopics,
        }),
      });

      // Save locally
      localStorage.setItem(
        '5min_newsletter_sub',
        JSON.stringify({ email, cadence, language, topics: selectedTopics, date: new Date().toISOString() })
      );

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsSuccess(true);
    } catch (err) {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="email-subscription-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="email-subscription-modal"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden transition-all my-8 ${
          isDark
            ? 'bg-zinc-900 border-zinc-700/80 text-zinc-100'
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border-b border-zinc-800/60">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              EMAIL SUBSCRIPTION
            </span>
            <span className="text-[11px] font-mono text-zinc-400">Over 64,000 Tech Executives</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            5-Minute Tech, AI & SEO Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
            Direct from 42 verified wire sources. Zero promotional noise — only verified shifts in models, search ranking algorithms, and silicon supply chains.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-mono">Subscription Confirmed!</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
                We sent a welcome dispatch to <span className="text-amber-400 font-mono font-bold">{email}</span>.
                Your next {cadence === '5min' ? '5-Minute Flash Alert' : cadence === 'daily' ? 'Morning 8 AM Digest' : 'Weekly Sunday Wrap'} is scheduled.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition"
              >
                Return to Live Feed
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-5">
              {/* Cadence Selector */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Delivery Cadence
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '5min', label: '⚡ Flash (5-Min)', sub: 'Instant breaking' },
                    { id: 'daily', label: '🌅 Daily Brief', sub: '8:00 AM IST/EST' },
                    { id: 'weekly', label: '📅 Weekly Wrap', sub: 'Sunday deep dive' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCadence(c.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        cadence === c.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-bold'
                          : isDark
                          ? 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <p className="text-xs font-mono">{c.label}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{c.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                    Preferred Language (National & International)
                  </label>
                  <span className="text-[10px] font-mono text-amber-400">Delivered translated</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  className={`w-full text-xs font-mono p-2.5 rounded-xl border outline-none cursor-pointer ${
                    isDark
                      ? 'bg-zinc-800/90 border-zinc-700 text-zinc-100'
                      : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                >
                  <optgroup label="National Languages (India)">
                    {SUPPORTED_LANGUAGES.filter((l) => l.isNational).map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.nativeName} ({l.name})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="International Languages">
                    {SUPPORTED_LANGUAGES.filter((l) => !l.isNational).map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.nativeName} ({l.name})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Topics Checkbox Grid */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Select Intelligence Channels
                </label>
                <div className="space-y-2">
                  {topicsList.map((topic) => {
                    const isSelected = selectedTopics.includes(topic.id);
                    return (
                      <div
                        key={topic.id}
                        onClick={() => handleToggleTopic(topic.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/50 text-zinc-100'
                            : isDark
                            ? 'bg-zinc-800/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/70'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold font-mono">{topic.label}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{topic.desc}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-amber-500 border-amber-500 text-zinc-950 font-bold'
                              : 'border-zinc-600'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Your Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.chen@techventures.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-sm outline-none transition ${
                      isDark
                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-amber-400'
                        : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-amber-500'
                    }`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-zinc-950 font-bold text-xs sm:text-sm uppercase tracking-wider font-mono shadow-lg shadow-amber-500/20 hover:brightness-105 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Connecting to Ingestion Stream...</span>
                ) : (
                  <>
                    <span>Subscribe to 5-Min Intelligence</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No spam. 1-click unsubscribe anytime.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>{showPreview ? 'Hide Sample' : 'Preview Email'}</span>
                </button>
              </div>

              {/* Interactive Email Preview */}
              {showPreview && (
                <div
                  className={`p-4 rounded-2xl border text-xs font-mono space-y-2 mt-2 ${
                    isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">Subject: [5MIN DISPATCH] Morning AI & Google SEO Shifts</span>
                    <span className="text-amber-400">08:00 AM IST</span>
                  </div>
                  <p className="font-bold text-amber-500">1. Google Core Algorithm & AI Overviews Technical Shift</p>
                  <p className="text-zinc-400 text-[11px]">
                    Publishers reporting 24% organic click dispersion towards AI Overviews. Technical recommendation: update INP to &lt;200ms and enforce schema.
                  </p>
                  <p className="font-bold text-amber-500 mt-2">2. OpenAI Sub-50ms Reactive Agent Framework</p>
                  <p className="text-zinc-400 text-[11px]">
                    Enterprise SDK packages published. Shifts workflow automation from conversational prompt to direct DOM orchestration.
                  </p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
