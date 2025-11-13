<?php
class EmployeeModel {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM employees");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM employees WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getByEmail($email) {
        $stmt = $this->pdo->prepare("SELECT * FROM employees WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getByEmployeeCode($employeeCode) {
        $stmt = $this->pdo->prepare("SELECT * FROM employees WHERE employee_code = ?");
        $stmt->execute([$employeeCode]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        // Generate employee code if not provided
        if (!isset($data['employee_code']) || empty($data['employee_code'])) {
            $data['employee_code'] = $this->generateEmployeeCode();
        }
        
        $stmt = $this->pdo->prepare("INSERT INTO employees (employee_code, first_name, last_name, email, phone, department_id, position_id, hire_date, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $result = $stmt->execute([
            $data['employee_code'],
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['phone'] ?? null,
            $data['department_id'] ?? null,
            $data['position_id'] ?? null,
            $data['hire_date'] ?? null,
            $data['salary'] ?? null
        ]);
        
        if ($result) {
            return $this->getById($this->pdo->lastInsertId());
        }
        return false;
    }
    
    public function update($data) {
        $stmt = $this->pdo->prepare("UPDATE employees SET first_name = ?, last_name = ?, email = ?, phone = ?, department_id = ?, position_id = ?, hire_date = ?, salary = ? WHERE id = ?");
        $result = $stmt->execute([
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['phone'] ?? null,
            $data['department_id'] ?? null,
            $data['position_id'] ?? null,
            $data['hire_date'] ?? null,
            $data['salary'] ?? null,
            $data['id']
        ]);
        
        if ($result) {
            return $this->getById($data['id']);
        }
        return false;
    }
    
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM employees WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    private function generateEmployeeCode() {
        // Get the latest employee code
        $stmt = $this->pdo->query("SELECT employee_code FROM employees ORDER BY id DESC LIMIT 1");
        $lastEmployee = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($lastEmployee) {
            // Extract the number from the last employee code
            $lastNumber = intval(substr($lastEmployee['employee_code'], 3));
            $newNumber = $lastNumber + 1;
        } else {
            // If no employees exist, start with 1
            $newNumber = 1;
        }
        
        // Format the new employee code with leading zeros
        return 'EMP' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
    }
}
?>