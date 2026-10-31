import React, { useEffect, useRef } from 'react';
import {
  Sparkles,
  Search,
  FolderPlus,
  Terminal,
  Image as WallpaperIcon,
  Settings,
  Clipboard,
  CheckSquare,
  Info,
} from 'lucide-react';
import { DesktopEnvironment } from '../../types';

interface DesktopContextMenuProps {
  x: number;
  y: number;
  environment: DesktopEnvironment;
  onClose: () => void;
  onCreateShortcut: () => void;
  onOpenSearchCatalog?: () => void;
  onNewFolder: () => void;
  onOpenTerminal: () => void;
  onChangeWallpaper: () => void;
  onOpenSettings: () => void;
  onOpenExplainer: () => void;
}

export const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({
  x,
  y,
  environment,
  onClose,
  onCreateShortcut,
  onOpenSearchCatalog,
  onNewFolder,
  onOpenTerminal,
  onChangeWallpaper,
  onOpenSettings,
  onOpenExplainer,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside to dismiss
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust style depending on simulated DE (GNOME, Cinnamon, KDE)
  const isKde = environment === 'kde';
  const isCinnamon = environment === 'cinnamon';

  return (
    <div
      ref={menuRef}
      style={{ left: `${x}px`, top: `${y}px` }}
      className={`absolute z-50 min-w-64 py-1.5 shadow-2xl backdrop-blur-md border animate-in fade-in zoom-in-95 duration-100 select-none text-sm ${
        isKde
          ? 'bg-slate-900/90 text-slate-100 border-cyan-500/30 rounded-lg shadow-cyan-950/40'
          : isCinnamon
          ? 'bg-zinc-900/95 text-zinc-100 border-zinc-700/80 rounded-md shadow-black/60'
          : 'bg-[#242424]/95 text-zinc-100 border-zinc-700/60 rounded-xl shadow-black/70'
      }`}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Target Feature Item 1: Create Quick Shortcut */}
      <button
        onClick={() => {
          onCreateShortcut();
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-2 text-left font-medium text-amber-300 hover:text-white bg-amber-500/10 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded bg-amber-500/20 text-amber-400 group-hover:text-white group-hover:bg-white/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-xs tracking-wide uppercase text-amber-400 group-hover:text-white">
            Create Quick Shortcut...
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-300/80 group-hover:text-white border border-amber-500/30 group-hover:border-white/30">
          Custom
        </span>
      </button>

      {/* Target Feature Item 2: Search & Add from Populated Library */}
      {onOpenSearchCatalog && (
        <button
          onClick={() => {
            onOpenSearchCatalog();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2 text-left font-medium text-sky-300 hover:text-white hover:bg-sky-600/20 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded bg-sky-500/20 text-sky-400 group-hover:text-white">
              <Search className="w-4 h-4" />
            </div>
            <span className="font-semibold text-xs text-sky-300 group-hover:text-white">
              Search & Add from Library...
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">/</span>
        </button>
      )}

      <div className="my-1 border-t border-white/10" />

      {/* Standard desktop items */}
      <button
        onClick={() => {
          onNewFolder();
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-white/10 text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <FolderPlus className="w-4 h-4 text-sky-400" />
          <span>New Folder</span>
        </div>
        <span className="text-[10px] text-zinc-500">Shift+Ctrl+N</span>
      </button>

      <button
        onClick={() => {
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-white/10 text-left text-zinc-400 transition-colors cursor-pointer"
      >
        <Clipboard className="w-4 h-4 text-zinc-400" />
        <span>Paste</span>
      </button>

      <button
        onClick={() => {
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-white/10 text-left text-zinc-400 transition-colors cursor-pointer"
      >
        <CheckSquare className="w-4 h-4 text-zinc-400" />
        <span>Select All</span>
      </button>

      <div className="my-1 border-t border-white/10" />

      <button
        onClick={() => {
          onOpenTerminal();
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-white/10 text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Open in Terminal</span>
        </div>
        <span className="text-[10px] text-zinc-500">Ctrl+Alt+T</span>
      </button>

      <button
        onClick={() => {
          onChangeWallpaper();
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-white/10 text-left transition-colors cursor-pointer"
      >
        <WallpaperIcon className="w-4 h-4 text-violet-400" />
        <span>Change Background...</span>
      </button>

      <button
        onClick={() => {
          onOpenSettings();
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-white/10 text-left transition-colors cursor-pointer"
      >
        <Settings className="w-4 h-4 text-zinc-300" />
        <span>Desktop Icons Settings...</span>
      </button>

      <div className="my-1 border-t border-white/10" />

      <button
        onClick={() => {
          onOpenExplainer();
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-white/10 text-left text-xs text-sky-400 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4" />
          <span>How this right-click action works</span>
        </div>
      </button>
    </div>
  );
};
