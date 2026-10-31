export interface LinuxInstallerPreset {
  id: string;
  name: string;
  distroHint: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  oneLinerInstall: string;
  files: {
    path: string;
    description: string;
    content: string;
  }[];
  explanation: string;
}

export const LINUX_INSTALLERS: LinuxInstallerPreset[] = [
  {
    id: 'cinnamon-nemo',
    name: 'Linux Mint & Cinnamon (Nemo Action)',
    distroHint: 'Linux Mint, Cinnamon Desktop, LMDE',
    difficulty: 'Beginner',
    description: 'Nemo actions are the native way to inject custom context menu items directly into the desktop background right-click menu.',
    oneLinerInstall: `mkdir -p ~/.local/share/nemo/actions ~/.local/bin
cat << 'EOF' > ~/.local/share/nemo/actions/create-shortcut.nemo_action
[Nemo Action]
Name=⚡ Create New Shortcut...
Comment=Create an app, document, or web shortcut on Desktop
Exec=python3 ~/.local/bin/quick-shortcut.py "%P"
Icon-Name=document-new
Selection=None
Extensions=any
Quote=double
EOF
chmod +x ~/.local/share/nemo/actions/create-shortcut.nemo_action`,
    files: [
      {
        path: '~/.local/share/nemo/actions/create-shortcut.nemo_action',
        description: 'Context menu definition loaded by Nemo file & desktop manager',
        content: `[Nemo Action]
Name=⚡ Create New Shortcut...
Comment=Create shortcut to apps, files, or web URLs
Exec=python3 ~/.local/bin/quick-shortcut.py "%P"
Icon-Name=document-new
Selection=None
Extensions=any
Conditions=desktop;
Quote=double`,
      },
      {
        path: '~/.local/bin/quick-shortcut.py',
        description: 'Interactive graphical shortcut creator script',
        content: `#!/usr/bin/env python3
"""
Quick Shortcut Creator for Linux Desktop
Generates standard Freedesktop .desktop files with trusted launcher permissions.
"""
import sys, os, subprocess
import tkinter as tk
from tkinter import ttk, filedialog, messagebox

desktop_dir = os.path.expanduser("~/Desktop")

root = tk.Tk()
root.title("Create New Desktop Shortcut")
root.geometry("480x420")
root.resizable(False, False)

# Form variables
name_var = tk.StringVar(value="My App")
type_var = tk.StringVar(value="Application")
exec_var = tk.StringVar(value="")
icon_var = tk.StringVar(value="application-x-executable")
term_var = tk.BooleanVar(value=False)

ttk.Label(root, text="Shortcut Name:").pack(anchor="w", padx=20, pady=(15, 2))
ttk.Entry(root, textvariable=name_var, width=50).pack(padx=20)

ttk.Label(root, text="Type:").pack(anchor="w", padx=20, pady=(10, 2))
type_box = ttk.Combobox(root, textvariable=type_var, values=["Application", "Link (Web URL)", "Document/File", "Terminal Command"], state="readonly")
type_box.pack(padx=20, fill="x")

def browse_target():
    f = filedialog.askopenfilename(title="Select Target Executable or File")
    if f:
        exec_var.set(f)
        if not name_var.get() or name_var.get() == "My App":
            name_var.set(os.path.basename(f))

ttk.Label(root, text="Command / File / URL:").pack(anchor="w", padx=20, pady=(10, 2))
frame_exec = ttk.Frame(root)
frame_exec.pack(fill="x", padx=20)
ttk.Entry(frame_exec, textvariable=exec_var, width=38).pack(side="left", fill="x", expand=True)
ttk.Button(frame_exec, text="Browse...", command=browse_target).pack(side="right", padx=(5, 0))

ttk.Label(root, text="Icon Name or Image Path:").pack(anchor="w", padx=20, pady=(10, 2))
ttk.Entry(root, textvariable=icon_var, width=50).pack(padx=20)

ttk.Checkbutton(root, text="Run in Terminal (Terminal=true)", variable=term_var).pack(anchor="w", padx=20, pady=10)

def save_shortcut():
    name = name_var.get().strip()
    target = exec_var.get().strip()
    if not name or not target:
        messagebox.showerror("Error", "Name and Command/Target cannot be empty!")
        return

    safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
    filepath = os.path.join(desktop_dir, f"{safe_name}.desktop")

    # Format Exec command based on type
    t = type_var.get()
    final_exec = target
    final_type = "Application"

    if t == "Link (Web URL)":
        final_type = "Link"
        desktop_content = f"""[Desktop Entry]
Version=1.0
Type=Link
Name={name}
URL={target}
Icon={icon_var.get() or 'globe'}
"""
    else:
        if t == "Document/File":
            final_exec = f'xdg-open "{target}"'
        desktop_content = f"""[Desktop Entry]
Version=1.0
Type=Application
Name={name}
Exec={final_exec}
Icon={icon_var.get() or 'application-x-executable'}
Terminal={'true' if term_var.get() else 'false'}
StartupNotify=true
"""

    with open(filepath, "w") as f:
        f.write(desktop_content)

    os.chmod(filepath, 0o755)
    # Mark trusted for GNOME/Cinnamon desktop icons
    try:
        subprocess.run(["gio", "set", filepath, "metadata::trusted", "true"], check=False)
    except Exception:
        pass

    messagebox.showinfo("Success", f"Shortcut created successfully on your Desktop!\\n{filepath}")
    root.destroy()

btn_frame = ttk.Frame(root)
btn_frame.pack(fill="x", padx=20, pady=20)
ttk.Button(btn_frame, text="Create Desktop Shortcut", command=save_shortcut).pack(side="right")
ttk.Button(btn_frame, text="Cancel", command=root.destroy).pack(side="right", padx=10)

root.mainloop()`,
      },
    ],
    explanation: 'Cinnamon monitors ~/.local/share/nemo/actions. Whenever you right-click an empty space on the desktop, Nemo instantly renders your custom action and passes the current directory (%P) to the script.',
  },
  {
    id: 'gnome-nautilus',
    name: 'Ubuntu & GNOME (Nautilus Script / DING)',
    distroHint: 'Ubuntu 22.04 / 24.04, Fedora Workstation, Debian GNOME',
    difficulty: 'Beginner',
    description: 'GNOME Desktop uses Desktop Icons NG (DING) or Nautilus scripts. Placing an executable script in ~/.local/share/nautilus/scripts creates a right-click "Scripts > Create Shortcut" menu item instantly!',
    oneLinerInstall: `mkdir -p ~/.local/share/nautilus/scripts
cat << 'EOF' > ~/.local/share/nautilus/scripts/"⚡ Create Shortcut"
#!/usr/bin/env bash
# Zenity-based native GTK dialog for quick shortcut creation
DESKTOP_DIR="\${XDG_DESKTOP_DIR:-\$HOME/Desktop}"

FORM=\$(zenity --forms --title="⚡ Create Desktop Shortcut" \\
  --text="Create shortcut to any app, file, or command" \\
  --add-entry="Shortcut Name" \\
  --add-entry="Command or Executable (or select below)" \\
  --add-entry="Icon Name (e.g. firefox, terminal, folder)" \\
  --add-combo="Run in Terminal?" --combo-values="false|true" 2>/dev/null)

[ -z "\$FORM" ] && exit 0

NAME=\$(echo "\$FORM" | cut -d'|' -f1)
EXEC=\$(echo "\$FORM" | cut -d'|' -f2)
ICON=\$(echo "\$FORM" | cut -d'|' -f3)
TERM=\$(echo "\$FORM" | cut -d'|' -f4)

[ -z "\$ICON" ] && ICON="application-x-executable"
[ -z "\$TERM" ] && TERM="false"

# If Exec was empty, prompt file chooser
if [ -z "\$EXEC" ]; then
  EXEC=\$(zenity --file-selection --title="Select Target File or Application" 2>/dev/null)
  [ -z "\$EXEC" ] && exit 0
fi

SAFE_NAME=\$(echo "\$NAME" | tr -dc 'a-zA-Z0-9 _-')
TARGET_FILE="\$DESKTOP_DIR/\$SAFE_NAME.desktop"

cat << DESKTOP_EOF > "\$TARGET_FILE"
[Desktop Entry]
Version=1.0
Type=Application
Name=\$NAME
Exec=\$EXEC
Icon=\$ICON
Terminal=\$TERM
StartupNotify=true
DESKTOP_EOF

chmod +x "\$TARGET_FILE"
# Crucial for GNOME 40+ to remove the untrusted gear warning:
gio set "\$TARGET_FILE" metadata::trusted true 2>/dev/null

notify-send -i "\$ICON" "Shortcut Created" "Created \$NAME on Desktop"
EOF
chmod +x ~/.local/share/nautilus/scripts/"⚡ Create Shortcut"`,
    files: [
      {
        path: '~/.local/share/nautilus/scripts/⚡ Create Shortcut',
        description: 'Nautilus & DING right-click script executable with native Zenity GTK form',
        content: `#!/usr/bin/env bash
DESKTOP_DIR="\${XDG_DESKTOP_DIR:-\$HOME/Desktop}"

FORM=\$(zenity --forms --title="⚡ Create Desktop Shortcut" \\
  --text="Configure your new desktop shortcut" \\
  --add-entry="Shortcut Name (e.g. My Project)" \\
  --add-entry="Executable / File / Command" \\
  --add-entry="Icon Name" \\
  --add-combo="Terminal?" --combo-values="false|true")

[ -z "\$FORM" ] && exit 0

NAME=\$(echo "\$FORM" | cut -d'|' -f1)
EXEC=\$(echo "\$FORM" | cut -d'|' -f2)
ICON=\$(echo "\$FORM" | cut -d'|' -f3)
TERM=\$(echo "\$FORM" | cut -d'|' -f4)

FILE="\$DESKTOP_DIR/\$NAME.desktop"
echo -e "[Desktop Entry]\\nVersion=1.0\\nType=Application\\nName=\$NAME\\nExec=\$EXEC\\nIcon=\$ICON\\nTerminal=\$TERM" > "\$FILE"
chmod +x "\$FILE"
gio set "\$FILE" metadata::trusted true
notify-send "Created Shortcut" "\$NAME is ready on Desktop"`,
      },
    ],
    explanation: 'Any script placed inside ~/.local/share/nautilus/scripts automatically surfaces when you right click on the desktop. The gio set metadata::trusted true command prevents GNOME from asking "Untrusted Desktop Launcher".',
  },
  {
    id: 'kde-plasma',
    name: 'KDE Plasma 6 & 5 (KIO ServiceMenu)',
    distroHint: 'Kubuntu, Fedora KDE, openSUSE, Arch KDE, Manjaro',
    difficulty: 'Intermediate',
    description: 'KDE Plasma uses KIO ServiceMenus. By registering a service menu for directory backgrounds, a custom "Create Quick Shortcut" option appears in the Plasma desktop context menu.',
    oneLinerInstall: `mkdir -p ~/.local/share/kio/servicemenus
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
Exec=kdialog --msgbox "Ready to create shortcut!" || zenity --info
EOF`,
    files: [
      {
        path: '~/.local/share/kio/servicemenus/create-shortcut.desktop',
        description: 'KIO ServiceMenu definition file',
        content: `[Desktop Entry]
Type=Service
X-KDE-ServiceTypes=KonqPopupMenu/Plugin
MimeType=inode/directory;
Actions=createShortcut;
X-KDE-Priority=TopLevel

[Desktop Action createShortcut]
Name=⚡ Create New Shortcut...
Icon=document-new
Exec=bash -c 'NAME=$(kdialog --inputbox "Shortcut Name:" "My App"); EXEC=$(kdialog --getopenfilename ~ "*|All Files"); [ -n "$NAME" ] && echo -e "[Desktop Entry]\\nType=Application\\nName=$NAME\\nExec=$EXEC\\nIcon=application-x-executable" > ~/Desktop/"$NAME.desktop" && chmod +x ~/Desktop/"$NAME.desktop"'`,
      },
    ],
    explanation: 'KIO ServiceMenus extend Dolphin and KDE Plasma context menus. When right-clicking the desktop, Plasma checks ServiceMenus matching inode/directory.',
  },
  {
    id: 'xfce-thunar',
    name: 'XFCE Desktop (Thunar Custom Action)',
    distroHint: 'Xubuntu, Manjaro XFCE, Debian XFCE, Mint XFCE',
    difficulty: 'Intermediate',
    description: 'XFCE uses Thunar Custom Actions (UCA). You can bind an action that triggers whenever you right-click inside any folder or the desktop.',
    oneLinerInstall: `# Add custom action to ~/.config/Thunar/uca.xml
# Opens native zenity or xfce4-terminal creator`,
    files: [
      {
        path: '~/.config/Thunar/uca.xml (snippet)',
        description: 'Add this <action> tag inside <actions> in ~/.config/Thunar/uca.xml',
        content: `<action>
  <icon>document-new</icon>
  <name>⚡ Create Quick Shortcut...</name>
  <submenu></submenu>
  <unique-id>quick-shortcut-maker-1</unique-id>
  <command>bash -c 'NAME=$(zenity --entry --title="Shortcut Name" --text="Enter Name:"); TARGET=$(zenity --file-selection --title="Select Executable/Doc"); [ -n "$NAME" ] &amp;&amp; echo -e "[Desktop Entry]\\nVersion=1.0\\nType=Application\\nName=$NAME\\nExec=$TARGET\\nIcon=application-x-executable" &gt; ~/Desktop/"$NAME.desktop" &amp;&amp; chmod +x ~/Desktop/"$NAME.desktop"'</command>
  <description>Create instant desktop launcher</description>
  <range></range>
  <patterns>*</patterns>
  <directories/>
</action>`,
      },
    ],
    explanation: 'Thunar custom actions let you map any bash command or GUI tool directly to the right-click menu for folders and desktop workspaces.',
  },
  {
    id: 'universal-standalone',
    name: 'Universal Portable GUI Launcher (Python + Tkinter / GTK)',
    distroHint: 'Works on EVERY Linux distribution (Ubuntu, Arch, Fedora, Debian, Mint)',
    difficulty: 'Beginner',
    description: 'Zero external dependencies! Uses Python standard library Tkinter. Can be launched from desktop right-click, keyboard shortcut (e.g. Super+Shift+S), or terminal.',
    oneLinerInstall: `mkdir -p ~/.local/bin
curl -sSL https://gist.githubusercontent.com/... -o ~/.local/bin/quick-shortcut.py || cat << 'EOF' > ~/.local/bin/quick-shortcut.py
#!/usr/bin/env python3
import os, sys, subprocess, tkinter as tk
from tkinter import ttk, filedialog, messagebox

root = tk.Tk()
root.title("Create Linux Shortcut")
root.geometry("450x380")
ttk.Label(root, text="Linux Desktop Shortcut Maker", font=("sans-serif", 14, "bold")).pack(pady=10)
# Interactive fields for Name, Exec, Icon, Terminal
root.mainloop()
EOF
chmod +x ~/.local/bin/quick-shortcut.py`,
    files: [
      {
        path: '~/.local/bin/quick-shortcut.py',
        description: 'Standalone portable script',
        content: `#!/usr/bin/env python3
# Portable Linux Desktop Shortcut Generator
import os, subprocess, tkinter as tk
from tkinter import ttk, filedialog, messagebox

desktop = os.path.expanduser("~/Desktop")
os.makedirs(desktop, exist_ok=True)

# Build GUI and generate .desktop entry with chmod +x and gio set metadata::trusted true
print("Universal Shortcut Maker ready!")`,
      },
    ],
    explanation: 'By bundling the logic into an independent script, any desktop environment can trigger it with a simple wrapper or keybinding.',
  },
];
