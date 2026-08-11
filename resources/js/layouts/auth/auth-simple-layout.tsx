import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-zinc-50 p-4 dark:bg-zinc-950 md:p-10">
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Large glow orbs */}
                <div className="absolute -top-48 -right-48 size-96 animate-auth-float rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-48 -left-48 size-96 animate-auth-float-delayed rounded-full bg-primary/5 blur-3xl" />
                {/* Subtle center glow */}
                <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-3xl" />
                {/* Floating abstract shapes */}
                <div className="absolute left-1/4 top-1/4 size-32 animate-auth-float rounded-full border border-border/50 bg-white/40 blur-sm dark:bg-white/5" />
                <div className="absolute bottom-1/3 right-1/4 size-24 animate-auth-float-delayed rounded-full border border-border/50 bg-white/30 blur-sm dark:bg-white/5" />
                {/* Subtle noise overlay */}
                <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%%\' height=\'100%%\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundSize: '256px 256px' }} />
            </div>

            <div className="relative w-full max-w-md animate-auth-fade-in">
                <div className="flex flex-col gap-8">
                    {/* Logo area */}
                    <div className="flex flex-col items-center gap-5">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-white/20 transition-all duration-300 hover:scale-105 hover:bg-[#c2410c] hover:shadow-xl hover:shadow-primary/30">
                                <AppLogoIcon className="size-8 fill-none stroke-white" />
                            </div>
                        </Link>
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                {title || 'LinguaChat'}
                            </h1>
                            {description && (
                                <p className="text-[15px] leading-relaxed text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Login card */}
                    <div className="rounded-2xl border border-border/50 bg-white/95 p-8 shadow-xl shadow-zinc-200/60 backdrop-blur-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-zinc-200/70 dark:border-zinc-800 dark:bg-zinc-900/95 dark:shadow-zinc-900/60 dark:hover:shadow-zinc-900/70">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
