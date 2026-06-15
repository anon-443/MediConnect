import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    let valid = true;
    const e = { email: '', password: '' };
    if (!email) { e.email = 'Email is required'; valid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { e.email = 'Enter a valid email'; valid = false; }
    if (!password) { e.password = 'Password is required'; valid = false; }
    else if (password.length < 6) { e.password = 'Password must be at least 6 characters'; valid = false; }
    setErrors(e);
    return valid;
  };

  const handleLogin = async () => {
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setApiError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setApiError('Please enter your email address');
      return;
    }
    setResetLoading(true);
    setApiError('');
    try {
      const response = await fetch('http://localhost:8000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setResetSent(true);
      } else {
        setApiError(data.detail || 'Failed to send reset link');
      }
    } catch (err) {
      setApiError('Network error. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const input = (hasErr: boolean) => ({
    width: '100%', padding: '10px 14px', borderRadius: '7px',
    border: hasErr ? `1px solid ${theme.colors.error}` : `1px solid ${theme.colors.primaryBorder}`,
    fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
    fontFamily: theme.font, marginBottom: '4px', color: theme.colors.text,
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 20px rgba(0,0,0,0.07)', width: '100%', maxWidth: '380px' }}>
        <h1 style={{ color: theme.colors.primaryDark, margin: '0 0 6px', textAlign: 'center', fontSize: '22px', fontWeight: '700' }}>MediConnect</h1>
        <p style={{ color: theme.colors.textSecondary, textAlign: 'center', fontSize: '13px', margin: '0 0 28px' }}>Sign in to your account</p>

        {apiError && !showForgotModal && (
          <div style={{ background: theme.colors.errorBg, border: '1px solid #f5c6c6', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: theme.colors.error }}>
            {apiError}
          </div>
        )}

        <label style={{ fontSize: '13px', fontWeight: '500', color: theme.colors.text, display: 'block', marginBottom: '6px' }}>Email address</label>
        <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={input(!!errors.email)} />
        {errors.email && <p style={{ color: theme.colors.error, fontSize: '12px', margin: '0 0 12px' }}>{errors.email}</p>}

        <label style={{ fontSize: '13px', fontWeight: '500', color: theme.colors.text, display: 'block', marginTop: '14px', marginBottom: '6px' }}>Password</label>
        <input type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} style={input(!!errors.password)} />
        {errors.password && <p style={{ color: theme.colors.error, fontSize: '12px', margin: '0 0 12px' }}>{errors.password}</p>}

        <div style={{ textAlign: 'right', marginBottom: '0' }}>
          <button
            onClick={() => setShowForgotModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.primary,
              cursor: 'pointer',
              fontSize: '12px',
              padding: '0',
            }}
          >
            Forgot Password?
          </button>
        </div>

        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%', padding: '11px', backgroundColor: loading ? '#a5d6b8' : theme.colors.primary,
          color: 'white', border: 'none', borderRadius: '7px', fontSize: '14px', fontWeight: '500',
          cursor: loading ? 'not-allowed' : 'pointer', marginTop: '20px', fontFamily: theme.font,
        }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: theme.colors.textSecondary }}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} style={{ color: theme.colors.primary, cursor: 'pointer', fontWeight: '500' }}>Register</span>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            width: '400px',
            maxWidth: '90%',
            position: 'relative',
          }}>
            <h3 style={{ margin: '0 0 8px', color: theme.colors.text }}>Reset Password</h3>
            <p style={{ color: theme.colors.textSecondary, fontSize: '14px', marginBottom: '20px' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {resetSent ? (
              <>
                <div style={{
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  fontSize: '14px',
                }}>
                  ✓ Reset link sent to {forgotEmail}. Check your inbox.
                </div>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setResetSent(false);
                    setForgotEmail('');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: theme.colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid ${theme.colors.primaryBorder}',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    boxSizing: 'border-box',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotEmail('');
                      setApiError('');
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: theme.colors.primary,
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: resetLoading ? 'not-allowed' : 'pointer',
                      opacity: resetLoading ? 0.7 : 1,
                      fontSize: '14px',
                    }}
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </>
            )}
            {apiError && !resetSent && (
              <p style={{ color: theme.colors.error, fontSize: '12px', marginTop: '12px' }}>{apiError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;