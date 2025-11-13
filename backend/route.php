<?php
// Simple router
require_once 'config.php';

// Get the request URI and method
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Parse the URI
$uri_parts = parse_url($request_uri);
$path = isset($uri_parts['path']) ? trim($uri_parts['path'], '/') : '';

// Extract the last part of the path
$path_parts = explode('/', $path);
$endpoint = end($path_parts);

error_log("Route requested: " . $endpoint);

switch ($endpoint) {
    case 'register':
        if ($request_method === 'POST') {
            require_once 'controllers/AuthController.php';
            $controller = new AuthController($pdo);
            $data = json_decode(file_get_contents("php://input"), true);
            $controller->register($data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case 'login':
        if ($request_method === 'POST') {
            require_once 'controllers/AuthController.php';
            $controller = new AuthController($pdo);
            $data = json_decode(file_get_contents("php://input"), true);
            $controller->login($data);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
}
?>