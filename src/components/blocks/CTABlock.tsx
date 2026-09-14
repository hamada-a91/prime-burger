// src/components/blocks/CTABlock.tsx
import type { CTABlock as CTABlockType } from '@/config/website.config.schema';
import { Button } from '@/components/ui/button';
import { SmartLink } from '@/components/ui/smart-link';

export function CTABlock(props: CTABlockType) {
    const { variant, headline, description, button } = props;

    if (variant === 'gradient') {
        return (
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent px-6 py-20 text-center sm:px-12 md:px-24">
                        <div className="relative z-10 mx-auto max-w-2xl">
                            <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
                                {headline}
                            </h2>
                            {description && (
                                <p className="text-lg text-white/90 mb-10">
                                    {description}
                                </p>
                            )}
                            <Button asChild size="lg" variant="secondary" className="text-primary hover:text-primary">
                                <SmartLink href={button.href}>{button.text}</SmartLink>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Simple / Default
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-6">{headline}</h2>
                {description && (
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        {description}
                    </p>
                )}
                <Button asChild size="lg">
                    <SmartLink href={button.href}>{button.text}</SmartLink>
                </Button>
            </div>
        </section>
    );
}
