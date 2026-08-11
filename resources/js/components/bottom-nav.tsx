import { Link } from '@inertiajs/react';
import { MessageSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Chat',
        href: '/chat',
        icon: MessageSquare,
    },
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
];

export function BottomNav() {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-white dark:bg-zinc-900/95 backdrop-blur-sm md:hidden safe-area-bottom">
            <div className="flex h-16 items-center justify-around px-2">
                {mainNavItems.map((item) => {
                    const isActive = isCurrentUrl(item.href) || 
                        (item.href === '/settings/profile' && isCurrentOrParentUrl('/settings'));

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[64px]',
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {item.icon && (
                                <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                            )}
                            <span className={cn(
                                'text-[11px] font-medium leading-none',
                                isActive && 'text-primary font-semibold',
                            )}>
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
