<?php
require_once '../config/database.php';
require_once '../models/Wallet.php';

class WalletController {
    private $wallet;

    public function __construct($database) {
        $this->wallet = new Wallet($database);
    }

    public function connectWallet() {
        header('Content-Type: application/json');
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['address'])) {
                echo json_encode(['status' => 'error', 'message' => 'Wallet address is required']);
                return;
            }
            
            // In a real app, you would validate the Cardano address here
            
            $result = $this->wallet->createWallet($input['address'], $input['network'] ?? 'preview');
            
            if ($result) {
                echo json_encode([
                    'status' => 'success', 
                    'data' => [
                        'address' => $input['address'],
                        'network' => $input['network'] ?? 'preview',
                        'balance' => 1250.45, // Mock balance for demo
                        'usdm_balance' => 5432.10 // Mock USDM balance for demo
                    ]
                ]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to connect wallet']);
            }
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function getWalletBalance() {
        header('Content-Type: application/json');
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['address'])) {
                echo json_encode(['status' => 'error', 'message' => 'Wallet address is required']);
                return;
            }
            
            // In a real app, you would fetch the actual balance from the blockchain
            // For demo purposes, we'll return mock data
            echo json_encode([
                'status' => 'success',
                'data' => [
                    'ada_balance' => 1250.45,
                    'usdm_balance' => 5432.10,
                    'pending_transfers' => 2,
                    'total_transfers' => 23
                ]
            ]);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
?>