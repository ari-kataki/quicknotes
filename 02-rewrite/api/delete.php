<?php
 
require_once 'DbConnector.php';
require_once 'api.php';
 
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError(405, 'Method not allowed');
}
 
$user_id = authenticate();
 
$dbh = new DbConnector(DB_HOST, DB_USER, DB_PASS, DB_NAME);

$note_id = requireOwnNote($dbh, readJson(), $user_id);

$sth = $dbh->prepare('
    UPDATE notes SET deletion_date = CURRENT_TIMESTAMP
    WHERE id = :id AND user_id = :user_id AND deletion_date IS NULL
');
$sth->bindParam(':id', $note_id, PDO::PARAM_INT);
$sth->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$sth->execute();
 
sendJson(200, ['success' => true]);
 