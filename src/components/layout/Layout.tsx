import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { LocaleContext, isLocale, rememberLocale, routeKeyFromSlug, useT } from '@/i18n';
import { api } from '@/lib/api';
import { RestaurantJsonLd } from '@/components/seo';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBar } from './MobileBar';

function ScrollRestoration() {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            const el = document.getElementById(hash.slice(1));
            if (el) {
                el.scrollIntoView({ block: 'start' });
                return;
            }
        }
        window.scrollTo({ top: 0 });
    }, [pathname, hash]);
    return null;
}

function Shell() {
    const t = useT();
    const location = useLocation();
    const { locale } = useParams();
    const slug = location.pathname.split('/').filter(Boolean)[1];
    const routeKey = isLocale(locale) ? routeKeyFromSlug(locale, slug) : undefined;
    const isHome = routeKey === 'home';
    const showMobileBar = routeKey !== 'reservation';

    return (
        <div className="theme-dark min-h-screen flex flex-col bg-background text-foreground">
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
                {t('common.skipToContent')}
            </a>
            <ScrollRestoration />
            <RestaurantJsonLd />
            <Header transparent={isHome} />
            <main id="main" className={showMobileBar ? 'flex-1 pb-20 lg:pb-0' : 'flex-1'}>
                <Outlet />
            </main>
            <Footer />
            {showMobileBar && <MobileBar />}
        </div>
    );
}

/** Validates the :locale segment, provides it to the tree and keeps the API client in sync. */
export function LocaleLayout() {
    const { locale } = useParams();

    useEffect(() => {
        if (isLocale(locale)) {
            api.locale = locale;
            rememberLocale(locale);
            document.documentElement.lang = locale;
        }
    }, [locale]);

    if (!isLocale(locale)) {
        return <Navigate to="/de" replace />;
    }

    return (
        <LocaleContext.Provider value={locale}>
            <Shell />
        </LocaleContext.Provider>
    );
}
