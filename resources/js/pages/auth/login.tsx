import { Form, Head } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                onSuccess={() => sessionStorage.setItem('just_logged_in', 'true')}
                className="flex flex-col gap-7"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Email field */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="h-11 px-4"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password field */}
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm font-medium text-primary hover:text-[#c2410c] transition-all duration-200 hover:underline"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className="h-11 px-4"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer select-none">
                                    Remember me
                                </Label>
                            </div>

                            {/* Submit button */}
                            <Button
                                type="submit"
                                className="mt-1 w-full h-12 rounded-xl font-semibold text-[15px] tracking-wide shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <Spinner className="mr-2 size-4" />
                                ) : (
                                    <LogIn className="mr-2 size-4" />
                                )}
                                Log in
                            </Button>
                        </div>

                        {/* Sign up link */}
                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={5} className="font-semibold text-primary hover:text-[#c2410c] transition-all duration-200 hover:underline">
                                Sign up
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-5 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Welcome back',
    description: 'Enter your email and password to log in to your account.',
};
