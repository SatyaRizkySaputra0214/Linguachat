import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
import { send } from '@/routes/verification';

type PageProps = {
    auth: Auth;
};

import ui from '@/lang/en';

export default function Profile(
    {
        mustVerifyEmail,
        status,
    }: {
        mustVerifyEmail: boolean;
        status?: string;
    },
) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name and email address"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="friend_id">{ui.profile.user_id_label}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="friend_id"
                                        className="mt-1 block w-full bg-muted/50 border-sidebar-border"
                                        value={auth.user.friend_id || ''}
                                        readOnly
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-1"
                                        onClick={() => {
                                            if (auth.user.friend_id) {
                                                navigator.clipboard.writeText(auth.user.friend_id);
                                                toast.success(ui.profile.id_copied);
                                            }
                                        }}
                                    >
                                        {ui.profile.copy_button}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">{ui.profile.share_id_hint}</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="preferred_language">Preferred Language</Label>
                                <select
                                    id="preferred_language"
                                    name="preferred_language"
                                    required
                                    defaultValue={auth.user.preferred_language as string}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900 text-foreground"
                                >
                                    <option value="en" className="dark:bg-zinc-900">English</option>
                                    <option value="id" className="dark:bg-zinc-900">Indonesian (Bahasa Indonesia)</option>
                                    <option value="th" className="dark:bg-zinc-900">Thai (ไทย)</option>
                                    <option value="ja" className="dark:bg-zinc-900">Japanese (日本語)</option>
                                    <option value="zh" className="dark:bg-zinc-900">Chinese (中文)</option>
                                    <option value="fr" className="dark:bg-zinc-900">French (Français)</option>
                                    <option value="es" className="dark:bg-zinc-900">Spanish (Español)</option>
                                </select>
                                <InputError
                                    className="mt-2"
                                    message={errors.preferred_language}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to re-send the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has been
                                                sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
