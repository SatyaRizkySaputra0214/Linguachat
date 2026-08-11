<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. English User
        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'test@example.com',
            'preferred_language' => 'en',
            'country_code' => 'US',
            'password' => bcrypt('password'),
        ]);

        // 2. Indonesian User
        User::factory()->create([
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'preferred_language' => 'id',
            'country_code' => 'ID',
            'password' => bcrypt('password'),
        ]);

        // 3. Thai User
        User::factory()->create([
            'name' => 'Somchai Somboon',
            'email' => 'somchai@example.com',
            'preferred_language' => 'th',
            'country_code' => 'TH',
            'password' => bcrypt('password'),
        ]);

        // 4. Japanese User
        User::factory()->create([
            'name' => 'Kenji Sato',
            'email' => 'kenji@example.com',
            'preferred_language' => 'ja',
            'country_code' => 'JP',
            'password' => bcrypt('password'),
        ]);
    }
}
