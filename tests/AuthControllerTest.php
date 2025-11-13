<?php

use PHPUnit\Framework\TestCase;

class AuthControllerTest extends TestCase
{
    public function testAuthControllerClassExists()
    {
        // Include required files
        require_once __DIR__ . '/../backend/models/UserModel.php';
        require_once __DIR__ . '/../backend/controllers/AuthController.php';
        
        // Test that the class exists
        $this->assertTrue(class_exists('AuthController'));
    }
}