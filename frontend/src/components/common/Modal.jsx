import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '550px',
  footer = null,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={backdropStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="card modal-content-card animate-fade-in" style={{ ...modalContainerStyle, maxWidth }}>
        {/* Header */}
        <div className="modal-header" style={headerStyle}>
          <div style={{ minWidth: 0, flex: 1, paddingRight: '12px' }}>
            {title && <h3 style={titleStyle}>{title}</h3>}
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={closeBtnStyle} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={bodyStyle}>{children}</div>

        {/* Footer */}
        {footer && <div className="modal-footer" style={footerStyle}>{footer}</div>}
      </div>
    </div>
  );
};

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(5, 8, 16, 0.75)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px',
};

const modalContainerStyle = {
  width: '100%',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-xl)',
  overflow: 'hidden',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid var(--border-subtle)',
};

const titleStyle = {
  fontSize: '1.0625rem',
  fontWeight: 700,
  color: 'var(--text-main)',
};

const subtitleStyle = {
  fontSize: '0.8125rem',
  color: 'var(--text-secondary)',
  marginTop: '2px',
  lineHeight: 1.4,
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: 'var(--radius-sm)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.15s ease',
  flexShrink: 0,
};

const bodyStyle = {
  padding: '20px',
  overflowY: 'auto',
  flex: 1,
};

const footerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '10px',
  padding: '14px 20px',
  borderTop: '1px solid var(--border-subtle)',
  backgroundColor: 'rgba(11, 17, 32, 0.4)',
  flexWrap: 'wrap',
};
