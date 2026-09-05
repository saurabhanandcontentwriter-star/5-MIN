import React, { useState } from 'react';
import {
  X,
  Clock,
  Radio,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Send,
  Loader2,
  Share2,
  Bookmark,
  Check,
  Code2,
  Globe,
  FileText,
  Volume2,
  Pause,
  Play,
  Bot,
} from 'lucide-react';
import { NewsStory } from '../types';
import { formatMinutesAgo, getCategoryBadgeClass } from '../utils/formatters';
import { ReliableImage } from './ReliableImage';

interface StoryDetailModalProps {
  story: NewsStory | null;
  onClose: () => void;
  onSelectRelated: (story: NewsStory) => void;
  onOpenChatWithStory?: (story: NewsStory) => void;
  onPlayAudioStory?: (story: NewsStory) => void;
  allStories: NewsStory[];
  isDark: boolean;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  onClose,
  onSelectRelated,
  onOpenChatWithStory,
  onPlayAudioStory,
  allStories,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'story' | 'aiContext' | 'seo'>('story');
  const [userQuestion, setUserQuestion] = useState('');
  const [aiAnswers, setAiAnswers] = useState<Array<{ q: string; a: string; provider: string }>>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!story) return null;

  const relatedStories = allStories
    .filter((s) => s.id !== story.id && (s.category === story.category || s.topic === story.topic))
    .slice(0, 3);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim() || isAsking) return;

    const q = userQuestion.trim();
    setUserQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/gemini/ask-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyTitle: story.title,
          storySummary: story.summary,
          question: q,
        }),
      });
      const data = await res.json();
      setAiAnswers((prev) => [
        ...prev,
        {
          q,
          a: data.answer || 'No analysis returned.',
          provider: data.provider || 'Gemini 3.8 Flash',
        },
      ]);
    } catch (err) {
      setAiAnswers((prev) => [
        ...prev,
        {
          q,
          a: 'Could not connect to AI Engine. Verified story details remain accurate in the briefing above.',
          provider: 'Local Cache',
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(story.seo.canonicalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeech = () => {
    if (onPlayAudioStory) {
      onPlayAudioStory(story);
      setIsSpeaking(true);
      return;
    }

    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const textToRead = `${story.title}. What changed in the last 5 minutes: ${story.whatChanged.join('. ')}. Why it matters: ${story.aiContext.whyItMatters}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div
      id="story-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="story-detail-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl max-h-[90vh] rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-all my-auto ${
          isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Top Sticky Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md ${
            isDark ? 'bg-zinc-950/90 border-zinc-800' : 'bg-white/90 border-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getCategoryBadgeClass(
                story.category,
                isDark
              )}`}
            >
              {story.category}
            </span>
            <span className="text-xs font-mono text-zinc-500">
              Updated {formatMinutesAgo(story.publishedAt)}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-xs font-mono text-amber-500 font-bold">
              Score {story.importanceScore}/100
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              id="story-detail-external-ref-btn"
              href={story.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 px-2.5 rounded-xl text-xs font-mono border flex items-center gap-1.5 transition ${
                isDark
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-amber-400 hover:text-amber-300'
                  : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-amber-600'
              }`}
              title={`Visit reference source: ${story.source.name}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reference ↗</span>
            </a>

            {onOpenChatWithStory && (
              <button
                id="story-detail-chat-bot-btn"
                onClick={() => {
                  onOpenChatWithStory(story);
                  onClose();
                }}
                className="p-2 px-3 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 transition bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 border-amber-500 shadow-md shadow-amber-500/20"
                title="Ask AI Chat Bot about this story"
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask Bot</span>
              </button>
            )}

            <button
              id="story-detail-listen-btn"
              onClick={handleSpeech}
              className={`p-2 rounded-xl text-xs font-mono border flex items-center gap-1.5 transition ${
                isSpeaking
                  ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold'
                  : isDark
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
                  : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-800'
              }`}
              title="Listen to story"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isSpeaking ? 'Playing...' : 'Audio Brief'}</span>
            </button>

            <button
              id="story-detail-share-btn"
              onClick={handleCopyLink}
              className={`p-2 rounded-xl border transition ${
                isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'
              }`}
              title="Copy Canonical URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-zinc-400" />}
            </button>

            <button
              id="story-detail-close-btn"
              onClick={onClose}
              className={`p-2 rounded-xl border transition ${
                isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'
              }`}
              title="Close modal"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div
          className={`px-6 py-2 border-b flex items-center gap-2 text-xs font-mono ${
            isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
          }`}
        >
          <button
            id="tab-btn-story-overview"
            onClick={() => setActiveTab('story')}
            className={`px-3 py-1 rounded-lg transition ${
              activeTab === 'story'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'hover:text-zinc-200'
            }`}
          >
            Story & Timeline
          </button>
          <button
            id="tab-btn-ai-context"
            onClick={() => setActiveTab('aiContext')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'aiContext'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Gemini AI Context</span>
          </button>
          <button
            id="tab-btn-seo-schema"
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'seo'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'hover:text-zinc-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>SEO & Schema</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'story' && (
            <>
              {/* Prominent Hero Image Banner */}
              {story.image && (
                <div className="w-full rounded-2xl overflow-hidden relative border border-zinc-800/80 bg-zinc-900 shadow-xl group">
                  <ReliableImage
                    src={story.image}
                    alt={story.title}
                    category={story.category}
                    className="w-full h-56 sm:h-72 lg:h-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-md border backdrop-blur-md font-bold ${getCategoryBadgeClass(
                        story.category,
                        isDark
                      )}`}
                    >
                      {story.category}
                    </span>
                    {story.isLive && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-red-500/80 text-white backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        LIVE 5-MIN DISPATCH
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Overlay: Photo metadata & Direct Reference Link */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-zinc-300 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-md border border-white/10 max-w-sm truncate">
                      Topic: {story.topic} • Verified {formatMinutesAgo(story.publishedAt)}
                    </span>
                    <a
                      href={story.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono text-xs font-bold shadow-lg transition self-start sm:self-auto"
                      title={`Open official reference: ${story.source.url}`}
                    >
                      <span>Open Reference ({story.source.name})</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Main Headline & Primary Reference Attribution */}
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                  {story.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified by {story.source.name} ({story.source.reliabilityScore}% trust)
                  </span>
                  <span>•</span>
                  <span>Canonical ID: {story.slug}</span>
                  <span>•</span>
                  <span>{story.readTime}</span>
                  <span>•</span>
                  <span>{story.viewsCount} live readers</span>
                </div>
              </div>

              {/* Prominent Primary Reference Link Callout Card */}
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark
                    ? 'bg-zinc-900/60 border-zinc-800'
                    : 'bg-zinc-100 border-zinc-200'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-zinc-400 uppercase font-bold tracking-wider">
                      PRIMARY REFERENCE SOURCE
                    </div>
                    <div className="text-sm font-semibold truncate text-zinc-200">
                      {story.source.name} Wire Service Dispatch
                    </div>
                    <div className="text-xs font-mono text-zinc-500 truncate">
                      {story.source.url}
                    </div>
                  </div>
                </div>

                <a
                  href={story.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono text-xs font-bold transition shrink-0 shadow-sm"
                  title={`Open official reference link`}
                >
                  <span>Visit Reference</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Executive Summary Bento Callout */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                }`}
              >
                <div className="text-[11px] font-mono uppercase font-bold text-amber-500 mb-1">
                  AI-GENERATED SHORT SUMMARY
                </div>
                <p className="text-sm sm:text-base leading-relaxed">{story.summary}</p>
              </div>

              {/* What Changed in the Last 5 Minutes */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-zinc-900/30 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>WHAT CHANGED IN THE LAST 5 MINUTES</span>
                </h3>
                <div className="space-y-2.5">
                  {story.whatChanged.map((diff, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                        +{i + 1}
                      </span>
                      <span className="leading-snug text-zinc-200 dark:text-zinc-300">{diff}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why It Matters */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDark
                    ? 'bg-amber-500/5 border-amber-500/20 text-zinc-200'
                    : 'bg-amber-50 border-amber-200 text-zinc-900'
                }`}
              >
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
                  ⚡ WHY IT MATTERS
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed">{story.aiContext.whyItMatters}</p>
              </div>

              {/* Interactive Story Timeline */}
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  TIMELINE OF RECENT UPDATES
                </h3>
                <div className="relative pl-6 space-y-4 border-l-2 border-zinc-800 ml-2">
                  {story.timeline.map((t, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-zinc-950" />
                      <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 mb-0.5">
                        <span className="text-amber-400 font-bold">{t.time}</span>
                        <span>•</span>
                        <span>{t.source}</span>
                      </div>
                      <h4 className="font-semibold text-xs sm:text-sm text-zinc-200">{t.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{t.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-Source Verification with Clickable Reference Links */}
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  CROSS-SOURCE VERIFICATION & RELIABILITY
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {story.sources.map((src, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                        isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold truncate text-zinc-200">{src.name}</span>
                          <span className="text-emerald-400 font-mono font-bold text-[11px]">
                            {src.reliabilityScore}% trust
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate font-mono">{src.url}</p>
                      </div>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-amber-500 hover:text-amber-400 hover:underline flex items-center gap-1 mt-2.5 font-mono pt-2 border-t border-zinc-800/60"
                      >
                        <span>Open Reference Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Stories with Image Previews */}
              {relatedStories.length > 0 && (
                <div className="pt-4 border-t border-zinc-800/60">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    RELATED STORIES IN {story.category.toUpperCase()}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {relatedStories.map((rel) => (
                      <button
                        key={rel.id}
                        id={`related-story-${rel.id}`}
                        onClick={() => onSelectRelated(rel)}
                        className={`p-3 rounded-xl border text-left transition group flex flex-col justify-between ${
                          isDark
                            ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
                            : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100'
                        }`}
                      >
                        <div>
                          {rel.image && (
                            <ReliableImage
                              src={rel.image}
                              alt={rel.title}
                              category={rel.category}
                              className="w-full h-24 rounded-lg mb-2 border border-zinc-700/50 group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="text-[10px] font-mono text-zinc-500 mb-1">
                            {formatMinutesAgo(rel.publishedAt)}
                          </div>
                          <h4 className="font-semibold text-xs leading-snug group-hover:text-amber-400 line-clamp-2">
                            {rel.title}
                          </h4>
                        </div>
                        <div className="text-[10px] font-mono text-amber-500 mt-2 flex items-center gap-1">
                          <span>Ref: {rel.source.name}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'aiContext' && (
            <div className="space-y-6">
              {/* Pre-computed Deep Context */}
              <div
                className={`p-5 rounded-2xl border space-y-4 ${
                  isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-xs font-bold uppercase">
                      AI SECTOR CONTEXT & OUTLOOK
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] uppercase font-bold">
                    Sentiment: {story.aiContext.sentiment}
                  </span>
                </div>

                <div>
                  <h4 className="font-mono text-xs text-zinc-400 uppercase font-semibold mb-1">
                    Historical Background
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {story.aiContext.background}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-xs text-zinc-400 uppercase font-semibold mb-1">
                    Next 48-Hour Outlook
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {story.aiContext.outlook}
                  </p>
                </div>
              </div>

              {/* Real-time Ask AI Panel */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'
                }`}
              >
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>ASK GEMINI AI ABOUT THIS STORY</span>
                </h3>
                <p className="text-xs text-zinc-400 mb-4">
                  Request custom impact assessments, source bias verification, or regulatory analysis.
                </p>

                {/* Prompt suggestions */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    'How will this affect small businesses?',
                    'Explain in simple laymans terms',
                    'What should tech teams do today?',
                    'Are there opposing source viewpoints?',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setUserQuestion(preset)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition ${
                        isDark
                          ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:border-amber-500'
                          : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:border-amber-500'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAskAI} className="flex gap-2">
                  <input
                    id="ask-gemini-story-input"
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="Ask a question about this 5-minute development..."
                    className={`flex-1 text-xs px-3 py-2.5 rounded-xl border outline-none font-sans transition ${
                      isDark
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-amber-500'
                        : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-amber-500'
                    }`}
                  />
                  <button
                    id="submit-ask-gemini-btn"
                    type="submit"
                    disabled={isAsking || !userQuestion.trim()}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{isAsking ? 'Thinking...' : 'Analyze'}</span>
                  </button>
                </form>

                {/* Answer thread */}
                {aiAnswers.length > 0 && (
                  <div className="mt-4 space-y-3 pt-4 border-t border-zinc-800">
                    {aiAnswers.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                          isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                        }`}
                      >
                        <div className="font-semibold text-amber-400 flex items-center justify-between">
                          <span>Q: {item.q}</span>
                          <span className="font-mono text-[10px] text-zinc-500">{item.provider}</span>
                        </div>
                        <p className="text-zinc-300 whitespace-pre-line leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6 font-mono text-xs">
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <span className="font-bold text-amber-400 uppercase">SEO URL ROUTING</span>
                  <span className="text-emerald-400">SEO-Optimized URL</span>
                </div>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-zinc-300 overflow-x-auto">
                  /news/{story.category.toLowerCase()}/{story.slug}
                </div>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Hierarchical SEO directory structure ensures top indexing for breaking entities within minutes of crawler detection.
                </p>
              </div>

              {/* Meta Tags Preview */}
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <span className="font-bold text-amber-400 uppercase">META & OPEN GRAPH METADATA</span>
                <div className="space-y-2 text-[11px] text-zinc-300">
                  <div>
                    <span className="text-zinc-500">&lt;title&gt;: </span>
                    <span className="text-zinc-200">{story.seo.title}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">&lt;meta name="description"&gt;: </span>
                    <span className="text-zinc-200">{story.seo.metaDescription}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">&lt;link rel="canonical"&gt;: </span>
                    <span className="text-amber-400">{story.seo.canonicalUrl}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Keywords: </span>
                    <span className="text-zinc-200">{story.seo.keywords.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* JSON-LD Article Schema */}
              <div
                className={`p-5 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <span className="font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>STRUCTURED DATA (SCHEMA.ORG NEWSARTICLE)</span>
                </span>
                <pre className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-[10px] text-zinc-300 overflow-x-auto font-mono-code leading-snug">
{JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: story.title,
    datePublished: story.publishedAt,
    dateModified: story.updatedAt,
    description: story.summary,
    author: {
      '@type': 'Organization',
      name: '5MIN NEWS Intelligence Desk',
    },
    publisher: {
      '@type': 'Organization',
      name: '5MIN NEWS',
      url: 'https://5minnews.io',
    },
    mainEntityOfPage: story.seo.canonicalUrl,
    articleSection: story.category,
  },
  null,
  2
)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
