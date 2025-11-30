import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

const WalletConnect = ({ onConnect }) => {
  const { connect, loading, error } = useWallet();
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('preview');

  const handleConnect = async (e) => {
    e.preventDefault();
    try {
      const walletData = await connect(address, network);
      if (onConnect) onConnect(walletData);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  return (
    <div className="wallet-connect">
      <form onSubmit={handleConnect} style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔗</div>
          <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--primary)', marginBottom: '10px' }}>
            Connect Your Wallet
          </h3>
          <p style={{ color: 'var(--text-light)', fontSize: '15px' }}>
            Enter your Cardano wallet address below
          </p>
        </div>
        
        {error && <div className="error-message">⚠️ {error}</div>}
        
        <div className="form-group">
          <label htmlFor="walletAddress" className="form-label">Wallet Address</label>
          <input
            type="text"
            id="walletAddress"
            className="form-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="addr1q987654321..."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="network" className="form-label">Network</label>
          <select
            id="network"
            className="form-select"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          >
            <option value="preview">Preview Testnet</option>
            <option value="preprod">Pre-Production Testnet</option>
            <option value="mainnet">Mainnet</option>
          </select>
        </div>
        
        <div className="btn-group">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{width: '18px', height: '18px', marginRight: '8px'}}></span>
                Connecting...
              </>
            ) : 'Connect Wallet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WalletConnect;