import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Skeleton } from '../common/Skeleton';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { versionApi } from '../../api/version.api';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errors';
import { History, RotateCcw, Clock, Sparkles, User, CheckCircle2 } from 'lucide-react';

export const VersionHistoryModal = ({
  isOpen,
  onClose,
  resumeId,
  currentVersion = 1,
  onVersionRestored,
}) => {
  const { success, error } = useToast();
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const fetchVersions = useCallback(async () => {
    if (!resumeId || !isOpen) return;

    try {
      setIsLoading(true);
      const data = await versionApi.getVersions(resumeId);
      setVersions(data || []);
    } catch (err) {
      error(getErrorMessage(err, 'Failed to fetch version history.'));
    } finally {
      setIsLoading(false);
    }
  }, [resumeId, isOpen, error]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const handleRestoreConfirm = async () => {
    if (!versionToRestore) return;

    try {
      setIsRestoring(true);
      const updatedResume = await versionApi.restoreVersion(
        resumeId,
        versionToRestore.versionNumber
      );
      success(`Version ${versionToRestore.versionNumber} successfully restored!`, 'Restored');
      setVersionToRestore(null);
      onClose();
      if (onVersionRestored) {
        onVersionRestored(updatedResume);
      }
    } catch (err) {
      error(getErrorMessage(err, 'Failed to restore version.'));
    } finally {
      setIsRestoring(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const d = new Date(dateString);
      return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Version Snapshot History"
        subtitle="View and restore previously saved snapshots of your resume"
        maxWidth="620px"
        footer={
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        }
      >
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} height="65px" borderRadius="var(--radius-md)" />
            ))}
          </div>
        ) : versions.length === 0 ? (
          <div
            style={{
              padding: '36px 16px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
            }}
          >
            <History size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p>No previous version snapshots saved yet.</p>
            <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>
              Snapshots are automatically created whenever you save edits or run AI improvements.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {versions.map((ver) => {
              const isCurrent = ver.versionNumber === currentVersion;
              return (
                <div
                  key={ver._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface)',
                    border: `1px solid ${isCurrent ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
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
                        backgroundColor: ver.createdBy === 'ai' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: ver.createdBy === 'ai' ? 'var(--primary-400)' : 'var(--text-secondary)',
                        flexShrink: 0,
                      }}
                    >
                      {ver.createdBy === 'ai' ? <Sparkles size={15} /> : <User size={15} />}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                          Version {ver.versionNumber}
                        </span>
                        <Badge
                          variant={ver.createdBy === 'ai' ? 'primary' : 'default'}
                          size="sm"
                        >
                          {ver.createdBy === 'ai' ? 'AI' : 'Saved'}
                        </Badge>
                        {isCurrent && (
                          <Badge variant="success" size="sm" icon={<CheckCircle2 size={11} />}>
                            Current
                          </Badge>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap' }}>
                        <Clock size={11} flexShrink={0} />
                        <span>{formatDate(ver.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVersionToRestore(ver)}
                    disabled={isCurrent}
                    leftIcon={<RotateCcw size={13} />}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Restore
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Restore Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!versionToRestore}
        onClose={() => setVersionToRestore(null)}
        onConfirm={handleRestoreConfirm}
        title="Restore Resume Version"
        message={`Are you sure you want to restore Version ${versionToRestore?.versionNumber}? Your current state will be safely archived as a new version snapshot.`}
        confirmText="Restore Version"
        variant="primary"
        isLoading={isRestoring}
      />
    </>
  );
};
