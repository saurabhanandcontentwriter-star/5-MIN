import React from 'react';
import { Category, StoryVelocity } from '../types';
import { LayoutGrid, AlignLeft, List, Flame, Zap, ArrowDownUp } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  selectedVelocity: string;
  onSelectVelocity: (vel: string) => void;
  sortBy: string;
  onSelectSort: (sort: string) => void;
  viewMode: 'bento' | 'editorial' | 'compact';
  onSelectViewMode: (mode: 'bento' | 'editorial' | 'compact') => void;
  isDark: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedVelocity,
  onSelectVelocity,
  sortBy,
  onSelectSort,
  viewMode,
  onSelectViewMode,
  isDark,
}) => {
  return (
    <div
      id="category-filter-bar"
      className={`border-b sticky top-[68px] z-30 backdrop-blur-md transition-colors ${
        isDark ? 'bg-zinc-950/90 border-zinc-800/80' : 'bg-white/95 border-zinc-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category horizontal scrolling tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`category-tab-${cat.toLowerCase()}`}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                    : isDark
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 border border-zinc-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* View and sort filters */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs shrink-0">
          {/* Velocity dropdown/chips */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 text-[11px] font-mono hidden lg:inline">Velocity:</span>
            <select
              id="velocity-filter-select"
              value={selectedVelocity}
              onChange={(e) => onSelectVelocity(e.target.value)}
              className={`text-xs px-2 py-1 rounded border outline-none font-mono transition ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 focus:border-amber-500'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-amber-500'
              }`}
            >
              <option value="all">All Velocity</option>
              <option value="breaking">⚡ Breaking only</option>
              <option value="surging">🚀 Surging</option>
              <option value="developing">📈 Developing</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 text-[11px] font-mono hidden lg:inline">Sort:</span>
            <select
              id="sort-stories-select"
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value)}
              className={`text-xs px-2 py-1 rounded border outline-none font-mono transition ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 focus:border-amber-500'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-amber-500'
              }`}
            >
              <option value="freshness">Freshness (5-min)</option>
              <option value="importance">Importance Score</option>
              <option value="velocity">Velocity / Virality</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center border rounded-lg p-0.5 border-zinc-800">
            <button
              id="view-mode-bento-btn"
              onClick={() => onSelectViewMode('bento')}
              className={`p-1 rounded ${viewMode === 'bento' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'}`}
              title="Bento Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              id="view-mode-editorial-btn"
              onClick={() => onSelectViewMode('editorial')}
              className={`p-1 rounded ${viewMode === 'editorial' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'}`}
              title="Editorial Stream View"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              id="view-mode-compact-btn"
              onClick={() => onSelectViewMode('compact')}
              className={`p-1 rounded ${viewMode === 'compact' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'}`}
              title="Compact Feed View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
