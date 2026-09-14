// src/components/blocks/HeroBlock.tsx
import type { HeroBlock as HeroBlockType } from '@/config/website.config.schema';
import { Button } from '@/components/ui/button';
import { SmartLink } from '@/components/ui/smart-link';

export function HeroBlock(props: HeroBlockType) {
    const { variant, headline, subheadline, cta, backgroundImage, badge } = props;

    // Variant: Fullscreen
    if (variant === 'fullscreen') {
        return (
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {backgroundImage && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={backgroundImage}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60" />
                    </div>
                )}

                <div className="container relative z-10 mx-auto px-4 text-center text-white">
                    {badge && (
                        <div className="inline-flex items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium mb-8">
                            {badge}
                        </div>
                    )}

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 max-w-5xl mx-auto drop-shadow-lg">
                        {headline}
                    </h1>

                    {subheadline && (
                        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
                            {subheadline}
                        </p>
                    )}

                    {cta && (
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button asChild size="lg" className="text-lg px-8 py-6">
                                <SmartLink href={cta.primary.href}>{cta.primary.text}</SmartLink>
                            </Button>
                            {cta.secondary && (
                                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10">
                                    <SmartLink href={cta.secondary.href}>{cta.secondary.text}</SmartLink>
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                        <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
                    </div>
                </div>
            </section>
        );
    }

    // Variant: Parallax (simulated with CSS)
    if (variant === 'parallax') {
        return (
            <section className="relative py-32 md:py-48 overflow-hidden">
                {backgroundImage && (
                    <div
                        className="absolute inset-0 z-0 bg-fixed bg-center bg-cover"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/80" />
                    </div>
                )}

                <div className="container relative z-10 mx-auto px-4 text-center">
                    {badge && (
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary text-primary-foreground mb-8">
                            {badge}
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto">
                        {headline}
                    </h1>

                    {subheadline && (
                        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                            {subheadline}
                        </p>
                    )}

                    {cta && (
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button asChild size="lg" className="text-lg">
                                <SmartLink href={cta.primary.href}>{cta.primary.text}</SmartLink>
                            </Button>
                            {cta.secondary && (
                                <Button asChild variant="outline" size="lg" className="text-lg">
                                    <SmartLink href={cta.secondary.href}>{cta.secondary.text}</SmartLink>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // Variant: Centered
    if (variant === 'centered') {
        return (
            <section className="relative py-20 md:py-32 overflow-hidden">
                {backgroundImage && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={backgroundImage}
                            alt=""
                            className="w-full h-full object-cover opacity-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    </div>
                )}

                <div className="container relative z-10 mx-auto px-4 text-center">
                    {badge && (
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6">
                            {badge}
                        </div>
                    )}

                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 max-w-4xl mx-auto">
                        {headline}
                    </h1>

                    {subheadline && (
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {subheadline}
                        </p>
                    )}

                    {cta && (
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button asChild size="lg">
                                <SmartLink href={cta.primary.href}>{cta.primary.text}</SmartLink>
                            </Button>
                            {cta.secondary && (
                                <Button asChild variant="outline" size="lg">
                                    <SmartLink href={cta.secondary.href}>{cta.secondary.text}</SmartLink>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // Variant: Split (Text Left, Image/Content Right)
    if (variant === 'split') {
        return (
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            {badge && (
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6">
                                    {badge}
                                </div>
                            )}
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                                {headline}
                            </h1>
                            {subheadline && (
                                <p className="text-xl text-muted-foreground mb-8">
                                    {subheadline}
                                </p>
                            )}
                            {cta && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button asChild size="lg">
                                        <SmartLink href={cta.primary.href}>{cta.primary.text}</SmartLink>
                                    </Button>
                                    {cta.secondary && (
                                        <Button asChild variant="outline" size="lg">
                                            <SmartLink href={cta.secondary.href}>{cta.secondary.text}</SmartLink>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-muted/50">
                            {backgroundImage ? (
                                <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Hero Image/Video Placeholder
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Fallback / standard
    return null;
}

