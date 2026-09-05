import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  INITIAL_STORIES,
  INGESTION_SOURCES,
  TRENDING_TAGS,
  CATEGORIES,
  GDG_INDIA_EVENTS,
} from './data/newsStories';
import { NewsStory, Category, IngestionSource } from './types';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { CategoryFilter } from './components/CategoryFilter';
import { FiveMinuteBriefHero } from './components/FiveMinuteBriefHero';
import { StoryCard } from './components/StoryCard';
import { StoryDetailModal } from './components/StoryDetailModal';
import { FiveMinuteBriefView } from './components/FiveMinuteBriefView';
import { PersonalizedFeed } from './components/PersonalizedFeed';
import { NewsletterSection } from './components/NewsletterSection';
import { AdminDashboard } from './components/AdminDashboard';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';
import { SearchFilterModal } from './components/SearchFilterModal';
import { FlashRunningNews } from './components/FlashRunningNews';
import { AIChatBot } from './components/AIChatBot';
import { AudioPlayerDock, AudioPlayerState } from './components/AudioPlayerDock';
import { GDGEventsHub } from './components/GDGEventsHub';
import { SupportedLanguage } from './types';
import { RefreshCw, Radio, Sparkles, Volume2, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  // Theme state (default dark mode per user request: "Dark/light mode, Linear + Vercel + Perplexity style")
  const [isDark, setIsDark] = useState<boolean>(true);

  // Navigation tabs: 'home' | 'brief' | 'personalized' | 'newsletter' | 'admin'
  const [activeNav, setActiveNav] = useState<string>('home');

  // Stories and Sources state
  const [stories, setStories] = useState<NewsStory[]>(INITIAL_STORIES);
  const [sources, setSources] = useState<IngestionSource[]>(INGESTION_SOURCES);
  const [isIngesting, setIsIngesting] = useState<boolean>(false);

  // Filters and sorting
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedVelocity, setSelectedVelocity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('freshness');
  const [viewMode, setViewMode] = useState<'bento' | 'editorial' | 'compact'>('bento');

  // Modals
  const [selectedStory, setSelectedStory] = useState<NewsStory | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // User auth state
  const [user, setUser] = useState<{ name: string; email: string; isPro: boolean } | null>(null);

  // Language & Chat Bot State
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isChatBotOpen, setIsChatBotOpen] = useState<boolean>(false);
  const [activeChatStory, setActiveChatStory] = useState<NewsStory | null>(null);

  // Audio briefing & player dock state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    status: 'stopped',
    title: '',
    category: '',
    summary: '',
    speed: 1.0,
    currentIndex: 0,
    totalStories: 0,
  });

  const audioQueueRef = useRef<{ title: string; category: string; text: string }[]>([]);
  const audioCurrentIndexRef = useRef<number>(0);
  const audioSpeedRef = useRef<number>(1.0);

  // Metrics
  const [totalIngested, setTotalIngested] = useState<number>(1420);
  const [duplicatesBlocked, setDuplicatesBlocked] = useState<number>(348);
  const [aiSummariesCount, setAiSummariesCount] = useState<number>(892);

  // Live countdown timer for 5-minute ingestion cycle
  const [secondsUntilNextCycle, setSecondsUntilNextCycle] = useState<number>(274);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Periodic fetch from backend /api/news
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          if (data.stories && Array.isArray(data.stories) && data.stories.length > 0) {
            setStories(data.stories);
          }
        }
      } catch (err) {
        // In-memory fallback
      }
    };
    fetchLatest();
  }, []);

  // 5-minute countdown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsUntilNextCycle((prev) => {
        if (prev <= 1) {
          // Trigger cycle automatically
          triggerIngestCycle();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Trigger ingestion cycle (either scheduled, manual, or with custom topic)
  const triggerIngestCycle = async (customTopic?: string) => {
    setIsIngesting(true);
    try {
      const res = await fetch('/api/ingest/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customTopic }),
      });
      const data = await res.json();
      if (data.newStory) {
        setStories((prev) => [data.newStory, ...prev]);
        setTotalIngested((c) => c + 1);
        setAiSummariesCount((c) => c + 1);
      } else {
        // Simulated refresh
        setTotalIngested((c) => c + 4);
        setDuplicatesBlocked((c) => c + 2);
      }
    } catch {
      // Offline simulation
      if (customTopic) {
        const simulatedStory: NewsStory = {
          id: `story-${Date.now()}`,
          slug: customTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: customTopic,
          summary: `High-frequency dispatch: Strategic developments confirmed regarding ${customTopic}. Multi-source consensus established within 5 minutes.`,
          category: 'Technology',
          topic: customTopic,
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          minutesAgo: 1,
          isLive: true,
          entities: [customTopic, 'Technology', 'Breaking'],
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
          source: { name: 'Reuters Wire', url: 'https://reuters.com', reliabilityScore: 97 },
          sources: [{ name: 'Reuters', url: 'https://reuters.com', reliabilityScore: 97 }],
          importanceScore: 96,
          velocity: 'breaking',
          whatChanged: [
            `Wire dispatch issued 1 minute ago.`,
            `Key regulatory and market participants notified.`,
          ],
          timeline: [
            { time: 'Just now', title: 'Breaking Flash', source: 'Reuters', detail: 'Initial announcement' },
          ],
          aiContext: {
            whyItMatters: `Triggers rapid realignment across peer organizations and capital allocations.`,
            background: `Develops on existing strategic initiatives.`,
            outlook: `Monitoring downstream impacts for next 48 hours.`,
            sentiment: 'neutral',
            confidenceScore: 98,
          },
          seo: {
            title: `${customTopic} | 5MIN NEWS`,
            metaDescription: `Real-time 5-minute analysis of ${customTopic}.`,
            canonicalUrl: `https://5minnews.io/news/technology/${customTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            keywords: ['breaking news', customTopic],
          },
          readTime: '1 min read',
          viewsCount: 420,
        };
        setStories((prev) => [simulatedStory, ...prev]);
        setTotalIngested((c) => c + 1);
      }
    } finally {
      setIsIngesting(false);
    }
  };

  // Toggle wire source
  const handleToggleSource = (id: string) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'online' ? 'paused' : 'online' }
          : s
      )
    );
  };

  // Central Audio Playback Engine
  const speakItem = (index: number, speed: number) => {
    if (!('speechSynthesis' in window)) return;
    const queue = audioQueueRef.current;
    if (!queue || index >= queue.length || index < 0) {
      window.speechSynthesis.cancel();
      setAudioState((prev) => ({ ...prev, status: 'stopped' }));
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    audioCurrentIndexRef.current = index;
    audioSpeedRef.current = speed;

    const item = queue[index];
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.rate = speed;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (audioCurrentIndexRef.current + 1 < audioQueueRef.current.length) {
        speakItem(audioCurrentIndexRef.current + 1, audioSpeedRef.current);
      } else {
        setAudioState((prev) => ({ ...prev, status: 'stopped' }));
        setIsPlayingAudio(false);
      }
    };

    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      setAudioState((prev) => ({ ...prev, status: 'stopped' }));
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setAudioState({
      status: 'playing',
      title: item.title,
      category: item.category,
      summary: item.text,
      speed,
      currentIndex: index,
      totalStories: queue.length,
    });
    setIsPlayingAudio(true);
  };

  // Play full 5-minute executive briefing
  const handlePlayAudioBrief = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (audioState.status === 'playing') {
      window.speechSynthesis.pause();
      setAudioState((prev) => ({ ...prev, status: 'paused' }));
      setIsPlayingAudio(false);
      return;
    }

    if (audioState.status === 'paused') {
      window.speechSynthesis.resume();
      if (!window.speechSynthesis.speaking) {
        speakItem(audioCurrentIndexRef.current, audioSpeedRef.current);
      } else {
        setAudioState((prev) => ({ ...prev, status: 'playing' }));
        setIsPlayingAudio(true);
      }
      return;
    }

    const topStories = [...stories]
      .sort((a, b) => b.importanceScore - a.importanceScore)
      .slice(0, 5);

    const queue = topStories.map((s, idx) => ({
      title: s.title,
      category: s.category,
      text: `Story ${idx + 1} of ${topStories.length}. In ${s.category}: ${s.title}. ${s.summary}. Why this matters: ${s.aiContext.whyItMatters}.`,
    }));

    audioQueueRef.current = queue;
    speakItem(0, audioState.speed || 1.0);
  };

  // Play single story (from Flash Running News, Card, or Modal)
  const handlePlaySingleStoryAudio = (story: NewsStory) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    const text = `Flash tech wire. In ${story.category}: ${story.title}. What changed in the last 5 minutes: ${story.whatChanged.join('. ')}. Why this matters: ${story.aiContext.whyItMatters}.`;

    audioQueueRef.current = [
      {
        title: story.title,
        category: story.category,
        text,
      },
    ];

    speakItem(0, audioState.speed || 1.0);
  };

  // Toggle Play / Pause
  const handleToggleAudioPlayPause = () => {
    if (!('speechSynthesis' in window)) return;

    if (audioState.status === 'playing') {
      window.speechSynthesis.pause();
      setAudioState((prev) => ({ ...prev, status: 'paused' }));
      setIsPlayingAudio(false);
    } else if (audioState.status === 'paused') {
      window.speechSynthesis.resume();
      if (!window.speechSynthesis.speaking) {
        speakItem(audioCurrentIndexRef.current, audioSpeedRef.current);
      } else {
        setAudioState((prev) => ({ ...prev, status: 'playing' }));
        setIsPlayingAudio(true);
      }
    } else if (audioState.status === 'stopped') {
      handlePlayAudioBrief();
    }
  };

  // Change Speed: Slow (0.75x), Normal (1.0x), Fast (1.25x), Fast+ (1.5x), 2x (2.0x)
  const handleSetAudioSpeed = (newSpeed: number) => {
    audioSpeedRef.current = newSpeed;
    setAudioState((prev) => ({ ...prev, speed: newSpeed }));

    // If currently active, immediately re-speak current item at new speed
    if (audioState.status === 'playing' && audioQueueRef.current.length > 0) {
      speakItem(audioCurrentIndexRef.current, newSpeed);
    }
  };

  // Stop audio
  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAudioState((prev) => ({ ...prev, status: 'stopped' }));
    setIsPlayingAudio(false);
  };

  // Next / Previous story in audio queue
  const handleNextAudioStory = () => {
    if (audioCurrentIndexRef.current + 1 < audioQueueRef.current.length) {
      speakItem(audioCurrentIndexRef.current + 1, audioSpeedRef.current);
    }
  };

  const handlePrevAudioStory = () => {
    if (audioCurrentIndexRef.current > 0) {
      speakItem(audioCurrentIndexRef.current - 1, audioSpeedRef.current);
    }
  };

  // Filtered & Sorted stories
  const filteredStories = useMemo(() => {
    return stories
      .filter((story) => {
        const catMatch = selectedCategory === 'All' || story.category === selectedCategory;
        const velMatch = selectedVelocity === 'all' || story.velocity === selectedVelocity;
        return catMatch && velMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'importance') {
          return b.importanceScore - a.importanceScore;
        }
        if (sortBy === 'velocity') {
          const rank = { breaking: 3, surging: 2, developing: 1, stable: 0 };
          return rank[b.velocity] - rank[a.velocity];
        }
        // default freshness
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [stories, selectedCategory, selectedVelocity, sortBy]);

  const newestBreakingStory = stories.find((s) => s.velocity === 'breaking') || stories[0];

  return (
    <div
      id="app-root-container"
      className={`min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950 transition-colors ${
        isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
      }`}
    >
      {/* 1. Header */}
      <Header
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={() => setUser(null)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        isIngesting={isIngesting}
        onTriggerIngest={() => triggerIngestCycle()}
        nextCycleSeconds={secondsUntilNextCycle}
      />

      {/* 2. Flash Running News Wire Bar with Chat Bot & Audio Speed Controls */}
      <FlashRunningNews
        stories={stories}
        onSelectStory={(s) => setSelectedStory(s)}
        onOpenChat={(s) => {
          setActiveChatStory(s || null);
          setIsChatBotOpen(true);
        }}
        onPlayAudioStory={(s) => handlePlaySingleStoryAudio(s)}
        currentLanguage={currentLanguage}
        isDark={isDark}
      />

      {/* 3. Top Breaking Ticker */}
      <BreakingTicker
        story={newestBreakingStory}
        onSelectStory={(s) => setSelectedStory(s)}
        onPlayAudioBrief={handlePlayAudioBrief}
        isDark={isDark}
      />

      {/* 3. Main Views router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeNav === 'home' && (
          <div className="space-y-6">
            {/* 5-Minute Brief Hero Section & Live Ticker */}
            <FiveMinuteBriefHero
              stories={stories}
              trendingTags={TRENDING_TAGS}
              onSelectStory={(s) => setSelectedStory(s)}
              onSelectTag={(tag) => {
                setIsSearchOpen(true);
              }}
              onPlayAudioBrief={handlePlayAudioBrief}
              isDark={isDark}
            />

            {/* Category Filter & View Mode bar */}
            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedVelocity={selectedVelocity}
              onSelectVelocity={setSelectedVelocity}
              sortBy={sortBy}
              onSelectSort={setSortBy}
              viewMode={viewMode}
              onSelectViewMode={setViewMode}
              isDark={isDark}
            />

            {/* Stories Grid / Stream */}
            <div id="stories-feed-container">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-zinc-400">
                    {selectedCategory === 'All' ? 'ALL LIVE CHANNELS' : `${selectedCategory.toUpperCase()} CHANNEL`}
                  </h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-bold">
                    {filteredStories.length} stories
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  Refreshed dynamically from verified wires
                </span>
              </div>

              {filteredStories.length === 0 ? (
                <div
                  className={`p-12 text-center rounded-3xl border ${
                    isDark ? 'bg-zinc-900/30 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                  }`}
                >
                  <Radio className="w-8 h-8 mx-auto text-zinc-600 mb-2 animate-pulse" />
                  <p className="font-semibold text-sm">No stories currently in this filter view.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedVelocity('all');
                    }}
                    className="mt-2 text-xs text-amber-500 hover:underline font-mono"
                  >
                    Reset filters to view all breaking dispatches
                  </button>
                </div>
              ) : viewMode === 'bento' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      viewMode="bento"
                      onSelectStory={(s) => setSelectedStory(s)}
                      onAskAIContext={(s) => setSelectedStory(s)}
                      isDark={isDark}
                    />
                  ))}
                </div>
              ) : viewMode === 'editorial' ? (
                <div className="space-y-4 max-w-4xl mx-auto">
                  {filteredStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      viewMode="editorial"
                      onSelectStory={(s) => setSelectedStory(s)}
                      onAskAIContext={(s) => setSelectedStory(s)}
                      isDark={isDark}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className={`rounded-2xl border overflow-hidden ${
                    isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  {filteredStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      viewMode="compact"
                      onSelectStory={(s) => setSelectedStory(s)}
                      onAskAIContext={(s) => setSelectedStory(s)}
                      isDark={isDark}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeNav === 'brief' && (
          <FiveMinuteBriefView
            stories={stories}
            onSelectStory={(s) => setSelectedStory(s)}
            isDark={isDark}
            onPlayAudioBrief={handlePlayAudioBrief}
            isPlayingAudio={isPlayingAudio}
          />
        )}

        {activeNav === 'gdg-events' && (
          <GDGEventsHub
            events={GDG_INDIA_EVENTS}
            gdgNews={stories.filter((s) => s.category === 'GDG & Events')}
            onSelectStory={(s) => setSelectedStory(s)}
            onOpenChatWithEvent={(evt) => {
              setActiveChatStory({
                id: evt.id,
                title: `${evt.title} (${evt.city})`,
                slug: `gdg-event-${evt.id}`,
                category: 'GDG & Events',
                summary: `${evt.title} organized by ${evt.organizer} on ${evt.date} at ${evt.venue}. Description: ${evt.description}. Topics: ${evt.topics.join(', ')}. Keynote speakers: ${evt.speakers.map((s) => `${s.name} (${s.company}${s.isGDE ? ', GDE' : ''})`).join(', ')}.`,
                source: { name: evt.organizer, url: evt.rsvpUrl, reliabilityScore: 99 },
                sources: [{ name: evt.organizer, url: evt.rsvpUrl, reliabilityScore: 99 }],
                publishedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                minutesAgo: 1,
                importanceScore: 96,
                velocity: 'surging',
                isLive: true,
                whatChanged: [
                  `Status: ${evt.status} (${evt.attendeesCount} / ${evt.capacity} seats filled)`,
                  `Keynotes: ${evt.speakers.map((s) => s.name).join(', ')}`,
                  `Format: ${evt.format} at ${evt.venue}`,
                ],
                timeline: [{ time: evt.time, title: evt.date, detail: evt.venue, source: evt.organizer }],
                aiContext: {
                  background: evt.description,
                  whyItMatters: `Connects Indian developers with Google technologies including Gemini 2.5 Flash, Gemma 3, and Android 16.`,
                  sentiment: 'bullish',
                  confidenceScore: 98,
                },
                entities: [evt.city, evt.organizer, ...evt.topics],
                topic: evt.type,
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
                readTime: '2 min read',
                viewsCount: evt.attendeesCount,
              });
              setIsChatBotOpen(true);
            }}
            onPlayAudioForEvent={(evt) => {
              if (!('speechSynthesis' in window)) {
                alert('Speech synthesis is not supported in this browser.');
                return;
              }
              const text = `Google Developer Event briefing for India. ${evt.title}. Organized by ${evt.organizer}. Taking place on ${evt.date} from ${evt.time} at ${evt.venue}. Description: ${evt.description}. Key topics include ${evt.topics.join(', ')}. Keynote speakers include ${evt.speakers.map((s) => `${s.name} from ${s.company}`).join(', ')}. Registration status is currently ${evt.status} with ${evt.attendeesCount} out of ${evt.capacity} seats reserved.`;
              audioQueueRef.current = [
                {
                  title: evt.title,
                  category: 'GDG & Events',
                  text,
                },
              ];
              speakItem(0, audioState.speed || 1.0);
            }}
            isDark={isDark}
          />
        )}

        {(activeNav === 'personalized' || activeNav === 'foryou') && (
          <PersonalizedFeed
            stories={stories}
            onSelectStory={(s) => setSelectedStory(s)}
            onAskAIContext={(s) => setSelectedStory(s)}
            isDark={isDark}
            isPro={user?.isPro || false}
            onOpenPricing={() => setIsPricingOpen(true)}
          />
        )}

        {activeNav === 'newsletter' && <NewsletterSection isDark={isDark} />}

        {activeNav === 'admin' && (
          <AdminDashboard
            sources={sources}
            onToggleSource={handleToggleSource}
            onTriggerIngest={triggerIngestCycle}
            isIngesting={isIngesting}
            isDark={isDark}
            totalIngested={totalIngested}
            duplicatesBlocked={duplicatesBlocked}
            aiSummariesCount={aiSummariesCount}
          />
        )}
      </main>

      {/* 4. Footer */}
      <footer
        id="app-footer"
        className={`border-t py-8 text-xs font-mono transition-colors ${
          isDark ? 'bg-zinc-950 border-zinc-900 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-amber-500 text-zinc-950 font-black flex items-center justify-center text-[10px]">
              5M
            </div>
            <span className="font-bold text-zinc-300">5MIN NEWS</span>
            <span>— “Everything important that changed in the last 5 minutes.”</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button onClick={() => setActiveNav('brief')} className="hover:text-amber-400">
              5-Min Brief
            </button>
            <button onClick={() => setActiveNav('personalized')} className="hover:text-amber-400">
              Personalized
            </button>
            <button onClick={() => setActiveNav('newsletter')} className="hover:text-amber-400">
              Newsletter
            </button>
            <button onClick={() => setIsPricingOpen(true)} className="hover:text-amber-400">
              Pricing (₹199/mo)
            </button>
            <button onClick={() => setActiveNav('admin')} className="hover:text-amber-400">
              Engine Control
            </button>
          </div>
        </div>
      </footer>

      {/* 5. Modals & Overlays */}
      {selectedStory && (
        <StoryDetailModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onSelectRelated={(s) => setSelectedStory(s)}
          onOpenChatWithStory={(s) => {
            setActiveChatStory(s);
            setIsChatBotOpen(true);
          }}
          onPlayAudioStory={(s) => handlePlaySingleStoryAudio(s)}
          allStories={stories}
          isDark={isDark}
        />
      )}

      {/* Floating Audio Player Dock (Play/Pause, Fast/Slow, Skip, Stop) */}
      <AudioPlayerDock
        playerState={audioState}
        onTogglePlayPause={handleToggleAudioPlayPause}
        onSetSpeed={handleSetAudioSpeed}
        onStop={handleStopAudio}
        onNext={handleNextAudioStory}
        onPrev={handlePrevAudioStory}
        onOpenChat={() => setIsChatBotOpen(true)}
        isDark={isDark}
      />

      {/* AI Copilot Chat Bot (Multi-language, Story Context, Technical & SEO intelligence) */}
      <AIChatBot
        stories={stories}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onSelectStory={(s) => setSelectedStory(s)}
        isDark={isDark}
        isOpen={isChatBotOpen}
        onOpen={() => setIsChatBotOpen(true)}
        onClose={() => {
          setIsChatBotOpen(false);
          setActiveChatStory(null);
        }}
        activeStoryContext={activeChatStory}
        onClearStoryContext={() => setActiveChatStory(null)}
      />

      <SearchFilterModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stories={stories}
        onSelectStory={(s) => setSelectedStory(s)}
        categories={CATEGORIES.filter((c) => c !== 'All')}
        isDark={isDark}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        isPro={user?.isPro || false}
        onSetPro={(isPro) => {
          if (user) {
            setUser({ ...user, isPro });
          } else {
            setUser({ name: 'Pro Subscriber', email: 'user@example.com', isPro });
          }
        }}
        isDark={isDark}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
        isDark={isDark}
      />
    </div>
  );
}
