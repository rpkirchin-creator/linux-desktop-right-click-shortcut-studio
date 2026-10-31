import React from 'react';
import {
  Layers,
  Cpu,
  ShieldCheck,
  Code,
  HelpCircle,
  FileText,
  Terminal,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const ArchitectureExplainer: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Explainer */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold tracking-wider uppercase">
          <Layers className="w-4 h-4" />
          <span>Linux Desktop Architecture Guide</span>
        </div>
        <h2 className="text-2xl font-bold text-white leading-tight">
          How Right-Click Desktop Context Actions Work in Linux
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
          In Windows, desktop context menus are locked inside the Windows Registry (<code className="text-amber-300">HKCR\DesktopBackground\Shell</code>).
          In contrast, Linux is <strong>fully modular</strong>: desktop environments delegate desktop background management to either the file manager
          (like <em>Nemo</em> in Cinnamon, <em>Nautilus/DING</em> in GNOME, <em>Dolphin/Plasma</em> in KDE, or <em>Thunar</em> in XFCE).
          This means you can easily create an app or script that seamlessly injects into your desktop right-click menu!
        </p>
      </div>

      {/* The 4 Architectural Approaches */}
      <div>
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400" />
          <span>The 4 Ways to Add a Right-Click Shortcut Creator</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Nemo Actions */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">1. Nemo Actions (Cinnamon / Mint)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Most Direct
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Nemo allows dropping a <code className="text-amber-300 font-mono">.nemo_action</code> file in{' '}
              <code className="text-zinc-300 font-mono">~/.local/share/nemo/actions/</code>. By setting{' '}
              <code className="text-amber-300 font-mono">Selection=None</code> and <code className="text-amber-300 font-mono">Conditions=desktop;</code>,
              the option appears only when clicking empty desktop space!
            </p>
          </div>

          {/* 2. Nautilus Scripts */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">2. Nautilus & DING Scripts (GNOME)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Zero Setup
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              GNOME uses Desktop Icons NG (DING). Any executable shell script placed in{' '}
              <code className="text-zinc-300 font-mono">~/.local/share/nautilus/scripts/</code> appears immediately under the right-click menu.
              When clicked, it launches a native GTK/Zenity dialog to configure your shortcut.
            </p>
          </div>

          {/* 3. KDE ServiceMenus */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">3. KIO ServiceMenus (KDE Plasma)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30">
                KDE Standard
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              KDE Plasma registers plugins through ServiceMenus in{' '}
              <code className="text-zinc-300 font-mono">~/.local/share/kio/servicemenus/</code>. Defining an action for MIME type{' '}
              <code className="text-amber-300 font-mono">inode/directory</code> hooks into the desktop canvas right-click menu.
            </p>
          </div>

          {/* 4. Standalone Daemon / App */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">4. Standalone Python / GTK GUI Utility</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Universal
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A standalone desktop app written in Python with Tkinter or GTK3/4 that can be triggered from right-click, application menu,
              or a hotkey (like <code className="text-amber-300 font-mono">Super + Shift + S</code>) and creates standard <code className="text-amber-300 font-mono">.desktop</code> files in <code className="text-zinc-300 font-mono">~/Desktop/</code>.
            </p>
          </div>
        </div>
      </div>

      {/* The 3-Step Lifecycle Diagram */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>The 3 Rules Every Linux Desktop Shortcut Must Follow</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">Step 1: Specification</div>
            <div className="text-sm font-semibold text-white">Create Valid .desktop File</div>
            <p className="text-xs text-zinc-400">
              Must adhere to XDG Freedesktop spec with <code className="text-amber-300">[Desktop Entry]</code>,{' '}
              <code className="text-amber-300">Type=Application</code>, <code className="text-amber-300">Name=</code>, and <code className="text-amber-300">Exec=</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
            <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Step 2: Executable Bit</div>
            <div className="text-sm font-semibold text-white">chmod +x Shortcut.desktop</div>
            <p className="text-xs text-zinc-400">
              Linux security prevents executing any file that does not have the executable bit set. Without this, double-clicking will open it in a text editor instead of running it.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
            <div className="text-sky-400 font-bold text-xs uppercase tracking-wider">Step 3: Security Trust</div>
            <div className="text-sm font-semibold text-white">gio set metadata::trusted true</div>
            <p className="text-xs text-zinc-400">
              Modern GNOME 40+ displays an "Untrusted Desktop Launcher" warning dialog unless the GIO trusted metadata attribute is set. Our script configures this automatically!
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div>
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>Frequently Asked Questions & Pro-Tips</span>
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <h4 className="text-sm font-semibold text-white mb-1">
              How do I create shortcuts to Flatpak apps?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Flatpaks run inside a sandbox. Use the command <code className="text-emerald-400 font-mono">flatpak run &lt;Application.ID&gt;</code>.
              For example: <code className="text-amber-300 font-mono">Exec=flatpak run org.mozilla.firefox</code> or{' '}
              <code className="text-amber-300 font-mono">Exec=flatpak run com.spotify.Client</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <h4 className="text-sm font-semibold text-white mb-1">
              Where can I put custom PNG or SVG icon files?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You can specify any standard freedesktop icon name (e.g. <code className="text-amber-300 font-mono">Icon=firefox</code>) which resolves from your icon theme,
              or an absolute path to any image file (e.g. <code className="text-amber-300 font-mono">Icon=/home/user/Pictures/myicon.png</code>).
              You can also store personal icons in <code className="text-zinc-300 font-mono">~/.local/share/icons/</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <h4 className="text-sm font-semibold text-white mb-1">
              Can I bind this to a global keyboard shortcut instead of right-click?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Yes! In GNOME Settings &gt; Keyboard &gt; Custom Shortcuts, or KDE System Settings &gt; Shortcuts, add a new shortcut:
              Name: <em>Quick Shortcut Maker</em>, Command: <code className="text-amber-300 font-mono">python3 ~/.local/bin/quick-shortcut.py</code>,
              and bind it to <code className="text-white font-mono bg-zinc-800 px-1.5 py-0.5 rounded">Super + Shift + S</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
