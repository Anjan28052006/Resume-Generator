import React, { useState } from 'react';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import { Button } from '../common/Button';
import { Trash2, Sparkles, Plus, X, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';
import { GithubIcon } from '../common/Icons';

export const ProjectItem = ({
  item,
  onChange,
  onRemove,
  onAiImprove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [techInput, setTechInput] = useState('');

  const handleFieldChange = (field, value) => {
    onChange({
      ...item,
      [field]: value,
    });
  };

  const handleAddTech = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = techInput.trim().replace(/,/g, '');
      if (val && !(item.technologies || []).includes(val)) {
        onChange({
          ...item,
          technologies: [...(item.technologies || []), val],
        });
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove) => {
    onChange({
      ...item,
      technologies: (item.technologies || []).filter((t) => t !== techToRemove),
    });
  };

  const handleAddHighlight = () => {
    const highlights = item.highlights || [];
    onChange({
      ...item,
      highlights: [...highlights, ''],
    });
  };

  const handleHighlightChange = (index, value) => {
    const highlights = [...(item.highlights || [])];
    highlights[index] = value;
    onChange({
      ...item,
      highlights,
    });
  };

  const handleRemoveHighlight = (index) => {
    const highlights = (item.highlights || []).filter((_, i) => i !== index);
    onChange({
      ...item,
      highlights,
    });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
            {item.name || 'Untitled Project'}
          </span>
          {(item.technologies || []).length > 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({(item.technologies || []).slice(0, 3).join(', ')})
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove project"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger-text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <Trash2 size={15} />
          </button>
          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            <Input
              label="Project Name"
              placeholder="e.g. Distributed Task Orchestrator"
              value={item.name || ''}
              onChange={(e) => handleFieldChange('name', e.target.value)}
            />

            <Input
              label="Demo / Live URL"
              placeholder="https://example.com"
              value={item.link || ''}
              onChange={(e) => handleFieldChange('link', e.target.value)}
              leftIcon={<LinkIcon size={14} />}
            />

            <Input
              label="Repository URL"
              placeholder="https://github.com/user/project"
              value={item.github || ''}
              onChange={(e) => handleFieldChange('github', e.target.value)}
              leftIcon={<GithubIcon size={14} />}
            />
          </div>

          {/* Tech Stack Chips */}
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Technologies Used (press Enter or comma to add)
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                padding: '6px 10px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                alignItems: 'center',
              }}
            >
              {(item.technologies || []).map((tech) => (
                <span
                  key={tech}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    color: 'var(--primary-200)',
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={(item.technologies || []).length === 0 ? "e.g. React, Node.js, Docker..." : "Add tech..."}
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.8125rem',
                  flex: 1,
                  minWidth: '100px',
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Description
              </label>
              {item.description && onAiImprove && (
                <button
                  type="button"
                  onClick={() => onAiImprove(item.description, 'Project Description', (improved) => handleFieldChange('description', improved))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: 'var(--primary-300)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Sparkles size={12} />
                  AI Improve
                </button>
              )}
            </div>
            <TextArea
              rows={2}
              placeholder="Brief summary of the project goals, architecture, and impact..."
              value={item.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
            />
          </div>

          {/* Highlights */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Highlights / Key Features
              </label>
              <Button variant="ghost" size="sm" onClick={handleAddHighlight} leftIcon={<Plus size={13} />}>
                Add Highlight
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(item.highlights || []).map((highlight, hIndex) => (
                <div key={hIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>•</span>
                  <Input
                    placeholder="e.g. Designed resilient failover mechanism cutting downtime by 80%"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(hIndex, e.target.value)}
                    style={{ padding: '7px 10px', fontSize: '0.8125rem' }}
                  />
                  {highlight && onAiImprove && (
                    <button
                      type="button"
                      onClick={() => onAiImprove(highlight, 'Project Highlight', (improved) => handleHighlightChange(hIndex, improved))}
                      title="Improve with AI"
                      style={{
                        padding: '6px',
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--primary-400)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Sparkles size={13} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(hIndex)}
                    title="Remove highlight"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
