import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resumeApi } from '../api/resume.api';
import { latexApi } from '../api/latex.api';
import { aiApi } from '../api/ai.api';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../hooks/useToast';
import { StructuredEditor } from '../components/editor/StructuredEditor';
import { LatexEditor } from '../components/editor/LatexEditor';
import { ModeSwitch } from '../components/editor/ModeSwitch';
import { PdfViewer } from '../components/pdf/PdfViewer';
import { PdfHistoryModal } from '../components/pdf/PdfHistoryModal';
import { AiImproveModal } from '../components/ai/AiImproveModal';
import { VersionHistoryModal } from '../components/version/VersionHistoryModal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { Tabs } from '../components/common/Tabs';
import { getErrorMessage } from '../utils/errors';
import {
  ArrowLeft,
  Save,
  Play,
  Sparkles,
  History,
  Download,
  FileCode,
  Layers,
  CheckCircle2,
  RefreshCw,
  Eye,
  Edit3,
} from 'lucide-react';

export const ResumeEditor = () => {
  const { id: resumeId } = useParams();
  const navigate = useNavigate();
  const { success, error, info } = useToast();
  const { socket, joinResume, leaveResume } = useSocket();

  // Resume state
  const [resume, setResume] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState({});
  const [latex, setLatex] = useState('');
  const [latexHash, setLatexHash] = useState(null);
  const [latestPdfUrl, setLatestPdfUrl] = useState(null);
  const [latestFileId, setLatestFileId] = useState(null);

  // Editor modes & layout state
  const [editorMode, setEditorMode] = useState('structured'); // 'structured' | 'latex'
  const [mobileView, setMobileView] = useState('editor'); // 'editor' | 'preview'
  const [isStructuredDirty, setIsStructuredDirty] = useState(false);
  const [isLatexDirty, setIsLatexDirty] = useState(false);

  // Async state indicators
  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const [isSavingStructured, setIsSavingStructured] = useState(false);
  const [isSavingLatex, setIsSavingLatex] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isGeneratingLatex, setIsGeneratingLatex] = useState(false);
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [compileError, setCompileError] = useState(null);

  // Modals state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPdfHistoryModalOpen, setIsPdfHistoryModalOpen] = useState(false);
  const [aiImproveState, setAiImproveState] = useState({
    isOpen: false,
    text: '',
    section: '',
    onApply: null,
  });

  // Ref to track last local action timestamp to prevent socket echo loops
  const lastLocalActionTime = useRef(0);

  // Load initial resume, latex, and generated files
  const loadResumeData = useCallback(async () => {
    if (!resumeId) return;

    try {
      setIsLoadingResume(true);
      const [resumeData, latexData, filesData] = await Promise.all([
        resumeApi.getResume(resumeId),
        latexApi.getResumeLatex(resumeId).catch(() => ({ currentLatex: '', latexHash: null })),
        resumeApi.getResumeFiles(resumeId).catch(() => []),
      ]);

      setResume(resumeData);
      setTitle(resumeData.title || 'Untitled Resume');
      setContent(resumeData.content || {});
      setLatex(latexData?.currentLatex || '');
      setLatexHash(latexData?.latexHash || null);

      const latestFile = (filesData || []).find((f) => f.isLatest) || filesData?.[0];
      if (latestFile) {
        setLatestPdfUrl(latestFile.url);
        setLatestFileId(latestFile._id);
      }
    } catch (err) {
      error(getErrorMessage(err, 'Failed to load resume workspace.'));
    } finally {
      setIsLoadingResume(false);
    }
  }, [resumeId, error]);

  useEffect(() => {
    loadResumeData();
  }, [loadResumeData]);

  // Socket.IO real-time synchronization
  useEffect(() => {
    if (!resumeId) return;

    joinResume(resumeId);

    if (socket) {
      const handleResumeUpdated = (data) => {
        // Prevent loop if change originated from our own direct save within 1.5 seconds
        if (Date.now() - lastLocalActionTime.current < 1500) {
          return;
        }

        if (data.resumeId === resumeId && data.resume) {
          setResume(data.resume);
          setTitle(data.resume.title);
          setContent(data.resume.content);
          setIsStructuredDirty(false);
          info('Resume updated in real-time.', 'Sync Update');
        }
      };

      const handleLatexUpdated = (data) => {
        if (Date.now() - lastLocalActionTime.current < 1500) {
          return;
        }

        if (data.resumeId === resumeId) {
          if (data.currentLatex !== undefined) {
            setLatex(data.currentLatex);
            setLatexHash(data.latexHash);
            setIsLatexDirty(false);
            info('LaTeX code updated in real-time.', 'Sync Update');
          }
        }
      };

      socket.on('resume:updated', handleResumeUpdated);
      socket.on('resume:latex-updated', handleLatexUpdated);

      return () => {
        socket.off('resume:updated', handleResumeUpdated);
        socket.off('resume:latex-updated', handleLatexUpdated);
        leaveResume(resumeId);
      };
    }
  }, [socket, resumeId, joinResume, leaveResume, info]);

  // Handle Structured Content Change
  const handleContentChange = (newContent) => {
    setContent(newContent);
    setIsStructuredDirty(true);
  };

  // Handle LaTeX Content Change
  const handleLatexChange = (newLatex) => {
    setLatex(newLatex);
    setIsLatexDirty(true);
  };

  // Action: Save Structured Resume
  const handleSaveStructured = async () => {
    try {
      setIsSavingStructured(true);
      lastLocalActionTime.current = Date.now();

      const updated = await resumeApi.updateResume(resumeId, {
        title: title.trim(),
        templateId: resume?.templateId || 'modern',
        content,
        status: resume?.status || 'draft',
      });

      setResume(updated);
      setIsStructuredDirty(false);
      success('Structured resume saved successfully!', 'Saved');
    } catch (err) {
      error(getErrorMessage(err, 'Failed to save resume.'));
    } finally {
      setIsSavingStructured(false);
    }
  };

  // Action: Save LaTeX
  const handleSaveLatex = async () => {
    try {
      setIsSavingLatex(true);
      lastLocalActionTime.current = Date.now();

      const result = await latexApi.updateResumeLatex(resumeId, latex);
      setLatex(result.currentLatex);
      setLatexHash(result.latexHash);
      setIsLatexDirty(false);
      success('LaTeX document saved successfully!', 'Saved');
    } catch (err) {
      error(getErrorMessage(err, 'Failed to save LaTeX.'));
    } finally {
      setIsSavingLatex(false);
    }
  };

  // Action: Generate LaTeX from Structured with Gemini AI
  const handleGenerateLatexFromStructured = async () => {
    try {
      setIsGeneratingLatex(true);
      setCompileError(null);

      // If structured content is dirty, save it first
      if (isStructuredDirty) {
        lastLocalActionTime.current = Date.now();
        await resumeApi.updateResume(resumeId, {
          title: title.trim(),
          templateId: resume?.templateId || 'modern',
          content,
        });
        setIsStructuredDirty(false);
      }

      const result = await latexApi.generateLatex(resumeId);
      setLatex(result.latex);
      setLatexHash(result.latexHash);
      setIsLatexDirty(false);
      setEditorMode('latex');
      success('LaTeX generated successfully from structured resume data!', 'AI Generated');
    } catch (err) {
      error(getErrorMessage(err, 'Failed to generate LaTeX.'));
    } finally {
      setIsGeneratingLatex(false);
    }
  };

  // Action: Compile LaTeX to PDF
  const handleCompile = async () => {
    try {
      setIsCompiling(true);
      setCompileError(null);
      lastLocalActionTime.current = Date.now();

      let compileResult;

      if (editorMode === 'structured') {
        // 1. If structured form was edited, save it first
        if (isStructuredDirty) {
          const updatedResume = await resumeApi.updateResume(resumeId, {
            title: title.trim(),
            templateId: resume?.templateId || 'modern',
            content,
            status: resume?.status || 'draft',
          });
          setResume(updatedResume);
          setIsStructuredDirty(false);
        }

        // 2. Generate updated LaTeX from structured form data & compile into PDF
        compileResult = await resumeApi.generateAndCompileResume(resumeId);
        if (compileResult.latex) {
          setLatex(compileResult.latex);
          setLatexHash(compileResult.latexHash);
        }
      } else {
        // Raw LaTeX mode:
        // 1. Save updated LaTeX if dirty
        if (isLatexDirty) {
          const saveRes = await latexApi.updateResumeLatex(resumeId, latex);
          setLatexHash(saveRes.latexHash);
          setIsLatexDirty(false);
        }

        // 2. Compile current LaTeX code
        compileResult = await resumeApi.compileResume(resumeId, latex);
      }

      const generatedFile = compileResult.data?.generatedFile || compileResult.generatedFile;
      if (generatedFile?.url) {
        // Append cache-busting timestamp so browser immediately updates iframe
        setLatestPdfUrl(`${generatedFile.url}?t=${Date.now()}`);
        setLatestFileId(generatedFile._id);
      }

      setIsLatexDirty(false);
      setIsStructuredDirty(false);
      success('Resume compiled into PDF successfully!', 'Live Preview Updated');
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to compile LaTeX into PDF.');
      setCompileError(msg);
      error(msg, 'Compilation Error');
    } finally {
      setIsCompiling(false);
    }
  };

  // Action: AI Generate Summary directly into structured resume
  const handleAiGenerateSummary = async () => {
    try {
      setIsGeneratingAiSummary(true);
      lastLocalActionTime.current = Date.now();

      const updated = await aiApi.generateResumeSummary(resumeId);
      setResume(updated);
      setContent(updated.content || {});
      setIsStructuredDirty(false);
      success('Professional summary generated and saved to resume!', 'AI Summary');
    } catch (err) {
      error(getErrorMessage(err, 'Failed to generate summary with AI.'));
    } finally {
      setIsGeneratingAiSummary(false);
    }
  };

  // Action: Trigger AI Text Improvement Modal for any bullet/description
  const handleAiImproveText = (textToImprove, sectionName, applyCallback) => {
    setAiImproveState({
      isOpen: true,
      text: textToImprove,
      section: sectionName,
      onApply: applyCallback,
    });
  };

  // Action: Download Latest PDF
  const handleDownloadLatestPdf = async () => {
    if (!latestFileId) {
      error('No compiled PDF found to download. Please compile first.');
      return;
    }

    try {
      setIsDownloading(true);
      await resumeApi.downloadFile(resumeId, latestFileId, `${title.replace(/\s+/g, '_')}.pdf`);
      success('PDF downloaded successfully.', 'Downloaded');
    } catch (err) {
      error(getErrorMessage(err, 'Failed to download PDF.'));
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoadingResume) {
    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton width="250px" height="36px" />
          <Skeleton width="180px" height="36px" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '600px' }}>
          <Skeleton height="600px" borderRadius="var(--radius-lg)" />
          <Skeleton height="600px" borderRadius="var(--radius-lg)" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      {/* Top Workspace Header */}
      <div className="editor-header-bar glass-panel">
        {/* Left Section: Back, Title & Badges */}
        <div className="editor-header-left">
          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              flexShrink: 0,
            }}
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} />
          </Link>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setIsStructuredDirty(true);
                }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1.0625rem',
                  color: 'var(--text-main)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  borderBottom: '1px solid transparent',
                  padding: '2px 0',
                  minWidth: '120px',
                  maxWidth: '100%',
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = 'var(--primary-500)')}
                onBlur={(e) => (e.target.style.borderBottomColor = 'transparent')}
              />

              <Badge variant="primary" size="sm">
                {resume?.templateId || 'Modern'}
              </Badge>

              <Badge variant="default" size="sm">
                v{resume?.currentVersion || 1}
              </Badge>
            </div>
          </div>
        </div>

        {/* Center Section: Mode Switch */}
        <div className="editor-header-center">
          <ModeSwitch
            mode={editorMode}
            onChange={setEditorMode}
            hasLatex={!!latex}
            isDirty={editorMode === 'structured' ? isStructuredDirty : isLatexDirty}
          />
        </div>

        {/* Right Section: Core Controls */}
        <div className="editor-header-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHistoryModalOpen(true)}
            leftIcon={<History size={14} />}
            style={{ whiteSpace: 'nowrap' }}
          >
            History (v{resume?.currentVersion || 1})
          </Button>

          {editorMode === 'structured' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateLatexFromStructured}
                isLoading={isGeneratingLatex}
                leftIcon={<Sparkles size={14} color="var(--primary-400)" />}
                style={{ whiteSpace: 'nowrap' }}
                title="Generate LaTeX from structured resume using Gemini AI"
              >
                AI LaTeX
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveStructured}
                isLoading={isSavingStructured}
                disabled={!isStructuredDirty}
                leftIcon={<Save size={14} />}
                style={{ whiteSpace: 'nowrap' }}
              >
                Save Form
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveLatex}
              isLoading={isSavingLatex}
              disabled={!isLatexDirty}
              leftIcon={<Save size={14} />}
              style={{ whiteSpace: 'nowrap' }}
            >
              Save LaTeX
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={handleCompile}
            isLoading={isCompiling}
            leftIcon={<Play size={14} />}
            style={{ whiteSpace: 'nowrap' }}
          >
            Compile PDF
          </Button>
        </div>
      </div>

      {/* Mobile / Small Screen View Switcher */}
      <div className="mobile-view-tabs">
        <Tabs
          tabs={[
            { id: 'editor', label: 'Editor Workspace', icon: <Edit3 size={14} /> },
            { id: 'preview', label: 'Live PDF Preview', icon: <Eye size={14} /> },
          ]}
          activeTab={mobileView}
          onChange={setMobileView}
          size="sm"
        />
      </div>

      {/* Workspace Dual Pane Layout */}
      <div className={`workspace-grid show-${mobileView}`}>
        {/* Left Pane: Structured Form or Monaco LaTeX Editor */}
        <div className="pane-editor" style={{ minWidth: 0 }}>
          {editorMode === 'structured' ? (
            <StructuredEditor
              content={content}
              onChange={handleContentChange}
              onAiGenerateSummary={handleAiGenerateSummary}
              isAiGeneratingSummary={isGeneratingAiSummary}
              onAiImproveText={handleAiImproveText}
            />
          ) : (
            <LatexEditor
              latex={latex}
              onChange={handleLatexChange}
              onSave={handleSaveLatex}
              onCompile={handleCompile}
              onGenerateFromStructured={handleGenerateLatexFromStructured}
              isSaving={isSavingLatex}
              isCompiling={isCompiling}
              isGenerating={isGeneratingLatex}
              isDirty={isLatexDirty}
              latexHash={latexHash}
              compileError={compileError}
            />
          )}
        </div>

        {/* Right Pane: Live PDF Preview */}
        <div className="pane-preview" style={{ minWidth: 0, position: 'sticky', top: 'calc(var(--header-height) + 20px)' }}>
          <PdfViewer
            pdfUrl={latestPdfUrl}
            isCompiling={isCompiling}
            onCompile={handleCompile}
            onOpenHistory={() => setIsPdfHistoryModalOpen(true)}
            onDownload={handleDownloadLatestPdf}
            isDownloading={isDownloading}
          />
        </div>
      </div>

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        resumeId={resumeId}
        currentVersion={resume?.currentVersion || 1}
        onVersionRestored={(restored) => {
          setResume(restored);
          setTitle(restored.title);
          setContent(restored.content || {});
          setIsStructuredDirty(false);
        }}
      />

      {/* PDF Files History Modal */}
      <PdfHistoryModal
        isOpen={isPdfHistoryModalOpen}
        onClose={() => setIsPdfHistoryModalOpen(false)}
        resumeId={resumeId}
      />

      {/* AI Text Enhancement Modal */}
      <AiImproveModal
        isOpen={aiImproveState.isOpen}
        onClose={() => setAiImproveState((prev) => ({ ...prev, isOpen: false }))}
        resumeId={resumeId}
        initialText={aiImproveState.text}
        section={aiImproveState.section}
        onApply={aiImproveState.onApply}
      />
    </div>
  );
};
