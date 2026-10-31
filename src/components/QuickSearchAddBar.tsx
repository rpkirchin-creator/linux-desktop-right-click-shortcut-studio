import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Sparkles,
  ChevronDown,
  X,
  SlidersHorizontal,
  Rocket,
  FileText,
  Globe,
  Terminal,
  Folder,
  Check,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { DESKTOP_CATALOG_ITEMS, CatalogItem } from '../data/sampleApps';
import { DesktopShortcut } from '../types';
import { IconRenderer } from './IconRenderer';

interface QuickSearchAddBarProps {
  onAddShortcut: (shortcut: DesktopShortcut) => void;
  onCustomizeItem?: (item: CatalogItem) => void;
  onExportRealDesktop?: (item: CatalogItem) => void;
  existingShortcuts: DesktopShortcut[];
}

type CategoryFilter = 'all' | 'app' | 'document' | 'weblink' | 'script' | 'system';

export const QuickSearchAddBar: React.FC<QuickSearchAddBarProps> = ({
  onAddShortcut,
  onCustomizeItem,
  onExportRealDesktop,
  existingShortcuts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [dropdownValue, setDropdownValue] = useState<string>('');
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [recentAddedId, setRecentAddedId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' or 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsListExpanded(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter items based on query and category
  const filteredItems = useMemo(() => {
    return DESKTOP_CATALOG_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'app' && (item.category === 'app' || item.category === 'game')) ||
        item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inName = item.name.toLowerCase().includes(q);
      const inComment = item.comment.toLowerCase().includes(q);
      const inExec = item.exec.toLowerCase().includes(q);
      const inTags = item.tags.some((t) => t.toLowerCase().includes(q));

      return inName || inComment || inExec || inTags;
    });
  }, [searchQuery, selectedCategory]);

  // Calculate next open coordinate on desktop so icons don't stack directly on top of each other
  const getNextAvailableCoords = () => {
    const startX = 140;
    const startY = 30;
    const stepY = 95;
    const stepX = 110;
    const maxY = 450;

    const count = existingShortcuts.length;
    const col = Math.floor((count * stepY) / maxY);
    const row = count % Math.floor(maxY / stepY);

    const x = Math.min(startX + col * stepX, 600);
    const y = Math.min(startY + row * stepY, 420);

    return { x, y };
  };

  const handleAddItemToDesktop = (item: CatalogItem) => {
    const { x, y } = getNextAvailableCoords();

    const newShortcut: DesktopShortcut = {
      id: `shortcut-${item.id}-${Date.now()}`,
      name: item.name,
      type: item.type,
      exec: item.exec,
      icon: item.icon,
      comment: item.comment,
      terminal: item.terminal,
      categories: item.categories || ['Utility'],
      url: item.url,
      targetPath: item.exec,
      isTrusted: true,
      x,
      y,
    };

    onAddShortcut(newShortcut);
    setRecentAddedId(item.id);
    setTimeout(() => setRecentAddedId(null), 2500);
  };

  // When picking directly from the HTML populated dropdown
  const handleDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chosenId = e.target.value;
    setDropdownValue(chosenId);
    if (!chosenId) return;

    const found = DESKTOP_CATALOG_ITEMS.find((it) => it.id === chosenId);
    if (found) {
      handleAddItemToDesktop(found);
    }
  };

  const selectedItemObject = DESKTOP_CATALOG_ITEMS.find((it) => it.id === dropdownValue);

  return (
    <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl overflow-hidden transition-all">
      {/* Header bar / Search area */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Quick Search & Desktop Shortcut Library
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {DESKTOP_CATALOG_ITEMS.length} Pre-configured Items
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  1-Click Export to Real PC
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Click <strong>+ Add</strong> to place in the simulator, or <strong>💻 Real PC</strong> to put on your actual computer in 1 second
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsListExpanded(!isListExpanded)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>{isListExpanded ? 'Hide Catalog List' : 'Browse All Items'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isListExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Input Bar + Populated Dropdown row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-1">
          {/* Live Search Input (7 cols) */}
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isListExpanded) setIsListExpanded(true);
              }}
              onFocus={() => setIsListExpanded(true)}
              placeholder="Type to search (e.g. 'code', 'firefox', 'pdf', 'docker', 'budget')..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-black border border-zinc-700/80 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Populated Dropdown <select> (5 cols) */}
          <div className="md:col-span-5 flex items-center gap-2">
            <div className="relative flex-1">
              <select
                value={dropdownValue}
                onChange={handleDropdownSelect}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500 cursor-pointer shadow-inner"
              >
                <option value="">⚡ Select from Populated List...</option>
                
                <optgroup label="🚀 Installed Applications">
                  {DESKTOP_CATALOG_ITEMS.filter((i) => i.category === 'app' || i.category === 'game').map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.name} ({it.exec})
                    </option>
                  ))}
                </optgroup>

                <optgroup label="📄 Documents, Spreadsheets & Files">
                  {DESKTOP_CATALOG_ITEMS.filter((i) => i.category === 'document').map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.name}
                    </option>
                  ))}
                </optgroup>

                <optgroup label="🌐 Web Links & Web Apps">
                  {DESKTOP_CATALOG_ITEMS.filter((i) => i.category === 'weblink').map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.name} ({it.url})
                    </option>
                  ))}
                </optgroup>

                <optgroup label="⚙️ Terminal Commands & Shell Scripts">
                  {DESKTOP_CATALOG_ITEMS.filter((i) => i.category === 'script' || i.category === 'system').map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.name} [{it.exec}]
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {selectedItemObject && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleAddItemToDesktop(selectedItemObject)}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 text-zinc-950 font-bold text-xs whitespace-nowrap shadow-md cursor-pointer active:scale-95 transition-all"
                  title="Add selected item to simulator desktop"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add</span>
                </button>

                {onExportRealDesktop && (
                  <button
                    onClick={() => onExportRealDesktop(selectedItemObject)}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shadow-md cursor-pointer active:scale-95 transition-all"
                    title="Get 1-click terminal command or file download to put on your real Linux PC"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Real PC</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            All Items ({DESKTOP_CATALOG_ITEMS.length})
          </button>

          <button
            onClick={() => setSelectedCategory('app')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'app'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Rocket className="w-3 h-3 text-blue-400" />
            <span>Applications ({DESKTOP_CATALOG_ITEMS.filter((i) => i.category === 'app' || i.category === 'game').length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('document')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'document'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <FileText className="w-3 h-3 text-rose-400" />
            <span>Documents ({DESKTOP_CATALOG_ITEMS.filter((i) => i.category === 'document').length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('weblink')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'weblink'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>Web Links ({DESKTOP_CATALOG_ITEMS.filter((i) => i.category === 'weblink').length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('script')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'script'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span>Scripts & CLI ({DESKTOP_CATALOG_ITEMS.filter((i) => i.category === 'script').length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('system')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'system'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Folder className="w-3 h-3 text-amber-400" />
            <span>Folders & System ({DESKTOP_CATALOG_ITEMS.filter((i) => i.category === 'system').length})</span>
          </button>
        </div>
      </div>

      {/* Populated Search Results List / Interactive Catalog Drawer */}
      {isListExpanded && (
        <div className="p-4 sm:p-5 bg-zinc-950/80 border-t border-zinc-800/70 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span>
              Showing <strong>{filteredItems.length}</strong> matching item{filteredItems.length === 1 ? '' : 's'}:
            </span>
            <span className="text-[11px] text-zinc-500 hidden sm:inline">
              Click <strong>"+ Add to Desktop"</strong> to instantly generate the desktop shortcut icon
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs">
              No items matching "{searchQuery}". Try searching for 'code', 'firefox', 'pdf', 'script', or reset filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const isJustAdded = recentAddedId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all text-xs ${
                      isJustAdded
                        ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/40'
                        : 'bg-zinc-900/90 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <IconRenderer icon={item.icon} className="w-8 h-8 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate text-xs">{item.name}</div>
                        <div className="text-[10px] text-zinc-400 truncate">{item.comment}</div>
                        <div className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">
                          {item.exec}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {onExportRealDesktop && (
                        <button
                          onClick={() => onExportRealDesktop(item)}
                          className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition-colors cursor-pointer"
                          title="Get 1-click command or download for your real Linux PC"
                        >
                          <Laptop className="w-3 h-3 text-emerald-400" />
                          <span>Real PC</span>
                        </button>
                      )}

                      {onCustomizeItem && (
                        <button
                          onClick={() => onCustomizeItem(item)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="Customize name, icon or parameters before adding"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleAddItemToDesktop(item)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold text-[11px] transition-all cursor-pointer ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-zinc-950 border border-amber-500/40 hover:border-transparent'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3 h-3 text-white" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 stroke-[2.5]" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
