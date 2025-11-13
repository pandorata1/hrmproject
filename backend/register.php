<?php
// Simple register endpoint
require_once 'config.php';
require_once 'controllers/AuthController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller = new AuthController($pdo);
    $data = json_decode(file_get_contents("php://input"), true);
    $controller->register($data);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>