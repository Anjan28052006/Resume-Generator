import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', message, title, duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const toast = { id, type, message, title };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message, title = 'Success') => {
    addToast({ type: 'success', message, title });
  }, [addToast]);

  const error = useCallback((message, title = 'Error') => {
    addToast({ type: 'error', message, title, duration: 6000 });
  }, [addToast]);

  const info = useCallback((message, title = 'Notice') => {
    addToast({ type: 'info', message, title });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info }}>
      {children}
      <div style={toastContainerStyle} aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-slide-in"
            style={{
              ...toastItemStyle,
              borderColor:
                toast.type === 'success'
                  ? 'var(--success-border)'
                  : toast.type === 'error'
                  ? 'var(--danger-border)'
                  : 'var(--info-border)',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            <div style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
              {toast.type === 'success' && <CheckCircle2 size={18} color="var(--success-text)" />}
              {toast.type === 'error' && <AlertCircle size={18} color="var(--danger-text)" />}
              {toast.type === 'info' && <Info size={18} color="var(--info-text)" />}
            </div>
            <div style={{ flex: 1 }}>
              {toast.title && <div style={toastTitleStyle}>{toast.title}</div>}
              <div style={toastMessageStyle}>{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={toastCloseBtnStyle}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const toastContainerStyle = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '400px',
  width: 'calc(100vw - 48px)',
  pointerEvents: 'none',
};

const toastItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '12px 16px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid',
  boxShadow: 'var(--shadow-lg)',
  pointerEvents: 'auto',
};

const toastTitleStyle = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--text-main)',
  marginBottom: '2px',
};

const toastMessageStyle = {
  fontSize: '0.8125rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.4,
};

const toastCloseBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '2px',
  marginLeft: '8px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: 'var(--radius-xs)',
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
