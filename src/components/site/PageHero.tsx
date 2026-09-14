import type { ReactNode } from 'react';

interface Props {
    title: string;
    lead?: string;
    image: string;
    imagePosition?: string;
    children?: ReactNode;
}

/** Compact hero for subpages: photo with a dark scrim, title bottom-left. */
export function PageHero({ title, lead, image, imagePosition = 'center', children }: Props) {
    return (
        <section className="relative isolate overflow-hidden bg-surface pt-[72px]">
            <img
                src={image}
                alt=""
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
                style={{ objectPosition: imagePosition }}
                fetchPriority="high"
                width={1600}
                height={900}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/20" />
            <div className="container-site pt-16 pb-12 md:pt-24 md:pb-16">
                <h1 className="font-display display-xl text-foreground fade-up">{title}</h1>
                {lead && <p className="mt-4 max-w-xl text-lg text-muted-foreground fade-up" style={{ animationDelay: '120ms' }}>{lead}</p>}
                {children}
            </div>
        </section>
    );
}
