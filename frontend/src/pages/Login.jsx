import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { getErrorMessage } from '../utils/errors';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      success('Welcome back to ResumeForge!', 'Signed In');
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(getErrorMessage(err, 'Failed to sign in. Please verify your credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card auth-card animate-fade-in">
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 700, marginBottom: '6px' }}>
          Sign in to your account
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Access your AI resumes and LaTeX editor workspace
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
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={16} />}
          required
          autoComplete="email"
          autoFocus
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock size={16} />}
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          style={{ marginTop: '8px', width: '100%' }}
          rightIcon={<ArrowRight size={16} />}
        >
          Sign In
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
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          style={{
            color: 'var(--primary-400)',
            fontWeight: 600,
          }}
        >
          Create one now
        </Link>
      </div>
    </div>
  );
};
