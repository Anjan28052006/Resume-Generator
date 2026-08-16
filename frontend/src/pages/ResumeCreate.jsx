import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resumeApi } from '../api/resume.api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { TEMPLATES } from '../utils/constants';
import { createDefaultResumeContent } from '../utils/resumeDefaults';
import { getErrorMessage } from '../utils/errors';
import { ArrowLeft, Sparkles, Check, LayoutTemplate } from 'lucide-react';

export const ResumeCreate = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('My Professional Resume');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [includeBoilerplate, setIncludeBoilerplate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [titleError, setTitleError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTitleError('');

    if (!title.trim()) {
      setTitleError('Please enter a resume title.');
      return;
    }

    try {
      setIsLoading(true);
      const initialContent = includeBoilerplate
        ? createDefaultResumeContent(user?.name || '', user?.email || '')
        : {
            personal: { fullName: user?.name || '', email: user?.email || '' },
            experience: [],
            education: [],
            projects: [],
            skills: [],
            certifications: [],
            languages: [],
          };

      const resume = await resumeApi.createResume({
        title: title.trim(),
        templateId: selectedTemplate,
        content: initialContent,
        status: 'draft',
      });

      success('Resume created successfully!', 'Created');
      navigate(`/resumes/${resume._id}`);
    } catch (err) {
      error(getErrorMessage(err, 'Failed to create resume.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', width: '100%' }}>
      {/* Back button */}
      <div style={{ marginBottom: '20px' }}>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      <div
        className="card"
        style={{
          padding: '36px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
            Create New Resume
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Choose a starting layout and configure your resume title
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Input
            label="Resume Title"
            placeholder="e.g. Lead Full-Stack Engineer 2026"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={titleError}
            required
            autoFocus
          />

          <div>
            <label
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '12px',
                display: 'block',
              }}
            >
              Choose Template
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '14px',
              }}
            >
              {TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isSelected ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                      backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LayoutTemplate
                          size={16}
                          color={isSelected ? 'var(--primary-400)' : 'var(--text-muted)'}
                        />
                        <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)' }}>
                          {tmpl.name}
                        </span>
                      </div>
                      {isSelected ? (
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-600)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={12} color="#ffffff" />
                        </div>
                      ) : (
                        <Badge size="sm">{tmpl.badge}</Badge>
                      )}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {tmpl.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <input
              type="checkbox"
              id="includeBoilerplateFull"
              checked={includeBoilerplate}
              onChange={(e) => setIncludeBoilerplate(e.target.checked)}
              style={{ accentColor: 'var(--primary-600)', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="includeBoilerplateFull" style={{ fontSize: '0.875rem', color: 'var(--text-main)', cursor: 'pointer' }}>
              Populate with structured sample sections (Experience, Education, Projects, Skills)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button variant="ghost" onClick={() => navigate('/dashboard')} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              leftIcon={<Sparkles size={16} />}
            >
              Create and Open Workspace
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
