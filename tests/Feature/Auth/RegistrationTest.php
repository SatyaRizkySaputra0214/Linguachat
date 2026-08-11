<?php

namespace Tests\Feature\Auth;

use App\Mail\RegistrationOtpMail;
use App\Models\PendingRegistration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_otp_email_is_sent_when_registration_form_is_submitted(): void
    {
        Mail::fake();

        $response = $this->post(route('register.send-otp'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'preferred_language' => 'en',
        ]);

        $response->assertSessionHasNoErrors();

        // Ensure user is NOT created in users table yet
        $this->assertDatabaseMissing('users', [
            'email' => 'test@example.com',
        ]);

        // Ensure pending registration is created
        $this->assertDatabaseHas('pending_registrations', [
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);

        // Ensure OTP mail was sent
        Mail::assertSent(RegistrationOtpMail::class, function ($mail) {
            return $mail->hasTo('test@example.com');
        });
    }

    public function test_user_cannot_register_with_invalid_otp(): void
    {
        PendingRegistration::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'preferred_language' => 'en',
            'otp' => Hash::make('123456'),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->post(route('register.verify-otp'), [
            'email' => 'test@example.com',
            'otp' => '999999', // Incorrect OTP
        ]);

        $response->assertSessionHasErrors(['otp']);
        $this->assertGuest();

        // User MUST NOT be created
        $this->assertDatabaseMissing('users', [
            'email' => 'test@example.com',
        ]);
    }

    public function test_user_cannot_register_with_expired_otp(): void
    {
        PendingRegistration::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'preferred_language' => 'en',
            'otp' => Hash::make('123456'),
            'attempts' => 0,
            'expires_at' => now()->subMinutes(1), // Expired
        ]);

        $response = $this->post(route('register.verify-otp'), [
            'email' => 'test@example.com',
            'otp' => '123456',
        ]);

        $response->assertSessionHasErrors(['otp']);
        $this->assertGuest();

        // User MUST NOT be created
        $this->assertDatabaseMissing('users', [
            'email' => 'test@example.com',
        ]);
    }

    public function test_user_can_complete_registration_with_valid_otp(): void
    {
        PendingRegistration::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'preferred_language' => 'en',
            'otp' => Hash::make('123456'),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->post(route('register.verify-otp'), [
            'email' => 'test@example.com',
            'otp' => '123456',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertAuthenticated();

        // User must be created in users table with friend_id and verified email
        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'preferred_language' => 'en',
        ]);

        $user = User::where('email', 'test@example.com')->first();
        $this->assertNotNull($user);
        $this->assertNotNull($user->email_verified_at);
        $this->assertNotNull($user->friend_id);
        $this->assertStringStartsWith('LC-', $user->friend_id);

        // Pending record must be cleaned up
        $this->assertDatabaseMissing('pending_registrations', [
            'email' => 'test@example.com',
        ]);

        $response->assertRedirect(route('chat.index', absolute: false));
    }

    public function test_user_can_resend_otp(): void
    {
        Mail::fake();

        PendingRegistration::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'preferred_language' => 'en',
            'otp' => Hash::make('111111'),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->post(route('register.resend-otp'), [
            'email' => 'test@example.com',
        ]);

        $response->assertSessionHasNoErrors();

        Mail::assertSent(RegistrationOtpMail::class, function ($mail) {
            return $mail->hasTo('test@example.com');
        });
    }
}
