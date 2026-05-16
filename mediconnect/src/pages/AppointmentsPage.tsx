import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { theme } from '../styles/theme';

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  reason: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  bookedAt: string;
}

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

const doctors = ['Dr. Ahmed Raza (Cardiologist)', 'Dr. Sara Malik (Neurologist)', 'Dr. Bilal Khan (Orthopedic Surgeon)', 'Dr. Ayesha Tariq (Gynecologist)', 'Dr. Usman Farooq (Dermatologist)', 'Dr. Nadia Hussain (Pediatrician)', 'Dr. Kamran Iqbal (Oncologist)', 'Dr. Hina Baig (Psychiatrist)', 'Dr. Tariq Mehmood (Diabetologist)', 'Dr. Sadia Noor (Ophthalmologist)', 'Dr. Faisal Aziz (Pulmonologist)', 'Dr. Rabia Sheikh (Gastroenterologist)'];

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const preselectedDoctor = location.state?.doctor && location.state?.specialty
    ? `${location.state.doctor} (${location.state.specialty})`
    : '';

  const [form, setForm] = useState({ doctor: preselectedDoctor, date: '', time: '', reason: '' });
  const [errors, setErrors] = useState({ doctor: '', date: '', time: '', reason: '' });
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, doctor: 'Dr. Ahmed Raza', specialty: 'Cardiologist', date: '2026-05-15', time: '10:00 AM', reason: 'Chest pain and shortness of breath', status: 'Confirmed', bookedAt: '2026-05-09' },
    { id: 2, doctor: 'Dr. Nadia Hussain', specialty: 'Pediatrician', date: '2026-05-20', time: '02:30 PM', reason: 'Child routine checkup', status: 'Pending', bookedAt: '2026-05-09' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    let valid = true;
    const e = { doctor: '', date: '', time: '', reason: '' };

    if (!form.doctor) { e.doctor = 'Please select a doctor'; valid = false; }
    if (!form.date) { e.date = 'Please select a date'; valid = false; }
    else {
      const selected = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) { e.date = 'Date cannot be in the past'; valid = false; }
    }
    if (!form.time) { e.time = 'Please select a time slot'; valid = false; }
    if (!form.reason.trim()) { e.reason = 'Please enter a reason'; valid = false; }
    else if (form.reason.trim().length < 5) { e.reason = 'Please provide more detail'; valid = false; }

    setErrors(e);
    return valid;
  };

  const handleBook = () => {
    if (!validate()) return;
    const doctorName = form.doctor.split(' (')[0];
    const specialty = form.doctor.split('(')[1]?.replace(')', '') || '';
    const newAppointment: Appointment = {
      id: Date.now(),
      doctor: doctorName,
      specialty,
      date: form.date,
      time: form.time,
      reason: form.reason.trim().replace(/[<>{}]/g, ''),
      status: 'Pending',
      bookedAt: new Date().toISOString().split('T')[0],
    };
    setAppointments(prev => [newAppointment, ...prev]);
    setForm({ doctor: '', date: '', time: '', reason: '' });
    setShowForm(false);
    setSuccess('Appointment booked successfully!');
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleCancel = (id: number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
  };

  const statusColor: any = {
    Pending: { bg: '#fef9c3', color: '#a16207' },
    Confirmed: { bg: '#dcfce7', color: '#15803d' },
    Cancelled: { bg: '#fee2e2', color: '#dc2626' },
  };

  const inputStyle = (hasErr: boolean) => ({
    width: '100%', padding: '9px 12px', borderRadius: '7px',
    border: hasErr ? '1px solid #ef4444' : `1px solid ${theme.colors.primaryBorder}`,
    fontSize: '13px', outline: 'none', fontFamily: theme.font,
    color: theme.colors.text, boxSizing: 'border-box' as const, backgroundColor: 'white',
  });

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: theme.font, backgroundColor: theme.colors.background }}>
      <SideNav activeTab="appointments" setActiveTab={(tab) => {
        if (tab === 'dashboard') navigate('/dashboard');
        if (tab === 'diseases') navigate('/diseases');
        if (tab === 'hospitals') navigate('/hospitals');
        if (tab === 'doctors') navigate('/doctors');
        if (tab === 'profile') navigate('/profile');
      }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav />
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ color: theme.colors.text, margin: '0 0 4px', fontSize: '19px', fontWeight: '600' }}>Appointments</h2>
              <p style={{ color: theme.colors.textSecondary, fontSize: '13px', margin: 0 }}>Manage your doctor appointments</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{ padding: '9px 18px', backgroundColor: theme.colors.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: theme.font }}
            >
              {showForm ? 'Cancel' : 'Book Appointment'}
            </button>
          </div>

          {success && (
            <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#15803d', fontWeight: '500' }}>
              {success}
            </div>
          )}

          {/* Booking Form */}
          {showForm && (
            <div style={{ backgroundColor: 'white', borderRadius: theme.borderRadius, border: `1px solid ${theme.colors.border}`, boxShadow: theme.colors.cardShadow, padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ color: theme.colors.text, margin: '0 0 20px', fontSize: '15px', fontWeight: '600' }}>New Appointment</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text, display: 'block', marginBottom: '5px' }}>Select Doctor</label>
                  <select value={form.doctor} onChange={set('doctor')} style={inputStyle(!!errors.doctor)}>
                    <option value="">Choose a doctor</option>
                    {doctors.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.doctor && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0' }}>{errors.doctor}</p>}
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text, display: 'block', marginBottom: '5px' }}>Appointment Date</label>
                  <input type="date" value={form.date} onChange={set('date')} min={todayStr} style={inputStyle(!!errors.date)} />
                  {errors.date && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0' }}>{errors.date}</p>}
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text, display: 'block', marginBottom: '5px' }}>Time Slot</label>
                  <select value={form.time} onChange={set('time')} style={inputStyle(!!errors.time)}>
                    <option value="">Choose a time</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.time && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0' }}>{errors.time}</p>}
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: theme.colors.text, display: 'block', marginBottom: '5px' }}>Reason for Visit</label>
                  <input
                    type="text"
                    value={form.reason}
                    onChange={set('reason')}
                    placeholder="Briefly describe your concern"
                    maxLength={200}
                    style={inputStyle(!!errors.reason)}
                  />
                  {errors.reason && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0' }}>{errors.reason}</p>}
                </div>
              </div>

              <button
                onClick={handleBook}
                style={{ marginTop: '20px', padding: '10px 24px', backgroundColor: theme.colors.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: theme.font }}
              >
                Confirm Booking
              </button>
            </div>
          )}

          {/* Appointments Table */}
          <div style={{ backgroundColor: 'white', borderRadius: theme.borderRadius, border: `1px solid ${theme.colors.border}`, boxShadow: theme.colors.cardShadow, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${theme.colors.border}` }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>Your Appointments ({appointments.length})</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  {['Doctor', 'Specialty', 'Date', 'Time', 'Reason', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${theme.colors.primaryBorder}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: theme.colors.textSecondary }}>No appointments booked yet.</td></tr>
                ) : appointments.map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: `1px solid ${theme.colors.border}`, backgroundColor: i % 2 === 0 ? 'white' : '#fafcfb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: theme.colors.text }}>{a.doctor}</td>
                    <td style={{ padding: '12px 16px', color: theme.colors.textSecondary }}>{a.specialty}</td>
                    <td style={{ padding: '12px 16px', color: theme.colors.text }}>{a.date}</td>
                    <td style={{ padding: '12px 16px', color: theme.colors.text }}>{a.time}</td>
                    <td style={{ padding: '12px 16px', color: theme.colors.textSecondary, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.reason}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '12px', backgroundColor: statusColor[a.status]?.bg, color: statusColor[a.status]?.color }}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {a.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancel(a.id)}
                          style={{ padding: '4px 10px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '5px', fontSize: '11px', fontWeight: '500', cursor: 'pointer', fontFamily: theme.font }}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppointmentsPage;
