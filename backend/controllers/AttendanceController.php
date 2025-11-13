<?php
require_once __DIR__ . '/../models/AttendanceModel.php';

class AttendanceController {
    private $attendanceModel;
    
    public function __construct($pdo) {
        $this->attendanceModel = new AttendanceModel($pdo);
    }
    
    public function getAllAttendance() {
        try {
            $attendance = $this->attendanceModel->getAll();
            http_response_code(200);
            echo json_encode($attendance);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch attendance records']);
        }
    }
    
    public function getAttendanceByEmployee($employeeId) {
        try {
            $attendance = $this->attendanceModel->getByEmployeeId($employeeId);
            http_response_code(200);
            echo json_encode($attendance);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch attendance records']);
        }
    }
    
    public function createAttendance($data) {
        try {
            // Validate required fields
            if (empty($data['employee_id']) || empty($data['date'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Employee ID and date are required']);
                return;
            }
            
            $attendance = $this->attendanceModel->create($data);
            if ($attendance) {
                http_response_code(201);
                echo json_encode($attendance);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create attendance record']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create attendance record']);
        }
    }
    
    public function updateAttendance($data) {
        try {
            // Validate required fields
            if (empty($data['id']) || empty($data['employee_id']) || empty($data['date'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID, Employee ID and date are required']);
                return;
            }
            
            $attendance = $this->attendanceModel->update($data);
            if ($attendance) {
                http_response_code(200);
                echo json_encode($attendance);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update attendance record']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update attendance record']);
        }
    }
    
    public function deleteAttendance($id) {
        try {
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Attendance ID is required']);
                return;
            }
            
            $result = $this->attendanceModel->delete($id);
            if ($result) {
                http_response_code(200);
                echo json_encode(['message' => 'Attendance record deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete attendance record']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete attendance record']);
        }
    }
    
    public function checkIn($data) {
        try {
            // Validate required fields
            if (empty($data['employee_id']) || empty($data['date']) || empty($data['check_in'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Employee ID, date, and check-in time are required']);
                return;
            }
            
            $attendance = $this->attendanceModel->checkIn($data['employee_id'], $data['date'], $data['check_in']);
            if ($attendance) {
                http_response_code(200);
                echo json_encode($attendance);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to check in']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to check in']);
        }
    }
    
    public function checkOut($data) {
        try {
            // Validate required fields
            if (empty($data['employee_id']) || empty($data['date']) || empty($data['check_out'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Employee ID, date, and check-out time are required']);
                return;
            }
            
            $attendance = $this->attendanceModel->checkOut($data['employee_id'], $data['date'], $data['check_out']);
            if ($attendance) {
                http_response_code(200);
                echo json_encode($attendance);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to check out']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to check out']);
        }
    }
}
?>