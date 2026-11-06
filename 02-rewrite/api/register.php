<?php

require_once 'DbConnector.php';
require_once 'api.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError(405, 'Method not allowed');
}

$post = readJson();

$fields = ['username', 'password', 'password2'];
for ($i = 0; $i < count($fields); $i++) {
    if (!array_key_exists($fields[$i], $post) || !is_string($post[$fields[$i]]) || trim($post[$fields[$i]]) === '') {
        sendError(400, 'Missing or invalid field: ' . $fields[$i]);
    }
}

$username = trim($post['username']);

if (preg_match('/^[A-Za-z0-9_]{3,30}$/', $username) !== 1) {
    sendError(400, 'Username: 3-30 characters, only letters, numbers and _');
}

if (strlen($post['password']) < 8) {
    sendError(400, 'Password must be at least 8 characters long');
}

if ($post['password'] !== $post['password2']) {
    sendError(400, 'Passwords do not match');
}

$dbh = new DbConnector(DB_HOST, DB_USER, DB_PASS, DB_NAME);

$sth = $dbh->prepare('SELECT id FROM users WHERE username = :username');
$sth->bindParam(':username', $username);
$sth->execute();
if ($sth->fetch(PDO::FETCH_ASSOC)) {
    sendError(409, 'Username already in use');
}

$hash = password_hash($post['password'], PASSWORD_DEFAULT);

try {
    $sth = $dbh->prepare('INSERT INTO users (username, password) VALUES (:username, :password)');
    $sth->bindParam(':username', $username);
    $sth->bindParam(':password', $hash);
    $sth->execute();
} catch (PDOException $e) {
    
    if ($e->getCode() === '23000') {
        sendError(409, 'Username already in use');
    }
    throw $e;
}

$tokenManager = new TokenManager();
sendJson(201, [
    'token' => $tokenManager->generateToken($dbh->lastInsertId()),
    'username' => $username,
]);