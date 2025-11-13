<?php
require_once __DIR__ . '/../models/LeaveModel.php';

class LeaveController {
    private $leaveModel;
    
    public function __construct($pdo) {
        $this->leaveModel = new LeaveModel($pdo);
    }
    
    public function getAllLeaves() {
        try {
            $leaves = $this->leaveModel->getAll();
            http_response_code(200);
            echo json_encode($leaves);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch leave records']);
        }
    }
    
    public function getLeaveByEmployee($employeeId) {
        try {
            $leaves = $this->leaveModel->getByEmployeeId($employeeId);
            http_response_code(200);
            echo json_encode($leaves);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch leave records']);
        }
    }
    
    public function getLeave($id) {
        try {
            $leave = $this->leaveModel->getById($id);
            if ($leave) {
                http_response_code(200);
                echo json_encode($leave);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Leave record not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch leave record']);
        }
    }
    
    public function createLeave($data) {
        try {
            // Validate required fields
            if (empty($data['employee_id']) || empty($data['start_date']) || empty($data['end_date'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Employee ID, start date, and end date are required']);
                return;
            }
            
            $leave = $this->leaveModel->create($data);
            if ($leave) {
                http_response_code(201);
                echo json_encode($leave);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create leave record']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create leave record']);
        }
    }
    
    public function updateLeave($data) {
        try {
            // Validate required fields
            if (empty($data['id']) || empty($data['employee_id']) || empty($data['start_date']) || empty($data['end_date'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID, Employee ID, start date, and end date are required']);
                return;
            }
            
            $leave = $this->leaveModel->update($data);
            if ($leave) {
                http_response_code(200);
                echo json_encode($leave);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update leave record']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update leave record']);
        }
    }
    
    public function deleteLeave($id) {
        try {
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Leave ID is required']);
                return;
            }
            
            $result = $this->leaveModel->delete($id);
            if ($result) {
                http_response_code(200);
                echo json_encode(['message' => 'Leave record deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete leave record']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete leave record']);
        }
    }
    
    public function approveLeave($id) {
        try {
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Leave ID is required']);
                return;
            }
            
            $leave = $this->leaveModel->approve($id);
            if ($leave) {
                http_response_code(200);
                echo json_encode($leave);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to approve leave record']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to approve leave record']);
        }
    }
    
    public function rejectLeave($id) {
        try {
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Leave ID is required']);
                return;
            }
            
            $leave = $this->leaveModel->reject($id);
            if ($leave) {
                http_response_code(200);
                echo json_encode($leave);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to reject leave record']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to reject leave record']);
        }
    }
}
?>