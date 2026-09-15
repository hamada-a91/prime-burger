import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type RevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'blur-in';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: RevealVariant;
  threshold?: number;
  as?: 'div' | 'section' | 'li' | 'header' | 'footer' | 'article';
}

const variantStyles: Record<
  RevealVariant,
  { initial: string; visible: string }
> = {
  'fade-up': {
    initial: 'opacity-0 translate-y-8',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-down': {
    initial: 'opacity-0 -translate-y-8',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-left': {
    initial: 'opacity-0 -translate-x-8',
    visible: 'opacity-100 translate-x-0',
  },
  'fade-right': {
    initial: 'opacity-0 translate-x-8',
    visible: 'opacity-100 translate-x-0',
  },
  'zoom-in': {
    initial: 'opacity-0 scale-[0.93]',
    visible: 'opacity-100 scale-100',
  },
  'blur-in': {
    initial: 'opacity-0 blur-sm scale-[0.96] translate-y-4',
    visible: 'opacity-100 blur-0 scale-100 translate-y-0',
  },
};

/**
 * High-performance viewport reveal engine with Apple/Awwwards easing.
 * Fully supports reduced-motion preferences.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 800,
  variant = 'fade-up',
  threshold = 0.1,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const { initial, visible: active } = variantStyles[variant];

  return (
    <Tag
      ref={(el: HTMLElement | null) => {
        ref.current = el;
      }}
      className={cn(
        'transition-all ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity,filter]',
        visible ? active : initial,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
