// Wallet service functions
import { connectWallet, getWalletBalance } from './api';

export const connectWalletService = async (address, network = 'preview') => {
  try {
    const response = await connectWallet({ address, network });
    if (response.status === 'success') {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to connect wallet');
    }
  } catch (error) {
    console.error('Wallet connection failed:', error);
    throw error;
  }
};

export const getBalance = async (address) => {
  try {
    const response = await getWalletBalance(address);
    if (response.status === 'success') {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to get balance');
    }
  } catch (error) {
    console.error('Failed to get balance:', error);
    throw error;
  }
};

export const disconnectWallet = async () => {
  // Logic to disconnect wallet will be implemented here
  console.log('Disconnecting wallet...');
  return { disconnected: true };
};