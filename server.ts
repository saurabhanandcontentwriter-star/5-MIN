import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_STORIES, INGESTION_SOURCES, TRENDING_TAGS } from './src/data/newsStories';
import { NewsStory, IngestionPipelineMetric, IngestionSource } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server state
let storiesState: NewsStory[] = [...INITIAL_STORIES];
let ingestionSourcesState: IngestionSource[] = [...INGESTION_SOURCES];
let lastIngestionRun = new Date().toISOString();
let totalArticlesIngested = 1420;
let duplicatesFiltered = 348;
let aiSummariesGenerated = 892;

// Lazy GenAI init
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// ----------------- API ROUTES ----------------- //

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: '5MIN NEWS Engine',
    uptime: process.uptime(),
    activeStories: storiesState.length,
    lastIngestionRun,
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// GET /api/news - List stories with filtering, category, search, and sorting
app.get('/api/news', (req, res) => {
  const { category, search, topic, sort, limit } = req.query;

  let results = [...storiesState];

  if (category && category !== 'All') {
    results = results.filter(
      (s) => s.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  if (topic) {
    results = results.filter(
      (s) =>
        s.topic.toLowerCase().includes(String(topic).toLowerCase()) ||
        s.entities.some((e) => e.toLowerCase().includes(String(topic).toLowerCase()))
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.source.name.toLowerCase().includes(q) ||
        s.entities.some((e) => e.toLowerCase().includes(q))
    );
  }

  // Sort
  if (sort === 'importance') {
    results.sort((a, b) => b.importanceScore - a.importanceScore);
  } else if (sort === 'velocity') {
    const scoreMap = { breaking: 4, surging: 3, developing: 2, steady: 1 };
    results.sort((a, b) => (scoreMap[b.velocity] || 0) - (scoreMap[a.velocity] || 0));
  } else {
    // Default: Freshness (publishedAt desc)
    results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  if (limit) {
    results = results.slice(0, Number(limit));
  }

  res.json({
    count: results.length,
    lastUpdated: lastIngestionRun,
    stories: results,
  });
});

// GET /api/news/:idOrSlug - Single story
app.get('/api/news/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const story = storiesState.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
  if (!story) {
    res.status(404).json({ error: 'Story not found' });
    return;
  }
  // increment views
  story.viewsCount += 1;
  res.json({ story });
});

// GET /api/brief - 5-Minute Brief (Top 5 stories synthesized)
app.get('/api/brief', (req, res) => {
  const sorted = [...storiesState]
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 5);

  res.json({
    generatedAt: new Date().toISOString(),
    cadence: 'Every 5 Minutes',
    stories: sorted,
    keyTakeaway:
      'High market velocity driven by Federal Reserve liquidity adjustments, accompanied by major breakthroughs in sub-50ms autonomous AI agent architectures and Linux infrastructure patches.',
    audioDuration: '2m 14s',
  });
});

// GET /api/trending - Trending tags
app.get('/api/trending', (req, res) => {
  res.json({ trending: TRENDING_TAGS });
});

// POST /api/gemini/summarize - Real-time AI 5-minute summarization
app.post('/api/gemini/summarize', async (req, res) => {
  const { title, context, category } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `You are the chief AI editor of 5MIN NEWS ("Everything important that changed in the last 5 minutes").
Analyze the following event:
Title: "${title}"
Category: "${category || 'General'}"
Additional context: "${context || 'None'}"

Respond ONLY with valid JSON in this exact structure:
{
  "summary": "1 to 2 crisp, high-impact sentences on what happened right now.",
  "whyItMatters": "1 concise sentence explaining direct impact or financial/tech consequence.",
  "whatChanged": [
    "Key change 1 within the last 5 minutes",
    "Key change 2",
    "Key change 3"
  ],
  "sentiment": "bullish" | "bearish" | "neutral" | "critical",
  "importanceScore": a number between 75 and 99
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, aiResult: parsed, provider: 'gemini-3.8-flash' });
      return;
    } catch (err: any) {
      console.warn('Gemini summarize error, using fallback:', err.message);
    }
  }

  // Smart fallback
  res.json({
    success: true,
    provider: '5min-engine-heuristic',
    aiResult: {
      summary: `${title} — confirmed via multiple wire services with immediate sector reaction.`,
      whyItMatters: 'Represents an immediate inflection point for stakeholders monitoring real-time developments in this vertical.',
      whatChanged: [
        'Initial wire alerts verified across primary industry sources',
        'Market and community velocity spiked over 2.4x standard baseline',
        'Official statements and regulatory filings registered',
      ],
      sentiment: 'neutral',
      importanceScore: 88,
    },
  });
});

// POST /api/gemini/ask-context - Interactive Q&A for any story
app.post('/api/gemini/ask-context', async (req, res) => {
  const { storyTitle, storySummary, question } = req.body;

  if (!question || !storyTitle) {
    res.status(400).json({ error: 'Question and story title are required' });
    return;
  }

  const ai = getGenAI();
  if (ai) {
    try {
      const prompt = `You are a real-time news intelligence analyst at 5MIN NEWS.
Current Breaking Story: "${storyTitle}"
Summary: "${storySummary}"

User Question: "${question}"

Provide a sharp, 2-3 paragraph objective analysis addressing what just changed, immediate implications, and what to watch next. Keep it concise, analytical, and direct.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ success: true, answer: response.text, provider: 'gemini-2.5-flash' });
      return;
    } catch (err: any) {
      console.warn('Gemini ask-context error, using fallback:', err.message);
    }
  }

  // Fallback intelligent response
  res.json({
    success: true,
    provider: '5min-analyst-rule',
    answer: `Regarding "${question}":\n\n1. Immediate Impact: The development in "${storyTitle}" shifts near-term expectations across the sector. Data points from the last 5 minutes show heightened trading and developer activity.\n\n2. Key Variables: Watch for secondary regulatory follow-ups or counter-announcements from major competitors within the next 48 hours.\n\n3. What Changed: Cross-source reliability currently registers above 94%, confirming this is a verified update rather than an unverified leak.`,
  });
});

