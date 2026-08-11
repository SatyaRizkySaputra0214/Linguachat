import { useState, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Globe, Loader2, Search, Plus, Trash2, User as UserIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@/types';
import { chatService } from '@/services/chatService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmDialog from '@/components/confirm-dialog';
import ui from '@/lang/en';

interface FriendsPanelProps {
    friends: User[];
    onStartChat: (user: User) => void;
    getLanguageName: (code: string | null | undefined) => string;
    onFriendsChange: () => void;
}

export default function FriendsPanel({
    friends,
    onStartChat,
    getLanguageName,
    onFriendsChange,
}: FriendsPanelProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [friendIdInput, setFriendIdInput] = useState('');
    const [searchingById, setSearchingById] = useState(false);
    const [submittingFriend, setSubmittingFriend] = useState(false);
    const [idSearchResult, setIdSearchResult] = useState<User | null>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [searchingUsers, setSearchingUsers] = useState(false);
    const [searchResults, setSearchResults] = useState<User[] | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const filteredFriends = searchQuery.trim()
        ? friends.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : friends;

    const handleSearchFriendById = async (e: React.FormEvent) => {
        e.preventDefault();
        const idToSearch = friendIdInput.trim();
        if (!idToSearch) return;

        setSearchingById(true);
        setIdSearchResult(null);

        try {
            const result = await chatService.searchByFriendId(idToSearch);
            setIdSearchResult(result);
        } catch (error: any) {
            const message = error.response?.data?.meta?.message || ui.chat.user_id_not_found;
            toast.error(message);
        } finally {
            setSearchingById(false);
        }
    };

    const handleAddFriend = async (friendId: string) => {
        setSubmittingFriend(true);

        try {
            await chatService.addFriend(friendId);
            toast.success(ui.chat.friend_added);
            setFriendIdInput('');
            setIdSearchResult(null);
            await onFriendsChange();
        } catch (error: any) {
            const message = error.response?.data?.meta?.message || ui.chat.failed_add_friend;
            toast.error(message);
        } finally {
            setSubmittingFriend(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!query.trim()) {
            setSearchResults(null);
            return;
        }

        setSearchingUsers(true);
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const users = await chatService.getUsers(query);
                setSearchResults(users);
            } catch (error) {
                console.error('Failed to search users', error);
            } finally {
                setSearchingUsers(false);
            }
        }, 400);
    };

    const handleRemoveFriend = async (user: User) => {
        setRemovingId(user.id);

        try {
            await chatService.removeFriend(user.id);
            toast.success(`${user.name} removed from friends.`);
            await onFriendsChange();
        } catch (error: any) {
            const message = error.response?.data?.meta?.message || 'Failed to remove friend.';
            toast.error(message);
        } finally {
            setRemovingId(null);
        }
    };

    const showSearchResults = searchQuery.trim() !== '' && searchResults !== null;

    return (
        <div className="flex flex-col h-full">
            {/* Search */}
            <div className="px-3 py-2 border-b border-border/40">
                <div className="relative">
                    <Search className="absolute top-1/2 -translate-y-1/2 left-3 size-4 text-muted-foreground" />
                    <input
                        placeholder="Search friends..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="flex h-9 w-full rounded-xl border border-border/60 bg-muted/40 px-9 py-1.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary/30 placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* Add Friend Section */}
            <div className="px-3 py-2.5 border-b border-border/40">
                <div className="flex items-center gap-1.5 mb-2">
                    <UserIcon className="size-3.5 text-primary" />
                    <span className="text-[11px] font-semibold text-foreground tracking-wide">{ui.chat.add_friend_heading}</span>
                </div>
                <form onSubmit={handleSearchFriendById} className="flex gap-2">
                    <Input
                        placeholder="LC-xxxxxx"
                        className="h-9 text-xs flex-1 bg-muted/40 border-border/60 focus-visible:ring-1 focus-visible:ring-primary/30 rounded-xl"
                        value={friendIdInput}
                        onChange={(e) => {
                            setFriendIdInput(e.target.value);
                            if (idSearchResult) setIdSearchResult(null);
                        }}
                        disabled={searchingById || submittingFriend}
                    />
                    <Button
                        type="submit"
                        size="sm"
                        className="h-9 px-3 rounded-xl font-medium text-xs"
                        disabled={searchingById || submittingFriend || !friendIdInput.trim()}
                    >
                        {searchingById ? <Loader2 className="size-3.5 animate-spin" /> : ui.chat.search_button}
                    </Button>
                </form>

                {idSearchResult && (
                    <div className="mt-2.5 p-2.5 bg-muted/30 border border-border/50 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar className="size-8 border border-border/50">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                                    {idSearchResult.name.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <div className="text-xs font-semibold truncate text-foreground">{idSearchResult.name}</div>
                                <div className="text-[10px] text-muted-foreground truncate">{idSearchResult.friend_id}</div>
                            </div>
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            className="h-7 text-xs px-2.5 rounded-lg font-medium"
                            onClick={() => handleAddFriend(idSearchResult.friend_id!)}
                            disabled={submittingFriend}
                        >
                            {submittingFriend ? (
                                <Loader2 className="size-3 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="size-3" />
                                    <span>{ui.chat.add_button}</span>
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            {/* Friends / Search Results List */}
            <div className="flex-1 overflow-y-auto py-1">
                {showSearchResults ? (
                    <div className="p-2 space-y-0.5">
                        <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground tracking-wide uppercase">
                            {ui.chat.search_results}
                        </div>
                        {searchingUsers ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="size-5 animate-spin text-primary" />
                            </div>
                        ) : searchResults && searchResults.length > 0 ? (
                            searchResults.map(user => (
                                <button
                                    key={user.id}
                                    className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left group"
                                    onClick={() => onStartChat(user)}
                                >
                                    <Avatar className="size-9 border border-border/50">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                                            {user.name.slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold truncate text-foreground">{user.name}</div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Globe className="size-3 text-muted-foreground" />
                                            <span>{getLanguageName(user.preferred_language)}</span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                                {ui.chat.no_users_found}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {friends.length > 0 ? (
                            <div className="space-y-0.5 px-1.5">
                                {filteredFriends.map(friend => (
                                                <div
                                                    key={friend.id}
                                                    className="flex items-center gap-1 w-full p-1.5 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/30 group"
                                                >
                                                    <button
                                                        className="flex items-center gap-3 flex-1 min-w-0 p-1 rounded-lg text-left"
                                                        onClick={() => onStartChat(friend)}
                                                    >
                                                        <Avatar className="size-9 border border-border/50 shrink-0">
                                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                                                                {friend.name.slice(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-semibold truncate text-foreground">{friend.name}</div>
                                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                                <Globe className="size-3 text-muted-foreground" />
                                                                <span>{getLanguageName(friend.preferred_language)}</span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <ConfirmDialog
                                                        trigger={
                                                            <button
                                                                type="button"
                                                                disabled={removingId === friend.id}
                                                                className="shrink-0 size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all disabled:opacity-50"
                                                                title="Remove friend"
                                                            >
                                                                {removingId === friend.id ? (
                                                                    <Loader2 className="size-3.5 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="size-3.5" />
                                                                )}
                                                            </button>
                                                        }
                                                        title={ui.chat.remove_friend_title}
                                                        description={ui.chat.remove_friend_desc.replace('{name}', friend.name)}
                                                        confirmText={ui.chat.remove_friend_confirm}
                                                        cancelText={ui.chat.remove_friend_cancel}
                                                        icon={
                                                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
                                                                <AlertTriangle className="size-6 text-destructive" />
                                                            </div>
                                                        }
                                                        onConfirm={() => handleRemoveFriend(friend)}
                                                        loading={removingId === friend.id}
                                                    />
                                                </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 mx-3 text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/50">
                                {ui.chat.no_friends}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
