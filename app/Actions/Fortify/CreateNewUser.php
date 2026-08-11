<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'preferred_language' => ['required', 'string', 'max:10'],
            'country_code' => ['nullable', 'string', 'max:10'],
        ])->validate();

        do {
            $friendId = 'LC-'.str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
        } while (User::where('friend_id', $friendId)->exists());

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'preferred_language' => $input['preferred_language'],
            'country_code' => $input['country_code'] ?? null,
            'is_active' => true,
            'friend_id' => $friendId,
        ]);
    }
}
