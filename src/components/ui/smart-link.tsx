import { Link } from 'react-router-dom';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface SmartLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    href: string;
    children: ReactNode;
}

const isSpecialOrExternal = (href: string) => /^(https?:|mailto:|tel:|#)/.test(href);

export function SmartLink({ href, children, ...props }: SmartLinkProps) {
    if (isSpecialOrExternal(href)) {
        const external = href.startsWith('http');
        return (
            <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                {...props}
            >
                {children}
            </a>
        );
    }

    return <Link to={href} {...props}>{children}</Link>;
}