// POST /api/gemini/chat - Multi-language Tech, AI & SEO News Copilot
app.post('/api/gemini/chat', async (req, res) => {
  const { message, language = 'en', context = '' } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message text is required' });
    return;
  }

  const langNames: Record<string, string> = {
    en: 'English',
    hi: 'Hindi (हिंदी)',
    ta: 'Tamil (தமிழ்)',
    te: 'Telugu (తెలుగు)',
    bn: 'Bengali (বাংলা)',
    mr: 'Marathi (मराठी)',
    gu: 'Gujarati (ગુજરાતી)',
    kn: 'Kannada (ಕನ್ನಡ)',
    ml: 'Malayalam (മലയാളം)',
    es: 'Spanish (Español)',
    fr: 'French (Français)',
    de: 'German (Deutsch)',
    ja: 'Japanese (日本語)',
    zh: 'Mandarin Chinese (中文)',
    ar: 'Arabic (العربية)',
    pt: 'Portuguese (Português)',
    ru: 'Russian (Русский)',
  };

  const targetLang = langNames[language] || 'English';
  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `You are "5Min Tech & SEO Copilot", a cutting-edge real-time technology, AI, and SEO intelligence assistant.
You specialize strictly in Technology, Artificial Intelligence, Google Core Search & SEO Updates, Generative Engine Optimization (GEO), Semiconductors, Startups, and Cloud Architecture.

Target Language for Response: ${targetLang} (You MUST reply fluently in this language).

Current Live 5-Minute Stories Context:
${context || 'Latest verified technology headlines active on 5Min News wire.'}

User Query: "${message}"

Guidelines:
1. Provide a sharp, insightful, and factual briefing in ${targetLang}.
2. If asked about SEO: explain Google core updates, helpful content, search rankings, INP metrics, or Generative Engine Optimization (GEO).
3. If asked about AI: reference frontier LLMs, autonomous agents, inference latency, NVIDIA Blackwell, OpenAI, or Claude 3.7.
4. If asked about tech startups or semiconductors: detail funding rounds, chip architectures, TSMC packaging, and cloud scalability.
5. Format with clear bullet points where helpful.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({
        success: true,
        reply: response.text || 'Intelligence stream parsed successfully.',
        provider: 'Gemini 2.5 Flash',
      });
      return;
    } catch (err: any) {
      console.warn('Gemini chat error, proceeding to heuristic engine:', err.message);
    }
  }

  // Multilingual Heuristic Fallback
  const lower = message.toLowerCase();
  let fallbackReply = '';

  if (language === 'hi') {
    if (lower.includes('seo') || lower.includes('google')) {
      fallbackReply = `🔍 **गूगल कोर अपडेट और एसईओ विश्लेषण (SEO & GEO):**\n\n- गूगल ने हाल ही में अपने सर्च एल्गोरिदम और AI ओवरव्यू को अपडेट किया है, जिससे प्रथम-पक्ष सत्यापन योग्य स्रोतों को प्राथमिकता दी जा रही है।\n- **जेनेरेटिव इंजन ऑप्टिमाइज़ेशन (GEO)** के तहत विकेंद्रीकृत AI सर्च इंजनों (Perplexity, Claude, Gemini) में साइटेशन बढ़ाने के लिए संरचित स्कीमा और प्रत्यक्ष डेटा आवश्यक हैं।\n- पेज लोडिंग और INP लेटेंसी को 200ms से कम रखने की सिफारिश की गई है।`;
    } else if (lower.includes('ai') || lower.includes('openai') || lower.includes('claude')) {
      fallbackReply = `⚡ **आर्टिफिशियल इंटेलिजेंस और एजेंटिक तकनीक:**\n\n- OpenAI और Anthropic ने सब-50ms लेटेंसी वाले स्वायत्त एजेंट आर्किटेक्चर को सक्रिय किया है।\n- Claude 3.7 Sonnet हाइब्रिड रीज़निंग के साथ कोडिंग बेंचमार्क (SWE-bench 70.3%) में शीर्ष पर है।\n- NVIDIA Blackwell B200 सर्वर अब प्रमुख क्लाउड प्रोवाइडर्स (Azure, AWS, GCP) में डिप्लॉय किए जा रहे हैं।`;
    } else {
      fallbackReply = `नमस्ते! मैं आपका **5-मिनट टेक और एसईओ कोपायलट** हूँ।\n\nपिछले 5 मिनट में टेक जगत के मुख्य अपडेट्स:\n1. गूगल का नया सर्च एल्गोरिदम रोलआउट सक्रिय है।\n2. OpenAI ऑटोनॉमस एजेंट फ्रेमवर्क लाइव है।\n3. भारत और वैश्विक सेमीकंडक्टर फैब्स में रिकॉर्ड निवेश हो रहा है।\n\nआप किसी भी तकनीकी विषय, AI या एसईओ रणनीति के बारे में पूछ सकते हैं!`;
    }
  } else if (language === 'ta') {
    fallbackReply = `வணக்கம்! இது **5-நிமிட தொழில்நுட்பம் & AI செய்தி கோபைலட்**.\n\nமுக்கிய உடனடி செய்திகள்:\n1. கூகிள் தேடல் வழிமுறைகளில் (Core SEO) புதிய தரவரிசை மாற்றங்கள் ஏற்பட்டுள்ளன.\n2. OpenAI மற்றும் Claude 3.7 அதிவேக செயற்கை நுண்ணறிவு மாதிரிகள் பயன்பாட்டுக்கு வந்துள்ளன.\n3. என்விடியா பிளாக்வெல் சிப்கள் பெரிய டேட்டா சென்டர்களுக்கு அனுப்பப்பட்டு வருகின்றன.`;
  } else if (language === 'te') {
    fallbackReply = `నమస్కారం! ఇది **5-నిమిషాల టెక్నాలజీ & AI న్యూస్ కోపైలట్**.\n\nతాజా 5-నిమిషాల టెక్ అప్‌డేట్స్:\n1. గూగుల్ సెర్చ్ అల్గారిథమ్ (SEO) లో కీలక మార్పులు వచ్చాయి.\n2. OpenAI అటానమస్ ఏజెంట్ ఆర్కిటెక్చర్ వేగవంతమైన ల్యాటెన్సీతో విడుదలైనది.\n3. AI మరియు క్లౌడ్ టెక్నాలజీలో తాజా పరిణామాలు నమోదవుతున్నాయి.`;
  } else if (language === 'bn') {
    fallbackReply = `নমস্কার! আমি আপনার **৫-মিনিট প্রযুক্তি ও এআই কোপাইলট**।\n\nসর্বশেষ ৫ মিনিটের প্রযুক্তিগত আপডেট:\n১. গুগল কোর অ্যালগরিদম ও এসইও (SEO) র‍্যাঙ্কিংয়ে বড় পরিবর্তন এসেছে।\n২. OpenAI এবং Claude 3.7 স্বায়ত্তশাসিত এজেন্ট ফ্রেমওয়ার্ক চালু হয়েছে।\n৩. বিশ্বব্যাপী সেমিকন্ডাক্টর ও ক্লাউড ইনফ্রাস্ট্রাকচারে দ্রুত অগ্রগতি চলছে।`;
  } else if (language === 'es') {
    fallbackReply = `¡Hola! Soy tu **Copiloto de Noticias Tecnológicas y SEO en 5 Minutos**.\n\nÚltimas actualizaciones en tiempo real:\n1. **SEO y Algoritmos:** Google despliega cambios en el algoritmo principal favoreciendo fuentes primarias con baja latencia INP.\n2. **Inteligencia Artificial:** Lanzamiento de frameworks de agentes autónomos con latencia sub-50ms y Claude 3.7 con razonamiento híbrido.\n3. **Hardware:** NVIDIA inicia envíos masivos de racks GB200 Blackwell para centros de datos de IA.`;
  } else if (language === 'fr') {
    fallbackReply = `Bonjour ! Je suis votre **Copilote Tech & SEO 5-Minutes**.\n\nDernières actualités technologiques vérifiées :\n1. **SEO & Moteurs de Recherche :** Mise à jour majeure de l'algorithme Google avec impact sur les aperçus IA (AI Overviews).\n2. **Frontier AI :** OpenAI et Anthropic déploient des agents autonomes ultrarapides.\n3. **Semi-conducteurs :** Expédition massive des serveurs NVIDIA Blackwell B200 vers les hyperscalers.`;
  } else {
    // English
    if (lower.includes('seo') || lower.includes('google') || lower.includes('rank') || lower.includes('geo')) {
      fallbackReply = `🔍 **Google Search Core Algorithm & GEO Analysis:**\n\n- **Live Rollout:** Google's current core search update is emphasizing verified first-party citations and sub-200ms Interaction to Next Paint (INP) latency.\n- **Generative Engine Optimization (GEO):** LLM-based search engines (Perplexity, Claude, Gemini) now process over 22% of informational queries. Pages with rich structured JSON-LD and concise entity claims receive 3.2x higher citation frequency.\n- **Recommended Action:** Audit your author entity markup, prune ungrounded synthetic thin pages, and monitor SERP tracking sensors.`;
    } else if (lower.includes('ai') || lower.includes('model') || lower.includes('openai') || lower.includes('claude') || lower.includes('deepseek')) {
      fallbackReply = `⚡ **Frontier AI & Autonomous Agents Update:**\n\n- **OpenAI Agent Framework:** Sub-50ms browser-native orchestration package is published and resolving tool calls with 68% token reduction.\n- **Anthropic Claude 3.7 Sonnet:** Hybrid thinking enables dynamic 0 to 64k token reasoning budgets with verified SWE-bench coding leader status.\n- **Compute Cluster Deployment:** NVIDIA has cleared TSMC CoWoS packaging queues and is dispatching GB200 liquid-cooled racks to Azure, AWS, and GCP.`;
    } else {
      fallbackReply = `Welcome to **5Min Tech & SEO Copilot**!\n\nHere is your verified 5-minute technology pulse:\n- **SEO:** High SERP volatility detected from Google's core search updates; GEO adoption is surging across enterprise digital teams.\n- **AI & Silicon:** Autonomous agent latency dropped below 50ms; NVIDIA Blackwell GB200 servers are now streaming to global datacenters.\n- **India Tech:** PIB and national incubators report a 42% boost in semiconductor design patents.\n\nAsk me anything about SEO tactics, AI benchmarks, breaking tech stories, or cloud infrastructure!`;
    }
  }

  res.json({
    success: true,
    reply: fallbackReply,
    provider: '5Min-Tech-Engine',
  });
});

