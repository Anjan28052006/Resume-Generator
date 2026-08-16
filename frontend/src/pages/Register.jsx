import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { getErrorMessage } from '../utils/errors';
import { User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { register } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    try {
      setIsLoading(true);
      await register(name.trim(), email.trim(), password);
      success('Account created successfully! Welcome to ResumeForge.', 'Account Created');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setFormError(getErrorMessage(err, 'Failed to create account. Email may already be in use.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card auth-card animate-fade-in">
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 700, marginBottom: '6px' }}>
          Create an account
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Start building professional AI-powered resumes today
        </p>
      </div>

      {formError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            marginBottom: '20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger-text)',
            fontSize: '0.8125rem',
          }}
        >
          <AlertCircle size={16} flexShrink={0} />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Full name"
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User size={16} />}
          required
          autoFocus
        />

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={16} />}
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Minimum 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock size={16} />}
          required
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          style={{ marginTop: '8px', width: '100%' }}
          rightIcon={<ArrowRight size={16} />}
        >
          Create Account
        </Button>
      </form>

      <div
        style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
        }}
      >
        Already have an account?{' '}
        <Link
          to="/login"
          style={{
            color: 'var(--primary-400)',
            fontWeight: 600,
          }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};
