import React from 'react';
import { Edit3, Code2 } from 'lucide-react';

export const ModeSwitch = ({
  mode = 'structured', // 'structured' | 'latex'
  onChange,
  hasLatex = false,
  isDirty = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '3px',
        backgroundColor: 'var(--bg-input)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        gap: '4px',
        width: '100%',
        maxWidth: '380px',
      }}
    >
      <button
        type="button"
        onClick={() => onChange('structured')}
        style={{
          flex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '6px 12px',
          fontSize: '0.8125rem',
          fontWeight: mode === 'structured' ? 600 : 500,
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          backgroundColor: mode === 'structured' ? 'var(--primary-600)' : 'transparent',
          color: mode === 'structured' ? '#ffffff' : 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: mode === 'structured' ? 'var(--shadow-sm)' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <Edit3 size={14} flexShrink={0} />
        <span>Structured Form</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('latex')}
        style={{
          flex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '6px 12px',
          fontSize: '0.8125rem',
          fontWeight: mode === 'latex' ? 600 : 500,
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          backgroundColor: mode === 'latex' ? 'var(--bg-surface-elevated)' : 'transparent',
          color: mode === 'latex' ? 'var(--text-main)' : 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: mode === 'latex' ? 'var(--shadow-sm)' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <Code2 size={14} color={mode === 'latex' ? 'var(--primary-400)' : 'currentColor'} flexShrink={0} />
        <span>LaTeX Code</span>
      </button>
    </div>
  );
};
