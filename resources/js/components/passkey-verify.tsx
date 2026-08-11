import type { UrlMethodPair } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { usePasskeyVerify } from '@laravel/passkeys/react';
import { KeyRound } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    routes?: {
        options: UrlMethodPair;
        submit: UrlMethodPair;
    };
    label?: string;
    loadingLabel?: string;
    separator?: string;
};

export default function PasskeyVerify({
    routes,
    label,
    loadingLabel,
    separator,
}: Props = {}) {
    const { verify, isLoading, error, isSupported } = usePasskeyVerify({
        ...(routes && {
            routes: {
                options: routes.options.url,
                submit: routes.submit.url,
            },
        }),
        onSuccess: (response) => {
            sessionStorage.setItem('just_logged_in', 'true');
            router.visit(response.redirect ?? '/dashboard');
        },
    });

    if (!isSupported) {
        return null;
    }

    return (
        <>
            <div className="grid gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 rounded-xl border-border/70 text-[15px] font-medium transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm active:scale-[0.98]"
                    onClick={verify}
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner className="size-4" /> : <KeyRound className="size-4" />}
                    {isLoading
                        ? (loadingLabel ?? 'Authenticating...')
                        : (label ?? 'Sign in with a passkey')}
                </Button>
                {error && (
                    <InputError message={error} className="text-center" />
                )}
            </div>

            {/* Premium divider */}
            <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80 dark:bg-zinc-900">
                        {separator ?? 'Or continue with email'}
                    </span>
                </div>
            </div>
        </>
    );
}
