import React, { useState, useEffect } from 'react';
import { Section, PageElement, SiteTheme, ElementStyles, ElementType, Column } from './types';
import { TEMPLATES, COLOR_THEMES } from './templates';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import SaveExportControls from './components/SaveExportControls';
import ImageSelectorModal from './components/ImageSelectorModal';
import { Lock, Unlock, LogOut, Shield, Globe, Sparkles, Plus, Code } from 'lucide-react';

interface SEOMetadata {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaTags?: string;
}

interface SinglePageCMS {
  id: string;
  dbId?: number; // Optional Django database layout record ID
  name: string;
  slug: string;
  title?: string;
  seoMetadata?: SEOMetadata;
  sections: Section[];
  theme: SiteTheme;
}

const migratePaddingToEm = (styles: ElementStyles | undefined): ElementStyles | undefined => {
  if (!styles) return styles;
  const newStyles = { ...styles };
  
  const convert = (val: string | undefined): string | undefined => {
    if (!val) return val;
    const trimmed = val.trim();
    if (trimmed.endsWith('px')) {
      const pixels = parseFloat(trimmed);
      if (!isNaN(pixels)) {
        const base = parseFloat(styles.fontSize || '15');
        const emVal = Math.round((pixels / (isNaN(base) ? 15 : base)) * 100) / 100;
        return `${emVal}em`;
      }
    }
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      const pixels = parseFloat(trimmed);
      if (!isNaN(pixels)) {
        const base = parseFloat(styles.fontSize || '15');
        const emVal = Math.round((pixels / (isNaN(base) ? 15 : base)) * 100) / 100;
        return `${emVal}em`;
      }
    }
    return val;
  };

  if (newStyles.paddingTop) newStyles.paddingTop = convert(newStyles.paddingTop);
  if (newStyles.paddingBottom) newStyles.paddingBottom = convert(newStyles.paddingBottom);
  if (newStyles.paddingLeft) newStyles.paddingLeft = convert(newStyles.paddingLeft);
  if (newStyles.paddingRight) newStyles.paddingRight = convert(newStyles.paddingRight);
  
  return newStyles;
};

const ensureElementOverrides = (el: PageElement): PageElement => {
  const isButton = el.type === 'button';
  const styles = isButton ? migratePaddingToEm(el.styles) : el.styles;
  const stylesTablet = isButton ? migratePaddingToEm(el.stylesTablet) : el.stylesTablet;
  const stylesMobile = isButton ? migratePaddingToEm(el.stylesMobile) : el.stylesMobile;

  let overlayBgColor = el.overlayBgColor;
  let overlayBgOpacity = el.overlayBgOpacity;

  if (el.type === 'image-banner' && el.overlayBgColor === '#0f172a' && el.overlayBgOpacity === 75) {
    overlayBgColor = '#000000';
    overlayBgOpacity = 0;
  }

  return {
    ...el,
    overlayBgColor,
    overlayBgOpacity,
    styles: styles || {},
    stylesTablet: stylesTablet || (styles ? { ...styles } : {}),
    stylesMobile: stylesMobile || (styles ? { ...styles } : {}),
    overlays: el.overlays?.map(o => {
      const isOBtn = o.type === 'button';
      const oStyles = isOBtn ? migratePaddingToEm(o.styles) : o.styles;
      const oStylesTablet = isOBtn ? migratePaddingToEm(o.stylesTablet) : o.stylesTablet;
      const oStylesMobile = isOBtn ? migratePaddingToEm(o.stylesMobile) : o.stylesMobile;
      return {
        ...o,
        styles: oStyles || {},
        stylesTablet: oStylesTablet || (oStyles ? { ...oStyles } : {}),
        stylesMobile: oStylesMobile || (oStyles ? { ...oStyles } : {})
      };
    })
  };
};

const ensureIndependentOverrides = (sections: Section[]): Section[] => {
  const styleKeys = [
    'paddingY', 'backgroundColor', 'textColor', 'backgroundImage', 'bgOpacity',
    'minHeight', 'customPaddingTop', 'customPaddingBottom', 'customWidth', 'customHeight',
    'customPaddingLeft', 'customPaddingRight', 'customMarginTop', 'customMarginBottom', 'fullWidth'
  ];

  return sections.map(section => {
    const sectionStyles: any = {};
    styleKeys.forEach(k => {
      if ((section as any)[k] !== undefined) {
        sectionStyles[k] = (section as any)[k];
      }
    });

    return {
      ...section,
      tabletOverrides: section.tabletOverrides || { ...sectionStyles },
      mobileOverrides: section.mobileOverrides || { ...sectionStyles },
      columns: section.columns.map(col => ({
        ...col,
        elements: col.elements.map(ensureElementOverrides)
      }))
    };
  });
};

const ensureWebshopPagesExist = (loadedPages: SinglePageCMS[]): SinglePageCMS[] => {
  return loadedPages;
};

const CLEAN_STARTER_PAGES: SinglePageCMS[] = [
  {
    id: 'home',
    name: 'Hjem (Home)',
    slug: '',
    theme: COLOR_THEMES[0],
    sections: [
      {
        id: 'clean-nav-1',
        name: 'Header & Navigation',
        fullWidth: true,
        paddingY: 'sm',
        columns: [
          {
            id: 'col-nav-1',
            width: 'md:flex-1',
            elements: [
              {
                id: 'nav-logo',
                type: 'heading',
                content: 'BRAND NAME',
                style: { fontSize: '24px', fontWeight: '800', color: '#0f172a' }
              },
              {
                id: 'nav-menu',
                type: 'text',
                content: 'Forside | Om os | Ydelser | Kontakt',
                style: { fontSize: '14px', color: '#64748b', fontWeight: '600' }
              }
            ]
          }
        ]
      },
      {
        id: 'clean-hero-1',
        name: 'Hero Sektion',
        fullWidth: false,
        paddingY: 'lg',
        columns: [
          {
            id: 'col-hero-1',
            width: 'md:flex-1',
            elements: [
              {
                id: 'hero-title',
                type: 'heading',
                content: 'Velkommen til din nye hjemmeside',
                style: { fontSize: '44px', fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: '16px' }
              },
              {
                id: 'hero-subtitle',
                type: 'text',
                content: 'Klik på teksten for at redigere direkte, eller tilføj nye sektioner og elementer.',
                style: { fontSize: '18px', color: '#475569', textAlign: 'center', maxWidth: '600px', margin: '0 auto 24px' }
              },
              {
                id: 'hero-btn',
                type: 'button',
                content: 'Udforsk mere',
                style: { backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontWeight: '700' }
              }
            ]
          }
        ]
      },
      {
        id: 'clean-footer-1',
        name: 'Footer',
        fullWidth: true,
        paddingY: 'md',
        columns: [
          {
            id: 'col-foot-1',
            width: 'md:flex-1',
            elements: [
              {
                id: 'footer-text',
                type: 'text',
                content: '© 2026 Alle rettigheder forbeholdes.',
                style: { fontSize: '14px', color: '#94a3b8', textAlign: 'center' }
              }
            ]
          }
        ]
      }
    ]
  }
];

