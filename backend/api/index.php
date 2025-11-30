<?php
// Main API entry point
header('Content-Type: application/json');
echo json_encode([
    'status' => 'success',
    'message' => 'Cardano Remit API is running',
    'version' => '1.0.0',
    'endpoints' => [
        '/api/wallet.php?action=connect' => 'Connect wallet',
        '/api/wallet.php?action=balance' => 'Get wallet balance',
        '/api/transactions.php' => 'Get all transactions',
        '/api/transactions.php?id=:id' => 'Get transaction by ID',
        '/api/transactions.php' => 'Create new transaction (POST)'
    ]
]);
?>