import { Flame, Star } from 'lucide-react';
import { useDictionary } from '@/i18n';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  className?: string;
  speed?: 'normal' | 'slow' | 'fast';
}

export function Marquee({ className, speed = 'normal' }: MarqueeProps) {
  const ITEMS = useDictionary().home.marquee;
  const speedClass = speed === 'slow' ? 'duration-[45s]' : speed === 'fast' ? 'duration-[20s]' : 'duration-[30s]';

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden border-y border-border/80 bg-surface/80 py-3.5 backdrop-blur-sm select-none',
        'before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-16 before:bg-gradient-to-r before:from-background before:to-transparent before:pointer-events-none',
        'after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-16 after:bg-gradient-to-l after:from-background after:to-transparent after:pointer-events-none',
        className
      )}
      aria-label="Prime Burger Highlights"
    >
      <div className="flex w-max marquee-container group">
        <div className={cn('marquee-content flex shrink-0 items-center gap-6 pr-6', speedClass)}>
          {ITEMS.map((item, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <span className="font-display text-base tracking-[0.2em] text-foreground/90 md:text-lg">
                {item}
              </span>
              {idx % 2 === 0 ? (
                <Star className="size-3.5 fill-primary text-primary" aria-hidden />
              ) : (
                <Flame className="size-3.5 text-brand-red" aria-hidden />
              )}
            </div>
          ))}
        </div>

        {/* Duplicate track for seamless infinite scroll */}
        <div
          aria-hidden="true"
          className={cn('marquee-content flex shrink-0 items-center gap-6 pr-6', speedClass)}
        >
          {ITEMS.map((item, idx) => (
            <div key={`dup-${idx}`} className="flex items-center gap-6">
              <span className="font-display text-base tracking-[0.2em] text-foreground/90 md:text-lg">
                {item}
              </span>
              {idx % 2 === 0 ? (
                <Star className="size-3.5 fill-primary text-primary" aria-hidden />
              ) : (
                <Flame className="size-3.5 text-brand-red" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
