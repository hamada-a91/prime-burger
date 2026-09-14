export const LOCALES = ['de', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'de';

export type RouteKey = 'home' | 'about' | 'menu' | 'gallery' | 'reservation' | 'privacy' | 'imprint';

/** URL slug per language. Keys are stable, slugs are what the visitor sees. */
export const ROUTE_SLUGS: Record<RouteKey, Record<Locale, string>> = {
    home: { de: '', en: '' },
    about: { de: 'ueber-uns', en: 'about' },
    menu: { de: 'speisekarte', en: 'menu' },
    gallery: { de: 'galerie', en: 'gallery' },
    reservation: { de: 'reservieren', en: 'reservation' },
    privacy: { de: 'datenschutz', en: 'privacy' },
    imprint: { de: 'impressum', en: 'imprint' },
};

export function isLocale(value: string | undefined): value is Locale {
    return !!value && (LOCALES as readonly string[]).includes(value);
}

export function localePath(locale: Locale, key: RouteKey, hash?: string): string {
    const slug = ROUTE_SLUGS[key][locale];
    return `/${locale}${slug ? `/${slug}` : ''}${hash ? `#${hash}` : ''}`;
}

/** Finds the route key for a slug in a given locale (undefined for unknown pages). */
export function routeKeyFromSlug(locale: Locale, slug: string | undefined): RouteKey | undefined {
    const wanted = slug ?? '';
    return (Object.keys(ROUTE_SLUGS) as RouteKey[]).find((key) => ROUTE_SLUGS[key][locale] === wanted);
}

export function detectLocale(): Locale {
    try {
        const stored = localStorage.getItem('locale');
        if (isLocale(stored ?? undefined)) return stored as Locale;
    } catch {
        // storage unavailable
    }
    const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'de';
    return nav.startsWith('en') ? 'en' : DEFAULT_LOCALE;
}

export function rememberLocale(locale: Locale): void {
    try {
        localStorage.setItem('locale', locale);
    } catch {
        // storage unavailable
    }
}
