import React from 'react';
import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, ArrowLeft, CheckCircle2, Code2, Zap, Shield, FileText } from 'lucide-react';

export const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const isRegister = location.pathname.includes('/register');

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-app)',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(9, 13, 22, 0.85)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          height: '56px',
        }}
      >
        {/* Left: Back Link */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>

        {/* Center: Brand Logo (Only on Desktop / Tablet) */}
        <Link
          to="/"
          className="hide-on-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={14} color="#ffffff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-main)' }}>
            ResumeForge
          </span>
        </Link>

        {/* Right: Switch Mode Link */}
        <div style={{ fontSize: '0.8125rem', flexShrink: 0 }}>
          {isRegister ? (
            <Link
              to="/login"
              style={{
                color: 'var(--primary-400)',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
            >
              Sign In
            </Link>
          ) : (
            <Link
              to="/register"
              style={{
                color: 'var(--primary-400)',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
            >
              Create Account
            </Link>
          )}
        </div>
      </header>

      {/* Main Split Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 14px',
          position: 'relative',
        }}
      >
        {/* Background glow orb */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(9, 13, 22, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div
          className="auth-container"
          style={{
            width: '100%',
            maxWidth: '1000px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Left Feature Showcase (Visible on desktop & tablet) */}
          <div
            className="auth-showcase"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              padding: '16px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--primary-300)',
                  marginBottom: '14px',
                }}
              >
                <Sparkles size={12} />
                <span>AI RESUME & LATEX STUDIO</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.2,
                  color: 'var(--text-main)',
                  marginBottom: '12px',
                }}
              >
                Build resumes that pass ATS filters and impress tech recruiters
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Access the full suite of Gemini AI content rewriting, Monaco LaTeX code editing,
                and instant XeTeX compilation in one synchronized workspace.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-400)',
                    flexShrink: 0,
                  }}
                >
                  <Zap size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    Gemini AI Rewrite & Summary
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Transform raw bullets into high-impact metrics and executive summaries.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    flexShrink: 0,
                  }}
                >
                  <Code2 size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    Monaco LaTeX Studio
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Fine-tune raw LaTeX with full syntax highlighting and keyboard shortcuts.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--success-text)',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    Real-time PDF Compiler
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Instant PDF rendering with Cloudinary delivery and direct downloads.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actual Login / Register Card */}
          <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
