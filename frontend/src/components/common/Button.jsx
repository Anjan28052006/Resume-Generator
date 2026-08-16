import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  type = 'button',
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--primary-600)',
          color: '#ffffff',
          border: '1px solid var(--primary-500)',
          boxShadow: '0 1px 3px rgba(79, 70, 229, 0.4)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-default)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-main)',
          border: '1px solid var(--border-default)',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--danger-solid)',
          color: '#ffffff',
          border: '1px solid rgba(239, 68, 68, 0.4)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '5px 10px',
          fontSize: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          gap: '6px',
        };
      case 'lg':
        return {
          padding: '12px 24px',
          fontSize: '1rem',
          borderRadius: 'var(--radius-lg)',
          gap: '10px',
        };
      case 'md':
      default:
        return {
          padding: '8px 16px',
          fontSize: '0.8125rem',
          borderRadius: 'var(--radius-md)',
          gap: '8px',
        };
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        transition: 'all 0.15s ease',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 13 : 15} />
      ) : (
        leftIcon
      )}
      <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
