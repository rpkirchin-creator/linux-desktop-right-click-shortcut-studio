# Linux QuickLauncher & Desktop Shortcut Guide
Comprehensive handbook for creating custom right-click desktop shortcuts for applications, documents, web links, and scripts across all major Linux desktop environments.

---

## Table of Contents
1. [Overview: How Linux Desktop Context Menus Work](#1-overview-how-linux-desktop-context-menus-work)
2. [Quickest Way: Put a Real Shortcut on Your Desktop Now](#2-quickest-way-put-a-real-shortcut-on-your-desktop-now)
3. [Permanent Setup: Adding "Create Shortcut" to Desktop Right-Click](#3-permanent-setup-adding-create-shortcut-to-desktop-right-click)
   - [A. Linux Mint & Cinnamon (Nemo Action)](#a-linux-mint--cinnamon-nemo-action)
   - [B. Ubuntu & GNOME (Nautilus / DING Script)](#b-ubuntu--gnome-nautilus--ding-script)
   - [C. KDE Plasma 6 & 5 (KIO ServiceMenu)](#c-kde-plasma-6--5-kio-servicemenu)
   - [D. XFCE (Thunar Custom Action)](#d-xfce-thunar-custom-action)
4. [Universal Portable Python GUI Shortcut Maker](#4-universal-portable-python-gui-shortcut-maker)
5. [The Freedesktop .desktop Specification Cheat Sheet](#5-the-freedesktop-desktop-specification-cheat-sheet)
   - [Native Application](#native-application)
   - [Flatpak Sandboxed App](#flatpak-sandboxed-app)
   - [Snap Application](#snap-application)
   - [Document or File (PDF, Sheet, Image)](#document-or-file-pdf-sheet-image)
   - [Web Link or PWA](#web-link-or-pwa)
   - [Terminal Command / Bash Script](#terminal-command--bash-script)
   - [Wine / Windows Program](#wine--windows-program)
6. [Essential Linux Security Rules (Why Shortcuts Fail Without This)](#6-essential-linux-security-rules-why-shortcuts-fail-without-this)
   - [1. The Executable Bit (`chmod +x`)](#1-the-executable-bit-chmod-x)
   - [2. The GNOME Trusted Launcher Flag (`gio set metadata::trusted`)](#2-the-gnome-trusted-launcher-flag-gio-set-metadatatrusted)
7. [How to Give This to Other People & How They Run It](#7-how-to-give-this-to-other-people--how-they-run-it)
   - [Option 1: Share the Web App Link](#option-1-share-the-web-app-link-zero-install)
   - [Option 2: 1-Line Universal Terminal Command](#option-2-1-line-universal-terminal-command)
   - [Option 3: Offline File (`install-desktop-shortcuts.sh`)](#option-3-offline-file-install-desktop-shortcutssh)
8. [Frequently Asked Questions & Troubleshooting](#8-frequently-asked-questions--troubleshooting)

---

## 1. Overview: How Linux Desktop Context Menus Work

In Windows, right-click desktop menus are locked inside the Windows Registry (`HKCR\DesktopBackground\Shell`).

In Linux, the architecture is **modular**. The desktop background is managed by your desktop environment's file manager:
- **Cinnamon / Linux Mint**: Managed by **Nemo**. Supports native `.nemo_action` files.
- **GNOME / Ubuntu / Fedora**: Managed by **Desktop Icons NG (DING)** and **Nautilus**. Supports scripts placed in `~/.local/share/nautilus/scripts/`.
- **KDE Plasma**: Managed by **Plasma Shell & KIO**. Supports ServiceMenus in `~/.local/share/kio/servicemenus/`.
- **XFCE**: Managed by **xfdesktop & Thunar**. Supports User Customizable Actions (`uca.xml`).

Whenever you right-click the desktop, the file manager scans these configuration directories and displays your custom commands immediately!

---

## 2. Quickest Way: Put a Real Shortcut on Your Desktop Now

If you already know what you want to create (an app, document, or script), you can create it on your real Linux desktop in **1 second** using your terminal (`Ctrl + Alt + T`).

### Example 1: Create a Shortcut to VS Code
```bash
cat << 'EOF' > ~/Desktop/VSCode.desktop
[Desktop Entry]
Version=1.0
Type=Application
Name=Visual Studio Code
Comment=Code Editing. Redefined.
Exec=code %F
Icon=vscode
Terminal=false
Categories=Development;IDE;
StartupNotify=true
EOF
chmod +x ~/Desktop/VSCode.desktop
gio set ~/Desktop/VSCode.desktop metadata::trusted true 2>/dev/null
```

### Example 2: Create a Shortcut to a PDF Document
```bash
cat << 'EOF' > ~/Desktop/MyReport.desktop
[Desktop Entry]
Version=1.0
Type=Application
Name=Financial Report Q3
Comment=Open Financial PDF
Exec=xdg-open "/home/user/Documents/Financial Report Q3.pdf"
Icon=application-pdf
Terminal=false
StartupNotify=true
EOF
chmod +x ~/Desktop/MyReport.desktop
gio set ~/Desktop/MyReport.desktop metadata::trusted true 2>/dev/null
```

### Example 3: Create a Shortcut to a Web Link (GitHub)
```bash
cat << 'EOF' > ~/Desktop/GitHub.desktop
[Desktop Entry]
Version=1.0
Type=Link
Name=GitHub Dashboard
Comment=Developer pull requests and issues
URL=https://github.com
Icon=globe
EOF
chmod +x ~/Desktop/GitHub.desktop
gio set ~/Desktop/GitHub.desktop metadata::trusted true 2>/dev/null
```

---

## 3. Permanent Setup: Adding "Create Shortcut" to Desktop Right-Click

Follow the guide below for your specific Linux distribution:

### A. Linux Mint & Cinnamon (Nemo Action)
*Recommended for: Linux Mint, Cinnamon Desktop, LMDE*

1. Open your terminal (<kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd>).
2. Run this command:
```bash
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
```
3. Install the companion GUI dialog script (see [Section 4](#4-universal-portable-python-gui-shortcut-maker)).
4. Right-click empty desktop space &rarr; **⚡ Create New Shortcut...** is now active!

---

### B. Ubuntu & GNOME (Nautilus / DING Script)
*Recommended for: Ubuntu 22.04 / 24.04, Fedora Workstation, Debian GNOME*

1. Open your terminal (<kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd>).
2. Run this command:
```bash
mkdir -p ~/.local/share/nautilus/scripts

cat << 'EOF' > ~/.local/share/nautilus/scripts/"⚡ Create Shortcut"
#!/usr/bin/env bash
DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"

FORM=$(zenity --forms --title="⚡ Create Desktop Shortcut" \
  --text="Create shortcut to any app, file, or command" \
  --add-entry="Shortcut Name" \
  --add-entry="Command or File Path" \
  --add-entry="Icon Name (e.g. firefox, terminal, folder)" \
  --add-combo="Run in Terminal?" --combo-values="false|true" 2>/dev/null)

[ -z "$FORM" ] && exit 0

NAME=$(echo "$FORM" | cut -d'|' -f1)
EXEC=$(echo "$FORM" | cut -d'|' -f2)
ICON=$(echo "$FORM" | cut -d'|' -f3)
TERM=$(echo "$FORM" | cut -d'|' -f4)

[ -z "$ICON" ] && ICON="application-x-executable"
[ -z "$TERM" ] && TERM="false"

# Prompt file browser if command is empty
if [ -z "$EXEC" ]; then
  EXEC=$(zenity --file-selection --title="Select Executable or Document" 2>/dev/null)
  [ -z "$EXEC" ] && exit 0
fi

SAFE_NAME=$(echo "$NAME" | tr -dc 'a-zA-Z0-9 _-')
TARGET_FILE="$DESKTOP_DIR/$SAFE_NAME.desktop"

cat << DESKTOP_EOF > "$TARGET_FILE"
[Desktop Entry]
Version=1.0
Type=Application
Name=$NAME
Exec=$EXEC
Icon=$ICON
Terminal=$TERM
StartupNotify=true
DESKTOP_EOF

chmod +x "$TARGET_FILE"
gio set "$TARGET_FILE" metadata::trusted true 2>/dev/null
notify-send -i "$ICON" "Shortcut Created" "Created $NAME on Desktop"
EOF

chmod +x ~/.local/share/nautilus/scripts/"⚡ Create Shortcut"
```
3. Right-click your desktop &rarr; hover over **Scripts** &rarr; click **⚡ Create Shortcut**!

---

### C. KDE Plasma 6 & 5 (KIO ServiceMenu)
*Recommended for: Kubuntu, Fedora KDE, openSUSE, Arch KDE, Manjaro*

1. Open your terminal (<kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd>).
2. Run this command:
```bash
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
Exec=bash -c 'NAME=$(kdialog --inputbox "Shortcut Name:" "My App"); EXEC=$(kdialog --getopenfilename ~ "*|All Files"); [ -n "$NAME" ] && echo -e "[Desktop Entry]\nType=Application\nName=$NAME\nExec=$EXEC\nIcon=application-x-executable" > ~/Desktop/"$NAME.desktop" && chmod +x ~/Desktop/"$NAME.desktop"'
EOF
```
3. Right-click your KDE desktop background &rarr; select **⚡ Create New Shortcut...**.

---

### D. XFCE (Thunar Custom Action)
*Recommended for: Xubuntu, Linux Mint XFCE, Manjaro XFCE*

1. Open **Thunar** file manager.
2. Go to **Edit** &rarr; **Configure custom actions...**
3. Click the **+** (Add) button.
4. Fill in:
   - **Name**: `⚡ Create Quick Shortcut...`
   - **Description**: `Create instant desktop launcher`
   - **Command**:
     ```bash
     bash -c 'NAME=$(zenity --entry --title="Shortcut Name" --text="Enter Name:"); TARGET=$(zenity --file-selection --title="Select Executable/Doc"); [ -n "$NAME" ] && echo -e "[Desktop Entry]\nVersion=1.0\nType=Application\nName=$NAME\nExec=$TARGET\nIcon=application-x-executable" > ~/Desktop/"$NAME.desktop" && chmod +x ~/Desktop/"$NAME.desktop"'
     ```
   - **Icon**: `document-new`
5. Click **Appearance Conditions** tab:
   - File pattern: `*`
   - Check **Directories**
6. Click **OK**.

---

## 4. Universal Portable Python GUI Shortcut Maker

This standalone Python script provides a graphical window to build shortcuts for apps, documents, URLs, or terminal commands. It uses Python's built-in `tkinter` library, so **no external packages or pip installs are required**.

### Install the script:
```bash
mkdir -p ~/.local/bin

cat << 'EOF' > ~/.local/bin/quick-shortcut.py
#!/usr/bin/env python3
"""
Portable Linux Desktop Shortcut Creator
"""
import os, sys, subprocess, tkinter as tk
from tkinter import ttk, filedialog, messagebox

desktop_dir = os.path.expanduser("~/Desktop")
os.makedirs(desktop_dir, exist_ok=True)

root = tk.Tk()
root.title("⚡ Create Desktop Shortcut")
root.geometry("480x430")
root.resizable(False, False)

# Form Variables
name_var = tk.StringVar(value="My Shortcut")
type_var = tk.StringVar(value="Application")
exec_var = tk.StringVar(value="")
icon_var = tk.StringVar(value="application-x-executable")
term_var = tk.BooleanVar(value=False)

ttk.Label(root, text="Shortcut Name:").pack(anchor="w", padx=20, pady=(15, 2))
ttk.Entry(root, textvariable=name_var, width=50).pack(padx=20)

ttk.Label(root, text="Type:").pack(anchor="w", padx=20, pady=(10, 2))
type_box = ttk.Combobox(
    root,
    textvariable=type_var,
    values=["Application", "Document/File", "Link (Web URL)", "Terminal Command"],
    state="readonly",
)
type_box.pack(padx=20, fill="x")

def browse_target():
    f = filedialog.askopenfilename(title="Select Target Executable or File")
    if f:
        exec_var.set(f)
        if not name_var.get() or name_var.get() == "My Shortcut":
            name_var.set(os.path.basename(f))

ttk.Label(root, text="Command / File Path / Web URL:").pack(anchor="w", padx=20, pady=(10, 2))
frame_exec = ttk.Frame(root)
frame_exec.pack(fill="x", padx=20)
ttk.Entry(frame_exec, textvariable=exec_var, width=38).pack(side="left", fill="x", expand=True)
ttk.Button(frame_exec, text="Browse...", command=browse_target).pack(side="right", padx=(5, 0))

ttk.Label(root, text="Icon Name (e.g. firefox, terminal, folder):").pack(anchor="w", padx=20, pady=(10, 2))
ttk.Entry(root, textvariable=icon_var, width=50).pack(padx=20)

ttk.Checkbutton(root, text="Run in Terminal Window (Terminal=true)", variable=term_var).pack(anchor="w", padx=20, pady=10)

def save_shortcut():
    name = name_var.get().strip()
    target = exec_var.get().strip()
    if not name or not target:
        messagebox.showerror("Error", "Name and Target cannot be empty!")
        return

    safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
    filepath = os.path.join(desktop_dir, f"{safe_name}.desktop")

    t = type_var.get()
    final_type = "Application"
    final_exec = target

    if t == "Link (Web URL)":
        content = f"""[Desktop Entry]
Version=1.0
Type=Link
Name={name}
URL={target}
Icon={icon_var.get() or 'globe'}
"""
    elif t == "Document/File":
        content = f"""[Desktop Entry]
Version=1.0
Type=Application
Name={name}
Exec=xdg-open "{target}"
Icon={icon_var.get() or 'application-x-executable'}
Terminal=false
StartupNotify=true
"""
    else:
        content = f"""[Desktop Entry]
Version=1.0
Type=Application
Name={name}
Exec={target}
Icon={icon_var.get() or 'application-x-executable'}
Terminal={'true' if term_var.get() else 'false'}
StartupNotify=true
"""

    with open(filepath, "w") as f:
        f.write(content)

    os.chmod(filepath, 0o755)
    try:
        subprocess.run(["gio", "set", filepath, "metadata::trusted", "true"], check=False)
    except Exception:
        pass

    messagebox.showinfo("Success", f"Shortcut created successfully on your Desktop!\n{filepath}")
    root.destroy()

btn_frame = ttk.Frame(root)
btn_frame.pack(fill="x", padx=20, pady=20)
ttk.Button(btn_frame, text="Create Desktop Shortcut", command=save_shortcut).pack(side="right")
ttk.Button(btn_frame, text="Cancel", command=root.destroy).pack(side="right", padx=10)

root.mainloop()
EOF

chmod +x ~/.local/bin/quick-shortcut.py
```

You can now run this tool anytime by running `python3 ~/.local/bin/quick-shortcut.py` or binding it to a keyboard shortcut (<kbd>Super</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>).

---

## 5. The Freedesktop .desktop Specification Cheat Sheet

All Linux desktop environments follow the **XDG Desktop Entry Specification**. Here are standard templates for every type of shortcut:

### Native Application
```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=Visual Studio Code
Comment=Code Editing. Redefined.
Exec=code %F
Icon=vscode
Terminal=false
Categories=Development;IDE;
StartupNotify=true
```

### Flatpak Sandboxed App
```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=Spotify (Flatpak)
Comment=Music Player in Flatpak Sandbox
Exec=flatpak run com.spotify.Client %U
Icon=com.spotify.Client
Terminal=false
Categories=AudioVideo;Player;
```

### Snap Application
```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=Obsidian (Snap)
Comment=Knowledge Base
Exec=/snap/bin/obsidian %u
Icon=/snap/obsidian/current/meta/gui/obsidian.png
Terminal=false
Categories=Office;Utility;
```

### Document or File (PDF, Sheet, Image)
*Always use `xdg-open` so it opens in the user's default application:*
```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=Budget Forecast 2026
Comment=Department Quarterly Spreadsheet
Exec=xdg-open "/home/user/Documents/Budget.ods"
Icon=x-office-spreadsheet
Terminal=false
```

### Web Link or PWA
- **Standard Link:**
  ```ini
  [Desktop Entry]
  Version=1.0
  Type=Link
  Name=Google Cloud Console
  URL=https://console.cloud.google.com
  Icon=globe
  ```
- **Standalone Web App Window (Chrome/Brave/Edge):**
  ```ini
  [Desktop Entry]
  Version=1.0
  Type=Application
  Name=GitHub App
  Exec=google-chrome --app="https://github.com"
  Icon=globe
  Terminal=false
  ```

### Terminal Command / Bash Script
```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=System Monitor Htop
Comment=Interactive CLI process viewer
Exec=htop
Icon=utilities-terminal
Terminal=true
```

### Wine / Windows Program
```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=Notepad++ (Wine)
Comment=Windows text editor
Exec=wine "/home/user/.wine/drive_c/Program Files/Notepad++/notepad++.exe"
Icon=wine
Terminal=false
Path=/home/user/.wine/drive_c/Program Files/Notepad++
```

---

## 6. Essential Linux Security Rules (Why Shortcuts Fail Without This)

Many users create a `.desktop` file and find that double-clicking it opens a text editor or shows an error. Linux enforces **two strict security gates**:

### 1. The Executable Bit (`chmod +x`)
Linux will never execute a `.desktop` file unless its executable permission bit is turned on.
```bash
chmod +x ~/Desktop/*.desktop
```

### 2. The GNOME Trusted Launcher Flag (`gio set metadata::trusted`)
In GNOME 40+ (Ubuntu 22.04, 24.04, Fedora), launchers copied to the desktop display a generic gear icon and show an *"Untrusted Desktop Launcher"* warning until marked trusted.

Run this command to trust it instantly:
```bash
gio set ~/Desktop/YourShortcut.desktop metadata::trusted true
```
*Alternatively, right-click the icon on your desktop and click **"Allow Launching"**.*

---

## 7. How to Give This to Other People & How They Run It

### Option 1: Share the Web App Link (Zero Install)
Send them your hosted app link:
> `https://ais-pre-guzn6rwxuhckwvhvkcryh3-894648866967.us-east1.run.app`

**What they do:**
1. Open the URL in Firefox, Chrome, or Brave.
2. Search or pick any shortcut from the library.
3. Click **"💻 Real PC"** &rarr; copy the 1-second terminal command into their terminal (<kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd>) or download the file.

---

### Option 2: 1-Line Universal Terminal Command
Send them this command in chat or email:
```bash
mkdir -p ~/.local/bin ~/.local/share/nemo/actions ~/.local/share/nautilus/scripts ~/.local/share/kio/servicemenus
# (Or use the 1-line script from the "Give to Others" button in the app)
```
**What they do:**
1. Open terminal (<kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd>).
2. Paste the command and hit <kbd>Enter</kbd>.
3. Right-click their desktop &rarr; the shortcut creator is ready.

---

### Option 3: Offline File (`install-desktop-shortcuts.sh`)
Download `install-desktop-shortcuts.sh` from the app's **"Give to Others" &rarr; "Way 3: Downloadable Script"** and put it on a USB flash drive or email it.

**What they do:**
- **Graphical Way:** Right-click the `.sh` file &rarr; **Properties** &rarr; **Permissions** &rarr; check **"Allow executing file as program"**, then double-click and choose **"Run in Terminal"**.
- **Terminal Way:** Run `bash install-desktop-shortcuts.sh`.

---

## 8. Frequently Asked Questions & Troubleshooting

### Q: Why does double-clicking my desktop shortcut open a text editor?
**A:** The executable bit is missing. Open terminal and run:
```bash
chmod +x ~/Desktop/"MyShortcut.desktop"
```

### Q: Why do I see a gear icon and "Untrusted Desktop Launcher" in Ubuntu?
**A:** GNOME requires setting the trusted launcher attribute. Run:
```bash
gio set ~/Desktop/"MyShortcut.desktop" metadata::trusted true
```
Or right-click the desktop icon and choose **"Allow Launching"**.

### Q: Where do icon names come from?
**A:** Linux icon themes store standard icons in `/usr/share/icons/` and `~/.local/share/icons/`. You can specify:
- A standard theme name: `Icon=firefox`, `Icon=utilities-terminal`, `Icon=application-pdf`, `Icon=folder`
- Or an absolute file path to any image: `Icon=/home/user/Pictures/myicon.png`

### Q: How do I make a shortcut run a bash script?
**A:** If the script needs an interactive window (e.g. asking for input), set `Terminal=true`.
```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=My Script
Exec=bash /home/user/scripts/backup.sh
Icon=utilities-terminal
Terminal=true
```

---

*This guide adheres strictly to the Freedesktop.org XDG Desktop Entry Specification v1.5.*
