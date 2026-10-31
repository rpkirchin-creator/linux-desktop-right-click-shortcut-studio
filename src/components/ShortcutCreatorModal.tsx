import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Rocket,
  FileText,
  Globe,
  Terminal,
  Folder,
  Check,
  Copy,
  Download,
  ShieldCheck,
  ChevronRight,
  Code,
  Sliders,
  Play,
  HelpCircle,
} from 'lucide-react';
import { SAMPLE_LINUX_APPS, SAMPLE_DOCUMENTS, SAMPLE_WEB_LINKS, DESKTOP_CATALOG_ITEMS, CatalogItem } from '../data/sampleApps';
import { IconRenderer } from './IconRenderer';
import { DesktopShortcut, ShortcutType } from '../types';

interface ShortcutCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShortcut: (shortcut: DesktopShortcut) => void;
  initialItem?: CatalogItem | null;
}

const AVAILABLE_ICONS = [
  { id: 'vscode', label: 'VS Code' },
  { id: 'firefox', label: 'Firefox' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'spotify', label: 'Spotify' },
  { id: 'obsidian', label: 'Notes' },
  { id: 'pdf', label: 'PDF Doc' },
  { id: 'calc', label: 'Spreadsheet' },
  { id: 'gimp', label: 'Image' },
  { id: 'vlc', label: 'Media/VLC' },
  { id: 'steam', label: 'Steam/Game' },
  { id: 'script', label: 'Bash Script' },
  { id: 'globe', label: 'Web Link' },
  { id: 'folder', label: 'Directory' },
  { id: 'command', label: 'Command' },
];

