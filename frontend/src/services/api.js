const API_BASE_URL = 'http://localhost/cardano/backend/api';

export const api = {
  // Transaction endpoints
  getTransactions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  },

  createTransaction: async (transactionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  },

  // Wallet endpoints
  connectWallet: async (walletData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walletData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  },
};