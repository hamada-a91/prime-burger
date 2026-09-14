// src/components/layout/MobileNav.tsx
import { Link } from 'react-router-dom';
import { useNavigation } from '@/hooks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
    const navigation = useNavigation();

    if (!isOpen) return null;

    return (
        <div className="md:hidden border-t border-border/40 bg-background">
            <nav className="container mx-auto px-4 py-4 space-y-4">
                {navigation.items.map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        onClick={onClose}
                        className={cn(
                            'block text-base font-medium transition-colors hover:text-primary',
                            'text-foreground'
                        )}
                    >
                        {item.label}
                    </Link>
                ))}

                {navigation.cta && (
                    <Button asChild variant={navigation.cta.variant} className="w-full mt-4">
                        <Link to={navigation.cta.href} onClick={onClose}>
                            {navigation.cta.text}
                        </Link>
                    </Button>
                )}
            </nav>
        </div>
    );
}
