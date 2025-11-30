<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'cardano_dapp');

header('Content-Type: text/plain');

try {
    // Connect to MySQL without specifying a database
    $pdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
    echo "Database '" . DB_NAME . "' created or already exists.\n";
    
    // Connect to the specific database
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create tables
    $sql = file_get_contents('schema.sql');
    $pdo->exec($sql);
    echo "Tables created successfully.\n";
    
    // Insert a default user for testing
    $stmt = $pdo->prepare("INSERT IGNORE INTO users (id, name, email, wallet_address) VALUES (1, 'Test User', 'test@example.com', 'addr1qxyz1234567890')");
    $stmt->execute();
    echo "Default user created.\n";
    
    echo "Database initialization completed successfully!\n";
    
} catch(PDOException $e) {
    echo "Database initialization failed: " . $e->getMessage() . "\n";
}
?>