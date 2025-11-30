import React, { useState } from 'react';
import SmartPayAssistant from './components/SmartPayAssistant';
import QRCode from 'qrcode.react';
import './styles/main.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('125.50');

  const handleConnectWallet = () => {
    setWalletAddress('addr1qxyz...123456');
  };

  const handleDisconnect = () => {
    setWalletAddress('');
  };

  const renderView = () => {
    switch(currentView) {
      case 'wallet':
        return (
          <div className="form-container">
            <h2 className="form-title">Wallet Information</h2>
            <p className="form-subtitle">Your connected wallet details</p>
            
            <div className="cards-grid">
              <div className="card">
                <div className="card-label">Wallet Address</div>
                <div className="card-value">
                  {walletAddress || 'Not connected'}
                </div>
                <button 
                  className={`btn ${walletAddress ? 'btn-danger' : 'btn-primary'}`}
                  onClick={walletAddress ? handleDisconnect : handleConnectWallet}
                >
                  {walletAddress ? 'Disconnect Wallet' : 'Connect Wallet'}
                </button>
              </div>
              
              <div className="card">
                <div className="card-label">Balance</div>
                <div className="card-value">{balance} ₳</div>
              </div>
            </div>
          </div>
        );
      
      case 'send':
        return (
          <div className="form-container">
            <h2 className="form-title">Send ADA</h2>
            <p className="form-subtitle">Transfer funds to another wallet</p>
            
            <form className="form">
              <div className="form-group">
                <label htmlFor="recipient">Recipient Address</label>
                <input
                  type="text"
                  id="recipient"
                  name="recipient"
                  placeholder="Enter recipient address"
                  className="form-input"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="amount">Amount (ADA)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    placeholder="0.00"
                    className="form-input"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  className="form-input"
                />
              </div>
              
              <button 
                type="button" 
                className="btn btn-primary"
              >
                Send ADA
              </button>
            </form>
          </div>
        );
      
      case 'qr-payment':
        return (
          <div className="form-container">
            <h2 className="form-title">QR Code Payment</h2>
            <p className="form-subtitle">Generate or scan QR codes for payments</p>
            
            <div className="form-group">
              <label htmlFor="qr-recipient">Recipient Address *</label>
              <input
                type="text"
                id="qr-recipient"
                name="qr-recipient"
                placeholder="Enter recipient address"
                className="form-input"
                value={qrPaymentData.recipient}
                onChange={(e) => setQrPaymentData({...qrPaymentData, recipient: e.target.value})}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="qr-amount">Amount (ADA) *</label>
                <input
                  type="number"
                  id="qr-amount"
                  name="qr-amount"
                  placeholder="0.00"
                  className="form-input"
                  step="0.01"
                  value={qrPaymentData.amount}
                  onChange={(e) => setQrPaymentData({...qrPaymentData, amount: e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="qr-description">Description (Optional)</label>
              <input
                type="text"
                id="qr-description"
                name="qr-description"
                placeholder="Enter description"
                className="form-input"
                value={qrPaymentData.description}
                onChange={(e) => setQrPaymentData({...qrPaymentData, description: e.target.value})}
              />
            </div>
            
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => {
                if (qrPaymentData.recipient && qrPaymentData.amount) {
                  setQrCodeData(`ADA:${qrPaymentData.recipient}:${qrPaymentData.amount}:${qrPaymentData.description || ''}`);
                }
              }}
            >
              Generate QR Code
            </button>
            
            {qrCodeData && (
              <div className="qr-code-section">
                <h3>Payment QR Code</h3>
                <div className="qr-code-container">
                  <QRCode value={qrCodeData} size={200} />
                </div>
                <div className="qr-code-info">
                  <p><strong>Recipient:</strong> {qrPaymentData.recipient}</p>
                  <p><strong>Amount:</strong> {qrPaymentData.amount} ₳</p>
                  {qrPaymentData.description && <p><strong>Description:</strong> {qrPaymentData.description}</p>}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'history':
        return (
          <div className="form-container">
            <h2 className="form-title">Transaction History</h2>
            <p className="form-subtitle">Recent transactions</p>
            
            <div className="table-container">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2023-05-15</td>
                    <td>Received</td>
                    <td className="amount-positive">+50.00 ₳</td>
                    <td><span className="status-badge success">Success</span></td>
                  </tr>
                  <tr>
                    <td>2023-05-10</td>
                    <td>Sent</td>
                    <td className="amount-negative">-25.00 ₳</td>
                    <td><span className="status-badge success">Success</span></td>
                  </tr>
                  <tr>
                    <td>2023-05-05</td>
                    <td>Received</td>
                    <td className="amount-positive">+100.00 ₳</td>
                    <td><span className="status-badge pending">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default: // home view
        return (
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome to H.A.C.K</h1>
            <p className="welcome-text">
              Secure, fast, and decentralized payments on the Cardano blockchain.
            </p>
            
            <div className="analytics-section">
              <h2>Network Analytics</h2>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-value">1,247</div>
                  <div className="analytics-label">Total Transactions</div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-value">28,450.75 ₳</div>
                  <div className="analytics-label">Total Volume</div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-value">856</div>
                  <div className="analytics-label">Active Users</div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-value">22.83 ₳</div>
                  <div className="analytics-label">Avg. Transaction</div>
                </div>
              </div>
            </div>
            
            <div className="chart-section">
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Monthly Transactions</h3>
                </div>
                <div className="chart-wrapper">
                  <div className="chart-y-axis">
                    {[80, 60, 40, 20, 0].map((value, index) => (
                      <div key={index} className="y-axis-label">{value}</div>
                    ))}
                  </div>
                  <div className="chart-content">
                    <div className="chart-grid-lines">
                      {[80, 60, 40, 20].map((value, index) => (
                        <div key={index} className="grid-line"></div>
                      ))}
                    </div>
                    <div className="chart-bars">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, index) => (
                        <div key={index} className="chart-bar">
                          <div 
                            className="bar-fill" 
                            style={{ height: `${(Math.floor(Math.random() * 60) + 20) / 80 * 100}%` }}
                          ></div>
                          <div className="bar-label">{month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Monthly Volume (₳)</h3>
                </div>
                <div className="chart-wrapper">
                  <div className="chart-y-axis">
                    {[25, 20, 15, 10, 5, 0].map((value, index) => (
                      <div key={index} className="y-axis-label">{value}k</div>
                    ))}
                  </div>
                  <div className="chart-content">
                    <div className="chart-grid-lines">
                      {[25, 20, 15, 10, 5].map((value, index) => (
                        <div key={index} className="grid-line"></div>
                      ))}
                    </div>
                    <div className="chart-bars">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, index) => (
                        <div key={index} className="chart-bar">
                          <div 
                            className="bar-fill volume-bar" 
                            style={{ height: `${(Math.floor(Math.random() * 20) + 5) / 25 * 100}%` }}
                          ></div>
                          <div className="bar-label">{month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h3>Secure Payments</h3>
                <p>Blockchain-secured transactions with end-to-end encryption</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Lightning Fast</h3>
                <p>Experience near-instant transactions with minimal fees</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🌐</div>
                <h3>Decentralized</h3>
                <p>No intermediaries, full control of your funds</p>
              </div>
            </div>
            
            {!walletAddress && (
              <div className="cta-section">
                <button className="btn btn-primary" onClick={handleConnectWallet}>
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  // Add state for QR payment data and QR code
  const [qrPaymentData, setQrPaymentData] = useState({
    recipient: '',
    amount: '',
    description: ''
  });
  
  const [qrCodeData, setQrCodeData] = useState('');

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span>H.A.C.K</span>
          </div>
          {walletAddress && (
            <div className="wallet-status">
              <span className="wallet-address">
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </span>
              <span className="wallet-balance">{balance} ₳</span>
            </div>
          )}
        </div>
      </header>

      <nav className="nav">
        <div 
          className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          Home
        </div>
        <div 
          className={`nav-item ${currentView === 'wallet' ? 'active' : ''}`}
          onClick={() => setCurrentView('wallet')}
        >
          Wallet
        </div>
        <div 
          className={`nav-item ${currentView === 'send' ? 'active' : ''}`}
          onClick={() => setCurrentView('send')}
        >
          Send ADA
        </div>
        <div 
          className={`nav-item ${currentView === 'qr-payment' ? 'active' : ''}`}
          onClick={() => setCurrentView('qr-payment')}
        >
          QR Payment
        </div>
        <div 
          className={`nav-item ${currentView === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentView('history')}
        >
          History
        </div>
      </nav>

      <main className="main">
        {renderView()}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2023 H.A.C.K Cardano Wallet. All rights reserved.</p>
        </div>
      </footer>
      
      <SmartPayAssistant />
    </div>
  );
}

export default App;