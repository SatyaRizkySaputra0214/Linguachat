import { Link } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Props = ComponentProps<typeof Link>;

export default function TextLink({
    className = '',
    children,
    ...props
}: Props) {
    return (
        <Link
            className={cn(
                'text-foreground underline decoration-neutral-300/60 underline-offset-4 transition-all duration-200 ease-out hover:decoration-current dark:decoration-neutral-500/60',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
