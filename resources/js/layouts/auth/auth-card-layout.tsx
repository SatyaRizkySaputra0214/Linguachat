import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeToggle } from '@/components/theme-toggle';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950 md:p-10">
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 size-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-primary/5 blur-3xl" />
            </div>
            <div className="relative flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
                        <AppLogoIcon className="size-6 fill-none stroke-white" />
                    </div>
                </Link>
                <div className="flex flex-col gap-6">
                    <Card className="rounded-2xl border-border/60 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50">
                        <CardHeader className="px-8 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl font-bold">{title}</CardTitle>
                            {description && (
                                <CardDescription>{description}</CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="px-8 py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
