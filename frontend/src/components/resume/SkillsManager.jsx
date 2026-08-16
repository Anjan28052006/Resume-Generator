import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Plus, X, Trash2, Cpu } from 'lucide-react';

export const SkillsManager = ({
  skills = [],
  onChange,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [activeTagInputs, setActiveTagInputs] = useState({});

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory = {
      id: `skill-${Date.now()}`,
      category: newCategoryName.trim(),
      items: [],
    };
    onChange([...skills, newCategory]);
    setNewCategoryName('');
  };

  const handleRemoveCategory = (index) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleCategoryNameChange = (index, newName) => {
    const next = [...skills];
    next[index] = { ...next[index], category: newName };
    onChange(next);
  };

  const handleAddSkillTag = (index, e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const currentInput = (activeTagInputs[index] || '').trim().replace(/,/g, '');
      if (currentInput) {
        const next = [...skills];
        const items = next[index].items || [];
        if (!items.includes(currentInput)) {
          next[index] = {
            ...next[index],
            items: [...items, currentInput],
          };
          onChange(next);
        }
        setActiveTagInputs((prev) => ({ ...prev, [index]: '' }));
      }
    }
  };

  const handleRemoveSkillTag = (catIndex, skillToRemove) => {
    const next = [...skills];
    next[catIndex] = {
      ...next[catIndex],
      items: (next[catIndex].items || []).filter((item) => item !== skillToRemove),
    };
    onChange(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={16} color="var(--primary-400)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Skills & Competencies ({skills.length} categories)
          </span>
        </div>
      </div>

      {/* Add New Category Input */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Add new category (e.g. Cloud & DevOps, Databases, Soft Skills)..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCategory();
              }
            }}
          />
        </div>
        <Button variant="secondary" size="md" onClick={handleAddCategory} leftIcon={<Plus size={14} />}>
          Add Category
        </Button>
      </div>

      {/* Skill Categories List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {skills.map((cat, catIndex) => (
          <div
            key={cat.id || catIndex}
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <input
                type="text"
                value={cat.category}
                onChange={(e) => handleCategoryNameChange(catIndex, e.target.value)}
                style={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  borderBottom: '1px dashed var(--border-subtle)',
                  paddingBottom: '2px',
                  flex: 1,
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveCategory(catIndex)}
                title="Remove category"
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
            </div>

            {/* Tag list */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                padding: '8px 10px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                alignItems: 'center',
              }}
            >
              {(cat.items || []).map((skill) => (
                <span
                  key={skill}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    color: 'var(--text-main)',
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkillTag(catIndex, skill)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <input
                type="text"
                placeholder="Type skill & press Enter..."
                value={activeTagInputs[catIndex] || ''}
                onChange={(e) =>
                  setActiveTagInputs((prev) => ({ ...prev, [catIndex]: e.target.value }))
                }
                onKeyDown={(e) => handleAddSkillTag(catIndex, e)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.8125rem',
                  flex: 1,
                  minWidth: '140px',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
