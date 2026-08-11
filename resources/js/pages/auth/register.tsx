import { Head, router, setLayoutProps } from '@inertiajs/react';
import axios from 'axios';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { ArrowLeft, CheckCircle2, LogIn, Mail, RefreshCw, ShieldCheck, UserPlus } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';

type Props = {
    passwordRules: string;
};

type Step = 'details' | 'otp';

export default function Register({ passwordRules }: Props) {
    const [step, setStep] = useState<Step>('details');

    // Step 1 Form fields
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [preferredLanguage, setPreferredLanguage] = useState<string>('en');

    // Step 2 OTP field
    const [otp, setOtp] = useState<string>('');

    // Loading & state management
    const [isSubmittingDetails, setIsSubmittingDetails] = useState<boolean>(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
    const [isResendingOtp, setIsResendingOtp] = useState<boolean>(false);
    const [resendCooldown, setResendCooldown] = useState<number>(0);
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [debugOtp, setDebugOtp] = useState<string | null>(null);

    // Dynamic layout headers based on active step
    const pageConfig = useMemo(() => {
        if (step === 'otp') {
            return {
                title: 'Verify your email',
                description: 'Enter the 6-digit verification code sent to your email.',
            };
        }

        return {
            title: 'Create an account',
            description: 'Enter your details below to create your account.',
        };
    }, [step]);

    setLayoutProps({
        title: pageConfig.title,
        description: pageConfig.description,
    });

    // Countdown timer for OTP resend cooldown
    useEffect(() => {
        if (resendCooldown <= 0) return;

        const timer = setInterval(() => {
            setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Handle Step 1: Submit Details & Request OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmittingDetails(true);

        try {
            const response = await axios.post('/register/send-otp', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                preferred_language: preferredLanguage,
            });

            if (response.data?.success) {
                toast.success('Verification code sent to ' + email);
                setStep('otp');
                setOtp('');
                setResendCooldown(60);
                if (response.data?.debug_otp) {
                    setDebugOtp(response.data.debug_otp);
                }
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (axios.isAxiosError(err) && err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmittingDetails(false);
        }
    };

    // Handle Resending OTP
    const handleResendOtp = async () => {
        if (resendCooldown > 0 || isResendingOtp) return;

        setIsResendingOtp(true);
        setErrors({});

        try {
            const response = await axios.post('/register/resend-otp', { email });
            if (response.data?.success) {
                toast.success('A fresh verification code has been sent to ' + email);
                setResendCooldown(60);
                setOtp('');
                if (response.data?.debug_otp) {
                    setDebugOtp(response.data.debug_otp);
                }
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (axios.isAxiosError(err) && err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Failed to resend verification code.');
            }
        } finally {
            setIsResendingOtp(false);
        }
    };

    // Handle Step 2: Verify OTP & Complete Registration
    const handleVerifyOtp = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (otp.length !== 6 || isVerifyingOtp) return;

        setIsVerifyingOtp(true);
        setErrors({});

        router.post(
            '/register/verify-otp',
            {
                email,
                otp,
            },
            {
                onSuccess: () => {
                    sessionStorage.setItem('just_logged_in', 'true');
                    toast.success('Account successfully registered! Welcome.');
                },
                onError: (errs) => {
                    setErrors(errs);
                    setIsVerifyingOtp(false);
                },
                onFinish: () => {
                    setIsVerifyingOtp(false);
                },
            }
        );
    };

    return (
        <>
            <Head title={step === 'otp' ? 'Verify Email' : 'Register'} />

            {step === 'details' ? (
                /* STEP 1: Registration Details Form */
                <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                    <div className="grid gap-5">
                        {/* Name Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full name"
                                className="h-11"
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Email Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                className="h-11"
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Password Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <PasswordInput
                                id="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                className="h-11"
                                passwordrules={passwordRules}
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Password Confirmation Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                Confirm password
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                placeholder="Confirm your password"
                                className="h-11"
                                passwordrules={passwordRules}
                            />
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        {/* Preferred Language Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="preferred_language" className="text-sm font-medium">
                                Preferred Language
                            </Label>
                            <select
                                id="preferred_language"
                                required
                                value={preferredLanguage}
                                onChange={(e) => setPreferredLanguage(e.target.value)}
                                tabIndex={5}
                                className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900 text-foreground"
                            >
                                <option value="en" className="dark:bg-zinc-900">English</option>
                                <option value="id" className="dark:bg-zinc-900">Indonesian (Bahasa Indonesia)</option>
                                <option value="th" className="dark:bg-zinc-900">Thai (ไทย)</option>
                                <option value="ja" className="dark:bg-zinc-900">Japanese (日本語)</option>
                                <option value="zh" className="dark:bg-zinc-900">Chinese (中文)</option>
                                <option value="fr" className="dark:bg-zinc-900">French (Français)</option>
                                <option value="es" className="dark:bg-zinc-900">Spanish (Español)</option>
                            </select>
                            <InputError message={errors.preferred_language} className="mt-1" />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="mt-2 w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                            tabIndex={6}
                            disabled={isSubmittingDetails}
                            data-test="register-user-button"
                        >
                            {isSubmittingDetails ? (
                                <Spinner className="mr-2 size-4" />
                            ) : (
                                <UserPlus className="mr-2 size-4" />
                            )}
                            Continue to verification
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <TextLink
                            href={login()}
                            tabIndex={7}
                            className="font-semibold text-primary hover:text-[#c2410c]"
                        >
                            Log in
                        </TextLink>
                    </div>
                </form>
            ) : (
                /* STEP 2: OTP Email Verification Screen */
                <div className="space-y-6">
                    {/* Visual Badge / Icon */}
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-xs">
                            <Mail className="size-8 text-primary animate-pulse" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                We sent a 6-digit verification code to
                            </p>
                            <p className="text-sm font-semibold text-foreground bg-primary/10 px-3 py-1 rounded-full border border-primary/20 inline-block">
                                {email}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                        {/* 6-Digit OTP Box */}
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(value) => {
                                    setOtp(value);
                                    if (errors.otp) {
                                        setErrors((prev) => ({ ...prev, otp: undefined }));
                                    }
                                }}
                                disabled={isVerifyingOtp}
                                pattern={REGEXP_ONLY_DIGITS}
                                autoFocus
                            >
                                <InputOTPGroup className="gap-1.5 sm:gap-2">
                                    <InputOTPSlot index={0} className="size-11 sm:size-12 rounded-lg text-lg font-bold border border-input focus:border-primary" />
                                    <InputOTPSlot index={1} className="size-11 sm:size-12 rounded-lg text-lg font-bold border border-input focus:border-primary" />
                                    <InputOTPSlot index={2} className="size-11 sm:size-12 rounded-lg text-lg font-bold border border-input focus:border-primary" />
                                    <InputOTPSlot index={3} className="size-11 sm:size-12 rounded-lg text-lg font-bold border border-input focus:border-primary" />
                                    <InputOTPSlot index={4} className="size-11 sm:size-12 rounded-lg text-lg font-bold border border-input focus:border-primary" />
                                    <InputOTPSlot index={5} className="size-11 sm:size-12 rounded-lg text-lg font-bold border border-input focus:border-primary" />
                                </InputOTPGroup>
                            </InputOTP>

                            {debugOtp && (
                                <button
                                    type="button"
                                    onClick={() => setOtp(debugOtp)}
                                    className="text-xs text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg px-2.5 py-1 transition-all cursor-pointer"
                                >
                                    🔧 Local Test Code: <span className="font-mono font-bold text-primary">{debugOtp}</span> (Click to auto-fill)
                                </button>
                            )}

                            <InputError message={errors.otp} className="text-center font-medium" />
                        </div>

                        {/* Submit OTP Button */}
                        <Button
                            type="submit"
                            className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                            disabled={otp.length !== 6 || isVerifyingOtp}
                        >
                            {isVerifyingOtp ? (
                                <Spinner className="mr-2 size-4" />
                            ) : (
                                <CheckCircle2 className="mr-2 size-4" />
                            )}
                            Verify & Complete Registration
                        </Button>

                        {/* Resend OTP Section */}
                        <div className="text-center text-sm text-muted-foreground flex flex-col items-center gap-2 pt-2 border-t border-border/40">
                            {resendCooldown > 0 ? (
                                <span className="text-xs text-muted-foreground">
                                    Resend code available in{' '}
                                    <span className="font-semibold text-foreground">
                                        {resendCooldown}s
                                    </span>
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={isResendingOtp}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-[#c2410c] transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {isResendingOtp ? (
                                        <Spinner className="size-3" />
                                    ) : (
                                        <RefreshCw className="size-3" />
                                    )}
                                    Resend verification code
                                </button>
                            )}

                            {/* Back to Step 1 */}
                            <button
                                type="button"
                                onClick={() => {
                                    setStep('details');
                                    setErrors({});
                                    setOtp('');
                                }}
                                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mt-1"
                            >
                                <ArrowLeft className="size-3" />
                                Wrong email? Edit registration details
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
