<?php
require_once '../config/database.php';
require_once '../controllers/WalletController.php';

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Create controller instance
$controller = new WalletController($pdo);

// Route based on method
if ($method === 'POST') {
    $action = $_GET['action'] ?? '';
    
    if ($action === 'connect') {
        $controller->connectWallet();
    } elseif ($action === 'balance') {
        $controller->getWalletBalance();
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
?>