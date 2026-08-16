import React from 'react';
import { ExperienceItem } from './ExperienceItem';
import { Button } from '../common/Button';
import { Plus, Briefcase } from 'lucide-react';

export const ExperienceList = ({
  items = [],
  onChange,
  onAiImprove,
}) => {
  const handleAddItem = () => {
    const newItem = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: [''],
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (index, updatedItem) => {
    const next = [...items];
    next[index] = updatedItem;
    onChange(next);
  };

  const handleRemoveItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={16} color="var(--primary-400)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Work Experience ({items.length})
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={handleAddItem} leftIcon={<Plus size={14} />}>
          Add Experience
        </Button>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-subtle)',
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            No work experience added yet.
          </p>
          <Button variant="outline" size="sm" onClick={handleAddItem} leftIcon={<Plus size={13} />}>
            Add First Position
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item, index) => (
            <ExperienceItem
              key={item.id || index}
              item={item}
              onChange={(updated) => handleUpdateItem(index, updated)}
              onRemove={() => handleRemoveItem(index)}
              onAiImprove={onAiImprove}
            />
          ))}
        </div>
      )}
    </div>
  );
};
