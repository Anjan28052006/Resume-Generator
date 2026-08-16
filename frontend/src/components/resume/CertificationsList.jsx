import React from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Award, Plus, Trash2 } from 'lucide-react';

export const CertificationsList = ({
  items = [],
  onChange,
}) => {
  const handleAddItem = () => {
    const newItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      url: '',
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
          <Award size={16} color="var(--primary-400)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Certifications & Licenses ({items.length})
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={handleAddItem} leftIcon={<Plus size={14} />}>
          Add Certificate
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, index) => (
          <div
            key={item.id || index}
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
              gap: '12px',
              alignItems: 'flex-end',
            }}
          >
            <Input
              label="Certificate Name"
              placeholder="e.g. AWS Solutions Architect"
              value={item.name || ''}
              onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
            />
            <Input
              label="Issuing Organization"
              placeholder="e.g. Amazon Web Services"
              value={item.issuer || ''}
              onChange={(e) => handleUpdateItem(index, 'issuer', e.target.value)}
            />
            <Input
              label="Date Issued"
              placeholder="e.g. 2023-08"
              value={item.date || ''}
              onChange={(e) => handleUpdateItem(index, 'date', e.target.value)}
            />
            <Input
              label="Verification URL"
              placeholder="https://credly.com/..."
              value={item.url || ''}
              onChange={(e) => handleUpdateItem(index, 'url', e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              title="Remove certificate"
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
