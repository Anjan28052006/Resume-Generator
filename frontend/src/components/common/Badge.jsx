import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size = 'md', // 'sm' | 'md'
  icon = null,
  style = {},
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--primary-glow)',
          color: 'var(--primary-200)',
          border: '1px solid var(--primary-500)',
        };
      case 'success':
        return {
          backgroundColor: 'var(--success-bg)',
          color: 'var(--success-text)',
          border: '1px solid var(--success-border)',
        };
      case 'warning':
        return {
          backgroundColor: 'var(--warning-bg)',
          color: 'var(--warning-text)',
          border: '1px solid var(--warning-border)',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger-text)',
          border: '1px solid var(--danger-border)',
        };
      case 'info':
        return {
          backgroundColor: 'var(--info-bg)',
          color: 'var(--info-text)',
          border: '1px solid var(--info-border)',
        };
      case 'default':
      default:
        return {
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
        };
    }
  };

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: isSmall ? '2px 6px' : '3px 8px',
        fontSize: isSmall ? '0.6875rem' : '0.75rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        ...getVariantStyles(),
        ...style,
      }}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};
