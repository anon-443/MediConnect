import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { theme } from '../styles/theme';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: '', dob: '', bloodGroup: '', address: '' });
  const [errors, setErrors] = useState({ name: '', phone: '' });
  const [saved, setSaved] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    let valid = true;
    const e = { name: '', phone: '' };
    if (!form.name.trim() || form.name.trim().length < 2) { e.name = 'Name must be at least 2 characters'; valid = false; }
    if (form.phone && !/^[0-9+\-\s]{7,15}$/.test(form.phone)) { e.phone = 'Enter a valid phone number'; valid = false; }
    setErrors(e);
    return valid;
  };

  const handleSave = () => {
    if (!validate()) return;
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div style={{ paddingBottom: '16px', marginBottom: '16px', borderBottom: `1px solid ${theme.colors.border}` }}>
      <p style={{ fontSize: '11px', fontWeight: '600', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: '14px', color: theme.colors.text, margin: 0, fontWeight: '400' }}>{value || 'Not provided'}</p>
    </div>
  );

  const inputStyle = (hasErr: boolean) => ({
    width: '100%', padding: '9px 12px', borderRadius: '7px',
    border: hasErr ? '1px solid #ef4444' : `1px solid ${theme.colors.primaryBorder}`,
    fontSize: '13px', outline: 'none', fontFamily: theme.font,
    color: theme.colors.text, boxSizing: 'border-box' as const, backgroundColor: 'white',
    marginBottom: '4px',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: theme.font, backgroundColor: theme.colors.background }}>
      <SideNav activeTab="profile" setActiveTab={(tab) => {
        if (tab === 'dashboard') navigate('/dashboard');
        if (tab === 'diseases') navigate('/diseases');
        if (tab === 'hospitals') navigate('/hospitals');
        if (tab === 'doctors') navigate('/doctors');
        if (tab === 'appointments') navigate('/appointments');
      }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav />
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: theme.colors.text, margin: '0 0 4px', fontSize: '19px', fontWeight: '600' }}>Profile</h2>
            <p style={{ color: theme.colors.textSecondary, fontSize: '13px', margin: 0 }}>Manage your account information</p>
          </div>

          {saved && (
            <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#15803d', fontWeight: '500' }}>
              Profile updated successfully.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px', maxWidth: '860px' }}>

            {/* Avatar card */}
            <div style={{ backgroundColor: 'white', borderRadius: theme.borderRadius, border: `1px solid ${theme.colors.border}`, boxShadow: theme.colors.cardShadow, padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: theme.colors.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '700', marginBottom: '14px' }}>
                {(user?.name || user?.email || 'U')[0].toUpperCase()}
              </div>
              <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: theme.colors.text }}>{user?.name || 'User'}</p>
              <p style={{ margin: '0 0 4px', fontSize: '13px', color: theme.colors.textSecondary }}>{user?.email}</p>
              <span style={{ fontSize: '12px', backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, padding: '3px 10px', borderRadius: '12px', fontWeight: '500', textTransform: 'capitalize', marginBottom: '20px' }}>
                {user?.role}
              </span>

              <div style={{ width: '100%', paddingTop: '16px', borderTop: `1px solid ${theme.colors.border}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => setEditing(!editing)}
                  style={{ width: '100%', padding: '9px', backgroundColor: editing ? theme.colors.primaryLight : theme.colors.primary, color: editing ? theme.colors.primaryDark : 'white', border: editing ? `1px solid ${theme.colors.primaryBorder}` : 'none', borderRadius: '7px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: theme.font }}
                >
                  {editing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <button
                  onClick={handleLogout}
                  style={{ width: '100%', padding: '9px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '7px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: theme.font }}
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Info card */}
            <div style={{ backgroundColor: 'white', borderRadius: theme.borderRadius, border: `1px solid ${theme.colors.border}`, boxShadow: theme.colors.cardShadow, padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
                {editing ? 'Edit Information' : 'Personal Information'}
              </h3>

              {editing ? (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text, display: 'block', marginBottom: '5px' }}>Full Name</label>
                  <input value={form.name} onChange={set('name')} maxLength={60} style={inputStyle(!!errors.name)} />
                  {errors.name && <p style={{ color: '#ef4444', fontSize: '11px', margin: '0 0 12px' }}>{errors.name}</p>}

                  <label style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text, display: 'block', marginBottom: '5px', marginTop: '12px' }}>Phone Number</label>
                  <input value={form.phone} onChange={set('phone')} placeholder="e.g. 0300-1234567" maxLength={15} style={inputStyle(!!errors.phone)} />
                  {errors.phone && <p style={{ color: '#ef4444', fontSize: '11px', margin: '0 0 12px' }}>{errors.phone}</p>}

                  <label style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text, display: 'block', marginBottom: '5px', marginTop: '12px' }}>Date of Birth</label>
                  <input type="date" value={form.dob} onChange={set('dob')} style={inputStyle(false)} />

                  <label style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text, display: 'block', marginBottom: '5px', marginTop: '12px' }}>Blood Group</label>
                  <select value={form.bloodGroup} onChange={set('bloodGroup')} style={inputStyle(false)}>
                    <option value="">Select blood group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>

                  <label style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text, display: 'block', marginBottom: '5px', marginTop: '12px' }}>City / Address</label>
                  <input value={form.address} onChange={set('address')} placeholder="Your city or address" maxLength={100} style={inputStyle(false)} />

                  <button
                    onClick={handleSave}
                    style={{ marginTop: '20px', padding: '10px 24px', backgroundColor: theme.colors.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: theme.font }}
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div>
                  <Field label="Full Name" value={user?.name || ''} />
                  <Field label="Email Address" value={user?.email || ''} />
                  <Field label="Role" value={user?.role || ''} />
                  <Field label="Phone" value={form.phone} />
                  <Field label="Date of Birth" value={form.dob} />
                  <Field label="Blood Group" value={form.bloodGroup} />
                  <Field label="City / Address" value={form.address} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
