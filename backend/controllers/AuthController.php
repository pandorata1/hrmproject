<?php
require_once __DIR__ . '/../models/UserModel.php';

class AuthController {
    private $userModel;
    
    public function __construct($pdo) {
        $this->userModel = new UserModel($pdo);
    }
    
    public function login($data) {
        try {
            // Validate required fields
            if (empty($data['username']) || empty($data['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Username and password are required']);
                return;
            }
            
            // Get user by username
            $user = $this->userModel->getByUsername($data['username']);
            if (!$user) {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
                return;
            }
            
            // Validate password
            if ($this->userModel->validatePassword($user, $data['password'])) {
                // Remove password from response
                unset($user['password']);
                
                // In a real application, you would generate a JWT token here
                // For this example, we'll just return the user data
                http_response_code(200);
                echo json_encode([
                    'message' => 'Login successful',
                    'user' => $user
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Login failed']);
        }
    }
    
    public function register($data) {
        try {
            // Validate required fields
            if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Username, email, and password are required']);
                return;
            }
            
            // Check if username already exists
            $existingUser = $this->userModel->getByUsername($data['username']);
            if ($existingUser) {
                http_response_code(400);
                echo json_encode(['error' => 'Username already exists']);
                return;
            }
            
            // Check if email already exists
            $existingEmail = $this->userModel->getByEmail($data['email']);
            if ($existingEmail) {
                http_response_code(400);
                echo json_encode(['error' => 'Email already exists']);
                return;
            }
            
            // Create user
            $user = $this->userModel->create($data);
            if ($user) {
                // Remove password from response
                unset($user['password']);
                
                http_response_code(201);
                echo json_encode([
                    'message' => 'Registration successful',
                    'user' => $user
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to register user']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Registration failed']);
        }
    }
    
    public function logout() {
        // In a real application, you would invalidate the JWT token here
        // For this example, we'll just return a success message
        http_response_code(200);
        echo json_encode(['message' => 'Logout successful']);
    }
}
?>