import React from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Languages as LangIcon, Plus, Trash2 } from 'lucide-react';

export const LanguagesList = ({
  items = [],
  onChange,
}) => {
  const handleAddItem = () => {
    const newItem = {
      id: `lang-${Date.now()}`,
      language: '',
      proficiency: 'Professional Working',
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const handleRemoveItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LangIcon size={16} color="var(--primary-400)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Languages ({items.length})
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={handleAddItem} leftIcon={<Plus size={14} />}>
          Add Language
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, index) => (
          <div
            key={item.id || index}
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr auto',
              gap: '12px',
              alignItems: 'flex-end',
            }}
          >
            <Input
              label="Language"
              placeholder="e.g. English, Spanish, German"
              value={item.language || ''}
              onChange={(e) => handleUpdateItem(index, 'language', e.target.value)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Proficiency Level
              </label>
              <select
                value={item.proficiency || 'Professional Working'}
                onChange={(e) => handleUpdateItem(index, 'proficiency', e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '9px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              >
                <option value="Native / Bilingual">Native / Bilingual</option>
                <option value="Full Professional">Full Professional</option>
                <option value="Professional Working">Professional Working</option>
                <option value="Limited Working">Limited Working</option>
                <option value="Elementary">Elementary</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              title="Remove language"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '8px',
                marginBottom: '2px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
