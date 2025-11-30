import React from 'react';
import WalletConnect from '../components/WalletConnect';
import { useWallet } from '../hooks/useWallet';

const Wallet = () => {
  const { wallet, balance, disconnect, loading } = useWallet();

  return (
    <div className="wallet-page">
      <div className="welcome-section">
        <h1 className="welcome-title">Wallet Management</h1>
        <p className="welcome-subtitle">Securely connect and manage your Cardano wallet</p>
      </div>

      <div className="card" style={{ width: '100%' }}>
        <h3 className="section-title">Wallet Connection</h3>

        {!wallet ? (
          <div style={{ padding: '20px 0' }}>
            <WalletConnect />
          </div>
        ) : (
          <div>
            <div className="wallet-info">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '45px', marginBottom: '15px' }}>✅</div>
                <div style={{ fontWeight: '700', marginBottom: '15px', fontSize: '22px', color: 'var(--success)' }}>Wallet Connected</div>
                <div style={{ fontSize: '15px', color: 'var(--text-light)', marginBottom: '15px' }}>
                  Your wallet is successfully connected to the platform
                </div>
              </div>
              <div style={{ fontSize: '15px', color: 'var(--text-dark)', marginBottom: '12px', wordBreak: 'break-all' }}>
                Address: {wallet.address}
              </div>
              <div style={{ fontSize: '16px', color: 'var(--text-dark)', marginTop: '10px', fontWeight: '600' }}>
                Network: <span style={{ color: 'var(--primary)' }}>{wallet.network}</span>
              </div>
              <div className="btn-group">
                <button 
                  className="btn btn-danger" 
                  onClick={disconnect} 
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? 'Disconnecting...' : 'Disconnect Wallet'}
                </button>
              </div>
            </div>

            {balance && (
              <div className="cards-grid">
                <div className="card">
                  <div className="card-label">ADA Balance</div>
                  <div className="card-value">{balance.ada.toFixed(2)}</div>
                  <div className="card-subtitle">Native Cardano Token</div>
                </div>
                <div className="card">
                  <div className="card-label">USDM Balance</div>
                  <div className="card-value">{balance.usdm.toFixed(2)}</div>
                  <div className="card-subtitle">Stablecoin Asset</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--border)' }}>
          <h3 className="section-title">Supported Wallets</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '25px', textAlign: 'center' }}>
            Connect using any of these compatible Cardano wallets
          </p>
          <div className="supported-wallets">
            <div className="wallet-card">
              <div className="wallet-icon">🎒</div>
              <div className="wallet-name">Nami</div>
              <div className="wallet-status-text">Highly Recommended</div>
            </div>
            <div className="wallet-card">
              <div className="wallet-icon">👛</div>
              <div className="wallet-name">Eternl</div>
              <div className="wallet-status-text">Fully Compatible</div>
            </div>
            <div className="wallet-card">
              <div className="wallet-icon">💼</div>
              <div className="wallet-name">Yoroi</div>
              <div className="wallet-status-text">Fully Compatible</div>
            </div>
            <div className="wallet-card">
              <div className="wallet-icon">📱</div>
              <div className="wallet-name">Flint</div>
              <div className="wallet-status-text">Mobile Friendly</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;