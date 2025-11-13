<?php
require_once 'config.php';

try {
    // Test the connection by fetching departments
    $stmt = $pdo->query("SELECT * FROM departments LIMIT 5");
    $departments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h2>Database Connection Test</h2>";
    echo "<p>Connection successful!</p>";
    
    echo "<h3>Sample Departments:</h3>";
    echo "<ul>";
    foreach ($departments as $dept) {
        echo "<li>" . htmlspecialchars($dept['name']) . " - " . htmlspecialchars($dept['description']) . "</li>";
    }
    echo "</ul>";
    
} catch (PDOException $e) {
    echo "<h2>Database Connection Test</h2>";
    echo "<p style='color: red;'>Connection failed: " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>