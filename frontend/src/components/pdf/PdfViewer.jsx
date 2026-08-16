import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Download,
  ExternalLink,
  RefreshCw,
  FileText,
  Loader2,
  History,
  CheckCircle2,
} from 'lucide-react';

export const PdfViewer = ({
  pdfUrl = null,
  isCompiling = false,
  onCompile = null,
  onOpenHistory = null,
  onDownload = null,
  isDownloading = false,
}) => {
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefreshIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 160px)',
        minHeight: '600px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* PDF Header Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '8px',
          zIndex: 5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flexShrink: 1 }}>
          <FileText size={16} color="var(--primary-400)" flexShrink={0} />
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.875rem',
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            PDF Preview
          </span>
          {pdfUrl && !isCompiling && (
            <Badge variant="success" size="sm" icon={<CheckCircle2 size={11} />}>
              Live
            </Badge>
          )}
        </div>

        {/* Action controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {pdfUrl && (
            <button
              type="button"
              onClick={handleRefreshIframe}
              title="Reload preview"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '5px 7px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RefreshCw size={13} />
            </button>
          )}

          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              title="View PDF generation history"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '5px 8px',
                borderRadius: 'var(--radius-sm)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
              }}
            >
              <History size={13} />
              <span className="hide-on-mobile">History</span>
            </button>
          )}

          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open PDF in new browser tab"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <ExternalLink size={13} />
              <span className="hide-on-mobile">Full Tab</span>
            </a>
          )}

          {onDownload && (
            <Button
              variant="primary"
              size="sm"
              onClick={onDownload}
              isLoading={isDownloading}
              disabled={!pdfUrl || isCompiling}
              leftIcon={<Download size={13} />}
              style={{ whiteSpace: 'nowrap', padding: '5px 10px', fontSize: '0.75rem' }}
              title="Download compiled PDF file"
            >
              Download
            </Button>
          )}
        </div>
      </div>

      {/* PDF Viewport Canvas */}
      <div
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#121620',
          overflow: 'hidden',
        }}
      >
        {/* Compiling state overlay */}
        {isCompiling && (
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(9, 13, 22, 0.92)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <Loader2 className="animate-spin" size={32} color="var(--primary-400)" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Compiling LaTeX with Tectonic...
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: 1.5 }}>
              Rendering typography, resolving document layout, and uploading to Cloudinary
            </p>
          </div>
        )}

        {/* Empty state: No PDF compiled yet */}
        {!pdfUrl && !isCompiling && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              padding: '28px',
              textAlign: 'center',
              maxWidth: '380px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <FileText size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '4px' }}>
                No PDF Preview Available
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Click below to compile your LaTeX into a high-resolution PDF document.
              </p>
            </div>
            {onCompile && (
              <Button
                variant="primary"
                size="md"
                onClick={onCompile}
                leftIcon={<RefreshCw size={14} />}
              >
                Compile PDF Now
              </Button>
            )}
          </div>
        )}

        {/* Live Full-Size PDF Viewport */}
        {pdfUrl && (
          <iframe
            key={iframeKey}
            src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#121620',
              display: 'block',
            }}
          />
        )}
      </div>
    </div>
  );
};
