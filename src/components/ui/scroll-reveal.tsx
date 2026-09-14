import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    className?: string;
    once?: boolean;
}

export function ScrollReveal({
    children,
    delay = 0,
    direction = 'up',
    className,
    once = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) {
                        observer.unobserve(element);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '-50px',
            }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [once]);

    const getInitialTransform = () => {
        switch (direction) {
            case 'up': return 'translate-y-8';
            case 'down': return '-translate-y-8';
            case 'left': return 'translate-x-8';
            case 'right': return '-translate-x-8';
            default: return '';
        }
    };

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-700 ease-out',
                isVisible
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : `opacity-0 ${getInitialTransform()}`,
                className
            )}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
