import * as React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = React.ComponentProps<'main'> & {
    variant?: AppVariant;
};

export function AppContent({ variant = 'sidebar', children, ...props }: Props) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return (
        <main
            className="mx-auto flex w-full max-w-7xl flex-1 min-h-0 flex-col gap-4 rounded-xl pb-16 md:pb-0 overflow-y-auto md:overflow-y-visible"
            {...props}
        >
            {children}
        </main>
    );
}
