import React, { useState, useMemo } from 'react';
import { GDGEvent, GDGEventType, NewsStory } from '../types';
import {
  Calendar,
  MapPin,
  Users,
  Sparkles,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Mic,
  MessageSquare,
  Award,
  Bookmark,
  Share2,
  Radio,
  Tag,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

interface GDGEventsHubProps {
  events: GDGEvent[];
  gdgNews: NewsStory[];
  onSelectStory: (story: NewsStory) => void;
  onOpenChatWithEvent: (event: GDGEvent) => void;
  onPlayAudioForEvent: (event: GDGEvent) => void;
  isDark: boolean;
}

const CITIES = [
  'All Cities',
  'Bengaluru',
  'New Delhi',
  'Hyderabad',
  'Mumbai',
  'Pune',
  'Kolkata',
  'Gurugram',
];

const EVENT_TYPES: ('All Types' | GDGEventType)[] = [
  'All Types',
  'DevFest 2026',
  'Google I/O Connect',
  'Build with AI',
  'Cloud Community Day',
  'Women Techmakers',
];

export const GDGEventsHub: React.FC<GDGEventsHubProps> = ({
  events,
  gdgNews,
  onSelectStory,
  onOpenChatWithEvent,
  onPlayAudioForEvent,
  isDark,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Toggle registration simulation
  const toggleRegistration = (eventId: string) => {
    setRegisteredEventIds((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  // Share / Copy link
  const handleShare = (event: GDGEvent) => {
    navigator.clipboard?.writeText(`${event.title} - ${event.date} at ${event.venue}`);
    setCopiedId(event.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const cityMatch =
        selectedCity === 'All Cities' ||
        evt.city.toLowerCase() === selectedCity.toLowerCase();

      const typeMatch =
        selectedType === 'All Types' || evt.type === selectedType;

      const q = searchQuery.toLowerCase();
      const searchMatch =
        !searchQuery ||
        evt.title.toLowerCase().includes(q) ||
        evt.organizer.toLowerCase().includes(q) ||
        evt.city.toLowerCase().includes(q) ||
        evt.topics.some((t) => t.toLowerCase().includes(q)) ||
        evt.speakers.some((s) => s.name.toLowerCase().includes(q) || s.company.toLowerCase().includes(q));

      return cityMatch && typeMatch && searchMatch;
    });
  }, [events, selectedCity, selectedType, searchQuery]);

  const featuredEvent = events.find((e) => e.isFeatured) || events[0];

  return (
    <div id="gdg-events-hub" className="space-y-8 pb-12">
      {/* 1. Header Banner */}
      <div
        className={`relative rounded-3xl p-6 sm:p-8 border overflow-hidden transition-all ${
          isDark
            ? 'bg-gradient-to-br from-blue-950/40 via-zinc-900/60 to-amber-950/30 border-zinc-800'
            : 'bg-gradient-to-br from-blue-50 via-white to-amber-50/50 border-zinc-200'
        }`}
      >
        {/* Glow overlay */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Official Community Wire
              </span>
              <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                Google for Developers India Ecosystem
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Synced with GDG Community Central</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Google Developer Groups (GDG) India & Events Hub
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Real-time tracking of India’s largest developer community network. Explore DevFest 2026, Google I/O Connect India, Build with AI hackathons, and Cloud Community Days across 35+ Indian cities with instant AI insights & audio briefings.
          </p>

          {/* Ecosystem KPI counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
              <div className="text-xl sm:text-2xl font-black font-mono text-blue-400">65+</div>
              <div className="text-[11px] font-medium text-zinc-400 mt-0.5">Active GDG Chapters in India</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">250,000+</div>
              <div className="text-[11px] font-medium text-zinc-400 mt-0.5">Community Engineers & Students</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">35+</div>
              <div className="text-[11px] font-medium text-zinc-400 mt-0.5">DevFest 2026 Host Cities</div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
              <div className="text-xl sm:text-2xl font-black font-mono text-rose-400">150+</div>
              <div className="text-[11px] font-medium text-zinc-400 mt-0.5">Google Developer Experts (GDEs)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GDG India 5-Minute Breaking News Wire */}
      {gdgNews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-300">
                Latest GDG India & Google Events Wire Updates
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">Updated within 5 minutes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gdgNews.slice(0, 4).map((story) => (
              <div
                key={story.id}
                id={`gdg-news-card-${story.id}`}
                onClick={() => onSelectStory(story)}
                className={`group p-4 rounded-2xl border cursor-pointer transition-all hover:border-amber-500/50 hover:shadow-lg ${
                  isDark ? 'bg-zinc-900/50 border-zinc-800/90' : 'bg-white border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-mono mb-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                    {story.topic || 'GDG Community'}
                  </span>
                  <span className="text-zinc-500">{story.minutesAgo}m ago</span>
                </div>

                <h3 className="font-bold text-sm sm:text-base leading-snug group-hover:text-amber-400 transition-colors line-clamp-2">
                  {story.title}
                </h3>

                <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {story.summary}
                </p>

                <div className="mt-3 pt-3 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>Source: {story.source.name}</span>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    Read Brief <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Search and Filter Bar */}
      <div
        id="gdg-events-filters"
        className={`p-4 rounded-2xl border space-y-3 transition-colors ${
          isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search DevFest, I/O Connect, city, Gemini, Android, speakers..."
              className={`w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-colors ${
                isDark
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-500'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick city dropdown */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? 'bg-blue-600 text-white font-semibold shadow'
                    : isDark
                    ? 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                    : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Event Type Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : isDark
                  ? 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <span>Upcoming Google Developer Events in India</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-400 text-xs">
              {filteredEvents.length} events
            </span>
          </h2>
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
            Official RSVP & Community Portals
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div
            className={`p-12 text-center rounded-3xl border ${
              isDark ? 'bg-zinc-900/30 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            <Calendar className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
            <h3 className="font-bold text-base">No events found matching filters</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
              Try changing the selected city, clearing your search query, or selecting "All Types".
            </p>
            <button
              onClick={() => {
                setSelectedCity('All Cities');
                setSelectedType('All Types');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-1.5 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold hover:bg-amber-400 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredEvents.map((evt) => {
              const isRegistered = registeredEventIds.has(evt.id);
              const capacityPercent = Math.min(
                100,
                Math.round((evt.attendeesCount / evt.capacity) * 100)
              );

              return (
                <div
                  key={evt.id}
                  id={`gdg-event-card-${evt.id}`}
                  className={`rounded-2xl border p-5 sm:p-6 transition-all hover:shadow-xl flex flex-col justify-between ${
                    evt.isFeatured
                      ? isDark
                        ? 'bg-gradient-to-b from-blue-950/20 via-zinc-900/60 to-zinc-900/40 border-blue-500/40'
                        : 'bg-gradient-to-b from-blue-50/50 via-white to-white border-blue-300'
                      : isDark
                      ? 'bg-zinc-900/40 border-zinc-800'
                      : 'bg-white border-zinc-200'
                  }`}
                >
                  <div>
                    {/* Top badging */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {evt.type}
                        </span>
                        {evt.badge && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {evt.badge}
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                          evt.status === 'Registration Open'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : evt.status === 'Filling Fast'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </div>

                    {/* Title & Organizer */}
                    <h3 className="text-base sm:text-lg font-extrabold leading-snug tracking-tight">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-1">
                      <span>Organized by</span>
                      <span className="font-semibold text-zinc-200">{evt.organizer}</span>
                    </div>

                    {/* Metadata pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs">
                      <div className="flex items-center gap-2 text-zinc-300 font-mono">
                        <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 font-mono">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-start gap-2 text-zinc-300 font-mono col-span-1 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{evt.venue}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Tech Topics */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {evt.topics.map((topic) => (
                        <span
                          key={topic}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                            isDark
                              ? 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60'
                              : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>

                    {/* Speakers & GDEs */}
                    {evt.speakers.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-zinc-800/50">
                        <div className="text-[11px] font-mono text-zinc-400 mb-2 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>Featured Keynote Speakers & GDEs</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {evt.speakers.map((spk, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded-xl text-xs flex items-center justify-between gap-2 border ${
                                isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                              }`}
                            >
                              <div className="truncate">
                                <div className="font-semibold text-zinc-200 truncate flex items-center gap-1">
                                  {spk.name}
                                  {spk.isGDE && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                      GDE
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-zinc-400 truncate">
                                  {spk.role} • {spk.company}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Capacity meter */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Seats Filled</span>
                        </span>
                        <span className="font-semibold text-zinc-300">
                          {evt.attendeesCount} / {evt.capacity} ({capacityPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            capacityPercent > 90
                              ? 'bg-rose-500'
                              : capacityPercent > 75
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${capacityPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-5 pt-4 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Audio Briefing Button */}
                      <button
                        onClick={() => onPlayAudioForEvent(evt)}
                        title="Listen to audio briefing for this event"
                        className={`p-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors ${
                          isDark
                            ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Audio</span>
                      </button>

                      {/* Ask AI Copilot Button */}
                      <button
                        onClick={() => onOpenChatWithEvent(evt)}
                        title="Ask AI Copilot about this event's agenda, topics, and preparation tips"
                        className={`p-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors ${
                          isDark
                            ? 'bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-800/60'
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                        <span>Ask AI Copilot</span>
                      </button>

                      {/* Share / Copy */}
                      <button
                        onClick={() => handleShare(evt)}
                        title="Share event details"
                        className={`p-2 rounded-xl text-xs transition-colors ${
                          copiedId === evt.id
                            ? 'bg-emerald-500 text-zinc-950 font-bold'
                            : isDark
                            ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                        }`}
                      >
                        {copiedId === evt.id ? (
                          <span className="text-[10px] font-mono">Copied!</span>
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Primary RSVP Action */}
                    <div className="flex items-center gap-2">
                      <button
                        id={`rsvp-btn-${evt.id}`}
                        onClick={() => toggleRegistration(evt.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                          isRegistered
                            ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
                            : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Registered ✓</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-4 h-4" />
                            <span>RSVP Free</span>
                          </>
                        )}
                      </button>

                      <a
                        href={evt.rsvpUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-2 rounded-xl border transition-colors ${
                          isDark
                            ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                            : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600'
                        }`}
                        title="Open official community.dev page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. GDG Chapter Directory Explorer across India */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 transition-colors ${
          isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight">
              Explore 65+ Google Developer Group Chapters Across India
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Connect directly with local chapter leads, attend monthly hack nights, and join the official community.dev channels.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 font-semibold shrink-0">
            India Community Network
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono">
          {[
            { city: 'Bengaluru', count: '18k members' },
            { city: 'New Delhi', count: '15k members' },
            { city: 'Hyderabad', count: '14k members' },
            { city: 'Mumbai', count: '12k members' },
            { city: 'Pune', count: '11k members' },
            { city: 'Kolkata', count: '9k members' },
            { city: 'Chennai', count: '10k members' },
            { city: 'Ahmedabad', count: '8k members' },
            { city: 'Chandigarh', count: '6k members' },
            { city: 'Kochi', count: '7k members' },
            { city: 'Jaipur', count: '6.5k members' },
            { city: 'Indore', count: '5k members' },
          ].map((item) => (
            <div
              key={item.city}
              onClick={() => {
                setSelectedCity(item.city);
                const el = document.getElementById('gdg-events-filters');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
                selectedCity === item.city
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                  : isDark
                  ? 'bg-zinc-950/80 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                  : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-300'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>GDG {item.city}</span>
                <ChevronRight className="w-3 h-3 text-zinc-500" />
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
