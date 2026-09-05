import React from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  X,
  Sparkles,
  Bot,
  Gauge,
  Sliders,
} from 'lucide-react';
import { getCategoryBadgeClass } from '../utils/formatters';

export interface AudioPlayerState {
  status: 'playing' | 'paused' | 'stopped';
  title: string;
  category?: string;
  summary?: string;
  speed: number; // 0.75, 1.0, 1.25, 1.5, 2.0
  currentIndex?: number;
  totalStories?: number;
}

interface AudioPlayerDockProps {
  playerState: AudioPlayerState;
  onTogglePlayPause: () => void;
  onSetSpeed: (speed: number) => void;
  onStop: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onOpenChat?: () => void;
  isDark: boolean;
}

export const SPEED_OPTIONS = [
  { value: 0.75, label: '0.75x', tag: 'Slow', desc: 'Slow, relaxed pace' },
  { value: 1.0, label: '1.0x', tag: 'Normal', desc: 'Standard broadcast pace' },
  { value: 1.25, label: '1.25x', tag: 'Fast', desc: 'Quick briefing pace' },
  { value: 1.5, label: '1.5x', tag: '1.5x', desc: 'Accelerated speed' },
  { value: 2.0, label: '2.0x', tag: '2x', desc: 'Double speed skimming' },
];

export const AudioPlayerDock: React.FC<AudioPlayerDockProps> = ({
  playerState,
  onTogglePlayPause,
  onSetSpeed,
  onStop,
  onNext,
  onPrev,
  onOpenChat,
  isDark,
}) => {
  if (playerState.status === 'stopped') return null;

  const isPlaying = playerState.status === 'playing';
  const isPaused = playerState.status === 'paused';

  return (
    <div
      id="audio-player-dock"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-40 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div
        className={`rounded-2xl border shadow-2xl p-3.5 backdrop-blur-xl transition-all ${
          isDark
            ? 'bg-zinc-950/95 border-amber-500/40 text-zinc-100 shadow-amber-950/20'
            : 'bg-white/95 border-amber-500/40 text-zinc-900 shadow-xl'
        }`}
      >
        {/* Top Line: Category, Title & Close */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Equalizer or speaker icon */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isPlaying ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {isPlaying ? (
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-0.5 h-3 bg-zinc-950 animate-pulse" />
                  <span className="w-0.5 h-2 bg-zinc-950 animate-bounce" />
                  <span className="w-0.5 h-3.5 bg-zinc-950 animate-pulse" />
                  <span className="w-0.5 h-1.5 bg-zinc-950 animate-bounce" />
                </div>
              ) : (
                <Pause className="w-3.5 h-3.5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {playerState.category && (
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border shrink-0 ${getCategoryBadgeClass(
                      playerState.category as any,
                      isDark
                    )}`}
                  >
                    {playerState.category}
                  </span>
                )}
                <span className="text-[10px] font-mono uppercase text-amber-500 font-bold tracking-wider">
                  {isPlaying ? 'Now Playing' : 'Audio Paused'}
                </span>
                {playerState.totalStories && (
                  <span className="text-[10px] font-mono text-zinc-400">
                    ({(playerState.currentIndex ?? 0) + 1}/{playerState.totalStories})
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold truncate leading-tight mt-0.5">
                {playerState.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-[10px] font-bold"
                title="Ask AI Chat Bot about this audio dispatch"
              >
                <Bot className="w-3 h-3" />
                <span className="hidden sm:inline">Ask Bot</span>
              </button>
            )}

            <button
              onClick={onStop}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              title="Close audio briefing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Middle Line: Play/Pause/Prev/Next Controls + Speed Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-800/40">
          {/* Main Playback Controls */}
          <div className="flex items-center gap-1.5">
            {onPrev && (
              <button
                onClick={onPrev}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                title="Previous story"
              >
                <Rewind className="w-4 h-4" />
              </button>
            )}

            {/* Play/Pause Button */}
            <button
              id="audio-dock-play-pause"
              onClick={onTogglePlayPause}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold font-mono text-xs transition shadow-md ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/30'
              }`}
              title={isPlaying ? 'Pause audio' : 'Play / Resume audio'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </>
              )}
            </button>

            {onNext && (
              <button
                onClick={onNext}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                title="Next story"
              >
                <FastForward className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onStop}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition ml-0.5"
              title="Stop audio completely"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Controls: Slow, Normal, Fast */}
          <div className="flex items-center gap-1 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80">
            <span className="text-[9px] font-mono uppercase text-zinc-400 px-1 hidden sm:inline">
              Speed:
            </span>
            {SPEED_OPTIONS.map((opt) => {
              const isCurrent = playerState.speed === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`audio-speed-btn-${opt.value}`}
                  onClick={() => onSetSpeed(opt.value)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                    isCurrent
                      ? 'bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/40'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
                  }`}
                  title={`${opt.desc} (${opt.label})`}
                >
                  {opt.tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
