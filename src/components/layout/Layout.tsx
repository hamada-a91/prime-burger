// src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieConsentBanner } from '@/components/legal';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { generateCSSVariables } from '@/config/tokens.config';

interface LayoutProps {
    children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <style>{generateCSSVariables()}</style>
            <Header />
            <main className="flex-1">
                {children ?? <Outlet />}
            </main>
            <Footer />
            <CookieConsentBanner />
            <ScrollToTop />
        </div>
    );
}

