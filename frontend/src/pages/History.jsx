import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { getTransactions } from '../services/api';
import Loader from '../components/Loader';

const History = () => {
  const { wallet, loading: walletLoading } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    status: 'all'
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      if (wallet) {
        setLoading(true);
        setError(null);
        try {
          const response = await getTransactions();
          if (response.status === 'success') {
            setTransactions(response.data);
          } else {
            setError(response.message || 'Failed to fetch transactions');
          }
        } catch (err) {
          setError(err.message || 'An error occurred while fetching transactions');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [wallet]);

  const filteredTransactions = transactions.filter(tx => {
    if (filter.status !== 'all' && tx.status !== filter.status) return false;
    if (filter.startDate && new Date(tx.created_at) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(tx.created_at) > new Date(filter.endDate)) return false;
    return true;
  });

  if (!wallet) {
    return (
      <div className="history">
        <div className="welcome-section">
          <h1 className="welcome-title">Transaction History</h1>
          <p className="welcome-subtitle">Connect your wallet to view transaction history</p>
        </div>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>📋</div>
            <h2 style={{ marginBottom: '15px', color: 'var(--primary)' }}>History Unavailable</h2>
            <p style={{ marginBottom: '25px', color: 'var(--text-light)', fontSize: '16px' }}>
              Please connect your Cardano wallet to view your transaction history
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
    <div className="history">
      <div className="welcome-section">
        <h1 className="welcome-title">Transaction History</h1>
        <p className="welcome-subtitle">All your remittance transactions on Cardano</p>
      </div>

      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 className="section-title">Filter Transactions</h2>
          <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
            Export CSV
          </button>
        </div>
        <div className="filters">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input 
              type="date" 
              className="form-input" 
              value={filter.startDate}
              onChange={(e) => setFilter({...filter, startDate: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input 
              type="date" 
              className="form-input" 
              value={filter.endDate}
              onChange={(e) => setFilter({...filter, endDate: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              className="form-select"
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
            >
              <option value="all">All</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">&nbsp;</label>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => setFilter({ startDate: '', endDate: '', status: 'all' })}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 className="section-title">Transaction Records</h2>
          <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>
            {filteredTransactions.length} of {transactions.length} transactions
          </div>
        </div>
        
        {loading || walletLoading ? (
          <Loader message="Loading transaction history..." />
        ) : error ? (
          <div className="error-message">⚠️ {error}</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>TX Hash</th>
                  <th>Recipient</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions && filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all', color: 'var(--primary)' }}>
                        {tx.tx_hash ? tx.tx_hash.substring(0, 16) + '...' : 'N/A'}
                      </td>
                      <td style={{ wordBreak: 'break-word', maxWidth: '180px' }}>
                        {tx.recipient_address ? tx.recipient_address.substring(0, 25) + '...' : 'N/A'}
                      </td>
                      <td style={{ fontWeight: '600' }}>
                        {tx.amount} <span style={{ color: 'var(--text-light)', fontSize: '12px' }}>{tx.currency}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${tx.status === 'success' ? 'success' : tx.status === 'pending' ? 'pending' : 'failed'}`}>
                          {tx.status ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-dark)' }}>
                        {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                      <div style={{ fontSize: '50px', marginBottom: '20px' }}>📋</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-dark)' }}>No Transactions Found</div>
                      <div style={{ color: 'var(--text-light)', fontSize: '16px' }}>Your transaction history will appear here</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;