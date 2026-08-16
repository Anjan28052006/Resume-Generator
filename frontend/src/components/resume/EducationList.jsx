import React from 'react';
import { EducationItem } from './EducationItem';
import { Button } from '../common/Button';
import { Plus, GraduationCap } from 'lucide-react';

export const EducationList = ({
  items = [],
  onChange,
}) => {
  const handleAddItem = () => {
    const newItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
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
          <GraduationCap size={16} color="var(--primary-400)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Education ({items.length})
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={handleAddItem} leftIcon={<Plus size={14} />}>
          Add Education
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
            No education entries added yet.
          </p>
          <Button variant="outline" size="sm" onClick={handleAddItem} leftIcon={<Plus size={13} />}>
            Add Education
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item, index) => (
            <EducationItem
              key={item.id || index}
              item={item}
              onChange={(updated) => handleUpdateItem(index, updated)}
              onRemove={() => handleRemoveItem(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
