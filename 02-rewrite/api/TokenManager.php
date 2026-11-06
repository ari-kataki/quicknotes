<?php
 
declare(strict_types=1);
 
require_once 'config.php';
class TokenManager

{
    public function generateToken(int $userId): string
    {
        $payload = base64_encode(json_encode([
            'id' => $userId,
            'exp' => time() + TOKEN_TTL,
        ]));
 
        return $payload . '.' . hash_hmac('sha256', $payload, TOKEN_SECRET);
    }
    public function validate(string $token): int|false
    {
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            return false;
        }
 
        [$payload, $signature] = $parts;
 
        
        if (!hash_equals(hash_hmac('sha256', $payload, TOKEN_SECRET), $signature)) {
            return false;
        }
 
        $json = base64_decode($payload, true);
        $data = $json === false ? null : json_decode($json, true);
 
        if (!is_array($data) || !isset($data['id'], $data['exp']) || !is_int($data['id']) || !is_int($data['exp'])) {
            return false;
        }
 
        if ($data['exp'] < time()) {
            return false;
        }
 
        return $data['id'];
    }
}
 