import { NewsStory, IngestionSource, UserSubscriptionTier, Category } from '../types';

export const INITIAL_STORIES: NewsStory[] = [
  {
    id: 'story-1',
    title: 'OpenAI Releases Autonomous Agent Framework with Sub-50ms Latency',
    slug: 'openai-releases-autonomous-agent-framework',
    category: 'AI',
    summary: 'OpenAI has deployed a real-time reactive agent framework enabling browser-native tool orchestration and local device memory synchronization.',
    source: {
      name: 'TechCrunch',
      url: 'https://techcrunch.com',
      reliabilityScore: 94,
      quote: 'Engineers report a 4x reduction in orchestrator overhead for multi-step reasoning.'
    },
    sources: [
      { name: 'TechCrunch', url: 'https://techcrunch.com', reliabilityScore: 94 },
      { name: 'Reuters Tech', url: 'https://reuters.com', reliabilityScore: 98 },
      { name: 'Ars Technica', url: 'https://arstechnica.com', reliabilityScore: 92 }
    ],
    publishedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    minutesAgo: 2,
    importanceScore: 98,
    velocity: 'breaking',
    isLive: true,
    whatChanged: [
      'SDK packages published to npm with immediate enterprise availability',
      'Benchmark reveals 68% token reduction in multi-turn tool loops',
      'Integration directly supported in major modern front-end frameworks'
    ],
    timeline: [
      { time: '14:38 UTC', title: 'Developer preview deployed', detail: 'Initial package artifacts pushed to global registries.', source: 'GitHub Releases' },
      { time: '14:40 UTC', title: 'OpenAI CEO confirms specs', detail: 'Keynote livestreams architecture diagram showing sub-50ms roundtrip.', source: 'TechCrunch' },
      { time: '14:41 UTC', title: 'API endpoints active', detail: 'Global gateway routes began handling requests with zero cold start.', source: 'Reuters Tech' }
    ],
    aiContext: {
      background: 'The autonomous agent space has suffered from high token costs and latency bottlenecks exceeding 1.2s per function call.',
      whyItMatters: 'Enables web apps to run autonomous assistants without noticeable lag, shifting workflows from conversational chat into direct software manipulation.',
      outlook: 'Expect rapid adoption among developer tooling, customer support, and financial analysis suites over the coming quarter.',
      sentiment: 'bullish',
      confidenceScore: 96
    },
    entities: ['OpenAI', 'Autonomous Agents', 'API', 'Developer Tools'],
    topic: 'Artificial Intelligence',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    readTime: '1.5 min read',
    viewsCount: 4210,
    seo: {
      title: 'OpenAI Launches Autonomous Agent Framework - 5Min News Live',
      metaDescription: 'Breaking AI update: OpenAI announces sub-50ms reactive agent architecture. What changed in the last 5 minutes.',
      canonicalUrl: 'https://5minnews.io/news/ai/openai-releases-autonomous-agent-framework',
      keywords: ['OpenAI', 'AI Agents', 'Tech News', 'Generative AI']
    }
  },
  {
    id: 'story-2',
    title: 'US Federal Reserve Signals Immediate Liquidity Window Adjustment',
    slug: 'fed-signals-immediate-liquidity-window-adjustment',
    category: 'Markets',
    summary: 'Global equities saw an instant 0.8% swing after the Federal Reserve released an unscheduled bulletin regarding overnight collateral haircuts.',
    source: {
      name: 'Bloomberg',
      url: 'https://bloomberg.com',
      reliabilityScore: 99,
      quote: 'Bond yields tightened across 2-year notes within 180 seconds of the document posting.'
    },
    sources: [
      { name: 'Bloomberg', url: 'https://bloomberg.com', reliabilityScore: 99 },
      { name: 'Financial Times', url: 'https://ft.com', reliabilityScore: 97 },
      { name: 'Wall Street Journal', url: 'https://wsj.com', reliabilityScore: 96 }
    ],
    publishedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    minutesAgo: 3,
    importanceScore: 95,
    velocity: 'breaking',
    isLive: true,
    whatChanged: [
      'Overnight repurchase discount rate adjusted by 5 basis points',
      'S&P 500 futures rallied 32 points within 4 minutes',
      'European bond markets registered swift spread compression'
    ],
    timeline: [
      { time: '14:35 UTC', title: 'Fed bulletin published', detail: 'Technical note published on liquidity provision mechanisms.', source: 'Federal Reserve Wire' },
      { time: '14:37 UTC', title: 'Futures spike', detail: 'High-frequency algorithms trigger buy orders across index futures.', source: 'Bloomberg' },
      { time: '14:38 UTC', title: 'FX cross adjustments', detail: 'USD slipped 0.3% against major baskets before stabilizing.', source: 'FT' }
    ],
    aiContext: {
      background: 'Short-term funding pressures had elevated rates above the target range for three consecutive trading sessions.',
      whyItMatters: 'Relieves immediate friction in primary dealer balance sheets, dampening systemic liquidity volatility.',
      outlook: 'Traders now price a 92% probability of stable central bank balance sheet policy into next month.',
      sentiment: 'bullish',
      confidenceScore: 94
    },
    entities: ['Federal Reserve', 'Wall Street', 'Interest Rates', 'Treasury'],
    topic: 'Global Markets',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    readTime: '2 min read',
    viewsCount: 3890,
    seo: {
      title: 'Fed Liquidity Adjustment: Live Market Impact - 5Min News',
      metaDescription: 'Fed changes overnight discount mechanism triggering market surges. Live 5-minute financial update.',
      canonicalUrl: 'https://5minnews.io/news/markets/fed-signals-immediate-liquidity-window-adjustment',
      keywords: ['Fed', 'Interest Rates', 'Markets', 'Bloomberg']
    }
  },
  {
    id: 'story-3',
    title: 'India Unveils ₹24,000 Crore Quantum Computing & Semiconductor Incentive',
    slug: 'india-unveils-quantum-semiconductor-incentive',
    category: 'India',
    summary: 'The Ministry of Electronics and IT approved an expedited semiconductor testing and quantum hardware fabrication corridor in Bengaluru and Gujarat.',
    source: {
      name: 'Economic Times',
      url: 'https://economictimes.indiatimes.com',
      reliabilityScore: 93,
      quote: 'Cabinet cleared three major packaging clusters with 50% capital expenditure subsidies.'
    },
    sources: [
      { name: 'Economic Times', url: 'https://economictimes.indiatimes.com', reliabilityScore: 93 },
      { name: 'Press Information Bureau', url: 'https://pib.gov.in', reliabilityScore: 99 },
      { name: 'LiveMint', url: 'https://livemint.com', reliabilityScore: 91 }
    ],
    publishedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    minutesAgo: 4,
    importanceScore: 92,
    velocity: 'surging',
    isLive: true,
    whatChanged: [
      'Cabinet approval granted for two 300mm wafer testing centers',
      'Indian IT majors pledge ₹8,500 crore in complementary quantum labs',
      'Target commercial production timeline brought forward to Q4 2027'
    ],
    timeline: [
      { time: '14:32 UTC', title: 'Cabinet briefing opens', detail: 'Union Minister outlines revised high-tech industrial policy.', source: 'PIB' },
      { time: '14:35 UTC', title: 'Fund allocation broken down', detail: '₹14k Cr for silicon photonics, ₹10k Cr for cryogenic quantum testbeds.', source: 'ET' },
      { time: '14:37 UTC', title: 'Industry consortia response', detail: 'Three joint venture agreements formalized within 15 minutes.', source: 'Mint' }
    ],
    aiContext: {
      background: 'India is positioning itself as a key pillar in the global silicon and quantum supply chain diversification push.',
      whyItMatters: 'Accelerates domestic hardware IP creation and cuts import reliance for defense and telecom chips.',
      outlook: 'Expected to create 45,000 high-skill engineering jobs and attract global fab suppliers.',
      sentiment: 'bullish',
      confidenceScore: 95
    },
    entities: ['MeitY', 'Bengaluru', 'Semiconductors', 'Quantum Tech', 'Cabinet'],
    topic: 'India Tech & Economy',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    readTime: '2 min read',
    viewsCount: 3120,
    seo: {
      title: 'India ₹24,000 Cr Quantum and Chip Package Announced - 5Min News',
      metaDescription: 'India Cabinet approves massive semiconductor and quantum package. What changed 4 minutes ago.',
      canonicalUrl: 'https://5minnews.io/news/india/india-unveils-quantum-semiconductor-incentive',
      keywords: ['India Semiconductor', 'Quantum Computing', 'PIB', 'Tech India']
    }
  },
  {
    id: 'story-4',
    title: 'Zero-Day Flaw in OpenSSH Handshake Patched Across Major Linux Distros',
    slug: 'zero-day-flaw-openssh-patched',
    category: 'Cybersecurity',
    summary: 'Security researchers released an emergency mitigation for a race condition in OpenSSH daemon handling pre-authentication state packets.',
    source: {
      name: 'BleepingComputer',
      url: 'https://bleepingcomputer.com',
      reliabilityScore: 95,
      quote: 'Patches pushed directly to Debian, Ubuntu, Fedora, and Arch repositories within 12 minutes.'
    },
    sources: [
      { name: 'BleepingComputer', url: 'https://bleepingcomputer.com', reliabilityScore: 95 },
      { name: 'Krebs on Security', url: 'https://krebsonsecurity.com', reliabilityScore: 97 },
      { name: 'The Hacker News', url: 'https://thehackernews.com', reliabilityScore: 93 }
    ],
    publishedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    minutesAgo: 5,
    importanceScore: 94,
    velocity: 'surging',
    isLive: true,
    whatChanged: [
      'CVE-2026-3829 assigned with 8.9 CVSS severity rating',
      'Sysadmins urged to restart sshd after applying build 9.8p1-2',
      'Cloud providers rolled out non-disruptive kernel hot-patches'
    ],
    timeline: [
      { time: '14:28 UTC', title: 'Advisory posted to oss-security', detail: 'Technical writeup detailing race condition disclosed by Qualys team.', source: 'Openwall' },
      { time: '14:31 UTC', title: 'Package updates live', detail: 'Mirrors synced across primary European and US distribution channels.', source: 'Ubuntu Security' },
      { time: '14:35 UTC', title: 'Cloud mitigations verified', detail: 'AWS, GCP, and Azure confirm edge filtering blocks active exploit vectors.', source: 'BleepingComputer' }
    ],
    aiContext: {
      background: 'OpenSSH is the backbone of remote server administration for over 90% of internet-facing enterprise infrastructure.',
      whyItMatters: 'Unauthenticated remote code execution flaws are extremely rare in SSH and carry catastrophic risk if unpatched.',
      outlook: 'Automated patch bots and IT teams will have the majority of tier-1 servers secured within 4 hours.',
      sentiment: 'critical',
      confidenceScore: 98
    },
    entities: ['OpenSSH', 'Linux', 'Cybersecurity', 'CVE', 'Cloud Security'],
    topic: 'Cybersecurity',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    readTime: '2 min read',
    viewsCount: 5120,
    seo: {
      title: 'Emergency OpenSSH Zero-Day Patch Released - 5Min News Live',
      metaDescription: 'Critical OpenSSH vulnerability fixed across Linux distros. Urgent update issued 5 minutes ago.',
      canonicalUrl: 'https://5minnews.io/news/cybersecurity/zero-day-flaw-openssh-patched',
      keywords: ['OpenSSH', 'Zero Day', 'Linux Patch', 'Cybersecurity']
    }
  },
  {
    id: 'story-5',
    title: 'James Webb Space Telescope Confirms Heavy Atmosphere on Habitable-Zone Exoplanet',
    slug: 'jwst-confirms-heavy-atmosphere-exoplanet',
    category: 'Science',
    summary: 'Spectroscopy readings from JWST detected carbon dioxide and methane spectral lines on LHS 1140 b, strongly pointing to a surface liquid water ocean.',
    source: {
      name: 'NASA / ESA',
      url: 'https://nasa.gov',
      reliabilityScore: 99,
      quote: 'Data rules out a hydrogen-dominated mini-Neptune envelope with 99.4% statistical confidence.'
    },
    sources: [
      { name: 'NASA', url: 'https://nasa.gov', reliabilityScore: 99 },
      { name: 'Nature Astronomy', url: 'https://nature.com', reliabilityScore: 98 },
      { name: 'BBC Science', url: 'https://bbc.com', reliabilityScore: 94 }
    ],
    publishedAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    minutesAgo: 7,
    importanceScore: 89,
    velocity: 'developing',
    isLive: false,
    whatChanged: [
      'Peer-reviewed observations published in Nature Astronomy',
      'LHS 1140 b confirmed to possess nitrogen-rich secondary atmosphere',
      'Designated the single highest-priority astrobiology target for 2027 observations'
    ],
    timeline: [
      { time: '14:20 UTC', title: 'Data embargo lifted', detail: 'Joint NASA-ESA press release details spectral absorption bands.', source: 'NASA Press' },
      { time: '14:25 UTC', title: 'Astrophysics seminar begins', detail: 'Principal investigators present atmospheric modeling comparisons.', source: 'Nature' },
      { time: '14:33 UTC', title: 'Community reaction', detail: 'Astrophysicists describe finding as closest analog to early Earth atmosphere discovered.', source: 'BBC' }
    ],
    aiContext: {
      background: 'Rocky exoplanet atmospheres are notoriously difficult to detect around red dwarf stars due to flare stripping.',
      whyItMatters: 'First definitive proof that a temperate rocky planet orbiting in the habitable zone can retain a volatile-rich atmosphere.',
      outlook: 'Targeted transmission spectroscopy runs scheduled for subsequent observation cycles.',
      sentiment: 'bullish',
      confidenceScore: 97
    },
    entities: ['JWST', 'NASA', 'Exoplanet', 'Astronomy', 'LHS 1140b'],
    topic: 'Space Exploration',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    readTime: '2.5 min read',
    viewsCount: 2980,
    seo: {
      title: 'JWST Finds Habitable Exoplanet Atmosphere - 5Min News',
      metaDescription: 'NASA Webb telescope confirms atmospheric molecules on LHS 1140 b. What was confirmed in minutes.',
      canonicalUrl: 'https://5minnews.io/news/science/jwst-confirms-heavy-atmosphere-exoplanet',
      keywords: ['JWST', 'NASA', 'Exoplanet', 'Science News']
    }
  },
  {
    id: 'story-6',
    title: 'Seed-Stage AI Hardware Startup Raises $120M at $800M Valuation',
    slug: 'ai-hardware-startup-raises-120m',
    category: 'Startups',
    summary: 'Analog optical chipmaker LightTensor announced an oversubscribed Series A led by Sequoia and Lightspeed to scale photon-speed transformer accelerators.',
    source: {
      name: 'VentureBeat',
      url: 'https://venturebeat.com',
      reliabilityScore: 91,
      quote: 'The round was closed in under 10 days amid intense competition for silicon alternatives.'
    },
    sources: [
      { name: 'VentureBeat', url: 'https://venturebeat.com', reliabilityScore: 91 },
      { name: 'The Information', url: 'https://theinformation.com', reliabilityScore: 96 }
    ],
    publishedAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    minutesAgo: 9,
    importanceScore: 86,
    velocity: 'steady',
    isLive: false,
    whatChanged: [
      'Funding round officially closed at $120M with strategic hyperscaler backers',
      'Silicon prototype demonstrates 10x energy efficiency in matrix multiplication',
      'Commercial tape-out slated with TSMC 3nm packaging by early 2027'
    ],
    timeline: [
      { time: '14:15 UTC', title: 'SEC Form D filing detected', detail: 'Automated venture tracking spotted regulatory paperwork.', source: 'SEC Edgar' },
      { time: '14:22 UTC', title: 'Venture partners confirm', detail: 'Lead partners published investment thesis on optical interconnects.', source: 'VentureBeat' }
    ],
    aiContext: {
      background: 'Power consumption in mega-datacenters is emerging as the primary physical limiter for AI training clusters.',
      whyItMatters: 'Photonic computing replaces copper interconnects with light waveguides, slashing thermal dissipation by up to 90%.',
      outlook: 'High barrier to manufacturing will test team execution over the next 18 months.',
      sentiment: 'bullish',
      confidenceScore: 91
    },
    entities: ['LightTensor', 'Sequoia', 'TSMC', 'Venture Capital', 'Photonics'],
    topic: 'Venture & Startups',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&auto=format&fit=crop&q=80',
    readTime: '1.5 min read',
    viewsCount: 2150,
    seo: {
      title: 'LightTensor Raises $120M For Optical AI Chips - 5Min News',
      metaDescription: 'Analog photonics startup secures $120M Series A. Live venture intelligence.',
      canonicalUrl: 'https://5minnews.io/news/startups/ai-hardware-startup-raises-120m',
      keywords: ['Startups', 'Venture Capital', 'AI Silicon', 'Funding']
    }
  },
  {
    id: 'story-7',
    title: 'Google Rolls Out Core Algorithm & AI Overviews Update: Global SEO Rankings Shift',
    slug: 'google-core-algorithm-ai-overviews-seo-shift',
    category: 'SEO',
    summary: 'Search Engine Land confirms widespread search volatility as Google deploys revised ranking weights favoring primary factual reporting over programmatic synthetic pages.',
    source: {
      name: 'Search Engine Land',
      url: 'https://searchengineland.com',
      reliabilityScore: 98,
      quote: 'Publishers with first-party citations and low Interaction to Next Paint (INP) latency saw up to 34% rank improvement.'
    },
    sources: [
      { name: 'Search Engine Land', url: 'https://searchengineland.com', reliabilityScore: 98 },
      { name: 'Google Search Central', url: 'https://developers.google.com/search', reliabilityScore: 100 },
      { name: 'Search Engine Journal', url: 'https://searchenginejournal.com', reliabilityScore: 94 }
    ],
    publishedAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    minutesAgo: 9,
    importanceScore: 96,
    velocity: 'breaking',
    isLive: true,
    whatChanged: [
      'Core algorithm weights recalibrated across international Google Search clusters',
      'AI Overviews display rate adjusted to require verified corroborating sources',
      'Technical SEO guidelines formally mandate sub-200ms INP responsiveness'
    ],
    timeline: [
      { time: '14:15 UTC', title: 'Ranking sensor anomalies detected', detail: 'Semrush and Moz rank trackers register category-10 SERP volatility.', source: 'Search Engine Land' },
      { time: '14:22 UTC', title: 'Official Google bulletin published', detail: 'Search Central documentation confirms ongoing rollout over next 72 hours.', source: 'Google' },
      { time: '14:28 UTC', title: 'Publisher impact analysis', detail: 'E-commerce and technical publishers experience rapid index adjustments.', source: 'SEJ' }
    ],
    aiContext: {
      background: 'The proliferation of automated low-quality AI articles had degraded SERP utility, prompting Google to release stringent factual grounding thresholds.',
      whyItMatters: 'Webmasters, growth engineers, and digital marketing leaders must audit technical schema markup and original author entities immediately.',
      outlook: 'Organic search traffic will consolidate around high-authority domain clusters and original research publishers.',
      sentiment: 'neutral',
      confidenceScore: 97
    },
    entities: ['Google', 'SEO', 'AI Overviews', 'Search Engine Land', 'Algorithms'],
    topic: 'SEO & Search Engine Algorithms',
    image: 'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?w=1200&auto=format&fit=crop&q=80',
    readTime: '2 min read',
    viewsCount: 5120,
    seo: {
      title: 'Google Core Algorithm & AI Overviews SEO Update - 5Min News Live',
      metaDescription: 'Breaking SEO news: Google releases major search ranking algorithm update affecting AI Overviews and organic publisher traffic.',
      canonicalUrl: 'https://5minnews.io/news/seo/google-core-algorithm-ai-overviews-seo-shift',
      keywords: ['Google SEO', 'Search Algorithm', 'AI Overviews', 'Digital Marketing']
    }
  },
  {
    id: 'story-8',
    title: 'Generative Engine Optimization (GEO): AI Search Engines Disrupt Classic Organic SEO',
    slug: 'generative-engine-optimization-ai-search-disrupts-seo',
    category: 'SEO',
    summary: 'New research from Stanford and Princeton benchmarks reveals how Perplexity, Claude, and Gemini citations are replacing traditional blue-link organic web traffic.',
    source: {
      name: 'Search Engine Journal',
      url: 'https://searchenginejournal.com',
      reliabilityScore: 96,
      quote: 'Web pages optimizing for semantic fact-density and structured JSON-LD receive 3.2x higher citation frequency in AI responses.'
    },
    sources: [
      { name: 'Search Engine Journal', url: 'https://searchenginejournal.com', reliabilityScore: 96 },
      { name: 'ArXiv AI Research', url: 'https://arxiv.org', reliabilityScore: 99 },
      { name: 'Perplexity AI Wire', url: 'https://perplexity.ai', reliabilityScore: 95 }
    ],
    publishedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    minutesAgo: 12,
    importanceScore: 92,
    velocity: 'surging',
    isLive: true,
    whatChanged: [
      'Comprehensive GEO playbook released detailing 9 core semantic optimization vectors',
      'Over 22% of informational search queries now routed through synthetic response engines',
      'Direct quote embedding identified as the highest-weight citation trigger in LLM retrieval'
    ],
    timeline: [
      { time: '14:02 UTC', title: 'Academic benchmark preprint released', detail: 'Comparative evaluation across 10,000 queries published on arXiv.', source: 'Stanford AI' },
      { time: '14:14 UTC', title: 'SEO community response', detail: 'Major enterprise digital agencies establish dedicated GEO optimization desks.', source: 'Search Engine Journal' }
    ],
    aiContext: {
      background: 'Classic SEO prioritized keyword density, backlinks, and meta tags. AI search engines rely on vector embeddings, semantic relevance, and entity knowledge graphs.',
      whyItMatters: 'Brands risk vanishing from conversational AI search results unless they transition from keyword hunting to entity authoritative citation architecture.',
      outlook: 'Expect software tooling like Semrush and Ahrefs to ship native AI citation tracking dashboards this quarter.',
      sentiment: 'bullish',
      confidenceScore: 95
    },
    entities: ['Perplexity', 'Google AI', 'SEO', 'Generative Engine Optimization', 'GEO'],
    topic: 'SEO & Generative AI Search',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&auto=format&fit=crop&q=80',
    readTime: '1.5 min read',
    viewsCount: 4320,
    seo: {
      title: 'GEO: Generative Engine Optimization Replaces Classic SEO - 5Min News',
      metaDescription: 'How to optimize websites for Perplexity, Gemini, and AI search engines using Generative Engine Optimization (GEO).',
      canonicalUrl: 'https://5minnews.io/news/seo/generative-engine-optimization-ai-search-disrupts-seo',
      keywords: ['GEO', 'AI Search', 'SEO', 'Generative Engine Optimization', 'Perplexity']
    }
  },
  {
    id: 'story-9',
    title: 'Anthropic Claude 3.7 Sonnet Launches with Hybrid Thinking & Agentic Code Verification',
    slug: 'anthropic-claude-3-7-sonnet-hybrid-thinking-launch',
    category: 'AI',
    summary: 'Anthropic has made Claude 3.7 Sonnet globally accessible, blending instant sub-second response generation with extended reasoning and formal code verification.',
    source: {
      name: 'VentureBeat AI',
      url: 'https://venturebeat.com',
      reliabilityScore: 96,
      quote: 'Developers can dynamically adjust thinking token budgets from 0 to 64,000 tokens on a single API call.'
    },
    sources: [
      { name: 'VentureBeat AI', url: 'https://venturebeat.com', reliabilityScore: 96 },
      { name: 'Anthropic Research', url: 'https://anthropic.com', reliabilityScore: 99 },
      { name: 'Hacker News', url: 'https://news.ycombinator.com', reliabilityScore: 91 }
    ],
    publishedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    minutesAgo: 15,
    importanceScore: 97,
    velocity: 'surging',
    isLive: true,
    whatChanged: [
      'Hybrid reasoning mode available via API and console across 180 countries',
      'Sets state-of-the-art SWE-bench verified coding performance of 70.3%',
      'Integrated bash command execution environment exposed for autonomous agent workflows'
    ],
    timeline: [
      { time: '13:45 UTC', title: 'System prompt & technical paper published', detail: 'Anthropic research team details hybrid chain-of-thought routing.', source: 'Anthropic' },
      { time: '13:52 UTC', title: 'API tiers activated', detail: 'Hyperscaler cloud marketplaces enable 1-click model endpoint deployment.', source: 'VentureBeat' }
    ],
    aiContext: {
      background: 'Prior frontier models forced developers to choose between either fast lightweight responses or slow high-latency reasoning models.',
      whyItMatters: 'A single unified model handles both everyday conversational queries and complex multi-file codebase refactoring with mathematically bounded confidence.',
      outlook: 'Accelerates the transition toward self-healing software systems and fully automated enterprise pull request reviews.',
      sentiment: 'bullish',
      confidenceScore: 98
    },
    entities: ['Anthropic', 'Claude 3.7', 'SWE-bench', 'AI Models', 'Autonomous Coding'],
    topic: 'Frontier AI & LLMs',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
    readTime: '2 min read',
    viewsCount: 6890,
    seo: {
      title: 'Anthropic Claude 3.7 Sonnet Launches - 5Min News Live',
      metaDescription: 'Breaking AI news: Anthropic debuts Claude 3.7 Sonnet with hybrid reasoning and 70.3% SWE-bench score.',
      canonicalUrl: 'https://5minnews.io/news/ai/anthropic-claude-3-7-sonnet-hybrid-thinking-launch',
      keywords: ['Claude 3.7', 'Anthropic', 'AI Code', 'LLMs', 'Artificial Intelligence']
    }
  },
  {
    id: 'story-10',
    title: 'NVIDIA Blackwell B200 Systems Begin Mass Shipments to Hyperscale AI Clusters',
    slug: 'nvidia-blackwell-b200-begins-mass-shipments',
    category: 'Technology',
    summary: 'NVIDIA has initiated full-scale factory dispatches of GB200 NVL72 liquid-cooled racks to Microsoft Azure, AWS, and Google Cloud datacenters.',
    source: {
      name: 'Reuters Tech',
      url: 'https://reuters.com',
      reliabilityScore: 99,
      quote: 'CEO Jensen Huang verified all packaging bottlenecks resolved with TSMC CoWoS-L packaging lines running at 98% yield.'
    },
    sources: [
      { name: 'Reuters Tech', url: 'https://reuters.com', reliabilityScore: 99 },
      { name: 'Tom\'s Hardware', url: 'https://tomshardware.com', reliabilityScore: 94 },
      { name: 'Bloomberg Technology', url: 'https://bloomberg.com', reliabilityScore: 98 }
    ],
    publishedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 16 * 60 * 1000).toISOString(),
    minutesAgo: 18,
    importanceScore: 95,
    velocity: 'developing',
    isLive: true,
    whatChanged: [
      'First 50,000 Blackwell accelerator units shipped to North American datacenters',
      'Provides 30x faster inference speed for trillion-parameter mixture-of-experts models',
      'Liquid-to-chip direct cooling distribution loops standardized across partner chassis'
    ],
    timeline: [
      { time: '13:30 UTC', title: 'Dispatches confirmed at supply depot', detail: 'Logistics manifests show GB200 racks loaded for air freight delivery.', source: 'Reuters' },
      { time: '13:42 UTC', title: 'Cloud provider validation', detail: 'Microsoft Azure engineering team validates first live cluster online in Texas.', source: 'Bloomberg' }
    ],
    aiContext: {
      background: 'Early design revisions caused thermal warping in extreme compute configurations, delaying volume shipments by approximately six weeks.',
      whyItMatters: 'Unlocks massive inference throughput capacity, lowering the cost-per-token for real-time generative audio, video, and reasoning models.',
      outlook: 'Global hyperscaler capital expenditure for AI infrastructure is projected to surpass $220 billion this fiscal year.',
      sentiment: 'bullish',
      confidenceScore: 96
    },
    entities: ['NVIDIA', 'Blackwell', 'GB200', 'Semiconductors', 'TSMC', 'Hardware'],
    topic: 'Semiconductors & AI Compute',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    readTime: '2 min read',
    viewsCount: 5780,
    seo: {
      title: 'NVIDIA Blackwell B200 Ships to Hyperscalers - 5Min News',
      metaDescription: 'NVIDIA begins volume shipments of Blackwell GB200 servers. Full specs, latency benchmarks, and datacenter impact.',
      canonicalUrl: 'https://5minnews.io/news/technology/nvidia-blackwell-b200-begins-mass-shipments',
      keywords: ['NVIDIA', 'Blackwell', 'Semiconductors', 'AI Hardware', 'GPU']
    }
  }
];

