import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { theme } from '../styles/theme';

const doctors: { [key: number]: any } = {
  1: { name: 'Dr. Ahmed Raza', specialty: 'Cardiologist' },
  2: { name: 'Dr. Sara Malik', specialty: 'Neurologist' },
  3: { name: 'Dr. Bilal Khan', specialty: 'Orthopedic Surgeon' },
  4: { name: 'Dr. Ayesha Tariq', specialty: 'Gynecologist' },
  5: { name: 'Dr. Usman Farooq', specialty: 'Dermatologist' },
  6: { name: 'Dr. Nadia Hussain', specialty: 'Pediatrician' },
  7: { name: 'Dr. Kamran Iqbal', specialty: 'Oncologist' },
  8: { name: 'Dr. Hina Baig', specialty: 'Psychiatrist' },
  9: { name: 'Dr. Tariq Mehmood', specialty: 'Diabetologist' },
  10: { name: 'Dr. Sadia Noor', specialty: 'Ophthalmologist' },
  11: { name: 'Dr. Faisal Aziz', specialty: 'Pulmonologist' },
  12: { name: 'Dr. Rabia Sheikh', specialty: 'Gastroenterologist' },
};

const doctorResponses: { [key: string]: string[] } = {
  default: [
    'Thank you for reaching out. Could you please describe your symptoms in more detail?',
    'I understand your concern. How long have you been experiencing this?',
    'Based on what you have described, I recommend scheduling an in-person consultation.',
    'Please make sure to stay hydrated and get adequate rest in the meantime.',
    'Have you taken any medications for this recently?',
    'I would like to review your medical history before advising further.',
    'This could be related to several conditions. Please visit the clinic for proper examination.',
    'Thank you for the information. I will review this and get back to you shortly.',
  ],
  pain: [
    'Can you describe the intensity of the pain on a scale of 1 to 10?',
    'Is the pain constant or does it come and go?',
    'Does anything make the pain better or worse?',
    'Have you taken any pain relievers? If so, did they help?',
  ],
  fever: [
    'What is your current temperature?',
    'How long have you had the fever?',
    'Are you experiencing any other symptoms like cough or body aches?',
    'Please stay hydrated and take paracetamol if temperature is above 38.5 degrees Celsius.',
  ],
  emergency: [
    'This sounds serious. Please go to the emergency department immediately.',
    'Please call emergency services right away. Do not wait.',
    'This requires immediate medical attention. Please visit the nearest hospital now.',
  ],
};

interface Message {
  id: number;
  sender: 'user' | 'doctor';
  text: string;
  time: string;
}

const sanitize = (text: string) => text.replace(/[<>{}]/g, '').trim();

const getResponse = (message: string): string => {
  const lower = message.toLowerCase();
  if (lower.includes('pain') || lower.includes('ache') || lower.includes('hurt')) {
    const r = doctorResponses.pain;
    return r[Math.floor(Math.random() * r.length)];
  }
  if (lower.includes('fever') || lower.includes('temperature')) {
    const r = doctorResponses.fever;
    return r[Math.floor(Math.random() * r.length)];
  }
  if (lower.includes('emergency') || lower.includes('chest pain') || lower.includes('cant breathe')) {
    return doctorResponses.emergency[0];
  }
  const r = doctorResponses.default;
  return r[Math.floor(Math.random() * r.length)];
};

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const doctor = doctors[parseInt(id || '1')] || doctors[1];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'doctor',
      text: `Hello! I am ${doctor.name}. How can I help you today?`,
      time: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const clean = sanitize(input);
    if (!clean || clean.length < 1) return;
    if (clean.length > 500) return;

    const userMsg: Message = { id: Date.now(), sender: 'user', text: clean, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const reply: Message = { id: Date.now() + 1, sender: 'doctor', text: getResponse(clean), time: now() };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: theme.font, backgroundColor: theme.colors.background }}>
      <SideNav activeTab="doctors" setActiveTab={(tab) => {
        if (tab === 'dashboard') navigate('/dashboard');
        if (tab === 'diseases') navigate('/diseases');
        if (tab === 'hospitals') navigate('/hospitals');
        if (tab === 'appointments') navigate('/appointments');
        if (tab === 'doctors') navigate('/doctors');
        if (tab === 'profile') navigate('/profile');
      }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav />
        <main style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column' }}>

          <button
            onClick={() => navigate('/doctors')}
            style={{ alignSelf: 'flex-start', padding: '7px 14px', backgroundColor: theme.colors.primaryLight, color: theme.colors.primaryDark, border: `1px solid ${theme.colors.primaryBorder}`, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', marginBottom: '16px', fontFamily: theme.font }}
          >
            Back to Doctors
          </button>

          {/* Chat container */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: '12px', border: `1px solid ${theme.colors.border}`, boxShadow: theme.colors.cardShadow, overflow: 'hidden', maxHeight: '600px' }}>

            {/* Chat header */}
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${theme.colors.border}`, display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: theme.colors.primaryLight }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: theme.colors.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '700', flexShrink: 0 }}>
                {doctor.name.split(' ')[1]?.[0] || 'D'}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>{doctor.name}</p>
                <p style={{ margin: 0, fontSize: '12px', color: theme.colors.primaryDark }}>{doctor.specialty}</p>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '11px', backgroundColor: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '12px', fontWeight: '600' }}>Online</span>
            </div>

            {/* Disclaimer */}
            <div style={{ backgroundColor: '#fef9c3', borderBottom: `1px solid #fde68a`, padding: '8px 20px' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#92400e' }}>
                This is a demo chat for educational purposes. For real medical emergencies please call 1122 or visit your nearest hospital.
              </p>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '65%', padding: '10px 14px', borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    backgroundColor: msg.sender === 'user' ? theme.colors.primary : theme.colors.primaryLight,
                    color: msg.sender === 'user' ? 'white' : theme.colors.text,
                    fontSize: '13px', lineHeight: '1.5',
                  }}>
                    <p style={{ margin: '0 0 4px' }}>{msg.text}</p>
                    <p style={{ margin: 0, fontSize: '10px', opacity: 0.7, textAlign: 'right' }}>{msg.time}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ backgroundColor: theme.colors.primaryLight, padding: '10px 14px', borderRadius: '12px 12px 12px 2px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: theme.colors.textSecondary }}>{doctor.name} is typing...</p>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '14px 16px', borderTop: `1px solid ${theme.colors.border}`, display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value.replace(/[<>{}]/g, ''))}
                onKeyDown={handleKey}
                placeholder="Type your message..."
                maxLength={500}
                style={{ flex: 1, padding: '9px 14px', borderRadius: '8px', border: `1px solid ${theme.colors.primaryBorder}`, fontSize: '13px', outline: 'none', fontFamily: theme.font, color: theme.colors.text, backgroundColor: 'white' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                style={{ padding: '9px 18px', backgroundColor: input.trim() ? theme.colors.primary : '#d1d5db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: input.trim() ? 'pointer' : 'not-allowed', fontFamily: theme.font }}
              >
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
