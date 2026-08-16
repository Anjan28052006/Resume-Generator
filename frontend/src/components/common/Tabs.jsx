import React from 'react';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  size = 'md', // 'sm' | 'md'
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '3px',
        backgroundColor: 'var(--bg-input)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        gap: '3px',
        overflowX: 'auto',
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: size === 'sm' ? '5px 10px' : '7px 14px',
              fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
              fontWeight: isActive ? 600 : 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
              color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== null && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--primary-600)' : 'var(--bg-surface-elevated)',
                  color: '#ffffff',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
