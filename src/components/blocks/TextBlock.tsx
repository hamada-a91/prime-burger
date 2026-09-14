// src/components/blocks/TextBlock.tsx
import type { TextBlock as TextBlockType } from '@/config/website.config.schema';
import { cn } from '@/lib/utils';
// Note: In a real app we'd use a markdown parser or rich text renderer here
// For now we just render text with newlines

export function TextBlock(props: TextBlockType) {
    const { content, alignment = 'left' } = props;

    return (
        <section className="py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div
                    className={cn(
                        "prose prose-lg dark:prose-invert max-w-none",
                        alignment === 'center' && "text-center mx-auto",
                        alignment === 'right' && "text-right ml-auto",
                        alignment === 'left' && "text-left mr-auto"
                    )}
                >
                    {content.split('\n').map((line: string, i: number) => (
                        <p key={i} className="mb-4 last:mb-0">{line}</p>
                    ))}
                </div>
            </div>
        </section>
    );
}