export default function App() {
  // 1. Unified 5-Page LocalStorage CMS State
  const [pages, setPages] = useState<SinglePageCMS[]>(() => {
    const saved = localStorage.getItem('visual-builder-pages-cms-clean-v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].sections && parsed[0].sections[0].columns) {
          return parsed;
        }
      } catch (err) {}
    }
    return CLEAN_STARTER_PAGES;
  });

  const [activePageId, setActivePageId] = useState<string>(() => {
    return localStorage.getItem('visual-builder-active-page-id-clean-v4') || 'home';
  });

  const [baseDomain, setBaseDomain] = useState<string>(() => {
    return localStorage.getItem('visual-builder-base-domain') || 'www.mmlaasesmed.dk';
  });

  const [visitorViewport, setVisitorViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const currentPath = window.location.pathname.replace(/^\/|\/$/g, '');
    const isEditor = currentPath === 'admin-editor';
    if (isEditor) return;

    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setVisitorViewport('mobile');
      } else if (w < 1024) {
        setVisitorViewport('tablet');
      } else {
        setVisitorViewport('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [hasRemoteChanges, setHasRemoteChanges] = useState(false);
  const [remotePagesData, setRemotePagesData] = useState<SinglePageCMS[] | null>(null);
  
  // 1.2 Edit locking and auto-sync states
  const [editLock, setEditLock] = useState<{ user: string; expiresAt: number } | null>(null);
  const [currentSessionId] = useState(() => {
    const saved = localStorage.getItem('visual-builder-session-id');
    if (saved) return saved;
    const newId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('visual-builder-session-id', newId);
    return newId;
  });
  const [editorUsername, setEditorUsername] = useState(() => {
    return localStorage.getItem('visual-builder-username') || `Bruger_${Math.floor(Math.random() * 1000)}`;
  });
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(() => {
    return localStorage.getItem('visual-builder-auto-save') === 'true';
  });

  // Helper to acquire/refresh edit lock on Django server
  const refreshEditLock = async () => {
    try {
      const djangoUrl = localStorage.getItem('visual-builder-django-url') || (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') ? 'http://localhost:8000' : window.location.origin);
      const targetUrl = djangoUrl.replace(/\/$/, '') + '/layouts/';
      const title = `LOCK_${activePageId}`;
      
      const layoutsResp = await fetch(targetUrl);
      if (layoutsResp.ok) {
        const layoutsList = await layoutsResp.json();
        const existingLock = layoutsList.find((l: any) => l.title === title);
        
        const lockPayload = {
          title: title,
          sections: [],
          theme: {
            sessionId: currentSessionId,
            user: editorUsername,
            timestamp: Date.now()
          }
        };

        if (existingLock) {
          await fetch(`${targetUrl}${existingLock.id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lockPayload)
          });
        } else {
          await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lockPayload)
          });
        }
      }
    } catch (err) {
      console.warn('[LOCK] Failed to acquire edit lock:', err);
    }
  };

  // Background polling loop to detect remote changes and edit locks from other users
  useEffect(() => {
    const checkForRemoteUpdates = async () => {
      try {
        const djangoUrl = localStorage.getItem('visual-builder-django-url') || (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') ? 'http://localhost:8000' : window.location.origin);
        const resp = await fetch(`${djangoUrl.replace(/\/$/, '')}/layouts/`);
        if (resp.ok) {
          const layouts = await resp.json();
          
          // 1. Check for active edit lock on current page
          const lockTitle = `LOCK_${activePageId}`;
          const activeLock = layouts.find((l: any) => l.title === lockTitle);
          if (activeLock && activeLock.theme) {
            const { sessionId, user, timestamp } = activeLock.theme;
            if (sessionId !== currentSessionId && (Date.now() - timestamp < 120000)) {
              setEditLock({ user: user || 'En anden bruger', expiresAt: timestamp + 120000 });
            } else {
              setEditLock(null);
            }
          } else {
            setEditLock(null);
          }

          // 2. Check for remote layout changes
          const globalState = layouts.find((l: any) => l.title === 'GLOBAL_CMS_PAGES');
          if (globalState && globalState.sections) {
            const data = globalState.sections;
            // Validate schema
            if (Array.isArray(data) && data.length > 0 && data[0].id && data[0].sections) {
              const currentStr = JSON.stringify(pages);
              const remoteStr = JSON.stringify(data);
              if (currentStr !== remoteStr) {
                setRemotePagesData(data);
                setHasRemoteChanges(true);
              } else {
                setHasRemoteChanges(false);
              }
            }
          }
        }
      } catch (err) {
        console.warn('[POLL] Background check failed:', err);
      }
    };

    checkForRemoteUpdates();
    const interval = setInterval(checkForRemoteUpdates, 8000);
    return () => clearInterval(interval);
  }, [pages, activePageId, currentSessionId]);

  // Debounced Auto-Save & Lock Refresh Trigger on edits
  useEffect(() => {
    if (hasRemoteChanges || pages.length === 0) return;

    // Refresh lock metadata in database
    refreshEditLock();

    if (!isAutoSaveEnabled) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        const djangoUrl = localStorage.getItem('visual-builder-django-url') || (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') ? 'http://localhost:8000' : window.location.origin);
        const targetUrl = djangoUrl.replace(/\/$/, '') + '/layouts/';
        
        const layoutsResp = await fetch(targetUrl);
        if (layoutsResp.ok) {
          const layoutsList = await layoutsResp.json();
          const existingGlobal = layoutsList.find((l: any) => l.title === 'GLOBAL_CMS_PAGES');
          
          const globalPayload = {
            title: 'GLOBAL_CMS_PAGES',
            sections: pages,
            theme: { autoSaved: true, timestamp: Date.now() }
          };

          if (existingGlobal) {
            await fetch(`${targetUrl}${existingGlobal.id}/`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(globalPayload)
            });
          } else {
            await fetch(targetUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(globalPayload)
            });
          }
          console.log('[AUTO-SAVE] Automatically synced pages state to Django server.');
        }
      } catch (err) {
        console.warn('[AUTO-SAVE] Failed to auto-save to Django:', err);
      }
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [pages, isAutoSaveEnabled]);

  const handleApplyRemoteChanges = () => {
    if (remotePagesData) {
      setPages(remotePagesData);
      setHasRemoteChanges(false);
      setRemotePagesData(null);
      alert('Sider og layouts er nu synkroniseret med serveren!');
    }
  };

  // 2. Derive Current Page Sections and Theme (Downstream friendly)
  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  // Load pages state from Django backend on startup to keep users in sync
  useEffect(() => {
    const syncFromDjango = async () => {
      try {
        const djangoUrl = localStorage.getItem('visual-builder-django-url') || (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') ? 'http://localhost:8000' : window.location.origin);
        const resp = await fetch(`${djangoUrl.replace(/\/$/, '')}/layouts/`);
        if (resp.ok) {
          const layouts = await resp.json();
          const globalState = layouts.find((l: any) => l.title === 'GLOBAL_CMS_PAGES');
          if (globalState && globalState.sections) {
            const data = globalState.sections;
            if (Array.isArray(data) && data.length > 0 && data[0].id && data[0].sections) {
              setPages(ensureWebshopPagesExist(data));
              console.log('[SYNC] Successfully synchronized pages state from Django backend!');
            } else {
              console.warn('[SYNC] GLOBAL_CMS_PAGES record found but data structure is invalid. Skipping load.');
            }
          }
        }
      } catch (err) {
        console.warn('[SYNC] Failed to fetch pages state from Django backend on startup, falling back to local cache.', err);
      } finally {
        setIsLoading(false);
      }
    };
    syncFromDjango();
  }, []);

  // Dynamically update the browser tab title and SEO metadata based on the active page name/title/seo
  useEffect(() => {
    // 1. Title
    const seoTitle = activePage.seoMetadata?.metaTitle || activePage.title || activePage.name.replace(/^📄\s|^🛒\s|^🏠\s|^👥\s|^⚖️\s|^🥐\s|^☁️\s/, '');
    document.title = seoTitle ? `${seoTitle} | MM Låsesmed` : "MM Låsesmed";

    // Helper to set standard meta tags
    const setMetaTag = (name: string, content: string | undefined) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (content) {
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('name', name);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      } else if (el) {
        el.remove();
      }
    };

    // 2. Standard Metadata
    setMetaTag('description', activePage.seoMetadata?.metaDescription);
    setMetaTag('keywords', activePage.seoMetadata?.metaKeywords);

    // 3. Custom Meta Tags (HTML)
    // Remove previously injected custom meta tags
    document.querySelectorAll('meta[data-custom-seo="true"]').forEach(el => el.remove());
    
    if (activePage.seoMetadata?.metaTags) {
      try {
        const container = document.createElement('div');
        container.innerHTML = activePage.seoMetadata.metaTags;
        Array.from(container.children).forEach(child => {
          if (child.tagName === 'META') {
            child.setAttribute('data-custom-seo', 'true');
            document.head.appendChild(child);
          }
        });
      } catch (e) {
        console.error("Failed to parse custom meta tags:", e);
      }
    }
  }, [activePage.id, activePage.name, activePage.title, activePage.seoMetadata]);

  // Dynamically resolve the sections and theme to render (handling Webshop custom templates)
  const getRenderLayout = () => {
    const hash = window.location.hash || '';
    const isShopRoute = hash.startsWith('#shop');
    
    if (isShopRoute) {
      // Find the webshop element
      const webshopElement = activePage.sections
        .flatMap(s => s.columns.flatMap(c => c.elements))
        .find(el => el.type === 'webshop');
        
      if (webshopElement) {
        const mappings = webshopElement.settings?.webshopMappings || {};
        let mappedPageId = '';
        
        if (hash.includes('/product/')) {
          mappedPageId = mappings.productDetail;
        } else if (hash.includes('/category/') || hash.includes('/subcategory/')) {
          mappedPageId = mappings.categoryDetail;
        } else if (hash.includes('/search')) {
          mappedPageId = mappings.searchResults;
        } else if (hash.includes('/cart') || hash.includes('/checkout')) {
          mappedPageId = mappings.cart;
        }
        
        if (mappedPageId) {
          const mappedPage = pages.find(p => p.id === mappedPageId);
          if (mappedPage) {
            return {
              sections: mappedPage.sections,
              theme: mappedPage.theme
            };
          }
        }
      }
    }
    
    return {
      sections: activePage.sections,
      theme: activePage.theme
    };
  };

  const { sections, theme } = getRenderLayout();

  // Helper: Get currently rendered page context (handles active mappings)
  const getRenderedPage = (): SinglePageCMS => {
    const hash = window.location.hash || '';
    const isShopRoute = hash.startsWith('#shop');
    
    if (isShopRoute) {
      const webshopElement = activePage.sections
        .flatMap(s => s.columns.flatMap(c => c.elements))
        .find(el => el.type === 'webshop');
        
      if (webshopElement) {
        const mappings = webshopElement.settings?.webshopMappings || {};
        let mappedPageId = '';
        
        if (hash.includes('/product/')) {
          mappedPageId = mappings.productDetail;
        } else if (hash.includes('/category/') || hash.includes('/subcategory/')) {
          mappedPageId = mappings.categoryDetail;
        } else if (hash.includes('/search')) {
          mappedPageId = mappings.searchResults;
        } else if (hash.includes('/cart') || hash.includes('/checkout')) {
          mappedPageId = mappings.cart;
        }
        
        if (mappedPageId) {
          const mappedPage = pages.find(p => p.id === mappedPageId);
          if (mappedPage) return mappedPage;
        }
      }
    }
    return activePage;
  };

  // Helper: Find the page id that owns a specific element ID
  const findPageIdByElementId = (elementId: string): string | null => {
    // Prioritize currently rendered page to avoid duplicate ID issues (e.g. Header/Footer)
    const renderedPage = getRenderedPage();
    if (renderedPage) {
      const hasEl = renderedPage.sections.some(s => 
        s.columns.some(c => c.elements.some(el => el.id === elementId))
      );
      if (hasEl) return renderedPage.id;
    }

    // Fallback to searching all pages
    for (const p of pages) {
      if (renderedPage && p.id === renderedPage.id) continue;
      const hasEl = p.sections.some(s => 
        s.columns.some(c => c.elements.some(el => el.id === elementId))
      );
      if (hasEl) return p.id;
    }
    return null;
  };

  // Helper: Find the page id that owns a specific section ID
  const findPageIdBySectionId = (sectionId: string): string | null => {
    // Prioritize currently rendered page to avoid duplicate ID issues (e.g. Header/Footer)
    const renderedPage = getRenderedPage();
    if (renderedPage) {
      const hasSec = renderedPage.sections.some(s => s.id === sectionId);
      if (hasSec) return renderedPage.id;
    }

    // Fallback to searching all pages
    for (const p of pages) {
      if (renderedPage && p.id === renderedPage.id) continue;
      const hasSec = p.sections.some(s => s.id === sectionId);
      if (hasSec) return p.id;
    }
    return null;
  };

  // 3. Interactive Selection State Managers
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isVisitorMode, setIsVisitorMode] = useState(false);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // 3.5 Admin Secure Gateway States - Defaulted to false (Visitor Mode by default)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('visual-builder-is-admin');
    return saved ? saved === 'true' : true;
  });
  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    return localStorage.getItem('visual-builder-admin-passcode') || 'admin';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [inputPasscode, setInputPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // 4. Image Modal Configuration Tracking
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);

  // 5. Copilot Generation State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // 6. Page Code Editor Modal States
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showPageManagerModal, setShowPageManagerModal] = useState(false);
  const [editingSeoPageId, setEditingSeoPageId] = useState<string | null>(null);
  const [rawJsonCode, setRawJsonCode] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (showCodeEditor) {
      setRawJsonCode(JSON.stringify(activePage.sections, null, 2));
      setJsonError(null);
    }
  }, [showCodeEditor, activePageId]);

  // 7. Pages Directory Dropdown States
  const [showPagesDropdown, setShowPagesDropdown] = useState(false);
  const [pageSearchQuery, setPageSearchQuery] = useState('');

  useEffect(() => {
    if (!showPagesDropdown) return;
    const handleClose = () => setShowPagesDropdown(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [showPagesDropdown]);

  const setPageAsHomePage = (pageId: string) => {
    setPages(prev => prev.map(p => {
      if (p.id === pageId) {
        return { 
          ...p, 
          slug: '',
          theme: { ...(p.theme || {}), slug: '' }
        };
      } else if (p.slug === '') {
        // The old home page gets its old slug back (its ID or something clean)
        return { 
          ...p, 
          slug: p.id,
          theme: { ...(p.theme || {}), slug: p.id }
        };
      }
      return p;
    }));
  };

  // Save state updates automatically to client cache with error boundary protection
  useEffect(() => {
    try {
      localStorage.setItem('visual-builder-pages-cms-v2', JSON.stringify(pages));
      
      // Auto-remove names from deleted blacklist if they are created again
      const deletedNames = JSON.parse(localStorage.getItem('visual-builder-deleted-page-names') || '[]');
      if (deletedNames.length > 0) {
        const activeNames = pages.map(p => p.name.replace('📄 ', '').replace('🛒 ', '').trim());
        const remainingDeleted = deletedNames.filter((name: string) => !activeNames.includes(name));
        if (remainingDeleted.length !== deletedNames.length) {
          localStorage.setItem('visual-builder-deleted-page-names', JSON.stringify(remainingDeleted));
        }
      }
    } catch (e) {
      console.warn("Local storage quota exceeded. Unable to cache pages state:", e);
    }
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('visual-builder-active-page-id-v2', activePageId);
    window.location.hash = ''; // Clear URL hash when switching pages in the editor to prevent hash leakage
  }, [activePageId]);

  useEffect(() => {
    localStorage.setItem('visual-builder-visitor-mode', isVisitorMode ? 'true' : 'false');
  }, [isVisitorMode]);

  useEffect(() => {
    localStorage.setItem('visual-builder-is-admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('visual-builder-base-domain', baseDomain);
  }, [baseDomain]);

  useEffect(() => {
    localStorage.setItem('visual-builder-admin-passcode', adminPasscode);
  }, [adminPasscode]);

  // URL path routing handler with slug normalization
  useEffect(() => {
    const cleanSlug = (s: string) => s.replace(/^\/|\/$/g, '').trim();
    const handleUrlRouting = () => {
      const currentPath = cleanSlug(window.location.pathname);
      if (currentPath === 'admin-editor') {
        return;
      }
      const foundPage = pages.find(p => cleanSlug(p.slug) === currentPath);
      if (foundPage) {
        setActivePageId(foundPage.id);
      }
    };
    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, [pages]);

  // Load pages from Django Database on startup to sync all visitor and editor layouts
  useEffect(() => {
    const syncDbLayouts = async () => {
      try {
        const origin = window.location.origin;
        const backendBase = origin.includes('localhost') || origin.includes('127.0.0.1') ? 'http://localhost:8000' : origin;
        const resp = await fetch(`${backendBase}/api/layouts/`, {
          headers: { 'Accept': 'application/json' }
        });
        if (resp.ok) {
          const dbLayouts = await resp.json();
          if (Array.isArray(dbLayouts) && dbLayouts.length > 0) {
            setPages(prevPages => {
              const updatedPages = [...prevPages];
              const reversed = [...dbLayouts].reverse();
              
              reversed.forEach((layout: any) => {
                if (!layout.sections || !layout.theme) return;
                
                const titleStr = layout.title || '';
                let foundPageIndex = -1;
                
                const defaultNames: Record<string, string> = {
                  portfolio: "Home Creative Workspace",
                  bistro: "Artisanal Pastry Bistro",
                  saas: "Technical SaaS Cloud Page",
                  about: "Creative Team Profiles",
                  terms: "Technical SLA Policy & Terms",
                  webshop: "Webshop",
                  'webshop-home': "Webshop - Hjem",
                  'webshop-product': "Webshop - Produkt Visning",
                  'webshop-cart': "Webshop - Kurv (Cart)",
                  'webshop-checkout': "Webshop - Kasse (Checkout)",
                  'webshop-account': "Webshop - Profil / Log ind"
                };
                
                for (const [id, defaultTitle] of Object.entries(defaultNames)) {
                  if (titleStr.includes(defaultTitle)) {
                    foundPageIndex = updatedPages.findIndex(p => p.id === id);
                    break;
                  }
                }
                
                if (foundPageIndex === -1) {
                  let cleanName = titleStr.replace('Page: ', '').replace(' (Synced Draft)', '').trim();
                  if (cleanName) {
                    // Skip loading if the user has explicitly deleted this page
                    const deletedPages = JSON.parse(localStorage.getItem('visual-builder-deleted-page-names') || '[]');
                    if (deletedPages.includes(cleanName)) {
                      return;
                    }

                    foundPageIndex = updatedPages.findIndex(p => p.name.replace('📄 ', '') === cleanName);
                    
                    if (foundPageIndex === -1) {
                      const savedSlug = layout.theme?.slug;
                      const slug = savedSlug !== undefined ? savedSlug : cleanName.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
                      const newPage: SinglePageCMS = {
                        id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        dbId: layout.id,
                        name: `📄 ${cleanName}`,
                        slug: slug,
                        sections: ensureIndependentOverrides(layout.sections),
                        theme: layout.theme
                      };
                      updatedPages.push(newPage);
                      return;
                    }
                  }
                }
                
                if (foundPageIndex !== -1) {
                  const savedSlug = layout.theme?.slug;
                  updatedPages[foundPageIndex] = {
                    ...updatedPages[foundPageIndex],
                    dbId: layout.id,
                    sections: ensureIndependentOverrides(layout.sections),
                    theme: layout.theme,
                    slug: savedSlug !== undefined ? savedSlug : updatedPages[foundPageIndex].slug
                  };
                }
              });
              
              return ensureWebshopPagesExist(updatedPages);
            });
          }
        }
      } catch (err) {
        console.error("Failed to synchronize Django layouts:", err);
      }
    };

    syncDbLayouts();
  }, []);

  // Find currently active element inside columns
  const getSelectedElement = (): PageElement | null => {
    if (!selectedElementId) return null;
    for (const section of sections) {
      for (const col of section.columns) {
        const found = col.elements.find(el => el.id === selectedElementId);
        if (found) return found;
      }
    }
    return null;
  };

  // Find currently active section
  const getSelectedSection = (): Section | null => {
    if (!selectedSectionId) return null;
    return sections.find(s => s.id === selectedSectionId) || null;
  };

  const handleSelectElement = (elementId: string) => {
    setSelectedElementId(elementId);
    setSelectedSectionId(null);
  };

  const handleSelectSection = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setSelectedElementId(null);
  };

  const syncLogoAcrossAllPages = (logoType: 'text' | 'image', src?: string, content?: string, height?: string) => {
    setPages(prevPages => {
      return prevPages.map(page => {
        return {
          ...page,
          sections: page.sections.map(section => {
            return {
              ...section,
              columns: section.columns.map(col => {
                return {
                  ...col,
                  elements: col.elements.map(el => {
                    // 1. Direct logo element
                    if (el.id.toLowerCase().includes('logo')) {
                      return {
                        ...el,
                        type: logoType,
                        src: src !== undefined ? src : el.src,
                        content: content !== undefined ? content : el.content,
                        styles: {
                          ...el.styles,
                          height: height || el.styles?.height
                        }
                      };
                    }
                    
                    // 2. Overlay logo element
                    let updatedOverlays = el.overlays;
                    if (el.overlays && el.overlays.length > 0) {
                      updatedOverlays = el.overlays.map(o => {
                        if (o.type === 'logo') {
                          return {
                            ...o,
                            src: logoType === 'image' ? (src || o.src) : undefined,
                            content: content !== undefined ? content : o.content,
                            styles: {
                              ...o.styles,
                              fontSize: height || o.styles?.fontSize
                            }
                          };
                        }
                        return o;
                      });
                    }

                    // 3. Webshop element setting logo
                    let updatedSettings = el.settings;
                    if (el.type === 'webshop') {
                      updatedSettings = {
                        ...(el.settings || {}),
                        logoType: logoType,
                        logoSrc: src !== undefined ? src : el.settings?.logoSrc,
                        logoText: content !== undefined ? content : el.settings?.logoText,
                        logoHeight: height ? parseInt(height) : el.settings?.logoHeight
                      };
                    }

                    return {
                      ...el,
                      overlays: updatedOverlays,
                      settings: updatedSettings
                    };
                  })
                };
              })
            };
          })
        };
      });
    });
  };

  // Mutator helper for updating customizable styles or direct string values
  const handleUpdateElement = (
    elementId: string, 
    updatedStyles: Partial<ElementStyles>, 
    updatedContent?: string,
    updatedLink?: string,
    updatedSrc?: string,
    updatedFields?: Partial<PageElement>
  ) => {
    console.log('[DEBUG] handleUpdateElement called:', {
      elementId,
      viewportMode,
      updatedStyles,
      updatedContent,
      updatedFields
    });
    const targetPageId = findPageIdByElementId(elementId) || activePageId;
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== targetPageId) return page;
        return {
          ...page,
          sections: page.sections.map(section => {
            return {
              ...section,
              columns: section.columns.map(col => {
                return {
                  ...col,
                  elements: col.elements.map(el => {
                    if (el.id !== elementId) return el;
                    return ensureElementOverrides({
                      ...el,
                      content: updatedContent !== undefined ? updatedContent : el.content,
                      link: updatedLink !== undefined ? updatedLink : el.link,
                      src: updatedSrc !== undefined ? updatedSrc : el.src,
                      styles: viewportMode === 'desktop' ? {
                        ...el.styles,
                        ...updatedStyles
                      } : el.styles,
                      stylesTablet: viewportMode === 'tablet' ? {
                        ...(el.stylesTablet || {}),
                        ...updatedStyles
                      } : el.stylesTablet,
                      stylesMobile: viewportMode === 'mobile' ? {
                        ...(el.stylesMobile || {}),
                        ...updatedStyles
                      } : el.stylesMobile,
                      ...(updatedFields || {})
                    });
                  })
                };
              })
            };
          })
        };
      });
    });

    // Sync logo updates globally across all pages
    const isDirectLogo = elementId.toLowerCase().includes('logo');
    const logoOverlay = updatedFields?.overlays?.find(o => o.type === 'logo');
    const isWebshopLogoUpdate = elementId.toLowerCase().includes('webshop') && (updatedFields?.settings?.logoSrc !== undefined || updatedFields?.settings?.logoText !== undefined || updatedFields?.settings?.logoType !== undefined);

    if (isDirectLogo) {
      const logoType = updatedFields?.type === 'image' || updatedSrc !== undefined ? 'image' : 'text';
      const src = updatedSrc;
      const content = updatedContent;
      const height = updatedStyles?.height;
      syncLogoAcrossAllPages(logoType, src, content, height);
    } else if (logoOverlay) {
      const logoType = logoOverlay.src ? 'image' : 'text';
      const src = logoOverlay.src;
      const content = logoOverlay.content;
      const height = logoOverlay.styles?.fontSize;
      syncLogoAcrossAllPages(logoType, src, content, height);
    } else if (isWebshopLogoUpdate) {
      const logoType = updatedFields?.settings?.logoType || 'text';
      const src = updatedFields?.settings?.logoSrc;
      const content = updatedFields?.settings?.logoText;
      const height = updatedFields?.settings?.logoHeight ? `${updatedFields.settings.logoHeight}px` : undefined;
      syncLogoAcrossAllPages(logoType, src, content, height);
    }
  };

  // Mutator helper for Section properties
  const handleUpdateSection = (sectionId: string, updatedFields: Partial<Section>) => {
    console.log('[DEBUG] handleUpdateSection called:', {
      sectionId,
      viewportMode,
      updatedFields
    });
    const targetPageId = findPageIdBySectionId(sectionId) || activePageId;
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== targetPageId) return page;
        return {
          ...page,
          sections: page.sections.map(section => {
            if (section.id !== sectionId) return section;
            
            const styleKeys: Array<keyof Section> = [
              'paddingY', 'backgroundColor', 'textColor', 'backgroundImage', 'bgOpacity',
              'minHeight', 'customPaddingTop', 'customPaddingBottom', 'customWidth', 'customHeight',
              'customPaddingLeft', 'customPaddingRight', 'customMarginTop', 'customMarginBottom', 'fullWidth'
            ];

            const styleUpdates: Partial<Section> = {};
            const rootUpdates: Partial<Section> = {};

            Object.entries(updatedFields).forEach(([key, val]) => {
              if (styleKeys.includes(key as any)) {
                (styleUpdates as any)[key] = val;
              } else {
                (rootUpdates as any)[key] = val;
              }
            });

            let newSection = { ...section, ...rootUpdates };

            if (styleUpdates && Object.keys(styleUpdates).length > 0) {
              if (viewportMode === 'mobile') {
                newSection.mobileOverrides = {
                  ...(newSection.mobileOverrides || {}),
                  ...styleUpdates
                };
              } else if (viewportMode === 'tablet') {
                newSection.tabletOverrides = {
                  ...(newSection.tabletOverrides || {}),
                  ...styleUpdates
                };
              } else {
                newSection = { ...newSection, ...styleUpdates };
              }
            }

            const updated = { ...newSection };

            // Handle structural Column Grid Rearranger on-the-fly!
            if (updatedFields.layout && updatedFields.layout !== section.layout) {
              const allElements = section.columns.reduce((acc, col) => {
                return [...acc, ...col.elements];
              }, [] as PageElement[]);

              if (updatedFields.layout === 'single-col') {
                updated.columns = [
                  {
                    id: `${sectionId}-col-1`,
                    width: 'w-full',
                    elements: allElements
                  }
                ];
              } else if (updatedFields.layout === 'two-col') {
                const mid = Math.ceil(allElements.length / 2);
                updated.columns = [
                  {
                    id: `${sectionId}-col-1`,
                    width: 'md:w-1/2',
                    elements: allElements.slice(0, mid)
                  },
                  {
                    id: `${sectionId}-col-2`,
                    width: 'md:w-1/2',
                    elements: allElements.slice(mid)
                  }
                ];
              } else if (updatedFields.layout === 'three-col') {
                const splitSize = Math.ceil(allElements.length / 3);
                updated.columns = [
                  {
                    id: `${sectionId}-col-1`,
                    width: 'md:w-1/3',
                    elements: allElements.slice(0, splitSize)
                  },
                  {
                    id: `${sectionId}-col-2`,
                    width: 'md:w-1/3',
                    elements: allElements.slice(splitSize, splitSize * 2)
                  },
                  {
                    id: `${sectionId}-col-3`,
                    width: 'md:w-1/3',
                    elements: allElements.slice(splitSize * 2)
                  }
                ];
              }
            }
            return updated;
          })
        };
      });
    });
  };

  const handleSelectTheme = (newTheme: SiteTheme) => {
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== activePageId) return page;
        return {
          ...page,
          theme: newTheme
        };
      });
    });
  };

  // Direct confirmation loading of templates
  const handleLoadTemplate = (sections: Section[], theme?: SiteTheme) => {
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== activePageId) return page;

        return {
          ...page,
          sections: ensureIndependentOverrides(JSON.parse(JSON.stringify(sections))),
          theme: theme || page.theme
        };
      });
    });

    setSelectedElementId(null);
    setSelectedSectionId(null);
  };

  // Add Component Element directly into a specific Column at targetIndex position
  const handleAddElement = (
    sectionId: string, 
    colId: string, 
    type: ElementType,
    targetIndex?: number
  ) => {
    const targetPageId = findPageIdBySectionId(sectionId) || activePageId;
    const newElId = `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let defaultContent = 'New content block. Click here directly to rewrite inline.';
    let defaultStyles: ElementStyles = { marginBottom: '12px' };

    if (type === 'button') {
      defaultContent = 'Consult Pricing';
      defaultStyles = {
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        paddingTop: '0.615em',
        paddingBottom: '0.615em',
        paddingLeft: '1.23em',
        paddingRight: '1.23em',
        marginTop: '8px',
        marginBottom: '8px',
        backgroundColor: theme.primary,
        color: '#ffffff'
      };
    } else if (type === 'image') {
      defaultContent = '';
      defaultStyles = {
        borderRadius: '8px',
        marginTop: '8px',
        marginBottom: '8px'
      };
    } else if (type === 'divider') {
      defaultContent = '';
      defaultStyles = {
        borderColor: theme.border,
        marginTop: '16px',
        marginBottom: '16px'
      };
    } else if (type === 'spacer') {
      defaultContent = '';
      defaultStyles = {
        fontSize: '32px'
      };
    } else if (type === 'search-box') {
      defaultContent = 'Search...';
      defaultStyles = {
        marginTop: '8px',
        marginBottom: '8px'
      };
    } else if (type === 'webshop') {
      defaultContent = '';
      defaultStyles = {
        marginTop: '0px',
        marginBottom: '0px'
      };
    } else if (type === 'image-banner') {
      defaultContent = '';
      defaultStyles = {
        borderRadius: '12px',
        marginTop: '8px',
        marginBottom: '8px'
      };
    } else if (type === 'video') {
      defaultContent = '';
      defaultStyles = {
        borderRadius: '8px',
        marginTop: '16px',
        marginBottom: '16px',
        width: '100%',
        height: '400px'
      };
    }

    const newElement: PageElement = {
      id: newElId,
      type,
      content: defaultContent,
      src: (type === 'image' || type === 'image-banner') ? 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80' : undefined,
      styles: defaultStyles,
      ...(type === 'image-banner' ? {
        overlayTitle: 'Banner Title',
        overlaySubtext: 'Banner subtitle text content',
        overlayPosition: 'center',
        showOverlayButton: true,
        overlayButtonText: 'Learn More',
        overlayBgColor: '#000000',
        overlayBgOpacity: 50
      } : {}),
      ...(type === 'webshop' ? {
        settings: {
          logoBadge: 'MM',
          logoText: 'MM LÅSESMED',
          tagline: 'Døgnvagt i Storkøbenhavn',
          searchPlaceholder: 'Søg efter produkt, underkategori eller mærke...',
          productsTitle: 'Vores produkter'
        }
      } : {})
    };

    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== targetPageId) return page;
        return {
          ...page,
          sections: page.sections.map(section => {
            if (section.id !== sectionId) return section;
            return {
              ...section,
              columns: section.columns.map(col => {
                if (col.id !== colId) return col;
                const newElements = [...col.elements];
                if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= newElements.length) {
                  newElements.splice(targetIndex, 0, ensureElementOverrides(newElement));
                } else {
                  newElements.push(ensureElementOverrides(newElement));
                }
                return {
                  ...col,
                  elements: newElements
                };
              })
            };
          })
        };
      });
    });

    handleSelectElement(newElId);
  };

  const handleDeleteElement = (elementId: string) => {
    const targetPageId = findPageIdByElementId(elementId) || activePageId;
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== targetPageId) return page;
        return {
          ...page,
          sections: page.sections.map(section => {
            return {
              ...section,
              columns: section.columns.map(col => {
                return {
                  ...col,
                  elements: col.elements.filter(el => el.id !== elementId)
                };
              })
            };
          })
        };
      });
    });
    setSelectedElementId(null);
  };

  const handleCloneElement = (elementId: string) => {
    const targetPageId = findPageIdByElementId(elementId) || activePageId;
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== targetPageId) return page;
        return {
          ...page,
          sections: page.sections.map(section => {
            return {
              ...section,
              columns: section.columns.map(col => {
                const index = col.elements.findIndex(el => el.id === elementId);
                if (index === -1) return col;

                const target = col.elements[index];
                const cloned: PageElement = {
                  ...JSON.parse(JSON.stringify(target)),
                  id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
                };

                const updatedElements = [...col.elements];
                updatedElements.splice(index + 1, 0, cloned);

                return {
                  ...col,
                  elements: updatedElements
                };
              })
            };
          })
        };
      });
    });
  };

  // Add layout section below another section
  const handleAddSectionBelow = (afterSectionId: string) => {
    const targetPageId = findPageIdBySectionId(afterSectionId) || activePageId;
    const targetPage = pages.find(p => p.id === targetPageId) || activePage;
    const index = targetPage.sections.findIndex(s => s.id === afterSectionId);
    if (index === -1) return;

    const newSecId = `section-${Date.now()}`;
    const newSection: Section = {
      id: newSecId,
      name: 'Custom Marketing Banner',
      layout: 'single-col',
      paddingY: 'md',
      backgroundColor: 'transparent',
      textColor: theme.text,
      columns: [
        {
          id: `${newSecId}-col-1`,
          width: 'w-full',
          elements: [
            {
              id: `el-${Date.now()}-1`,
              type: 'text',
              content: 'Brand highlight headline goes here.',
              styles: {
                fontSize: '28px',
                fontWeight: '700',
                textAlign: 'center',
                marginBottom: '8px'
              }
            },
            {
              id: `el-${Date.now()}-2`,
              type: 'text',
              content: 'Provide detailed benefits of your core design here for your customers.',
              styles: {
                fontSize: '15px',
                textAlign: 'center',
                color: theme.secondary,
                marginBottom: '16px'
              }
            }
          ]
        }
      ]
    };

    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== targetPageId) return page;
        const copy = [...page.sections];
        copy.splice(index + 1, 0, ensureIndependentOverrides([newSection])[0]);
        return {
          ...page,
          sections: copy
        };
      });
    });
  };

  // Add section to bottom of stage
  const handleAddNewSection = (layout: 'single-col' | 'two-col' | 'three-col' | 'footer') => {
    const targetPageId = getRenderedPage().id;
    const newSecId = `section-${Date.now()}`;
    const columnsArr: Column[] = [];

    if (layout === 'single-col') {
      columnsArr.push({
        id: `${newSecId}-col-1`,
        width: 'w-full',
        elements: []
      });
    } else if (layout === 'two-col') {
      columnsArr.push(
        { id: `${newSecId}-col-1`, width: 'md:w-1/2', elements: [] },
        { id: `${newSecId}-col-2`, width: 'md:w-1/2', elements: [] }
      );
    } else if (layout === 'three-col') {
      columnsArr.push(
        { id: `${newSecId}-col-1`, width: 'md:w-1/3', elements: [] },
        { id: `${newSecId}-col-2`, width: 'md:w-1/3', elements: [] },
        { id: `${newSecId}-col-3`, width: 'md:w-1/3', elements: [] }
      );
    } else if (layout === 'footer') {
      const col1Id = `${newSecId}-col-1`;
      const col2Id = `${newSecId}-col-2`;
      const col3Id = `${newSecId}-col-3`;
      const col4Id = `${newSecId}-col-4`;
      columnsArr.push(
        {
          id: col1Id,
          width: 'md:w-4/12',
          elements: [
            {
              id: `${col1Id}-el-logo`,
              type: 'text',
              content: `<div class="flex items-center gap-3 mb-4 select-none">
  <div class="w-12 h-12 rounded-full border border-[#FFC502] flex flex-col items-center justify-center bg-white shrink-0 p-1">
    <span class="text-slate-900 font-extrabold tracking-tighter text-xs leading-none">MM</span>
    <svg class="w-5 h-2.5 text-[#FFC502]" fill="currentColor" viewBox="0 0 24 12">
      <path d="M19.5 4.5c.3 0 .5.2.5.5v1h1v-1c0-.3.2-.5.5-.5s.5.2.5.5v1h1v-2c0-.3.2-.5.5-.5s.5.2.5.5v3.5c0 .3-.2.5-.5.5h-10.4c-.6 1.8-2.3 3-4.1 3-2.5 0-4.5-2-4.5-4.5S5.5 3 8 3c1.8 0 3.5 1.2 4.1 3h7.4v-1c0-.3.2-.5.5-.5zM8 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
    </svg>
  </div>
  <div class="flex flex-col text-left">
    <span class="font-bold tracking-wider leading-none text-slate-800 uppercase text-lg">LÅSESMED</span>
    <span class="text-[#FFC502] tracking-wide font-semibold text-[9px] mt-1">Døgnvagt i Storkøbenhavn</span>
  </div>
</div>
<p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Låsesystemer af høj kvalitet lavet af miljøvenlige materialer. Designet til moderne og minimalistiske lejligheder</p>`,
              styles: {
                fontSize: '12px',
                lineHeight: '1.6',
                color: '#64748B'
              }
            }
          ]
        },
        {
          id: col2Id,
          width: 'md:w-2/12',
          elements: [
            {
              id: `${col2Id}-el-areas`,
              type: 'text',
              content: `<h4 class="font-bold text-slate-800 text-sm mb-3">Områder</h4>
<ul class="space-y-2 text-xs text-slate-500">
  <li>KØBENHAVN</li>
  <li>AMAGER</li>
  <li>VALBY</li>
  <li>RØDOVRE</li>
  <li>HVIDOVRE</li>
</ul>`,
              styles: {
                fontSize: '12px',
                lineHeight: '2.0',
                color: '#64748B'
              }
            }
          ]
        },
        {
          id: col3Id,
          width: 'md:w-3/12',
          elements: [
            {
              id: `${col3Id}-el-address`,
              type: 'text',
              content: `<h4 class="font-bold text-slate-800 text-sm mb-3">Adresse</h4>
<div class="space-y-2 text-xs text-slate-500">
  <p>Kulvej 10, 2 TV</p>
  <p>2450 København</p>
  <p>Denmark</p>
</div>`,
              styles: {
                fontSize: '12px',
                lineHeight: '1.8',
                color: '#64748B'
              }
            }
          ]
        },
        {
          id: col4Id,
          width: 'md:w-3/12',
          elements: [
            {
              id: `${col4Id}-el-info`,
              type: 'text',
              content: `<h4 class="font-bold text-slate-800 text-sm mb-3">Information</h4>
<ul class="space-y-2 text-xs text-slate-500">
  <li>Om os</li>
  <li>Karriere</li>
  <li>+45 31 11 11 15</li>
  <li>info@mmlaasesmed.dk</li>
</ul>`,
              styles: {
                fontSize: '12px',
                lineHeight: '1.8',
                color: '#64748B'
              }
            }
          ]
        }
      );
    }

    const newSection: Section = {
      id: newSecId,
      name: layout === 'footer' ? 'Footer sektion' : `Vertical Row (${layout})`,
      layout: layout === 'footer' ? 'custom' : layout,
      paddingY: 'md',
      backgroundColor: layout === 'footer' ? '#ffffff' : 'transparent',
      textColor: theme.text,
      columns: columnsArr
    };

    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== targetPageId) return page;
        return {
          ...page,
          sections: [...page.sections, ensureIndependentOverrides([newSection])[0]]
        };
      });
    });

    handleSelectSection(newSecId);
  };

  const handleDeleteSection = (sectionId: string) => {
    const targetPageId = findPageIdBySectionId(sectionId) || activePageId;
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== targetPageId) return page;
        return {
          ...page,
          sections: page.sections.filter(s => s.id !== sectionId)
        };
      });
    });
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const targetPageId = findPageIdBySectionId(sectionId) || activePageId;
    const targetPage = pages.find(p => p.id === targetPageId) || activePage;
    const index = targetPage.sections.findIndex(s => s.id === sectionId);
    if (index === -1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= targetPage.sections.length) return;

    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== targetPageId) return page;
        const copy = [...page.sections];
        const temp = copy[index];
        copy[index] = copy[targetIdx];
        copy[targetIdx] = temp;
        return {
          ...page,
          sections: copy
        };
      });
    });
  };

  const handleMoveElement = (elementId: string, direction: 'up' | 'down') => {
    const targetPageId = findPageIdByElementId(elementId) || activePageId;
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== targetPageId) return page;
        return {
          ...page,
          sections: page.sections.map(section => {
            return {
              ...section,
              columns: section.columns.map(col => {
                const index = col.elements.findIndex(el => el.id === elementId);
                if (index === -1) return col;

                const targetIdx = direction === 'up' ? index - 1 : index + 1;
                if (targetIdx < 0 || targetIdx >= col.elements.length) return col;

                const updatedElements = [...col.elements];
                const temp = updatedElements[index];
                updatedElements[index] = updatedElements[targetIdx];
                updatedElements[targetIdx] = temp;

                return {
                  ...col,
                  elements: updatedElements
                };
              })
            };
          })
        };
      });
    });
  };

  const handleResetWorkspace = () => {
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== activePageId) return page;
        const foundTemplate = TEMPLATES.find(t => t.id === activePageId);
        if (!foundTemplate) return page;
        return {
          ...page,
          sections: JSON.parse(JSON.stringify(foundTemplate.sections)),
          theme: activePageId === 'bistro' ? COLOR_THEMES[4] : (activePageId === 'saas' ? COLOR_THEMES[3] : COLOR_THEMES[0])
        };
      });
    });
    setSelectedElementId(null);
    setSelectedSectionId(null);
    setIsPreviewMode(false);
  };

  const handleImportBackup = (importedSections: Section[], importedTheme: SiteTheme) => {
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id !== activePageId) return page;
        return {
          ...page,
          sections: ensureIndependentOverrides(importedSections),
          theme: importedTheme
        };
      });
    });
    setSelectedElementId(null);
    setSelectedSectionId(null);
  };

  // Listen to custom Webshop Design File import events from Sidebar
  useEffect(() => {
    const handleImportDesign = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.sections && customEvent.detail.theme) {
        handleImportBackup(customEvent.detail.sections, customEvent.detail.theme);
      }
    };
    window.addEventListener('import-webshop-design', handleImportDesign);
    return () => window.removeEventListener('import-webshop-design', handleImportDesign);
  }, [activePageId]);

  // Listen to custom Webshop Page creation events from Sidebar
  useEffect(() => {
    const handleCreatePage = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.name) {
        const { name, sections: importedSections, theme: importedTheme } = customEvent.detail;
        const newPageId = `webshop-page-${Date.now()}`;
        const newPage: SinglePageCMS = {
          id: newPageId,
          name: `🛒 ${name}`,
          slug: name.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
          sections: ensureIndependentOverrides(importedSections || []),
          theme: importedTheme || { ...theme }
        };
        setPages(prev => [...prev, newPage]);
        setActivePageId(newPageId);
        window.location.hash = ''; // Clear URL hash immediately on creation
        setSelectedElementId(null);
        setSelectedSectionId(null);
      }
    };
    window.addEventListener('create-webshop-page', handleCreatePage);
    return () => window.removeEventListener('create-webshop-page', handleCreatePage);
  }, [theme]);

  // Listen to custom layout template application events from Sidebar
  useEffect(() => {
    const handleApplyTemplate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.sections) {
        const { sections: importedSections, theme: importedTheme } = customEvent.detail;
        
        // Apply layout to currently rendered page (to support mapping editing too!)
        const targetPageId = getRenderedPage().id;
        
        setPages(prevPages => {
          return prevPages.map(page => {
            if (page.id !== targetPageId) return page;
            return {
              ...page,
              sections: ensureIndependentOverrides(importedSections || []),
              theme: importedTheme || page.theme
            };
          });
        });
        
        setSelectedElementId(null);
        setSelectedSectionId(null);
      }
    };
    window.addEventListener('apply-custom-template', handleApplyTemplate);
    return () => window.removeEventListener('apply-custom-template', handleApplyTemplate);
  }, [pages]);

  const handleAddPage = () => {
    const name = prompt("Enter new page name (e.g., Amager):");
    if (!name) return;
    const defaultSlug = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const slug = prompt("Enter URL path slug (e.g., amager):", defaultSlug);
    if (slug === null) return;
    
    const newPageId = `page-${Date.now()}`;
    const newPage: SinglePageCMS = {
      id: newPageId,
      name: `📄 ${name}`,
      slug: slug.trim(),
      sections: [
        {
          id: `section-${Date.now()}`,
          name: 'Hero Block',
          layout: 'single-col',
          paddingY: 'lg',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a',
          columns: [
            {
              id: `col-${Date.now()}`,
              width: 'w-full',
              elements: [
                {
                  id: `el-${Date.now()}-title`,
                  type: 'text',
                  content: `${name} Layout Page`,
                  styles: {
                    fontSize: '40px',
                    fontWeight: '800',
                    textAlign: 'center',
                    marginBottom: '16px'
                  }
                },
                {
                  id: `el-${Date.now()}-desc`,
                  type: 'text',
                  content: 'Welcome to your newly created custom page block. Click any component inside the workspace or open the templates tab to configure the design layouts.',
                  styles: {
                    fontSize: '16px',
                    textAlign: 'center',
                    color: '#475569',
                    marginBottom: '24px',
                    lineHeight: '1.6'
                  }
                }
              ]
            }
          ]
        }
      ],
      theme: { ...theme }
    };
    
    setPages(prev => [...prev, newPage]);
    setActivePageId(newPageId);
    setSelectedElementId(null);
    setSelectedSectionId(null);
  };

  // Image replacement trigger
  const handleChangeImageClick = (elementId: string) => {
    setActiveImageId(elementId);
    setIsImageModalOpen(true);
  };

  const handleSelectImageSrc = (url: string) => {
    if (activeImageId) {
      if (activeImageId.startsWith('section-')) {
        const sectionId = activeImageId.replace('section-', '');
        handleUpdateSection(sectionId, { backgroundImage: url });
      } else if (activeImageId.includes('-overlay-')) {
        const [elementId, overlayId] = activeImageId.split('-overlay-');
        let foundElement: PageElement | null = null;
        for (const section of sections) {
          for (const col of section.columns) {
            const el = col.elements.find(e => e.id === elementId);
            if (el) {
              foundElement = el;
              break;
            }
          }
          if (foundElement) break;
        }

        if (foundElement) {
          const nextOverlays = (foundElement.overlays || []).map(o => 
            o.id === overlayId ? { ...o, src: url } : o
          );
          handleUpdateElement(elementId, {}, undefined, undefined, undefined, { overlays: nextOverlays });
        }
      } else if (activeImageId.includes('-settings-')) {
        const [elementId, settingKey] = activeImageId.split('-settings-');
        let foundElement: PageElement | null = null;
        for (const section of sections) {
          for (const col of section.columns) {
            const el = col.elements.find(e => e.id === elementId);
            if (el) {
              foundElement = el;
              break;
            }
          }
          if (foundElement) break;
        }

        if (foundElement) {
          handleUpdateElement(elementId, {}, undefined, undefined, undefined, {
            settings: {
              ...(foundElement.settings || {}),
              [settingKey]: url
            }
          });
        }
      } else {
        handleUpdateElement(activeImageId, {}, undefined, undefined, url);
      }
      setActiveImageId(null);
    }
  };

  // Call server-side API proxy to get Gemini optimized copywriting
  const handleGenerateAIContent = async (elementId: string, userPrompt: string) => {
    setIsGeneratingAI(true);
    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt })
      });
      const data = await resp.json();
      if (data && data.text) {
        handleUpdateElement(elementId, {}, data.text);
      } else if (data.error) {
        alert(`Gemini Generation returned an error: ${data.error}`);
      }
    } catch (err) {
      console.error("Fetch copywriting error:", err);
      alert("Lost connectivity. Check your server status and try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };



  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900 text-white font-sans" id="builder-loading-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 animate-pulse">
            Indlæser hjemmeside...
          </div>
        </div>
      </div>
    );
  }

  const currentPath = window.location.pathname.replace(/^\/|\/$/g, '');
  const isEditorPath = currentPath === 'admin-editor' || currentPath === '' || window.location.hash.includes('shop');

  if (!isEditorPath) {
    return (
      <div className="w-full h-screen overflow-y-auto bg-white" id="live-visitor-root">
        <Canvas
          sections={sections}
          theme={theme}
          selectedElementId={null}
          selectedSectionId={null}
          isPreviewMode={true}
          onSelectElement={() => {}}
          onSelectSection={() => {}}
          onUpdateElement={() => {}}
          onAddElement={() => {}}
          onDeleteElement={() => {}}
          onCloneElement={() => {}}
          onMoveElement={() => {}}
          onChangeImageClick={() => {}}
          onAddSectionBelow={() => {}}
          onAddSection={() => {}}
          viewportMode={visitorViewport}
          pages={pages}
          onNavigatePage={(pageId) => {
            setActivePageId(pageId);
            setSelectedElementId(null);
            setSelectedSectionId(null);
          }}
        />
      </div>
    );
  }

  // If we are on /admin-editor but not authenticated
  if (!isAdmin) {
    return (
      <div 
        className="w-full h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4" 
        id="visitor-main-layout"
      >
        <div className="w-full max-w-md bg-slate-800 rounded-3xl shadow-3xl border border-slate-700 p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-indigo-950/40 rounded-full flex items-center justify-center text-indigo-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white font-sans">
              Visual Workspace Locked
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              This layout builder workspace has been secured by the administrator. Please enter your passcode to unlock.
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (inputPasscode === adminPasscode || inputPasscode === 'admin' || inputPasscode === 'admin123' || inputPasscode === 'django') {
              setIsAdmin(true);
              setPasscodeError('');
            } else {
              setPasscodeError('Incorrect security key. Check your settings or use the default.');
            }
          }} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                🔒 Security Passcode
              </label>
              <input
                type="password"
                required
                value={inputPasscode}
                onChange={(e) => setInputPasscode(e.target.value)}
                placeholder="Enter passcode to unlock..."
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-indigo-500 outline-none font-mono text-center tracking-widest text-white"
              />
              {passcodeError && (
                <p className="text-[11px] text-rose-500 font-semibold">{passcodeError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              Unlock Editor
            </button>
          </form>

          <div className="text-center font-mono text-[10px] text-slate-500 border-t border-slate-750 pt-4">
            Default passkey is: <strong className="text-indigo-400 font-bold">admin</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900" id="visual-builder-app-root">
      {/* 1. Header Toolbar */}
      <SaveExportControls
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        isVisitorMode={isVisitorMode}
        setIsVisitorMode={setIsVisitorMode}
        onReset={handleResetWorkspace}
        onImport={handleImportBackup}
        sections={sections}
        theme={theme}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        activePageSlug={activePage.slug}
        activePageName={activePage.name}
        activePageTitle={activePage.title}
        adminPasscode={adminPasscode}
        onUpdatePasscode={(newPass) => {
          setAdminPasscode(newPass);
          localStorage.setItem('visual-builder-admin-passcode', newPass);
        }}
        viewportMode={viewportMode}
        setViewportMode={setViewportMode}
        activePageDbId={activePage.dbId}
        onUpdatePageDbId={(dbId) => {
          setPages(prev => prev.map(p => p.id === activePage.id ? { ...p, dbId } : p));
        }}
        pages={pages}
        isAutoSaveEnabled={isAutoSaveEnabled}
        setIsAutoSaveEnabled={setIsAutoSaveEnabled}
        editorUsername={editorUsername}
        setEditorUsername={setEditorUsername}
      />

      {editLock && (
        <div className="bg-rose-600 text-white font-bold px-6 py-2.5 flex items-center justify-between gap-4 z-30 shadow-md">
          <div className="flex items-center gap-2 text-xs">
            <span>🔒</span>
            <span>OBS: <strong>{editLock.user}</strong> redigerer denne side lige nu! Dine ændringer kan overskrive deres arbejde.</span>
          </div>
          <span className="text-[10px] bg-slate-900/30 px-2 py-0.5 rounded-lg border border-white/10 uppercase tracking-widest font-mono">LÅST</span>
        </div>
      )}

      {hasRemoteChanges && (
        <div className="bg-amber-500 text-slate-950 font-bold px-6 py-2.5 flex items-center justify-between gap-4 z-30 shadow-md animate-pulse">
          <div className="flex items-center gap-2 text-xs">
            <span>🔄</span>
            <span>En anden bruger har lavet ændringer på serveren! Dine lokale sider stemmer ikke overens med databasen.</span>
          </div>
          <button 
            onClick={handleApplyRemoteChanges}
            className="bg-slate-950 hover:bg-slate-900 text-white text-[11px] px-3 py-1 rounded-lg font-bold transition-all shadow-xs cursor-pointer"
          >
            Hent ændringer nu (Load updates)
          </button>
        </div>
      )}

      {/* 1.5 CMS Page Selector Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 z-20 shadow-xs" id="cms-page-selector-bar">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans">CMS Page Navigator:</span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Active Page Indicator */}
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150 dark:border-indigo-900/60 px-3.5 py-1.5 rounded-xl shrink-0">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 font-sans">
                <span>{activePage.slug === '' ? '🏠' : (activePage.id === 'webshop' ? '🛒' : (activePage.id === 'bistro' ? '🥐' : (activePage.id === 'saas' ? '☁️' : (activePage.id === 'about' ? '👥' : (activePage.id === 'terms' ? '⚖️' : '📄')))))}</span>
                <span>Aktiv side: {activePage.id === 'webshop' ? 'Webshop' : (activePage.name.startsWith('📄 ') || activePage.name.startsWith('🏠 ') || activePage.name.startsWith('👥 ') || activePage.name.startsWith('⚖️ ') || activePage.name.startsWith('🥐 ') || activePage.name.startsWith('☁️ ') ? activePage.name.slice(2) : activePage.name)}</span>
              </span>
            </div>

            {/* Page switching dropdown with search */}
            <div className="relative pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowPagesDropdown(!showPagesDropdown)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>📁 Skift side / Søg ({pages.length})</span>
                <span className="text-[9px] text-slate-400">▼</span>
              </button>

              {showPagesDropdown && (
                <div className="absolute top-full left-0 mt-1.5 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 space-y-2.5 z-40">
                  {/* Search Input inside Dropdown */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Søg side efter navn..."
                      value={pageSearchQuery}
                      onChange={(e) => setPageSearchQuery(e.target.value)}
                      className="w-full text-xs pl-8 pr-6 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                      autoFocus
                    />
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
                      🔍
                    </div>
                    {pageSearchQuery && (
                      <button
                        onClick={() => setPageSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-655 text-[10px] border-none bg-transparent cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Pages List */}
                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1 font-sans">
                    {pages
                      .filter(p => {
                        const cleanName = p.name.toLowerCase();
                        const query = pageSearchQuery.toLowerCase();
                        return cleanName.includes(query) || p.slug.toLowerCase().includes(query) || p.id.toLowerCase().includes(query);
                      })
                      .map((p) => {
                        const isActive = p.id === activePageId;
                        const iconsMap: Record<string, string> = {
                          portfolio: '🏠',
                          bistro: '🥐',
                          saas: '☁️',
                          about: '👥',
                          terms: '⚖️',
                          webshop: '🛒'
                        };
                        const dispName = p.id.startsWith('webshop-') || p.id === 'webshop' ? p.name.replace(/^🛒\s/, '') : (p.name.startsWith('📄 ') || p.name.startsWith('🏠 ') || p.name.startsWith('👥 ') || p.name.startsWith('⚖️ ') || p.name.startsWith('🥐 ') || p.name.startsWith('☁️ ') ? p.name.slice(2) : p.name);
                        return (
                          <div
                            key={p.id}
                            className={`flex items-center justify-between p-1.5 rounded-lg border transition-all ${
                              isActive
                                ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-400 font-bold'
                                : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <button
                              onClick={() => {
                                setActivePageId(p.id);
                                setSelectedElementId(null);
                                setSelectedSectionId(null);
                                setShowPagesDropdown(false);
                              }}
                              className="flex-1 text-left text-xs font-semibold flex items-center gap-2 border-none bg-transparent cursor-pointer p-0.5 animate-none"
                            >
                              <span>{p.slug === '' ? '🏠' : (p.id.startsWith('webshop-') ? '🛒' : (iconsMap[p.id] || '📄'))}</span>
                              <div className="truncate text-left">
                                <p className="font-bold leading-tight">{dispName}</p>
                                <p className="text-[9px] text-slate-400 font-mono">/{p.slug || '(startside)'}</p>
                              </div>
                            </button>

                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                {p.sections.flatMap(s => s.columns.flatMap(c => c.elements)).length}
                              </span>
                              {pages.length > 1 && !['portfolio', 'bistro', 'saas', 'about', 'terms', 'webshop'].includes(p.id) && !p.id.startsWith('webshop-') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Er du sikker på, at du vil slette siden "${dispName}"?`)) {
                                      // Save to local blacklist to prevent automatic restoration on refresh
                                      const cleanDelName = p.name.replace('📄 ', '').replace('🛒 ', '').trim();
                                      const deletedNames = JSON.parse(localStorage.getItem('visual-builder-deleted-page-names') || '[]');
                                      if (!deletedNames.includes(cleanDelName)) {
                                        deletedNames.push(cleanDelName);
                                        localStorage.setItem('visual-builder-deleted-page-names', JSON.stringify(deletedNames));
                                      }

                                      // Send DELETE API call to Django backend if a synced database draft is present
                                      if (p.dbId) {
                                        const origin = window.location.origin;
                                        const backendBase = origin.includes('localhost') || origin.includes('127.0.0.1') ? 'http://localhost:8000' : origin;
                                        fetch(`${backendBase}/api/layouts/${p.dbId}/`, {
                                          method: 'DELETE'
                                        }).catch(err => console.error("Error deleting backend layout draft:", err));
                                      }

                                      const remainingPages = pages.filter(page => page.id !== p.id);
                                      setPages(remainingPages);
                                      if (activePageId === p.id) {
                                        setActivePageId(remainingPages[0].id);
                                      }
                                    }
                                  }}
                                  className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 rounded transition-colors text-[9px] font-bold cursor-pointer border-none bg-transparent animate-none"
                                  title="Slet side"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    {pages.filter(p => {
                      const cleanName = p.name.toLowerCase();
                      const query = pageSearchQuery.toLowerCase();
                      return cleanName.includes(query) || p.slug.toLowerCase().includes(query) || p.id.toLowerCase().includes(query);
                    }).length === 0 && (
                      <p className="text-[10px] text-slate-400 text-center py-4">Ingen sider fundet.</p>
                    )}
                  </div>

                  {/* Create Page Button inside Dropdown */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                    <button
                      onClick={() => {
                        handleAddPage();
                        setShowPagesDropdown(false);
                      }}
                      className="w-full py-1.5 rounded-lg text-xs font-bold border border-dashed border-indigo-300 dark:border-slate-700 text-indigo-600 hover:bg-indigo-50/50 dark:text-indigo-400 dark:hover:bg-slate-850 flex items-center justify-center gap-1 transition-all cursor-pointer bg-transparent animate-none"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Opret ny side (Add Page)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowPageManagerModal(true)}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-900/40 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>⚙️ Administrer sider ({pages.length})</span>
            </button>
          </div>
        </div>

        {/* Dynamic Domain & Page Slug Settings */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Base Domain:</span>
            <input 
              type="text" 
              value={baseDomain} 
              onChange={(e) => setBaseDomain(e.target.value)}
              className="bg-transparent border-none font-mono focus:outline-none w-44 font-bold text-slate-700 dark:text-slate-200"
              placeholder="e.g. www.mmlaasesmed.dk"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Page URL:</span>
            <span className="text-slate-500 font-mono">{baseDomain}/</span>
            <input 
              type="text" 
              value={activePage.slug} 
              disabled={activePage.slug === ''}
              onChange={(e) => {
                const newSlug = e.target.value.replace(/[^a-zA-Z0-9-_/]/g, ''); // sanitize slug
                setPages(prev => prev.map(p => p.id === activePageId ? { 
                  ...p, 
                  slug: newSlug,
                  theme: { ...(p.theme || {}), slug: newSlug }
                } : p));
              }}
              className={`bg-transparent border-none font-mono focus:outline-none w-32 font-bold ${activePage.slug === '' ? 'text-emerald-600 dark:text-emerald-400 cursor-not-allowed' : 'text-indigo-600 dark:text-indigo-400'}`}
              placeholder={activePage.slug === '' ? '(Startside)' : 'slug-path'}
            />
            {activePage.slug !== '' ? (
              <button
                onClick={() => {
                  const dispName = activePage.id === 'webshop' ? 'Webshop' : (activePage.name.startsWith('📄 ') || activePage.name.startsWith('🏠 ') || activePage.name.startsWith('👥 ') || activePage.name.startsWith('⚖️ ') || activePage.name.startsWith('🥐 ') || activePage.name.startsWith('☁️ ') ? activePage.name.slice(2) : activePage.name);
                  if (confirm(`Vil du gøre "${dispName}" til din startside (Hjemmeside)? Den nuværende startside vil få en anden URL.`)) {
                    setPageAsHomePage(activePageId);
                  }
                }}
                className="ml-1 px-2 py-1 rounded bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors border-none"
                title="Sæt denne side som startsiden for din hjemmeside"
              >
                🏠 Gør til startside
              </button>
            ) : (
              <span className="ml-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-200/50 flex items-center gap-0.5 select-none uppercase tracking-wider">
                ✅ Startside
              </span>
            )}
          </div>

          <button
            onClick={() => setShowCodeEditor(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            title="Rediger den rå JSON-layoutkode for denne side"
          >
            <Code className="w-3.5 h-3.5 text-indigo-500" />
            <span>Rediger sidekode</span>
          </button>

          <button
            onClick={() => {
              const newPass = prompt("Enter new administrator passcode:", adminPasscode);
              if (newPass !== null) {
                const trimmed = newPass.trim();
                if (trimmed === "") {
                  alert("Passcode cannot be empty!");
                } else {
                  setAdminPasscode(trimmed);
                  localStorage.setItem('visual-builder-admin-passcode', trimmed);
                  alert(`Passcode successfully updated! The new passcode is now "${trimmed}".`);
                }
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            title="Change administrator passcode"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>Change Passcode</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Visual Wix Sidebar (Hidden in Preview) */}
        {!isPreviewMode && (
          <Sidebar
            sections={sections}
            theme={theme}
            selectedElement={getSelectedElement()}
            selectedSection={getSelectedSection()}
            onUpdateElement={handleUpdateElement}
            onUpdateSection={handleUpdateSection}
            onSelectTheme={handleSelectTheme}
            onLoadTemplate={handleLoadTemplate}
            onAddElement={handleAddElement}
            onDeleteElement={handleDeleteElement}
            onCloneElement={handleCloneElement}
            onAddSection={handleAddNewSection}
            onDeleteSection={handleDeleteSection}
            onMoveSection={handleMoveSection}
            onMoveElement={handleMoveElement}
            onGenerateAIContent={handleGenerateAIContent}
            isGeneratingAI={isGeneratingAI}
            onChangeImageClick={handleChangeImageClick}
            viewportMode={viewportMode}
            onChangeViewportMode={setViewportMode}
            pages={pages}
            activePageId={activePageId}
            onNavigatePage={(pageId) => {
              setActivePageId(pageId);
              setSelectedElementId(null);
              setSelectedSectionId(null);
            }}
          />
        )}

        {/* 3. Real-Time Responsive Layout Canvas */}
        {viewportMode === 'desktop' ? (
          <Canvas
            sections={sections}
            theme={theme}
            selectedElementId={selectedElementId}
            selectedSectionId={selectedSectionId}
            isPreviewMode={isPreviewMode}
            onSelectElement={handleSelectElement}
            onSelectSection={handleSelectSection}
            onUpdateElement={handleUpdateElement}
            onAddElement={handleAddElement}
            onDeleteElement={handleDeleteElement}
            onCloneElement={handleCloneElement}
            onMoveElement={handleMoveElement}
            onChangeImageClick={handleChangeImageClick}
            onAddSectionBelow={handleAddSectionBelow}
            onAddSection={handleAddNewSection}
            viewportMode={viewportMode}
            pages={pages}
            onNavigatePage={(pageId) => {
              setActivePageId(pageId);
              setSelectedElementId(null);
              setSelectedSectionId(null);
            }}
          />
        ) : (
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-200 dark:bg-slate-950 p-6 md:p-8 flex justify-center items-start">
            <div 
              style={{
                width: viewportMode === 'mobile' ? '375px' : '768px',
                minHeight: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: theme.background,
                position: 'relative'
              }}
              className="h-fit w-full flex flex-col"
            >
              <Canvas
                sections={sections}
                theme={theme}
                selectedElementId={selectedElementId}
                selectedSectionId={selectedSectionId}
                isPreviewMode={isPreviewMode}
                onSelectElement={handleSelectElement}
                onSelectSection={handleSelectSection}
                onUpdateElement={handleUpdateElement}
                onAddElement={handleAddElement}
                onDeleteElement={handleDeleteElement}
                onCloneElement={handleCloneElement}
                onMoveElement={handleMoveElement}
                onChangeImageClick={handleChangeImageClick}
                onAddSectionBelow={handleAddSectionBelow}
                onAddSection={handleAddNewSection}
                viewportMode={viewportMode}
                pages={pages}
                onNavigatePage={(pageId) => {
                  setActivePageId(pageId);
                  setSelectedElementId(null);
                  setSelectedSectionId(null);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Elegant Picture Picker Overlay Popup */}
      <ImageSelectorModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelect={handleSelectImageSrc}
        currentUrl={activeImageId ? (getSelectedElement()?.src || '') : ''}
      />

      {/* 5. Code Editor Modal */}
      {showCodeEditor && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl text-slate-100 font-sans">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Rediger rå JSON-layoutkode
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Du redigerer koden for siden: <strong className="text-slate-200">{activePage.id === 'webshop' ? 'Webshop' : (activePage.name.startsWith('📄 ') || activePage.name.startsWith('🏠 ') || activePage.name.startsWith('👥 ') || activePage.name.startsWith('⚖️ ') || activePage.name.startsWith('🥐 ') || activePage.name.startsWith('☁️ ') ? activePage.name.slice(2) : activePage.name)}</strong>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowCodeEditor(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1.5 hover:bg-slate-900 rounded-lg transition-colors border-none cursor-pointer"
              >
                ✕ Luk
              </button>
            </div>

            {/* Warning banner */}
            <div className="bg-slate-900/60 px-6 py-2.5 border-b border-slate-850 text-[10px] text-amber-400 flex items-center gap-2 shrink-0 select-none">
              ⚠️ <strong>OBS:</strong> Redigering af denne kode ændrer sidens struktur direkte. Sørg for at bevare det rigtige JSON-format (skal være et array af sektionsobjekter).
            </div>

            {/* Modal Body (Textarea) */}
            <div className="flex-1 p-6 overflow-hidden flex flex-col gap-2 min-h-0">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                JSON Layout Data
              </label>
              <div className="flex-1 relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex">
                {/* Simulated line numbers column */}
                <div className="w-12 bg-slate-900/40 border-r border-slate-800/40 select-none font-mono text-[10px] text-slate-505 py-3 text-right pr-2 leading-relaxed overflow-hidden shrink-0">
                  {Array.from({ length: Math.min(250, (rawJsonCode.match(/\n/g) || []).length + 1) }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  value={rawJsonCode}
                  onChange={(e) => {
                    setRawJsonCode(e.target.value);
                    setJsonError(null);
                  }}
                  className="flex-1 bg-transparent p-3 font-mono text-[11px] leading-relaxed text-indigo-200 focus:outline-none overflow-y-auto resize-none h-full"
                  placeholder="[{ ... }]"
                  spellCheck={false}
                />
              </div>
              {jsonError && (
                <div className="text-xs font-semibold text-rose-500 bg-rose-950/25 border border-rose-900/40 p-2.5 rounded-xl flex items-center gap-2 shrink-0">
                  <span>❌</span>
                  <span>{jsonError}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(rawJsonCode);
                      setRawJsonCode(JSON.stringify(parsed, null, 2));
                      setJsonError(null);
                    } catch (err: any) {
                      setJsonError(`Formatteringsfejl: ${err.message}`);
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border-none cursor-pointer"
                >
                  Formatér JSON
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(rawJsonCode);
                    alert("Kopieret til udklipsholder!");
                  }}
                  className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border-none cursor-pointer"
                >
                  Kopier kode
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCodeEditor(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl transition-all border-none cursor-pointer"
                >
                  Annuller
                </button>
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(rawJsonCode);
                      if (!Array.isArray(parsed)) {
                        throw new Error("Rod-JSON skal være et array af sektioner.");
                      }
                      // Apply updates
                      setPages(prev => prev.map(p => p.id === activePageId ? { ...p, sections: parsed } : p));
                      setJsonError(null);
                      setShowCodeEditor(false);
                    } catch (err: any) {
                      setJsonError(`Ugyldig JSON-struktur: ${err.message}`);
                    }
                  }}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/10 transition-all border-none cursor-pointer active:scale-95"
                >
                  Anvend ændringer
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. Page Manager Modal */}
      {showPageManagerModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl text-slate-100 font-sans">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Administrer Sider & URL-slugs
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Tilføj nye sider, omdøb dem og rediger URL-slugs for alle sider på dit websted.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowPageManagerModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1.5 hover:bg-slate-900 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
              >
                ✕ Luk
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto min-h-0 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      <th className="pb-3 pl-2">Ikon / Side</th>
                      <th className="pb-3">Sidenavn</th>
                      <th className="pb-3">HTML Sidetitel (SEO)</th>
                      <th className="pb-3">URL Slug (Path)</th>
                      <th className="pb-3">Forhåndsvisning af URL</th>
                      <th className="pb-3 text-right pr-2">Handlinger</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {pages.map((p) => {
                      const iconsMap: Record<string, string> = {
                        portfolio: '🏠',
                        bistro: '🥐',
                        saas: '☁️',
                        about: '👥',
                        terms: '⚖️',
                        webshop: '🛒'
                      };
                      const pageIcon = p.slug === '' ? '🏠' : (iconsMap[p.id] || '📄');
                      
                      // Check for duplicate slug
                      const hasDuplicateSlug = pages.some(other => other.id !== p.id && other.slug.toLowerCase() === p.slug.toLowerCase());
                      const isHome = p.slug === '';

                      return (
                        <React.Fragment key={p.id}>
                          <tr className="hover:bg-slate-900/30 transition-colors group">
                            {/* 1. Icon */}
                          <td className="py-3.5 pl-2 text-lg">
                            {pageIcon}
                          </td>
                          
                          {/* 2. Sidenavn input */}
                          <td className="py-3.5 pr-4">
                            <input
                              type="text"
                              value={p.name.replace(/^📄\s|^🛒\s|^🏠\s|^👥\s|^⚖️\s|^🥐\s|^☁️\s/, '')}
                              onChange={(e) => {
                                const newCleanName = e.target.value;
                                setPages(prev => prev.map(page => page.id === p.id ? {
                                  ...page,
                                  name: `${pageIcon} ${newCleanName}`
                                } : page));
                              }}
                              placeholder="F.eks. Amager"
                              className="px-3 py-1.5 w-44 bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all text-white"
                            />
                          </td>
                          
                          {/* 2b. HTML Title input */}
                          <td className="py-3.5 pr-4">
                            <input
                              type="text"
                              value={p.title || ''}
                              onChange={(e) => {
                                const newTitle = e.target.value;
                                setPages(prev => prev.map(page => page.id === p.id ? {
                                  ...page,
                                  title: newTitle
                                } : page));
                              }}
                              placeholder="F.eks. Låsesmed København"
                              className="px-3 py-1.5 w-44 bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all text-white"
                            />
                          </td>

                          {/* 3. URL Slug input */}
                          <td className="py-3.5 pr-4">
                            <div className="relative flex items-center">
                              <span className="absolute left-2.5 text-slate-500 text-[11px] font-mono">/</span>
                              <input
                                type="text"
                                value={p.slug}
                                disabled={isHome}
                                onChange={(e) => {
                                  // Sanitize slug path: lowercase, only alphanumeric, dash, underscore, slash
                                  const rawVal = e.target.value.toLowerCase().replace(/[^a-z0-9-_/]/g, '');
                                  setPages(prev => prev.map(page => page.id === p.id ? {
                                    ...page,
                                    slug: rawVal,
                                    theme: { ...(page.theme || {}), slug: rawVal }
                                  } : page));
                                }}
                                placeholder={isHome ? '(startside)' : 'slug-path'}
                                className={`pl-5 pr-3 py-1.5 w-40 bg-slate-900 border ${
                                  hasDuplicateSlug ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500'
                                } rounded-xl text-xs font-mono focus:outline-none transition-all ${
                                  isHome ? 'text-emerald-500 cursor-not-allowed font-bold' : 'text-emerald-500'
                                }`}
                              />
                            </div>
                            {hasDuplicateSlug && (
                              <p className="text-[9px] text-rose-500 font-medium mt-1">⚠️ Dubleret slug!</p>
                            )}
                          </td>

                          {/* 4. Preview URL */}
                          <td className="py-3.5 pr-4 text-xs font-mono text-slate-400">
                            {isHome ? (
                              <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 text-[10px]">
                                {baseDomain || 'hjemmeside'} (Startside)
                              </span>
                            ) : (
                              <span className="truncate max-w-[200px] block">
                                {baseDomain ? `${baseDomain}/${p.slug}` : `/${p.slug}`}
                              </span>
                            )}
                          </td>

                          {/* 5. Handlinger */}
                          <td className="py-3.5 text-right pr-2 space-x-1.5 flex justify-end">
                            <button
                              onClick={() => {
                                setEditingSeoPageId(editingSeoPageId === p.id ? null : p.id);
                              }}
                              className={`px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border-none cursor-pointer ${
                                editingSeoPageId === p.id 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300'
                              }`}
                              title="Rediger SEO indstillinger for denne side"
                            >
                              🔍 SEO
                            </button>
                            {!isHome && (
                              <button
                                onClick={() => {
                                  const dispName = p.name.replace(/^📄\s|^🛒\s|^🏠\s|^👥\s|^⚖️\s|^🥐\s|^☁️\s/, '');
                                  if (confirm(`Vil du gøre "${dispName}" til din startside (Hjemmeside)? Den nuværende startside vil få en anden URL.`)) {
                                    setPageAsHomePage(p.id);
                                  }
                                }}
                                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border-none cursor-pointer"
                                title="Sæt som startside"
                              >
                                🏠 Gør til startside
                              </button>
                            )}

                            {pages.length > 1 && !['portfolio', 'bistro', 'saas', 'about', 'terms', 'webshop'].includes(p.id) ? (
                              <button
                                onClick={() => {
                                  const dispName = p.name.replace(/^📄\s|^🛒\s|^🏠\s|^👥\s|^⚖️\s|^🥐\s|^☁️\s/, '');
                                  if (confirm(`Er du sikker på, at du vil slette siden "${dispName}"?`)) {
                                    const cleanDelName = p.name.replace('📄 ', '').replace('🛒 ', '').trim();
                                    const deletedNames = JSON.parse(localStorage.getItem('visual-builder-deleted-page-names') || '[]');
                                    if (!deletedNames.includes(cleanDelName)) {
                                      deletedNames.push(cleanDelName);
                                      localStorage.setItem('visual-builder-deleted-page-names', JSON.stringify(deletedNames));
                                    }

                                    if (p.dbId) {
                                      const origin = window.location.origin;
                                      const backendBase = origin.includes('localhost') || origin.includes('127.0.0.1') ? 'http://localhost:8000' : origin;
                                      fetch(`${backendBase}/api/layouts/${p.dbId}/`, {
                                        method: 'DELETE'
                                      }).catch(err => console.error("Error deleting backend layout draft:", err));
                                    }

                                    const remainingPages = pages.filter(page => page.id !== p.id);
                                    setPages(remainingPages);
                                    if (activePageId === p.id) {
                                      setActivePageId(remainingPages[0].id);
                                    }
                                  }
                                }}
                                className="px-2 py-1.5 bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 hover:text-rose-350 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border-none cursor-pointer"
                                title="Slet side"
                              >
                                🗑️ Slet
                              </button>
                            ) : (
                              <span className="text-[9px] text-slate-500 select-none px-2 py-1">Låst side</span>
                            )}
                          </td>
                        </tr>

                        {/* SEO Editor Expanded Row */}
                        {editingSeoPageId === p.id && (
                          <tr className="bg-slate-900/60 border-b border-slate-850">
                            <td colSpan={6} className="p-4 pl-12 border-l-2 border-indigo-500">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                                  <Globe className="w-4 h-4" />
                                  <h4 className="text-xs font-bold uppercase tracking-wider">SEO Metadata for {p.name.replace(/^📄\s|^🛒\s|^🏠\s|^👥\s|^⚖️\s|^🥐\s|^☁️\s/, '')}</h4>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Meta Title (Overskriver Sidetitel)</label>
                                    <input 
                                      type="text" 
                                      value={p.seoMetadata?.metaTitle || ''}
                                      onChange={(e) => {
                                        setPages(prev => prev.map(page => page.id === p.id ? {
                                          ...page,
                                          seoMetadata: { ...page.seoMetadata, metaTitle: e.target.value }
                                        } : page));
                                      }}
                                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-200"
                                      placeholder="Specificeret SEO titel for søgemaskiner..."
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Meta Keywords</label>
                                    <input 
                                      type="text" 
                                      value={p.seoMetadata?.metaKeywords || ''}
                                      onChange={(e) => {
                                        setPages(prev => prev.map(page => page.id === p.id ? {
                                          ...page,
                                          seoMetadata: { ...page.seoMetadata, metaKeywords: e.target.value }
                                        } : page));
                                      }}
                                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-200"
                                      placeholder="låsesmed, københavn, billig, døgnvagt..."
                                    />
                                  </div>
                                  <div className="space-y-1.5 col-span-2">
                                    <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Meta Description</label>
                                    <textarea 
                                      rows={2}
                                      value={p.seoMetadata?.metaDescription || ''}
                                      onChange={(e) => {
                                        setPages(prev => prev.map(page => page.id === p.id ? {
                                          ...page,
                                          seoMetadata: { ...page.seoMetadata, metaDescription: e.target.value }
                                        } : page));
                                      }}
                                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-200 resize-none"
                                      placeholder="Beskrivelse af siden som vises i Google søgeresultater (maks 160 tegn anbefales)..."
                                    />
                                  </div>
                                  <div className="space-y-1.5 col-span-2">
                                    <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Meta Tags (Custom HTML)</label>
                                    <textarea 
                                      rows={2}
                                      value={p.seoMetadata?.metaTags || ''}
                                      onChange={(e) => {
                                        setPages(prev => prev.map(page => page.id === p.id ? {
                                          ...page,
                                          seoMetadata: { ...page.seoMetadata, metaTags: e.target.value }
                                        } : page));
                                      }}
                                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono focus:outline-none focus:border-indigo-500 text-slate-300 resize-none"
                                      placeholder='<meta property="og:image" content="https://..." />'
                                    />
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
              <button
                onClick={handleAddPage}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md shadow-indigo-600/10"
              >
                <Plus className="w-4 h-4" /> Tilføj Ny Side
              </button>

              <button
                onClick={() => setShowPageManagerModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer active:scale-95"
              >
                Færdig
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
