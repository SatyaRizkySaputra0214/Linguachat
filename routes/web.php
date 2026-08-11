<?php

use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\FriendshipController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\RegisterOtpController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/login')->name('home');

Route::middleware(['guest'])->group(function () {
    Route::get('register', [RegisterOtpController::class, 'create'])->name('register');
    Route::post('register', [RegisterOtpController::class, 'sendOtp'])->name('register.store');
    Route::post('register/send-otp', [RegisterOtpController::class, 'sendOtp'])->name('register.send-otp');
    Route::post('register/verify-otp', [RegisterOtpController::class, 'verifyOtp'])->name('register.verify-otp');
    Route::post('register/resend-otp', [RegisterOtpController::class, 'resendOtp'])->name('register.resend-otp');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/chat')->name('dashboard');

    // Chat Web Interface
    Route::get('chat/{conversation?}', function ($conversation = null) {
        return Inertia::render('chat/index', [
            'initialConversationId' => $conversation ? (int) $conversation : null,
        ]);
    })->name('chat.index');

    // Chat API Endpoints
    Route::get('api/users', [UserController::class, 'index'])->name('api.users');
    Route::get('api/users/search-by-id', [UserController::class, 'searchByFriendId'])->name('api.users.search-by-id');
    Route::get('api/conversations', [ChatController::class, 'getConversations'])->name('api.conversations');
    Route::post('api/conversations/open', [ChatController::class, 'openConversation'])->name('api.conversations.open');
    Route::get('api/conversations/{conversation}/messages', [ChatController::class, 'getMessages'])->name('api.conversations.messages');
    Route::post('api/messages/send', [ChatController::class, 'sendMessage'])->name('api.messages.send');
    Route::post('api/conversations/{conversation}/clear-history', [ChatController::class, 'clearHistory'])->name('api.conversations.clear-history');

    // Friendship API Endpoints
    Route::get('api/friends', [FriendshipController::class, 'index'])->name('api.friends');
    Route::post('api/friends/add', [FriendshipController::class, 'addFriend'])->name('api.friends.add');
    Route::post('api/friends/remove', [FriendshipController::class, 'removeFriend'])->name('api.friends.remove');
});

require __DIR__.'/settings.php';
