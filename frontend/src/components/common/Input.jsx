import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  id,
  type = 'text',
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

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`input-field ${className}`}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-input)',
            border: `1px solid ${error ? 'var(--danger-border)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '9px 12px',
            paddingLeft: leftIcon ? '38px' : '12px',
            paddingRight: rightIcon ? '38px' : '12px',
            color: 'var(--text-main)',
            fontSize: '0.875rem',
            transition: 'border-color 0.15s ease, background-color 0.15s ease',
            outline: 'none',
            ...style,
          }}
          {...props}
        />

        {rightIcon && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {rightIcon}
          </div>
        )}
      </div>

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

Input.displayName = 'Input';
