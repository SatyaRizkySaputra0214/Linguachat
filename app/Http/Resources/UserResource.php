<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'preferred_language' => $this->preferred_language,
            'country_code' => $this->country_code,
            'avatar' => $this->avatar,
            'is_active' => $this->is_active,
            'friend_id' => $this->friend_id,
        ];
    }
}
