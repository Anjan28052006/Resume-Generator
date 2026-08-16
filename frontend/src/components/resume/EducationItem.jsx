import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Trash2, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';

export const EducationItem = ({
  item,
  onChange,
  onRemove,
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
            {item.degree ? `${item.degree}${item.fieldOfStudy ? ` in ${item.fieldOfStudy}` : ''}` : 'Untitled Degree'}
          </span>
          {item.institution && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              at {item.institution}
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
            title="Remove education entry"
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
              label="Institution / University"
              placeholder="e.g. Stanford University"
              value={item.institution || ''}
              onChange={(e) => handleFieldChange('institution', e.target.value)}
            />

            <Input
              label="Degree"
              placeholder="e.g. Bachelor of Science, Master's"
              value={item.degree || ''}
              onChange={(e) => handleFieldChange('degree', e.target.value)}
            />

            <Input
              label="Field of Study / Major"
              placeholder="e.g. Computer Science"
              value={item.fieldOfStudy || ''}
              onChange={(e) => handleFieldChange('fieldOfStudy', e.target.value)}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              alignItems: 'flex-end',
            }}
          >
            <Input
              label="Location"
              placeholder="e.g. Stanford, CA"
              value={item.location || ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
            />

            <Input
              label="Start Date"
              placeholder="e.g. 2018-09"
              value={item.startDate || ''}
              onChange={(e) => handleFieldChange('startDate', e.target.value)}
            />

            <Input
              label="End Date"
              placeholder="e.g. 2022-05"
              value={item.endDate || ''}
              onChange={(e) => handleFieldChange('endDate', e.target.value)}
            />

            <Input
              label="GPA / Honors"
              placeholder="e.g. 3.9 / 4.0, Magna Cum Laude"
              value={item.gpa || ''}
              onChange={(e) => handleFieldChange('gpa', e.target.value)}
            />
          </div>

          {/* Honors / Activities */}
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
                Honors, Activities & Coursework
              </label>
              <Button variant="ghost" size="sm" onClick={handleAddHighlight} leftIcon={<Plus size={13} />}>
                Add Item
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(item.highlights || []).map((highlight, hIndex) => (
                <div key={hIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>•</span>
                  <Input
                    placeholder="e.g. President of Computer Science Society, Dean's List (all semesters)"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(hIndex, e.target.value)}
                    style={{ padding: '7px 10px', fontSize: '0.8125rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(hIndex)}
                    title="Remove item"
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
