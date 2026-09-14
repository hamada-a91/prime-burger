// src/components/blocks/SocialProofBlock.tsx
import type { SocialProofBlock as SocialProofBlockType } from '@/config/website.config.schema';

export function SocialProofBlock(props: SocialProofBlockType) {
    const { variant, title, logos, stats } = props;

    if (variant === 'logos' && logos) {
        return (
            <section className="py-12 border-y border-border/40 bg-muted/20">
                <div className="container mx-auto px-4 text-center">
                    {title && (
                        <p className="text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-wider">
                            {title}
                        </p>
                    )}
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-80">
                        {logos.map((logo, index) => (
                            <img
                                key={index}
                                src={logo.src}
                                alt={logo.alt}
                                className="h-8 md:h-10 w-auto object-contain"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (variant === 'stats' && stats) {
        return (
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="p-6">
                                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-lg text-muted-foreground font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return null;
}
