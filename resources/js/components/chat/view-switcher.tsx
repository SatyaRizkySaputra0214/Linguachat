import { cn } from '@/lib/utils';

export type ChatView = 'conversations' | 'friends';

interface ViewSwitcherProps {
    activeView: ChatView;
    onViewChange: (view: ChatView) => void;
    conversationsLabel: string;
    friendsLabel: string;
}

export default function ViewSwitcher({
    activeView,
    onViewChange,
    conversationsLabel,
    friendsLabel,
}: ViewSwitcherProps) {
    return (
        <div className="flex items-center gap-1 rounded-xl bg-muted/50 p-1 border border-border/40">
            <button
                type="button"
                onClick={() => onViewChange('conversations')}
                className={cn(
                    'flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150',
                    activeView === 'conversations'
                        ? 'bg-white dark:bg-zinc-800 text-primary shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                )}
            >
                {conversationsLabel}
            </button>
            <button
                type="button"
                onClick={() => onViewChange('friends')}
                className={cn(
                    'flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150',
                    activeView === 'friends'
                        ? 'bg-white dark:bg-zinc-800 text-primary shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                )}
            >
                {friendsLabel}
            </button>
        </div>
    );
}
