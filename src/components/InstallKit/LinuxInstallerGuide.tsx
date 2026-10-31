import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileCode,
  BookOpen,
} from 'lucide-react';
import { LINUX_INSTALLERS } from '../../data/linuxInstallers';

export const LinuxInstallerGuide: React.FC = () => {
  const [selectedId, setSelectedId] = useState(LINUX_INSTALLERS[0].id);
  const [copiedBash, setCopiedBash] = useState(false);
  const [copiedFileIndex, setCopiedFileIndex] = useState<number | null>(null);

  const selectedPreset = LINUX_INSTALLERS.find((p) => p.id === selectedId) || LINUX_INSTALLERS[0];

  const handleCopyBash = () => {
    navigator.clipboard.writeText(selectedPreset.oneLinerInstall);
    setCopiedBash(true);
    setTimeout(() => setCopiedBash(false), 2000);
  };

  const handleCopyFile = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedFileIndex(index);
    setTimeout(() => setCopiedFileIndex(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const cleanName = filename.split('/').pop() || 'installer.sh';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = cleanName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
              Ready-to-Use Installers for Your Actual Linux PC
            </h2>
            <p className="text-sm text-zinc-300 max-w-3xl leading-relaxed">
              In Linux, desktop managers allow you to bind any custom script or app directly to the right-click desktop menu.
              Select your desktop environment below to get the <strong>1-click copy-paste installation command</strong> and inspect the clean source code.
            </p>
          </div>
        </div>
      </div>

      {/* DE Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {LINUX_INSTALLERS.map((preset) => {
          const isSelected = preset.id === selectedId;
          return (
            <button
              key={preset.id}
              onClick={() => setSelectedId(preset.id)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-zinc-800 border-amber-500/60 shadow-lg text-white ring-1 ring-amber-500/40'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="text-[11px] font-mono text-amber-400 mb-0.5">{preset.distroHint.split(',')[0]}</div>
              <div className="font-semibold text-xs text-white leading-tight">{preset.name.split('(')[0]}</div>
              <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                <span>{preset.difficulty}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Installer Details */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white">{selectedPreset.name}</h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {selectedPreset.distroHint}
              </span>
            </div>
            <p className="text-xs text-zinc-400">{selectedPreset.description}</p>
          </div>

          <button
            onClick={handleCopyBash}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-bold text-xs tracking-wide shadow-lg shadow-orange-950/40 transition-all cursor-pointer flex-shrink-0"
          >
            {copiedBash ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedBash ? 'Command Copied!' : 'Copy 1-Click Install Command'}</span>
          </button>
        </div>

        {/* 1-Liner Terminal Box */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Run in your Linux Terminal:
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">No root/sudo required</span>
          </div>

          <div className="relative rounded-xl bg-black border border-zinc-800 p-4 font-mono text-xs text-emerald-300 overflow-x-auto shadow-inner">
            <pre className="text-[11px] leading-relaxed whitespace-pre-wrap">{selectedPreset.oneLinerInstall}</pre>
          </div>
        </div>

        {/* How It Works Explainer */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-3 text-xs text-zinc-300">
          <BookOpen className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-white">Under the Hood:</div>
            <p className="leading-relaxed text-zinc-400">{selectedPreset.explanation}</p>
          </div>
        </div>

        {/* File inspection list */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Source Code & Configuration Files Created ({selectedPreset.files.length})
          </h4>

          {selectedPreset.files.map((file, idx) => (
            <div key={idx} className="rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800 text-xs">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <code className="text-amber-300 font-mono text-[11px] font-semibold">{file.path}</code>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyFile(file.content, idx)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors cursor-pointer"
                  >
                    {copiedFileIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedFileIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => handleDownloadFile(file.path, file.content)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors cursor-pointer"
                    title="Download file"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-black font-mono text-xs overflow-x-auto text-zinc-300 max-h-64">
                <pre className="text-[11px] leading-relaxed">{file.content}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
