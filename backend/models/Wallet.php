<?php
class Wallet {
    private $pdo;

    public function __construct($database) {
        $this->pdo = $database;
    }

    public function getWalletByAddress($address) {
        $stmt = $this->pdo->prepare("SELECT * FROM wallets WHERE address = :address");
        $stmt->bindParam(':address', $address);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createWallet($address, $network = 'preview') {
        $stmt = $this->pdo->prepare("INSERT INTO wallets (address, network, created_at) VALUES (:address, :network, NOW())");
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':network', $network);
        return $stmt->execute();
    }

    public function updateWalletBalance($address, $balance) {
        $stmt = $this->pdo->prepare("UPDATE wallets SET balance = :balance WHERE address = :address");
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':balance', $balance);
        return $stmt->execute();
    }
}
?>