import type { User } from './auth';

export interface Conversation {
    id: number;
    type: string;
    created_by: number | null;
    last_message_id: number | null;
    last_message_at: string | null;
    target_user: User | null;
    last_message: Message | null;
    unread_count: number;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    message_type: string;
    original_text: string;
    original_language: string | null;
    translation_status: 'pending' | 'done' | 'failed' | 'not_needed';
    translated_text: string | null;
    translated_language: string | null;
    is_translated: boolean;
    sent_at: string;
    created_at: string;
}
