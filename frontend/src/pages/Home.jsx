import React from 'react';
import WalletConnect from '../components/WalletConnect';
import SmartPayAssistant from '../components/SmartPayAssistant';
import { useWallet } from '../hooks/useWallet';

const Home = () => {
  const { wallet, balance, disconnect } = useWallet();

  return (
    <div className="home">
      <div className="welcome-section">
        <h1 className="welcome-title">Cardano Remittance Platform</h1>
        <p className="welcome-subtitle">Securely send and receive international payments on the Cardano blockchain</p>
      </div>

      {!wallet ? (
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>🌍</div>
            <h2 style={{ marginBottom: '15px', color: 'var(--primary)' }}>Connect Your Wallet</h2>
            <p style={{ marginBottom: '25px', color: 'var(--text-light)', fontSize: '16px' }}>
              Get started by connecting your Cardano wallet to access the platform
            </p>
          </div>
          <WalletConnect />
        </div>
      ) : (
        <div className="dashboard">
          <div className="wallet-info">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: 'var(--primary)' }}>Connected Wallet</h2>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>
            </div>
            <p style={{ wordBreak: 'break-all', fontSize: '14px', color: 'var(--text-dark)', marginBottom: '15px' }}>
              Address: {wallet.address}
            </p>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
              Network: <span style={{ color: 'var(--primary)' }}>{wallet.network}</span>
            </p>
            <div className="btn-group">
              <button className="btn btn-danger" onClick={disconnect} style={{ width: '100%' }}>
                Disconnect Wallet
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
              <div className="card">
                <div className="card-label">Pending Transfers</div>
                <div className="card-value">{balance.pendingTransfers}</div>
                <div className="card-subtitle">Awaiting Confirmation</div>
              </div>
              <div className="card">
                <div className="card-label">Total Transfers</div>
                <div className="card-value">{balance.totalTransfers}</div>
                <div className="card-subtitle">Lifetime Transactions</div>
              </div>
            </div>
          )}
        </div>
      )}
      <SmartPayAssistant />
    </div>
  );
};

export default Home;