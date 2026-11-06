<?php
 
require_once 'DbConnector.php';
require_once 'api.php';

const DUMMY_HASH = '$2y$10$TFidg6o3OzLKPI3wq536luj3w4aqYtmFgzGhxriOr1Zoau/TjUMV2';
 
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError(405, 'Method not allowed');
}
 
$post = readJson();
 
if (!array_key_exists('username', $post) || !array_key_exists('password', $post)
    || !is_string($post['username']) || !is_string($post['password'])
    || trim($post['username']) === '' || $post['password'] === '') {
    sendError(400, 'Insert username and password');
}
 
$username = trim($post['username']);
 
$dbh = new DbConnector(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$sth = $dbh->prepare('SELECT id, username, password FROM users WHERE username = :username');
$sth->bindParam(':username', $username);
$sth->execute();
$user = $sth->fetch(PDO::FETCH_ASSOC);
 
$hash = $user ? $user['password'] : DUMMY_HASH;
$passwordOk = password_verify($post['password'], $hash);
 
if (!$user || !$passwordOk) {
    sendError(401, 'Invalid username or password');
}
 
$tokenManager = new TokenManager();
sendJson(200, [
    'token' => $tokenManager->generateToken((int)$user['id']),
    'username' => $user['username'],
]);