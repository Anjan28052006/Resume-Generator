import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'connected' | 'connecting' | 'disconnected' | 'error'
  const [socketError, setSocketError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConnectionStatus('disconnected');
      return;
    }

    setConnectionStatus('connecting');

    const socketInstance = io(SOCKET_URL, {
      auth: {
        token,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socketInstance;

    socketInstance.on('connect', () => {
      setConnectionStatus('connected');
      setSocketError(null);
    });

    socketInstance.on('disconnect', (reason) => {
      setConnectionStatus('disconnected');
      if (reason === 'io server disconnect') {
        // the disconnection was initiated on the server, reconnect manually
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setConnectionStatus('error');
      setSocketError(err.message);
    });

    socketInstance.on('resume:error', (error) => {
      console.warn('Socket resume error event:', error);
    });

    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, token]);

  const joinResume = useCallback((resumeId) => {
    if (socketRef.current && socketRef.current.connected && resumeId) {
      socketRef.current.emit('resume:join', resumeId);
    }
  }, []);

  const leaveResume = useCallback((resumeId) => {
    if (socketRef.current && socketRef.current.connected && resumeId) {
      socketRef.current.emit('resume:leave', resumeId);
    }
  }, []);

  const value = {
    socket: socketRef.current,
    connectionStatus,
    socketError,
    joinResume,
    leaveResume,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
