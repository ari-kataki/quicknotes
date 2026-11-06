<?php

declare(strict_types=1);

class DbConnector
{
    private PDO $connection;

    public function __construct(string $servername, string $username, string $password, string $dbname)
    {
        try {
            $this->connection = new PDO(
                "mysql:host={$servername};dbname={$dbname};charset=utf8mb4",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            error_log('DB connection failed: ' . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            exit(json_encode(['error' => 'Errore del server', 'code' => 500]));
        }
    }

    public function prepare(string $query): PDOStatement
    {
        return $this->connection->prepare($query);
    }

    public function lastInsertId(): int
    {
        return (int)$this->connection->lastInsertId();
    }
}