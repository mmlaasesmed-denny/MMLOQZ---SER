import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { 
  Menu, X, ChevronRight, Upload, MoveLeft, MoveRight, Sliders, RotateCcw, 
  Check, Image as ImageIcon, Plus, Trash2, ArrowUp, ArrowDown, Settings, Globe, Link as LinkIcon
} from 'lucide-react';
import { compressImage, safeSetItem } from '../../utils/imageCompressor';

export interface HeaderMenuItem {
  id: string;
  label: string;
  url: string; // e.g. #hero, #contact, /amager, or page-id
  pageId?: string;
  isExternal?: boolean;
}

interface NavbarProps {
  editable?: boolean;
  pages?: any[];
  activePageId?: string;
  onNavigatePage?: (pageId: string) => void;
}

const DEFAULT_MENU_ITEMS: HeaderMenuItem[] = [
  { id: 'menu-home', label: 'Home', url: '#hero' },
  { id: 'menu-contact', label: 'Contact us', url: '#contact' }
];

export default function Navbar({ editable = true, pages = [], activePageId, onNavigatePage }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoControls, setShowLogoControls] = useState(false);
  const [showMenuManager, setShowMenuManager] = useState(false);

  // Logo Settings state with localStorage persistence
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    return localStorage.getItem('mmloqz-custom-logo-src') || '/images/logo.png';
  });
  const [logoHeight, setLogoHeight] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-custom-logo-height');
    return saved ? parseInt(saved, 10) : 48;
  });
  const [logoOffsetX, setLogoOffsetX] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-custom-logo-offset-x');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Header Menu Items state with localStorage persistence
  const [menuItems, setMenuItems] = useState<HeaderMenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('mmloqz-header-menu-items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_MENU_ITEMS;
  });

  // Custom menu creation form state
  const [customLabel, setCustomLabel] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLocalUserEdit = useRef<boolean>(false);

  useEffect(() => {
    safeSetItem('mmloqz-custom-logo-src', logoSrc);
  }, [logoSrc]);

  useEffect(() => {
    safeSetItem('mmloqz-custom-logo-height', logoHeight.toString());
  }, [logoHeight]);

  useEffect(() => {
    safeSetItem('mmloqz-custom-logo-offset-x', logoOffsetX.toString());
  }, [logoOffsetX]);

  useEffect(() => {
    safeSetItem('mmloqz-header-menu-items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    const handleLogoSync = (e: any) => {
      if (e.detail) {
        if (e.detail.source === 'server-sync' && (isLocalUserEdit.current || localStorage.getItem('mmloqz-logo-has-user-edit') === 'true')) {
          return;
        }
        if (e.detail.logoSrc) setLogoSrc(e.detail.logoSrc);
        if (e.detail.logoHeight) setLogoHeight(Number(e.detail.logoHeight));
        if (e.detail.logoOffsetX !== undefined) setLogoOffsetX(Number(e.detail.logoOffsetX));
        if (e.detail.source === 'saved-to-server') {
          isLocalUserEdit.current = false;
          localStorage.removeItem('mmloqz-logo-has-user-edit');
        }
      }
    };
    window.addEventListener('mmloqz-logo-updated', handleLogoSync);
    return () => window.removeEventListener('mmloqz-logo-updated', handleLogoSync);
  }, []);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const rawSrc = event.target.result as string;
          const compressedSrc = await compressImage(rawSrc, 800, 0.85);
          isLocalUserEdit.current = true;
          safeSetItem('mmloqz-logo-has-user-edit', 'true');
          setLogoSrc(compressedSrc);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetLogo = () => {
    isLocalUserEdit.current = false;
    localStorage.removeItem('mmloqz-logo-has-user-edit');
    setLogoSrc('/images/logo.png');
    setLogoHeight(48);
    setLogoOffsetX(0);
    localStorage.removeItem('mmloqz-custom-logo-src');
    localStorage.removeItem('mmloqz-custom-logo-height');
    localStorage.removeItem('mmloqz-custom-logo-offset-x');
  };

  // Add a page to the header menu
  const handleAddPageToMenu = (page: any) => {
    if (!page) return;
    const pageName = page.name || page.title || 'Page';
    const cleanName = typeof pageName === 'string' ? pageName.replace(/^📄\s|^🛒\s|^🏠\s|^👥\s|^⚖️\s|^🥐\s|^☁️\s/, '') : 'Page';
    const pageSlug = page.slug || page.id || 'page';
    const newItem: HeaderMenuItem = {
      id: `menu-page-${page.id || Date.now()}`,
      label: cleanName,
      url: `/${pageSlug}`,
      pageId: page.id
    };

    if (menuItems.some(item => (page.id && item.pageId === page.id) || item.url === `/${pageSlug}`)) {
      alert(`"${cleanName}" is already in your header menu!`);
      return;
    }

    setMenuItems(prev => [...prev, newItem]);
  };

  // Add custom link item
  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLabel.trim() || !customUrl.trim()) {
      alert('Please enter both a menu label and a URL or section hash.');
      return;
    }
    const newItem: HeaderMenuItem = {
      id: `menu-custom-${Date.now()}`,
      label: customLabel.trim(),
      url: customUrl.trim()
    };
    setMenuItems(prev => [...prev, newItem]);
    setCustomLabel('');
    setCustomUrl('');
  };

  const handleRemoveMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveMenuItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= menuItems.length) return;
    const copy = [...menuItems];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setMenuItems(copy);
  };

  const handleItemClick = (item: HeaderMenuItem, e: React.MouseEvent) => {
    if (!item || typeof item.url !== 'string') return;

    if (item.pageId && onNavigatePage) {
      e.preventDefault();
      onNavigatePage(item.pageId);
      setMobileMenuOpen(false);
      return;
    }

    if (item.url.startsWith('/') && pages.length > 0) {
      const pageSlug = item.url.replace(/^\//, '');
      const matchPage = pages.find(p => p && (p.slug === pageSlug || p.id === pageSlug));
      if (matchPage && onNavigatePage) {
        e.preventDefault();
        onNavigatePage(matchPage.id);
        setMobileMenuOpen(false);
        return;
      }
    }

    if (item.url.startsWith('#')) {
      const targetEl = document.querySelector(item.url);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        
        {/* Logo Container with Left/Right Movement */}
        <div 
          className="relative flex items-center group/logo"
          style={{ transform: `translateX(${logoOffsetX}px)` }}
        >
          <a href="#" className="flex items-center gap-3">
            <img
              src={logoSrc}
              alt="Brand Logo"
              style={{ height: `${logoHeight}px`, width: 'auto' }}
              className="object-contain transition-all duration-150"
            />
          </a>

          {/* Floating Logo Customizer Badge */}
          {editable && (
            <button
              onClick={() => setShowLogoControls(!showLogoControls)}
              className="ml-3 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-md opacity-80 group-hover/logo:opacity-100 transition-all flex items-center gap-1.5 cursor-pointer border-none"
              title="Customize Logo Image, Size & Position"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize Logo</span>
            </button>
          )}

          {/* Interactive Logo Control Drawer Popover */}
          {editable && showLogoControls && (
            <div className="absolute top-14 left-0 z-50 w-80 bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                  <ImageIcon className="w-4 h-4" />
                  <span>Logo Customizer</span>
                </div>
                <button
                  onClick={() => setShowLogoControls(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer border-none bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Upload Logo */}
              <div className="space-y-2 mb-5">
                <label className="block text-xs font-semibold text-slate-300">
                  Upload Custom Logo:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm border-none"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File</span>
                  </button>
                </div>
              </div>

              {/* Resize Height Slider */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Resize Height:</span>
                  <span className="text-emerald-400 font-mono">{logoHeight}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={logoHeight}
                  onChange={(e) => setLogoHeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Move Left / Right Position Slider */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Move Left / Right:</span>
                  <span className="text-emerald-400 font-mono">
                    {logoOffsetX > 0 ? `+${logoOffsetX}px Right` : logoOffsetX < 0 ? `${logoOffsetX}px Left` : '0px Center'}
                  </span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="200"
                  value={logoOffsetX}
                  onChange={(e) => setLogoOffsetX(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Reset Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={resetLogo}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer border-none bg-transparent"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
                <button
                  onClick={() => setShowLogoControls(false)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer border-none"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <nav className="flex items-center gap-6 font-bold text-slate-900">
            {Array.isArray(menuItems) && menuItems.map((item, idx) => {
              if (!item) return null;
              const isPageActive = item.pageId ? item.pageId === activePageId : false;
              return (
                <a
                  key={item.id || idx}
                  href={item.url || '#'}
                  onClick={(e) => handleItemClick(item, e)}
                  className={`transition-colors text-sm font-semibold flex items-center gap-1 py-1 px-2.5 rounded-lg ${
                    isPageActive 
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60' 
                      : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label || 'Link'}</span>
                </a>
              );
            })}
          </nav>

          {/* WordPress-Style Header Menu Builder Trigger */}
          {editable && (
            <button
              onClick={() => setShowMenuManager(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border-none"
              title="WordPress Appearance -> Menus Style Header Navigation Manager"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-200" />
              <span>⚙️ Edit Header Menu ({Array.isArray(menuItems) ? menuItems.length : 0})</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors ml-auto border-none bg-transparent"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Animated Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl">
          {Array.isArray(menuItems) && menuItems.map((item, idx) => {
            if (!item) return null;
            const isPageActive = item.pageId ? item.pageId === activePageId : false;
            return (
              <a
                key={item.id || idx}
                href={item.url || '#'}
                onClick={(e) => handleItemClick(item, e)}
                className={`block text-base font-bold py-2 border-b border-slate-100 transition-colors ${
                  isPageActive ? 'text-emerald-700' : 'text-slate-900 hover:text-emerald-700'
                }`}
              >
                {item.label || 'Link'}
              </a>
            );
          })}

          {editable && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowMenuManager(true);
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border-none mt-2"
            >
              <Settings className="w-4 h-4" />
              <span>Edit Navigation Menu</span>
            </button>
          )}
        </div>
      )}

      {/* WordPress-Style Header Navigation Menu Builder Modal (Rendered via Portal over body) */}
      {showMenuManager && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto text-slate-800 dark:text-slate-100 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] my-auto border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 shrink-0">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> WordPress Appearance → Header Navigation Menu Builder
              </h3>
              <button
                onClick={() => setShowMenuManager(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer border-none"
                title="Close Menu Builder"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 text-slate-800 dark:text-slate-200">
              
              {/* LEFT COLUMN: Add Pages to Menu */}
              <div className="space-y-5 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>1. Add Created Pages to Menu</span>
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Click any page you created to add it directly into your top header navigation bar.
                </p>

                {/* List of Pages */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {pages.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No custom pages created yet. Use 'Tilføj Ny Side' to create pages!</p>
                  ) : (
                    pages.map(page => {
                      if (!page) return null;
                      const pageName = page.name || page.title || 'Page';
                      const cleanName = typeof pageName === 'string' ? pageName.replace(/^📄\s|^🛒\s|^🏠\s|^👥\s|^⚖️\s|^🥐\s|^☁️\s/, '') : 'Page';
                      const pageSlug = page.slug || page.id || '';
                      const isInMenu = menuItems.some(i => (page.id && i.pageId === page.id) || (pageSlug && i.url === `/${pageSlug}`));
                      return (
                        <div
                          key={page.id || Math.random()}
                          className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">{cleanName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">/{pageSlug}</p>
                          </div>
                          <button
                            onClick={() => handleAddPageToMenu(page)}
                            disabled={isInMenu}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all border-none flex items-center gap-1 ${
                              isInMenu 
                                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs active:scale-95'
                            }`}
                          >
                            {isInMenu ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>In Menu</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span>+ Add to Menu</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Custom URL Item Input */}
                <form onSubmit={handleAddCustomLink} className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Or Add Custom URL / Hash Link</span>
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="Menu Label (e.g. Services, Campaign)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="Link URL or Section (e.g. #contact, https://...)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer border-none"
                  >
                    + Add Custom Link
                  </button>
                </form>
              </div>

              {/* RIGHT COLUMN: Menu Structure & Reordering */}
              <div className="space-y-5 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>2. Header Menu Structure ({menuItems.length})</span>
                  <button
                    onClick={() => setMenuItems(DEFAULT_MENU_ITEMS)}
                    className="text-[10px] text-rose-500 hover:text-rose-600 font-bold border-none bg-transparent cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Re-order menu items or edit labels. Changes appear live on desktop & mobile navigation!
                </p>

                {/* Menu Items List */}
                <div className="space-y-2 flex-1 overflow-y-auto max-h-80 pr-1">
                  {menuItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs gap-3"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="font-mono text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                          #{index + 1}
                        </span>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const newLabel = e.target.value;
                            setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, label: newLabel } : i));
                          }}
                          className="font-bold text-slate-800 dark:text-slate-100 bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 rounded px-1 py-0.5 text-xs outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleMoveMenuItem(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 disabled:opacity-30 border-none bg-transparent cursor-pointer"
                          title="Move Left/Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveMenuItem(index, 'down')}
                          disabled={index === menuItems.length - 1}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 disabled:opacity-30 border-none bg-transparent cursor-pointer"
                          title="Move Right/Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveMenuItem(item.id)}
                          className="p-1 hover:bg-rose-100 text-rose-500 rounded border-none bg-transparent cursor-pointer"
                          title="Remove from Menu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setShowMenuManager(false)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer border-none shadow-md"
                  >
                    Save & Close Menu Builder
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
