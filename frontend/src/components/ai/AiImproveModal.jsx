import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { aiApi } from '../../api/ai.api';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errors';
import { Sparkles, ArrowRight, Check, RefreshCw } from 'lucide-react';

export const AiImproveModal = ({
  isOpen,
  onClose,
  resumeId,
  initialText = '',
  section = 'General',
  onApply,
}) => {
  const { error } = useToast();
  const [originalText, setOriginalText] = useState(initialText);
  const [improvedText, setImprovedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchImprovement = async () => {
    if (!resumeId || !initialText.trim()) return;

    try {
      setIsLoading(true);
      const data = await aiApi.improveText(resumeId, initialText, section);
      setOriginalText(data.originalText || initialText);
      setImprovedText(data.improvedText || '');
    } catch (err) {
      error(getErrorMessage(err, 'Failed to generate AI improvement.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && initialText) {
      setOriginalText(initialText);
      setImprovedText('');
      fetchImprovement();
    }
  }, [isOpen, initialText]);

  const handleApply = () => {
    if (onApply && improvedText) {
      onApply(improvedText);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Text Enhancement"
      subtitle={`Refine and strengthen your ${section} with professional, action-driven phrasing`}
      maxWidth="700px"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={fetchImprovement}
            isLoading={isLoading}
            leftIcon={<RefreshCw size={14} />}
          >
            Regenerate
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={!improvedText || isLoading}
            leftIcon={<Check size={16} />}
          >
            Apply to Resume
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Original vs Improved Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {/* Original Text Box */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Original Content
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
              {originalText}
            </p>
          </div>

          {/* Improved Text Box */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid var(--primary-500)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-300)', textTransform: 'uppercase' }}>
              <Sparkles size={13} />
              AI Enhanced Phrasing
            </div>
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '24px 0', color: 'var(--primary-300)', fontSize: '0.875rem' }}>
                <RefreshCw size={16} className="animate-spin" />
                <span>Refining with Gemini AI...</span>
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5, fontWeight: 500, flex: 1 }}>
                {improvedText || 'No suggestion available.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
