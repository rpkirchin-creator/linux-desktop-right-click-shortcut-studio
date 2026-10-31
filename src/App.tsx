import React, { useState } from 'react';
import {
  Monitor,
  Terminal,
  FileCheck,
  BookOpen,
  Sparkles,
  Download,
  Github,
  Plus,
  MousePointerClick,
  Code,
  Check,
  Copy,
  X,
  ExternalLink,
  Laptop,
  Share2,
} from 'lucide-react';
import { DesktopScreen } from './components/DesktopSimulator/DesktopScreen';
import { ShortcutCreatorModal } from './components/ShortcutCreatorModal';
import { QuickSearchAddBar } from './components/QuickSearchAddBar';
import { ExportToRealDesktopModal } from './components/ExportToRealDesktopModal';
import { ShareDistributeModal } from './components/ShareDistributeModal';
import { LinuxInstallerGuide } from './components/InstallKit/LinuxInstallerGuide';
import { DesktopSpecLinter } from './components/DesktopSpecLinter';
import { ArchitectureExplainer } from './components/ArchitectureExplainer';
import { INITIAL_DESKTOP_SHORTCUTS, CatalogItem } from './data/sampleApps';
import { LINUX_GUIDE_MARKDOWN } from './data/guideMarkdown';
import { DesktopShortcut } from './types';

