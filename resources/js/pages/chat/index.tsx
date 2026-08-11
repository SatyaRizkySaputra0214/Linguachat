import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
    Send,
    Globe,
    MessageSquare,
    Loader2,
    Sparkles,
    Languages,
    AlertCircle,
    Copy,
    Check,
    ArrowLeft,
    ArrowDown,
    Trash2,
    AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { chatService } from '@/services/chatService';
import type { Conversation, Message, User, Auth } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import TranslationNoticeModal from '@/components/translation-notice-modal';
import ConfirmDialog from '@/components/confirm-dialog';
import ViewSwitcher from '@/components/chat/view-switcher';
import type { ChatView } from '@/components/chat/view-switcher';
import ActiveConversations from '@/components/chat/active-conversations';
import FriendsPanel from '@/components/chat/friends-panel';
import ui from '@/lang/en';

interface PageProps extends Record<string, unknown> {
    auth: Auth;
    initialConversationId?: number | null;
}

const getLanguageName = (code: string | null | undefined) => {
    if (!code) return '';

    const langs: Record<string, string> = {
        en: 'English',
        id: 'Indonesian',
        th: 'Thai',
        ja: 'Japanese',
        zh: 'Chinese',
        fr: 'French',
        es: 'Spanish',
    };

    return langs[code.toLowerCase()] || code.toUpperCase();
};

