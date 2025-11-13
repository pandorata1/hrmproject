<?php

require_once __DIR__ . '/../vendor/autoload.php';

class SimpleTest extends PHPUnit\Framework\TestCase
{
    public function testTrueAssertsToTrue()
    {
        $this->assertTrue(true);
    }
}