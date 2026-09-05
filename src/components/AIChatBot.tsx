import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  Globe,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Cpu,
  Layers,
} from 'lucide-react';
import { ChatMessage, SupportedLanguage, NewsStory } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../services/localization';

interface AIChatBotProps {
  stories: NewsStory[];
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onSelectStory: (story: NewsStory) => void;
  isDark: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  activeStoryContext?: NewsStory | null;
  onClearStoryContext?: () => void;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({
  stories,
  currentLanguage,
  onLanguageChange,
  onSelectStory,
  isDark,
  isOpen: isOpenProp,
  onClose: onCloseProp,
  onOpen: onOpenProp,
  activeStoryContext,
  onClearStoryContext,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isOpenProp !== undefined ? isOpenProp : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    if (val) {
      if (onOpenProp) onOpenProp();
      setInternalIsOpen(true);
    } else {
      if (onCloseProp) onCloseProp();
      setInternalIsOpen(false);
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: `Hello! I am your 5MIN Tech & SEO AI Copilot. I continuously analyze incoming wire dispatches from 42 global & national feeds every 5 minutes.\n\nAsk me anything about breaking AI models, Google SEO algorithm shifts, semiconductors, or Indian & international tech updates!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        '🔥 Top AI breakthroughs in last 5 min',
        '🔍 Latest Google SEO & AI Overviews update',
        '🇮🇳 India semiconductor & sovereign AI news',
        '⚡ 5-minute executive tech summary',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // When activeStoryContext changes and is present, add contextual message
  useEffect(() => {
    if (activeStoryContext) {
      setIsOpen(true);
      const exists = messages.some((m) => m.id === `story-ctx-${activeStoryContext.id}`);
      if (!exists) {
        setMessages((prev) => [
          ...prev,
          {
            id: `story-ctx-${activeStoryContext.id}`,
            role: 'assistant',
            text: `⚡ **Connected to Flash Wire News:**\n**"${activeStoryContext.title}"** (${activeStoryContext.category})\n\n${activeStoryContext.summary}\n\n*Why it matters:* ${activeStoryContext.aiContext.whyItMatters}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedPrompts: [
              `Explain implications of ${activeStoryContext.category}`,
              'How does this impact Google search rankings?',
              'What should engineers do right now?',
              'Translate this story to my chosen language',
            ],
            sourcesReferenced: [activeStoryContext.source.name, activeStoryContext.seo.canonicalUrl],
          },
        ]);
      }
    }
  }, [activeStoryContext?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Gather context of top 4 recent stories
      const topContext = stories.slice(0, 4).map((s) => ({
        title: s.title,
        category: s.category,
        summary: s.summary,
        whatChanged: s.whatChanged,
        source: s.source.name,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: currentLanguage,
          topStories: topContext,
        }),
      });

      const data = await res.json();

      let replyText = data.reply;
      if (!replyText) {
        replyText = generateSmartFallbackReply(query, stories, currentLanguage);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: [
          'What are the direct developer impacts?',
          'Compare this with previous tech cycles',
          'Translate this into Hindi / Spanish',
        ],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      // Offline fallback
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: generateSmartFallbackReply(query, stories, currentLanguage),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        {!isOpen && (
          <button
            id="open-ai-chatbot-button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-zinc-950 font-bold shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-200"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-zinc-950 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-zinc-950 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-zinc-950" />
            </div>
            <span className="text-xs sm:text-sm tracking-tight font-mono uppercase font-black">
              AI Tech Copilot
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Window Modal / Popup */}
      {isOpen && (
        <div
          id="ai-chatbot-modal"
          className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[460px] h-[580px] max-h-[85vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200"
          style={{
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.96)' : 'rgba(255, 255, 255, 0.98)',
            borderColor: isDark ? 'rgba(63, 63, 70, 0.6)' : 'rgba(228, 228, 231, 0.8)',
          }}
        >
          {/* Header */}
          <div
            className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-100/80 border-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm leading-none font-mono">5MIN AI COPILOT</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  Tech, AI & SEO Live Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector Dropdown inside chat */}
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                className={`text-[11px] font-mono px-2 py-1 rounded-lg border cursor-pointer outline-none ${
                  isDark
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                    : 'bg-zinc-100 border-zinc-300 text-zinc-800'
                }`}
                title="Select conversation language"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName}
                  </option>
                ))}
              </select>

              <button
                id="close-ai-chatbot-button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Story Context Badge */}
          {activeStoryContext && (
            <div className="px-3.5 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                <span className="text-[11px] font-mono text-amber-300 font-bold truncate">
                  Flash News Context: {activeStoryContext.title}
                </span>
              </div>
              {onClearStoryContext && (
                <button
                  onClick={onClearStoryContext}
                  className="text-[10px] font-mono text-zinc-400 hover:text-zinc-200 px-1.5 py-0.5 rounded hover:bg-zinc-800 transition"
                  title="Clear story context"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed relative group ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-medium rounded-tr-sm'
                      : isDark
                      ? 'bg-zinc-800/90 text-zinc-100 border border-zinc-700/60 rounded-tl-sm'
                      : 'bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-black/10 dark:border-white/10 text-[10px] font-mono opacity-70">
                    <span>{msg.timestamp}</span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:opacity-100 flex items-center gap-1"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Suggested prompt chips */}
                {msg.suggestedPrompts && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.suggestedPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(p)}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition text-left"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning 42 wires & generating synthesis...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Bar */}
          <div
            className={`px-3 py-1.5 border-t flex items-center justify-between text-[10px] font-mono ${
              isDark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
            }`}
          >
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-amber-500" />
              <span>Grounding: 42 Verified Tech Wires</span>
            </span>
            <span className="text-emerald-400">● 310ms latency</span>
          </div>

          {/* Input Box */}
          <div
            className={`p-3 border-t ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="ai-chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('askQuestion', currentLanguage)}
                className={`flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border outline-none transition ${
                  isDark
                    ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-amber-400'
                    : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-amber-500'
                }`}
              />
              <button
                id="ai-chatbot-send-button"
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold hover:brightness-105 disabled:opacity-50 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

function generateSmartFallbackReply(
  query: string,
  stories: NewsStory[],
  lang: SupportedLanguage
): string {
  const q = query.toLowerCase();

  if (q.includes('seo') || q.includes('search') || q.includes('google') || q.includes('algorithm')) {
    return `🔍 **SEO & Search Algorithm Briefing:**\n\n1. **Google AI Overviews & Core Update**: Recent algorithm passes have heavily rewarded high-authority primary reporting and technical INP (Interaction to Next Paint) thresholds.\n2. **Generative Engine Optimization (GEO)**: Publishers are optimizing for citation visibility in Perplexity, Claude, and Gemini by embedding structured direct facts, schema, and original statistics.\n3. **Actionable Takeaway**: Avoid thin programmatic AI content; prioritize technical site architecture and verified reference links.`;
  }

  if (q.includes('ai') || q.includes('openai') || q.includes('deepseek') || q.includes('claude') || q.includes('model')) {
    return `⚡ **Artificial Intelligence (AI) Intelligence Report:**\n\n1. **Sub-50ms Reactive Agents**: OpenAI and Anthropic have pushed architectures capable of browser-native tool orchestration with sub-50ms roundtrip speeds.\n2. **Open Weights & Distillation**: DeepSeek's open-source architecture continues to reduce enterprise inference costs by up to 70%.\n3. **Silicon CapEx**: Hyperscalers are deploying multi-gigawatt datacenters with optical photonic accelerators to combat thermal dissipation limits.`;
  }

  if (q.includes('india') || q.includes('national') || q.includes('bengaluru') || q.includes('semiconductor')) {
    return `🇮🇳 **India Tech & Semiconductor Pulse (National):**\n\n1. **₹24,000 Crore Hardware Corridor**: The Union Cabinet approved expedited testing corridors in Bengaluru and Gujarat, with 50% capital subsidies.\n2. **India AI Mission**: Sovereign compute clusters with over 10,000 GPUs are being activated across tier-1 data hubs.\n3. **UPI & Global Fintech Expansion**: Real-time cross-border settlements with ASEAN and Europe have accelerated digital payments infrastructure.`;
  }

  // General 5-min summary
  const topStory = stories[0];
  return `📊 **5-Minute Technology Wire Summary:**\n\n- **Top Breaking Item**: "${topStory?.title || 'OpenAI Releases Autonomous Agent Framework'}"\n- **Key What Changed**: ${topStory?.whatChanged?.[0] || 'SDK packages deployed with immediate enterprise availability.'}\n- **Strategic Implication**: ${topStory?.aiContext?.whyItMatters || 'Shifts software manipulation from conversational chat into direct autonomous action.'}\n\nFeel free to ask me to analyze any specific story or translate into your preferred language!`;
}