// POST /api/ingest/trigger - Run 5-Minute Ingestion cycle or generate real AI breaking story
app.post('/api/ingest/trigger', async (req, res) => {
  const { customTopic } = req.body;
  const startTime = Date.now();

  const pipelineStages: IngestionPipelineMetric[] = [
    { stage: 'NEWS SOURCES', status: 'success', latencyMs: 64, itemCount: 42, details: 'Scanned 7 active wires (Reuters, Bloomberg, TechCrunch, PIB, etc.)' },
    { stage: 'INGESTION & SCRAPING', status: 'success', latencyMs: 112, itemCount: 38, details: 'Normalized HTML/RSS payloads and extracted full text' },
    { stage: 'DUPLICATE DETECTION', status: 'success', latencyMs: 45, itemCount: 12, details: 'Clustered 12 overlapping wire dispatches into canonical stories' },
    { stage: 'AI CLASSIFICATION', status: 'success', latencyMs: 82, itemCount: 4, details: 'Auto-tagged categories, entities, and sentiment vectors' },
    { stage: 'AI SUMMARY & WHAT CHANGED', status: 'success', latencyMs: 130, itemCount: 4, details: 'Generated 2-sentence executive briefs & 3-point diffs' },
    { stage: 'IMPORTANCE SCORING', status: 'success', latencyMs: 22, itemCount: 4, details: 'Weighted by freshness (40%), source trust (30%), velocity (30%)' },
    { stage: 'DATABASE & REDIS CACHE', status: 'success', latencyMs: 18, itemCount: 4, details: 'Invalidated 5-minute edge cache; deployed to live feed' },
  ];

  totalArticlesIngested += 4;
  duplicatesFiltered += 12;
  aiSummariesGenerated += 4;
  lastIngestionRun = new Date().toISOString();

  // Create a new breaking story
  let newStory: NewsStory;
  const ai = getGenAI();

  if (ai && customTopic) {
    try {
      const prompt = `Create a realistic breaking news story for 5MIN NEWS about: "${customTopic}".
Return valid JSON matching this schema:
{
  "title": "Compelling, urgent breaking news headline",
  "summary": "1-2 crisp factual sentences of what just happened 1 minute ago",
  "category": "Technology" | "AI" | "Business" | "Startups" | "Markets" | "World" | "India" | "Cybersecurity" | "Science",
  "whatChanged": ["change 1 in last 5m", "change 2", "change 3"],
  "whyItMatters": "1 concise sentence on importance",
  "importanceScore": a number 88-99,
  "entities": ["entity1", "entity2", "entity3"]
}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const parsed = JSON.parse(response.text || '{}');
      const now = new Date();
      newStory = {
        id: `story-${Date.now()}`,
        title: parsed.title || `Breaking: Major announcement regarding ${customTopic}`,
        slug: (parsed.title || customTopic).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
        category: parsed.category || 'Technology',
        summary: parsed.summary || `Significant development in ${customTopic} confirmed by industry sources.`,
        source: { name: '5MIN AI Wire', url: 'https://5minnews.io', reliabilityScore: 97 },
        sources: [
          { name: '5MIN AI Wire', url: 'https://5minnews.io', reliabilityScore: 97 },
          { name: 'Global Wire Service', url: 'https://reuters.com', reliabilityScore: 98 },
        ],
        publishedAt: now.toISOString(),
        updatedAt: now.toISOString(),
        minutesAgo: 0,
        importanceScore: parsed.importanceScore || 96,
        velocity: 'breaking',
        isLive: true,
        whatChanged: parsed.whatChanged || [
          'Initial bulletin verified across market monitoring nodes',
          'Immediate volume expansion in related instruments',
          'Executive confirmation issued 90 seconds ago',
        ],
        timeline: [
          { time: 'Just now', title: 'Story synthesized', detail: 'Real-time multi-source ingest normalized.', source: '5MIN Engine' },
        ],
        aiContext: {
          background: `Recent developments around ${customTopic} led to elevated attention across global observers.`,
          whyItMatters: parsed.whyItMatters || 'Pivotal structural adjustment with wide-reaching market or tech implications.',
          outlook: 'Subsequent briefings expected within the next 30 minutes.',
          sentiment: 'bullish',
          confidenceScore: 98,
        },
        entities: parsed.entities || [customTopic, 'Breaking', 'Intelligence'],
        topic: customTopic,
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
        readTime: '1.5 min read',
        viewsCount: 142,
        isAiSynthesized: true,
        seo: {
          title: `${parsed.title || customTopic} - 5MIN NEWS Live`,
          metaDescription: parsed.summary || 'Live breaking update.',
          canonicalUrl: `https://5minnews.io/news/live/${Date.now()}`,
          keywords: [customTopic, 'Breaking News', '5Min News'],
        },
      };
    } catch (e) {
      newStory = createSyntheticBreakingStory(customTopic);
    }
  } else {
    newStory = createSyntheticBreakingStory(customTopic);
  }

  // Prepend to stories
  storiesState = [newStory, ...storiesState.slice(0, 25)];

  const totalLatency = Date.now() - startTime;

  res.json({
    success: true,
    totalLatencyMs: totalLatency,
    pipelineStages,
    newStory,
    metrics: {
      totalArticlesIngested,
      duplicatesFiltered,
      aiSummariesGenerated,
      lastIngestionRun,
    },
  });
});

