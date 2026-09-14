// src/components/blocks/ImageBlock.tsx
import type { ImageBlock as ImageBlockType } from '@/config/website.config.schema';

export function ImageBlock(props: ImageBlockType) {
    const { src, alt, caption, fullWidth } = props;

    return (
        <section className="py-12">
            <div className={fullWidth ? "w-full" : "container mx-auto px-4"}>
                <figure className="relative">
                    <img
                        src={src}
                        alt={alt}
                        className={`w-full h-auto object-cover ${fullWidth ? 'max-h-[600px]' : 'rounded-lg max-h-[500px] mx-auto'}`}
                    />
                    {caption && (
                        <figcaption className="text-center text-sm text-muted-foreground mt-3">
                            {caption}
                        </figcaption>
                    )}
                </figure>
            </div>
        </section>
    );
}
