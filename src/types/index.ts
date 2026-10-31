export type DesktopEnvironment = 'gnome' | 'cinnamon' | 'kde' | 'xfce';

export type ShortcutType = 'application' | 'document' | 'weblink' | 'command' | 'folder';

export interface DesktopShortcut {
  id: string;
  name: string;
  type: ShortcutType;
  exec: string;
  icon: string;
  comment?: string;
  terminal?: boolean;
  categories?: string[];
  url?: string;
  targetPath?: string;
  isTrusted?: boolean; // For GNOME 'Allow Launching'
  x: number;
  y: number;
}

export interface InstalledAppPreset {
  id: string;
  name: string;
  genericName: string;
  comment: string;
  exec: string;
  icon: string;
  categories: string[];
  terminal: boolean;
  sampleContent?: string;
}

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  type: 'app' | 'doc' | 'terminal' | 'web';
  content?: string;
  url?: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}
