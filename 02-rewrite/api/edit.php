<?php
 
require_once 'DbConnector.php';
require_once 'api.php';
 
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError(405, 'Method not allowed');
}
 
$user_id = authenticate();
$post = readJson();
 
$note = validNote($post);
if ($note === null) {
    sendError(400, 'Note not valid (title from 1 to 100 characters, content from 1 to 1000)');
}
 
$dbh = new DbConnector(DB_HOST, DB_USER, DB_PASS, DB_NAME);

$note_id = requireOwnNote($dbh, $post, $user_id);
 
$sth = $dbh->prepare('
    UPDATE notes SET title = :title, content = :content
    WHERE id = :id AND user_id = :user_id AND deletion_date IS NULL
');
$sth->bindParam(':title', $note['title']);
$sth->bindParam(':content', $note['content']);
$sth->bindParam(':id', $note_id, PDO::PARAM_INT);
$sth->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$sth->execute();
 
sendJson(200, ['success' => true]);