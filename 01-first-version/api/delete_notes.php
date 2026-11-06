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

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$noteId = $data['note_id'] ?? null;

if (!$noteId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'ID della nota mancante']);
    exit;
}

try {
    $db = new DbConnector(DB_HOST, DB_USER, DB_PASS, 'QuickNotes');

    $stmt = $db->prepare("
        DELETE FROM notes
        WHERE note_id = :note_Id AND user_id = :user_Id
    ");

    $stmt->bindParam(':noteId', $noteId, PDO::PARAM_INT);
    $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $rowsAffected = $stmt->rowCount();

    if ($rowsAffected > 0) {
        echo json_encode(['success' => true, 'message' => 'Nota cancellata con successo']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Nota non trovata o non autorizzato a cancellarla']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Errore DB: ' . $e->getMessage()]);
}
