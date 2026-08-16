import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          marginBottom: '20px',
        }}
      >
        <FileQuestion size={32} />
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Page Not Found</h1>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '24px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="secondary" leftIcon={<ArrowLeft size={16} />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
