export type Category =
  | 'All'
  | 'Technology'
  | 'AI'
  | 'SEO'
  | 'GDG & Events'
  | 'Cybersecurity'
  | 'Startups'
  | 'India Tech'
  | 'Global Tech'
  | 'DevTools'
  | 'Markets'
  | 'Business'
  | 'World'
  | 'India'
  | 'Science'
  | 'Sports';

export type SupportedLanguage =
  | 'en' // English (Global)
  | 'hi' // हिन्दी (Hindi - National)
  | 'bn' // বাংলা (Bengali - National)
  | 'ta' // தமிழ் (Tamil - National)
  | 'te' // తెలుగు (Telugu - National)
  | 'mr' // मराठी (Marathi - National)
  | 'es' // Español (Spanish - International)
  | 'fr' // Français (French - International)
  | 'de' // Deutsch (German - International)
  | 'ja' // 日本語 (Japanese - International)
  | 'zh' // 中文 (Chinese - International)
  | 'ar' // العربية (Arabic - International)
  | 'ru'; // Русский (Russian - International)

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  isNational: boolean; // National (Indian languages) vs International
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  sourcesReferenced?: string[];
}

export interface NewsletterSubscription {
  email: string;
  cadence: '5min' | 'daily' | 'weekly';
  topics: string[];
  language: SupportedLanguage;
  tier: 'free' | 'pro' | 'business';
  subscribedAt: string;
}

export type StoryVelocity = 'breaking' | 'surging' | 'developing' | 'steady';

export interface NewsSource {
  name: string;
  url: string;
  reliabilityScore: number; // e.g. 96
  quote?: string;
}

export interface TimelineUpdate {
  time: string;
  title: string;
  detail: string;
  source: string;
}

export interface AIContext {
  background: string;
  whyItMatters: string;
  outlook: string;
  sentiment: 'neutral' | 'bullish' | 'bearish' | 'critical';
  confidenceScore: number;
}

export interface SEOMetadata {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string[];
}

export interface NewsStory {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: Category;
  source: NewsSource;
  sources: NewsSource[];
  publishedAt: string; // ISO string
  updatedAt: string; // ISO string
  minutesAgo: number;
  importanceScore: number; // 1-100
  velocity: StoryVelocity;
  isLive: boolean;
  whatChanged: string[];
  timeline: TimelineUpdate[];
  aiContext: AIContext;
  entities: string[];
  topic: string;
  image: string;
  readTime: string;
  viewsCount: number;
  seo: SEOMetadata;
  isAiSynthesized?: boolean;
}

export interface FiveMinuteBrief {
  generatedAt: string;
  cadence: string;
  stories: NewsStory[];
  keyTakeaway: string;
  audioDuration: string;
}

export interface IngestionPipelineMetric {
  stage: string;
  status: 'active' | 'success' | 'queued';
  latencyMs: number;
  itemCount: number;
  details: string;
}

export interface IngestionSource {
  id: string;
  name: string;
  category: Category;
  feedUrl: string;
  fetchIntervalMinutes: number;
  status: 'online' | 'paused' | 'error';
  lastPolled: string;
  storiesLastHour: number;
  reliability: number;
}

export interface UserSubscriptionTier {
  id: 'free' | 'pro' | 'business' | 'enterprise';
  name: string;
  priceINR: number;
  billingPeriod: string;
  features: string[];
  popular?: boolean;
}

export interface UserPreferences {
  selectedTopics: string[];
  followedEntities: string[];
  breakingAlertsEnabled: boolean;
  digestCadence: '5min' | 'morning' | 'evening';
  viewMode: 'compact' | 'editorial' | 'cards';
  soundEnabled: boolean;
}

export type GDGEventType =
  | 'DevFest 2026'
  | 'Google I/O Connect'
  | 'Build with AI'
  | 'Cloud Community Day'
  | 'Women Techmakers'
  | 'Solution Challenge';

export interface GDGEventSpeaker {
  name: string;
  role: string;
  company: string;
  isGDE?: boolean; // Google Developer Expert
  avatarUrl?: string;
}

export interface GDGEvent {
  id: string;
  title: string;
  organizer: string; // e.g., 'GDG Bengaluru', 'GDG New Delhi', 'Google for Developers India'
  city: string; // 'Bengaluru', 'New Delhi', 'Hyderabad', 'Mumbai', 'Pune', 'Chennai', etc.
  state: string;
  date: string;
  time: string;
  venue: string;
  format: 'In-Person' | 'Hybrid' | 'Online';
  type: GDGEventType;
  status: 'Registration Open' | 'Filling Fast' | 'Waitlist' | 'Closing Soon';
  attendeesCount: number;
  capacity: number;
  description: string;
  topics: string[];
  speakers: GDGEventSpeaker[];
  rsvpUrl: string;
  isFeatured?: boolean;
  badge?: string;
}

