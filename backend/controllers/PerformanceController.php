<?php
require_once __DIR__ . '/../models/PerformanceModel.php';

class PerformanceController {
    private $performanceModel;
    
    public function __construct($pdo) {
        $this->performanceModel = new PerformanceModel($pdo);
    }
    
    public function getAllReviews() {
        try {
            $reviews = $this->performanceModel->getAll();
            http_response_code(200);
            echo json_encode($reviews);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch performance reviews']);
        }
    }
    
    public function getReviewByEmployee($employeeId) {
        try {
            $reviews = $this->performanceModel->getByEmployeeId($employeeId);
            http_response_code(200);
            echo json_encode($reviews);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch performance reviews']);
        }
    }
    
    public function getReview($id) {
        try {
            $review = $this->performanceModel->getById($id);
            if ($review) {
                http_response_code(200);
                echo json_encode($review);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Performance review not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch performance review']);
        }
    }
    
    public function createReview($data) {
        try {
            // Validate required fields
            if (empty($data['employee_id']) || empty($data['review_date'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Employee ID and review date are required']);
                return;
            }
            
            $review = $this->performanceModel->create($data);
            if ($review) {
                http_response_code(201);
                echo json_encode($review);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create performance review']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create performance review']);
        }
    }
    
    public function updateReview($data) {
        try {
            // Validate required fields
            if (empty($data['id']) || empty($data['employee_id']) || empty($data['review_date'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID, Employee ID, and review date are required']);
                return;
            }
            
            $review = $this->performanceModel->update($data);
            if ($review) {
                http_response_code(200);
                echo json_encode($review);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update performance review']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update performance review']);
        }
    }
    
    public function deleteReview($id) {
        try {
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Review ID is required']);
                return;
            }
            
            $result = $this->performanceModel->delete($id);
            if ($result) {
                http_response_code(200);
                echo json_encode(['message' => 'Performance review deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete performance review']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete performance review']);
        }
    }
    
    public function getAverageRating($employeeId) {
        try {
            if (empty($employeeId)) {
                http_response_code(400);
                echo json_encode(['error' => 'Employee ID is required']);
                return;
            }
            
            $rating = $this->performanceModel->getAverageRating($employeeId);
            http_response_code(200);
            echo json_encode($rating);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch average rating']);
        }
    }
    
    public function getTopPerformers() {
        try {
            $performers = $this->performanceModel->getTopPerformers();
            http_response_code(200);
            echo json_encode($performers);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch top performers']);
        }
    }
}
?>