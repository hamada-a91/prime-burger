// src/components/blocks/PricingBlock.tsx
import { Check } from 'lucide-react';
import type { PricingBlock as PricingBlockType } from '@/config/website.config.schema';
import { Button } from '@/components/ui/button';
import { SmartLink } from '@/components/ui/smart-link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function PricingBlock(props: PricingBlockType) {
    const { title, subtitle, plans } = props;

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
                    {subtitle && (
                        <p className="text-xl text-muted-foreground">{subtitle}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={cn(
                                "flex flex-col relative",
                                plan.highlighted ? "border-primary shadow-lg scale-105 z-10" : "border-border/50"
                            )}
                        >
                            {plan.badge && (
                                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                                    {plan.badge}
                                </Badge>
                            )}

                            <CardHeader>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price.monthly}</span>
                                    <span className="text-muted-foreground">/Monat</span>
                                </div>

                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    asChild
                                    className="w-full"
                                    variant={plan.highlighted ? "default" : "outline"}
                                    size="lg"
                                >
                                    <SmartLink href={plan.cta.href}>{plan.cta.text}</SmartLink>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
