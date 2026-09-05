import React, { useState } from 'react';
import {
  Zap,
  Volume2,
  VolumeX,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Share2,
  Check,
  Sparkles,
  Download,
  Play,
  Pause,
  ExternalLink,
} from 'lucide-react';
import { NewsStory } from '../types';
import { formatMinutesAgo, getCategoryBadgeClass } from '../utils/formatters';
import { ReliableImage } from './ReliableImage';

interface FiveMinuteBriefViewProps {
  stories: NewsStory[];
  onSelectStory: (story: NewsStory) => void;
  isDark: boolean;
  onPlayAudioBrief: () => void;
  isPlayingAudio: boolean;
}

export const FiveMinuteBriefView: React.FC<FiveMinuteBriefViewProps> = ({
  stories,
  onSelectStory,
  isDark,
  onPlayAudioBrief,
  isPlayingAudio,
}) => {
  const [copied, setCopied] = useState(false);
  // Pick top 5 stories ranked by importance score
  const briefStories = [...stories]
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 5);

  const handleCopyBrief = () => {
    const briefText = briefStories
      .map(
        (s, i) =>
          `0${i + 1}. ${s.title}\nSummary: ${s.summary}\nWhy it matters: ${s.aiContext.whyItMatters}\nSource: ${s.source.name} (${s.source.url})\n`
      )
      .join('\n---\n\n');

    navigator.clipboard.writeText(
      `⚡ 5-MIN BRIEF (${new Date().toLocaleTimeString()}):\n\n${briefText}\nRead live at: https://5minnews.io`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="five-minute-brief-view-container" className="max-w-5xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          isDark
            ? 'bg-gradient-to-br from-zinc-900 via-zinc-900/70 to-zinc-950 border-zinc-800 shadow-xl'
            : 'bg-gradient-to-br from-amber-50 via-white to-amber-50/30 border-zinc-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>EXECUTIVE BRIEFING</span>
              </span>
              <span className="font-mono text-xs text-zinc-500">
                Regenerated Every 5 Minutes
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              The 5 Most Important Stories in the World Right Now
            </h1>
            <p className={`text-xs sm:text-sm mt-1.5 max-w-2xl ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              High-signal, zero-fluff summary curated by cross-source importance algorithms and AI synthesis with direct reference dispatches.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="brief-view-audio-play-btn"
              onClick={onPlayAudioBrief}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition shadow-sm ${
                isPlayingAudio
                  ? 'bg-amber-500 text-zinc-950 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 hover:brightness-105'
              }`}
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Pause Audio (2m)' : 'Play 2-Min Audio'}</span>
            </button>

            <button
              id="copy-brief-clipboard-btn"
              onClick={handleCopyBrief}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border font-mono text-xs transition ${
                isDark
                  ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                  : 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-800'
              }`}
              title="Copy formatted brief"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share Brief'}</span>
            </button>
          </div>
        </div>

        {/* Global Key Takeaway Callout */}
        <div
          className={`mt-6 p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
            isDark ? 'bg-zinc-950/70 border-zinc-800/80 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'
          }`}
        >
          <span className="font-mono font-bold uppercase text-amber-500 mr-2 text-xs">
            ⚡ 5-Minute Takeaway:
          </span>
          Federal Reserve liquidity mechanism updates sparked instant equity rallies, while OpenAI launched its real-time agent SDK and Indian cabinet greenlit major quantum fab corridors.
        </div>
      </div>

      {/* 5 Stories Stack */}
      <div className="space-y-4">
        {briefStories.map((story, idx) => {
          const num = `0${idx + 1}`;
          return (
            <div
              key={story.id}
              id={`top-brief-story-${story.id}`}
              onClick={() => onSelectStory(story)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer group ${
                isDark
                  ? 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/90 hover:border-zinc-700'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start gap-5">
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-amber-500 shrink-0">
                    {num}
                  </span>

                  {/* Story Feature Image */}
                  {story.image && (
                    <div className="w-28 sm:w-44 h-28 sm:h-32 rounded-2xl overflow-hidden shrink-0 relative bg-zinc-800 border border-zinc-700/50">
                      <ReliableImage
                        src={story.image}
                        alt={story.title}
                        category={story.category}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-1.5 right-1.5">
                        <a
                          href={story.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 hover:bg-black text-[10px] font-mono text-zinc-200 border border-white/10"
                          title={`Open source: ${story.source.url}`}
                        >
                          <span>Ref ↗</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                  {/* Category & Freshness Header */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getCategoryBadgeClass(
                        story.category,
                        isDark
                      )}`}
                    >
                      {story.category}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      {formatMinutesAgo(story.publishedAt)}
                    </span>
                    <span className="text-zinc-500">•</span>
                    {/* Clickable Reference Link */}
                    <a
                      href={story.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-amber-500 hover:text-amber-400 hover:underline flex items-center gap-1 font-mono"
                      title={`Visit source: ${story.source.url}`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{story.source.name}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <span className="ml-auto font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-bold">
                      Score: {story.importanceScore}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-base sm:text-xl font-bold group-hover:text-amber-400 transition leading-snug">
                    {story.title}
                  </h2>

                  {/* 1-2 sentence Summary */}
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {story.summary}
                  </p>

                  {/* Why it matters block */}
                  <div
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <span className="font-mono font-bold uppercase text-amber-500 text-[11px] block sm:inline mr-2">
                      Why it matters:
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-200">{story.aiContext.whyItMatters}</span>
                  </div>

                  {/* Timeline snippet & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="truncate">Latest: {story.timeline[story.timeline.length - 1]?.detail || 'Verified update'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={story.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-amber-400 hover:underline"
                        title="Open external reference"
                      >
                        <span>Reference Source</span>
                        <ExternalLink className="w-3 h-3 text-amber-500" />
                      </a>
                      <div className="flex items-center gap-1 text-amber-400 font-mono text-xs group-hover:translate-x-1 transition-transform">
                        <span>Full Story</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
