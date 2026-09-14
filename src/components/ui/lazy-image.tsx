import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    placeholderColor?: string;
    aspectRatio?: string;
}

export function LazyImage({
    src,
    alt,
    className,
    placeholderColor = 'bg-muted',
    aspectRatio,
    ...props
}: LazyImageProps) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div
            className={cn('relative overflow-hidden', className)}
            style={aspectRatio ? { aspectRatio } : undefined}
        >
            {/* Placeholder with pulse animation */}
            {!loaded && !error && (
                <div className={cn(
                    'absolute inset-0 animate-pulse',
                    placeholderColor
                )} />
            )}

            {/* Error state */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
                    Bild nicht verfügbar
                </div>
            )}

            <img
                src={src}
                alt={alt || ''}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                className={cn(
                    'w-full h-full object-cover transition-opacity duration-500',
                    loaded ? 'opacity-100' : 'opacity-0'
                )}
                {...props}
            />
        </div>
    );
}
