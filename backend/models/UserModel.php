<?php
class UserModel {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function getByUsername($username) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getByEmail($email) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        // Đảm bảo rằng role luôn có giá trị mặc định
        $role = isset($data['role']) ? $data['role'] : 'user';
        
        $stmt = $this->pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
        $result = $stmt->execute([
            $data['username'],
            $data['email'],
            $hashedPassword,
            $role
        ]);
        
        if ($result) {
            // Lấy ID của bản ghi vừa được chèn
            $userId = $this->pdo->lastInsertId();
            $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }
    
    public function validatePassword($user, $password) {
        return password_verify($password, $user['password']);
    }
}
?>