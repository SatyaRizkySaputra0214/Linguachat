<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMailCommand extends Command
{
    protected $signature = 'mail:test {email=rizkysatya276@gmail.com}';
    protected $description = 'Test email configuration';

    public function handle(): int
    {
        $email = $this->argument('email');
        $this->info("Sending test email to {$email} using " . config('mail.default') . '...');
        $this->info("Host: " . config('mail.mailers.smtp.host'));
        $this->info("Port: " . config('mail.mailers.smtp.port'));
        $this->info("Username: " . config('mail.mailers.smtp.username'));

        try {
            Mail::raw('This is a test email from LinguaChat.', function ($message) use ($email) {
                $message->to($email)->subject('LinguaChat Test Email');
            });
            $this->info('SUCCESS: Email sent successfully!');
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('FAILED: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