export const INGESTION_SOURCES: IngestionSource[] = [
  { id: 'src-1', name: 'Reuters Tech Wire', category: 'Technology', feedUrl: 'https://reuters.com/technology/rss', fetchIntervalMinutes: 1, status: 'online', lastPolled: '45s ago', storiesLastHour: 54, reliability: 99 },
  { id: 'src-2', name: 'Search Engine Land (SEO)', category: 'SEO', feedUrl: 'https://searchengineland.com/feed', fetchIntervalMinutes: 1, status: 'online', lastPolled: '30s ago', storiesLastHour: 28, reliability: 98 },
  { id: 'src-3', name: 'TechCrunch Realtime', category: 'Technology', feedUrl: 'https://techcrunch.com/feed', fetchIntervalMinutes: 2, status: 'online', lastPolled: '2 min ago', storiesLastHour: 24, reliability: 95 },
  { id: 'src-4', name: 'Hacker News Firehose', category: 'DevTools', feedUrl: 'https://news.ycombinator.com/rss', fetchIntervalMinutes: 1, status: 'online', lastPolled: '20s ago', storiesLastHour: 88, reliability: 92 },
  { id: 'src-5', name: 'PIB India Tech & Science (National)', category: 'India Tech', feedUrl: 'https://pib.gov.in/rss', fetchIntervalMinutes: 2, status: 'online', lastPolled: '1 min ago', storiesLastHour: 18, reliability: 99 },
  { id: 'src-6', name: 'BleepingComputer Threat Intel', category: 'Cybersecurity', feedUrl: 'https://bleepingcomputer.com/feed', fetchIntervalMinutes: 2, status: 'online', lastPolled: '2 min ago', storiesLastHour: 15, reliability: 97 },
  { id: 'src-7', name: 'Search Engine Journal (SEO/GEO)', category: 'SEO', feedUrl: 'https://searchenginejournal.com/feed', fetchIntervalMinutes: 2, status: 'online', lastPolled: '1 min ago', storiesLastHour: 22, reliability: 96 },
  { id: 'src-8', name: 'Ars Technica Frontier Lab', category: 'AI', feedUrl: 'https://arstechnica.com/feed', fetchIntervalMinutes: 3, status: 'online', lastPolled: '2 min ago', storiesLastHour: 19, reliability: 94 }
];

