import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeApi } from '../api/resume.api';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ResumeCreateModal } from '../components/resume/ResumeCreateModal';
import { TEMPLATES } from '../utils/constants';
import { getErrorMessage } from '../utils/errors';
import {
  Plus,
  FileText,
  Trash2,
  Edit3,
  Calendar,
  Sparkles,
  AlertCircle,
  FileCode,
  CheckCircle2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Download,
  Clock,
  Layers,
  Cpu,
  ArrowUpRight,
  ChevronRight,
  Zap,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Search, filter & view state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Delete state
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResumes = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError('');
      const data = await resumeApi.getUserResumes();
      setResumes(data || []);
    } catch (err) {
      setFetchError(getErrorMessage(err, 'Failed to fetch resumes.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleDeleteConfirm = async () => {
    if (!resumeToDelete) return;

    try {
      setIsDeleting(true);
      await resumeApi.deleteResume(resumeToDelete._id);
      setResumes((prev) => prev.filter((r) => r._id !== resumeToDelete._id));
      success('Resume deleted successfully.', 'Deleted');
      setResumeToDelete(null);
    } catch (err) {
      error(getErrorMessage(err, 'Failed to delete resume.'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered resumes
  const filteredResumes = useMemo(() => {
    return resumes.filter((resume) => {
      const matchesSearch =
        !searchQuery.trim() ||
        resume.title.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchesTemplate =
        selectedTemplateFilter === 'all' ||
        (resume.templateId || 'modern').toLowerCase() === selectedTemplateFilter.toLowerCase();

      const matchesStatus =
        selectedStatusFilter === 'all' ||
        (resume.status || 'draft').toLowerCase() === selectedStatusFilter.toLowerCase();

      return matchesSearch && matchesTemplate && matchesStatus;
    });
  }, [resumes, searchQuery, selectedTemplateFilter, selectedStatusFilter]);

  // Dashboard Stats Calculations
  const stats = useMemo(() => {
    const total = resumes.length;
    const ready = resumes.filter((r) => r.status === 'ready' || !!r.currentLatex).length;
    const totalVersions = resumes.reduce((acc, r) => acc + (r.currentVersion || 1), 0);
    return { total, ready, totalVersions };
  }, [resumes]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  const getTemplateGradient = (templateId) => {
    switch (templateId?.toLowerCase()) {
      case 'classic':
        return 'linear-gradient(90deg, #f59e0b, #d97706)';
      case 'minimal':
        return 'linear-gradient(90deg, #38bdf8, #0284c7)';
      case 'executive':
        return 'linear-gradient(90deg, #a855f7, #7e22ce)';
      case 'modern':
      default:
        return 'linear-gradient(90deg, #6366f1, #4f46e5)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Welcome & Stats Banner */}
      <div
        style={{
          position: 'relative',
          padding: 'clamp(18px, 4vw, 28px) clamp(16px, 4vw, 32px)',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '400px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(9, 13, 22, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                WORKSPACE OVERVIEW
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)', margin: 0 }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Engineer'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Manage your career documents, refine resume copy with Gemini, and compile LaTeX PDFs.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchResumes}
              leftIcon={<RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus size={15} />}
              style={{ boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}
            >
              Create New Resume
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginTop: '28px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-400)',
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {stats.total}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Total Resumes
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success-text)',
              }}
            >
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {stats.ready}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                LaTeX Compiled Ready
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--warning-text)',
              }}
            >
              <Layers size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {stats.totalVersions}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Version Snapshots
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                Gemini 3.6 Flash
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                AI Engine Online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px', maxWidth: '380px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              gap: '8px',
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search resumes by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
              }}
            />
          </div>
        </div>

        {/* Template Filters & View Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', maxWidth: '100%' }}>
          {/* Template pills */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '2px',
              gap: '2px',
              maxWidth: '100%',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
            }}
          >
            {['all', 'modern', 'classic', 'minimal', 'executive'].map((t) => {
              const active = selectedTemplateFilter === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTemplateFilter(t)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: active ? 600 : 500,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: active ? 'var(--primary-600)' : 'transparent',
                    color: active ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '2px',
              gap: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              style={{
                padding: '5px 8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? 'var(--bg-surface-elevated)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--text-main)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              title="List View"
              style={{
                padding: '5px 8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: viewMode === 'list' ? 'var(--bg-surface-elevated)' : 'transparent',
                color: viewMode === 'list' ? 'var(--text-main)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ListIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {fetchError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger-text)',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} />
            <span>{fetchError}</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchResumes}>
            Try Again
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="card"
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <Skeleton width="60%" height="24px" />
              <Skeleton width="40%" height="16px" />
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <Skeleton width="60px" height="20px" borderRadius="12px" />
                <Skeleton width="80px" height="20px" borderRadius="12px" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <Skeleton width="80px" height="32px" />
                <Skeleton width="32px" height="32px" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State: No Resumes at all */}
      {!isLoading && !fetchError && resumes.length === 0 && (
        <div
          className="card"
          style={{
            padding: '60px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-400)',
              marginBottom: '20px',
            }}
          >
            <FileText size={32} />
          </div>
          <h3 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '8px' }}>
            Your Resume Studio is Ready
          </h3>
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--text-secondary)',
              maxWidth: '460px',
              marginBottom: '28px',
              lineHeight: 1.6,
            }}
          >
            Create your first resume to experience AI-powered bullet writing, instant LaTeX generation,
            and publication-quality PDF compilation.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus size={18} />}
            style={{ padding: '12px 28px' }}
          >
            Create Your First Resume
          </Button>
        </div>
      )}

      {/* Empty Search Results */}
      {!isLoading && !fetchError && resumes.length > 0 && filteredResumes.length === 0 && (
        <div
          className="card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Search size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '6px' }}>
            No resumes match your filter
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Try resetting your search query or template category filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedTemplateFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Grid View */}
      {!isLoading && !fetchError && filteredResumes.length > 0 && viewMode === 'grid' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '22px',
          }}
        >
          {filteredResumes.map((resume) => {
            const hasLatex = !!resume.currentLatex;
            const versionNum = resume.currentVersion || 1;
            const templateName = resume.templateId || 'Modern';

            return (
              <Card
                key={resume._id}
                onClick={() => navigate(`/resumes/${resume._id}`)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '230px',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: 0,
                  border: '1px solid var(--border-default)',
                }}
              >
                {/* Template Accent Color Strip */}
                <div
                  style={{
                    height: '4px',
                    width: '100%',
                    background: getTemplateGradient(resume.templateId),
                  }}
                />

                <div style={{ padding: '22px 22px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Top Bar Badges */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Badge variant="primary" size="sm">
                        {templateName}
                      </Badge>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: hasLatex ? 'var(--success-bg)' : 'rgba(255, 255, 255, 0.06)',
                          color: hasLatex ? 'var(--success-text)' : 'var(--text-muted)',
                          border: `1px solid ${hasLatex ? 'var(--success-border)' : 'var(--border-subtle)'}`,
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: hasLatex ? 'var(--success-solid)' : 'var(--text-muted)',
                          }}
                        />
                        {hasLatex ? 'LaTeX Compiled' : 'Draft'}
                      </span>
                    </div>

                    <Badge variant="default" size="sm">
                      v{versionNum}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '1.1875rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      lineHeight: 1.35,
                    }}
                  >
                    {resume.title}
                  </h3>

                  {/* Metadata info */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={13} />
                      <span>{formatDate(resume.updatedAt)}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FileCode size={13} />
                      <span>{hasLatex ? 'XeTeX Ready' : 'Structured Only'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer action bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 22px',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/resumes/${resume._id}`)}
                    leftIcon={<Edit3 size={14} />}
                  >
                    Open Studio
                  </Button>

                  <button
                    onClick={() => setResumeToDelete(resume)}
                    title="Delete resume"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.15s ease, background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--danger-text)';
                      e.currentTarget.style.backgroundColor = 'var(--danger-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* List View */}
      {!isLoading && !fetchError && filteredResumes.length > 0 && viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredResumes.map((resume) => {
            const hasLatex = !!resume.currentLatex;
            return (
              <div
                key={resume._id}
                onClick={() => navigate(`/resumes/${resume._id}`)}
                className="card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-400)',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={20} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {resume.title}
                      </h4>
                      <Badge variant="primary" size="sm">{resume.templateId || 'Modern'}</Badge>
                      <Badge variant="default" size="sm">v{resume.currentVersion || 1}</Badge>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Updated {formatDate(resume.updatedAt)} • {hasLatex ? 'LaTeX Ready' : 'Draft'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/resumes/${resume._id}`)} leftIcon={<Edit3 size={14} />}>
                    Open
                  </Button>
                  <button
                    onClick={() => setResumeToDelete(resume)}
                    title="Delete resume"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger-text)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Starter Templates Gallery */}
      {!isLoading && (
        <div style={{ marginTop: '20px', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Start from a Professional Template
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Jumpstart a new tailored resume with preconfigured LaTeX typography layouts
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => {
                  setIsCreateModalOpen(true);
                }}
                className="card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-surface)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>
                      {tmpl.name}
                    </div>
                    <Badge variant="primary" size="sm">{tmpl.badge}</Badge>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {tmpl.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-400)' }}>
                  <span>Use layout</span>
                  <ArrowUpRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Resume Modal */}
      <ResumeCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newResume) => {
          setResumes((prev) => [newResume, ...prev]);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!resumeToDelete}
        onClose={() => setResumeToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Resume"
        message={`Are you sure you want to permanently delete "${resumeToDelete?.title}"? All versions and generated PDFs for this resume will be removed.`}
        confirmText="Delete Resume"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};
