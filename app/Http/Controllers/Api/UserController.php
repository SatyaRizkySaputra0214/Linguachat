<?php

namespace App\Http\Controllers\Api;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SearchUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponse;

    /**
     * Search a user by their unique friend_id.
     */
    public function searchByFriendId(Request $request)
    {
        $friendId = $request->query('friend_id');
        if (! $friendId) {
            return $this->errorResponse('Friend ID is required.', 400);
        }

        $user = User::where('friend_id', $friendId)
            ->where('is_active', true)
            ->first();

        if (! $user) {
            return $this->errorResponse('User ID not found.', 404);
        }

        return $this->successResponse(
            new UserResource($user),
            'User found successfully.'
        );
    }

    /**
     * Get a list of users for chat, excluding the current logged-in user.
     */
    public function index(SearchUserRequest $request)
    {
        $currentUser = $request->user();
        $searchQuery = $request->validated('q');

        $users = $currentUser->friends()
            ->where('is_active', true)
            ->when($searchQuery, function ($query) use ($searchQuery) {
                $query->where('name', 'like', '%'.$searchQuery.'%');
            })
            ->limit(30)
            ->get();

        return $this->successResponse(
            UserResource::collection($users),
            'Users retrieved successfully.'
        );
    }
}
