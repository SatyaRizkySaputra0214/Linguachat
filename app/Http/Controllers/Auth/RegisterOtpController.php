<?php

namespace App\Http\Controllers\Auth;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Http\Controllers\Controller;
use App\Mail\RegistrationOtpMail;
use App\Models\PendingRegistration;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisterOtpController extends Controller
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register', [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]);
    }

    /**
     * Validate registration details, store pending registration, and send OTP email.
     */
    public function sendOtp(Request $request): JsonResponse|RedirectResponse
    {
        $validated = Validator::make($request->all(), [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'preferred_language' => ['required', 'string', 'max:10'],
            'country_code' => ['nullable', 'string', 'max:10'],
        ])->validate();

        // Throttle OTP generation per email + IP
        $throttleKey = 'send-otp:'.strtolower($validated['email']).'|'.$request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => ["Terlalu banyak permintaan kode OTP. Silakan tunggu {$seconds} detik."],
            ]);
        }
        RateLimiter::hit($throttleKey, 300);

        // Generate 6-digit OTP
        $otp = (string) random_int(100000, 999999);

        // Save or update pending registration
        PendingRegistration::updateOrCreate(
            ['email' => $validated['email']],
            [
                'name' => $validated['name'],
                'password' => Hash::make($validated['password']),
                'preferred_language' => $validated['preferred_language'] ?? 'en',
                'country_code' => $validated['country_code'] ?? null,
                'otp' => Hash::make($otp),
                'attempts' => 0,
                'expires_at' => now()->addMinutes(10),
            ]
        );

        // Send OTP email
        try {
            Mail::to($validated['email'])->send(new RegistrationOtpMail($otp, $validated['name']));
        } catch (\Throwable $e) {
            report($e);
            $errorMessage = config('app.debug')
                ? 'Gagal mengirim kode OTP: '.$e->getMessage()
                : 'Gagal mengirimkan kode OTP ke email. Silakan periksa kembali alamat email atau konfigurasi mail server Anda.';

            throw ValidationException::withMessages([
                'email' => [$errorMessage],
            ]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Kode OTP verifikasi telah dikirim ke email Anda.',
                'email' => $validated['email'],
            ]);
        }

        return back()->with('status', 'Kode OTP verifikasi telah dikirim ke email Anda.');
    }

    /**
     * Resend a fresh OTP to the pending registrant's email.
     */
    public function resendOtp(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $throttleKey = 'resend-otp:'.strtolower($validated['email']).'|'.$request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'otp' => ["Harap tunggu {$seconds} detik sebelum meminta kode OTP baru."],
            ]);
        }
        RateLimiter::hit($throttleKey, 60);

        $pending = PendingRegistration::where('email', $validated['email'])->first();

        if (! $pending) {
            throw ValidationException::withMessages([
                'email' => ['Sesi registrasi tidak ditemukan. Silakan isi form pendaftaran kembali.'],
            ]);
        }

        // Generate new 6-digit OTP
        $otp = (string) random_int(100000, 999999);

        $pending->update([
            'otp' => Hash::make($otp),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(10),
        ]);

        // Send OTP email
        try {
            Mail::to($pending->email)->send(new RegistrationOtpMail($otp, $pending->name));
        } catch (\Throwable $e) {
            report($e);
            $errorMessage = config('app.debug')
                ? 'Gagal mengirim kode OTP: '.$e->getMessage()
                : 'Gagal mengirimkan kode OTP ke email. Silakan periksa kembali konfigurasi mail server Anda.';

            throw ValidationException::withMessages([
                'otp' => [$errorMessage],
            ]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Kode OTP baru berhasil dikirim ke email Anda.',
            ]);
        }

        return back()->with('status', 'Kode OTP baru berhasil dikirim ke email Anda.');
    }

    /**
     * Verify the entered OTP and create the user account upon success.
     */
    public function verifyOtp(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $pending = PendingRegistration::where('email', $validated['email'])->first();

        if (! $pending) {
            throw ValidationException::withMessages([
                'otp' => ['Sesi pendaftaran tidak ditemukan atau sudah kedaluwarsa. Silakan lakukan pendaftaran ulang.'],
            ]);
        }

        if ($pending->isExpired()) {
            throw ValidationException::withMessages([
                'otp' => ['Kode OTP telah kedaluwarsa. Silakan minta kode OTP baru.'],
            ]);
        }

        if ($pending->hasExceededMaxAttempts()) {
            throw ValidationException::withMessages([
                'otp' => ['Terlalu banyak percobaan yang salah. Silakan minta kode OTP baru.'],
            ]);
        }

        if (! Hash::check($validated['otp'], $pending->otp)) {
            $pending->increment('attempts');
            $remaining = max(0, 5 - $pending->attempts);

            throw ValidationException::withMessages([
                'otp' => ["Kode OTP yang Anda masukkan salah. Sisa percobaan: {$remaining} kali."],
            ]);
        }

        // Generate unique friend ID
        do {
            $friendId = 'LC-'.str_pad((string) mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
        } while (User::where('friend_id', $friendId)->exists());

        // Create the user account (ONLY created upon valid OTP)
        $user = User::create([
            'name' => $pending->name,
            'email' => $pending->email,
            'password' => $pending->password, // already hashed
            'preferred_language' => $pending->preferred_language,
            'country_code' => $pending->country_code,
            'is_active' => true,
            'friend_id' => $friendId,
            'email_verified_at' => now(),
        ]);

        // Clean up pending registration
        $pending->delete();

        // Fire Registered event
        event(new Registered($user));

        // Log the user in
        Auth::login($user);
        $request->session()->regenerate();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'redirect' => route('chat.index', absolute: false),
            ]);
        }

        return redirect()->intended(route('chat.index', absolute: false));
    }
}
