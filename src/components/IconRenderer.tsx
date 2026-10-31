import React from 'react';
import {
  Terminal,
  FileText,
  Globe,
  Folder,
  Code2,
  Music,
  Tv,
  Gamepad2,
  Table,
  Image as ImageIcon,
  FileCode,
  FolderArchive,
  BookOpen,
  Cpu,
  Trash2,
  Home,
  File,
  Layers,
  Sparkles,
  Command,
} from 'lucide-react';

interface IconRendererProps {
  icon: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ icon, className = 'w-6 h-6', size = 24 }) => {
  const norm = icon.toLowerCase();

  if (norm.includes('terminal')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-green-400 p-1 shadow-sm ${className}`}>
        <Terminal size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('code') || norm.includes('vscode')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-blue-600 text-white p-1 shadow-sm ${className}`}>
        <Code2 size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('firefox') || norm.includes('browser')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-gradient-to-tr from-amber-600 to-rose-500 text-white p-1 shadow-sm ${className}`}>
        <Globe size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('spotify') || norm.includes('music')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-emerald-600 text-white p-1 shadow-sm ${className}`}>
        <Music size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('vlc') || norm.includes('video') || norm.includes('player')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-orange-500 text-white p-1 shadow-sm ${className}`}>
        <Tv size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('steam') || norm.includes('game')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-slate-800 text-cyan-400 p-1 shadow-sm ${className}`}>
        <Gamepad2 size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('calc') || norm.includes('sheet')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-teal-600 text-white p-1 shadow-sm ${className}`}>
        <Table size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('obsidian') || norm.includes('notes')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-purple-700 text-white p-1 shadow-sm ${className}`}>
        <BookOpen size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('pdf')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-rose-600 text-white p-1 shadow-sm ${className}`}>
        <FileText size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('image') || norm.includes('gimp')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-amber-700 text-white p-1 shadow-sm ${className}`}>
        <ImageIcon size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('folder-home') || norm === 'home') {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-sky-500 text-white p-1 shadow-sm ${className}`}>
        <Home size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('trash')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-zinc-600 text-zinc-200 p-1 shadow-sm ${className}`}>
        <Trash2 size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('folder')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-amber-500 text-white p-1 shadow-sm ${className}`}>
        <Folder size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('script') || norm.includes('bash') || norm.includes('sh')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-violet-600 text-white p-1 shadow-sm ${className}`}>
        <FileCode size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('globe') || norm.includes('url') || norm.includes('web')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-cyan-600 text-white p-1 shadow-sm ${className}`}>
        <Globe size={size * 0.75} />
      </div>
    );
  }

  if (norm.includes('command')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-indigo-600 text-white p-1 shadow-sm ${className}`}>
        <Command size={size * 0.75} />
      </div>
    );
  }

  // Default application icon
  return (
    <div className={`flex items-center justify-center rounded-lg bg-zinc-700 text-zinc-100 p-1 shadow-sm ${className}`}>
      <Cpu size={size * 0.75} />
    </div>
  );
};
