import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Terminal,
  Folder,
  Settings,
  Wifi,
  Volume2,
  Power,
  RotateCcw,
  Plus,
  Monitor,
  Layers,
  MousePointerClick,
  Info,
  Maximize2,
  Minimize2,
  Laptop,
} from 'lucide-react';
import { DesktopEnvironment, DesktopShortcut, WindowState } from '../../types';
import { INITIAL_DESKTOP_SHORTCUTS } from '../../data/sampleApps';
import { DesktopContextMenu } from './DesktopContextMenu';
import { DesktopIconItem } from './DesktopIconItem';
import { SimulatedWindow } from './SimulatedWindow';
import { IconRenderer } from '../IconRenderer';

interface DesktopScreenProps {
  onOpenShortcutCreator: () => void;
  onOpenSearchCatalog?: () => void;
  onOpenExplainer: () => void;
  shortcuts: DesktopShortcut[];
  setShortcuts: React.Dispatch<React.SetStateAction<DesktopShortcut[]>>;
  onInspectShortcut: (shortcut: DesktopShortcut) => void;
  onExportRealDesktop?: (shortcut: DesktopShortcut) => void;
}

const WALLPAPERS = [
  { id: 'noble', name: 'Ubuntu Noble (Aubergine)', bg: 'bg-gradient-to-br from-[#2c001e] via-[#77216f] to-[#5e2750]' },
  { id: 'adwaita', name: 'Fedora Adwaita (Deep Blue)', bg: 'bg-gradient-to-br from-[#0c1824] via-[#1c385c] to-[#225088]' },
  { id: 'breeze', name: 'KDE Plasma 6 (Nebula Frost)', bg: 'bg-gradient-to-br from-[#0a1128] via-[#1c2541] to-[#3a506b]' },
  { id: 'mint', name: 'Linux Mint (Forest Charcoal)', bg: 'bg-gradient-to-br from-[#121c17] via-[#1a2f23] to-[#264635]' },
  { id: 'cyber', name: 'Matrix Dark Matrix', bg: 'bg-gradient-to-br from-black via-zinc-950 to-emerald-950' },
];

