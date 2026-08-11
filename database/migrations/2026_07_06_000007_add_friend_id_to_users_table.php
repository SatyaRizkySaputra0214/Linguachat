<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('friend_id')->nullable()->unique()->after('email');
        });

        // Generate unique friend_id for existing users
        $users = User::whereNull('friend_id')->get();
        foreach ($users as $user) {
            do {
                $friendId = 'LC-'.str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
            } while (User::where('friend_id', $friendId)->exists());

            $user->update(['friend_id' => $friendId]);
        }

        // Change column to not nullable after populating existing users
        Schema::table('users', function (Blueprint $table) {
            $table->string('friend_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('friend_id');
        });
    }
};
