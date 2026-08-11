<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $userId = $request->user()?->id;
        $isSender = $this->sender_id === $userId;

        // Find the translation for the current user if they are the recipient
        $translation = null;
        if (! $isSender && $userId) {
            $translation = $this->translations
                ? $this->translations->firstWhere('recipient_id', $userId)
                : $this->translations()->where('recipient_id', $userId)->first();
        }

        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender_id' => $this->sender_id,
            'message_type' => $this->message_type,
            'original_text' => $this->original_text,
            'original_language' => $this->original_language,
            'translation_status' => $this->translation_status,
            'translated_text' => $translation ? $translation->translated_text : null,
            'translated_language' => $translation ? $translation->target_language : null,
            'is_translated' => $translation && $translation->translated_text && ($translation->translated_text !== $this->original_text),
            'sent_at' => $this->sent_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
