import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ConnectionIndicator } from './ConnectionIndicator';
import { Button } from '../common/Button';
import { Sparkles, LogOut, FileText, User, Plus } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isEditor = location.pathname.startsWith('/resumes/') && location.pathname !== '/resumes/new';

  return (
    <header
      className="glass-panel"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 'var(--header-height)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: isEditor ? '1920px' : 'var(--max-width)',
          paddingLeft: isEditor ? '16px' : 'var(--space-4)',
          paddingRight: isEditor ? '16px' : 'var(--space-4)',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.45)',
                flexShrink: 0,
              }}
            >
              <Sparkles size={16} color="#ffffff" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.125rem',
                  color: 'var(--text-main)',
                  letterSpacing: '-0.03em',
                }}
              >
                ResumeForge
              </span>
              <span
                className="hide-on-mobile"
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: 'var(--primary-400)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                AI STUDIO
              </span>
            </div>
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="hide-on-mobile"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: location.pathname === '/dashboard' ? 'var(--primary-300)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <FileText size={14} />
              <span>Dashboard</span>
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isAuthenticated ? (
            <>
              <ConnectionIndicator />

              {!location.pathname.startsWith('/resumes/') && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/resumes/new')}
                  leftIcon={<Plus size={14} />}
                  className="hide-on-mobile"
                >
                  New Resume
                </Button>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <User size={13} color="var(--text-secondary)" />
                <span
                  className="hide-on-mobile"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'var(--text-main)',
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                }}
              >
                <LogOut size={14} />
                <span className="hide-on-mobile">Sign out</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
