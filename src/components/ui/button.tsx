import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-bold transition-all duration-200 will-change-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default: 'button-shimmer bg-primary text-primary-foreground hover:bg-primary-hover shadow-md shadow-primary/20 hover:shadow-primary/35',
                destructive: 'bg-destructive text-white hover:bg-destructive/90 shadow-md shadow-destructive/20',
                outline: 'border border-primary/70 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:shadow-primary/15',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-surface-elevated hover:border-border',
                ghost: 'text-foreground hover:bg-secondary hover:-translate-y-0',
                link: 'text-primary underline-offset-4 hover:underline hover:-translate-y-0',
            },
            size: {
                default: 'h-11 px-5 text-sm',
                sm: 'h-9 rounded-md gap-1.5 px-3 text-sm',
                lg: 'h-12 rounded-md px-7 text-sm uppercase tracking-[0.08em]',
                xl: 'h-14 rounded-md px-8 text-base uppercase tracking-[0.08em]',
                icon: 'size-11',
                'icon-sm': 'size-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : 'button';

    return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
