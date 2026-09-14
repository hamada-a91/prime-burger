// src/components/blocks/FAQBlock.tsx
import type { FAQBlock as FAQBlockType } from '@/config/website.config.schema';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQBlock(props: FAQBlockType) {
    const { title, subtitle, items } = props;

    return (
        <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
                    {subtitle && (
                        <p className="text-xl text-muted-foreground">{subtitle}</p>
                    )}
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {items.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                            <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
