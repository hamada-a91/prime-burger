import { Phone } from 'lucide-react';
import { useSiteInfo } from '@/hooks';
import { useT } from '@/i18n';
import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/components/site/LocaleLink';

/** Sticky call + reserve bar on small screens. */
export function MobileBar() {
    const t = useT();
    const { phoneHref } = useSiteInfo();

    return (
        <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
            <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" size="lg">
                    <a href={phoneHref}>
                        <Phone aria-hidden /> {t('common.call')}
                    </a>
                </Button>
                <Button asChild size="lg">
                    <LocaleLink to="reservation">{t('nav.reservation')}</LocaleLink>
                </Button>
            </div>
        </div>
    );
}
