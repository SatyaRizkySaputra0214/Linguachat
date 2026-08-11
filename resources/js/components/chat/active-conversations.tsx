import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, Loader2, Search } from 'lucide-react';
import type { Conversation } from '@/types/chat';
import ui from '@/lang/en';

interface ActiveConversationsProps {
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    unreadCounts: Record<number, number>;
    currentUserId: number;
    onSelect: (conv: Conversation) => void;
    formatMessageTime: (date: string) => string;
    noMessagesYet: string;
    noActiveChats: string;
    loading: boolean;
    loadingText: string;
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchPlaceholder: string;
}

export default function ActiveConversations({
    conversations,
    selectedConversation,
    unreadCounts,
    currentUserId,
    onSelect,
    formatMessageTime,
    noMessagesYet,
    noActiveChats,
    loading,
    loadingText,
    searchQuery,
    onSearchChange,
    searchPlaceholder,
}: ActiveConversationsProps) {
    const filteredConversations = searchQuery.trim()
        ? conversations.filter(conv => {
              const name = conv.target_user?.name?.toLowerCase() || '';
              return name.includes(searchQuery.toLowerCase());
          })
        : conversations;

    return (
        <div className="flex flex-col h-full">
            {/* Search */}
            <div className="px-3 py-2 border-b border-border/40">
                <div className="relative">
                    <Search className="absolute top-1/2 -translate-y-1/2 left-3 size-4 text-muted-foreground" />
                    <input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={onSearchChange}
                        className="flex h-9 w-full rounded-xl border border-border/60 bg-muted/40 px-9 py-1.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary/30 placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                        <Loader2 className="size-5 animate-spin text-primary" />
                        <span className="text-[11px] text-muted-foreground">{loadingText}</span>
                    </div>
                ) : filteredConversations.length > 0 ? (
                    <div className="space-y-0.5 px-1.5">
                        {filteredConversations.map(conv => {
                            const isSelected = selectedConversation?.id === conv.id;
                            const targetUser = conv.target_user;

                            if (!targetUser) return null;

                            let messagePreview = noMessagesYet;

                            if (conv.last_message) {
                                const lm = conv.last_message;
                                const isViewerRecipient = lm.sender_id !== currentUserId;

                                if (isViewerRecipient && lm.translated_text) {
                                    messagePreview = lm.translated_text;
                                } else {
                                    messagePreview = lm.original_text;
                                }
                            }

                            return (
                                <button
                                    key={conv.id}
                                    className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-all text-left ${
                                        isSelected
                                            ? 'bg-primary/10 border border-primary/20 shadow-xs'
                                            : 'hover:bg-muted/50 border border-transparent'
                                    }`}
                                    onClick={() => onSelect(conv)}
                                >
                                    <div className="relative shrink-0">
                                        <Avatar className="size-10 border border-border/50">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                                                {targetUser.name.slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {unreadCounts[conv.id] > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground ring-2 ring-white dark:ring-zinc-900">
                                                {unreadCounts[conv.id] > 9 ? '9+' : unreadCounts[conv.id]}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <span className={`text-sm truncate ${isSelected || unreadCounts[conv.id] > 0 ? 'font-bold' : 'font-semibold'} text-foreground`}>
                                                {targetUser.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                                                {conv.last_message_at ? formatMessageTime(conv.last_message_at) : ''}
                                            </span>
                                        </div>
                                        <div className={`text-xs truncate mt-0.5 ${
                                            unreadCounts[conv.id] > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'
                                        }`}>
                                            {messagePreview}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                                                {targetUser.preferred_language}
                                            </span>
                                            {conv.last_message && conv.last_message.is_translated && (
                                                <Sparkles className="size-2.5 text-primary" />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-6 mx-3 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/50">
                        {searchQuery.trim() ? (
                            <span>{ui.chat.no_conv_match}</span>
                        ) : (
                            <span>{noActiveChats}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
