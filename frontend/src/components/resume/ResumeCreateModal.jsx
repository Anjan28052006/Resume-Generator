import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { resumeApi } from '../../api/resume.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { TEMPLATES } from '../../utils/constants';
import { createDefaultResumeContent } from '../../utils/resumeDefaults';
import { getErrorMessage } from '../../utils/errors';
import { Sparkles, Check, LayoutTemplate } from 'lucide-react';

export const ResumeCreateModal = ({ isOpen, onClose, onCreated }) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('My Professional Resume');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [includeBoilerplate, setIncludeBoilerplate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [titleError, setTitleError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setTitleError('');

    if (!title.trim()) {
      setTitleError('Please provide a title for your resume.');
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

      const newResume = await resumeApi.createResume({
        title: title.trim(),
        templateId: selectedTemplate,
        content: initialContent,
        status: 'draft',
      });

      success('Resume created successfully!', 'Created');
      onClose();
      if (onCreated) {
        onCreated(newResume);
      }
      navigate(`/resumes/${newResume._id}`);
    } catch (err) {
      error(getErrorMessage(err, 'Failed to create resume.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Resume"
      subtitle="Choose a title and starting template for your resume"
      maxWidth="600px"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            isLoading={isLoading}
            leftIcon={<Sparkles size={16} />}
          >
            Create Resume
          </Button>
        </>
      }
    >
      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Input
          label="Resume Title"
          placeholder="e.g. Senior Software Engineer 2026"
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
              marginBottom: '10px',
              display: 'block',
            }}
          >
            Select Layout Template
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px',
            }}
          >
            {TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                    backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <LayoutTemplate size={16} color={isSelected ? 'var(--primary-400)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        {tmpl.name}
                      </span>
                    </div>
                    {isSelected ? (
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
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
                      <Badge size="sm" variant="default">
                        {tmpl.badge}
                      </Badge>
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
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
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <input
            type="checkbox"
            id="includeBoilerplate"
            checked={includeBoilerplate}
            onChange={(e) => setIncludeBoilerplate(e.target.checked)}
            style={{ accentColor: 'var(--primary-600)', width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="includeBoilerplate" style={{ fontSize: '0.8125rem', color: 'var(--text-main)', cursor: 'pointer' }}>
            Prefill with professional resume template fields and sample entries
          </label>
        </div>
      </form>
    </Modal>
  );
};
