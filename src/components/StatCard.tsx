import React from 'react';
import { theme } from '../styles/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

const StatCard = ({ title, value, subtitle }: StatCardProps) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: theme.borderRadius,
    padding: '20px 24px',
    boxShadow: theme.colors.cardShadow,
    border: `1px solid ${theme.colors.border}`,
    flex: 1,
    minWidth: '160px',
  }}>
    <p style={{ margin: '0 0 10px', fontSize: '11px', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>
      {title}
    </p>
    <p style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: '700', color: theme.colors.primaryDark }}>
      {value}
    </p>
    {subtitle && (
      <p style={{ margin: 0, fontSize: '12px', color: theme.colors.textSecondary }}>{subtitle}</p>
    )}
  </div>
);

export default StatCard;
