import React, { useState } from 'react';
import {
  Terminal,
  Activity,
  Layers,
  Database,
  Cpu,
  RefreshCw,
  Play,
  CheckCircle2,
  Clock,
  Shield,
  Plus,
  Send,
  Loader2,
  ExternalLink,
  Sliders,
  Filter,
  BarChart3,
  Globe,
  Radio,
} from 'lucide-react';
import { IngestionSource, IngestionPipelineMetric, NewsStory } from '../types';

interface AdminDashboardProps {
  sources: IngestionSource[];
  onToggleSource: (id: string) => void;
  onTriggerIngest: (customTopic?: string) => Promise<void>;
  isIngesting: boolean;
  isDark: boolean;
  totalIngested: number;
  duplicatesBlocked: number;
  aiSummariesCount: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  sources,
  onToggleSource,
  onTriggerIngest,
  isIngesting,
  isDark,
  totalIngested,
  duplicatesBlocked,
  aiSummariesCount,
}) => {
  const [customTopic, setCustomTopic] = useState('');
  const [activeTab, setActiveTab] = useState<'pipeline' | 'sources' | 'analytics' | 'seo'>('pipeline');
  const [pipelineOutput, setPipelineOutput] = useState<string[]>([]);

  const handleCustomGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim() || isIngesting) return;
    const t = customTopic.trim();
    setCustomTopic('');
    setPipelineOutput((prev) => [
      `[${new Date().toLocaleTimeString()}] INGESTION TRIGGERED: "${t}"`,
      `[${new Date().toLocaleTimeString()}] Fetching wire feeds & normalizing DOM payloads...`,
      `[${new Date().toLocaleTimeString()}] Running Vector Duplicate Cluster match...`,
      `[${new Date().toLocaleTimeString()}] Gemini 3.8 Flash generating 2-sentence summary & diff...`,
      `[${new Date().toLocaleTimeString()}] Importance score computed: 96/100 (Freshness 40% + Trust 30% + Velocity 30%)`,
      `[${new Date().toLocaleTimeString()}] Redis Edge Cache invalidated. Promoted to Live Feed!`,
    ]);
    await onTriggerIngest(t);
  };

  const pipelineStages: IngestionPipelineMetric[] = [
    { stage: '1. NEWS SOURCES', status: 'success', latencyMs: 64, itemCount: 42, details: 'Reuters, Bloomberg, TechCrunch, PIB, Hacker News RSS' },
    { stage: '2. INGESTION & SCRAPING', status: 'success', latencyMs: 112, itemCount: 38, details: 'Strip boilerplate, normalize markdown & extract author metadata' },
    { stage: '3. NORMALIZE & DEDUP', status: 'success', latencyMs: 45, itemCount: 12, details: 'Cosine similarity clustering to collapse redundant wire alerts' },
    { stage: '4. AI CLASSIFICATION', status: 'success', latencyMs: 82, itemCount: 4, details: 'Tag category (Tech, AI, Markets, etc.), sentiment & entities' },
    { stage: '5. AI SUMMARY & WHAT CHANGED', status: 'success', latencyMs: 130, itemCount: 4, details: 'Gemini 3.8 Flash synthesizes 1-2 sentence briefs and diffs' },
    { stage: '6. IMPORTANCE SCORING', status: 'success', latencyMs: 22, itemCount: 4, details: 'Calculates 1-100 score: Freshness (40%) + Trust (30%) + Velocity (30%)' },
    { stage: '7. DATABASE & REDIS CACHE', status: 'success', latencyMs: 18, itemCount: 4, details: 'Invalidate sub-5m edge cache; push live socket notification' },
  ];

  return (
    <div id="admin-dashboard-container" className="max-w-6xl mx-auto py-4 space-y-6">
      {/* Header Bar */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>5-MINUTE ENGINE CONTROL PLANE</span>
              </span>
              <span className="font-mono text-xs text-emerald-400 font-semibold">
                ● Status: Operational
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ingestion, AI Synthesis & SEO Management
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Continuous 5-minute news lifecycle: Scrape → Dedup → AI Summarize → Score → Edge Push.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="admin-trigger-cycle-btn"
              onClick={() => onTriggerIngest()}
              disabled={isIngesting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-95 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isIngesting ? 'animate-spin' : ''}`} />
              <span>{isIngesting ? 'Running Cycle...' : 'Run 5-Min Ingestion Cycle'}</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-800/60 text-xs font-mono">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'pipeline' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pipeline Flow (5-Min Engine)
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'sources' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Wire Sources ({sources.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'analytics' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Analytics & Velocity
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'seo' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            SEO Architecture
          </button>
        </div>
      </div>

      {/* TAB 1: PIPELINE FLOW */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Real-time Breaking Story Injector using Gemini */}
          <div
            className={`p-6 rounded-3xl border ${
              isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Instant AI Ingestion Generator</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Test the pipeline by synthesizing an instant breaking news story on any real-world event.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                Gemini 3.8 Flash
              </span>
            </div>

            <form onSubmit={handleCustomGenerate} className="flex gap-2">
              <input
                id="admin-custom-topic-input"
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="E.g., Apple unveils quantum processor, RBI cuts repo rate by 25 bps, NASA discovers Martian aquifer..."
                className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border outline-none transition ${
                  isDark
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-amber-500'
                    : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-amber-500'
                }`}
              />
              <button
                id="admin-inject-story-btn"
                type="submit"
                disabled={isIngesting || !customTopic.trim()}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {isIngesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Inject to Feed</span>
              </button>
            </form>

            {pipelineOutput.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-400 space-y-1">
                {pipelineOutput.map((line, i) => (
                  <div key={i} className="text-emerald-400/90 font-mono">
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visual Architecture Diagram */}
          <div
            className={`p-6 rounded-3xl border ${
              isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                5-MINUTE PIPELINE STAGES & ENGINE LATENCY
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Total Pipeline Latency: 473ms
              </span>
            </div>

            <div className="space-y-3">
              {pipelineStages.map((stage, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-xs font-mono text-zinc-200">{stage.stage}</div>
                      <div className="text-[11px] text-zinc-400">{stage.details}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px]">
                      {stage.itemCount} items
                    </span>
                    <span className="text-amber-400 font-bold">{stage.latencyMs}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOURCES */}
      {activeTab === 'sources' && (
        <div
          className={`p-6 rounded-3xl border ${
            isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm">Active News Wires & Publisher Feeds</h3>
              <p className="text-xs text-zinc-400">
                Polled automatically every 1 to 5 minutes with cross-source deduplication.
              </p>
            </div>
            <span className="font-mono text-xs text-amber-400 font-bold">
              {sources.filter((s) => s.status === 'online').length} of {sources.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {sources.map((src) => (
              <div
                key={src.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                  isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      src.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs sm:text-sm text-zinc-200 truncate flex items-center gap-2">
                      <span>{src.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        {src.category}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500 truncate">
                      {src.feedUrl} • Polled {src.lastPolled} • {src.storiesLastHour} stories/hr
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-emerald-400 hidden sm:inline">
                    {src.reliability}% trust
                  </span>
                  <button
                    id={`toggle-source-${src.id}`}
                    onClick={() => onToggleSource(src.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition ${
                      src.status === 'online'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {src.status === 'online' ? 'Active' : 'Paused'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & VELOCITY */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              className={`p-5 rounded-2xl border text-center ${
                isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
                {totalIngested.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-1">Articles Ingested</div>
            </div>

            <div
              className={`p-5 rounded-2xl border text-center ${
                isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {duplicatesBlocked.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-1">Duplicates Clustered</div>
            </div>

            <div
              className={`p-5 rounded-2xl border text-center ${
                isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              <div className="text-2xl sm:text-3xl font-black font-mono text-violet-400">
                {aiSummariesCount.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-1">AI Summaries Synthesized</div>
            </div>

            <div
              className={`p-5 rounded-2xl border text-center ${
                isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              <div className="text-2xl sm:text-3xl font-black font-mono text-blue-400">
                98.6%
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-1">Redis Edge Cache Hit</div>
            </div>
          </div>

          <div
            className={`p-6 rounded-3xl border ${
              isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <h3 className="font-bold text-sm mb-4">Category Ingestion Volume (Last 24 Hours)</h3>
            <div className="space-y-3">
              {[
                { cat: 'Artificial Intelligence', pct: 34, color: 'bg-violet-500' },
                { cat: 'Global Markets & Forex', pct: 24, color: 'bg-emerald-500' },
                { cat: 'Technology & Hardware', pct: 18, color: 'bg-blue-500' },
                { cat: 'India Economy & Policy', pct: 14, color: 'bg-orange-500' },
                { cat: 'Cybersecurity Advisories', pct: 10, color: 'bg-rose-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">{item.cat}</span>
                    <span className="text-zinc-400 font-bold">{item.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SEO ARCHITECTURE */}
      {activeTab === 'seo' && (
        <div
          className={`p-6 rounded-3xl border space-y-6 ${
            isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          <div>
            <h3 className="font-bold text-sm">SEO Directory & Schema Architecture</h3>
            <p className="text-xs text-zinc-400">
              High-ranking programmatic directory and structured news metadata for Google News inclusion.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="font-bold text-amber-400 uppercase">Hierarchical URL Slugs:</span>
              <div className="space-y-1 text-zinc-300">
                <div>• /news/technology/apple-releases-m5-chip</div>
                <div>• /news/ai/openai-releases-autonomous-agent-framework</div>
                <div>• /news/markets/fed-signals-immediate-liquidity-window-adjustment</div>
                <div>• /news/india/india-unveils-quantum-semiconductor-incentive</div>
                <div>• /topic/artificial-intelligence</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="font-bold text-amber-400 uppercase">Auto-Injected Meta Properties:</span>
              <div className="space-y-1 text-zinc-300">
                <div>• og:title, og:description, og:image (1200x630px high res)</div>
                <div>• twitter:card (summary_large_image)</div>
                <div>• article:published_time, article:modified_time</div>
                <div>• canonical URL referencing primary story node</div>
                <div>• Schema.org NewsArticle with organization author tags</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
