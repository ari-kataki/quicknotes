<?php 

require_once 'DbConnector.php';
require_once 'config.php';
require_once 'TokenManager.php';

header('Content-Type: application/json charset=utf-8');

function sendJson(int $status, array $data): void
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function sendError(int $status, string $message): void
{
    sendJson($status, ['error' => $message, 'code' => $status]);
}

function readJson(): array
{
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

function getBearerToken(): ?string
{
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
 
    if ($auth === null && function_exists('getallheaders')) {
        $headers = array_change_key_case(getallheaders(), CASE_LOWER);
        $auth = $headers['authorization'] ?? null;
    }
 
    if ($auth === null || preg_match('/^Bearer\s+(\S+)$/i', $auth, $matches) !== 1) {
        return null;
    }
 
    return $matches[1];
}

function authenticate(): int
{
    $token = getBearerToken();
    $tokenManager = new TokenManager();
    $user_id = $token === null ? false : $tokenManager->validate($token);
 
    if ($user_id === false) {
        sendError(401, 'Token not valid or expired');
    }
 
    return $user_id;
}

function requireOwnNote(DbConnector $dbh, array $post, int $user_id): int
{
    $note_id = array_key_exists('note_id', $post) ? filter_var($post['note_id'], FILTER_VALIDATE_INT) : false;
    if ($note_id === false) {
        sendError(400, 'Note not valid');
    }
 
    $sth = $dbh->prepare('SELECT user_id FROM notes WHERE id = :id AND deletion_date IS NULL');
    $sth->bindParam(':id', $note_id, PDO::PARAM_INT);
    $sth->execute();
    $found = $sth->fetch(PDO::FETCH_ASSOC);
 
    if (!$found) {
        sendError(404, 'Note not found');
    }
 
    if ((int)$found['user_id'] !== $user_id) {
        sendError(403, 'This note is not yours');
    }
 
    return $note_id;
}
 
function validNote(array $post): ?array
{
    if (!array_key_exists('title', $post) || !is_string($post['title'])
        || !array_key_exists('content', $post) || !is_string($post['content'])) {
        return null;
    }
 
    $title = trim($post['title']);
    $content = trim($post['content']);
    if ($title === '' || mb_strlen($title) > 100 || $content === '' || mb_strlen($content) > 1000) {
        return null;
    }
 
    return ['title' => $title, 'content' => $content];
}