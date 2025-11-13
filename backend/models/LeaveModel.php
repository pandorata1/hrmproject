<?php
class LeaveModel {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM leaves");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM leaves WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getByEmployeeId($employeeId) {
        $stmt = $this->pdo->prepare("SELECT * FROM leaves WHERE employee_id = ?");
        $stmt->execute([$employeeId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $stmt = $this->pdo->prepare("INSERT INTO leaves (employee_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?)");
        $result = $stmt->execute([
            $data['employee_id'],
            $data['start_date'],
            $data['end_date'],
            $data['reason'] ?? '',
            $data['status'] ?? 'pending'
        ]);
        
        if ($result) {
            return $this->getById($this->pdo->lastInsertId());
        }
        return false;
    }
    
    public function update($data) {
        $stmt = $this->pdo->prepare("UPDATE leaves SET employee_id = ?, start_date = ?, end_date = ?, reason = ?, status = ? WHERE id = ?");
        $result = $stmt->execute([
            $data['employee_id'],
            $data['start_date'],
            $data['end_date'],
            $data['reason'] ?? '',
            $data['status'] ?? 'pending',
            $data['id']
        ]);
        
        if ($result) {
            return $this->getById($data['id']);
        }
        return false;
    }
    
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM leaves WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    public function approve($id) {
        $stmt = $this->pdo->prepare("UPDATE leaves SET status = 'approved' WHERE id = ?");
        $result = $stmt->execute([$id]);
        
        if ($result) {
            return $this->getById($id);
        }
        return false;
    }
    
    public function reject($id) {
        $stmt = $this->pdo->prepare("UPDATE leaves SET status = 'rejected' WHERE id = ?");
        $result = $stmt->execute([$id]);
        
        if ($result) {
            return $this->getById($id);
        }
        return false;
    }
}
?>