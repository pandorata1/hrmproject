<?php
class PerformanceModel {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM performance");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM performance WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getByEmployeeId($employeeId) {
        $stmt = $this->pdo->prepare("SELECT * FROM performance WHERE employee_id = ?");
        $stmt->execute([$employeeId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $stmt = $this->pdo->prepare("INSERT INTO performance (employee_id, review_date, reviewer_id, score, comments) VALUES (?, ?, ?, ?, ?)");
        $result = $stmt->execute([
            $data['employee_id'],
            $data['review_date'],
            $data['reviewer_id'] ?? null,
            $data['score'] ?? 0,
            $data['comments'] ?? ''
        ]);
        
        if ($result) {
            return $this->getById($this->pdo->lastInsertId());
        }
        return false;
    }
    
    public function update($data) {
        $stmt = $this->pdo->prepare("UPDATE performance SET employee_id = ?, review_date = ?, reviewer_id = ?, score = ?, comments = ? WHERE id = ?");
        $result = $stmt->execute([
            $data['employee_id'],
            $data['review_date'],
            $data['reviewer_id'] ?? null,
            $data['score'] ?? 0,
            $data['comments'] ?? '',
            $data['id']
        ]);
        
        if ($result) {
            return $this->getById($data['id']);
        }
        return false;
    }
    
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM performance WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    public function getAverageRating($employeeId) {
        $stmt = $this->pdo->prepare("SELECT AVG(score) as average_rating, COUNT(*) as total_reviews FROM performance WHERE employee_id = ?");
        $stmt->execute([$employeeId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getTopPerformers() {
        $stmt = $this->pdo->query("
            SELECT 
                employee_id, 
                AVG(score) as average_rating, 
                COUNT(*) as total_reviews 
            FROM performance 
            GROUP BY employee_id 
            ORDER BY average_rating DESC
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>