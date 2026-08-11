<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TranslationService
{
    protected string $url;

    protected ?string $apiKey;

    public function __construct()
    {
        $this->url = config('services.libretranslate.url', 'https://libretranslate.com');
        $this->apiKey = config('services.libretranslate.key');
    }

    /**
     * Translate text from source language to target language.
     *
     * @return array{status: string, translated_text: string|null, original_language: string|null, provider_response: array|null}
     */
    public function translate(string $text, ?string $sourceLanguage, string $targetLanguage): array
    {
        // If languages are the same, translation is not needed
        if ($sourceLanguage && $sourceLanguage === $targetLanguage) {
            return [
                'status' => 'not_needed',
                'translated_text' => $text,
                'original_language' => $sourceLanguage,
                'provider_response' => ['info' => 'Source and target languages are identical.'],
            ];
        }

        $source = $sourceLanguage ?: 'auto';

        // 1. Attempt using primary configured LibreTranslate URL
        if ($this->url && $this->url !== 'https://libretranslate.com') {
            $result = $this->tryLibreTranslate($this->url, $text, $source, $targetLanguage, $this->apiKey);
            if ($result['status'] === 'done') {
                return $result;
            }
        }

        // 2. Attempt using public free LibreTranslate mirrors
        $mirrors = [
            'https://translate.argosopentech.com',
            'https://translate.terraprint.co',
            'https://libretranslate.de',
        ];

        foreach ($mirrors as $mirror) {
            $result = $this->tryLibreTranslate($mirror, $text, $source, $targetLanguage, null);
            if ($result['status'] === 'done') {
                return $result;
            }
        }

        // 3. Robust Fallback: Attempt Google Translate Free API (highly reliable, no rate limits for basic usage)
        $result = $this->tryGoogleTranslate($text, $source, $targetLanguage);
        if ($result['status'] === 'done') {
            return $result;
        }

        // 4. Return failed status as per SRS if all translation methods fail
        Log::error('All translation providers failed', [
            'text' => $text,
            'source' => $source,
            'target' => $targetLanguage,
        ]);

        return [
            'status' => 'failed',
            'translated_text' => null,
            'original_language' => $sourceLanguage,
            'provider_response' => [
                'error' => 'All translation services are unavailable.',
                'timestamp' => now()->toIso8601String(),
            ],
        ];
    }

    /**
     * Try to translate using a specific LibreTranslate URL.
     */
    protected function tryLibreTranslate(string $baseUrl, string $text, string $source, string $target, ?string $key): array
    {
        $payload = [
            'q' => $text,
            'source' => $source,
            'target' => $target,
            'format' => 'text',
        ];

        if ($key) {
            $payload['api_key'] = $key;
        }

        try {
            $endpoint = rtrim($baseUrl, '/').'/translate';
            $response = Http::timeout(4)->post($endpoint, $payload);

            if ($response->successful()) {
                $data = $response->json();
                $translatedText = $data['translatedText'] ?? null;
                $detectedLanguage = $data['detectedLanguage']['language'] ?? ($source !== 'auto' ? $source : null);

                if ($translatedText !== null) {
                    return [
                        'status' => 'done',
                        'translated_text' => $translatedText,
                        'original_language' => $detectedLanguage,
                        'provider_response' => [
                            'provider' => 'libretranslate',
                            'base_url' => $baseUrl,
                            'raw' => $data,
                        ],
                    ];
                }
            }
        } catch (\Exception $e) {
            Log::warning("LibreTranslate failed for {$baseUrl}: ".$e->getMessage());
        }

        return ['status' => 'failed'];
    }

    /**
     * Try to translate using Google Translate Free API endpoint.
     */
    protected function tryGoogleTranslate(string $text, string $source, string $target): array
    {
        try {
            $endpoint = 'https://translate.googleapis.com/translate_a/single';
            $response = Http::timeout(4)->get($endpoint, [
                'client' => 'gtx',
                'dt' => 't',
                'sl' => $source,
                'tl' => $target,
                'q' => $text,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data[0][0][0])) {
                    $translatedText = '';
                    foreach ($data[0] as $part) {
                        $translatedText .= $part[0];
                    }
                    $detectedLanguage = $data[2] ?? ($source !== 'auto' ? $source : null);

                    return [
                        'status' => 'done',
                        'translated_text' => $translatedText,
                        'original_language' => $detectedLanguage,
                        'provider_response' => [
                            'provider' => 'google_translate',
                            'raw' => $data,
                        ],
                    ];
                }
            }
        } catch (\Exception $e) {
            Log::warning('Google Translate fallback failed: '.$e->getMessage());
        }

        return ['status' => 'failed'];
    }
}
