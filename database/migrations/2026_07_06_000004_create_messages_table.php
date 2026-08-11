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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->string('message_type', 20)->default('text');
            $table->text('original_text');
            $table->string('original_language', 10)->nullable()->index();
            $table->string('translation_status', 20)->default('pending')->index();
            $table->timestamp('sent_at')->useCurrent()->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['conversation_id', 'sent_at'], 'idx_conv_sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
