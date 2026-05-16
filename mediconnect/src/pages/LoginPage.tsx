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

  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    let valid = true;
    const e = { email: '', password: '' };

    if (!email) {
      e.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = 'Enter a valid email';
      valid = false;
    }

    if (!password) {
      e.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters';
      valid = false;
    }

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

  const inputStyle = (hasErr: boolean) => ({
    width: '100%',
    padding: '10px 14px',
    borderRadius: '7px',
    border: hasErr ? `1px solid ${theme.colors.error}` : `1px solid ${theme.colors.primaryBorder}`,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: theme.font,
    marginBottom: '4px',
    color: theme.colors.text,
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
        width: '100%',
        maxWidth: '380px'
      }}>

        <h1 style={{
          color: theme.colors.primaryDark,
          margin: '0 0 6px',
          textAlign: 'center',
          fontSize: '22px',
          fontWeight: '700'
        }}>
          MediConnect
        </h1>

        <p style={{
          color: theme.colors.textSecondary,
          textAlign: 'center',
          fontSize: '13px',
          margin: '0 0 28px'
        }}>
          Sign in to your account
        </p>

        {/* ERROR BOX */}
        {apiError && (
          <div style={{
            background: theme.colors.errorBg,
            border: `1px solid #f5c6c6`,
            borderRadius: '6px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '13px',
            color: theme.colors.error
          }}>
            {apiError}
          </div>
        )}

        {/* EMAIL */}
        <label style={{
          fontSize: '13px',
          fontWeight: '500',
          color: theme.colors.text,
          display: 'block',
          marginBottom: '6px'
        }}>
          Email address
        </label>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle(!!errors.email)}
        />

        {errors.email && (
          <p style={{ color: theme.colors.error, fontSize: '12px', margin: '0 0 12px' }}>
            {errors.email}
          </p>
        )}

        {/* PASSWORD */}
        <label style={{
          fontSize: '13px',
          fontWeight: '500',
          color: theme.colors.text,
          display: 'block',
          marginTop: '14px',
          marginBottom: '6px'
        }}>
          Password
        </label>

        <input
          type="password"
          placeholder="Min. 6 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle(!!errors.password)}
        />

        {errors.password && (
          <p style={{ color: theme.colors.error, fontSize: '12px', margin: '0 0 12px' }}>
            {errors.password}
          </p>
        )}

        {/*  FORGOT PASSWORD LINK (FIXED) */}
        <div style={{ textAlign: 'right', marginTop: '6px' }}>
          <span
            onClick={() => navigate('/forgot-password')}
            style={{
              fontSize: '12px',
              color: theme.colors.primary,
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Forgot Password?
          </span>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '11px',
            backgroundColor: loading ? '#a5d6b8' : theme.colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '7px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '20px',
            fontFamily: theme.font,
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* REGISTER LINK */}
        <p style={{
          textAlign: 'center',
          marginTop: '18px',
          fontSize: '13px',
          color: theme.colors.textSecondary
        }}>
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{
              color: theme.colors.primary,
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;