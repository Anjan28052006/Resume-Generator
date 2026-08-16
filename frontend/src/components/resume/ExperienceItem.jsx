import React, { useState } from 'react';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import { Button } from '../common/Button';
import { Trash2, Sparkles, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

export const ExperienceItem = ({
  item,
  onChange,
  onRemove,
  onAiImprove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFieldChange = (field, value) => {
    onChange({
      ...item,
      [field]: value,
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
        transition: 'border-color 0.15s ease',
      }}
    >
      {/* Header bar */}
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
            {item.position || 'Untitled Position'}
          </span>
          {item.company && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              at {item.company}
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
            title="Remove experience entry"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: 'var(--radius-xs)',
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

      {/* Expanded Content Form */}
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
              label="Job Position / Role"
              placeholder="e.g. Senior Frontend Engineer"
              value={item.position || ''}
              onChange={(e) => handleFieldChange('position', e.target.value)}
            />

            <Input
              label="Company / Organization"
              placeholder="e.g. Google, Stripe"
              value={item.company || ''}
              onChange={(e) => handleFieldChange('company', e.target.value)}
            />

            <Input
              label="Location"
              placeholder="e.g. New York, NY (Remote)"
              value={item.location || ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
            }}
          >
            <Input
              label="Start Date"
              placeholder="e.g. 2022-01 or Jan 2022"
              value={item.startDate || ''}
              onChange={(e) => handleFieldChange('startDate', e.target.value)}
            />

            <Input
              label="End Date"
              placeholder="e.g. Present or 2024-05"
              value={item.endDate || ''}
              onChange={(e) => handleFieldChange('endDate', e.target.value)}
            />
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Overview Description
              </label>
              {item.description && onAiImprove && (
                <button
                  type="button"
                  onClick={() => onAiImprove(item.description, 'Experience Description', (improved) => handleFieldChange('description', improved))}
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
              placeholder="Describe core mandate, team scope, and primary technologies used..."
              value={item.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
            />
          </div>

          {/* Bullet Point Highlights */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Key Achievements / Bullet Points
              </label>
              <Button variant="ghost" size="sm" onClick={handleAddHighlight} leftIcon={<Plus size={13} />}>
                Add Bullet
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(item.highlights || []).map((highlight, hIndex) => (
                <div key={hIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>•</span>
                  <div style={{ flex: 1 }}>
                    <Input
                      placeholder="e.g. Scaled database queries to handle 2M daily active users with 99.99% uptime"
                      value={highlight}
                      onChange={(e) => handleHighlightChange(hIndex, e.target.value)}
                      style={{ padding: '7px 10px', fontSize: '0.8125rem' }}
                    />
                  </div>
                  {highlight && onAiImprove && (
                    <button
                      type="button"
                      onClick={() => onAiImprove(highlight, 'Experience Bullet Point', (improved) => handleHighlightChange(hIndex, improved))}
                      title="Improve bullet with AI"
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
                    title="Remove bullet point"
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
