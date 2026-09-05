import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Check,
  Plus,
  Bell,
  Radio,
  Flame,
  Crown,
  ArrowUpRight,
} from 'lucide-react';
import { NewsStory, UserPreferences } from '../types';
import { StoryCard } from './StoryCard';

interface PersonalizedFeedProps {
  stories: NewsStory[];
  onSelectStory: (story: NewsStory) => void;
  onAskAIContext: (story: NewsStory) => void;
  isDark: boolean;
  isPro: boolean;
  onOpenPricing: () => void;
}

const AVAILABLE_TOPICS = [
  'Artificial Intelligence',
  'Global Markets',
  'Semiconductors',
  'India Tech & Economy',
  'Cybersecurity',
  'Space Exploration',
  'Venture & Startups',
  'Clean Energy',
  'Cryptocurrency',
  'Cloud Infrastructure',
];

const AVAILABLE_ENTITIES = [
  'OpenAI',
  'Federal Reserve',
  'NVIDIA',
  'ISRO',
  'Apple',
  'Linux / OpenSSH',
  'TSMC',
  'NASA',
];

export const PersonalizedFeed: React.FC<PersonalizedFeedProps> = ({
  stories,
  onSelectStory,
  onAskAIContext,
  isDark,
  isPro,
  onOpenPricing,
}) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Artificial Intelligence',
    'Global Markets',
    'Cybersecurity',
  ]);
  const [selectedEntities, setSelectedEntities] = useState<string[]>([
    'OpenAI',
    'Federal Reserve',
  ]);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const toggleEntity = (entity: string) => {
    setSelectedEntities((prev) =>
      prev.includes(entity) ? prev.filter((e) => e !== entity) : [...prev, entity]
    );
  };

  // Filter stories by selected topics or entities
  const matchingStories = stories.filter((story) => {
    const topicMatch = selectedTopics.some(
      (t) =>
        story.topic.toLowerCase().includes(t.toLowerCase()) ||
        story.category.toLowerCase().includes(t.toLowerCase())
    );
    const entityMatch = selectedEntities.some((e) =>
      story.entities.some((ent) => ent.toLowerCase().includes(e.toLowerCase()))
    );
    return topicMatch || entityMatch;
  });

  return (
    <div id="personalized-feed-container" className="max-w-6xl mx-auto py-4 space-y-6">
      {/* Header Configuration Box */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          isDark
            ? 'bg-zinc-900/40 border-zinc-800 shadow-xl'
            : 'bg-white border-zinc-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MY 5-MIN INTELLIGENCE FEED</span>
              </span>
              {isPro ? (
                <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                  PRO Unlocked
                </span>
              ) : (
                <span className="text-xs font-mono text-zinc-500">Free Preview (3 Topics)</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tailored 5-Minute Breaking Stream
            </h1>
            <p className={`text-xs sm:text-sm mt-1 max-w-xl ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Select the technologies, entities, and markets you track. The engine recalculates story relevance in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-breaking-alerts-btn"
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition border ${
                alertsEnabled
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{alertsEnabled ? 'Alerts: On' : 'Alerts: Muted'}</span>
            </button>
          </div>
        </div>

        {/* Topics Selector */}
        <div className="space-y-4 pt-4 border-t border-zinc-800/60">
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase font-semibold mb-2">
              Followed Topics & Categories:
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TOPICS.map((topic) => {
                const active = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    id={`pref-topic-${topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => toggleTopic(topic)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition flex items-center gap-1.5 ${
                      active
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                        : isDark
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-300'
                    }`}
                  >
                    {active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    <span>{topic}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Entities Selector */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase font-semibold mb-2">
              Tracked Companies & Entities:
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ENTITIES.map((entity) => {
                const active = selectedEntities.includes(entity);
                return (
                  <button
                    key={entity}
                    id={`pref-entity-${entity.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => toggleEntity(entity)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition flex items-center gap-1.5 ${
                      active
                        ? 'bg-violet-500 text-white font-bold shadow-sm'
                        : isDark
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-300'
                    }`}
                  >
                    {active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    <span>{entity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pro Plan Banner if not Pro */}
      {!isPro && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDark
              ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-zinc-200">
                Unlock Unlimited Real-Time AI Filters & Webhook Alerts
              </h4>
              <p className="text-[11px] text-zinc-400">
                Pro members receive sub-60s push notifications for custom tracked entities like OpenAI or Fed decisions.
              </p>
            </div>
          </div>

          <button
            id="personalized-pro-upgrade-btn"
            onClick={onOpenPricing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold text-xs shrink-0 hover:brightness-105 transition"
          >
            Upgrade for ₹249/mo
          </button>
        </div>
      )}

      {/* Filtered Stories List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base flex items-center gap-2">
            <span>Live Matched Stories</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400">
              {matchingStories.length} Matches
            </span>
          </h2>
          <span className="text-xs font-mono text-zinc-500">Live 5-min relevance scoring</span>
        </div>

        {matchingStories.length === 0 ? (
          <div
            className={`p-12 text-center rounded-3xl border ${
              isDark ? 'bg-zinc-900/30 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
            }`}
          >
            <Sparkles className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
            <p className="font-medium text-sm">No breaking stories matched your selected topics right now.</p>
            <p className="text-xs text-zinc-500 mt-1">Select more topics above or sync the 5-minute engine.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                viewMode="bento"
                onSelectStory={onSelectStory}
                onAskAIContext={onAskAIContext}
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
