import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            aria-label="Nach oben scrollen"
            className={cn(
                'fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-all duration-300',
                'bg-background/80 backdrop-blur-sm hover:bg-background',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            )}
        >
            <ArrowUp className="h-5 w-5" />
        </Button>
    );
}
