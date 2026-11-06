<?php
 
require_once 'DbConnector.php';
require_once 'api.php';
 
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError(405, 'Method not allowed');
}

$user_id = authenticate();
 
$dbh = new DbConnector(DB_HOST, DB_USER, DB_PASS, DB_NAME);

$sth = $dbh->prepare('SELECT username FROM users WHERE id = :id');
$sth->bindParam(':id', $user_id, PDO::PARAM_INT);
$sth->execute();
$me = $sth->fetch(PDO::FETCH_ASSOC);
if (!$me) {
    sendError(401, 'Token not valid or expired');
}

$limit = 10;
$page = array_key_exists('page', $_GET) ? max(1, (int)$_GET['page']) : 1;
$offset = ($page - 1) * $limit;
 
$sth = $dbh->prepare('
    SELECT id, title, content, creation_date
    FROM notes
    WHERE user_id = :user_id AND deletion_date IS NULL
    ORDER BY creation_date DESC, id DESC
    LIMIT :limit OFFSET :offset
');
$sth->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$sth->bindParam(':limit', $limit, PDO::PARAM_INT);
$sth->bindParam(':offset', $offset, PDO::PARAM_INT);
$sth->execute();
$rows = $sth->fetchAll(PDO::FETCH_ASSOC);
 
$results = [];
for ($i = 0; $i < count($rows); $i++) {
    $results[] = [
        'id' => (int)$rows[$i]['id'],
        'title' => $rows[$i]['title'],
        'content' => $rows[$i]['content'],
        'creation_date' => $rows[$i]['creation_date'],
    ];
}

$sth = $dbh->prepare('SELECT COUNT(*) FROM notes WHERE user_id = :user_id AND deletion_date IS NULL');
$sth->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$sth->execute();
$total = (int)$sth->fetchColumn();
 
sendJson(200, [
    'me' => $me['username'],
    'results' => $results,
    'pagination' => [
        'page' => $page,
        'total_pages' => (int)ceil($total / $limit),
        'total' => $total,
    ],
]);
 
