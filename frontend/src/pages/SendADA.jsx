import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { sendTransaction } from '../services/api';
import Loader from '../components/Loader';

const SendADA = () => {
  const { wallet, balance, loading: walletLoading } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USDM');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const transactionData = {
        recipient,
        amount: parseFloat(amount),
        currency,
        memo
      };

      const response = await sendTransaction(transactionData);
      
      if (response.status === 'success') {
        setSuccess(`Transaction sent successfully! TX Hash: ${response.data.tx_hash}`);
        // Reset form
        setRecipient('');
        setAmount('');
        setMemo('');
      } else {
        setError(response.message || 'Failed to send transaction');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while sending the transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!wallet) {
    return (
      <div className="send-ada">
        <div className="welcome-section">
          <h1 className="welcome-title">Send Remittance</h1>
          <p className="welcome-subtitle">Connect your wallet to send stablecoin remittances</p>
        </div>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>📤</div>
            <h2 style={{ marginBottom: '15px', color: 'var(--primary)' }}>Wallet Required</h2>
            <p style={{ marginBottom: '25px', color: 'var(--text-light)', fontSize: '16px' }}>
              Please connect your Cardano wallet to send transactions
            </p>
          </div>
          <div className="btn-group">
            <button className="btn btn-primary" onClick={() => window.location.hash = '#wallet'} style={{ width: '100%' }}>
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="send-ada">
      <div className="welcome-section">
        <h1 className="welcome-title">Send Remittance</h1>
        <p className="welcome-subtitle">Send stablecoins quickly and securely to any Cardano address</p>
      </div>

      <div className="form-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
        {walletLoading ? (
          <Loader message="Loading wallet data..." />
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '45px', marginBottom: '15px' }}>💸</div>
              <h2 className="form-title">Send Transaction</h2>
              <p className="form-subtitle">Fill in the details below to send your remittance</p>
            </div>
            
            {error && <div className="error-message">⚠️ {error}</div>}
            {success && <div className="success-message">✅ {success}</div>}
            
            <div className="form-group">
              <label className="form-label">Recipient Address</label>
              <input
                type="text"
                className="form-input"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="addr1q987654321..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                required
              />
              {balance && (
                <div style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '8px', textAlign: 'right' }}>
                  Available: {currency === 'USDM' ? balance.usdm.toFixed(2) : balance.ada.toFixed(2)} {currency}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                className="form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USDM">USDM (Cardano Native)</option>
                <option value="ADA">ADA</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Memo/Reference (Optional)</label>
              <textarea
                className="form-textarea"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="e.g., Salary for November"
                rows="3"
              />
            </div>

            <div className="fee-breakdown">
              <div className="fee-row">
                <span className="fee-label">Transaction Fee</span>
                <span className="fee-value">0.17 ADA</span>
              </div>
              <div className="fee-row">
                <span className="fee-label">Service Fee (0.5%)</span>
                <span className="fee-value">
                  {(amount * 0.005 || 0).toFixed(2)} {currency}
                </span>
              </div>
              <div className="fee-total">
                <span>Total Cost</span>
                <span>
                  {(parseFloat(amount) + (amount * 0.005) || 0).toFixed(2)} {currency}
                </span>
              </div>
            </div>

            <div className="btn-group">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading || !recipient || !amount}
                style={{ width: '100%' }}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{width: '18px', height: '18px', marginRight: '8px'}}></span>
                    Sending Transaction...
                  </>
                ) : 'Send Transaction'}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  setRecipient('');
                  setAmount('');
                  setMemo('');
                }}
                style={{ width: '100%' }}
              >
                Clear Form
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SendADA;