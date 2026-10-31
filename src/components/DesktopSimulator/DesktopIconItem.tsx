import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Play, Code, Trash2, FileCheck, Laptop } from 'lucide-react';
import { DesktopShortcut } from '../../types';
import { IconRenderer } from '../IconRenderer';

interface DesktopIconItemProps {
  shortcut: DesktopShortcut;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onLaunch: (shortcut: DesktopShortcut) => void;
  onDelete: (id: string) => void;
  onToggleTrust: (id: string) => void;
  onViewSource: (shortcut: DesktopShortcut) => void;
  onExportRealDesktop?: (shortcut: DesktopShortcut) => void;
}

export const DesktopIconItem: React.FC<DesktopIconItemProps> = ({
  shortcut,
  isSelected,
  onSelect,
  onLaunch,
  onDelete,
  onToggleTrust,
  onViewSource,
  onExportRealDesktop,
}) => {
  const [iconMenuOpen, setIconMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setIconMenuOpen(true);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLaunch(shortcut);
  };

  return (
    <>
      <div
        style={{ left: `${shortcut.x}px`, top: `${shortcut.y}px` }}
        className={`absolute flex flex-col items-center justify-center w-24 p-2 rounded-xl select-none cursor-pointer group transition-all ${
          isSelected
            ? 'bg-amber-500/25 border border-amber-500/50 shadow-lg'
            : 'hover:bg-white/10 hover:backdrop-blur-sm border border-transparent'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(shortcut.id);
        }}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        title={`${shortcut.name}\nDouble-click to launch\nRight-click for options`}
      >
        <div className="relative mb-1.5 flex items-center justify-center">
          <IconRenderer icon={shortcut.icon} className="w-12 h-12" size={36} />

          {/* GNOME Untrusted indicator if not marked trusted */}
          {!shortcut.isTrusted && (
            <div
              className="absolute -top-1 -right-1 p-0.5 rounded-full bg-rose-600 text-white shadow-md animate-bounce"
              title="Untrusted launcher: Right click and select 'Allow Launching'"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          )}

          {shortcut.isTrusted && shortcut.type === 'application' && (
            <div
              className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-600/90 text-white shadow-md"
              title="Executable launcher verified"
            >
              <ShieldCheck className="w-2.5 h-2.5" />
            </div>
          )}
        </div>

        <span className="text-[11px] font-medium text-white text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] line-clamp-2 px-1 rounded">
          {shortcut.name}
        </span>
      </div>

      {/* Context Menu for Individual Shortcut */}
      {iconMenuOpen && (
        <div
          style={{
            position: 'fixed',
            left: `${Math.min(menuPos.x, window.innerWidth - 220)}px`,
            top: `${Math.min(menuPos.y, window.innerHeight - 200)}px`,
          }}
          className="z-50 min-w-52 py-1 bg-zinc-900/95 backdrop-blur-md text-zinc-100 rounded-xl border border-zinc-700/80 shadow-2xl text-xs select-none animate-in fade-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 border-b border-zinc-800 text-[10px] text-zinc-400 font-mono truncate">
            {shortcut.name}.desktop
          </div>

          <button
            onClick={() => {
              setIconMenuOpen(false);
              onLaunch(shortcut);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-amber-500/20 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">Launch Shortcut</span>
          </button>

          <button
            onClick={() => {
              setIconMenuOpen(false);
              onToggleTrust(shortcut.id);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>{shortcut.isTrusted ? 'Mark as Untrusted' : 'Allow Launching (gio trust)'}</span>
          </button>

          <button
            onClick={() => {
              setIconMenuOpen(false);
              onViewSource(shortcut);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>View .desktop Source</span>
          </button>

          <button
            onClick={() => {
              setIconMenuOpen(false);
              onExportRealDesktop?.(shortcut);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-left bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 transition-colors cursor-pointer font-medium"
          >
            <Laptop className="w-3.5 h-3.5 text-emerald-400" />
            <span>💻 Put on My Real Linux PC...</span>
          </button>

          <div className="my-1 border-t border-zinc-800" />

          <button
            onClick={() => {
              setIconMenuOpen(false);
              onDelete(shortcut.id);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-left text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Move to Trash</span>
          </button>
        </div>
      )}
    </>
  );
};
