<?php
require_once __DIR__ . '/../models/PositionModel.php';

class PositionController {
    private $positionModel;
    
    public function __construct($pdo) {
        $this->positionModel = new PositionModel($pdo);
    }
    
    public function getAllPositions() {
        try {
            $positions = $this->positionModel->getAll();
            http_response_code(200);
            echo json_encode($positions);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch positions']);
        }
    }
    
    public function getPosition($id) {
        try {
            $position = $this->positionModel->getById($id);
            if ($position) {
                http_response_code(200);
                echo json_encode($position);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Position not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch position']);
        }
    }
    
    public function createPosition($data) {
        try {
            // Validate required fields
            if (empty($data['name'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Position name is required']);
                return;
            }
            
            $position = $this->positionModel->create($data);
            if ($position) {
                http_response_code(201);
                echo json_encode($position);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create position']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create position']);
        }
    }
    
    public function updatePosition($data) {
        try {
            // Validate required fields
            if (empty($data['id']) || empty($data['name'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID and position name are required']);
                return;
            }
            
            $position = $this->positionModel->update($data);
            if ($position) {
                http_response_code(200);
                echo json_encode($position);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update position']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update position']);
        }
    }
    
    public function deletePosition($id) {
        try {
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Position ID is required']);
                return;
            }
            
            $result = $this->positionModel->delete($id);
            if ($result) {
                http_response_code(200);
                echo json_encode(['message' => 'Position deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete position']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete position']);
        }
    }
}
?>