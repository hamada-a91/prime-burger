import { Link, NavLink, type LinkProps, type NavLinkProps } from 'react-router-dom';
import { localePath, useLocale, type RouteKey } from '@/i18n';

type Props = Omit<LinkProps, 'to'> & { to: RouteKey; hash?: string };

/** Link to a route key in the current language. */
export function LocaleLink({ to, hash, ...props }: Props) {
    const locale = useLocale();
    return <Link to={localePath(locale, to, hash)} {...props} />;
}

type NavProps = Omit<NavLinkProps, 'to'> & { to: RouteKey };

export function LocaleNavLink({ to, ...props }: NavProps) {
    const locale = useLocale();
    return <NavLink to={localePath(locale, to)} end={to === 'home'} {...props} />;
}
