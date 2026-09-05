import React, { useEffect, useState } from 'react';
import {
  Zap,
  Radio,
  Search,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
  SlidersHorizontal,
  Mail,
  Crown,
  Play,
  Pause,
  Layers,
  Terminal,
  User,
  LogOut,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface HeaderProps {
  activeNav?: string;
  onNavChange?: (tab: string) => void;
  currentTab?: string;
  setCurrentTab?: (tab: string) => void;
  isDark: boolean;
  onToggleTheme?: () => void;
  setIsDark?: (dark: boolean) => void;
  onOpenSearch: () => void;
  onOpenPricing: () => void;
  onOpenAuth?: () => void;
  user?: { name: string; email: string; isPro: boolean } | null;
  onLogout?: () => void;
  onTriggerIngest: () => void;
  isIngesting: boolean;
  isPro?: boolean;
  livePaused?: boolean;
  setLivePaused?: (paused: boolean) => void;
  nextCycleSeconds?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  onNavChange,
  currentTab,
  setCurrentTab,
  isDark,
  onToggleTheme,
  setIsDark,
  onOpenSearch,
  onOpenPricing,
  onOpenAuth,
  user,
  onLogout,
  onTriggerIngest,
  isIngesting,
  isPro,
  livePaused = false,
  setLivePaused,
  nextCycleSeconds,
}) => {
  const [secondsToNextRefresh, setSecondsToNextRefresh] = useState(284);
  const [internalPaused, setInternalPaused] = useState(false);

  const isPaused = livePaused ?? internalPaused;
  const togglePaused = () => {
    if (setLivePaused) {
      setLivePaused(!livePaused);
    } else {
      setInternalPaused((p) => !p);
    }
  };

  const currentActiveTab = activeNav || currentTab || 'home';

  const handleTabChange = (tab: string) => {
    if (onNavChange) {
      onNavChange(tab);
    }
    if (typeof setCurrentTab === 'function') {
      setCurrentTab(tab);
    }
  };

  const handleToggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else if (typeof setIsDark === 'function') {
      setIsDark(!isDark);
    }
  };

  const effectiveIsPro = Boolean(isPro || user?.isPro);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSecondsToNextRefresh((prev) => (prev <= 1 ? 300 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const displayCountdown =
    typeof nextCycleSeconds === 'number'
      ? formatCountdown(nextCycleSeconds)
      : formatCountdown(secondsToNextRefresh);

  return (
    <header
      id="main-navigation-header"
      className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors ${
        isDark
          ? 'bg-zinc-950/90 border-zinc-800/80 text-zinc-100'
          : 'bg-white/90 border-zinc-200/90 text-zinc-900'
      }`}
    >
      {/* Top micro bar for system status & live cadence */}
      <div
        className={`px-4 sm:px-6 py-1.5 text-xs border-b flex items-center justify-between ${
          isDark
            ? 'bg-zinc-900/60 border-zinc-800/60 text-zinc-400'
            : 'bg-zinc-50 border-zinc-200 text-zinc-600'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="relative flex h-2 w-2">
              {!isPaused && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isPaused ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
              ></span>
            </span>
            <span className="font-semibold tracking-wider text-emerald-500 uppercase">
              {isPaused ? 'PAUSED' : 'LIVE'}
            </span>
            <span className="hidden sm:inline text-zinc-500">•</span>
            <span className="hidden sm:inline">5-Min Ingestion Cadence</span>
          </div>

          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-zinc-500">
            <span>Next batch in:</span>
            <span className="text-amber-500 font-semibold">{displayCountdown}</span>
            <button
              id="pause-resume-live-stream"
              onClick={togglePaused}
              className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1 transition"
              title={isPaused ? 'Resume live refresh' : 'Pause live refresh'}
            >
              {isPaused ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="hidden lg:inline text-zinc-500">
            Global Sources: <strong className="text-zinc-300">42 Wires Active</strong>
          </span>
          <span className="hidden lg:inline text-zinc-500">•</span>
          <span className="text-zinc-500 hidden sm:inline">
            Speed: <strong className="text-emerald-400 font-mono">310ms latency</strong>
          </span>

          <button
            id="trigger-5min-ingest-quick-btn"
            onClick={onTriggerIngest}
            disabled={isIngesting}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded font-mono font-medium text-[11px] transition ${
              isIngesting
                ? 'bg-amber-500/20 text-amber-300 cursor-not-allowed'
                : isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isIngesting ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isIngesting ? 'Ingesting Wires...' : 'Sync 5-Min Cycle'}</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            id="header-brand-home-button"
            onClick={() => handleTabChange('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-500 flex items-center justify-center text-zinc-950 font-black shadow-md shadow-amber-500/20 font-mono tracking-tighter text-base group-hover:scale-105 transition-transform">
              5M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight font-mono-code">5MIN</span>
                <span className="font-light text-lg tracking-tight text-amber-500 font-mono-code">NEWS</span>
                {effectiveIsPro && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono uppercase font-bold">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-[10px] font-medium text-zinc-400 hidden sm:block tracking-wide">
                Changed in last 5 minutes.
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/50 dark:bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/60">
          <button
            id="nav-tab-home"
            onClick={() => handleTabChange('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              currentActiveTab === 'home'
                ? isDark
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live News</span>
          </button>

          <button
            id="nav-tab-brief"
            onClick={() => handleTabChange('brief')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              currentActiveTab === 'brief'
                ? isDark
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>5-Min Brief</span>
          </button>

          <button
            id="nav-tab-foryou"
            onClick={() => handleTabChange('personalized')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              currentActiveTab === 'personalized' || currentActiveTab === 'foryou'
                ? isDark
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>For You</span>
          </button>

          <button
            id="nav-tab-newsletter"
            onClick={() => handleTabChange('newsletter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              currentActiveTab === 'newsletter'
                ? isDark
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Digests</span>
          </button>

          <button
            id="nav-tab-admin"
            onClick={() => handleTabChange('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              currentActiveTab === 'admin'
                ? isDark
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>Engine & SEO</span>
          </button>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <button
            id="search-open-button"
            onClick={onOpenSearch}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition border ${
              isDark
                ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700'
                : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
            }`}
            title="Search news and topics"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-sans">Search...</span>
            <kbd className="hidden sm:inline font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              ⌘K
            </kbd>
          </button>

          {/* Pricing / Pro */}
          <button
            id="open-pricing-button"
            onClick={onOpenPricing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              effectiveIsPro
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold hover:brightness-105 shadow-sm'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>{effectiveIsPro ? 'Pro Active' : 'Upgrade'}</span>
          </button>

          {/* User Auth or Profile Button */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono bg-zinc-800/60 text-zinc-300 border border-zinc-700/50 max-w-[120px] truncate">
                <User className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{user.name.split(' ')[0]}</span>
              </span>
              {onLogout && (
                <button
                  id="user-logout-button"
                  onClick={onLogout}
                  className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-red-400 hover:border-zinc-700 transition"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : onOpenAuth ? (
            <button
              id="user-login-button"
              onClick={onOpenAuth}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700'
                  : 'border-zinc-200 bg-zinc-100 text-zinc-700 hover:text-zinc-950 hover:border-zinc-300'
              }`}
              title="Sign In"
            >
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          ) : null}

          {/* Theme Toggle */}
          <button
            id="toggle-dark-mode-button"
            onClick={handleToggleTheme}
            className={`p-2 rounded-lg border transition ${
              isDark
                ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-amber-400'
                : 'border-zinc-200 bg-zinc-100 text-zinc-700 hover:text-amber-600'
            }`}
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-zinc-800/60 px-2 bg-zinc-900/40 text-xs">
        <button
          onClick={() => handleTabChange('home')}
          className={`px-2 py-1 rounded ${currentActiveTab === 'home' ? 'text-amber-400 font-bold' : 'text-zinc-400'}`}
        >
          Live
        </button>
        <button
          onClick={() => handleTabChange('brief')}
          className={`px-2 py-1 rounded ${currentActiveTab === 'brief' ? 'text-amber-400 font-bold' : 'text-zinc-400'}`}
        >
          5-Min Brief
        </button>
        <button
          onClick={() => handleTabChange('personalized')}
          className={`px-2 py-1 rounded ${
            currentActiveTab === 'personalized' || currentActiveTab === 'foryou'
              ? 'text-amber-400 font-bold'
              : 'text-zinc-400'
          }`}
        >
          For You
        </button>
        <button
          onClick={() => handleTabChange('newsletter')}
          className={`px-2 py-1 rounded ${
            currentActiveTab === 'newsletter' ? 'text-amber-400 font-bold' : 'text-zinc-400'
          }`}
        >
          Digests
        </button>
        <button
          onClick={() => handleTabChange('admin')}
          className={`px-2 py-1 rounded ${currentActiveTab === 'admin' ? 'text-amber-400 font-bold' : 'text-zinc-400'}`}
        >
          Engine
        </button>
      </div>
    </header>
  );
};
