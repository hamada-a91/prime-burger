// src/components/blocks/TestimonialsBlock.tsx
import { Star } from 'lucide-react';
import type { TestimonialsBlock as TestimonialsBlockType } from '@/config/website.config.schema';
import { Card, CardContent } from '@/components/ui/card';

export function TestimonialsBlock(props: TestimonialsBlockType) {
    const { variant, title, testimonials } = props;

    // Variant: Wall (Animated scrolling wall of testimonials)
    if (variant === 'wall') {
        return (
            <section className="py-20 bg-muted/30 overflow-hidden">
                <div className="container mx-auto px-4 mb-12">
                    {title && (
                        <h2 className="text-3xl font-bold tracking-tight text-center">{title}</h2>
                    )}
                </div>

                {/* Scrolling testimonials - first row */}
                <div className="relative">
                    <div className="flex gap-6 animate-scroll">
                        {[...testimonials, ...testimonials].map((item, index) => (
                            <Card key={index} className="min-w-[350px] max-w-[350px] border-none shadow-md shrink-0">
                                <CardContent className="p-6">
                                    <div className="flex gap-1 text-amber-400 mb-4">
                                        {[...Array(item.rating || 5)].map((_, i) => (
                                            <Star key={i} className="fill-current w-4 h-4" />
                                        ))}
                                    </div>
                                    <blockquote className="text-base font-medium leading-relaxed mb-4 line-clamp-4">
                                        "{item.quote}"
                                    </blockquote>
                                    <div className="flex items-center gap-3">
                                        {item.avatar && (
                                            <img
                                                src={item.avatar}
                                                alt={item.author}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        )}
                                        <div>
                                            <div className="font-bold text-sm">{item.author}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.role}{item.company && `, ${item.company}`}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Second row scrolling in opposite direction */}
                <div className="relative mt-6">
                    <div className="flex gap-6 animate-scroll-reverse">
                        {[...testimonials, ...testimonials].reverse().map((item, index) => (
                            <Card key={index} className="min-w-[350px] max-w-[350px] border-none shadow-md shrink-0">
                                <CardContent className="p-6">
                                    <div className="flex gap-1 text-amber-400 mb-4">
                                        {[...Array(item.rating || 5)].map((_, i) => (
                                            <Star key={i} className="fill-current w-4 h-4" />
                                        ))}
                                    </div>
                                    <blockquote className="text-base font-medium leading-relaxed mb-4 line-clamp-4">
                                        "{item.quote}"
                                    </blockquote>
                                    <div className="flex items-center gap-3">
                                        {item.avatar && (
                                            <img
                                                src={item.avatar}
                                                alt={item.author}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        )}
                                        <div>
                                            <div className="font-bold text-sm">{item.author}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.role}{item.company && `, ${item.company}`}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <style>{`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @keyframes scroll-reverse {
                        0% { transform: translateX(-50%); }
                        100% { transform: translateX(0); }
                    }
                    .animate-scroll {
                        animation: scroll 30s linear infinite;
                    }
                    .animate-scroll-reverse {
                        animation: scroll-reverse 30s linear infinite;
                    }
                    .animate-scroll:hover, .animate-scroll-reverse:hover {
                        animation-play-state: paused;
                    }
                `}</style>
            </section>
        );
    }

    // Default: Grid variant
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                {title && (
                    <h2 className="text-3xl font-bold tracking-tight text-center mb-16">{title}</h2>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <Card key={index} className="border-none shadow-md h-full">
                            <CardContent className="p-8 flex flex-col h-full">
                                <div className="flex gap-1 text-amber-400 mb-6">
                                    {[...Array(item.rating || 5)].map((_, i) => (
                                        <Star key={i} className="fill-current w-5 h-5" />
                                    ))}
                                </div>

                                <blockquote className="text-lg font-medium leading-relaxed mb-6 flex-1">
                                    "{item.quote}"
                                </blockquote>

                                <div className="flex items-center gap-4 mt-auto">
                                    {item.avatar && (
                                        <img
                                            src={item.avatar}
                                            alt={item.author}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <div className="font-bold">{item.author}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {item.role}{item.company && `, ${item.company}`}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

