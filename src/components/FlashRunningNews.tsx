import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  Radio,
  Bot,
  MessageSquare,
} from 'lucide-react';
import { NewsStory, SupportedLanguage } from '../types';
import { formatMinutesAgo, getCategoryBadgeClass } from '../utils/formatters';
import { t } from '../services/localization';

interface FlashRunningNewsProps {
  stories: NewsStory[];
  onSelectStory: (story: NewsStory) => void;
  onOpenChat: (story?: NewsStory) => void;
  onPlayAudioStory?: (story: NewsStory) => void;
  currentLanguage: SupportedLanguage;
  isDark: boolean;
}

export const FlashRunningNews: React.FC<FlashRunningNewsProps> = ({
  stories,
  onSelectStory,
  onOpenChat,
  onPlayAudioStory,
  currentLanguage,
  isDark,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0); // 0.75 slow, 1.0 normal, 1.5 fast
  const scrollRef = useRef<HTMLDivElement>(null);

  // Take the top 8 urgent/tech stories
  const flashStories = stories.slice(0, 8);

  // Auto-scroll loop when not paused
  useEffect(() => {
    if (isPaused || flashStories.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % flashStories.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, flashStories.length]);

  const activeStory = flashStories[currentIndex] || flashStories[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + flashStories.length) % flashStories.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashStories.length);
  };

  const handleSpeakCurrent = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onPlayAudioStory && activeStory) {
      onPlayAudioStory(activeStory);
      return;
    }

    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!activeStory) return;
    const text = `Flash tech wire. ${activeStory.category}: ${activeStory.title}. ${activeStory.summary}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (flashStories.length === 0) return null;

  return (
    <div
      id="flash-running-news-bar"
      className={`border-b transition-colors select-none ${
        isDark ? 'bg-zinc-950/90 border-zinc-800/80 text-zinc-100' : 'bg-amber-500/10 border-amber-500/20 text-zinc-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left: FLASH Badge & Source count */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600 text-white font-mono text-[11px] font-black uppercase tracking-wider shadow-sm shadow-red-500/30">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{t('flashWire', currentLanguage)}</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-zinc-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-amber-400 font-bold">{currentIndex + 1}/{flashStories.length}</span>
          </span>
        </div>

        {/* Center: Running Headline Display */}
        <div
          onClick={() => activeStory && onSelectStory(activeStory)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex-1 min-w-0 w-full flex items-center gap-2 sm:gap-3 cursor-pointer group px-2 py-1 rounded-lg hover:bg-zinc-800/40 transition"
          title="Click to open full pop-up intelligence analysis"
        >
          {activeStory && (
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border shrink-0 ${getCategoryBadgeClass(
                  activeStory.category,
                  isDark
                )}`}
              >
                {activeStory.category}
              </span>

              <span className="text-[11px] font-mono text-amber-500 font-bold shrink-0">
                {formatMinutesAgo(activeStory.publishedAt)}
              </span>

              <p className="text-xs sm:text-sm font-semibold truncate group-hover:text-amber-400 transition">
                {activeStory.title}
              </p>

              <span className="hidden xl:inline text-xs text-zinc-400 truncate max-w-[240px]">
                — {activeStory.summary}
              </span>

              {/* In-headline Ask Bot Pill */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenChat(activeStory);
                }}
                className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-500/40 transition shrink-0 ml-1"
                title="Chat with AI about this flash story"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                <span>Ask Bot</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Controls (Chat Bot, Prev, Pause/Play, Next, Audio, Ref) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Chat Bot Button on Flash Running News */}
          <button
            id="flash-news-chat-bot-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenChat(activeStory);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-mono text-[11px] font-black uppercase tracking-tight shadow-md shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
            title="Chat Bot: Ask AI Copilot about this flash news"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chat Bot</span>
            <span className="sm:hidden">Bot</span>
          </button>

          <div className="h-4 w-px bg-zinc-800 mx-0.5 hidden sm:block" />

          <button
            type="button"
            onClick={handlePrev}
            className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition"
            title="Previous flash dispatch"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition font-mono text-[10px] flex items-center gap-1"
            title={isPaused ? 'Resume auto-scroll' : 'Pause ticker'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition"
            title="Next flash dispatch"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Audio Play/Pause with Speed Controls */}
          <button
            type="button"
            onClick={handleSpeakCurrent}
            className={`p-1.5 rounded-lg transition ${
              isSpeaking ? 'text-amber-400 bg-amber-500/20' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
            }`}
            title={isSpeaking ? 'Pause / Stop Audio' : 'Listen to flash headline (supports Slow & Fast audio)'}
          >
            {isSpeaking ? <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {activeStory && (
            <a
              href={activeStory.source.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/50"
              title={`Read wire reference: ${activeStory.source.name}`}
            >
              <span>{activeStory.source.name}</span>
              <ExternalLink className="w-2.5 h-2.5 text-amber-400" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
