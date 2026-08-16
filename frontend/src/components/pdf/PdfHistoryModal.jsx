import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Skeleton } from '../common/Skeleton';
import { resumeApi } from '../../api/resume.api';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errors';
import { Download, ExternalLink, FileText, CheckCircle2, Clock } from 'lucide-react';

export const PdfHistoryModal = ({
  isOpen,
  onClose,
  resumeId,
}) => {
  const { error } = useToast();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchFiles = useCallback(async () => {
    if (!resumeId || !isOpen) return;

    try {
      setIsLoading(true);
      const data = await resumeApi.getResumeFiles(resumeId);
      setFiles(data || []);
    } catch (err) {
      error(getErrorMessage(err, 'Failed to fetch generated PDF files.'));
    } finally {
      setIsLoading(false);
    }
  }, [resumeId, isOpen, error]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDownload = async (file) => {
    try {
      setDownloadingId(file._id);
      await resumeApi.downloadFile(resumeId, file._id, `resume-${file._id.slice(-6)}.pdf`);
    } catch (err) {
      error(getErrorMessage(err, 'Failed to download PDF file.'));
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const d = new Date(dateString);
      return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generated PDF History"
      subtitle="History of all compiled PDF documents for this resume"
      maxWidth="600px"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} height="60px" borderRadius="var(--radius-md)" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div
          style={{
            padding: '36px 16px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
          }}
        >
          <FileText size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
          <p>No generated PDF files found for this resume.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {files.map((file) => (
            <div
              key={file._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: `1px solid ${file.isLatest ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: file.isLatest ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: file.isLatest ? 'var(--primary-400)' : 'var(--text-muted)',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                      PDF Artifact
                    </span>
                    {file.isLatest ? (
                      <Badge variant="success" size="sm" icon={<CheckCircle2 size={11} />}>
                        Latest
                      </Badge>
                    ) : (
                      <Badge variant="default" size="sm">
                        Archive
                      </Badge>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap' }}>
                    <Clock size={11} flexShrink={0} />
                    <span>{formatDate(file.createdAt)}</span>
                    {file.latexHash && (
                      <span style={{ fontFamily: 'var(--font-mono)' }}>
                        • {file.latexHash.slice(0, 7)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {file.url && (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      gap: '4px',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <ExternalLink size={12} />
                    <span>View</span>
                  </a>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload(file)}
                  isLoading={downloadingId === file._id}
                  leftIcon={<Download size={13} />}
                  style={{ whiteSpace: 'nowrap', padding: '5px 10px', fontSize: '0.75rem' }}
                >
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
