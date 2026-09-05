import React, { useState } from 'react';

interface ReliableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  category?: string;
}

const DEFAULT_TECH_FALLBACKS: Record<string, string> = {
  AI: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  SEO: 'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?w=1200&auto=format&fit=crop&q=80',
  Cybersecurity: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
  Startups: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&auto=format&fit=crop&q=80',
  'India Tech': 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&auto=format&fit=crop&q=80',
  'Global Tech': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
  DevTools: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
};

const GENERIC_TECH_FALLBACK =
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80';

export const ReliableImage: React.FC<ReliableImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackSrc,
  category,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fallback =
    fallbackSrc ||
    (category && DEFAULT_TECH_FALLBACKS[category]) ||
    GENERIC_TECH_FALLBACK;

  const currentSrc = hasError || !src ? fallback : src;

  return (
    <div className={`relative overflow-hidden bg-zinc-800/80 ${className}`}>
      {/* Background skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}

      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
          }
        }}
        {...props}
      />
    </div>
  );
};
