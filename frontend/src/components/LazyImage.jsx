import { useState } from 'react';

/**
 * Responsive lazy-loaded image with WebP support and skeleton placeholder.
 * Uses native browser lazy loading + decoding="async".
 */
export default function LazyImage({
  src,
  thumbSrc,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center text-gray-400 text-sm ${className}`}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <span>📷</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton shown while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-inherit" aria-hidden="true" />
      )}
      <img
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'low'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