export const SUBSCRIPTION_TIERS: UserSubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free Tech Wire',
    priceINR: 0,
    billingPeriod: 'Forever free',
    features: [
      'Live 5-minute technology feed',
      'AI, SEO & Semiconductor channels',
      'Top 5-minute brief previews',
      'Flash running news ticker',
      'Standard search & reference links'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Tech Intelligence',
    priceINR: 249,
    billingPeriod: 'per month (₹2,490/yr)',
    popular: true,
    features: [
      'Everything in Free',
      'Unlimited AI Chatbot Copilot conversations',
      'Instant Google SEO Algorithm & Core Update Alerts',
      'Personalized custom topics & entity tracker',
      'Morning (8:00 AM) & Evening (6:00 PM) AI Briefs',
      'Full Multi-Language Translation (National & Global)',
      'Audio Briefing TTS Player with voice selection',
      'Sub-60 second wire ingestion speed'
    ]
  },
  {
    id: 'business',
    name: 'Business & Team Intelligence',
    priceINR: 1299,
    billingPeriod: 'per month / seat',
    features: [
      'Everything in Pro',
      'REST & Webhook API access (50k req/day)',
      'SEO Volatility & SERP fluctuation alerts',
      'Entity velocity & market sentiment alerts',
      'Export to Slack, Discord & Notion',
      'Multi-seat team workspace'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Wire Cluster',
    priceINR: 5999,
    billingPeriod: 'custom billing',
    features: [
      'Dedicated private ingestion cluster',
      'Custom LLM fine-tuned summarization',
      'Sub-second wire feed latency',
      'Unlimited API throughput & SLA guarantee',
      'Custom compliance & audit logs',
      '24/7 dedicated support engineer'
    ]
  }
];

export const TRENDING_TAGS = [
  { tag: '#OpenAI', count: '1.6k stories', change: '+88% velocity', category: 'AI' },
  { tag: '#GoogleSEO', count: '1.2k stories', change: '+140% velocity', category: 'SEO' },
  { tag: '#Claude3.7', count: '980 stories', change: '+75% velocity', category: 'AI' },
  { tag: '#IndiaTech', count: '840 stories', change: '+62% velocity', category: 'India Tech' },
  { tag: '#NVIDIA', count: '760 stories', change: '+48% velocity', category: 'Technology' },
  { tag: '#CyberZeroDay', count: '630 stories', change: '+115% velocity', category: 'Cybersecurity' },
  { tag: '#GEO', count: '520 stories', change: '+94% velocity', category: 'SEO' }
];

export const CATEGORIES: Category[] = [
  'All',
  'AI',
  'Technology',
  'SEO',
  'Cybersecurity',
  'Startups',
  'India Tech',
  'Global Tech',
  'DevTools',
  'Markets',
];

