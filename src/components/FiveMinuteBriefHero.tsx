import React, { useState } from 'react';
import { Zap, Flame, Radio, ArrowUpRight, Volume2, Sparkles, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { NewsStory } from '../types';
import { formatMinutesAgo, getCategoryBadgeClass } from '../utils/formatters';
import { ReliableImage } from './ReliableImage';

interface FiveMinuteBriefHeroProps {
  stories: NewsStory[];
  trendingTags: Array<{ tag: string; count: string; change: string; category: string }>;
  onSelectStory: (story: NewsStory) => void;
  onSelectTag: (tag: string) => void;
  onPlayAudioBrief: () => void;
  isDark: boolean;
}

export const FiveMinuteBriefHero: React.FC<FiveMinuteBriefHeroProps> = ({
  stories,
  trendingTags,
  onSelectStory,
  onSelectTag,
  onPlayAudioBrief,
  isDark,
}) => {
  const [activeStoryHover, setActiveStoryHover] = useState<string | null>(null);

  // Top 3 urgent breaking stories
  const breakingStories = stories.filter((s) => s.velocity === 'breaking').slice(0, 3);
  // 5 stories for the 5-min brief
  const briefStories = stories.slice(0, 5);

  return (
    <section id="homepage-5min-hero-section" className="mb-8">
      {/* Hero Header / Mission statement */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>5-MINUTE ENGINE ACTIVE</span>
              </span>
              <span className="text-zinc-500 text-xs font-mono">Normalized from 42 Global Feeds</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Everything important changed in the last{' '}
              <span className="underline decoration-amber-500 decoration-wavy decoration-2">5 minutes</span>.
            </h1>
            <p className={`text-sm mt-1.5 max-w-2xl ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Real-time AI synthesis of breaking world developments, market swings, cybersecurity advisories, and technical breakthroughs.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="hero-play-brief-button"
              onClick={onPlayAudioBrief}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:brightness-105 transition active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen 5-Min Brief</span>
            </button>
          </div>
        </div>

        {/* Live fast ticker strip */}
        <div
          className={`mt-4 rounded-xl border p-3 ${
            isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>BREAKING NOW DISPATCHES</span>
            </span>
            <span className="text-[11px] font-mono text-zinc-500">Auto-prioritized by Velocity</span>
          </div>

          <div className="space-y-1.5">
            {breakingStories.map((story) => (
              <button
                key={story.id}
                id={`breaking-dispatch-${story.id}`}
                onClick={() => onSelectStory(story)}
                className={`w-full flex items-center justify-between text-left p-2 rounded-lg text-xs transition group ${
                  isDark ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-white text-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                    LIVE
                  </span>
                  <span className="font-semibold truncate group-hover:text-amber-400 transition">
                    {story.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2 font-mono text-[11px] text-zinc-400">
                  <a
                    href={story.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hidden sm:inline-flex items-center gap-1 text-zinc-400 hover:text-amber-400 hover:underline"
                    title={`Open reference: ${story.source.url}`}
                  >
                    <span>Ref: {story.source.name}</span>
                    <ArrowUpRight className="w-3 h-3 text-amber-500" />
                  </a>
                  <span className="text-amber-500 font-semibold">{formatMinutesAgo(story.publishedAt)}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid: Left = ⚡ 5-MIN BRIEF, Right = 🔥 TRENDING & VELOCITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5-Min Brief Column (8 cols) */}
        <div
          id="five-minute-brief-card"
          className={`lg:col-span-8 rounded-2xl border p-5 sm:p-6 transition-all ${
            isDark
              ? 'bg-zinc-900/40 border-zinc-800/80 shadow-lg shadow-black/20'
              : 'bg-white border-zinc-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-base tracking-tight">⚡ 5-MIN BRIEF</h2>
                <p className="text-[11px] text-zinc-400">
                  Top 5 essential developments right now with 1-sentence takeaways
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px]">
              5 Stories
            </span>
          </div>

          <div className="space-y-4">
            {briefStories.map((story, index) => {
              const numStr = `0${index + 1}`;
              const isHovered = activeStoryHover === story.id;
              return (
                <div
                  key={story.id}
                  id={`brief-story-item-${story.id}`}
                  onMouseEnter={() => setActiveStoryHover(story.id)}
                  onMouseLeave={() => setActiveStoryHover(null)}
                  onClick={() => onSelectStory(story)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    isDark
                      ? isHovered
                        ? 'bg-zinc-800/80 border-amber-500/40'
                        : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'
                      : isHovered
                      ? 'bg-amber-500/5 border-amber-400'
                      : 'bg-zinc-50 border-zinc-200/80 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-base font-extrabold text-amber-500 shrink-0">
                        {numStr}
                      </span>

                      {/* Thumbnail Preview */}
                      {story.image && (
                        <ReliableImage
                          src={story.image}
                          alt={story.title}
                          category={story.category}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl shrink-0 border border-zinc-700/50 group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${getCategoryBadgeClass(
                            story.category,
                            isDark
                          )}`}
                        >
                          {story.category}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {formatMinutesAgo(story.publishedAt)}
                        </span>
                        <span className="text-[11px] text-zinc-500">•</span>
                        {/* Clickable Reference Link */}
                        <a
                          href={story.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-mono text-amber-500 hover:text-amber-400 hover:underline flex items-center gap-1"
                          title={`Open reference link: ${story.source.url}`}
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-500 inline" />
                          <span>{story.source.name}</span>
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      <h3 className="font-semibold text-sm group-hover:text-amber-400 transition leading-snug">
                        {story.title}
                      </h3>

                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {story.summary}
                      </p>

                      {/* Why it matters preview */}
                      <div className="mt-2 pt-2 border-t border-zinc-800/40 flex items-start gap-1.5 text-[11px] text-amber-400/90 font-mono">
                        <span className="font-bold uppercase text-[10px] text-amber-500">Why it matters:</span>
                        <span className="text-zinc-300 font-sans truncate">{story.aiContext.whyItMatters}</span>
                      </div>
                    </div>

                    <div className="shrink-0 self-center hidden sm:block">
                      <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-amber-500 group-hover:text-zinc-950 transition">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Trending & Velocity Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Trending Topics Box */}
          <div
            id="trending-velocity-card"
            className={`rounded-2xl border p-5 transition-all flex-1 ${
              isDark ? 'bg-zinc-900/40 border-zinc-800/80 shadow-lg shadow-black/20' : 'bg-white border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-base tracking-tight">🔥 TRENDING & VELOCITY</h2>
                  <p className="text-[11px] text-zinc-400">Story momentum in the last 5 minutes</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {trendingTags.map((item) => (
                <button
                  key={item.tag}
                  id={`trending-tag-${item.tag.replace('#', '').toLowerCase()}`}
                  onClick={() => onSelectTag(item.tag)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition group ${
                    isDark
                      ? 'bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-800 hover:border-zinc-700'
                      : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="font-mono font-bold text-xs text-amber-400 group-hover:text-amber-300 transition">
                      {item.tag}
                    </div>
                    <div className="text-[11px] text-zinc-400">{item.count}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/20">
                      {item.change}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Engine Status widget */}
            <div
              className={`mt-4 p-3 rounded-xl border text-xs font-mono ${
                isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span>Ingestion Rate:</span>
                <span className="text-emerald-400 font-bold">14.2 stories/min</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span>Deduplication:</span>
                <span className="text-zinc-200 font-bold">98.2% exact match</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>AI Summarizer:</span>
                <span className="text-amber-400 font-bold">Gemini 3.8 Flash</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
