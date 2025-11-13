<?php
require_once __DIR__ . '/../models/DepartmentModel.php';

class DepartmentController {
    private $departmentModel;
    
    public function __construct($pdo) {
        $this->departmentModel = new DepartmentModel($pdo);
    }
    
    public function getAllDepartments() {
        try {
            $departments = $this->departmentModel->getAll();
            http_response_code(200);
            echo json_encode($departments);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch departments']);
        }
    }
    
    public function getDepartment($id) {
        try {
            $department = $this->departmentModel->getById($id);
            if ($department) {
                http_response_code(200);
                echo json_encode($department);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Department not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch department']);
        }
    }
    
    public function createDepartment($data) {
        try {
            // Validate required fields
            if (empty($data['name'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Department name is required']);
                return;
            }
            
            $department = $this->departmentModel->create($data);
            if ($department) {
                http_response_code(201);
                echo json_encode($department);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create department']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create department']);
        }
    }
    
    public function updateDepartment($data) {
        try {
            // Validate required fields
            if (empty($data['id']) || empty($data['name'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID and department name are required']);
                return;
            }
            
            $department = $this->departmentModel->update($data);
            if ($department) {
                http_response_code(200);
                echo json_encode($department);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update department']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update department']);
        }
    }
    
    public function deleteDepartment($id) {
        try {
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Department ID is required']);
                return;
            }
            
            $result = $this->departmentModel->delete($id);
            if ($result) {
                http_response_code(200);
                echo json_encode(['message' => 'Department deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete department']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete department']);
        }
    }
}
?>