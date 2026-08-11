<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use App\Models\MessageTranslation;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ChatService
{
    protected TranslationService $translationService;

    protected ChatHiddenService $chatHiddenService;

    public function __construct(TranslationService $translationService, ChatHiddenService $chatHiddenService)
    {
        $this->translationService = $translationService;
        $this->chatHiddenService = $chatHiddenService;
    }

    /**
     * Get all conversations for a specific user, with unread counts.
     * Excludes conversations where the user has no visible messages (all hidden by threshold).
     */
    public function getUserConversations(int $userId)
    {
        $conversations = Conversation::whereHas('participants', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            ->with(['users', 'lastMessage.translations'])
            ->orderByDesc('last_message_at')
            ->get();

        // Filter out conversations where the user has no visible messages
        $visibleConversations = $conversations->filter(function ($conversation) use ($userId) {
            $threshold = $this->chatHiddenService->getHiddenThreshold($userId, $conversation->id);
            if ($threshold <= 0) {
                return true;
            }

            $highestMessageId = Message::where('conversation_id', $conversation->id)
                ->max('id');

            if ($highestMessageId === null) {
                return true;
            }

            return $highestMessageId > $threshold;
        });

        // Compute unread count for each visible conversation, respecting hidden threshold
        $visibleConversations->each(function ($conversation) use ($userId) {
            $threshold = $this->chatHiddenService->getHiddenThreshold($userId, $conversation->id);

            $conversation->unread_count = Message::where('conversation_id', $conversation->id)
                ->where('sender_id', '!=', $userId)
                ->whereNotExists(function ($sub) use ($userId) {
                    $sub->select(\DB::raw(1))
                        ->from('conversation_participants')
                        ->whereColumn('conversation_participants.conversation_id', 'messages.conversation_id')
                        ->where('conversation_participants.user_id', $userId)
                        ->whereRaw('messages.id <= conversation_participants.last_read_message_id');
                })
                ->when($threshold > 0, function ($q) use ($threshold) {
                    $q->where('id', '>', $threshold);
                })
                ->count();
        });

        return $visibleConversations->values();
    }

    /**
     * Find or create a private 1-to-1 conversation between two users.
     */
    public function getOrCreatePrivateConversation(int $senderId, int $recipientId): Conversation
    {
        // Try to find an existing private conversation between these two users
        $conversation = Conversation::where('type', 'private')
            ->whereHas('participants', function ($query) use ($senderId) {
                $query->where('user_id', $senderId);
            })
            ->whereHas('participants', function ($query) use ($recipientId) {
                $query->where('user_id', $recipientId);
            })
            ->first();

        if ($conversation) {
            return $conversation;
        }

        // If not found, create a new conversation and participants
        return DB::transaction(function () use ($senderId, $recipientId) {
            $conversation = Conversation::create([
                'type' => 'private',
                'created_by' => $senderId,
                'last_message_at' => now(),
            ]);

            ConversationParticipant::create([
                'conversation_id' => $conversation->id,
                'user_id' => $senderId,
                'joined_at' => now(),
            ]);

            ConversationParticipant::create([
                'conversation_id' => $conversation->id,
                'user_id' => $recipientId,
                'joined_at' => now(),
            ]);

            return $conversation;
        });
    }

    /**
     * Get messages in a conversation, filtered by user's hidden history.
     * Only shows messages newer than the hidden threshold.
     */
    public function getConversationMessages(int $conversationId, int $perPage = 50, ?int $userId = null)
    {
        $query = Message::where('conversation_id', $conversationId)
            ->with(['translations', 'sender'])
            ->orderBy('sent_at', 'asc');

        if ($userId !== null) {
            $threshold = $this->chatHiddenService->getHiddenThreshold($userId, $conversationId);
            if ($threshold > 0) {
                $query->where('id', '>', $threshold);
            }
        }

        return $query->paginate($perPage);
    }

    /**
     * Clear chat history for a user in a conversation (hide all messages up to now).
     */
    public function clearChatHistory(int $userId, int $conversationId): void
    {
        $lastMessage = Message::where('conversation_id', $conversationId)
            ->orderByDesc('id')
            ->first();

        $lastMessageId = $lastMessage ? $lastMessage->id : 0;

        $this->chatHiddenService->hideMessagesBefore($userId, $conversationId, $lastMessageId);
    }

    /**
     * Send a message in a conversation.
     */
    public function sendMessage(int $senderId, int $conversationId, string $text): Message
    {
        $conversation = Conversation::findOrFail($conversationId);

        // Find the recipient (the other participant)
        $recipientParticipant = ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', '!=', $senderId)
            ->firstOrFail();

        $recipient = User::findOrFail($recipientParticipant->user_id);
        $sender = User::findOrFail($senderId);

        // Determine languages
        $sourceLanguage = $sender->preferred_language ?? 'en';
        $targetLanguage = $recipient->preferred_language ?? 'en';

        // 1. Create message with pending status
        $message = DB::transaction(function () use ($conversationId, $senderId, $text, $sourceLanguage) {
            $msg = Message::create([
                'conversation_id' => $conversationId,
                'sender_id' => $senderId,
                'message_type' => 'text',
                'original_text' => $text,
                'original_language' => $sourceLanguage,
                'translation_status' => 'pending',
                'sent_at' => now(),
            ]);

            return $msg;
        });

        // 2. Perform translation
        $translationResult = $this->translationService->translate($text, $sourceLanguage, $targetLanguage);

        // 3. Save translation result and update status
        DB::transaction(function () use ($message, $recipient, $sourceLanguage, $targetLanguage, $translationResult, $conversation) {
            if ($translationResult['status'] === 'done') {
                MessageTranslation::create([
                    'message_id' => $message->id,
                    'recipient_id' => $recipient->id,
                    'source_language' => $translationResult['original_language'] ?? $sourceLanguage,
                    'target_language' => $targetLanguage,
                    'translated_text' => $translationResult['translated_text'],
                    'provider_name' => 'libretranslate',
                    'provider_response' => $translationResult['provider_response'],
                    'status' => 'done',
                    'translated_at' => now(),
                ]);

                $message->update([
                    'translation_status' => 'done',
                    'original_language' => $translationResult['original_language'] ?? $sourceLanguage,
                ]);
            } elseif ($translationResult['status'] === 'not_needed') {
                // Same languages, copy original to translated
                MessageTranslation::create([
                    'message_id' => $message->id,
                    'recipient_id' => $recipient->id,
                    'source_language' => $sourceLanguage,
                    'target_language' => $targetLanguage,
                    'translated_text' => $message->original_text,
                    'provider_name' => 'system',
                    'status' => 'not_needed',
                    'translated_at' => now(),
                ]);

                $message->update([
                    'translation_status' => 'not_needed',
                ]);
            } else {
                // Failed translation
                $message->update([
                    'translation_status' => 'failed',
                ]);

                MessageTranslation::create([
                    'message_id' => $message->id,
                    'recipient_id' => $recipient->id,
                    'source_language' => $sourceLanguage,
                    'target_language' => $targetLanguage,
                    'translated_text' => null,
                    'provider_name' => 'libretranslate',
                    'provider_response' => $translationResult['provider_response'],
                    'status' => 'failed',
                    'translated_at' => now(),
                ]);
            }

            // Update conversation last message
            $conversation->update([
                'last_message_id' => $message->id,
                'last_message_at' => $message->sent_at,
            ]);
        });

        // Load relations for response
        return $message->load(['translations', 'sender']);
    }

    /**
     * Mark all messages in a conversation as read for a user.
     * Updates last_read_message_id and last_read_at on the participant record.
     */
    public function markMessagesAsRead(int $userId, int $conversationId): void
    {
        $latestMessage = Message::where('conversation_id', $conversationId)
            ->orderByDesc('id')
            ->first();

        if (! $latestMessage) {
            return;
        }

        ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->update([
                'last_read_message_id' => $latestMessage->id,
                'last_read_at' => now(),
            ]);
    }
}
