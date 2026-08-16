import React, { useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Save,
  Play,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  Copy,
  Code2,
} from 'lucide-react';

const registerLatexLanguage = (monaco) => {
  if (!monaco.languages.getLanguages().some((l) => l.id === 'latex')) {
    monaco.languages.register({ id: 'latex' });
  }

  monaco.languages.setMonarchTokensProvider('latex', {
    defaultToken: '',
    tokenPostfix: '.latex',
    keywords: [
      'documentclass', 'usepackage', 'begin', 'end', 'section', 'subsection',
      'subsubsection', 'paragraph', 'textbf', 'textit', 'emph', 'underline',
      'item', 'title', 'author', 'date', 'maketitle', 'href', 'url',
      'centering', 'raggedright', 'raggedleft', 'small', 'large', 'Large',
      'LARGE', 'huge', 'Huge', 'vspace', 'hspace', 'geometry', 'pagestyle',
      'fancyhf', 'renewcommand', 'newcommand', 'definecolor', 'color',
      'textcolor', 'pagebreak', 'noindent', 'tabular', 'itemize', 'enumerate',
      'description', 'center', 'flushleft', 'flushright', 'minipage',
      'colorlet', 'setlength', 'hypersetup'
    ],
    tokenizer: {
      root: [
        [/%(.*)$/, 'comment'],
        [/\\([a-zA-Z@]+)/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'type.identifier',
          },
        }],
        [/\\./, 'keyword'],
        [/\{|\}/, 'delimiter.bracket'],
        [/\[|\]/, 'delimiter.square'],
        [/\$([^\$]*)\$/, 'string.math'],
        [/https?:\/\/[^\s\}]+/, 'string.link'],
        [/[0-9]+/, 'number'],
        [/[a-zA-Z]+/, 'identifier'],
      ],
    },
  });

  monaco.editor.defineTheme('resumeforge-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '818cf8', fontStyle: 'bold' },
      { token: 'type.identifier', foreground: '60a5fa' },
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      { token: 'string.math', foreground: '34d399' },
      { token: 'string.link', foreground: '38bdf8', fontStyle: 'underline' },
      { token: 'delimiter.bracket', foreground: 'fbbf24' },
      { token: 'delimiter.square', foreground: 'f472b6' },
      { token: 'number', foreground: 'a78bfa' },
    ],
    colors: {
      'editor.background': '#0b1120',
      'editor.foreground': '#f8fafc',
      'editor.lineHighlightBackground': '#151f38',
      'editorCursor.foreground': '#818cf8',
      'editorWhitespace.foreground': '#1e293b',
      'editorIndentGuide.background': '#1e293b',
      'editorIndentGuide.activeBackground': '#4f46e5',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#818cf8',
    },
  });
};

