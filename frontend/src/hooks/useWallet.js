import { useState, useEffect } from 'react';
import { connectWalletService, disconnectWallet, getBalance } from '../services/wallet';

export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connect = async (address, network = 'preview') => {
    setLoading(true);
    setError(null);
    try {
      const walletData = await connectWalletService(address, network);
      setWallet(walletData);
      // Set mock balances for demo
      setBalance({
        ada: walletData.balance || 1250.45,
        usdm: walletData.usdm_balance || 5432.10,
        pendingTransfers: 2,
        totalTransfers: 23
      });
      return walletData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setLoading(true);
    try {
      await disconnectWallet();
      setWallet(null);
      setBalance(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = async () => {
    if (wallet && wallet.address) {
      setLoading(true);
      try {
        const balanceData = await getBalance(wallet.address);
        setBalance({
          ada: balanceData.ada_balance || 0,
          usdm: balanceData.usdm_balance || 0,
          pendingTransfers: balanceData.pending_transfers || 0,
          totalTransfers: balanceData.total_transfers || 0
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Update balance periodically
  useEffect(() => {
    if (wallet) {
      updateBalance();
      const interval = setInterval(updateBalance, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [wallet]);

  return {
    wallet,
    balance,
    loading,
    error,
    connect,
    disconnect,
    updateBalance,
  };
};