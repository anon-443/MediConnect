import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import api from '../api/axios';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    let valid = true;
    const e = { name: '', email: '', password: '' };
    if (!form.name.trim() || form.name.trim().length < 2) { e.name = 'Name must be at least 2 characters'; valid = false; }
    if (!form.email) { e.email = 'Email is required'; valid = false; }
    else if (!/\S+@\S+\.\S+/.test(form.email)) { e.email = 'Enter a valid email'; valid = false; }
    if (!form.password) { e.password = 'Password is required'; valid = false; }
    else if (form.password.length < 6) { e.password = 'Password must be at least 6 characters'; valid = false; }
    setErrors(e);
    return valid;
  };

  const handleRegister = async () => {
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/');
    } catch (err: any) {
      setApiError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
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
        <h1 style={{ color: theme.colors.primaryDark, margin: '0 0 6px', textAlign: 'center', fontSize: '22px', fontWeight: '700' }}>Create Account</h1>
        <p style={{ color: theme.colors.textSecondary, textAlign: 'center', fontSize: '13px', margin: '0 0 28px' }}>Join MediConnect today</p>

        {apiError && (
          <div style={{ background: theme.colors.errorBg, border: `1px solid #f5c6c6`, borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: theme.colors.error }}>
            {apiError}
          </div>
        )}

        <label style={{ fontSize: '13px', fontWeight: '500', color: theme.colors.text, display: 'block', marginBottom: '6px' }}>Full Name</label>
        <input type="text" placeholder="Your full name" value={form.name} onChange={set('name')} style={input(!!errors.name)} />
        {errors.name && <p style={{ color: theme.colors.error, fontSize: '12px', margin: '0 0 12px' }}>{errors.name}</p>}

        <label style={{ fontSize: '13px', fontWeight: '500', color: theme.colors.text, display: 'block', marginTop: '14px', marginBottom: '6px' }}>Email address</label>
        <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} style={input(!!errors.email)} />
        {errors.email && <p style={{ color: theme.colors.error, fontSize: '12px', margin: '0 0 12px' }}>{errors.email}</p>}

        <label style={{ fontSize: '13px', fontWeight: '500', color: theme.colors.text, display: 'block', marginTop: '14px', marginBottom: '6px' }}>Password</label>
        <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} style={input(!!errors.password)} />
        {errors.password && <p style={{ color: theme.colors.error, fontSize: '12px', margin: '0 0 12px' }}>{errors.password}</p>}

        <label style={{ fontSize: '13px', fontWeight: '500', color: theme.colors.text, display: 'block', marginTop: '14px', marginBottom: '6px' }}>Role</label>
        <select value={form.role} onChange={set('role')} style={{ ...input(false), marginBottom: '0' }}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <button onClick={handleRegister} disabled={loading} style={{
          width: '100%', padding: '11px', backgroundColor: loading ? '#a5d6b8' : theme.colors.primary,
          color: 'white', border: 'none', borderRadius: '7px', fontSize: '14px', fontWeight: '500',
          cursor: loading ? 'not-allowed' : 'pointer', marginTop: '22px', fontFamily: theme.font,
        }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: theme.colors.textSecondary }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/')} style={{ color: theme.colors.primary, cursor: 'pointer', fontWeight: '500' }}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
