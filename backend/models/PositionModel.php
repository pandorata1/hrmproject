<?php
class PositionModel {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM positions");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM positions WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $stmt = $this->pdo->prepare("INSERT INTO positions (title, description, department_id, salary_base) VALUES (?, ?, ?, ?)");
        $result = $stmt->execute([
            $data['name'],
            $data['description'] ?? null,
            $data['department_id'] ?? null,
            $data['salaryBase'] ?? null
        ]);
        
        if ($result) {
            return $this->getById($this->pdo->lastInsertId());
        }
        return false;
    }
    
    public function update($data) {
        $stmt = $this->pdo->prepare("UPDATE positions SET title = ?, description = ?, department_id = ?, salary_base = ? WHERE id = ?");
        $result = $stmt->execute([
            $data['name'],
            $data['description'] ?? null,
            $data['department_id'] ?? null,
            $data['salaryBase'] ?? null,
            $data['id']
        ]);
        
        if ($result) {
            return $this->getById($data['id']);
        }
        return false;
    }
    
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM positions WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>