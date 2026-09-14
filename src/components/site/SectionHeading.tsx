import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    title: string;
    text?: string;
    eyebrow?: string;
    align?: 'left' | 'center';
    as?: 'h1' | 'h2';
    className?: string;
    children?: ReactNode;
}

export function SectionHeading({ title, text, eyebrow, align = 'left', as: Tag = 'h2', className, children }: Props) {
    return (
        <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            <Tag className="font-display display-lg text-foreground">{title}</Tag>
            {text && <p className="mt-4 text-lg text-muted-foreground">{text}</p>}
            {children}
        </div>
    );
}
