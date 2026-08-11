import { Moon, Sun } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps extends ComponentProps<typeof Button> {
    showTooltip?: boolean;
}

export function ThemeToggle({
    className,
    variant = 'ghost',
    size = 'icon',
    showTooltip = true,
    ...props
}: ThemeToggleProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const toggleTheme = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    const button = (
        <Button
            type="button"
            variant={variant}
            size={size}
            onClick={toggleTheme}
            className={cn(
                'size-9 rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white',
                className,
            )}
            aria-label={label}
            {...props}
        >
            {isDark ? (
                <Sun className="size-5 transition-transform duration-300 hover:rotate-45 text-amber-400 dark:text-amber-300" />
            ) : (
                <Moon className="size-5 transition-transform duration-300 hover:-rotate-12 text-neutral-600 group-hover:text-neutral-900" />
            )}
            <span className="sr-only">{label}</span>
        </Button>
    );

    if (!showTooltip) {
        return button;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="bottom">
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );
}

export default ThemeToggle;
