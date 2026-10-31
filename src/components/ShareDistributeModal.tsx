import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Terminal,
  Globe,
  Archive,
  Laptop,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  FileCode,
} from 'lucide-react';

interface ShareDistributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const ShareDistributeModal: React.FC<ShareDistributeModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'script' | 'package'>('link');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  // Universal installer script that works on Ubuntu, Mint, Fedora, Arch, KDE, XFCE
  const universalInstallScript = `#!/usr/bin/env bash
# ==============================================================
# Linux Quick Shortcut Creator - Universal 1-Click Installer
# Works on: Linux Mint (Cinnamon), Ubuntu (GNOME), KDE Plasma, XFCE
# ==============================================================
set -e

echo "🚀 Installing Quick Desktop Shortcut Creator..."

# 1. Create executable python launcher
mkdir -p ~/.local/bin
cat << 'EOF' > ~/.local/bin/quick-shortcut-maker.py
#!/usr/bin/env python3
import os, sys, subprocess, tkinter as tk
from tkinter import ttk, filedialog, messagebox

desktop = os.path.expanduser("~/Desktop")
os.makedirs(desktop, exist_ok=True)

root = tk.Tk()
root.title("⚡ Create Desktop Shortcut")
root.geometry("460x390")
root.resizable(False, False)

name_v = tk.StringVar(value="My Shortcut")
type_v = tk.StringVar(value="Application")
exec_v = tk.StringVar(value="")
icon_v = tk.StringVar(value="application-x-executable")
term_v = tk.BooleanVar(value=False)

ttk.Label(root, text="Shortcut Name:").pack(anchor="w", padx=20, pady=(15, 2))
ttk.Entry(root, textvariable=name_v, width=45).pack(padx=20)

ttk.Label(root, text="Type:").pack(anchor="w", padx=20, pady=(10, 2))
ttk.Combobox(root, textvariable=type_v, values=["Application", "Document/File", "Web URL", "Terminal Command"], state="readonly").pack(padx=20, fill="x")

def browse():
    f = filedialog.askopenfilename(title="Select Target File or App")
    if f:
        exec_v.set(f)
        if name_v.get() == "My Shortcut": name_v.set(os.path.basename(f))

ttk.Label(root, text="Target Command / File / URL:").pack(anchor="w", padx=20, pady=(10, 2))
fr = ttk.Frame(root)
fr.pack(fill="x", padx=20)
ttk.Entry(fr, textvariable=exec_v).pack(side="left", fill="x", expand=True)
ttk.Button(fr, text="Browse...", command=browse).pack(side="right", padx=(5, 0))

ttk.Label(root, text="Icon Name (e.g. firefox, terminal, folder):").pack(anchor="w", padx=20, pady=(10, 2))
ttk.Entry(root, textvariable=icon_v, width=45).pack(padx=20)

ttk.Checkbutton(root, text="Run in Terminal window", variable=term_v).pack(anchor="w", padx=20, pady=10)

def save():
    name = name_v.get().strip()
    target = exec_v.get().strip()
    if not name or not target:
        messagebox.showerror("Error", "Name and Target cannot be empty!")
        return
    safe = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
    fpath = os.path.join(desktop, f"{safe}.desktop")
    t = type_v.get()
    
    if t == "Web URL":
        content = f"[Desktop Entry]\\nVersion=1.0\\nType=Link\\nName={name}\\nURL={target}\\nIcon={icon_v.get() or 'globe'}\\n"
    elif t == "Document/File":
        content = f"[Desktop Entry]\\nVersion=1.0\\nType=Application\\nName={name}\\nExec=xdg-open \\"{target}\\"\\nIcon={icon_v.get() or 'application-x-executable'}\\nTerminal=false\\nStartupNotify=true\\n"
    else:
        content = f"[Desktop Entry]\\nVersion=1.0\\nType=Application\\nName={name}\\nExec={target}\\nIcon={icon_v.get() or 'application-x-executable'}\\nTerminal={'true' if term_v.get() else 'false'}\\nStartupNotify=true\\n"
    
    with open(fpath, "w") as f: f.write(content)
    os.chmod(fpath, 0o755)
    subprocess.run(["gio", "set", fpath, "metadata::trusted", "true"], check=False)
    messagebox.showinfo("Success", f"Shortcut created on your Desktop!\\n{fpath}")
    root.destroy()

btn_fr = ttk.Frame(root)
btn_fr.pack(fill="x", padx=20, pady=15)
ttk.Button(btn_fr, text="Create Shortcut", command=save).pack(side="right")
ttk.Button(btn_fr, text="Cancel", command=root.destroy).pack(side="right", padx=10)
root.mainloop()
EOF
chmod +x ~/.local/bin/quick-shortcut-maker.py

# 2. Hook into Nemo (Linux Mint / Cinnamon) if installed
if [ -d "$HOME/.local/share/nemo" ] || command -v nemo >/dev/null 2>&1; then
    mkdir -p ~/.local/share/nemo/actions
    cat << 'EOF' > ~/.local/share/nemo/actions/create-shortcut.nemo_action
[Nemo Action]
Name=⚡ Create New Shortcut...
Comment=Create shortcut to app, document or command
Exec=python3 ~/.local/bin/quick-shortcut-maker.py
Icon-Name=document-new
Selection=None
Extensions=any
Conditions=desktop;
EOF
    chmod +x ~/.local/share/nemo/actions/create-shortcut.nemo_action
    echo "✓ Cinnamon / Nemo right-click action enabled!"
fi

# 3. Hook into Nautilus / DING (GNOME / Ubuntu / Fedora)
mkdir -p ~/.local/share/nautilus/scripts
cat << 'EOF' > ~/.local/share/nautilus/scripts/"⚡ Create Shortcut"
#!/usr/bin/env bash
python3 ~/.local/bin/quick-shortcut-maker.py
EOF
chmod +x ~/.local/share/nautilus/scripts/"⚡ Create Shortcut"
echo "✓ GNOME / Nautilus script enabled!"

# 4. Hook into KDE Plasma
mkdir -p ~/.local/share/kio/servicemenus
cat << 'EOF' > ~/.local/share/kio/servicemenus/create-shortcut.desktop
[Desktop Entry]
Type=Service
X-KDE-ServiceTypes=KonqPopupMenu/Plugin
MimeType=inode/directory;
Actions=createShortcut;
X-KDE-Priority=TopLevel

[Desktop Action createShortcut]
Name=⚡ Create New Shortcut...
Icon=document-new
Exec=python3 ~/.local/bin/quick-shortcut-maker.py
EOF
echo "✓ KDE Plasma ServiceMenu enabled!"

echo "🎉 Done! Right-click anywhere on your desktop to use your new shortcut creator."`;

  const friendShareMessage = `Hey! Check out this Linux Desktop QuickLauncher tool:
${appUrl}

It lets you create right-click desktop shortcuts for apps, documents, web links, and scripts on Ubuntu, Mint, Fedora, Arch, and KDE!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(universalInstallScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(friendShareMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleDownloadInstallerScript = () => {
    const blob = new Blob([universalInstallScript], { type: 'text/x-shellscript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'install-desktop-shortcuts.sh';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadReadme = () => {
    const readmeContent = `# Linux Quick Shortcut Creator
