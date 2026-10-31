import React, { useState } from 'react';
import {
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Code2,
  Sparkles,
  HelpCircle,
  FileCode,
} from 'lucide-react';

const SPEC_TEMPLATES = [
  {
    id: 'native',
    name: 'Native Application',
    content: `[Desktop Entry]
Version=1.0
Type=Application
Name=Visual Studio Code
Comment=Code Editing. Redefined.
Exec=code %F
Icon=vscode
Terminal=false
Categories=Development;IDE;
StartupNotify=true
MimeType=text/plain;inode/directory;`,
  },
  {
    id: 'flatpak',
    name: 'Flatpak Sandbox App',
    content: `[Desktop Entry]
Version=1.0
Type=Application
Name=Spotify (Flatpak)
Comment=Music Player in Flatpak Sandbox
Exec=flatpak run com.spotify.Client %U
Icon=com.spotify.Client
Terminal=false
Categories=AudioVideo;Player;`,
  },
  {
    id: 'weblink',
    name: 'Web URL / Link',
    content: `[Desktop Entry]
Version=1.0
Type=Link
Name=Google Cloud Console
Comment=Quick access to cloud infrastructure
URL=https://console.cloud.google.com
Icon=globe`,
  },
  {
    id: 'terminal',
    name: 'CLI / Terminal Command',
    content: `[Desktop Entry]
Version=1.0
Type=Application
Name=System Monitor Htop
Comment=Interactive process viewer
Exec=htop
Icon=utilities-terminal
Terminal=true
Categories=System;Monitor;`,
  },
  {
    id: 'wine',
    name: 'Wine / Windows Program',
    content: `[Desktop Entry]
Version=1.0
Type=Application
Name=Notepad Plus Plus (Wine)
Comment=Windows text editor running via Wine
Exec=wine "/home/user/.wine/drive_c/Program Files/Notepad++/notepad++.exe"
Icon=wine
Terminal=false
Path=/home/user/.wine/drive_c/Program Files/Notepad++`,
  },
];

interface LintIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
}

export const DesktopSpecLinter: React.FC = () => {
  const [content, setContent] = useState(SPEC_TEMPLATES[0].content);
  const [copied, setCopied] = useState(false);

  // Linting logic against Freedesktop specification
  const lintIssues: LintIssue[] = [];

  const lines = content.split('\n');
  const hasHeader = lines.some((l) => l.trim() === '[Desktop Entry]');
  if (!hasHeader) {
    lintIssues.push({
      type: 'error',
      message: 'Missing required header "[Desktop Entry]" on the first line.',
    });
  }

  const keys: Record<string, string> = {};
  lines.forEach((l) => {
    const trimmed = l.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('[') || !trimmed.includes('=')) return;
    const [k, ...v] = trimmed.split('=');
    keys[k.trim()] = v.join('=').trim();
  });

  // Type check
  if (!keys['Type']) {
    lintIssues.push({
      type: 'error',
      message: 'Missing required "Type=" field (must be Application, Link, or Directory).',
    });
  } else if (!['Application', 'Link', 'Directory'].includes(keys['Type'])) {
    lintIssues.push({
      type: 'error',
      message: `Invalid Type "${keys['Type']}". Must be Application, Link, or Directory.`,
    });
  }

  // Name check
  if (!keys['Name']) {
    lintIssues.push({
      type: 'error',
      message: 'Missing required "Name=" field. Desktop environments need a display label.',
    });
  }

  // Exec or URL check
  if (keys['Type'] === 'Application') {
    if (!keys['Exec']) {
      lintIssues.push({
        type: 'error',
        message: 'Applications require an "Exec=" field with the binary or command to run.',
      });
    } else {
      if (keys['Exec'].includes('%F') || keys['Exec'].includes('%U')) {
        lintIssues.push({
          type: 'info',
          message: 'Found Freedesktop field code (%F or %U). These pass selected files or URLs as arguments.',
        });
      }
    }
  } else if (keys['Type'] === 'Link') {
    if (!keys['URL']) {
      lintIssues.push({
        type: 'error',
        message: 'Link entries require a "URL=" field (e.g. https://...).',
      });
    }
  }

  // Terminal check
  if (keys['Terminal'] && !['true', 'false'].includes(keys['Terminal'].toLowerCase())) {
    lintIssues.push({
      type: 'warning',
      message: `Terminal value "${keys['Terminal']}" should be boolean: "true" or "false".`,
    });
  }

  // Icon check
  if (!keys['Icon']) {
    lintIssues.push({
      type: 'warning',
      message: 'No "Icon=" specified. Desktop will display a generic fallback gear icon.',
    });
  }

  const errorCount = lintIssues.filter((i) => i.type === 'error').length;
  const warnCount = lintIssues.filter((i) => i.type === 'warning').length;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = (keys['Name'] || 'shortcut').replace(/[^a-zA-Z0-9_-]/g, '_') + '.desktop';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
            <FileCheck className="w-5 h-5 text-amber-400" />
            <span>Freedesktop .desktop Specification Linter & Builder</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Validate compliance with the Linux XDG Desktop Entry Specification v1.5. Edit or test any custom shortcut file.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .desktop</span>
          </button>
        </div>
      </div>

      {/* Preset template pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-zinc-500 font-medium whitespace-nowrap">Load Preset:</span>
        {SPEC_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => setContent(tmpl.content)}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 whitespace-nowrap cursor-pointer transition-colors"
          >
            {tmpl.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Editor on Left, Validation results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span className="font-mono">Editable Desktop Entry File</span>
            <span>{lines.length} lines</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            spellCheck={false}
            className="w-full p-4 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-400 shadow-inner leading-relaxed resize-y"
          />
        </div>

        {/* Linter Diagnostics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Linter Diagnostics
              </span>
              <div className="flex items-center gap-2 text-xs">
                {errorCount === 0 && warnCount === 0 ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Valid Spec
                  </span>
                ) : (
                  <>
                    {errorCount > 0 && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-[11px]">
                        {errorCount} Error{errorCount > 1 ? 's' : ''}
                      </span>
                    )}
                    {warnCount > 0 && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[11px]">
                        {warnCount} Warning{warnCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Issue List */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {lintIssues.length === 0 ? (
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Complies 100% with Freedesktop Desktop Entry Specification v1.5!</span>
                </div>
              ) : (
                lintIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                      issue.type === 'error'
                        ? 'bg-rose-950/30 border-rose-800/40 text-rose-200'
                        : issue.type === 'warning'
                        ? 'bg-amber-950/30 border-amber-800/40 text-amber-200'
                        : 'bg-sky-950/30 border-sky-800/40 text-sky-200'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold capitalize text-[11px] mb-0.5">{issue.type}</div>
                      <div className="leading-snug">{issue.message}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Required Linux Permissions Reminder */}
            <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-2">
              <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Don't forget the Linux Execution Permissions:</span>
              </div>
              <div className="p-2.5 rounded bg-black border border-zinc-800 font-mono text-[11px] text-emerald-300 select-all">
                chmod +x ~/Desktop/*.desktop<br />
                gio set ~/Desktop/*.desktop metadata::trusted true
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