export const LatexEditor = ({
  latex = '',
  onChange,
  onSave,
  onCompile,
  onGenerateFromStructured,
  isSaving = false,
  isCompiling = false,
  isGenerating = false,
  isDirty = false,
  latexHash = null,
  compileError = null,
}) => {
  const editorRef = useRef(null);
  const [monacoLoaded, setMonacoLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleBeforeMount = (monaco) => {
    registerLatexLanguage(monaco);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setMonacoLoaded(true);
    registerLatexLanguage(monaco);
    monaco.editor.setTheme('resumeforge-dark');

    // Add Ctrl+S / Cmd+S save command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) onSave();
    });

    // Auto-focus editor if content is present
    editor.focus();
  };

  const handleCopyLatex = () => {
    if (latex) {
      navigator.clipboard.writeText(latex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sampleTemplate = `\\documentclass[10pt, letterpaper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}

\\begin{document}
\\pagestyle{empty}

\\begin{center}
    {\\LARGE \\textbf{Your Name}} \\\\
    \\vspace{4pt}
    email@example.com $\\cdot$ (555) 123-4567 $\\cdot$ linkedin.com/in/example
\\end{center}

\\vspace{6pt}
\\section*{Professional Summary}
Results-driven software engineer with expertise in building scalable web architectures and real-time distributed applications.

\\section*{Experience}
\\textbf{Senior Engineer} $\\cdot$ Acme Corp \\hfill 2022 -- Present
\\begin{itemize}[leftmargin=*, itemsep=0pt, topsep=2pt]
    \\item Architected real-time WebSocket synchronization pipeline handling 50k events/sec.
    \\item Optimized database query indices cutting API response latencies by 40\\%.
\\end{itemize}

\\section*{Education}
\\textbf{B.S. in Computer Science} $\\cdot$ University of Technology \\hfill 2018 -- 2022

\\section*{Skills}
\\textbf{Languages:} JavaScript, TypeScript, Python, LaTeX, SQL \\\\
\\textbf{Frameworks:} React, Node.js, Express, MongoDB, Docker

\\end{document}`;

  const hasContent = latex && latex.trim().length > 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 160px)',
        minHeight: '750px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Editor Sub-Header / Action Toolbar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexShrink: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileCode size={16} color="var(--primary-400)" flexShrink={0} />
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
              LaTeX Code
            </span>
          </div>

          {isDirty ? (
            <Badge variant="warning" size="sm">
              Unsaved
            </Badge>
          ) : latexHash ? (
            <Badge variant="success" size="sm" icon={<CheckCircle2 size={11} />}>
              Synced
            </Badge>
          ) : (
            <Badge variant="default" size="sm">
              Draft
            </Badge>
          )}

          {hasContent && (
            <button
              type="button"
              onClick={handleCopyLatex}
              title="Copy LaTeX source code"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <Copy size={12} />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }} className="hide-on-mobile">
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateFromStructured}
            isLoading={isGenerating}
            leftIcon={<Sparkles size={13} color="var(--primary-400)" />}
            title="Generate LaTeX from structured resume data using Gemini AI"
            style={{ whiteSpace: 'nowrap', padding: '5px 10px', fontSize: '0.75rem' }}
          >
            AI Sync
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onSave}
            isLoading={isSaving}
            disabled={!isDirty}
            leftIcon={<Save size={13} />}
            title="Save LaTeX content (Ctrl+S)"
            style={{ whiteSpace: 'nowrap', padding: '5px 10px', fontSize: '0.75rem' }}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Compiler Error Banner if any */}
      {compileError && (
        <div
          style={{
            backgroundColor: 'var(--danger-bg)',
            borderBottom: '1px solid var(--danger-border)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '0.8125rem',
            color: 'var(--danger-text)',
            maxHeight: '130px',
            overflowY: 'auto',
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 600 }}>LaTeX Compilation Error:</span>
            <pre style={{ marginTop: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
              {compileError}
            </pre>
          </div>
        </div>
      )}

      {/* Editor Body */}
      <div
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0b1120',
        }}
      >
        {/* Helper Empty Overlay when no LaTeX has been generated or typed yet */}
        {!hasContent && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              backgroundColor: 'rgba(11, 17, 32, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              gap: '16px',
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
                color: 'var(--primary-400)',
              }}
            >
              <Code2 size={28} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '6px' }}>
                No LaTeX Document Generated Yet
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '440px', lineHeight: 1.5 }}>
                You can convert your structured resume entries into professional LaTeX with Gemini AI, or start with a sample template.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="primary"
                size="md"
                onClick={onGenerateFromStructured}
                isLoading={isGenerating}
                leftIcon={<Sparkles size={16} />}
              >
                Generate LaTeX with AI
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => onChange(sampleTemplate)}
                leftIcon={<FileCode size={16} />}
              >
                Load Starter LaTeX
              </Button>
            </div>
          </div>
        )}

        {/* Monaco Editor Container */}
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Editor
            width="100%"
            height="100%"
            language="latex"
            value={latex || ''}
            onChange={(val) => onChange(val || '')}
            beforeMount={handleBeforeMount}
            onMount={handleEditorDidMount}
            theme="resumeforge-dark"
            options={{
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace",
              fontSize: 13.5,
              lineHeight: 22,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              automaticLayout: true,
              tabSize: 2,
              renderWhitespace: 'none',
              padding: { top: 16, bottom: 16 },
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
            }}
            loading={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--primary-400)',
                  gap: '8px',
                  fontSize: '0.875rem',
                }}
              >
                <RefreshCw size={18} className="animate-spin" />
                <span>Initializing Monaco LaTeX Studio...</span>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
