<?php

namespace App\Concerns;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Return a success JSON response.
     *
     * @param  mixed  $data
     */
    protected function successResponse($data, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'meta' => [
                'status' => 'success',
                'message' => $message,
                'code' => $code,
            ],
            'data' => $data,
        ], $code);
    }

    /**
     * Return an error JSON response.
     *
     * @param  mixed|null  $data
     */
    protected function errorResponse(string $message, int $code = 400, $data = null): JsonResponse
    {
        return response()->json([
            'meta' => [
                'status' => 'error',
                'message' => $message,
                'code' => $code,
            ],
            'data' => $data,
        ], $code);
    }
}
