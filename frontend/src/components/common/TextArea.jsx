import React, { forwardRef } from 'react';

export const TextArea = forwardRef(({
  label,
  error,
  helperText,
  id,
  rows = 4,
  className = '',
  containerStyle = {},
  style = {},
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...containerStyle }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`textarea-field ${className}`}
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-input)',
          border: `1px solid ${error ? 'var(--danger-border)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          color: 'var(--text-main)',
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          lineHeight: 1.5,
          resize: 'vertical',
          transition: 'border-color 0.15s ease, background-color 0.15s ease',
          outline: 'none',
          ...style,
        }}
        {...props}
      />

      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--danger-text)', marginTop: '2px' }}>
          {error}
        </span>
      )}

      {helperText && !error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          {helperText}
        </span>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';
