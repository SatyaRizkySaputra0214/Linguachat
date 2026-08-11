<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode Verifikasi Pendaftaran</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f7;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #333333;
            -webkit-text-size-adjust: none;
        }
        .wrapper {
            width: 100%;
            background-color: #f4f4f7;
            padding: 40px 0;
        }
        .container {
            max-width: 540px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
        }
        .header {
            background-color: #EA580C;
            padding: 32px 24px;
            text-align: center;
        }
        .logo-text {
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin: 0;
        }
        .header-subtext {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin-top: 6px;
        }
        .content {
            padding: 36px 32px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin: 0 0 16px 0;
        }
        .message {
            font-size: 15px;
            line-height: 1.6;
            color: #4b5563;
            margin: 0 0 24px 0;
        }
        .otp-container {
            background-color: #FFF7ED;
            border: 2px dashed #EA580C;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin: 28px 0;
        }
        .otp-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 600;
            color: #9A3412;
            margin-bottom: 8px;
        }
        .otp-code {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #EA580C;
            margin: 0;
            user-select: all;
        }
        .expiry-note {
            font-size: 13px;
            color: #ef4444;
            font-weight: 500;
            margin-top: 10px;
        }
        .instructions {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #f3f4f6;
        }
        .footer {
            background-color: #f9fafb;
            padding: 24px 32px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1 class="logo-text">{{ config('app.name', 'LinguaChat') }}</h1>
                <div class="header-subtext">Verifikasi Pendaftaran Akun</div>
            </div>
            <div class="content">
                <p class="greeting">Halo{{ $name ? ', ' . e($name) : '' }}!</p>
                <p class="message">
                    Terima kasih telah mendaftar di <strong>{{ config('app.name', 'LinguaChat') }}</strong>. 
                    Untuk menyelesaikan proses pendaftaran dan mengaktifkan akun Anda, silakan masukkan kode verifikasi One-Time Password (OTP) berikut:
                </p>
                
                <div class="otp-container">
                    <div class="otp-label">Kode Verifikasi OTP Anda</div>
                    <div class="otp-code">{{ $otp }}</div>
                    <div class="expiry-note">⏱️ Kode berlaku selama 10 menit</div>
                </div>

                <div class="instructions">
                    <p style="margin: 0 0 8px 0;"><strong>Catatan Keamanan:</strong></p>
                    <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                        <li>Jangan bagikan kode OTP ini kepada siapa pun.</li>
                        <li>Jika Anda tidak merasa melakukan pendaftaran ini, abaikan email ini. Akun tidak akan dibuat tanpa verifikasi kode ini.</li>
                    </ul>
                </div>
            </div>
            <div class="footer">
                &copy; {{ date('Y') }} {{ config('app.name', 'LinguaChat') }}. Hak cipta dilindungi undang-undang.
            </div>
        </div>
    </div>
</body>
</html>
