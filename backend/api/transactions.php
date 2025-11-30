<?php
require_once '../config/database.php';
require_once '../controllers/TransactionController.php';

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
$controller = new TransactionController($pdo);

// Route based on method and URL parameters
if (isset($_GET['id'])) {
    $id = $_GET['id'];
    if ($method === 'GET') {
        $controller->getTransaction($id);
    } else {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    }
} else {
    if ($method === 'GET') {
        $controller->getAllTransactions();
    } elseif ($method === 'POST') {
        $controller->createTransaction();
    } else {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    }
}
?>