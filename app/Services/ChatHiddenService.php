<?php

namespace App\Services;

use Illuminate\Support\Facades\File;

class ChatHiddenService
{
    private string $storagePath;

    public function __construct()
    {
        $this->storagePath = storage_path('app/chat_hidden');
    }

    private function getFilePath(int $userId): string
    {
        return $this->storagePath.'/'.$userId.'.json';
    }

    private function loadUserData(int $userId): array
    {
        $path = $this->getFilePath($userId);

        if (! File::exists($path)) {
            return [];
        }

        $content = File::get($path);
        $data = json_decode($content, true);

        return is_array($data) ? $data : [];
    }

    private function saveUserData(int $userId, array $data): void
    {
        if (! File::isDirectory($this->storagePath)) {
            File::makeDirectory($this->storagePath, 0755, true);
        }

        File::put($this->getFilePath($userId), json_encode($data, JSON_PRETTY_PRINT));
    }

    /**
     * Hide all messages up to and including the given message ID.
     * New messages with ID > $lastMessageId will still be visible.
     */
    public function hideMessagesBefore(int $userId, int $conversationId, int $lastMessageId): void
    {
        $data = $this->loadUserData($userId);
        $convKey = (string) $conversationId;

        $data[$convKey] = $lastMessageId;

        $this->saveUserData($userId, $data);
    }

    /**
     * Get the threshold message ID for a conversation.
     * Returns 0 if not hidden (all messages shown).
     */
    public function getHiddenThreshold(int $userId, int $conversationId): int
    {
        $data = $this->loadUserData($userId);
        $convKey = (string) $conversationId;

        return isset($data[$convKey]) ? (int) $data[$convKey] : 0;
    }

    /**
     * Get conversation IDs where all messages are hidden (no messages newer than threshold).
     */
    public function getHiddenConversationIds(int $userId): array
    {
        $data = $this->loadUserData($userId);
        $hidden = [];

        foreach ($data as $convKey => $threshold) {
            if (is_int($threshold) && $threshold > 0) {
                $hidden[] = (int) $convKey;
            }
        }

        return $hidden;
    }
}
