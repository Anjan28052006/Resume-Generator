import React from 'react';
import { useSocket } from '../../hooks/useSocket';
import { Wifi, WifiOff } from 'lucide-react';

export const ConnectionIndicator = () => {
  const { connectionStatus } = useSocket();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'var(--success-solid)',
          bg: 'var(--success-bg)',
          text: 'Live Sync',
          icon: <Wifi size={13} />,
        };
      case 'connecting':
        return {
          color: 'var(--warning-solid)',
          bg: 'var(--warning-bg)',
          text: 'Connecting...',
          icon: <Wifi size={13} className="animate-pulse" />,
        };
      case 'error':
      case 'disconnected':
      default:
        return {
          color: 'var(--text-muted)',
          bg: 'rgba(255, 255, 255, 0.05)',
          text: 'Offline',
          icon: <WifiOff size={13} />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      title={`Live Connection: ${config.text}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: config.bg,
        color: config.color,
        fontSize: '0.75rem',
        fontWeight: 500,
        border: '1px solid var(--border-subtle)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.color,
          flexShrink: 0,
        }}
      />
      {config.icon}
      <span className="hide-on-mobile">{config.text}</span>
    </div>
  );
};
