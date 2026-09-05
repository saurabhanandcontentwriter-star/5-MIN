export function formatMinutesAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes <= 0) return 'Just now';
  if (diffMinutes === 1) return '1m ago';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return '1h ago';
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function formatISOTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return '12:00:00';
  }
}

export function getCategoryBadgeClass(category: string, isDark: boolean = true): string {
  const map: Record<string, { dark: string; light: string }> = {
    AI: {
      dark: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
      light: 'bg-violet-50 text-violet-700 border-violet-200',
    },
    Technology: {
      dark: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      light: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    SEO: {
      dark: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      light: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    'India Tech': {
      dark: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
      light: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    'Global Tech': {
      dark: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
      light: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    DevTools: {
      dark: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      light: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    Markets: {
      dark: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      light: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    Business: {
      dark: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      light: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
    Startups: {
      dark: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      light: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    India: {
      dark: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
      light: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    World: {
      dark: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      light: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    Cybersecurity: {
      dark: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      light: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    Science: {
      dark: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
      light: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    Politics: {
      dark: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      light: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    Sports: {
      dark: 'bg-lime-500/10 text-lime-300 border-lime-500/30',
      light: 'bg-lime-50 text-lime-700 border-lime-200',
    },
  };

  const c = map[category] || {
    dark: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    light: 'bg-zinc-100 text-zinc-700 border-zinc-300',
  };

  return isDark ? c.dark : c.light;
}
