import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import ui from '@/lang/en';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            <div className="relative hidden h-full flex-col bg-primary p-10 text-primary-foreground lg:flex dark:border-r dark:bg-primary/95">
                <Link
                    href={home()}
                    className="relative z-20 flex items-center text-lg font-medium"
                >
                    <AppLogoIcon className="mr-2 size-8 fill-none stroke-white" />
                    {name}
                </Link>
                <div className="relative z-20 mt-auto mb-auto">
                    <h2 className="text-3xl font-bold leading-tight">LinguaChat</h2>
                    <p className="mt-2 text-white/70 text-sm max-w-sm">
                        {ui.auth.split_tagline}
                    </p>
                </div>
            </div>
            <div className="flex w-full items-center justify-center lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <AppLogoIcon className="h-10 text-primary" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                        {description && (
                            <p className="text-sm text-balance text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-white p-8 shadow-lg dark:bg-zinc-900 dark:border-zinc-800">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
