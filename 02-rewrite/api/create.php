<?php
 
require_once 'DbConnector.php';
require_once 'api.php';
 
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError(405, 'Method not allowed');
}

$user_id = authenticate();
 
$note = validNote(readJson());
if ($note === null) {
    sendError(400, 'Note not valid (title from 1 to 100 characters, content from 1 to 1000)');
}
 
$dbh = new DbConnector(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$sth = $dbh->prepare('INSERT INTO notes (user_id, title, content) VALUES (:user_id, :title, :content)');
$sth->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$sth->bindParam(':title', $note['title']);
$sth->bindParam(':content', $note['content']);
$sth->execute();
 
sendJson(201, ['success' => true, 'id' => $dbh->lastInsertId()]);
 