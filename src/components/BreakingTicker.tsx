import React from 'react';
import { Radio, ChevronRight, Volume2, Flame, ArrowUpRight, ExternalLink } from 'lucide-react';
import { NewsStory } from '../types';
import { formatMinutesAgo } from '../utils/formatters';
import { ReliableImage } from './ReliableImage';

interface BreakingTickerProps {
  story: NewsStory | null;
  onSelectStory: (story: NewsStory) => void;
  onPlayAudioBrief: () => void;
  isDark: boolean;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  story,
  onSelectStory,
  onPlayAudioBrief,
  isDark,
}) => {
  if (!story) return null;

  return (
    <div
      id="breaking-news-ticker-container"
      className={`border-b transition-colors ${
        isDark ? 'bg-zinc-900/80 border-zinc-800/80' : 'bg-amber-500/10 border-amber-500/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-mono text-[11px] font-bold uppercase tracking-wider shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>BREAKING</span>
          </div>

          {/* Mini Thumbnail */}
          {story.image && (
            <div className="hidden md:block">
              <ReliableImage
                src={story.image}
                alt={story.title}
                category={story.category}
                className="w-7 h-7 rounded-md shrink-0 border border-zinc-700/50"
              />
            </div>
          )}

          <button
            id="breaking-story-ticker-click"
            onClick={() => onSelectStory(story)}
            className="text-left font-medium text-xs sm:text-sm truncate hover:text-amber-400 transition flex items-center gap-1.5 min-w-0"
          >
            <span className="font-semibold text-zinc-300 dark:text-zinc-200">[{story.category}]</span>
            <span className="truncate">{story.title}</span>
            <span className="text-zinc-500 text-xs shrink-0 font-mono">
              ({formatMinutesAgo(story.publishedAt)})
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0 self-end sm:self-auto">
          {/* Direct Reference Link */}
          <a
            href={story.source.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md font-mono text-[11px] text-zinc-400 hover:text-amber-400 border border-transparent hover:border-zinc-700 transition"
            title={`Open reference: ${story.source.url}`}
          >
            <span>Ref: {story.source.name}</span>
            <ExternalLink className="w-2.5 h-2.5 text-amber-500" />
          </a>

          <button
            id="listen-quick-audio-brief-button"
            onClick={onPlayAudioBrief}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] transition ${
              isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                : 'bg-white hover:bg-zinc-100 text-zinc-800 shadow-sm'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Listen Brief (2m)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
