<?php
require_once '../config/database.php';
require_once '../models/Transaction.php';

class TransactionController {
    private $transaction;

    public function __construct($database) {
        $this->transaction = new Transaction($database);
    }

    public function getAllTransactions() {
        header('Content-Type: application/json');
        try {
            $transactions = $this->transaction->getAllTransactions(20);
            // Transform the data to match the frontend expectations
            $formattedTransactions = array_map(function($tx) {
                return [
                    'id' => $tx['id'] ?? 0,
                    'date' => $tx['created_at'] ?? date('Y-m-d H:i:s'),
                    'type' => $tx['type'] ?? 'Unknown',
                    'amount' => $tx['amount'] ?? 0,
                    'status' => $tx['status'] ?? 'pending'
                ];
            }, $transactions);
            echo json_encode(['status' => 'success', 'data' => $formattedTransactions]);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to retrieve transactions: ' . $e->getMessage()]);
        }
    }

    public function getTransaction($id) {
        header('Content-Type: application/json');
        try {
            $transaction = $this->transaction->getTransactionById($id);
            if ($transaction) {
                $formattedTransaction = [
                    'id' => $transaction['id'] ?? 0,
                    'date' => $transaction['created_at'] ?? date('Y-m-d H:i:s'),
                    'type' => $transaction['type'] ?? 'Unknown',
                    'amount' => $transaction['amount'] ?? 0,
                    'status' => $transaction['status'] ?? 'pending'
                ];
                echo json_encode(['status' => 'success', 'data' => $formattedTransaction]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Transaction not found']);
            }
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to retrieve transaction: ' . $e->getMessage()]);
        }
    }

    public function createTransaction() {
        header('Content-Type: application/json');
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validate input
            if (!isset($input['recipient']) || !isset($input['amount']) || !isset($input['currency'])) {
                echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
                return;
            }
            
            // Generate a fake transaction hash for demo purposes
            $txHash = 'tx_' . bin2hex(random_bytes(16));
            
            $data = [
                'recipient' => $input['recipient'],
                'amount' => $input['amount'],
                'currency' => $input['currency'],
                'memo' => $input['memo'] ?? '',
                'status' => 'confirmed', // Mark as confirmed for demo
                'tx_hash' => $txHash,
                'confirmed' => 1 // 1 for confirmed
            ];
            
            $result = $this->transaction->createTransaction($data);
            
            if ($result) {
                echo json_encode(['status' => 'success', 'data' => ['tx_hash' => $txHash]]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to create transaction']);
            }
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to create transaction: ' . $e->getMessage()]);
        }
    }
}
?>