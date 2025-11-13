<?php
require_once __DIR__ . '/../models/EmployeeModel.php';

class EmployeeController {
    private $employeeModel;
    
    public function __construct($pdo) {
        $this->employeeModel = new EmployeeModel($pdo);
    }
    
    public function getAllEmployees() {
        try {
            $employees = $this->employeeModel->getAll();
            http_response_code(200);
            echo json_encode($employees);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch employees']);
        }
    }
    
    public function getEmployee($id) {
        try {
            $employee = $this->employeeModel->getById($id);
            if ($employee) {
                http_response_code(200);
                echo json_encode($employee);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Employee not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch employee']);
        }
    }
    
    public function createEmployee($data) {
        try {
            // Validate required fields
            if (empty($data['first_name']) || empty($data['last_name']) || empty($data['email'])) {
                http_response_code(400);
                echo json_encode(['error' => 'First name, last name, and email are required']);
                return;
            }
            
            // Check if employee with this email already exists
            $existingEmployee = $this->employeeModel->getByEmail($data['email']);
            if ($existingEmployee) {
                http_response_code(400);
                echo json_encode(['error' => 'Employee with this email already exists']);
                return;
            }
            
            $employee = $this->employeeModel->create($data);
            if ($employee) {
                http_response_code(201);
                echo json_encode($employee);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create employee']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create employee']);
        }
    }
    
    public function updateEmployee($data) {
        try {
            // Validate required fields
            if (empty($data['id']) || empty($data['first_name']) || empty($data['last_name']) || empty($data['email'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID, first name, last name, and email are required']);
                return;
            }
            
            $employee = $this->employeeModel->update($data);
            if ($employee) {
                http_response_code(200);
                echo json_encode($employee);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update employee']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update employee']);
        }
    }
    
    public function deleteEmployee($id) {
        try {
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Employee ID is required']);
                return;
            }
            
            $result = $this->employeeModel->delete($id);
            if ($result) {
                http_response_code(200);
                echo json_encode(['message' => 'Employee deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete employee']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete employee']);
        }
    }
}
?>