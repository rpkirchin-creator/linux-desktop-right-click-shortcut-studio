import React, { useState } from 'react';
import {
  X,
  Minus,
  Square,
  Maximize2,
  Terminal,
  Globe,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { WindowState } from '../../types';
import { IconRenderer } from '../IconRenderer';

interface SimulatedWindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onToggleMaximize: (id: string) => void;
}

export const SimulatedWindow: React.FC<SimulatedWindowProps> = ({
  window,
  onClose,
  onFocus,
  onMinimize,
  onToggleMaximize,
}) => {
  const [termInput, setTermInput] = useState('');
  const [termLogs, setTermLogs] = useState<string[]>([
    `[INFO] Initializing environment via desktop shortcut...`,
    `[EXEC] Process started with PID ${Math.floor(1000 + Math.random() * 9000)}`,
  ]);

  if (window.isMinimized) return null;

  const handleTermSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termInput.trim()) return;
    const cmd = termInput.trim();
    let reply = `bash: command not found: ${cmd}`;

    if (cmd === 'ls' || cmd === 'ls -la') {
      reply = `total 24\ndrwxr-xr-x 2 user user 4096 Oct 31 16:00 .\ndrwxr-xr-x 4 user user 4096 Oct 31 15:50 ..\n-rwxr-xr-x 1 user user  248 Oct 31 16:00 MyShortcut.desktop`;
    } else if (cmd === 'pwd') {
      reply = `/home/user/Desktop`;
    } else if (cmd === 'whoami') {
      reply = `user (Linux Workstation)`;
    } else if (cmd === 'uname -a') {
      reply = `Linux workstation 6.8.0-generic #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`;
    } else if (cmd === 'clear') {
      setTermLogs([]);
      setTermInput('');
      return;
    } else if (cmd.startsWith('cat ')) {
      reply = `[Desktop Entry]\nVersion=1.0\nType=Application\nName=${window.title}\nExec=xdg-open\nIcon=${window.icon}`;
    } else {
      reply = `Executed: ${cmd}\nExit Code: 0 (Success)`;
    }

    setTermLogs((prev) => [...prev, `user@linux-desktop:~$ ${cmd}`, reply]);
    setTermInput('');
  };

  return (
    <div
      style={{ zIndex: window.zIndex }}
      onClick={() => onFocus(window.id)}
      className={`absolute shadow-2xl rounded-xl border border-zinc-700/80 bg-zinc-900/95 backdrop-blur-md overflow-hidden flex flex-col transition-all duration-150 ${
        window.isMaximized
          ? 'inset-2 rounded-lg'
          : 'top-12 left-16 right-16 bottom-16 md:inset-x-24 md:top-14 md:bottom-20 max-w-2xl mx-auto'
      }`}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-950/80 border-b border-zinc-800 select-none cursor-move">
        <div className="flex items-center gap-2">
          <IconRenderer icon={window.icon} className="w-4 h-4" size={16} />
          <span className="text-xs font-semibold text-zinc-200 truncate">{window.title}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
            PID {3400 + (window.zIndex % 500)}
          </span>
        </div>

        {/* Window controls (Ubuntu/GNOME right-aligned or left-aligned) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(window.id);
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaximize(window.id);
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Maximize"
          >
            <Maximize2 className="w-3 h-3" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(window.id);
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-rose-600 transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-black/90 p-4 font-sans text-zinc-200">
        {window.type === 'terminal' || window.icon.includes('terminal') ? (
          <div className="h-full flex flex-col font-mono text-xs text-green-400">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-zinc-500 text-[11px]">
              <span>bash - 80x24 - Linux Terminal</span>
              <span>UTF-8</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 leading-relaxed">
              <div className="text-zinc-400">
                Linux desktop application launcher v2.4 (x86_64-pc-linux-gnu)
              </div>
              {termLogs.map((log, i) => (
                <div key={i} className={log.startsWith('user@') ? 'text-amber-400' : 'text-zinc-300'}>
                  {log}
                </div>
              ))}
            </div>

            <form onSubmit={handleTermSubmit} className="mt-2 pt-2 border-t border-zinc-800 flex items-center gap-2">
              <span className="text-emerald-400 select-none">user@linux-desktop:~$</span>
              <input
                type="text"
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                placeholder="type 'ls', 'uname -a', 'pwd' or command..."
                className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs"
                autoFocus
              />
            </form>
          </div>
        ) : window.type === 'web' || window.icon.includes('globe') || window.icon.includes('firefox') ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 p-2 bg-zinc-950 rounded-lg border border-zinc-800 mb-3 text-xs">
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <div className="flex-1 px-3 py-1 bg-zinc-900 rounded border border-zinc-800 text-cyan-400 font-mono truncate">
                {window.url || 'https://freedesktop.org/wiki/Specifications/desktop-entry-spec/'}
              </div>
            </div>
            <div className="flex-1 p-6 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center text-center">
              <Globe className="w-12 h-12 text-cyan-400 mb-3 animate-pulse" />
              <h3 className="text-base font-bold text-white mb-1">{window.title}</h3>
              <p className="text-xs text-zinc-400 max-w-sm mb-4">
                Web shortcut successfully launched! In real Linux, this opens inside your default web browser (Firefox, Chromium, Chrome).
              </p>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 text-left max-w-md">
                Type=Link<br />
                URL={window.url || 'https://github.com'}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col p-4">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <IconRenderer icon={window.icon} className="w-10 h-10" size={32} />
              <div>
                <h3 className="font-bold text-white text-sm">{window.title}</h3>
                <p className="text-xs text-zinc-400">{window.content || 'Application process active.'}</p>
              </div>
            </div>

            <div className="flex-1 p-4 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-y-auto">
              <div className="text-emerald-400 mb-2 font-semibold">✓ Process Execution Log:</div>
              <pre className="text-[11px] leading-relaxed whitespace-pre-wrap text-zinc-400">
                {window.content ||
                  `[INFO] Launching ${window.title}
[INFO] Working Directory: /home/user
[INFO] Executable verified with execute permissions (chmod +x)
[INFO] Freedesktop compliance passed
Ready for interaction.`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
