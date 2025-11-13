<?php
class AttendanceModel {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM attendance");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM attendance WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getByEmployeeId($employeeId) {
        $stmt = $this->pdo->prepare("SELECT * FROM attendance WHERE employee_id = ?");
        $stmt->execute([$employeeId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $stmt = $this->pdo->prepare("INSERT INTO attendance (employee_id, date, check_in, check_out, status) VALUES (?, ?, ?, ?, ?)");
        $result = $stmt->execute([
            $data['employee_id'],
            $data['date'],
            $data['check_in'],
            $data['check_out'],
            $data['status'] ?? 'present'
        ]);
        
        if ($result) {
            return $this->getById($this->pdo->lastInsertId());
        }
        return false;
    }
    
    public function update($data) {
        $stmt = $this->pdo->prepare("UPDATE attendance SET employee_id = ?, date = ?, check_in = ?, check_out = ?, status = ? WHERE id = ?");
        $result = $stmt->execute([
            $data['employee_id'],
            $data['date'],
            $data['check_in'],
            $data['check_out'],
            $data['status'] ?? 'present',
            $data['id']
        ]);
        
        if ($result) {
            return $this->getById($data['id']);
        }
        return false;
    }
    
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM attendance WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    public function checkIn($employeeId, $date, $checkInTime) {
        // Check if already checked in today
        $stmt = $this->pdo->prepare("SELECT * FROM attendance WHERE employee_id = ? AND date = ? AND check_out IS NULL");
        $stmt->execute([$employeeId, $date]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($existing) {
            // Already checked in, update check_in time
            $stmt = $this->pdo->prepare("UPDATE attendance SET check_in = ? WHERE id = ?");
            $result = $stmt->execute([$checkInTime, $existing['id']]);
            if ($result) {
                return $this->getById($existing['id']);
            }
        } else {
            // Create new check-in record
            $stmt = $this->pdo->prepare("INSERT INTO attendance (employee_id, date, check_in, status) VALUES (?, ?, ?, 'present')");
            $result = $stmt->execute([$employeeId, $date, $checkInTime]);
            if ($result) {
                return $this->getById($this->pdo->lastInsertId());
            }
        }
        return false;
    }
    
    public function checkOut($employeeId, $date, $checkOutTime) {
        // Find the check-in record for today
        $stmt = $this->pdo->prepare("SELECT * FROM attendance WHERE employee_id = ? AND date = ? AND check_out IS NULL");
        $stmt->execute([$employeeId, $date]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($existing) {
            // Update check_out time
            $stmt = $this->pdo->prepare("UPDATE attendance SET check_out = ? WHERE id = ?");
            $result = $stmt->execute([$checkOutTime, $existing['id']]);
            if ($result) {
                return $this->getById($existing['id']);
            }
        }
        return false;
    }
}
?>