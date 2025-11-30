<?php
class Transaction {
    private $pdo;

    public function __construct($database) {
        $this->pdo = $database;
    }

    public function getAllTransactions($limit = 10) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT 
                    p.id, 
                    p.tx_hash, 
                    p.paid_amount as amount, 
                    CASE 
                        WHEN i.user_id = 1 THEN 'Sent' 
                        ELSE 'Received' 
                    END as type,
                    CASE 
                        WHEN i.user_id = 1 THEN 'confirmed' 
                        ELSE 'pending' 
                    END as status,
                    i.description as memo, 
                    i.created_at 
                FROM payments p 
                JOIN invoices i ON p.invoice_id = i.id 
                ORDER BY i.created_at DESC 
                LIMIT :limit
            ");
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            // Return empty array if there's an error (e.g., tables don't exist yet)
            error_log("Error in getAllTransactions: " . $e->getMessage());
            return [];
        }
    }

    public function getTransactionById($id) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT 
                    p.id, 
                    p.tx_hash, 
                    p.paid_amount as amount, 
                    CASE 
                        WHEN i.user_id = 1 THEN 'Sent' 
                        ELSE 'Received' 
                    END as type,
                    CASE 
                        WHEN i.user_id = 1 THEN 'confirmed' 
                        ELSE 'pending' 
                    END as status,
                    i.description as memo, 
                    i.created_at 
                FROM payments p 
                JOIN invoices i ON p.invoice_id = i.id 
                WHERE p.id = :id
            ");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            // Return false if there's an error
            error_log("Error in getTransactionById: " . $e->getMessage());
            return false;
        }
    }

    public function createTransaction($data) {
        try {
            // Start transaction
            $this->pdo->beginTransaction();
            
            // Create user if not exists (simplified)
            $userId = 1; // For demo purposes, we'll use a default user
            
            // Create invoice (this represents a sent transaction for our user)
            $stmt = $this->pdo->prepare("INSERT INTO invoices (user_id, amount, currency, description, status) VALUES (:user_id, :amount, :currency, :description, :status)");
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':amount', $data['amount']);
            $stmt->bindParam(':currency', $data['currency']);
            $stmt->bindParam(':description', $data['memo']);
            $stmt->bindParam(':status', $data['status']);
            $stmt->execute();
            $invoiceId = $this->pdo->lastInsertId();
            
            // Create payment
            $stmt = $this->pdo->prepare("INSERT INTO payments (invoice_id, tx_hash, paid_amount, confirmed) VALUES (:invoice_id, :tx_hash, :paid_amount, :confirmed)");
            $stmt->bindParam(':invoice_id', $invoiceId);
            $stmt->bindParam(':tx_hash', $data['tx_hash']);
            $stmt->bindParam(':paid_amount', $data['amount']);
            $stmt->bindParam(':confirmed', $data['confirmed']);
            $stmt->execute();
            $paymentId = $this->pdo->lastInsertId();
            
            // Commit transaction
            $this->pdo->commit();
            
            return $paymentId;
        } catch (Exception $e) {
            // Rollback transaction
            $this->pdo->rollback();
            error_log("Error in createTransaction: " . $e->getMessage());
            throw $e;
        }
    }

    public function updateTransactionStatus($id, $status) {
        try {
            // Update invoice status based on payment confirmation
            $confirmed = ($status === 'confirmed') ? 1 : 0;
            $invoiceStatus = ($status === 'confirmed') ? 'paid' : 'pending';
            
            $stmt = $this->pdo->prepare("UPDATE payments p JOIN invoices i ON p.invoice_id = i.id SET p.confirmed = :confirmed, i.status = :invoice_status WHERE p.id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':confirmed', $confirmed);
            $stmt->bindParam(':invoice_status', $invoiceStatus);
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Error in updateTransactionStatus: " . $e->getMessage());
            return false;
        }
    }
}
?>