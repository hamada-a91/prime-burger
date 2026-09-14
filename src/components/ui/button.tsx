import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
                destructive: 'bg-destructive text-white hover:bg-destructive/90',
                outline: 'border border-primary/70 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-surface-elevated',
                ghost: 'text-foreground hover:bg-secondary',
                link: 'text-primary underline-offset-4 hover:underline',
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