type ActiveTab = 'simulator' | 'installers' | 'linter' | 'architecture';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<CatalogItem | null>(null);
  const [exportTarget, setExportTarget] = useState<DesktopShortcut | CatalogItem | null>(null);
  const [shortcuts, setShortcuts] = useState<DesktopShortcut[]>(INITIAL_DESKTOP_SHORTCUTS);
  const [inspectedShortcut, setInspectedShortcut] = useState<DesktopShortcut | null>(null);
  const [copiedInspect, setCopiedInspect] = useState(false);

  const handleAddShortcut = (newShortcut: DesktopShortcut) => {
    setShortcuts((prev) => [...prev, newShortcut]);
  };

  const handleCustomizeCatalogItem = (item: CatalogItem) => {
    setCustomizingItem(item);
    setIsCreatorOpen(true);
  };

  const handleOpenSearchCatalog = () => {
    const input = document.querySelector('input[placeholder*="Type to search"]') as HTMLInputElement | null;
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleDownloadGuide = () => {
    const blob = new Blob([LINUX_GUIDE_MARKDOWN], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'LINUX_SHORTCUT_GUIDE.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getShortcutDesktopContent = (s: DesktopShortcut) => {
    if (s.type === 'weblink' && s.url) {
      return `[Desktop Entry]\nVersion=1.0\nType=Link\nName=${s.name}\nComment=${s.comment || ''}\nURL=${s.url}\nIcon=${s.icon}`;
    }
    return `[Desktop Entry]\nVersion=1.0\nType=Application\nName=${s.name}\nComment=${s.comment || ''}\nExec=${s.exec}\nIcon=${s.icon}\nTerminal=${s.terminal ? 'true' : 'false'}\nStartupNotify=true\nCategories=${(s.categories || ['Utility']).join(';')};`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-zinc-950 font-bold shadow-lg shadow-orange-950/40">
                <Terminal className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-white text-base tracking-tight">
                    Linux QuickLauncher Studio
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Desktop Context Action
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 hidden sm:block">
                  Create shortcuts to apps, documents, and scripts via right-click
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'simulator'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Live Desktop Simulator</span>
              </button>

              <button
                onClick={() => setActiveTab('installers')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'installers'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Linux Install Kits</span>
              </button>

              <button
                onClick={() => setActiveTab('linter')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'linter'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>.desktop Linter</span>
              </button>

              <button
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'architecture'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden md:inline">How It Works</span>
              </button>
            </nav>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadGuide}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700/60 transition-colors cursor-pointer"
                title="Download full instructions as a Markdown (.md) file"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Guide (.md)</span>
              </button>

              <button
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold text-xs border border-zinc-700/80 shadow-sm transition-all cursor-pointer"
                title="How to give this to other people and how they run it"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Give to Others</span>
              </button>

              <button
                onClick={() => setIsCreatorOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-bold text-xs shadow-md shadow-orange-950/30 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">New Shortcut</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            {/* Context bar / Answer statement */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                  <MousePointerClick className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-sm">Yes, absolutely! </span>
                  <span className="text-zinc-300">
                    In Linux you can bind an app or script to your desktop right-click menu using{' '}
                    <strong className="text-amber-300">Nemo Actions</strong> (Mint/Cinnamon),{' '}
                    <strong className="text-amber-300">Nautilus Scripts</strong> (Ubuntu/GNOME), or{' '}
                    <strong className="text-amber-300">KIO ServiceMenus</strong> (KDE).
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-semibold cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Give to Others</span>
                </button>

                <button
                  onClick={() => setIsCreatorOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold cursor-pointer transition-colors"
                >
                  ⚡ Open Shortcut Creator
                </button>
                <button
                  onClick={() => setActiveTab('installers')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium cursor-pointer transition-colors"
                >
                  View Real Linux Commands →
                </button>
              </div>
            </div>

            {/* Real Desktop Helper Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-zinc-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white">How to put a REAL shortcut on your REAL Linux desktop:</span>
                  <p className="text-zinc-300 text-[11px] mt-0.5">
                    Click <strong className="text-emerald-400">"Real PC"</strong> on any item in the library or on any desktop icon. You can copy the <strong>1-second terminal command</strong> (<kbd className="bg-black/50 px-1 py-0.5 rounded text-[10px] text-zinc-300">Ctrl+Alt+T</kbd>) or <strong>download the .desktop file</strong>!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExportTarget(shortcuts[0] || INITIAL_DESKTOP_SHORTCUTS[0])}
                className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 shadow-sm"
              >
                <span>Try Real PC Export Demo →</span>
              </button>
            </div>

            {/* Search & Populated Dropdown / List Area */}
            <QuickSearchAddBar
              onAddShortcut={handleAddShortcut}
              onCustomizeItem={handleCustomizeCatalogItem}
              onExportRealDesktop={setExportTarget}
              existingShortcuts={shortcuts}
            />

            {/* Interactive Desktop Screen */}
            <div className="h-[680px]">
              <DesktopScreen
                onOpenShortcutCreator={() => {
                  setCustomizingItem(null);
                  setIsCreatorOpen(true);
                }}
                onOpenSearchCatalog={handleOpenSearchCatalog}
                onOpenExplainer={() => setActiveTab('architecture')}
                shortcuts={shortcuts}
                setShortcuts={setShortcuts}
                onInspectShortcut={setInspectedShortcut}
                onExportRealDesktop={setExportTarget}
              />
            </div>
          </div>
        )}

        {activeTab === 'installers' && <LinuxInstallerGuide />}

        {activeTab === 'linter' && <DesktopSpecLinter />}

        {activeTab === 'architecture' && <ArchitectureExplainer />}
      </main>

      {/* Export to Real Desktop Modal */}
      <ExportToRealDesktopModal
        isOpen={!!exportTarget}
        onClose={() => setExportTarget(null)}
        target={exportTarget}
      />

      {/* Share / Give to Others Modal */}
      <ShareDistributeModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        appUrl={typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-guzn6rwxuhckwvhvkcryh3-894648866967.us-east1.run.app'}
      />

      {/* Shortcut Creator Modal */}
      <ShortcutCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => {
          setIsCreatorOpen(false);
          setCustomizingItem(null);
        }}
        onAddShortcut={handleAddShortcut}
        initialItem={customizingItem}
      />

      {/* Inspect Raw .desktop Source Modal */}
      {inspectedShortcut && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
          onClick={() => setInspectedShortcut(null)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-700 p-6 shadow-2xl text-zinc-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  {inspectedShortcut.name}.desktop
                </h3>
              </div>
              <button
                onClick={() => setInspectedShortcut(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
              <pre>{getShortcutDesktopContent(inspectedShortcut)}</pre>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
              <div className="font-semibold text-zinc-200">Execution command in Linux:</div>
              <code className="text-amber-300 font-mono block">
                chmod +x ~/Desktop/"{inspectedShortcut.name}.desktop" && gio set ~/Desktop/"{inspectedShortcut.name}.desktop" metadata::trusted true
              </code>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getShortcutDesktopContent(inspectedShortcut));
                  setCopiedInspect(true);
                  setTimeout(() => setCopiedInspect(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer transition-colors"
              >
                {copiedInspect ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedInspect ? 'Copied' : 'Copy Content'}</span>
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([getShortcutDesktopContent(inspectedShortcut)], {
                    type: 'text/plain;charset=utf-8',
                  });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${inspectedShortcut.name}.desktop`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download .desktop</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Linux Desktop Right-Click Shortcut Studio • Adheres to Freedesktop.org XDG Desktop Entry Spec</span>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadGuide}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Complete Guide (LINUX_SHORTCUT_GUIDE.md)</span>
            </button>
            <span>GNOME • KDE Plasma • Cinnamon / Nemo • XFCE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
