import React from 'react';

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 0',
        marginTop: 'auto',
        backgroundColor: 'rgba(9, 13, 22, 0.5)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} ResumeForge AI. Professional resume engineering platform.
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8125rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Powered by Gemini & LaTeX Compiler</span>
        </div>
      </div>
    </footer>
  );
};
