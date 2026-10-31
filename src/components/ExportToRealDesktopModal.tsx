import React, { useState } from 'react';
import {
  X,
  Terminal,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Laptop,
  HelpCircle,
  FolderDown,
} from 'lucide-react';
import { DesktopShortcut } from '../types';
import { CatalogItem } from '../data/sampleApps';
import { IconRenderer } from './IconRenderer';

interface ExportToRealDesktopModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: DesktopShortcut | CatalogItem | null;
}

export const ExportToRealDesktopModal: React.FC<ExportToRealDesktopModalProps> = ({
  isOpen,
  onClose,
  target,
}) => {
  const [activeMethod, setActiveMethod] = useState<'terminal' | 'download' | 'permanent'>('terminal');
  const [copiedBash, setCopiedBash] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  if (!isOpen || !target) return null;

  const safeFilename = target.name.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'shortcut';

  // Generate standard Freedesktop .desktop file
  const generateDesktopContent = () => {
    if (target.type === 'weblink' && target.url) {
      return `[Desktop Entry]
Version=1.0
Type=Link
Name=${target.name}
Comment=${target.comment || 'Web Shortcut'}
URL=${target.url}
Icon=${target.icon || 'globe'}
`;
    }

    return `[Desktop Entry]
Version=1.0
Type=Application
Name=${target.name}
Comment=${target.comment || ''}
Exec=${target.exec}
Icon=${target.icon || 'application-x-executable'}
Terminal=${target.terminal ? 'true' : 'false'}
StartupNotify=true
Categories=${((target as any).categories || ['Utility']).join(';')};
`;
  };

  const desktopContent = generateDesktopContent();

  // 1-line bash command to run on real PC
  const generateOneLiner = () => {
    return `cat << 'EOF' > ~/Desktop/${safeFilename}.desktop
${desktopContent}EOF
chmod +x ~/Desktop/${safeFilename}.desktop
gio set ~/Desktop/${safeFilename}.desktop metadata::trusted true 2>/dev/null`;
  };

  const oneLiner = generateOneLiner();

  const handleCopyBash = () => {
    navigator.clipboard.writeText(oneLiner);
    setCopiedBash(true);
    setTimeout(() => setCopiedBash(false), 2000);
  };

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(desktopContent);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([desktopContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeFilename}.desktop`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl text-zinc-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  Put on Your Real Linux Desktop
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Real Linux Host PC
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Target: <strong className="text-white">{target.name}</strong> ({target.type})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Why this is needed explainer callout */}
        <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-200 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            Because web browsers cannot silently write files to your computer's hard drive, choose either the <strong>1-second terminal command</strong> or <strong>direct file download</strong> below:
          </span>
        </div>

        {/* Method Switcher Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveMethod('terminal')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-t border-x transition-colors cursor-pointer ${
              activeMethod === 'terminal'
                ? 'bg-zinc-800 text-emerald-300 border-zinc-700'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Method 1: 1-Click Terminal Command (Fastest)</span>
          </button>

          <button
            onClick={() => setActiveMethod('download')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-t border-x transition-colors cursor-pointer ${
              activeMethod === 'download'
                ? 'bg-zinc-800 text-emerald-300 border-zinc-700'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Method 2: Direct File Download</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeMethod === 'terminal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">
                  1. Copy this command and paste it into your terminal (<kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px]">Ctrl+Alt+T</kbd>):
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">Takes ~1 second</span>
              </div>

              {/* Terminal Code Box */}
              <div className="relative rounded-xl bg-black border border-zinc-800 p-4 font-mono text-xs text-emerald-300 shadow-inner overflow-x-auto">
                <pre className="text-[11px] leading-relaxed whitespace-pre-wrap">{oneLiner}</pre>
                
                <button
                  onClick={handleCopyBash}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
                >
                  {copiedBash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBash ? 'Copied to Clipboard!' : 'Copy Command'}</span>
                </button>
              </div>

              {/* Explanation of what the command does */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 space-y-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>What this command does on your real Linux system:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-zinc-300 pl-1">
                  <li>Creates <code className="text-amber-300">~/Desktop/{safeFilename}.desktop</code> with correct Freedesktop metadata.</li>
                  <li>Runs <code className="text-amber-300">chmod +x</code> so Linux allows executing it.</li>
                  <li>Runs <code className="text-amber-300">gio set ... metadata::trusted true</code> (removes the GNOME untrusted warning).</li>
                </ul>
              </div>
            </div>
          )}

          {activeMethod === 'download' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <IconRenderer icon={target.icon} className="w-10 h-10" size={32} />
                  <div>
                    <div className="font-bold text-white text-sm">{safeFilename}.desktop</div>
                    <div className="text-xs text-zinc-400">Ready to download to your computer</div>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-zinc-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File Now</span>
                </button>
              </div>

              {/* 3 Step Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  After Downloading (2 Quick Steps):
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <div className="font-bold text-sky-400 flex items-center gap-1.5">
                      <span>Step 1: Move to Desktop</span>
                    </div>
                    <p className="text-zinc-400">
                      Move <code className="text-zinc-200 font-mono">{safeFilename}.desktop</code> from your <em>Downloads</em> folder into your <em>Desktop</em> folder (<code className="text-amber-300 font-mono">~/Desktop/</code>).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <span>Step 2: Allow Launching</span>
                    </div>
                    <p className="text-zinc-400">
                      On your real desktop, right-click the file and click <strong>"Allow Launching"</strong> (or in terminal run <code className="text-amber-300 font-mono">chmod +x ~/Desktop/{safeFilename}.desktop</code>).
                    </p>
                  </div>
                </div>
              </div>

              {/* Code viewer */}
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                  <span>File Contents Preview:</span>
                  <button
                    onClick={handleCopyRaw}
                    className="text-[11px] text-zinc-300 hover:text-white flex items-center gap-1"
                  >
                    {copiedRaw ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedRaw ? 'Copied' : 'Copy Raw Text'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-black border border-zinc-800 font-mono text-[11px] text-zinc-300 max-h-36 overflow-y-auto">
                  <pre>{desktopContent}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Works on Ubuntu, Mint, Fedora, Arch, Debian, openSUSE</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
};
