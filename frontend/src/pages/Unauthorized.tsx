import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1 style={{ fontSize: '56px', fontWeight: '700', color: theme.colors.primaryDark, margin: '0 0 8px' }}>403</h1>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.text, margin: '0 0 10px' }}>Access Denied</h2>
        <p style={{ color: theme.colors.textSecondary, fontSize: '14px', margin: '0 0 28px' }}>
          You do not have permission to view this page.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 24px', backgroundColor: theme.colors.primary,
            color: 'white', border: 'none', borderRadius: '7px',
            fontSize: '14px', cursor: 'pointer', fontFamily: theme.font, fontWeight: '500',
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
