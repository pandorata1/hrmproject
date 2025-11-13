<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

// Get the request URI and method
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Debug: Log the request URI
error_log("Request URI: " . $request_uri);
error_log("Request Method: " . $request_method);

// Simple routing for PHP built-in server
// Handle multiple cases:
// 1. /hrmass/backend/api.php/endpoint
// 2. /backend/api.php/endpoint
// 3. /hrmass/backend/api.php?endpoint=endpoint
// 4. /backend/api.php?endpoint=endpoint

$path = '';

// Check if there's a path after api.php
if (isset($_SERVER['PATH_INFO'])) {
    $path = trim($_SERVER['PATH_INFO'], '/');
} else {
    // Parse the URI to extract path
    $uri_parts = parse_url($request_uri);
    $query_path = $uri_parts['path'];
    
    // Check if the path contains /hrmass/backend/api.php/
    if (strpos($query_path, '/hrmass/backend/api.php/') === 0) {
        // Extract the part after /hrmass/backend/api.php/
        $path = substr($query_path, strlen('/hrmass/backend/api.php/'));
    } else if (strpos($query_path, '/backend/api.php/') === 0) {
        // Extract the part after /backend/api.php/
        $path = substr($query_path, strlen('/backend/api.php/'));
    } else {
        // Check for query parameters
        if (isset($uri_parts['query'])) {
            parse_str($uri_parts['query'], $query_params);
            if (isset($query_params['endpoint'])) {
                $path = $query_params['endpoint'];
            }
        }
    }
}

// Debug: Log the extracted path
error_log("Extracted path: " . $path);

// Route the request
switch ($path) {
    case 'employees':
        require_once 'controllers/EmployeeController.php';
        $controller = new EmployeeController($pdo);
        
        switch ($request_method) {
            case 'GET':
                if (isset($_GET['id'])) {
                    $controller->getEmployee($_GET['id']);
                } else {
                    $controller->getAllEmployees();
                }
                break;
            case 'POST':
                $data = json_decode(file_get_contents("php://input"), true);
                $controller->createEmployee($data);
                break;
            case 'PUT':
                $data = json_decode(file_get_contents("php://input"), true);
                $controller->updateEmployee($data);
                break;
            case 'DELETE':
                if (isset($_GET['id'])) {
                    $controller->deleteEmployee($_GET['id']);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
        }
        break;
    
    case 'departments':
        require_once 'controllers/DepartmentController.php';
        $controller = new DepartmentController($pdo);
        
        switch ($request_method) {
            case 'GET':
                $controller->getAllDepartments();
                break;
            case 'POST':
                $data = json_decode(file_get_contents("php://input"), true);
                $controller->createDepartment($data);
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case 'positions':
        require_once 'controllers/PositionController.php';
        $controller = new PositionController($pdo);
        
        switch ($request_method) {
            case 'GET':
                $controller->getAllPositions();
                break;
            case 'POST':
                $data = json_decode(file_get_contents("php://input"), true);
                $controller->createPosition($data);
                break;
            case 'PUT':
                $data = json_decode(file_get_contents("php://input"), true);
                $controller->updatePosition($data);
                break;
            case 'DELETE':
                if (isset($_GET['id'])) {
                    $controller->deletePosition($_GET['id']);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Position ID is required']);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
        }
        break;
    
    case 'attendance':
        require_once 'controllers/AttendanceController.php';
        $controller = new AttendanceController($pdo);
        
        switch ($request_method) {
            case 'GET':
                if (isset($_GET['employee_id'])) {
                    $controller->getAttendanceByEmployee($_GET['employee_id']);
                } else {
                    $controller->getAllAttendance();
                }
                break;
            case 'POST':
                $data = json_decode(file_get_contents("php://input"), true);
                if (isset($data['action'])) {
                    if ($data['action'] === 'check_in') {
                        $controller->checkIn($data);
                    } else if ($data['action'] === 'check_out') {
                        $controller->checkOut($data);
                    } else {
                        http_response_code(400);
                        echo json_encode(['error' => 'Invalid action']);
                    }
                } else {
                    $controller->createAttendance($data);
                }
                break;
            case 'PUT':
                $data = json_decode(file_get_contents("php://input"), true);
                $controller->updateAttendance($data);
                break;
            case 'DELETE':
                if (isset($_GET['id'])) {
                    $controller->deleteAttendance($_GET['id']);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
        }
        break;
    
    case 'leaves':
        require_once 'controllers/LeaveController.php';
        $controller = new LeaveController($pdo);
        
        switch ($request_method) {
            case 'GET':
                if (isset($_GET['employee_id'])) {
                    $controller->getLeaveByEmployee($_GET['employee_id']);
                } else if (isset($_GET['id'])) {
                    $controller->getLeave($_GET['id']);
                } else {
                    $controller->getAllLeaves();
                }
                break;
            case 'POST':
                $data = json_decode(file_get_contents("php://input"), true);
                if (isset($data['action'])) {
                    if ($data['action'] === 'approve') {
                        $controller->approveLeave($data['id']);
                    } else if ($data['action'] === 'reject') {
                        $controller->rejectLeave($data['id']);
                    } else {
                        http_response_code(400);
                        echo json_encode(['error' => 'Invalid action']);
                    }
                } else {
                    $controller->createLeave($data);
                }
                break;
            case 'PUT':
                $data = json_decode(file_get_contents("php://input"), true);
                $controller->updateLeave($data);
                break;
            case 'DELETE':
                if (isset($_GET['id'])) {
                    $controller->deleteLeave($_GET['id']);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
        }
        break;
    
    case 'performance':
        require_once 'controllers/PerformanceController.php';
        $controller = new PerformanceController($pdo);
        
        switch ($request_method) {
            case 'GET':
                if (isset($_GET['employee_id'])) {
                    $controller->getReviewByEmployee($_GET['employee_id']);
                } else if (isset($_GET['id'])) {
                    $controller->getReview($_GET['id']);
                } else if (isset($_GET['action']) && $_GET['action'] === 'top') {
                    $controller->getTopPerformers();
                } else if (isset($_GET['action']) && $_GET['action'] === 'average' && isset($_GET['employee_id'])) {
                    $controller->getAverageRating($_GET['employee_id']);
                } else {
                    $controller->getAllReviews();
                }
                break;
            case 'POST':
                $data = json_decode(file_get_contents("php://input"), true);
                $controller->createReview($data);
                break;
            case 'PUT':
                $data = json_decode(file_get_contents("php://input"), true);
                $controller->updateReview($data);
                break;
            case 'DELETE':
                if (isset($_GET['id'])) {
                    $controller->deleteReview($_GET['id']);
                }
                break;
            default:
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
    
    default:
        // Debug: Log when no route matches
        error_log("No route matched for path: " . $path);
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found: ' . $path]);
}
?>