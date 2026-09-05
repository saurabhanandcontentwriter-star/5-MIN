import React, { useState } from 'react';
import {
  Clock,
  Radio,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Share2,
  Bookmark,
  Check,
  ExternalLink,
} from 'lucide-react';
import { NewsStory } from '../types';
import { formatMinutesAgo, getCategoryBadgeClass } from '../utils/formatters';
import { ReliableImage } from './ReliableImage';

interface StoryCardProps {
  story: NewsStory;
  viewMode: 'bento' | 'editorial' | 'compact';
  onSelectStory: (story: NewsStory) => void;
  onAskAIContext: (story: NewsStory) => void;
  isDark: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  viewMode,
  onSelectStory,
  onAskAIContext,
  isDark,
}) => {
  const [showWhatChanged, setShowWhatChanged] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://5minnews.io/news/${story.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVelocityBadge = () => {
    switch (story.velocity) {
      case 'breaking':
        return (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/80 text-white backdrop-blur-md border border-red-400/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            BREAKING
          </span>
        );
      case 'surging':
        return (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/80 text-white backdrop-blur-md border border-orange-400/40">
            <Zap className="w-2.5 h-2.5" />
            SURGING
          </span>
        );
      case 'developing':
        return (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/80 text-white backdrop-blur-md border border-blue-400/40">
            DEVELOPING
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-300 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50">
            VERIFIED
          </span>
        );
    }
  };

  // Compact View
  if (viewMode === 'compact') {
    return (
      <div
        id={`story-row-${story.id}`}
        onClick={() => onSelectStory(story)}
        className={`flex items-center justify-between p-3 border-b cursor-pointer transition gap-3 ${
          isDark
            ? 'hover:bg-zinc-900 border-zinc-800/60 text-zinc-200'
            : 'hover:bg-zinc-50 border-zinc-200 text-zinc-800'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Thumbnail Image */}
          {story.image && (
            <ReliableImage
              src={story.image}
              alt={story.title}
              category={story.category}
              className="w-12 h-12 rounded-lg shrink-0 border border-zinc-700/40"
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-xs text-amber-500 font-bold shrink-0">
                {formatMinutesAgo(story.publishedAt)}
              </span>
              <span
                className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border shrink-0 ${getCategoryBadgeClass(
                  story.category,
                  isDark
                )}`}
              >
                {story.category}
              </span>
            </div>
            <p className="font-medium text-xs sm:text-sm truncate hover:text-amber-400 transition">
              {story.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 font-mono text-xs">
          {/* Direct Clickable Reference Link */}
          <a
            href={story.source.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hidden md:inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400 hover:underline px-2 py-1 rounded bg-zinc-800/50 border border-zinc-700/40"
            title={`Open reference: ${story.source.url}`}
          >
            <span className="truncate max-w-[90px]">{story.source.name}</span>
            <ExternalLink className="w-3 h-3 text-amber-500 shrink-0" />
          </a>
          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px] font-mono">
            {story.importanceScore}/100
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
        </div>
      </div>
    );
  }

  // Editorial View
  if (viewMode === 'editorial') {
    return (
      <article
        id={`story-card-${story.id}`}
        onClick={() => onSelectStory(story)}
        className={`p-5 rounded-2xl border mb-4 cursor-pointer transition-all group ${
          isDark
            ? 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
            : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row gap-5">
          {story.image && (
            <div className="w-full md:w-60 h-44 rounded-xl overflow-hidden shrink-0 relative bg-zinc-800 border border-zinc-700/40">
              <ReliableImage
                src={story.image}
                alt={story.title}
                category={story.category}
                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2">{getVelocityBadge()}</div>
              {/* Image reference pill */}
              <div className="absolute bottom-2 right-2">
                <a
                  href={story.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/70 hover:bg-black text-[10px] font-mono text-zinc-200 backdrop-blur-sm border border-white/10"
                  title={`Open reference: ${story.source.url}`}
                >
                  <span>Ref ↗</span>
                </a>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getCategoryBadgeClass(
                    story.category,
                    isDark
                  )}`}
                >
                  {story.category}
                </span>
                <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatMinutesAgo(story.publishedAt)}
                </span>
                <span className="text-xs text-zinc-500">•</span>
                {/* Clickable Reference Link in header */}
                <a
                  href={story.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-amber-500 hover:text-amber-400 hover:underline flex items-center gap-1 font-mono"
                  title={`Reference link: ${story.source.url}`}
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>{story.source.name}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span className="ml-auto font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-amber-400">
                  Score {story.importanceScore}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold group-hover:text-amber-400 transition leading-snug">
                {story.title}
              </h2>

              <p className={`text-xs sm:text-sm mt-1.5 line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {story.summary}
              </p>

              {/* Corroborating sources links */}
              {story.sources && story.sources.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-[10px] font-mono text-zinc-500">Ref Links:</span>
                  {story.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 flex items-center gap-1 border border-zinc-700/50 transition"
                      title={`Open corroborating reference from ${src.name}`}
                    >
                      <span>{src.name}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAskAIContext(story);
                  }}
                  className="flex items-center gap-1 text-xs font-mono text-amber-400 hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Deep AI Context</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={story.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
                  title="Visit primary reference source"
                >
                  <span>Read Source</span>
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                </a>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition"
                  title="Copy link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Bento Card View (Default)
  return (
    <div
      id={`story-bento-${story.id}`}
      onClick={() => onSelectStory(story)}
      className={`rounded-2xl border flex flex-col justify-between transition-all cursor-pointer group relative overflow-hidden ${
        isDark
          ? 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-700 shadow-md shadow-black/20'
          : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
      }`}
    >
      <div>
        {/* Top Story Image Banner with Overlaid Badges & Reference Link */}
        {story.image && (
          <div className="w-full h-44 relative overflow-hidden bg-zinc-800 border-b border-zinc-800/60">
            <ReliableImage
              src={story.image}
              alt={story.title}
              category={story.category}
              className="w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            {/* Soft dark vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border backdrop-blur-md ${getCategoryBadgeClass(
                  story.category,
                  isDark
                )}`}
              >
                {story.category}
              </span>
              {getVelocityBadge()}
            </div>

            {/* Top right freshness clock */}
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-zinc-300 backdrop-blur-md border border-white/10">
                <Clock className="w-2.5 h-2.5 text-zinc-400" />
                <span className="text-amber-400 font-semibold">{formatMinutesAgo(story.publishedAt)}</span>
              </span>
            </div>

            {/* Bottom right Reference Link badge right on image */}
            <div className="absolute bottom-2.5 right-2.5 z-10">
              <a
                href={story.source.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-950/80 hover:bg-zinc-950 text-[10px] font-mono text-zinc-200 border border-white/15 backdrop-blur-md transition group/ref"
                title={`Open source reference: ${story.source.url}`}
              >
                <span className="truncate max-w-[100px]">Ref: {story.source.name}</span>
                <ExternalLink className="w-2.5 h-2.5 text-amber-400 group-hover/ref:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        )}

        {/* Card Body padding */}
        <div className="p-5">
          {/* If no image was present, show standard top row */}
          {!story.image && (
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getCategoryBadgeClass(
                    story.category,
                    isDark
                  )}`}
                >
                  {story.category}
                </span>
                {getVelocityBadge()}
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span className="text-amber-500 font-semibold">{formatMinutesAgo(story.publishedAt)}</span>
              </div>
            </div>
          )}

          {/* Headline */}
          <h2 className="font-bold text-sm sm:text-base leading-snug group-hover:text-amber-400 transition-colors">
            {story.title}
          </h2>

          {/* AI Short Summary */}
          <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {story.summary}
          </p>

          {/* What Changed Collapsible Preview */}
          {story.whatChanged && story.whatChanged.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-zinc-800/60">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWhatChanged(!showWhatChanged);
                }}
                className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400 hover:text-amber-400 transition py-0.5"
              >
                <span className="font-semibold uppercase tracking-wider text-amber-500/90 flex items-center gap-1">
                  <span>What changed in 5m</span>
                  <span className="text-[10px] text-zinc-500">({story.whatChanged.length})</span>
                </span>
                {showWhatChanged ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showWhatChanged && (
                <ul className="mt-1.5 space-y-1 text-[11px] text-zinc-300 font-mono bg-zinc-950/60 p-2 rounded-lg border border-zinc-800">
                  {story.whatChanged.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer bar with score, reference link, and actions */}
      <div className="px-5 pb-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Direct Clickable Reference Link in footer */}
          <a
            href={story.source.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition text-[11px] font-mono"
            title={`Reference source: ${story.source.url}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[95px]">{story.source.name}</span>
            <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
          </a>

          <div
            className="w-14 h-1.5 rounded-full bg-zinc-800 overflow-hidden shrink-0 hidden sm:block"
            title={`Importance Score: ${story.importanceScore}/100`}
          >
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400"
              style={{ width: `${story.importanceScore}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAskAIContext(story);
            }}
            className="p-1 rounded text-zinc-400 hover:text-amber-400 transition"
            title="Ask AI Context"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleShare}
            className="p-1 rounded text-zinc-400 hover:text-zinc-200 transition"
            title="Share story link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
