import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Sliders,
  Calendar,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { NewsStory, Category } from '../types';
import { formatMinutesAgo, getCategoryBadgeClass } from '../utils/formatters';
import { ReliableImage } from './ReliableImage';

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: NewsStory[];
  onSelectStory: (story: NewsStory) => void;
  categories: Category[];
  isDark: boolean;
}

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  isOpen,
  onClose,
  stories,
  onSelectStory,
  categories,
  isDark,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<'all' | '5m' | '1h' | '24h'>('all');
  const [minScore, setMinScore] = useState<number>(0);
  const [selectedSource, setSelectedSource] = useState<string>('All');

  const sourcesList = useMemo(() => {
    const s = new Set<string>();
    stories.forEach((st) => s.add(st.source.name));
    return ['All', ...Array.from(s)];
  }, [stories]);

  const trendingSearches = [
    'OpenAI Agent',
    'Fed repo rate',
    'Quantum corridor',
    'OpenSSH vulnerability',
    'NVIDIA Blackwell',
    'ISRO Chandrayaan',
  ];

  const filteredResults = useMemo(() => {
    return stories.filter((s) => {
      // Query match
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q) ||
        s.entities.some((e) => e.toLowerCase().includes(q));

      // Category match
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory;

      // Source match
      const matchSource = selectedSource === 'All' || s.source.name === selectedSource;

      // Min Score match
      const matchScore = s.importanceScore >= minScore;

      return matchQuery && matchCat && matchSource && matchScore;
    });
  }, [stories, query, selectedCategory, selectedSource, minScore]);

  if (!isOpen) return null;

  return (
    <div
      id="search-filter-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="search-filter-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl rounded-3xl border shadow-2xl transition-all my-4 sm:my-10 flex flex-col overflow-hidden ${
          isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            id="search-main-modal-input"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news, topics, companies, Fed decisions, stock tickers..."
            className="flex-1 bg-transparent text-sm sm:text-base outline-none font-sans placeholder-zinc-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              Clear
            </button>
          )}
          <button
            id="close-search-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Trending Searches Row */}
        <div className="px-6 py-2.5 bg-zinc-900/40 border-b border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1 shrink-0 uppercase font-semibold">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>Trending:</span>
          </span>
          {trendingSearches.map((term) => (
            <button
              key={term}
              id={`trending-search-chip-${term.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] shrink-0 transition"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Advanced Filters Row */}
        <div className="p-4 sm:p-6 border-b border-zinc-800/60 bg-zinc-900/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          {/* Category Selector */}
          <div>
            <label className="block text-zinc-400 text-[11px] uppercase font-semibold mb-1">
              Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-xl border outline-none ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-zinc-100 border-zinc-300 text-zinc-800'
              }`}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Source Selector */}
          <div>
            <label className="block text-zinc-400 text-[11px] uppercase font-semibold mb-1">
              Source:
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-xl border outline-none ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-zinc-100 border-zinc-300 text-zinc-800'
              }`}
            >
              {sourcesList.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          {/* Importance Score Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-zinc-400 uppercase font-semibold mb-1">
              <span>Min Score:</span>
              <span className="text-amber-400 font-bold">{minScore}/100</span>
            </div>
            <input
              type="range"
              min={0}
              max={95}
              step={5}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span>{filteredResults.length} Stories Matched</span>
            <span>Sorted by Live Freshness</span>
          </div>

          {filteredResults.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No matching stories found for your search query and filters.
            </div>
          ) : (
            filteredResults.map((story) => (
              <div
                key={story.id}
                id={`search-result-item-${story.id}`}
                onClick={() => {
                  onSelectStory(story);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                  isDark
                    ? 'bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'
                    : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {story.image && (
                      <ReliableImage
                        src={story.image}
                        alt={story.title}
                        category={story.category}
                        className="w-16 h-16 rounded-xl shrink-0 border border-zinc-700/50 mt-0.5 group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${getCategoryBadgeClass(
                            story.category,
                            isDark
                          )}`}
                        >
                          {story.category}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {formatMinutesAgo(story.publishedAt)}
                        </span>
                        <span className="text-zinc-500">•</span>
                        <a
                          href={story.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-amber-500 hover:text-amber-400 hover:underline font-mono flex items-center gap-1"
                          title={`Open source: ${story.source.url}`}
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>{story.source.name}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      <h4 className="font-semibold text-sm group-hover:text-amber-400 transition leading-snug">
                        {story.title}
                      </h4>

                      <p className={`text-xs line-clamp-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {story.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-center">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono text-xs">
                      {story.importanceScore}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
