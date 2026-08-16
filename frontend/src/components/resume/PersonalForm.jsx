import React from 'react';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import { Button } from '../common/Button';
import { Sparkles, User, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../common/Icons';

export const PersonalForm = ({
  personal = {},
  onChange,
  onAiGenerateSummary,
  isAiGenerating = false,
}) => {
  const handleChange = (field, value) => {
    onChange({
      ...personal,
      [field]: value,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          value={personal.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          leftIcon={<User size={15} />}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. john@example.com"
          value={personal.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          leftIcon={<Mail size={15} />}
        />

        <Input
          label="Phone Number"
          placeholder="e.g. +1 (555) 019-2834"
          value={personal.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          leftIcon={<Phone size={15} />}
        />

        <Input
          label="Location"
          placeholder="e.g. San Francisco, CA"
          value={personal.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          leftIcon={<MapPin size={15} />}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        <Input
          label="Portfolio / Website"
          placeholder="https://johndoe.dev"
          value={personal.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
          leftIcon={<Globe size={15} />}
        />

        <Input
          label="LinkedIn Profile"
          placeholder="https://linkedin.com/in/johndoe"
          value={personal.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
          leftIcon={<LinkedinIcon size={15} />}
        />

        <Input
          label="GitHub Profile"
          placeholder="https://github.com/johndoe"
          value={personal.github || ''}
          onChange={(e) => handleChange('github', e.target.value)}
          leftIcon={<GithubIcon size={15} />}
        />
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
            flexWrap: 'wrap',
            gap: '6px',
          }}
        >
          <label
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            Professional Summary
          </label>
          {onAiGenerateSummary && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAiGenerateSummary}
              isLoading={isAiGenerating}
              leftIcon={<Sparkles size={13} color="var(--primary-400)" />}
              style={{
                borderColor: 'var(--primary-500)',
                color: 'var(--primary-200)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                padding: '4px 10px',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
              }}
            >
              Generate with AI
            </Button>
          )}
        </div>

        <TextArea
          rows={5}
          placeholder="Write a compelling 3-4 sentence overview of your career trajectory, core strengths, and domain expertise..."
          value={personal.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          style={{
            minHeight: '120px',
            lineHeight: 1.6,
            fontSize: '0.875rem',
          }}
        />
      </div>
    </div>
  );
};
