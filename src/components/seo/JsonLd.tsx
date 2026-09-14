import { Helmet } from 'react-helmet-async';
import { useSiteConfig, useSiteInfo } from '@/hooks';
import { localePath, useLocale } from '@/i18n';
import { DAY_KEYS } from '@/lib/opening-hours';

const DAY_NAMES: Record<string, string> = {
    mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

/** schema.org Restaurant markup, built from live settings. */
export function RestaurantJsonLd() {
    const site = useSiteConfig();
    const info = useSiteInfo();
    const locale = useLocale();
    const base = site.url.replace(/\/+$/, '');

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: info.name,
        url: `${base}${localePath(locale, 'home')}`,
        image: `${base}${site.ogImage}`,
        logo: `${base}${site.logo}`,
        telephone: info.phone,
        email: info.email,
        servesCuisine: ['Burger', 'American', 'Mexican'],
        priceRange: '€€',
        acceptsReservations: 'True',
        hasMenu: `${base}${localePath(locale, 'menu')}`,
        address: {
            '@type': 'PostalAddress',
            streetAddress: info.address.street,
            postalCode: info.address.zip,
            addressLocality: info.address.city,
            addressCountry: 'DE',
        },
        openingHoursSpecification: info.hours
            ? DAY_KEYS.filter((key) => info.hours?.[key] && !info.hours[key].closed).map((key) => ({
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: DAY_NAMES[key],
                opens: info.hours?.[key].open,
                closes: info.hours?.[key].close,
            }))
            : undefined,
        sameAs: Object.values(info.social).filter(Boolean),
    };

    return (
        <Helmet>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
    );
}
