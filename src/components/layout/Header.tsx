import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Phone, X } from 'lucide-react';
import { useSiteConfig, useSiteInfo } from '@/hooks';
import { useT, type RouteKey } from '@/i18n';
import { Button } from '@/components/ui/button';
import { LanguageSwitch } from '@/components/site/LanguageSwitch';
import { LocaleLink, LocaleNavLink } from '@/components/site/LocaleLink';
import { cn } from '@/lib/utils';
import { MobileNav } from './MobileNav';

export const NAV_ITEMS: {
  key: RouteKey;
  label: 'nav.home' | 'nav.about' | 'nav.menu' | 'nav.gallery' | 'nav.reservation';
}[] = [
  { key: 'home', label: 'nav.home' },
  { key: 'about', label: 'nav.about' },
  { key: 'menu', label: 'nav.menu' },
  { key: 'gallery', label: 'nav.gallery' },
  { key: 'reservation', label: 'nav.reservation' },
];

export function Header({ transparent = false }: { transparent?: boolean }) {
  const t = useT();
  const site = useSiteConfig();
  const { phone, phoneHref } = useSiteInfo();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const solid = scrolled || open || !transparent;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
          solid
            ? 'bg-background/90 backdrop-blur-md border-b border-border'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="container-site flex h-[72px] items-center justify-between gap-4">
          <LocaleLink to="home" className="flex items-center gap-3 shrink-0" aria-label={site.name}>
            <img
              src={site.logo}
              alt=""
              width={56}
              height={50}
              className="h-12 w-auto"
              fetchPriority="high"
            />
            <span className="font-display text-2xl leading-none text-foreground hidden sm:inline">
              Prime Burger
            </span>
          </LocaleLink>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Hauptnavigation">
            {NAV_ITEMS.map((item) => (
              <LocaleNavLink
                key={item.key}
                to={item.key}
                className={({ isActive }) =>
                  cn(
                    'relative px-3.5 py-2 text-[15px] font-semibold text-muted-foreground transition-colors hover:text-foreground',
                    'after:absolute after:left-3.5 after:right-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary after:origin-left after:scale-x-0 after:transition-transform after:duration-300',
                    isActive && 'text-foreground after:scale-x-100'
                  )
                }
              >
                {t(item.label)}
              </LocaleNavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={phoneHref}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              <Phone className="size-4 text-primary" aria-hidden />
              {phone}
            </a>
            <LanguageSwitch />
            <Button asChild>
              <LocaleLink to="reservation">{t('common.reserve')}</LocaleLink>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitch />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t('common.closeMenu') : t('common.openMenu')}
              className="inline-flex size-11 items-center justify-center rounded-md border border-border text-foreground hover:bg-secondary transition-colors"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>
      {/* Rendered outside the header: its backdrop-filter would otherwise clip the fixed overlay. */}
      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}
