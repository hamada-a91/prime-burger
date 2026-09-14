import { useSettings } from '@/hooks/api';
import { useConfig } from '@/hooks/useConfig';
import { telHref } from '@/lib/opening-hours';
import type { SettingsMap } from '@/types/api';

/** Contact data from the API with static config as fallback, so the layout never renders empty. */
export function useSiteInfo() {
    const { site } = useConfig();
    const { data } = useSettings();
    const settings: SettingsMap = data ?? {};

    const phone = settings.contact_phone || site.contact.phone;
    const email = settings.contact_email || site.contact.email;
    const address = {
        street: settings.contact_address?.street || site.contact.street,
        zip: settings.contact_address?.zip || site.contact.zip,
        city: settings.contact_address?.city || site.contact.city,
    };

    return {
        settings,
        name: settings.site_name || site.name,
        phone,
        phoneHref: telHref(phone),
        email,
        address,
        addressLine: `${address.street}, ${address.zip} ${address.city}`,
        mapsUrl: settings.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address.street} ${address.zip} ${address.city}`)}`,
        hours: settings.opening_hours,
        delivery: settings.delivery_platforms ?? [],
        social: settings.social_links ?? {},
    };
}
