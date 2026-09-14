// src/components/blocks/FeatureGridBlock.tsx
import * as Icons from 'lucide-react';
import type { ElementType, ReactNode } from 'react';
import type { FeatureGridBlock as FeatureGridBlockType } from '@/config/website.config.schema';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SmartLink } from '@/components/ui/smart-link';

export function FeatureGridBlock(props: FeatureGridBlockType) {
    const { variant, title, subtitle, features, columns = 3 } = props;

    const getGridCols = (cols: number) => {
        switch (cols) {
            case 2: return 'md:grid-cols-2';
            case 4: return 'md:grid-cols-2 lg:grid-cols-4';
            default: return 'md:grid-cols-3';
        }
    };

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
                    {subtitle && (
                        <p className="text-xl text-muted-foreground">{subtitle}</p>
                    )}
                </div>

                <div className={cn("grid grid-cols-1 gap-8", getGridCols(columns))}>
                    {features.map((feature, index) => {
                        const Icon = feature.icon && (Icons[feature.icon as keyof typeof Icons] as ElementType);

                        const wrap = (children: ReactNode) => feature.href ? (
                            <SmartLink key={index} href={feature.href} className="block h-full">{children}</SmartLink>
                        ) : children;

                        if (variant === 'cards') {
                            return wrap(
                                <Card key={index} className="h-full border-border/50 bg-card hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        {Icon && <Icon className="h-10 w-10 text-primary mb-4" />}
                                        <CardTitle>{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        }

                        if (variant === 'bento') {
                            // Simple grid fallback for now, Bento usually requires custom spans
                            return (
                                <div key={index} className="group relative overflow-hidden rounded-xl border bg-background p-8 hover:bg-muted/50 transition-colors">
                                    {Icon && <Icon className="h-8 w-8 text-primary mb-4" />}
                                    <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            );
                        }

                        // Default / Icons variant
                        return (
                            <div key={index} className="flex flex-col items-center text-center p-6">
                                <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
                                    {Icon ? <Icon className="h-6 w-6" /> : <Icons.Star className="h-6 w-6" />}
                                </div>
                                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
