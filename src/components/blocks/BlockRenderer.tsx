// src/components/blocks/BlockRenderer.tsx

import type { ContentBlock } from '@/config/website.config.schema';
import { HeroBlock } from './HeroBlock';
import { SocialProofBlock } from './SocialProofBlock';
import { FeatureGridBlock } from './FeatureGridBlock';
import { CTABlock } from './CTABlock';
import { TestimonialsBlock } from './TestimonialsBlock';
import { PricingBlock } from './PricingBlock';
import { FAQBlock } from './FAQBlock';
import { ContactFormBlock } from './ContactFormBlock';
import { TeamBlock } from './TeamBlock';
import { BlogPreviewBlock } from './BlogPreviewBlock';
import { JobsListBlock } from './JobsListBlock';
import { TextBlock } from './TextBlock';

interface BlockRendererProps {
    blocks: ContentBlock[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
    if (!blocks || blocks.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col w-full">
            {blocks.map((block, index) => {
                // Key should be unique, using index + type fallback
                const key = `${block.type}-${index}`;

                switch (block.type) {
                    case 'hero':
                        return <HeroBlock key={key} {...block} />;
                    case 'social-proof':
                        return <SocialProofBlock key={key} {...block} />;
                    case 'feature-grid':
                        return <FeatureGridBlock key={key} {...block} />;
                    case 'cta':
                        return <CTABlock key={key} {...block} />;
                    case 'testimonials':
                        return <TestimonialsBlock key={key} {...block} />;
                    case 'pricing':
                        return <PricingBlock key={key} {...block} />;
                    case 'faq':
                        return <FAQBlock key={key} {...block} />;
                    case 'contact-form':
                        return <ContactFormBlock key={key} {...block} />;
                    case 'team':
                        return <TeamBlock key={key} {...block} />;
                    case 'blog-preview':
                        return <BlogPreviewBlock key={key} {...block} />;
                    case 'jobs-list':
                        return <JobsListBlock key={key} {...block} />;
                    case 'text':
                        return <TextBlock key={key} {...block} />;
                    case 'image':
                        // Simple fallback or implement ImageBlock
                        return (
                            <div key={key} className="container py-8">
                                <img src={block.src} alt={block.alt} className={block.fullWidth ? 'w-full' : 'max-w-4xl mx-auto'} />
                            </div>
                        );
                    default:
                        console.warn(`Unknown block type: ${(block as { type: string }).type}`);
                        return null;
                }
            })}
        </div>
    );
}
