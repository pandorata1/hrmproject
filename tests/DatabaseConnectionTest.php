<?php

use PHPUnit\Framework\TestCase;

class DatabaseConnectionTest extends TestCase
{
    private $pdo;
    
    protected function setUp(): void
    {
        // Create a new PDO connection for testing
        $this->pdo = new PDO("mysql:host=localhost;dbname=hrm_db", "root", "");
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    
    public function testDatabaseConnection()
    {
        // Test that we can connect to the database
        $this->assertInstanceOf(PDO::class, $this->pdo);
        
        // Test a simple query
        $stmt = $this->pdo->query("SELECT 1 as test");
        $result = $stmt->fetch();
        
        $this->assertEquals(1, $result['test']);
    }
    
    public function testUsersTableExists()
    {
        $stmt = $this->pdo->prepare("SHOW TABLES LIKE 'users'");
        $stmt->execute();
        $result = $stmt->fetchAll();
        
        $this->assertNotEmpty($result, "Users table should exist");
    }
}