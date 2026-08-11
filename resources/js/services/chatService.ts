import axios from 'axios';
import type { Conversation, Message, User } from '@/types';

// Set up axios defaults for Laravel session/CSRF authentication
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export interface ApiResponse<T> {
    meta: {
        status: 'success' | 'error';
        message: string;
        code: number;
    };
    data: T;
}

export interface MessagesResponse {
    messages: Message[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}

export const chatService = {
    /**
     * Get list of users to start a conversation.
     */
    async getUsers(query?: string): Promise<User[]> {
        const response = await axios.get<ApiResponse<User[]>>('/api/users', {
            params: query ? { q: query } : {}
        });

        return response.data.data;
    },

    /**
     * Get list of active conversations.
     */
    async getConversations(): Promise<Conversation[]> {
        const response = await axios.get<ApiResponse<Conversation[]>>('/api/conversations');

        return response.data.data;
    },

    /**
     * Open or create a 1-to-1 conversation with a user.
     */
    async openConversation(recipientId: number): Promise<Conversation> {
        const response = await axios.post<ApiResponse<Conversation>>('/api/conversations/open', {
            recipient_id: recipientId
        });

        return response.data.data;
    },

    /**
     * Get message history for a conversation.
     */
    async getMessages(conversationId: number): Promise<MessagesResponse> {
        const response = await axios.get<ApiResponse<MessagesResponse>>(`/api/conversations/${conversationId}/messages`);

        return response.data.data;
    },

    /**
     * Send a message.
     */
    async sendMessage(conversationId: number, messageText: string): Promise<Message> {
        const response = await axios.post<ApiResponse<Message>>('/api/messages/send', {
            conversation_id: conversationId,
            message: messageText
        });

        return response.data.data;
    },

    /**
     * Get list of friends.
     */
    async getFriends(): Promise<User[]> {
        const response = await axios.get<ApiResponse<User[]>>('/api/friends');

        return response.data.data;
    },

    /**
     * Search a user by their unique friend_id.
     */
    async searchByFriendId(friendId: string): Promise<User> {
        const response = await axios.get<ApiResponse<User>>('/api/users/search-by-id', {
            params: { friend_id: friendId }
        });

        return response.data.data;
    },

    /**
     * Add a friend by ID.
     */
    async addFriend(friendId: string): Promise<User> {
        const response = await axios.post<ApiResponse<User>>('/api/friends/add', {
            friend_id: friendId
        });

        return response.data.data;
    },

    /**
     * Remove a friend by user ID.
     */
    async removeFriend(userId: number): Promise<void> {
        await axios.post<ApiResponse<null>>('/api/friends/remove', {
            user_id: userId
        });
    },

    /**
     * Clear chat history for the current user in a conversation.
     */
    async clearChatHistory(conversationId: number): Promise<void> {
        await axios.post<ApiResponse<null>>(`/api/conversations/${conversationId}/clear-history`);
    }
};