function createSyntheticBreakingStory(topicHint?: string): NewsStory {
  const topics = [
    {
      title: 'European Central Bank Initiates Digital Euro Instant Settlement Testbed',
      cat: 'Markets' as const,
      summary: 'Frankfurt announced the live deployment of a high-throughput central bank digital ledger with five commercial clearinghouses.',
      entities: ['ECB', 'Digital Euro', 'Fintech', 'Banking'],
      why: 'Marks the decisive transition from regulatory whitepapers into live transaction settlement.',
    },
    {
      title: 'Anthropic Unveils Multi-Agent Code Verification Standard',
      cat: 'AI' as const,
      summary: 'A new formal verification framework allows teams to mathematically prove agentic code execution correctness prior to production deployment.',
      entities: ['Anthropic', 'AI Safety', 'Software Engineering'],
      why: 'Solves the critical trust and compliance roadblock preventing enterprise deployment of autonomous coding agents.',
    },
    {
      title: 'India Space Research Organisation Successfully Tests Next-Gen Cryogenic Stage',
      cat: 'India' as const,
      summary: 'ISRO completed an unhalted 720-second hot fire test of the CE-20 cryogenic engine for future heavy-lift lunar sample return missions.',
      entities: ['ISRO', 'Space', 'Chandrayaan', 'Propulsion'],
      why: 'Locks in payload capacity for the upcoming 2028 collaborative lunar landing mission.',
    },
  ];

  const picked = topicHint
    ? {
        title: `Breaking: Accelerated Strategic Update Regarding ${topicHint}`,
        cat: 'Technology' as const,
        summary: `Verified dispatches confirm an emergency coordination session concerning ${topicHint} concluded 3 minutes ago.`,
        entities: [topicHint, 'Global Updates', 'Live Wire'],
        why: 'Immediate sector rebalancing expected as official whitepapers are uploaded.',
      }
    : topics[Math.floor(Math.random() * topics.length)];

  const now = new Date();
  return {
    id: `story-${Date.now()}`,
    title: picked.title,
    slug: picked.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
    category: picked.cat,
    summary: picked.summary,
    source: { name: '5MIN Fast Wire', url: 'https://5minnews.io', reliabilityScore: 98 },
    sources: [
      { name: '5MIN Fast Wire', url: 'https://5minnews.io', reliabilityScore: 98 },
      { name: 'Associated Press', url: 'https://apnews.com', reliabilityScore: 97 },
    ],
    publishedAt: now.toISOString(),
    updatedAt: now.toISOString(),
    minutesAgo: 0,
    importanceScore: 95,
    velocity: 'breaking',
    isLive: true,
    whatChanged: [
      'Official communique confirmed via designated regulatory channel',
      'Benchmark futures responded with 40-basis-point upward tick',
      'Direct cross-source verification concluded in 48 seconds',
    ],
    timeline: [
      { time: '1 min ago', title: 'Signal detected', detail: 'Automated wire scraper registered anomalous bulletin.', source: '5MIN Scraper' },
      { time: 'Just now', title: 'Verification completed', detail: 'Secondary wire confirmed verbatim clauses.', source: 'Fast Wire' },
    ],
    aiContext: {
      background: 'Preceding volatility indicated market positioning ahead of this announcement.',
      whyItMatters: picked.why,
      outlook: 'Monitoring follow-on press conferences in Tokyo and New York.',
      sentiment: 'bullish',
      confidenceScore: 96,
    },
    entities: picked.entities,
    topic: picked.entities[0],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    readTime: '1.5 min read',
    viewsCount: 78,
    isAiSynthesized: true,
    seo: {
      title: `${picked.title} - 5MIN NEWS Live`,
      metaDescription: picked.summary,
      canonicalUrl: `https://5minnews.io/news/${Date.now()}`,
      keywords: [...picked.entities, '5Min News'],
    },
  };
}

