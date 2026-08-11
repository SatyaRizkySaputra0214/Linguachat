<?php

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
            if (! Schema::hasColumn('users', 'preferred_language')) {
                $table->string('preferred_language', 10)->default('en')->index();
            }
            if (! Schema::hasColumn('users', 'country_code')) {
                $table->string('country_code', 10)->nullable();
            }
            if (! Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar', 255)->nullable();
            }
            if (! Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('users', 'preferred_language')) {
                $columns[] = 'preferred_language';
            }
            if (Schema::hasColumn('users', 'country_code')) {
                $columns[] = 'country_code';
            }
            if (Schema::hasColumn('users', 'avatar')) {
                $columns[] = 'avatar';
            }
            if (Schema::hasColumn('users', 'is_active')) {
                $columns[] = 'is_active';
            }
            if (! empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
