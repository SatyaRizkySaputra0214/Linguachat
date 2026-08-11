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
        Schema::create('message_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('message_id')->constrained('messages')->onDelete('cascade');
            $table->foreignId('recipient_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('source_language', 10)->nullable()->index();
            $table->string('target_language', 10)->index();
            $table->text('translated_text')->nullable();
            $table->string('provider_name', 50)->nullable();
            $table->json('provider_response')->nullable();
            $table->string('status', 20)->default('pending')->index();
            $table->timestamp('translated_at')->nullable();
            $table->timestamps();

            $table->unique(['message_id', 'recipient_id', 'target_language'], 'uq_msg_rcpt_lang');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_translations');
    }
};
