// src/components/layout/Header.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useNavigation, useSiteConfig } from '@/hooks';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileNav } from './MobileNav';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigation = useNavigation();
    const site = useSiteConfig();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <img
                        src={site.logo.light}
                        alt={site.name}
                        className="h-8 w-auto dark:hidden"
                    />
                    <img
                        src={site.logo.dark}
                        alt={site.name}
                        className="hidden h-8 w-auto dark:block"
                    />
                    <span className="font-bold text-xl">{site.name}</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navigation.items.map((item) => (
                        <Link
                            key={item.href}
                            to={item.external ? item.href : item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={item.external ? 'noopener noreferrer' : undefined}
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-primary',
                                'text-muted-foreground'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {navigation.cta && (
                        <Button asChild variant={navigation.cta.variant}>
                            <Link to={navigation.cta.href}>{navigation.cta.text}</Link>
                        </Button>
                    )}

                    <ThemeToggle />
                </nav>

                {/* Mobile Menu Button + Theme Toggle */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <button
                        className="p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </header>
    );
}