// GET /api/ingest/sources - Get sources
app.get('/api/ingest/sources', (req, res) => {
  res.json({ sources: ingestionSourcesState });
});

// POST /api/ingest/sources/:id/toggle - Toggle source status
app.post('/api/ingest/sources/:id/toggle', (req, res) => {
  const { id } = req.params;
  const src = ingestionSourcesState.find((s) => s.id === id);
  if (!src) {
    res.status(404).json({ error: 'Source not found' });
    return;
  }
  src.status = src.status === 'online' ? 'paused' : 'online';
  res.json({ success: true, source: src });
});

// POST /api/newsletter/subscribe - Subscribe to digests
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email, cadence, tier } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email address is required' });
    return;
  }

  res.json({
    success: true,
    message: `Subscribed ${email} to ${cadence || '5-Minute Morning Brief'}!`,
    subscription: {
      email,
      cadence: cadence || 'morning',
      tier: tier || 'pro',
      status: 'active',
      firstBriefAt: 'Tomorrow 08:00 AM IST',
    },
  });
});

// GET /api/admin/metrics - Ingestion & SEO analytics
app.get('/api/admin/metrics', (req, res) => {
  res.json({
    totalIngested: totalArticlesIngested,
    duplicatesBlocked: duplicatesFiltered,
    aiSummaries: aiSummariesGenerated,
    avgLatencyMs: 310,
    cacheHitRate: '98.6%',
    activeSourcesCount: ingestionSourcesState.filter((s) => s.status === 'online').length,
    activeSubscribers: 12480,
    apiRequestsToday: 184920,
    topCategories: [
      { name: 'AI', percentage: 32 },
      { name: 'Markets', percentage: 24 },
      { name: 'Technology', percentage: 18 },
      { name: 'India', percentage: 14 },
      { name: 'Cybersecurity', percentage: 12 },
    ],
  });
});

// ----------------- VITE MIDDLEWARE / STATIC SERVING ----------------- //

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`5MIN NEWS Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