export const DesktopScreen: React.FC<DesktopScreenProps> = ({
  onOpenShortcutCreator,
  onOpenSearchCatalog,
  onOpenExplainer,
  shortcuts,
  setShortcuts,
  onInspectShortcut,
  onExportRealDesktop,
}) => {
  const [environment, setEnvironment] = useState<DesktopEnvironment>('gnome');
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeWindows, setActiveWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [notification, setNotification] = useState<string | null>(
    'Right-click anywhere on the desktop below to test the "Create Quick Shortcut..." menu!'
  );
  const desktopRef = useRef<HTMLDivElement>(null);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dismiss notification after 8 seconds
  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 8000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  // Handle right-click on desktop
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!desktopRef.current) return;
    const rect = desktopRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clamp inside desktop container
    const clampedX = Math.min(Math.max(10, x), rect.width - 270);
    const clampedY = Math.min(Math.max(10, y), rect.height - 320);

    setContextMenu({ x: clampedX, y: clampedY });
    setSelectedIconId(null);
  };

  const handleLaunchShortcut = (shortcut: DesktopShortcut) => {
    // If not trusted and GNOME, warn or prompt allow
    if (!shortcut.isTrusted) {
      setNotification(`⚠️ "${shortcut.name}" is marked untrusted. Right-click it and choose 'Allow Launching' first (Linux security rule)!`);
      return;
    }

    const newWindow: WindowState = {
      id: `win-${Date.now()}`,
      title: shortcut.name,
      icon: shortcut.icon,
      type: shortcut.terminal ? 'terminal' : shortcut.type === 'weblink' ? 'web' : 'app',
      content: shortcut.comment || `Launched command: ${shortcut.exec}`,
      url: shortcut.url,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex + 1,
    };

    setNextZIndex((prev) => prev + 1);
    setActiveWindows((prev) => [...prev, newWindow]);
    setNotification(`⚡ Launched: ${shortcut.name} (${shortcut.exec})`);
  };

  const handleOpenTerminalWindow = () => {
    const termWin: WindowState = {
      id: `term-${Date.now()}`,
      title: 'Terminal - bash',
      icon: 'terminal',
      type: 'terminal',
      content: 'Standard Linux Bash Shell',
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex + 1,
    };
    setNextZIndex((prev) => prev + 1);
    setActiveWindows((prev) => [...prev, termWin]);
  };

  const handleNewFolder = () => {
    const newFolder: DesktopShortcut = {
      id: `folder-${Date.now()}`,
      name: `New Folder ${shortcuts.filter((s) => s.type === 'folder').length + 1}`,
      type: 'folder',
      exec: 'xdg-open ~/Desktop/NewFolder',
      icon: 'folder',
      comment: 'Directory shortcut',
      isTrusted: true,
      x: 140,
      y: 120 + (shortcuts.length % 5) * 60,
    };
    setShortcuts((prev) => [...prev, newFolder]);
    setNotification('Created new directory on Desktop');
  };

  const handleDeleteShortcut = (id: string) => {
    setShortcuts((prev) => prev.filter((s) => s.id !== id));
    setNotification('Moved shortcut to Trash');
  };

  const handleToggleTrust = (id: string) => {
    setShortcuts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isTrusted: !s.isTrusted } : s))
    );
    const target = shortcuts.find((s) => s.id === id);
    if (target) {
      setNotification(
        !target.isTrusted
          ? `✓ Allowed launching for "${target.name}". GNOME trusted flag set.`
          : `⚠️ Revoked trust for "${target.name}".`
      );
    }
  };

  const handleResetDesktop = () => {
    setShortcuts(INITIAL_DESKTOP_SHORTCUTS);
    setActiveWindows([]);
    setNotification('Reset desktop shortcuts to standard defaults');
  };

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = currentTime.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
      {/* Simulation Toolbar / Environment Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30">
            <Monitor className="w-3.5 h-3.5" />
            <span>Interactive Linux Desktop Simulator</span>
          </div>

          <span className="hidden sm:inline-block text-zinc-500">•</span>

          {/* Desktop theme selector */}
          <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
            <button
              onClick={() => {
                setEnvironment('gnome');
                setWallpaperIndex(0);
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                environment === 'gnome'
                  ? 'bg-amber-600 text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Ubuntu GNOME
            </button>
            <button
              onClick={() => {
                setEnvironment('cinnamon');
                setWallpaperIndex(3);
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                environment === 'cinnamon'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mint Cinnamon (Nemo)
            </button>
            <button
              onClick={() => {
                setEnvironment('kde');
                setWallpaperIndex(2);
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                environment === 'kde'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              KDE Plasma 6
            </button>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {onExportRealDesktop && (
            <button
              onClick={() => {
                const target = shortcuts.find((s) => s.id === selectedIconId) || shortcuts[0] || INITIAL_DESKTOP_SHORTCUTS[0];
                onExportRealDesktop(target);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              title="Click to get 1-second copy command or download for your real Linux computer"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>💻 Put on Real Linux PC</span>
            </button>
          )}

          <button
            onClick={() => {
              if (desktopRef.current) {
                const rect = desktopRef.current.getBoundingClientRect();
                setContextMenu({ x: rect.width / 2 - 120, y: rect.height / 2 - 140 });
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors cursor-pointer"
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Simulate Right-Click</span>
          </button>

          <button
            onClick={() => setWallpaperIndex((prev) => (prev + 1) % WALLPAPERS.length)}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors cursor-pointer"
            title="Cycle Wallpaper"
          >
            Wallpaper: {WALLPAPERS[wallpaperIndex].name.split(' ')[0]}
          </button>

          <button
            onClick={handleResetDesktop}
            className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Desktop Icons"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Virtual Screen */}
      <div
        ref={desktopRef}
        onContextMenu={handleDesktopContextMenu}
        onClick={() => {
          setContextMenu(null);
          setSelectedIconId(null);
        }}
        className={`relative flex-1 min-h-[560px] select-none overflow-hidden transition-all duration-300 ${WALLPAPERS[wallpaperIndex].bg}`}
      >
        {/* Subtle grid pattern / vignette */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

        {/* Top Panel (GNOME style) or Bottom Panel (Cinnamon/KDE) */}
        {environment === 'gnome' ? (
          <div className="absolute top-0 inset-x-0 h-7 bg-black/60 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-3 text-xs text-zinc-200 z-30 select-none">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white hover:text-amber-300 cursor-pointer transition-colors">
                Activities
              </span>
              {activeWindows.length > 0 && (
                <span className="text-zinc-400 font-medium text-[11px] truncate max-w-48">
                  {activeWindows[activeWindows.length - 1].title}
                </span>
              )}
            </div>

            <div className="font-medium text-white hover:text-amber-300 cursor-pointer">
              {formattedDate} {formattedTime}
            </div>

            <div className="flex items-center gap-2.5 text-zinc-300">
              <Wifi className="w-3.5 h-3.5" />
              <Volume2 className="w-3.5 h-3.5" />
              <Power className="w-3.5 h-3.5" />
            </div>
          </div>
        ) : null}

        {/* Ubuntu/GNOME Left Dock */}
        {environment === 'gnome' && (
          <div className="absolute left-2 top-10 bottom-4 w-12 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col items-center py-3 gap-2.5 z-20 shadow-xl">
            <button
              onClick={handleOpenTerminalWindow}
              className="p-1.5 rounded-xl hover:bg-white/20 transition-all cursor-pointer group"
              title="Terminal"
            >
              <IconRenderer icon="terminal" className="w-8 h-8" size={24} />
            </button>

            <button
              onClick={() => {
                const s = shortcuts.find((s) => s.icon.includes('vscode') || s.exec.includes('code'));
                if (s) handleLaunchShortcut(s);
                else onOpenShortcutCreator();
              }}
              className="p-1.5 rounded-xl hover:bg-white/20 transition-all cursor-pointer group"
              title="Code Editor"
            >
              <IconRenderer icon="vscode" className="w-8 h-8" size={24} />
            </button>

            <button
              onClick={() => {
                const s = shortcuts.find((s) => s.icon.includes('firefox'));
                if (s) handleLaunchShortcut(s);
                else onOpenShortcutCreator();
              }}
              className="p-1.5 rounded-xl hover:bg-white/20 transition-all cursor-pointer group"
              title="Firefox Web Browser"
            >
              <IconRenderer icon="firefox" className="w-8 h-8" size={24} />
            </button>

            <button
              onClick={() => {
                const s = shortcuts.find((s) => s.icon.includes('spotify'));
                if (s) handleLaunchShortcut(s);
                else onOpenShortcutCreator();
              }}
              className="p-1.5 rounded-xl hover:bg-white/20 transition-all cursor-pointer group"
              title="Spotify"
            >
              <IconRenderer icon="spotify" className="w-8 h-8" size={24} />
            </button>

            <div className="my-auto" />

            {/* Quick launch shortcut creator button right from dock */}
            <button
              onClick={onOpenShortcutCreator}
              className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-zinc-950 font-bold hover:scale-110 shadow-lg shadow-orange-950/60 transition-transform cursor-pointer"
              title="Open Quick Shortcut Creator"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        )}

        {/* Mint / KDE Bottom Panel */}
        {environment !== 'gnome' && (
          <div className="absolute bottom-0 inset-x-0 h-10 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 flex items-center justify-between px-3 text-xs text-zinc-200 z-30 select-none">
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenShortcutCreator}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Menu</span>
              </button>

              <button
                onClick={handleOpenTerminalWindow}
                className="p-1 rounded hover:bg-white/10"
                title="Terminal"
              >
                <IconRenderer icon="terminal" className="w-6 h-6" size={18} />
              </button>

              <div className="h-5 w-px bg-zinc-700 mx-1" />

              {/* Taskbar active apps */}
              {activeWindows.map((win) => (
                <div
                  key={win.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-white text-xs"
                >
                  <IconRenderer icon={win.icon} className="w-4 h-4" size={14} />
                  <span className="truncate max-w-28">{win.title}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-zinc-300">{formattedTime}</span>
              <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
              <Power className="w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>
        )}

        {/* Live Instruction Pill Header */}
        <div className="absolute top-10 right-4 z-10 flex flex-col items-end gap-2 max-w-md pointer-events-none">
          <div className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/15 text-white px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <MousePointerClick className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-amber-300">Try It: Right-Click anywhere on Desktop</div>
              <div className="text-[11px] text-zinc-300">
                Pops up the custom context menu with <strong>⚡ Create Quick Shortcut...</strong>
              </div>
            </div>
          </div>

          {notification && (
            <div className="pointer-events-auto bg-zinc-900/90 backdrop-blur-md border border-amber-500/40 text-amber-200 px-3 py-1.5 rounded-lg text-xs shadow-xl animate-in fade-in">
              {notification}
            </div>
          )}
        </div>

        {/* Desktop Icons Area */}
        <div
          className={`absolute inset-0 ${
            environment === 'gnome' ? 'left-16 top-9 bottom-2' : 'top-2 bottom-12'
          }`}
        >
          {shortcuts.map((shortcut) => (
            <DesktopIconItem
              key={shortcut.id}
              shortcut={shortcut}
              isSelected={selectedIconId === shortcut.id}
              onSelect={setSelectedIconId}
              onLaunch={handleLaunchShortcut}
              onDelete={handleDeleteShortcut}
              onToggleTrust={handleToggleTrust}
              onViewSource={onInspectShortcut}
              onExportRealDesktop={onExportRealDesktop}
            />
          ))}
        </div>

        {/* Simulated Active Windows */}
        {activeWindows.map((win) => (
          <SimulatedWindow
            key={win.id}
            window={win}
            onClose={(id) => setActiveWindows((prev) => prev.filter((w) => w.id !== id))}
            onFocus={(id) => {
              setNextZIndex((prev) => prev + 1);
              setActiveWindows((prev) =>
                prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex + 1 } : w))
              );
            }}
            onMinimize={(id) =>
              setActiveWindows((prev) =>
                prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
              )
            }
            onToggleMaximize={(id) =>
              setActiveWindows((prev) =>
                prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
              )
            }
          />
        ))}

        {/* Desktop Context Menu (appears on right click) */}
        {contextMenu && (
          <DesktopContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            environment={environment}
            onClose={() => setContextMenu(null)}
            onCreateShortcut={onOpenShortcutCreator}
            onOpenSearchCatalog={onOpenSearchCatalog}
            onNewFolder={handleNewFolder}
            onOpenTerminal={handleOpenTerminalWindow}
            onChangeWallpaper={() => setWallpaperIndex((prev) => (prev + 1) % WALLPAPERS.length)}
            onOpenSettings={() => setNotification('Desktop icons set to 48px grid snap mode.')}
            onOpenExplainer={onOpenExplainer}
          />
        )}
      </div>
    </div>
  );
};