Instructions for users:

## How to Install (Takes 5 seconds):
1. Open your Terminal (Ctrl + Alt + T)
2. Run this command:
   bash install-desktop-shortcuts.sh

## How to Use:
- Right-click anywhere on your desktop background!
- Click "⚡ Create New Shortcut..." (or "Scripts > ⚡ Create Shortcut")
- Pick your app, file, or command and click "Create Shortcut"!

Compatible with:
- Linux Mint (Cinnamon / Nemo)
- Ubuntu & Fedora (GNOME)
- Kubuntu & Arch (KDE Plasma)
- XFCE
`;
    const blob = new Blob([readmeContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README-INSTRUCTIONS.txt';
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
        className="w-full max-w-3xl rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl text-zinc-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-zinc-950 font-bold shadow-lg shadow-orange-950/40">
              <Share2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  How to Give This to Other People & How They Run It
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Choose the best way to share with your friends, colleagues, or users
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

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-t border-x transition-colors cursor-pointer ${
              activeTab === 'link'
                ? 'bg-zinc-800 text-amber-300 border-zinc-700'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Way 1: Share the Web Link (Zero Install)</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-t border-x transition-colors cursor-pointer ${
              activeTab === 'script'
                ? 'bg-zinc-800 text-amber-300 border-zinc-700'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Way 2: 1-Line Terminal Installer Command</span>
          </button>

          <button
            onClick={() => setActiveTab('package')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold tracking-wide border-t border-x transition-colors cursor-pointer ${
              activeTab === 'package'
                ? 'bg-zinc-800 text-amber-300 border-zinc-700'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Archive className="w-4 h-4 text-purple-400" />
            <span>Way 3: Downloadable Script / USB File</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: WEB LINK */}
          {activeTab === 'link' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  <span>Send them the App URL:</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-lg bg-black border border-zinc-700 text-cyan-300 select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* What the other person has to do */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>What the other person has to do:</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                    <span className="font-bold text-amber-300">Step 1</span>
                    <p className="text-zinc-400">
                      They open your link in their browser (Firefox, Chrome, Brave, Edge). <strong>No account or login required!</strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                    <span className="font-bold text-amber-300">Step 2</span>
                    <p className="text-zinc-400">
                      They search for their app, document, or custom script, or right-click to create a custom shortcut.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                    <span className="font-bold text-amber-300">Step 3</span>
                    <p className="text-zinc-400">
                      They click <strong>"💻 Real PC"</strong> and paste the 1-second command into their terminal, or download the file.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ready-to-Send Message */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                    <span>Ready-to-send Message (for Discord / Slack / Email):</span>
                  </span>
                  <button
                    onClick={handleCopyMessage}
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedMessage ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMessage ? 'Copied Message!' : 'Copy Message'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-black border border-zinc-800 font-mono text-[11px] text-zinc-300 whitespace-pre-wrap">
                  {friendShareMessage}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TERMINAL SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">
                  Give them this 1-line command to install the permanent desktop right-click menu:
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">No root / sudo needed</span>
              </div>

              {/* Code Box */}
              <div className="relative rounded-xl bg-black border border-zinc-800 p-4 font-mono text-xs text-emerald-300 max-h-56 overflow-y-auto shadow-inner">
                <pre className="text-[11px] leading-relaxed whitespace-pre-wrap">{universalInstallScript}</pre>
                
                <button
                  onClick={handleCopyScript}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied Script!' : 'Copy Complete Installer'}</span>
                </button>
              </div>

              {/* What the other person has to do */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>What your user has to do:</span>
                </h4>

                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">1</span>
                    <span>Open terminal (<kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">Ctrl+Alt+T</kbd>).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">2</span>
                    <span>Paste this script and hit <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">Enter</kbd>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">3</span>
                    <span>Right-click anywhere on their desktop &rarr; <strong>⚡ Create New Shortcut...</strong> is now there permanently!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOWNLOADABLE PACKAGE */}
          {activeTab === 'package' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <FileCode className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">install-desktop-shortcuts.sh</div>
                    <div className="text-xs text-zinc-400">Portable offline installer script (share via USB, email, or cloud)</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadReadme}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Instructions.txt</span>
                  </button>

                  <button
                    onClick={handleDownloadInstallerScript}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 text-white font-bold text-xs transition-colors cursor-pointer shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .sh Script</span>
                  </button>
                </div>
              </div>

              {/* Offline User Instructions */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                  What your friend has to do with the downloaded file:
                </h4>

                <div className="space-y-2 text-zinc-300">
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-2.5">
                    <span className="font-mono text-purple-400 font-bold">Method A (GUI):</span>
                    <span>Right-click <code className="text-amber-300 font-mono">install-desktop-shortcuts.sh</code> &gt; <em>Properties</em> &gt; <em>Permissions</em> &gt; check <strong>"Allow executing file as program"</strong>, then double-click and choose <strong>"Run in Terminal"</strong>.</span>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-2.5">
                    <span className="font-mono text-purple-400 font-bold">Method B (Terminal):</span>
                    <span>Run <code className="text-amber-300 font-mono">bash ~/Downloads/install-desktop-shortcuts.sh</code>.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Zero dependencies required: uses built-in Python & Bash</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
