<?php

namespace App\Http\Controllers\Api;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FriendshipController extends Controller
{
    use ApiResponse;

    /**
     * Get the list of friends for the authenticated user.
     */
    public function index(Request $request)
    {
        $friends = $request->user()->friends()->where('is_active', true)->get();

        return $this->successResponse(
            UserResource::collection($friends),
            'Friends list retrieved successfully.'
        );
    }

    /**
     * Add a friend by their unique friend_id.
     */
    public function addFriend(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'friend_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Friend ID is required.', 400);
        }

        $friendIdInput = trim($request->input('friend_id'));
        $currentUser = $request->user();

        // 1. Jika ID tidak ditemukan
        $targetUser = User::where('friend_id', $friendIdInput)->first();
        if (! $targetUser) {
            return $this->errorResponse('User ID not found.', 404);
        }

        // 2. Jika user mencoba menambahkan dirinya sendiri
        if ($targetUser->id === $currentUser->id) {
            return $this->errorResponse('You cannot add yourself as a friend.', 400);
        }

        // 3. Jika user tersebut sudah menjadi teman
        $alreadyFriends = Friendship::where('user_id', $currentUser->id)
            ->where('friend_id', $targetUser->id)
            ->exists();

        if ($alreadyFriends) {
            return $this->errorResponse('User is already in your friends list.', 400);
        }

        // 4. Jika penambahan berhasil
        DB::transaction(function () use ($currentUser, $targetUser) {
            // Add friendship row for User A -> User B
            Friendship::create([
                'user_id' => $currentUser->id,
                'friend_id' => $targetUser->id,
                'status' => 'accepted',
            ]);

            // Add reciprocal friendship row for User B -> User A
            Friendship::create([
                'user_id' => $targetUser->id,
                'friend_id' => $currentUser->id,
                'status' => 'accepted',
            ]);
        });

        return $this->successResponse(
            new UserResource($targetUser),
            'Friend added successfully.',
            201
        );
    }

    /**
     * Remove a friend by user ID.
     */
    public function removeFriend(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Valid user ID is required.', 400);
        }

        $currentUser = $request->user();
        $targetUserId = (int) $request->input('user_id');

        if ($targetUserId === $currentUser->id) {
            return $this->errorResponse('You cannot remove yourself.', 400);
        }

        $friendshipExists = Friendship::where('user_id', $currentUser->id)
            ->where('friend_id', $targetUserId)
            ->exists();

        if (! $friendshipExists) {
            return $this->errorResponse('User is not in your friends list.', 404);
        }

        DB::transaction(function () use ($currentUser, $targetUserId) {
            Friendship::where('user_id', $currentUser->id)
                ->where('friend_id', $targetUserId)
                ->delete();

            Friendship::where('user_id', $targetUserId)
                ->where('friend_id', $currentUser->id)
                ->delete();
        });

        return $this->successResponse(null, 'Friend removed successfully.');
    }
}
