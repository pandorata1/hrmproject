<?php
// Database configuration
$host = 'localhost';
$db_name = 'hrm_db';
$username = 'root';
$password = '';

try {
    // Create connection
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name`");
    echo "Database created successfully\n";
    
    // Select database
    $pdo->exec("USE `$db_name`");
    
    // Create employees table
    $pdo->exec("CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_code VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        department_id INT,
        position_id INT,
        salary DECIMAL(10, 2),
        bonus DECIMAL(10, 2) DEFAULT 0,
        deduction DECIMAL(10, 2) DEFAULT 0,
        hire_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    echo "Employees table created successfully\n";
    
    // Add missing columns to existing employees table
    try {
        $pdo->exec("ALTER TABLE employees ADD COLUMN employee_code VARCHAR(20) UNIQUE NOT NULL");
        echo "employee_code column added to employees table\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') === false) {
            throw $e;
        } else {
            echo "employee_code column already exists in employees table\n";
        }
    }
    
    try {
        $pdo->exec("ALTER TABLE employees ADD COLUMN first_name VARCHAR(50) NOT NULL");
        echo "first_name column added to employees table\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') === false) {
            throw $e;
        } else {
            echo "first_name column already exists in employees table\n";
        }
    }
    
    try {
        $pdo->exec("ALTER TABLE employees ADD COLUMN last_name VARCHAR(50) NOT NULL");
        echo "last_name column added to employees table\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') === false) {
            throw $e;
        } else {
            echo "last_name column already exists in employees table\n";
        }
    }
    
    try {
        $pdo->exec("ALTER TABLE employees ADD COLUMN address TEXT");
        echo "address column added to employees table\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') === false) {
            throw $e;
        } else {
            echo "address column already exists in employees table\n";
        }
    }
    
    try {
        $pdo->exec("ALTER TABLE employees ADD COLUMN bonus DECIMAL(10, 2) DEFAULT 0");
        echo "bonus column added to employees table\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') === false) {
            throw $e;
        } else {
            echo "bonus column already exists in employees table\n";
        }
    }
    
    try {
        $pdo->exec("ALTER TABLE employees ADD COLUMN deduction DECIMAL(10, 2) DEFAULT 0");
        echo "deduction column added to employees table\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') === false) {
            throw $e;
        } else {
            echo "deduction column already exists in employees table\n";
        }
    }
    
    try {
        $pdo->exec("ALTER TABLE employees ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
        echo "updated_at column added to employees table\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') === false) {
            throw $e;
        } else {
            echo "updated_at column already exists in employees table\n";
        }
    }
    
    // Add unique constraint to email column
    try {
        $pdo->exec("ALTER TABLE employees ADD UNIQUE(email)");
        echo "Unique constraint added to email column\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate entry') === false && strpos($e->getMessage(), 'Duplicate column name') === false) {
            throw $e;
        } else {
            echo "Unique constraint already exists on email column\n";
        }
    }
    
    // Remove old 'name' column if it exists
    try {
        $pdo->exec("ALTER TABLE employees DROP COLUMN name");
        echo "Old 'name' column removed from employees table\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Unknown column') === false) {
            throw $e;
        } else {
            echo "Old 'name' column does not exist in employees table\n";
        }
    }
    
    // Create departments table
    $pdo->exec("CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Departments table created successfully\n";
    
    // Create positions table
    $pdo->exec("CREATE TABLE IF NOT EXISTS positions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Positions table created successfully\n";
    
    // Create users table for authentication
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Users table created successfully\n";
    
    // Add role column if it doesn't exist (for existing databases)
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN role ENUM('admin', 'user') DEFAULT 'user'");
        echo "Role column added to users table\n";
    } catch (PDOException $e) {
        // Column might already exist, ignore the error
        if (strpos($e->getMessage(), 'Duplicate column name') === false) {
            throw $e;
        } else {
            echo "Role column already exists in users table\n";
        }
    }
    
    // Create attendance table
    $pdo->exec("CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        date DATE NOT NULL,
        check_in TIME,
        check_out TIME,
        status ENUM('present', 'absent', 'late') DEFAULT 'present',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Attendance table created successfully\n";
    
    // Create leave table
    $pdo->exec("CREATE TABLE IF NOT EXISTS leaves (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Leaves table created successfully\n";
    
    // Create performance table
    $pdo->exec("CREATE TABLE IF NOT EXISTS performance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        review_date DATE NOT NULL,
        reviewer_id INT,
        score DECIMAL(3, 2),
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Performance table created successfully\n";
    
    // Insert sample departments (using INSERT IGNORE to avoid duplicates)
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM departments WHERE id = ?");
    
    $stmt = $pdo->prepare("INSERT IGNORE INTO departments (id, name, description) VALUES (?, ?, ?)");
    $checkStmt->execute([1]);
    if ($checkStmt->fetchColumn() == 0) {
        $stmt->execute([1, 'Human Resources', 'Handles employee relations, recruitment, and HR policies']);
    }
    
    $checkStmt->execute([2]);
    if ($checkStmt->fetchColumn() == 0) {
        $stmt->execute([2, 'Engineering', 'Responsible for product development and technical solutions']);
    }
    
    $checkStmt->execute([3]);
    if ($checkStmt->fetchColumn() == 0) {
        $stmt->execute([3, 'Marketing', 'Manages brand promotion, advertising, and customer engagement']);
    }
    
    $checkStmt->execute([4]);
    if ($checkStmt->fetchColumn() == 0) {
        $stmt->execute([4, 'Sales', 'Focuses on revenue generation and customer acquisition']);
    }
    
    $checkStmt->execute([5]);
    if ($checkStmt->fetchColumn() == 0) {
        $stmt->execute([5, 'Finance', 'Manages company finances, accounting, and budgeting']);
    }
    echo "Sample departments inserted\n";
    
    // Insert sample positions (using INSERT IGNORE to avoid duplicates)
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM positions WHERE id = ?");
    
    $stmt = $pdo->prepare("INSERT IGNORE INTO positions (id, name, description) VALUES (?, ?, ?)");
    $checkStmt->execute([1]);
    if ($checkStmt->fetchColumn() == 0) {
        $stmt->execute([1, 'Software Engineer', 'Develops and maintains software applications']);
    }
    
    $checkStmt->execute([2]);
    if ($checkStmt->fetchColumn() == 0) {
        $stmt->execute([2, 'HR Manager', 'Manages human resources and employee relations']);
    }
    
    $checkStmt->execute([3]);
    if ($checkStmt->fetchColumn() == 0) {
        $stmt->execute([3, 'Marketing Specialist', 'Creates and executes marketing campaigns']);
    }
    
    $checkStmt->execute([4]);
    if ($checkStmt->fetchColumn() == 0) {
        $stmt->execute([4, 'Sales Representative', 'Sells products and services to customers']);
    }
    
    $checkStmt->execute([5]);
    if ($checkStmt->fetchColumn() == 0) {
        $stmt->execute([5, 'Financial Analyst', 'Analyzes financial data and prepares reports']);
    }
    echo "Sample positions inserted\n";
    
    // Insert sample admin user (using INSERT IGNORE to avoid duplicates)
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE id = ?");
    $checkStmt->execute([1]);
    
    if ($checkStmt->fetchColumn() == 0) {
        $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT IGNORE INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([1, 'admin', 'admin@example.com', $hashedPassword, 'admin']);
        echo "Sample admin user inserted\n";
    } else {
        echo "Admin user already exists\n";
    }
    
    echo "Database initialization completed successfully!\n";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>