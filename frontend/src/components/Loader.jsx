import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loader" style={{ width: '100%' }}>
      <div className="spinner"></div>
      <p style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        color: 'var(--text-dark)', 
        marginTop: '20px',
        textAlign: 'center'
      }}>
        {message}
      </p>
      <p style={{ 
        fontSize: '14px', 
        color: 'var(--text-light)', 
        marginTop: '8px',
        textAlign: 'center'
      }}>
        Please wait...
      </p>
    </div>
  );
};

export default Loader;