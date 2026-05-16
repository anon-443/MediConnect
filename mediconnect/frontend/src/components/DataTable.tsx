import React from 'react';
import { theme } from '../styles/theme';

interface Column { key: string; label: string; }

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
}

const DataTable = ({ columns, data, loading }: DataTableProps) => {
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: theme.colors.textSecondary, fontSize: '13px' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{
                padding: '11px 18px',
                textAlign: 'left',
                backgroundColor: theme.colors.primaryLight,
                color: theme.colors.primaryDark,
                fontWeight: '600',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: `2px solid ${theme.colors.primaryBorder}`,
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '24px', textAlign: 'center', color: theme.colors.textSecondary }}>
                No records found.
              </td>
            </tr>
          ) : data.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${theme.colors.border}`, backgroundColor: i % 2 === 0 ? 'white' : '#fafcfb' }}>
              {columns.map(col => (
                <td key={col.key} style={{ padding: '12px 18px', color: theme.colors.text, lineHeight: '1.5' }}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
