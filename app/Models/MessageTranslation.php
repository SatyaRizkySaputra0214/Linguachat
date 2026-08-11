<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['message_id', 'recipient_id', 'source_language', 'target_language', 'translated_text', 'provider_name', 'provider_response', 'status', 'translated_at'])]
class MessageTranslation extends Model
{
    use HasFactory;

    protected $casts = [
        'provider_response' => 'array',
        'translated_at' => 'datetime',
    ];

    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }
}
