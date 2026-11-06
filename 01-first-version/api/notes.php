<?php
require_once "DbConnector.php";
require_once "functions.php";
require_once "config.php";

header('Content-Type: application/json; charset=utf-8');

$headers = getallheaders();
$auth = ($headers['Authorization'] ?? isset($_SERVER['HTTP_AUTHORIZATION'])) ? $_SERVER['HTTP_AUTHORIZATION'] : null;
if (!$auth) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Token mancante']);
    exit;
}

list(, $token) = explode(' ', $auth, 2);
$userId = validateToken($token, TOKEN_SECRET);
if (!$userId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Token non valido']);
    exit;
}

try {
    $db = new DbConnector(DB_HOST, DB_USER, DB_PASS, 'bacheca');

    $stmt = $db->prepare("
        SELECT 
            n.note_id,
            n.text AS note,
            n.date_notes AS date_note,
            u.username
        FROM notes n
        INNER JOIN users u ON n.note_id = u.user_id
        WHERE u.user_id = n.user_id
        ORDER BY n.date_notes DESC
    ");
    $stmt->execute();

    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'items' => $notes]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Errore DB: ' . $e->getMessage()]);
}
?>