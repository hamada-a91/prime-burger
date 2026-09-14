import { useCallback, useEffect, useRef, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useT, usePick } from '@/i18n';
import type { GalleryImage } from '@/types/api';

interface Props {
    images: GalleryImage[];
    index: number | null;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onNavigate }: Props) {
    const t = useT();
    const pick = usePick();
    const open = index !== null;
    const image = index !== null ? images[index] : null;
    const touchStart = useRef<number | null>(null);
    const [loaded, setLoaded] = useState(false);

    const prev = useCallback(() => {
        if (index === null) return;
        onNavigate((index - 1 + images.length) % images.length);
    }, [index, images.length, onNavigate]);

    const next = useCallback(() => {
        if (index === null) return;
        onNavigate((index + 1) % images.length);
    }, [index, images.length, onNavigate]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, prev, next]);

    useEffect(() => {
        setLoaded(false);
    }, [index]);

    const caption = image ? pick(image.caption) : '';

    return (
        <DialogPrimitive.Root open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <DialogPrimitive.Content
                    className="fixed inset-0 z-[80] flex flex-col outline-none"
                    onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
                    onTouchEnd={(e) => {
                        if (touchStart.current === null) return;
                        const delta = e.changedTouches[0].clientX - touchStart.current;
                        if (Math.abs(delta) > 50) (delta > 0 ? prev : next)();
                        touchStart.current = null;
                    }}
                >
                    <DialogPrimitive.Title className="sr-only">{caption || t('gallery.title')}</DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        {index !== null && t('gallery.counter', { index: index + 1, total: images.length })}
                    </DialogPrimitive.Description>

                    <div className="flex items-center justify-between p-4 text-sm text-white/80">
                        <span className="tabular">{index !== null && t('gallery.counter', { index: index + 1, total: images.length })}</span>
                        <DialogPrimitive.Close
                            aria-label={t('gallery.close')}
                            className="inline-flex size-11 items-center justify-center rounded-md text-white hover:bg-white/10"
                        >
                            <X className="size-6" />
                        </DialogPrimitive.Close>
                    </div>

                    <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16">
                        {image && (
                            <img
                                key={image.id}
                                src={image.url}
                                alt={caption}
                                width={image.width ?? undefined}
                                height={image.height ?? undefined}
                                onLoad={() => setLoaded(true)}
                                className="max-h-full max-w-full rounded-md object-contain transition-opacity duration-300"
                                style={{ opacity: loaded ? 1 : 0 }}
                            />
                        )}
                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={prev}
                                    aria-label={t('gallery.prev')}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex size-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                    <ChevronLeft className="size-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={next}
                                    aria-label={t('gallery.next')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex size-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                    <ChevronRight className="size-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {caption && <p className="px-4 pb-6 text-center text-sm text-white/80">{caption}</p>}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
