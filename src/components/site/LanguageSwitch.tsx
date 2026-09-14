import { useLocation, useNavigate } from 'react-router-dom';
import { LOCALES, localePath, rememberLocale, routeKeyFromSlug, useLocale, useT, type Locale } from '@/i18n';
import { cn } from '@/lib/utils';

/** DE | EN toggle that keeps the visitor on the same page. */
export function LanguageSwitch({ className, size = 'sm' }: { className?: string; size?: 'sm' | 'lg' }) {
    const locale = useLocale();
    const t = useT();
    const navigate = useNavigate();
    const location = useLocation();

    const switchTo = (next: Locale) => {
        if (next === locale) return;
        const slug = location.pathname.split('/').filter(Boolean)[1];
        const key = routeKeyFromSlug(locale, slug) ?? 'home';
        rememberLocale(next);
        navigate(localePath(next, key) + location.hash);
    };

    return (
        <div className={cn('inline-flex items-center rounded-md border border-border p-0.5', className)} role="group" aria-label={t('common.language')}>
            {LOCALES.map((code) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => switchTo(code)}
                    aria-pressed={code === locale}
                    lang={code}
                    className={cn(
                        'rounded-[4px] font-bold uppercase tracking-wide transition-colors',
                        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm',
                        code === locale ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    {code}
                </button>
            ))}
        </div>
    );
}
