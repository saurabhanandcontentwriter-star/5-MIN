import React, { useState } from 'react';
import { X, Check, Zap, Crown, Building2, Shield, Sparkles } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '../data/newsStories';
import confetti from 'canvas-confetti';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onSetPro: (isPro: boolean) => void;
  isDark: boolean;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  isPro,
  onSetPro,
  isDark,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  if (!isOpen) return null;

  const handleSelectTier = (tierId: string) => {
    if (tierId === 'pro' || tierId === 'business' || tierId === 'enterprise') {
      onSetPro(true);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      onSetPro(false);
      onClose();
    }
  };

  return (
    <div
      id="pricing-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="pricing-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-5xl rounded-3xl border overflow-hidden shadow-2xl transition-all my-auto ${
          isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 text-center border-b border-zinc-800/80 relative">
          <button
            id="close-pricing-modal-btn"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5" />
            <span>TRANSPARENT VALUE-FIRST PRICING</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Stay Ahead of the World in 5-Minute Increments
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mt-1">
            Choose the intelligence speed for your workflow. Cancel anytime with one click.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 mt-5">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                billingCycle === 'monthly' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Annual (Save 20%)</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                2 Mo Free
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const isHighlighted = !!tier.popular;
            const priceVal =
              billingCycle === 'annual' && tier.priceINR > 0
                ? Math.round(tier.priceINR * 0.8)
                : tier.priceINR;

            return (
              <div
                key={tier.id}
                id={`pricing-card-${tier.id}`}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all relative ${
                  isHighlighted
                    ? 'border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10'
                    : isDark
                    ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                    : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {isHighlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-mono text-[10px] font-black uppercase tracking-wider shadow">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="font-mono text-xs text-zinc-400 uppercase font-semibold">
                    {tier.name}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                      ₹{priceVal}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      /mo
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2 leading-snug">{tier.billingPeriod}</p>

                  <div className="mt-4 pt-4 border-t border-zinc-800/60 space-y-2">
                    {tier.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-zinc-300 leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/60">
                  <button
                    id={`select-plan-${tier.id}`}
                    onClick={() => handleSelectTier(tier.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                      isHighlighted
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 hover:brightness-105 shadow-md shadow-amber-500/20'
                        : isDark
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                        : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                    }`}
                  >
                    {isPro && tier.id === 'pro' ? 'Current Plan' : tier.id === 'free' ? 'Stay Free' : `Upgrade to ${tier.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800/80 text-center text-xs font-mono text-zinc-500 flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Zero Tracking & Ad-Free Promise
          </span>
          <span>•</span>
          <span>Instant Invoice / GST compliant for Indian & Global entities</span>
          <span>•</span>
          <span>14-day money back guarantee</span>
        </div>
      </div>
    </div>
  );
};
