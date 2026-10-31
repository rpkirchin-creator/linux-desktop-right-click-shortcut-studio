# Linux QuickLauncher & Desktop Shortcut Studio
An interactive Linux desktop simulator and code/installer generator to create custom right-click context menu shortcuts for apps, documents, scripts, and web links across GNOME, KDE, Mint/Cinnamon, and XFCE.

> **Full Documentation:** See [LINUX_SHORTCUT_GUIDE.md](./LINUX_SHORTCUT_GUIDE.md) for complete instructions, spec templates, security rules, and sharing guides.

---

## Highlights

1. **Interactive Desktop Simulator**:
   - Right-click anywhere on the desktop to test the native context menu with **⚡ Create Quick Shortcut...**
   - Search catalog of 25+ popular Linux applications, documents, web URLs, and shell scripts.
   - Switch themes between **Ubuntu GNOME**, **Linux Mint Cinnamon**, and **KDE Plasma 6**.
   - Test the GNOME security gate: right-click any icon to toggle **Allow Launching** (`gio set metadata::trusted true`).

2. **Real-World 1-Click Installers**:
   - **Linux Mint & Cinnamon (Nemo Action)**: 1 command creates `~/.local/share/nemo/actions/create-shortcut.nemo_action`.
   - **Ubuntu & GNOME (Nautilus / DING)**: 1 command creates `~/.local/share/nautilus/scripts/⚡ Create Shortcut`.
   - **KDE Plasma (KIO ServiceMenu)**: 1 command sets up `~/.local/share/kio/servicemenus/create-shortcut.desktop`.
   - **XFCE (Thunar Custom Action)**: User customizable action for folder backgrounds.
   - **Universal Python GUI Script**: Zero external dependencies (uses standard `tkinter`).

3. **Put Shortcuts on Your Real Desktop**:
   - **1-Second Terminal Command**: Copy the generated command into your terminal (`Ctrl + Alt + T`).
   - **File Download**: Download the `.desktop` file, move it to `~/Desktop/`, and right-click "Allow Launching".

4. **How to Share with Others**:
   - **Option 1**: Send the hosted web app URL (Zero installation required).
   - **Option 2**: Send the 1-line bash script.
   - **Option 3**: Download and share `install-desktop-shortcuts.sh` via USB or email.

---

## Quick Reference: 1-Click Terminal Shortcut Creator

To create an instant desktop shortcut in Linux without opening any file manager:

```bash
cat << 'EOF' > ~/Desktop/DesktopLinkStudio.desktop
[Desktop Entry]
Version=1.0
Type=Application
Name=Visual Studio Code
Exec=code %F
Icon=vscode
Terminal=false
Categories=Development;IDE;
StartupNotify=true
EOF
chmod +x ~/Desktop/DesktopLinkStudiodesktop
gio set ~/Desktop/DesktopLinkStudio.desktop metadata::trusted true 2>/dev/null
```

---

## License
Apache-2.0