export const ShortcutCreatorModal: React.FC<ShortcutCreatorModalProps> = ({
  isOpen,
  onClose,
  onAddShortcut,
  initialItem,
}) => {
  const [activeTab, setActiveTab] = useState<ShortcutType>('application');
  const [name, setName] = useState('Visual Studio Code');
  const [exec, setExec] = useState('code %F');
  const [icon, setIcon] = useState('vscode');
  const [comment, setComment] = useState('Code Editing. Redefined.');
  const [runInTerminal, setRunInTerminal] = useState(false);
  const [categories, setCategories] = useState('Development;IDE;');
  const [targetUrl, setTargetUrl] = useState('https://github.com');
  const [webAppMode, setWebAppMode] = useState(false);

  React.useEffect(() => {
    if (initialItem && isOpen) {
      setActiveTab(initialItem.type);
      setName(initialItem.name);
      setExec(initialItem.exec);
      setIcon(initialItem.icon);
      setComment(initialItem.comment);
      setRunInTerminal(initialItem.terminal);
      if (initialItem.url) setTargetUrl(initialItem.url);
      if (initialItem.categories) setCategories(initialItem.categories.join(';') + ';');
    }
  }, [initialItem, isOpen]);
  const [workingDir, setWorkingDir] = useState('~/');
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isOpen) return null;

  // Handle Preset app selection
  const selectAppPreset = (app: typeof SAMPLE_LINUX_APPS[0]) => {
    setName(app.name);
    setExec(app.exec);
    setIcon(app.icon);
    setComment(app.comment);
    setRunInTerminal(app.terminal);
    setCategories(app.categories.join(';') + ';');
  };

  // Handle Preset doc selection
  const selectDocPreset = (doc: typeof SAMPLE_DOCUMENTS[0]) => {
    setName(doc.name);
    setExec(`xdg-open "${doc.path}"`);
    setIcon(doc.icon);
    setComment(`Open document: ${doc.name}`);
    setRunInTerminal(false);
  };

  // Handle Web preset selection
  const selectWebPreset = (web: typeof SAMPLE_WEB_LINKS[0]) => {
    setName(web.name);
    setTargetUrl(web.url);
    setIcon(web.icon);
    setComment(`Launch web link: ${web.name}`);
    if (webAppMode) {
      setExec(`google-chrome --app="${web.url}"`);
    } else {
      setExec(`xdg-open "${web.url}"`);
    }
  };

  // Generated .desktop file content
  const safeFilename = name.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'shortcut';
  
  const generateDesktopFileContent = () => {
    let finalExec = exec;
    if (activeTab === 'weblink') {
      if (webAppMode) {
        finalExec = `google-chrome --app="${targetUrl}"`;
      } else {
        return `[Desktop Entry]
Version=1.0
Type=Link
Name=${name}
Comment=${comment}
URL=${targetUrl}
Icon=${icon}
`;
      }
    }

    return `[Desktop Entry]
Version=1.0
Type=Application
Name=${name}
Comment=${comment}
Exec=${finalExec}
Icon=${icon}
Terminal=${runInTerminal ? 'true' : 'false'}
Categories=${categories}
StartupNotify=true
Path=${workingDir}
`;
  };

  const desktopContent = generateDesktopFileContent();

  const generateBashInstallCommand = () => {
    return `# 1. Create file in Desktop directory
cat << 'EOF' > ~/Desktop/${safeFilename}.desktop
${desktopContent}EOF

# 2. Grant executable permission
chmod +x ~/Desktop/${safeFilename}.desktop

# 3. Mark as Trusted for GNOME 40+ (prevents 'Untrusted Launcher' popup)
gio set ~/Desktop/${safeFilename}.desktop metadata::trusted true

# 4. Optional: Notify user
notify-send -i "${icon}" "Shortcut Ready" "Created ${name} on Desktop"`;
  };

  const handleCreateAndTest = () => {
    let finalExec = exec;
    if (activeTab === 'weblink') {
      finalExec = webAppMode ? `google-chrome --app="${targetUrl}"` : `xdg-open "${targetUrl}"`;
    }

    const newShortcut: DesktopShortcut = {
      id: `shortcut-${Date.now()}`,
      name: name.trim() || 'Custom Shortcut',
      type: activeTab,
      exec: finalExec,
      icon,
      comment,
      terminal: runInTerminal,
      categories: categories.split(';').filter(Boolean),
      url: activeTab === 'weblink' ? targetUrl : undefined,
      targetPath: exec,
      isTrusted: true,
      x: 120 + Math.floor(Math.random() * 200),
      y: 80 + Math.floor(Math.random() * 160),
    };

    onAddShortcut(newShortcut);
    onClose();
  };

  const handleDownloadDesktopFile = () => {
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(desktopContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyBash = () => {
    navigator.clipboard.writeText(generateBashInstallCommand());
    setCopiedBash(true);
    setTimeout(() => setCopiedBash(false), 2000);
  };

  const filteredApps = SAMPLE_LINUX_APPS.filter(
    (app) =>
      app.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.genericName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.comment.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl text-zinc-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Create Linux Desktop Shortcut</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Freedesktop Spec v1.5
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Created directly via Desktop Right-Click context menu action
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

        {/* Shortcut Type Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/50 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('application');
              setName('Visual Studio Code');
              setExec('code %F');
              setIcon('vscode');
              setComment('Code Editing. Redefined.');
              setRunInTerminal(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-t border-x transition-colors cursor-pointer ${
              activeTab === 'application'
                ? 'bg-zinc-800 text-amber-300 border-zinc-700'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Rocket className="w-4 h-4 text-blue-400" />
            <span>Installed App</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('document');
              setName('Financial Report Q3.pdf');
              setExec('xdg-open "/home/user/Documents/Financial Report Q3.pdf"');
              setIcon('pdf');
              setComment('Financial document shortcut');
              setRunInTerminal(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-t border-x transition-colors cursor-pointer ${
              activeTab === 'document'
                ? 'bg-zinc-800 text-amber-300 border-zinc-700'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <FileText className="w-4 h-4 text-rose-400" />
            <span>Document / File</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('weblink');
              setName('GitHub Dashboard');
              setTargetUrl('https://github.com');
              setIcon('globe');
              setComment('Visit GitHub repository');
              setRunInTerminal(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-t border-x transition-colors cursor-pointer ${
              activeTab === 'weblink'
                ? 'bg-zinc-800 text-amber-300 border-zinc-700'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Web Link / Web App</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('command');
              setName('System Monitor Htop');
              setExec('htop');
              setIcon('terminal');
              setComment('Interactive process viewer');
              setRunInTerminal(true);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-t border-x transition-colors cursor-pointer ${
              activeTab === 'command'
                ? 'bg-zinc-800 text-amber-300 border-zinc-700'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Bash Command / Script</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('folder');
              setName('Projects Directory');
              setExec('xdg-open ~/Projects');
              setIcon('folder');
              setComment('Quick link to code workspace');
              setRunInTerminal(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-t border-x transition-colors cursor-pointer ${
              activeTab === 'folder'
                ? 'bg-zinc-800 text-amber-300 border-zinc-700'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Folder className="w-4 h-4 text-amber-400" />
            <span>Folder Link</span>
          </button>
        </div>

        {/* Modal Body: Left form, Right live .desktop preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 overflow-y-auto">
          {/* Form Side */}
          <div className="md:col-span-7 space-y-4">
            {/* Quick Presets Picker */}
            {activeTab === 'application' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Rocket className="w-3.5 h-3.5 text-blue-400" />
                    Pick from Installed Applications or type custom:
                  </label>
                  <input
                    type="text"
                    placeholder="Search apps..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="px-2 py-0.5 text-xs rounded bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  {filteredApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => selectAppPreset(app)}
                      className={`flex items-center gap-2 p-1.5 rounded text-left text-xs transition-colors cursor-pointer ${
                        name === app.name
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'hover:bg-zinc-800/70 text-zinc-300'
                      }`}
                    >
                      <IconRenderer icon={app.icon} className="w-5 h-5 flex-shrink-0" size={18} />
                      <span className="truncate font-medium">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'document' && (
              <div>
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
                  <FileText className="w-3.5 h-3.5 text-rose-400" />
                  Select Document / Media Sample:
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-1.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  {SAMPLE_DOCUMENTS.map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectDocPreset(doc)}
                      className="flex items-center gap-2 p-2 rounded text-left text-xs hover:bg-zinc-800/70 transition-colors border border-zinc-800/60 cursor-pointer"
                    >
                      <IconRenderer icon={doc.icon} className="w-5 h-5" size={18} />
                      <div className="truncate">
                        <div className="font-medium text-zinc-200 truncate">{doc.name}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{doc.path}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'weblink' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    Web URL (Website or PWA):
                  </label>
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="webapp-mode"
                    checked={webAppMode}
                    onChange={(e) => setWebAppMode(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-zinc-800 border-zinc-700 focus:ring-amber-500"
                  />
                  <label htmlFor="webapp-mode" className="text-xs text-zinc-300 cursor-pointer">
                    Launch as Standalone App Window (Chrome/Brave/Edge <code className="text-amber-300">--app=URL</code> mode)
                  </label>
                </div>
              </div>
            )}

            {/* Standard Name & Exec inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Shortcut Display Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Comment / Tooltip:
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {activeTab !== 'weblink' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Exec Command / Target:
                </label>
                <input
                  type="text"
                  value={exec}
                  onChange={(e) => setExec(e.target.value)}
                  placeholder="e.g. /usr/bin/code, xdg-open /path/to/file, htop"
                  className="w-full px-3 py-2 text-sm font-mono rounded-lg bg-zinc-950 border border-zinc-700 text-emerald-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Freedesktop System Icon:
              </label>
              <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                {AVAILABLE_ICONS.map((ic) => (
                  <button
                    key={ic.id}
                    onClick={() => setIcon(ic.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                      icon === ic.id
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 scale-105'
                        : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    <IconRenderer icon={ic.id} className="w-4 h-4" size={16} />
                    <span>{ic.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox: Terminal mode */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/80 border border-zinc-800">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="term-check"
                  checked={runInTerminal}
                  onChange={(e) => setRunInTerminal(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-zinc-800 border-zinc-700 focus:ring-amber-500"
                />
                <label htmlFor="term-check" className="text-xs text-zinc-200 cursor-pointer">
                  Run inside Terminal (<code className="text-amber-400 font-mono">Terminal=true</code>)
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-zinc-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide Advanced' : 'More Options'}</span>
              </button>
            </div>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3 animate-in fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                      Categories:
                    </label>
                    <input
                      type="text"
                      value={categories}
                      onChange={(e) => setCategories(e.target.value)}
                      placeholder="Development;IDE;"
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                      Working Directory (Path=):
                    </label>
                    <input
                      type="text"
                      value={workingDir}
                      onChange={(e) => setWorkingDir(e.target.value)}
                      placeholder="~/"
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Live .desktop File & Command Preview */}
          <div className="md:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-amber-400" />
                Raw <code className="text-amber-300">~/Desktop/{safeFilename}.desktop</code>
              </span>
              <button
                onClick={handleCopyCode}
                className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Box */}
            <div className="flex-1 p-3 rounded-xl bg-black border border-zinc-800 font-mono text-xs overflow-x-auto text-zinc-300 leading-relaxed shadow-inner">
              <pre className="text-[11px]">
                {desktopContent.split('\n').map((line, idx) => {
                  if (line.startsWith('[')) {
                    return <span key={idx} className="text-amber-400 font-bold">{line}\n</span>;
                  }
                  if (line.startsWith('Name=')) {
                    return <span key={idx}><span className="text-sky-400">Name</span>=<span className="text-white font-medium">{line.slice(5)}</span>\n</span>;
                  }
                  if (line.startsWith('Exec=')) {
                    return <span key={idx}><span className="text-emerald-400">Exec</span>=<span className="text-emerald-300">{line.slice(5)}</span>\n</span>;
                  }
                  if (line.startsWith('Icon=')) {
                    return <span key={idx}><span className="text-purple-400">Icon</span>=<span className="text-purple-300">{line.slice(5)}</span>\n</span>;
                  }
                  if (line.startsWith('Terminal=')) {
                    return <span key={idx}><span className="text-orange-400">Terminal</span>=<span className="text-orange-300">{line.slice(9)}</span>\n</span>;
                  }
                  return <span key={idx}>{line}\n</span>;
                })}
              </pre>
            </div>

            {/* Linux Desktop Security Note */}
            <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/40 text-[11px] text-sky-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sky-300">GNOME & Cinnamon Security Note:</span> Linux requires{' '}
                <code className="text-amber-300 font-mono">chmod +x</code> and{' '}
                <code className="text-amber-300 font-mono">gio set metadata::trusted true</code> for desktop icons to launch without warnings. Our script handles this automatically!
              </div>
            </div>

            {/* Fast Bash Copy */}
            <button
              onClick={handleCopyBash}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors border border-zinc-700 cursor-pointer"
            >
              {copiedBash ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedBash ? 'Command Copied to Clipboard!' : 'Copy 1-Liner Bash Creator Command'}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/90">
          <button
            onClick={handleDownloadDesktopFile}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors border border-zinc-700 cursor-pointer"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Download .desktop File</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleCreateAndTest}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-bold text-xs tracking-wide shadow-lg shadow-orange-950/40 transition-all transform active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>Create on Simulated Desktop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
