export const LINUX_GUIDE_MARKDOWN = `# Linux QuickLauncher & Desktop Shortcut Guide
Comprehensive handbook for creating custom right-click desktop shortcuts for applications, documents, web links, and scripts across all major Linux desktop environments.

---

## Table of Contents
1. Overview: How Linux Desktop Context Menus Work
2. Quickest Way: Put a Real Shortcut on Your Desktop Now
3. Permanent Setup: Adding "Create Shortcut" to Desktop Right-Click
   - Linux Mint & Cinnamon (Nemo Action)
   - Ubuntu & GNOME (Nautilus / DING Script)
   - KDE Plasma 6 & 5 (KIO ServiceMenu)
   - XFCE (Thunar Custom Action)
4. Universal Portable Python GUI Shortcut Maker
5. The Freedesktop .desktop Specification Cheat Sheet
6. Essential Linux Security Rules (chmod +x and gio trust)
7. How to Give This to Other People & How They Run It
8. Frequently Asked Questions & Troubleshooting

---

## 1. Overview: How Linux Desktop Context Menus Work

In Windows, right-click desktop menus are locked inside the Windows Registry.
In Linux, the architecture is modular:
- Cinnamon / Linux Mint: Managed by Nemo (~/.local/share/nemo/actions/)
- GNOME / Ubuntu / Fedora: Managed by DING & Nautilus (~/.local/share/nautilus/scripts/)
- KDE Plasma: Managed by KIO (~/.local/share/kio/servicemenus/)
- XFCE: Managed by Thunar (~/.config/Thunar/uca.xml)

---

## 2. Quickest Way: Put a Real Shortcut on Your Desktop Now

Run this in your terminal (Ctrl + Alt + T):

\`\`\`bash
cat << 'EOF' > ~/Desktop/MyShortcut.desktop
[Desktop Entry]
Version=1.0
Type=Application
Name=Visual Studio Code
Exec=code %F
Icon=vscode
Terminal=false
StartupNotify=true
EOF
chmod +x ~/Desktop/MyShortcut.desktop
gio set ~/Desktop/MyShortcut.desktop metadata::trusted true 2>/dev/null
\`\`\`

---

## 3. Permanent Setup for Your Distro

### Linux Mint & Cinnamon (Nemo Action)
\`\`\`bash
mkdir -p ~/.local/share/nemo/actions ~/.local/bin
cat << 'EOF' > ~/.local/share/nemo/actions/create-shortcut.nemo_action
[Nemo Action]
Name=⚡ Create New Shortcut...
Comment=Create shortcut to apps, files, or web URLs
Exec=python3 ~/.local/bin/quick-shortcut.py "%P"
Icon-Name=document-new
Selection=None
Extensions=any
Conditions=desktop;
Quote=double
EOF
chmod +x ~/.local/share/nemo/actions/create-shortcut.nemo_action
\`\`\`

### Ubuntu & GNOME (Nautilus Script)
\`\`\`bash
mkdir -p ~/.local/share/nautilus/scripts
cat << 'EOF' > ~/.local/share/nautilus/scripts/"⚡ Create Shortcut"
#!/usr/bin/env bash
DESKTOP_DIR="\${XDG_DESKTOP_DIR:-\$HOME/Desktop}"
FORM=\$(zenity --forms --title="⚡ Create Desktop Shortcut" \\
  --text="Configure shortcut" \\
  --add-entry="Shortcut Name" \\
  --add-entry="Command or File Path" \\
  --add-entry="Icon Name" \\
  --add-combo="Terminal?" --combo-values="false|true" 2>/dev/null)
[ -z "\$FORM" ] && exit 0
NAME=\$(echo "\$FORM" | cut -d'|' -f1)
EXEC=\$(echo "\$FORM" | cut -d'|' -f2)
ICON=\$(echo "\$FORM" | cut -d'|' -f3)
TERM=\$(echo "\$FORM" | cut -d'|' -f4)
FILE="\$DESKTOP_DIR/\$NAME.desktop"
echo -e "[Desktop Entry]\\nVersion=1.0\\nType=Application\\nName=\$NAME\\nExec=\$EXEC\\nIcon=\${ICON:-application-x-executable}\\nTerminal=\${TERM:-false}" > "\$FILE"
chmod +x "\$FILE"
gio set "\$FILE" metadata::trusted true 2>/dev/null
notify-send "Shortcut Created" "Created \$NAME on Desktop"
EOF
chmod +x ~/.local/share/nautilus/scripts/"⚡ Create Shortcut"
\`\`\`

### KDE Plasma 6 & 5
\`\`\`bash
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
Exec=bash -c 'NAME=\$(kdialog --inputbox "Shortcut Name:" "My App"); EXEC=\$(kdialog --getopenfilename ~ "*|All Files"); [ -n "\$NAME" ] && echo -e "[Desktop Entry]\\nType=Application\\nName=\$NAME\\nExec=\$EXEC\\nIcon=application-x-executable" > ~/Desktop/"\$NAME.desktop" && chmod +x ~/Desktop/"\$NAME.desktop"'
EOF
\`\`\`

---

## 4. How to Share with Others & How They Run It

### Option A: Web Link (Zero Install)
Send them: https://ais-pre-guzn6rwxuhckwvhvkcryh3-894648866967.us-east1.run.app
They open it in any browser, pick a shortcut, click "💻 Real PC" -> copy command into terminal.

### Option B: 1-Line Terminal Command
Give them the script from the "Give to Others" tab. They open terminal (Ctrl+Alt+T), paste, press Enter.

### Option C: Offline File (install.sh)
Download the script and pass it via USB.
User right-clicks the file -> Properties -> check "Allow executing file as program" -> double-click "Run in Terminal".

---

## 5. Security Checklist
- chmod +x ~/Desktop/*.desktop (makes file executable)
- gio set ~/Desktop/*.desktop metadata::trusted true (removes GNOME 40+ Untrusted warning)
`;
