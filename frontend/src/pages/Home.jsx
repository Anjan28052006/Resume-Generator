import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { TEMPLATES } from '../utils/constants';
import {
  Sparkles,
  ArrowRight,
  Code2,
  FileText,
  Zap,
  CheckCircle2,
  Cpu,
  History,
  Download,
  Terminal,
  ShieldCheck,
  LayoutTemplate,
  Layers,
  ChevronRight,
  Edit3,
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      {/* Top Public Navigation */}
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
            gap: '8px',
          }}
        >
          {/* Brand */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
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
                  whiteSpace: 'nowrap',
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

          {/* Center Nav Links */}
          <nav
            style={{
              display: 'none',
              '@media (min-width: 768px)': { display: 'flex' },
              gap: '24px',
              alignItems: 'center',
            }}
            className="desktop-nav"
          >
            <a href="#features" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
              Features
            </a>
            <a href="#templates" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
              Templates
            </a>
            <a href="#how-it-works" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
              How It Works
            </a>
          </nav>

          {/* Right CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/dashboard')}
                rightIcon={<ArrowRight size={14} />}
                style={{ whiteSpace: 'nowrap' }}
              >
                Workspace
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="hide-on-mobile"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                  style={{ whiteSpace: 'nowrap', padding: '6px 14px', fontSize: '0.8125rem' }}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(36px, 6vw, 80px) 0 clamp(24px, 4vw, 60px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Ambient background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(9, 13, 22, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          {/* Badge Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              marginBottom: '20px',
              maxWidth: '100%',
            }}
          >
            <Sparkles size={13} color="var(--primary-400)" flexShrink={0} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-200)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Next-Gen AI Resume & LaTeX Studio
            </span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 3.75rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.035em',
              color: 'var(--text-main)',
              marginBottom: '16px',
            }}
          >
            Craft ATS-Engineered Resumes with{' '}
            <span style={{ color: 'var(--primary-400)' }}>  AI</span> &{' '}
            <span style={{ color: '#38bdf8' }}>LaTeX Precision</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 28px',
              lineHeight: 1.6,
            }}
          >
            Stop wrestling with clunky document editors. Build structured resume data, generate
            publication-grade LaTeX code with  , and compile high-resolution PDFs in real time.
          </p>

          {/* Hero CTAs */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '48px',
            }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              leftIcon={<Sparkles size={18} />}
              rightIcon={<ArrowRight size={16} />}
              style={{ padding: '14px 28px', fontSize: '1.0625rem' }}
            >
              {isAuthenticated ? 'Open Studio Workspace' : 'Build Your Resume Free'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(isAuthenticated ? '/resumes/new' : '/login')}
              leftIcon={<Code2 size={18} />}
              style={{ padding: '14px 24px', fontSize: '1.0625rem' }}
            >
              Explore LaTeX Editor
            </Button>
          </div>

          {/* Trust Highlights */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--success-text)" />
              <span>Tectonic XeTeX Backend Engine</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--success-text)" />
              <span>  AI Content Optimizer</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--success-text)" />
              <span>Zero LaTeX Setup Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Studio Preview Banner */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div
            className="card"
            style={{
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: 'var(--bg-card)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Mock Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                backgroundColor: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ marginLeft: '12px', fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  resumeforge-studio // senior-engineer-v3.tex
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Badge variant="success" size="sm">LIVE SYNC ACTIVE</Badge>
                <Badge variant="primary" size="sm">COMPILED</Badge>
              </div>
            </div>

            {/* Mock Dual Pane Split Preview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                minHeight: '380px',
              }}
            >
              {/* Left Pane (Code Mock) */}
              <div
                style={{
                  backgroundColor: '#0b1120',
                  padding: '24px',
                  borderRight: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  color: '#f8fafc',
                  lineHeight: 1.6,
                  overflow: 'hidden',
                }}
              >
                <div style={{ color: '#64748b' }}>% ResumeForge AI LaTeX Generation</div>
                <div><span style={{ color: '#818cf8', fontWeight: 600 }}>\documentclass</span>[10pt, letterpaper]{`{article}`}</div>
                <div><span style={{ color: '#818cf8', fontWeight: 600 }}>\usepackage</span>{`{geometry, hyperref, enumitem}`}</div>
                <div style={{ margin: '8px 0' }}><span style={{ color: '#818cf8', fontWeight: 600 }}>\begin</span>{`{document}`}</div>
                <div style={{ paddingLeft: '16px' }}>
                  <span style={{ color: '#60a5fa' }}>\section*</span>{`{Professional Summary}`}
                </div>
                <div style={{ paddingLeft: '16px', color: '#94a3b8' }}>
                  Software Architect with 6+ years driving distributed backend microservices...
                </div>
                <div style={{ paddingLeft: '16px', margin: '8px 0' }}>
                  <span style={{ color: '#60a5fa' }}>\section*</span>{`{Work Experience}`}
                </div>
                <div style={{ paddingLeft: '24px' }}>
                  <span style={{ color: '#fbbf24' }}>\textbf</span>{`{Senior Software Engineer}`} $\cdot$ Stripe
                </div>
                <div style={{ paddingLeft: '32px', color: '#34d399' }}>
                  \item Scaled payment settlement pipelines processing \$50M daily volume.
                </div>
                <div style={{ margin: '8px 0' }}><span style={{ color: '#818cf8', fontWeight: 600 }}>\end</span>{`{document}`}</div>
              </div>

              {/* Right Pane (PDF Render Mock) */}
              <div
                style={{
                  backgroundColor: '#1e293b',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '90%',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    padding: '24px 28px',
                    borderRadius: '4px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    fontFamily: 'serif',
                    transform: 'scale(0.95)',
                  }}
                >
                  <div style={{ textAlign: 'center', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Alex Morgan</h3>
                    <p style={{ fontSize: '0.75rem', color: '#475569' }}>alex.morgan@example.com $\cdot$ (555) 019-2834 $\cdot$ github.com/alexmorgan</p>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Experience
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                      <span>Senior Software Engineer — Stripe</span>
                      <span style={{ fontWeight: 400 }}>2022 – Present</span>
                    </div>
                    <ul style={{ fontSize: '0.7rem', paddingLeft: '14px', marginTop: '2px', color: '#334155' }}>
                      <li>Engineered low-latency ledgering services reducing checkout abandonment.</li>
                      <li>Spearheaded asynchronous webhook engine handling 120k requests/min.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" style={{ padding: '80px 0', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
            <Badge variant="primary" size="md">ENGINEERED FOR EXCELLENCE</Badge>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '12px', marginBottom: '14px' }}>
              Everything you need for a job-winning resume
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5 }}>
              Combine the ease of structured form entry with the unmatched typographic perfection of raw LaTeX.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Feature 1 */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-400)',
                }}
              >
                <Cpu size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>  AI Intelligence</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Generate tailored executive summaries and rewrite bullet points into action-driven, metric-focused achievements with Google  .
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                }}
              >
                <Terminal size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Integrated Monaco LaTeX Studio</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Full VS Code-like Monaco editor with custom LaTeX grammar syntax highlighting, keyboard shortcuts (Ctrl+S), line numbers, and error traces.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--success-text)',
                }}
              >
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Tectonic Backend Compiler</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                XeTeX engine compiles LaTeX instantly on the server, uploads to Cloudinary CDN, and updates live PDF preview in real time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--warning-text)',
                }}
              >
                <History size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Version History & Rollback</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Every save and AI change creates a version snapshot. Compare iterations and restore any previous version with a single click.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ec4899',
                }}
              >
                <Layers size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Dual-Mode Workspace</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Switch effortlessly between intuitive visual forms (Personal, Work, Education, Projects, Skills) and raw LaTeX code without friction.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a855f7',
                }}
              >
                <Download size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Direct Vector PDF Downloads</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Download high-fidelity, crisp vector PDFs optimized for applicant tracking systems (ATS) and hiring managers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section id="templates" style={{ padding: '80px 0', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <Badge variant="info" size="md">TEMPLATES</Badge>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '12px', marginBottom: '14px' }}>
              Designed for High-Impact Careers
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5 }}>
              Choose from recruiter-approved LaTeX layouts tailored for software engineers, leadership, and academics.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <LayoutTemplate size={18} color="var(--primary-400)" />
                      <h4 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>{tmpl.name}</h4>
                    </div>
                    <Badge variant="primary" size="sm">{tmpl.badge}</Badge>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {tmpl.description}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(isAuthenticated ? '/resumes/new' : '/register')}
                  rightIcon={<ChevronRight size={14} />}
                >
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section
        style={{
          padding: '80px 0',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '16px' }}>
            Ready to Build Your Standout Resume?
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
            Join thousands of professionals generating flawless LaTeX resumes with real-time AI assistance.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            rightIcon={<ArrowRight size={16} />}
            style={{ padding: '14px 32px', fontSize: '1.0625rem' }}
          >
            {isAuthenticated ? 'Open Studio Workspace' : 'Get Started for Free'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '24px 0',
          backgroundColor: 'var(--bg-app)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} ResumeForge AI Studio. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <span>Powered by Node.js, Express,   AI & Tectonic LaTeX</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