export default function Chat({ initialConversationId }: { initialConversationId?: number | null }) {
    const { auth } = usePage<PageProps>().props;
    const currentUserId = auth.user.id;

    const [activeView, setActiveView] = useState<ChatView>('conversations');

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessageText, setNewMessageText] = useState('');
    const [showOriginalMap, setShowOriginalMap] = useState<Record<number, boolean>>({});

    const [friends, setFriends] = useState<User[]>([]);

    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const prevMessagesCountRef = useRef(0);
    const selectedConvRef = useRef<Conversation | null>(null);
    const needsScrollToBottomRef = useRef(false);
    const lastSelectedAtRef = useRef<number>(0);
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [copiedId, setCopiedId] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);
    const [clearingHistory, setClearingHistory] = useState(false);

    // Conversation search query (managed here to clear when selecting a conversation)
    const [convSearchQuery, setConvSearchQuery] = useState('');

    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;

        if (!container) {
            return;
        }

        const threshold = 50;
        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;

        setIsNearBottom(distanceFromBottom <= threshold);
    }, []);

    const scrollToBottom = useCallback(() => {
        const container = messagesContainerRef.current;

        if (container) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        loadConversations();
        loadFriends();
    }, []);

    useEffect(() => {
        const justLoggedIn = sessionStorage.getItem('just_logged_in');

        if (justLoggedIn === 'true') {
            sessionStorage.removeItem('just_logged_in');
            setShowNoticeModal(true);
        }
    }, []);

    const loadFriends = async () => {
        try {
            const data = await chatService.getFriends();
            setFriends(data);
        } catch (error) {
            console.error('Failed to load friends', error);
        }
    };

    useEffect(() => {
        if (needsScrollToBottomRef.current) {
            if (messages.length === 0) {
                return;
            }

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const c = messagesContainerRef.current;

                    if (c) {
                        c.scrollTop = c.scrollHeight;
                        needsScrollToBottomRef.current = false;
                    }
                });
            });

            return;
        }

        const prevCount = prevMessagesCountRef.current;
        const currentCount = messages.length;

        prevMessagesCountRef.current = currentCount;

        if (currentCount > prevCount) {
            const container = messagesContainerRef.current;

            if (!container) {
                return;
            }

            const threshold = 150;
            const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;

            if (isAtBottom) {
                requestAnimationFrame(() => {
                    const c = messagesContainerRef.current;

                    if (c) {
                        c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
                    }
                });
            }
        }
    }, [messages]);

    useEffect(() => {
        const container = messagesContainerRef.current;

        if (!container) {
            return;
        }

        const observer = new ResizeObserver(() => {
            if (needsScrollToBottomRef.current && messages.length > 0) {
                container.scrollTop = container.scrollHeight;
            }
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, [selectedConversation, messages.length]);

    useEffect(() => {
        if (initialConversationId && conversations.length > 0) {
            const found = conversations.find(c => c.id === initialConversationId);

            if (found) {
                selectConversation(found);
            }
        }
    }, [initialConversationId, conversations]);

    const extractUnreadCounts = (convs: Conversation[]): Record<number, number> => {
        const next: Record<number, number> = {};
        convs.forEach(conv => {
            next[conv.id] = conv.unread_count;
        });

        return next;
    };

    useEffect(() => {
        let isMounted = true;
        let interval: NodeJS.Timeout;

        interval = setInterval(() => {
            chatService.getConversations()
                .then(res => {
                    if (isMounted) {
                        setConversations(res);
                        setUnreadCounts(extractUnreadCounts(res));

                        // Deselect conversation if it's no longer in the list
                        // But skip if a conversation was just selected (within 10s)
                        // to avoid race condition between openConversation and polling
                        setSelectedConversation(prev => {
                            if (prev && !res.some(c => c.id === prev.id)) {
                                const timeSinceSelected = Date.now() - lastSelectedAtRef.current;

                                if (timeSinceSelected < 10000) {
                                    return prev;
                                }

                                setMessages([]);

                                return null;
                            }

                            return prev;
                        });
                    }
                })
                .catch(err => console.error('Error polling conversations:', err));
        }, 4000);

        return () => {
            isMounted = false;

            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        let interval: NodeJS.Timeout;

        if (selectedConversation) {
            interval = setInterval(() => {
                chatService.getMessages(selectedConversation.id)
                    .then(res => {
                        if (isMounted) {
                            setMessages(res.messages);
                        }
                    })
                    .catch(err => console.error('Error polling messages:', err));
            }, 4000);
        }

        return () => {
            isMounted = false;

            if (interval) {
                clearInterval(interval);
            }
        };
    }, [selectedConversation]);

    const loadConversations = async () => {
        try {
            setLoadingConversations(true);
            const data = await chatService.getConversations();
            setConversations(data);
            setUnreadCounts(extractUnreadCounts(data));
        } catch (error) {
            console.error('Failed to load conversations', error);
            toast.error('Failed to load conversations list.');
        } finally {
            setLoadingConversations(false);
        }
    };

    const selectConversation = async (conv: Conversation) => {
        selectedConvRef.current = conv;
        setSelectedConversation(conv);
        setMessages([]);
        setNewMessageText('');
        setUnreadCounts(prev => ({ ...prev, [conv.id]: 0 }));
        needsScrollToBottomRef.current = true;
        setIsNearBottom(true);
        lastSelectedAtRef.current = Date.now();

        try {
            setLoadingMessages(true);
            const data = await chatService.getMessages(conv.id);

            setMessages(data.messages);

            prevMessagesCountRef.current = data.messages.length;

            const updatedConvs = await chatService.getConversations();
            setConversations(updatedConvs);
            setUnreadCounts(extractUnreadCounts(updatedConvs));

            setConvSearchQuery('');
        } catch (error) {
            console.error('Failed to load messages', error);
            toast.error('Failed to load messages history.');
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleConvSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConvSearchQuery(e.target.value);
    };

    const startChatWithUser = async (user: User) => {
        try {
            setLoadingMessages(true);
            const conv = await chatService.openConversation(user.id);

            const updatedConversations = await chatService.getConversations();
            setConversations(updatedConversations);
            setUnreadCounts(extractUnreadCounts(updatedConversations));

            const activeConv = updatedConversations.find(c => c.id === conv.id) || conv;
            selectConversation(activeConv);
        } catch (error) {
            console.error('Failed to start chat', error);
            toast.error('Could not open conversation.');
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessageText.trim() || !selectedConversation) {
            return;
        }

        const textToSend = newMessageText.trim();
        setNewMessageText('');
        setSendingMessage(true);

        const tempId = Date.now();
        const optimisticMessage: Message = {
            id: tempId,
            conversation_id: selectedConversation.id,
            sender_id: currentUserId,
            message_type: 'text',
            original_text: textToSend,
            original_language: auth.user.preferred_language || 'en',
            translation_status: 'pending',
            translated_text: null,
            translated_language: null,
            is_translated: false,
            sent_at: new Date().toISOString(),
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMessage]);

        try {
            const actualMessage = await chatService.sendMessage(selectedConversation.id, textToSend);

            setMessages(prev => prev.map(m => m.id === tempId ? actualMessage : m));

            const updatedConvs = await chatService.getConversations();
            setConversations(updatedConvs);
            setUnreadCounts(extractUnreadCounts(updatedConvs));
        } catch (error) {
            console.error('Failed to send message', error);
            toast.error('Failed to send message.');
            setMessages(prev => prev.filter(m => m.id !== tempId));
        } finally {
            setSendingMessage(false);
        }
    };

    const toggleOriginal = (msgId: number) => {
        setShowOriginalMap(prev => ({
            ...prev,
            [msgId]: !prev[msgId]
        }));
    };

    const handleCopyId = async () => {
        if (auth.user.friend_id) {
            await navigator.clipboard.writeText(auth.user.friend_id);
            setCopiedId(true);
            toast.success(ui.chat.id_copied);
            setTimeout(() => setCopiedId(false), 2000);
        }
    };

    const handleClearHistory = async () => {
        if (!selectedConversation) return;

        setClearingHistory(true);

        try {
            await chatService.clearChatHistory(selectedConversation.id);
            setMessages([]);
            setShowClearHistoryDialog(false);

            setSelectedConversation(null);

            const updatedConvs = await chatService.getConversations();
            setConversations(updatedConvs);
            setUnreadCounts(extractUnreadCounts(updatedConvs));

            toast.success(ui.chat.clear_history_success);
        } catch (error) {
            console.error('Failed to clear chat history', error);
            toast.error(ui.chat.clear_history_failed);
        } finally {
            setClearingHistory(false);
        }
    };

    const formatMessageTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const handleBackToList = () => {
        setSelectedConversation(null);
        setMessages([]);
    };

    return (
        <>
            <Head title={ui.chat.title} />
            <div className="flex flex-1 min-h-0 overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm md:flex-none md:h-[calc(100vh-7rem)]">

                {/* Left Panel - List View */}
                <div className={`${
                    selectedConversation ? 'hidden lg:flex' : 'flex'
                } w-full lg:w-80 flex-col border-r border-border/60 bg-white dark:bg-zinc-900/80`}>

                    {/* Profile Bar */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-primary/[0.04] dark:bg-zinc-900/60">
                        <Avatar className="size-10 border-2 border-primary/20 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                                {auth.user.name.slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate text-foreground">{auth.user.name}</div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono text-muted-foreground truncate">{auth.user.friend_id}</span>
                                <button
                                    type="button"
                                    onClick={handleCopyId}
                                    className="text-primary hover:text-[#c2410c] transition-colors shrink-0"
                                >
                                    {copiedId ? (
                                        <Check className="size-3" />
                                    ) : (
                                        <Copy className="size-3" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* View Switcher */}
                    <div className="px-3 py-2.5 border-b border-border/40">
                        <ViewSwitcher
                            activeView={activeView}
                            onViewChange={setActiveView}
                            conversationsLabel={ui.chat.active_conversations}
                            friendsLabel={ui.chat.friends_list}
                        />
                    </div>

                    {/* Conditional List Content */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        {activeView === 'conversations' ? (
                            <ActiveConversations
                                conversations={conversations}
                                selectedConversation={selectedConversation}
                                unreadCounts={unreadCounts}
                                currentUserId={currentUserId}
                                onSelect={selectConversation}
                                formatMessageTime={formatMessageTime}
                                noMessagesYet={ui.chat.no_messages_yet}
                                noActiveChats={ui.chat.no_active_chats}
                                loading={loadingConversations}
                                loadingText={ui.chat.loading}
                                searchQuery={convSearchQuery}
                                onSearchChange={handleConvSearchChange}
                                searchPlaceholder={ui.chat.search_placeholder}
                            />
                        ) : (
                            <FriendsPanel
                                friends={friends}
                                onStartChat={startChatWithUser}
                                getLanguageName={getLanguageName}
                                onFriendsChange={loadFriends}
                            />
                        )}
                    </div>
                </div>

                {/* Right Panel - Chat Room */}
                <div className={`${
                    selectedConversation ? 'flex' : 'hidden lg:flex'
                } flex-1 flex-col relative min-w-0 bg-accent/10 dark:bg-zinc-950/30`}>
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-white dark:bg-zinc-900/80">
                                <div className="flex items-center gap-3 min-w-0">
                                    <button
                                        type="button"
                                        onClick={handleBackToList}
                                        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors shrink-0"
                                    >
                                        <ArrowLeft className="size-5" />
                                    </button>
                                    <Avatar className="size-9 border border-border/50 shrink-0">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                                            {selectedConversation.target_user?.name.slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-foreground truncate">{selectedConversation.target_user?.name}</div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <span className="flex size-1.5 rounded-full bg-emerald-500"></span>
                                            <span className="truncate">{getLanguageName(selectedConversation.target_user?.preferred_language)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="hidden sm:inline-flex text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium items-center gap-1">
                                        <Sparkles className="size-3" />
                                        Auto-Translation
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setShowClearHistoryDialog(true)}
                                        className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10"
                                        title={ui.chat.clear_history}
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Container */}
                            <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                                {loadingMessages ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-3">
                                        <div className="relative">
                                            <div className="size-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">{ui.chat.loading_messages}</span>
                                    </div>
                                ) : messages.length > 0 ? (
                                    messages.map((message) => {
                                        const isMyMessage = message.sender_id === currentUserId;
                                        const showOriginal = showOriginalMap[message.id] || false;
                                        const hasTranslation = message.is_translated && message.translated_text !== null;
                                        const displayedText = (hasTranslation && !showOriginal)
                                            ? message.translated_text
                                            : message.original_text;

                                        return (
                                            <div
                                                key={message.id}
                                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} items-end gap-2`}
                                            >
                                                {!isMyMessage && (
                                                    <Avatar className="size-7 border border-border/40 shrink-0 mb-0.5">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold uppercase">
                                                            {selectedConversation.target_user?.name.slice(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={`max-w-[75%] sm:max-w-[65%] flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                                                    <div
                                                        className={`px-4 py-2.5 text-sm leading-relaxed ${
                                                            isMyMessage
                                                                ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md shadow-sm'
                                                                : 'bg-white dark:bg-zinc-800 text-foreground rounded-2xl rounded-bl-md border border-border/40 shadow-sm'
                                                        }`}
                                                    >
                                                        {displayedText}
                                                    </div>

                                                    {!isMyMessage && hasTranslation && (
                                                        <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-muted-foreground">
                                                            <Globe className="size-3 text-primary/60" />
                                                            <span>{getLanguageName(message.original_language)}</span>
                                                            <span>•</span>
                                                            <button
                                                                onClick={() => toggleOriginal(message.id)}
                                                                className="text-primary hover:text-[#c2410c] hover:underline font-medium"
                                                            >
                                                                {showOriginal ? ui.chat.translation_label : ui.chat.original_label}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {!isMyMessage && message.translation_status === 'failed' && (
                                                        <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-destructive font-medium">
                                                            <AlertCircle className="size-3" />
                                                            <span>{ui.chat.translation_failed}</span>
                                                        </div>
                                                    )}

                                                    <span className={`text-[10px] text-muted-foreground/60 mt-1 px-1 ${isMyMessage ? 'text-right' : 'text-left'}`}>
                                                        {formatMessageTime(message.sent_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                                        <div className="size-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
                                            <MessageSquare className="size-7 text-primary/40" />
                                        </div>
                                        <p className="text-sm font-semibold text-foreground">{ui.chat.start_conversation}</p>
                                        <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-relaxed">
                                            {ui.chat.start_conversation_desc}
                                        </p>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Scroll to Bottom Button */}
                            <button
                                type="button"
                                onClick={scrollToBottom}
                                aria-label="Scroll to latest messages"
                                className={`absolute bottom-20 right-5 z-10 size-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-[#c2410c] hover:shadow-xl ${
                                    isNearBottom ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 pointer-events-auto scale-100'
                                }`}
                            >
                                <ArrowDown className="size-5" />
                            </button>

                            {/* Message Input */}
                            <div className="px-4 py-3 border-t border-border/50 bg-white dark:bg-zinc-900/80">
                                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                                    <div className="flex-1 relative">
                                        <Input
                                            placeholder={ui.chat.message_placeholder}
                                            value={newMessageText}
                                            onChange={(e) => setNewMessageText(e.target.value)}
                                            className="min-h-[44px] py-2.5 pr-4 bg-muted/30 border-border/60 focus-visible:ring-1 focus-visible:ring-primary/30 rounded-xl resize-none"
                                            disabled={sendingMessage}
                                            maxLength={1000}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="h-[44px] min-w-[44px] rounded-xl"
                                        disabled={!newMessageText.trim() || sendingMessage}
                                    >
                                        {sendingMessage ? (
                                            <Loader2 className="size-5 animate-spin" />
                                        ) : (
                                            <Send className="size-5" />
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center bg-muted/10">
                            <div className="relative mb-6">
                                <div className="size-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xs">
                                    <Languages className="size-9 text-primary" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-foreground tracking-tight">LinguaChat</h2>
                            <p className="text-sm text-muted-foreground max-w-sm mt-2 leading-relaxed">
                                {ui.chat.empty_state_subtitle}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <TranslationNoticeModal
                isOpen={showNoticeModal}
                onClose={() => setShowNoticeModal(false)}
                language={auth.user.preferred_language || 'en'}
            />

            {/* Clear History Confirmation Dialog */}
            <ConfirmDialog
                open={showClearHistoryDialog}
                onOpenChange={setShowClearHistoryDialog}
                trigger={null}
                title={ui.chat.clear_history_title}
                description={ui.chat.clear_history_desc}
                confirmText={ui.chat.clear_history_confirm}
                cancelText={ui.chat.clear_history_cancel}
                onConfirm={handleClearHistory}
                loading={clearingHistory}
                icon={
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="size-6 text-destructive" />
                    </div>
                }
            >
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                    {ui.chat.clear_history_warning}
                </div>
            </ConfirmDialog>
        </>
    );
}

Chat.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Chat', href: '/chat' }]}>
        {page}
    </AppLayout>
);
