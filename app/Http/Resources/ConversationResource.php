<?php

namespace App\Http\Resources;

use App\Models\ConversationParticipant;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $userId = $request->user()?->id;

        // Find the other participant in this conversation (target user)
        $targetUser = $this->users->first(function ($user) use ($userId) {
            return $user->id !== $userId;
        });

        // If not loaded but relation exists, we can get it from users relation
        if (! $targetUser && $this->relationLoaded('users')) {
            $targetUser = $this->users()->where('users.id', '!=', $userId)->first();
        }

        // Compute unread count: messages from others with id > last_read_message_id
        $unreadCount = $this->unread_count;
        if ($unreadCount === null && $userId) {
            $lastReadId = ConversationParticipant::where('conversation_id', $this->id)
                ->where('user_id', $userId)
                ->value('last_read_message_id');

            $unreadCount = Message::where('conversation_id', $this->id)
                ->where('sender_id', '!=', $userId)
                ->when($lastReadId, fn ($q) => $q->where('id', '>', $lastReadId))
                ->count();
        }

        return [
            'id' => $this->id,
            'type' => $this->type,
            'created_by' => $this->created_by,
            'last_message_id' => $this->last_message_id,
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            'target_user' => $targetUser ? new UserResource($targetUser) : null,
            'last_message' => $this->lastMessage ? new MessageResource($this->lastMessage) : null,
            'unread_count' => $unreadCount ?? 0,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
