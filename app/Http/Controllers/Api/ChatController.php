<?php

namespace App\Http\Controllers\Api;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\OpenConversationRequest;
use App\Http\Requests\Api\SendMessageRequest;
use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Services\ChatService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    use ApiResponse;

    protected ChatService $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * Get list of conversations for the current logged-in user.
     */
    public function getConversations(Request $request)
    {
        $userId = $request->user()->id;
        $conversations = $this->chatService->getUserConversations($userId);

        return $this->successResponse(
            ConversationResource::collection($conversations),
            'Conversations retrieved successfully.'
        );
    }

    /**
     * Open or create a 1-to-1 conversation with a target user.
     */
    public function openConversation(OpenConversationRequest $request)
    {
        $currentUser = $request->user();
        $recipientId = $request->validated('recipient_id');

        // Check if they are friends
        $isFriend = $currentUser->friends()->where('users.id', $recipientId)->exists();
        if (! $isFriend) {
            return $this->errorResponse('You can only start a conversation with users who are already your friends.', 403);
        }

        $conversation = $this->chatService->getOrCreatePrivateConversation($currentUser->id, $recipientId);
        $conversation->load(['users', 'lastMessage.translations']);

        return $this->successResponse(
            new ConversationResource($conversation),
            'Conversation opened successfully.'
        );
    }

    /**
     * Get message history for a conversation.
     */
    public function getMessages(Request $request, $conversationId)
    {
        $userId = $request->user()->id;

        // Verify authorization: current user must be a participant
        $isParticipant = ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->exists();

        if (! $isParticipant) {
            return $this->errorResponse('Unauthorized to access this conversation.', 403);
        }

        $messages = $this->chatService->getConversationMessages($conversationId, 50, $userId);

        // Mark all messages as read since user is viewing this conversation
        $this->chatService->markMessagesAsRead($userId, $conversationId);

        return $this->successResponse([
            'messages' => MessageResource::collection($messages->items()),
            'pagination' => [
                'total' => $messages->total(),
                'per_page' => $messages->perPage(),
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
            ],
        ], 'Messages retrieved successfully.');
    }

    /**
     * Send a message in a conversation.
     */
    public function sendMessage(SendMessageRequest $request)
    {
        $userId = $request->user()->id;
        $conversationId = $request->validated('conversation_id');
        $text = $request->validated('message');

        // Verify authorization: current user must be a participant
        $isParticipant = ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->exists();

        if (! $isParticipant) {
            return $this->errorResponse('Unauthorized to post in this conversation.', 403);
        }

        try {
            $message = $this->chatService->sendMessage($userId, $conversationId, $text);

            return $this->successResponse(
                new MessageResource($message),
                'Message sent successfully.',
                201
            );
        } catch (\Exception $e) {
            Log::error('Send message failed', ['error' => $e->getMessage()]);

            return $this->errorResponse('Failed to send message.', 500);
        }
    }

    /**
     * Clear chat history for the current user in a conversation.
     */
    public function clearHistory(Request $request, $conversationId)
    {
        $userId = $request->user()->id;

        $isParticipant = ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->exists();

        if (! $isParticipant) {
            return $this->errorResponse('Unauthorized to access this conversation.', 403);
        }

        $this->chatService->clearChatHistory($userId, $conversationId);

        return $this->successResponse(null, 'Chat history cleared successfully.');
    }
}
