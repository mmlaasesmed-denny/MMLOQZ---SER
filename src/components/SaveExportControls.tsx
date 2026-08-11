import React, { useState } from 'react';
import { Eye, EyeOff, Code, Download, RefreshCw, Upload, Check, Database, Wifi, WifiOff, Server, Trash2, LogOut, Lock, Monitor, Tablet, Smartphone, Moon, Sun, Globe } from 'lucide-react';
import { Section, SiteTheme } from '../types';
import { WEBSHOP_CATEGORIES as WEBSHOP_CATEGORIES_ORIG, WEBSHOP_SUBCATEGORIES as WEBSHOP_SUBCATEGORIES_ORIG, WEBSHOP_BRANDS, WEBSHOP_PRODUCTS as WEBSHOP_PRODUCTS_ORIG } from '../webshopData';
import { useLanguage } from '../i18n';

interface SaveExportControlsProps {
  isPreviewMode: boolean;
  setIsPreviewMode: (preview: boolean) => void;
  isVisitorMode: boolean;
  setIsVisitorMode: (visitor: boolean) => void;
  onReset: () => void;
  onImport: (sections: Section[], theme: SiteTheme) => void;
  sections: Section[];
  theme: SiteTheme;
  isAdmin?: boolean;
  setIsAdmin?: (admin: boolean) => void;
  activePageSlug?: string;
  activePageName?: string;
  adminPasscode?: string;
  onUpdatePasscode?: (newPass: string) => void;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  setViewportMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  activePageDbId?: number;
  onUpdatePageDbId?: (dbId: number) => void;
  activePageTitle?: string;
  pages?: any[];
  isAutoSaveEnabled?: boolean;
  setIsAutoSaveEnabled?: (enabled: boolean) => void;
  editorUsername?: string;
  setEditorUsername?: (username: string) => void;
}

export default function SaveExportControls({
  isPreviewMode,
  setIsPreviewMode,
  isVisitorMode,
  setIsVisitorMode,
  onReset,
  onImport,
  sections,
  theme,
  isAdmin,
  setIsAdmin,
  activePageSlug,
  activePageName,
  adminPasscode = 'admin',
  onUpdatePasscode,
  viewportMode,
  setViewportMode,
  activePageDbId,
  onUpdatePageDbId
}: SaveExportControlsProps) {
  const { language, setLanguage } = useLanguage();
  const [showCodeExport, setShowCodeExport] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Python Django Server Sync States
  const [showDjangoModal, setShowDjangoModal] = useState(false);
  const [djangoApiUrl, setDjangoApiUrl] = useState(() => {
    return localStorage.getItem('visual-builder-django-url') || (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') ? 'http://localhost:8000' : window.location.origin);
  });
  const [djangoStatus, setDjangoStatus] = useState<'disconnected' | 'connected' | 'checking' | 'error'>('disconnected');
  const [djangoMsg, setDjangoMsg] = useState('');
  const [djangoLayouts, setDjangoLayouts] = useState<any[]>([]);
  const [newLayoutTitle, setNewLayoutTitle] = useState('My Custom Website Draft');
  const [isDjangoLoading, setIsDjangoLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  };

  // Deployment Sync Check States
  const [deployCheckStatus, setDeployCheckStatus] = useState<'idle' | 'checking' | 'success' | 'warning' | 'error'>('idle');
  const [deployInfo, setDeployInfo] = useState<{
    localCommit?: string;
    remoteCommit?: string;
    localDbMd5?: string;
    remoteDbMd5?: string;
    errorMsg?: string;
  } | null>(null);

  const handleVerifyDeploymentSync = async () => {
    setDeployCheckStatus('checking');
    try {
      // 1. Fetch from Local Django Backend
      const localResp = await fetch(`http://localhost:8000/api/deploy-status/`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!localResp.ok) throw new Error("Local Django backend did not respond successfully.");
      const localData = await localResp.json();

      // 2. Fetch from Production Django Backend (test.mmlaasesmed.dk)
      const remoteResp = await fetch(`https://test.mmlaasesmed.dk/api/deploy-status/`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!remoteResp.ok) throw new Error("Production Django backend did not respond successfully.");
      const remoteData = await remoteResp.json();

      setDeployInfo({
        localCommit: localData.git_commit,
        remoteCommit: remoteData.git_commit,
        localDbMd5: localData.db_md5,
        remoteDbMd5: remoteData.db_md5
      });

      const commitMatch = localData.git_commit === remoteData.git_commit;
      const dbMatch = localData.db_md5 === remoteData.db_md5;

      if (commitMatch && dbMatch) {
        setDeployCheckStatus('success');
      } else {
        setDeployCheckStatus('warning');
      }
    } catch (err: any) {
      console.error("Failed to verify deployment sync status:", err);
      setDeployCheckStatus('error');
      setDeployInfo({ errorMsg: err.message || "Failed to fetch deployment details from both environments." });
    }
  };


  // Run initial background connection check to Django
  React.useEffect(() => {
    const savedUrl = localStorage.getItem('visual-builder-django-url');
    if (savedUrl) {
      handleCheckDjangoConnection(savedUrl);
    }
  }, []);

  const getCleanApiUrl = (baseUrl: string) => {
    const trimmed = baseUrl.trim().replace(/\/$/, "");
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  };

  const handleCheckDjangoConnection = async (customUrl?: string) => {
    const rawUrl = customUrl !== undefined ? customUrl : djangoApiUrl;
    const targetUrl = getCleanApiUrl(rawUrl);
    setDjangoStatus('checking');
    setDjangoMsg('');
    try {
      const resp = await fetch(`${targetUrl}/visual-builder-test/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (resp.ok) {
        const data = await resp.json();
        setDjangoStatus('connected');
        setDjangoMsg(data.message || 'CORS connection working perfectly!');
        localStorage.setItem('visual-builder-django-url', rawUrl);
        fetchDjangoLayouts(rawUrl);
      } else {
        throw new Error(`Server returned HTTP status ${resp.status}`);
      }
    } catch (err: any) {
      console.warn("Django offline:", err);
      // Fallback: check standard layouts end point listing directly
      try {
        const respList = await fetch(`${targetUrl}/layouts/`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (respList.ok) {
          setDjangoStatus('connected');
          setDjangoMsg('Connected directly to Django layouts DB!');
          localStorage.setItem('visual-builder-django-url', rawUrl);
          const data = await respList.json();
          setDjangoLayouts(Array.isArray(data) ? data : []);
          return;
        }
      } catch (innerErr) {}
      
      setDjangoStatus('error');
      setDjangoMsg(err.message || 'Could not connect. Ensure python manage.py runserver is running at this host.');
    }
  };

  const fetchDjangoLayouts = async (urlStr: string) => {
    const targetUrl = getCleanApiUrl(urlStr);
    try {
      const resp = await fetch(`${targetUrl}/layouts/`, {
        headers: { 'Accept': 'application/json' }
      });
      if (resp.ok) {
        const data = await resp.json();
        setDjangoLayouts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Layout fetch failure:", err);
    }
  };

  const handleDirectSaveToDjango = async () => {
    const PAGE_SLUGS: Record<string, { slug: string; title: string }> = {
      portfolio: { slug: 'home-page', title: 'Home Creative Workspace' },
      bistro: { slug: 'bistro-menu', title: 'Artisanal Pastry Bistro' },
      saas: { slug: 'saas-cloud', title: 'Technical SaaS Cloud Page' },
      about: { slug: 'about-team', title: 'Creative Team Profiles' },
      terms: { slug: 'legal-terms', title: 'Technical SLA Policy & Terms' },
    };

    const activeId = localStorage.getItem('visual-builder-active-page-id-v2') || 'portfolio';
    const pageInfo = {
      slug: (activePageSlug !== undefined && activePageSlug.trim() !== '') ? activePageSlug : (PAGE_SLUGS[activeId]?.slug || 'home-page'),
      title: activePageName ? `Page: ${activePageName}` : (PAGE_SLUGS[activeId]?.title || activeId)
    };
    const targetUrl = getCleanApiUrl(djangoApiUrl);
    setIsDjangoLoading(true);

    try {
      // Create sequence representation to target separate text/image/button dynamic models
      const elements: any[] = [];
      sections.forEach(section => {
        section.columns.forEach(col => {
          col.elements.forEach(el => {
            elements.push({
              type: el.type,
              content: el.content,
              src: el.src || '',
              alt: el.alt || '',
              link: el.link || '#',
              styles: {
                fontSize: el.styles.fontSize || '',
                fontWeight: el.styles.fontWeight || '',
                textAlign: el.styles.textAlign || '',
                color: el.styles.color || '',
                borderRadius: el.styles.borderRadius || '',
                backgroundColor: el.styles.backgroundColor || '',
              }
            });
          });
        });
      });

      const relationalPayload = {
        title: pageInfo.title,
        slug: pageInfo.slug,
        description: `Synced directly via Visual Toolbar on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        elements_sequenced: elements
      };

      // 1. Try to save relational models (Approach C)
      const putResp = await fetch(`${targetUrl}/cms-pages/${pageInfo.slug}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(relationalPayload)
      });

      let saveCSuccess = false;
      if (putResp.ok) {
        saveCSuccess = true;
      } else if (putResp.status === 404 || putResp.status === 405) {
        const postResp = await fetch(`${targetUrl}/cms-pages/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(relationalPayload)
        });
        if (postResp.ok) {
          saveCSuccess = true;
        }
      }

      // 2. Also save custom model schemas doc (Approach A)
      const layoutPayload = {
        title: `${pageInfo.title} (Synced Draft)`,
        sections: sections,
        theme: {
          ...theme,
          slug: pageInfo.slug
        }
      };

      let layoutResp;
      if (activePageDbId) {
        layoutResp = await fetch(`${targetUrl}/layouts/${activePageDbId}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(layoutPayload)
        });
      }

      if (!layoutResp || !layoutResp.ok) {
        layoutResp = await fetch(`${targetUrl}/layouts/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(layoutPayload)
        });
        if (layoutResp.ok && onUpdatePageDbId) {
          const newLayout = await layoutResp.json();
          if (newLayout && newLayout.id) {
            onUpdatePageDbId(newLayout.id);
          }
        }
      }

      if (saveCSuccess) {
        setDjangoStatus('connected');
        alert(`🎉 Saved successfully to Python Django Database!\n\nPage: "${pageInfo.title}"\nSlug: /api/cms-pages/${pageInfo.slug}/\n\nSaved edited text updates and image sources directly inside Django SQL tables.`);
        fetchDjangoLayouts(djangoApiUrl);
      } else {
        const errText = await putResp.text();
        throw new Error(errText || 'Unspecified endpoint rejection');
      }

    } catch (err: any) {
      setDjangoStatus('error');
      alert(`❌ Django Database offline or unreachable!\n\nTo save to SQL:\n1. Make sure your local Python server is running (python manage.py runserver)\n2. Host URL configuration in settings should be set to: ${targetUrl}\n3. Check console logs to troubleshoot.`);
    } finally {
      setIsDjangoLoading(false);
    }
  };

  const handleSaveToDjango = async () => {
    if (!newLayoutTitle.trim()) {
      alert('Please enter a descriptive draft name.');
      return;
    }
    const targetUrl = getCleanApiUrl(djangoApiUrl);
    setIsDjangoLoading(true);
    try {
      const payload = {
        title: newLayoutTitle,
        sections: sections,
        theme: theme
      };
      const resp = await fetch(`${targetUrl}/layouts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        alert('Layout design saved successfully inside Django models.JSONField!');
        fetchDjangoLayouts(djangoApiUrl);
      } else {
        const errorText = await resp.text();
        alert(`Failed to save: ${errorText}`);
      }
    } catch (err: any) {
      alert(`Network connection failure: ${err.message}`);
    } finally {
      setIsDjangoLoading(false);
    }
  };

  const handleLoadFromDjango = (layoutObj: any) => {
    if (confirm(`Do you wish to discard current work and load saved layout draft "${layoutObj.title}" from your Django backend?`)) {
      if (layoutObj.sections && layoutObj.theme) {
        onImport(layoutObj.sections, layoutObj.theme);
        if (onUpdatePageDbId) {
          onUpdatePageDbId(layoutObj.id);
        }
        setShowDjangoModal(false);
      } else {
        alert('Invalid schema detected inside this Django record.');
      }
    }
  };

  const handleUpdateInDjango = async (layoutId: number, title: string) => {
    if (!confirm(`Er du sikker på, at du vil overskrive designet for "${title}" på serveren med dit nuværende canvas layout?`)) {
      return;
    }
    const targetUrl = getCleanApiUrl(djangoApiUrl);
    setIsDjangoLoading(true);
    try {
      const payload = {
        title: title,
        sections: sections,
        theme: theme
      };
      const resp = await fetch(`${targetUrl}/layouts/${layoutId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        alert('Layout-designet blev opdateret på serveren!');
        fetchDjangoLayouts(djangoApiUrl);
      } else {
        const errorText = await resp.text();
        alert(`Fejl ved opdatering af layout: ${errorText}`);
      }
    } catch (err: any) {
      alert(`Netværksfejl under opdatering: ${err.message}`);
    } finally {
      setIsDjangoLoading(false);
    }
  };

  const handleDeleteFromDjango = async (layoutId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you styled to permanently delete this layout record from Django database?')) {
      return;
    }
    const targetUrl = getCleanApiUrl(djangoApiUrl);
    try {
      const resp = await fetch(`${targetUrl}/layouts/${layoutId}/`, {
        method: 'DELETE'
      });
      if (resp.ok) {
        setDjangoLayouts(prev => prev.filter(l => l.id !== layoutId));
      } else {
        alert('Failed to erase design entry.');
      }
    } catch (err: any) {
      alert(`Network error during deletion: ${err.message}`);
    }
  };

  // Generate clean, independent standalone HTML with Tailwind loaded via CDN
  const generateStandaloneHTML = () => {
    const WEBSHOP_CATEGORIES = (() => {
      if (typeof window !== 'undefined') {
        const str = window.localStorage.getItem('mm_lase_categories');
        if (str) {
          try { return JSON.parse(str); } catch (e) {}
        }
      }
      return WEBSHOP_CATEGORIES_ORIG;
    })();

    const WEBSHOP_SUBCATEGORIES = (() => {
      if (typeof window !== 'undefined') {
        const str = window.localStorage.getItem('mm_lase_subcategories');
        if (str) {
          try { return JSON.parse(str); } catch (e) {}
        }
      }
      return WEBSHOP_SUBCATEGORIES_ORIG;
    })();

    const WEBSHOP_PRODUCTS = (() => {
      if (typeof window !== 'undefined') {
        const str = window.localStorage.getItem('mm_lase_products');
        if (str) {
          try { return JSON.parse(str); } catch (e) {}
        }
      }
      return WEBSHOP_PRODUCTS_ORIG;
    })();

    const formatStyleVal = (val: string | undefined): string | undefined => {
      if (!val) return undefined;
      if (/^-?\d+(\.\d+)?$/.test(val.trim())) {
        return `${val.trim()}px`;
      }
      return val;
    };

    const findLogoOverlay = () => {
      for (const s of sections) {
        for (const col of s.columns) {
          for (const el of col.elements) {
            if (el.type === 'image-banner' && el.overlays) {
              const found = el.overlays.find(o => o.type === 'logo');
              if (found) return found;
            }
          }
        }
      }
      return null;
    };

    const findMenuOverlay = () => {
      for (const s of sections) {
        for (const col of s.columns) {
          for (const el of col.elements) {
            if (el.type === 'image-banner' && el.overlays) {
              const found = el.overlays.find(o => o.type === 'dropdown-menu');
              if (found) return found;
            }
          }
        }
      }
      return null;
    };

    const menuOverlay = findMenuOverlay();

    const buildCSSPropertiesString = (styles: any, important = false) => {
      const formatted = (prop: string | undefined) => formatStyleVal(prop);
      const suffix = important ? ' !important' : '';
      return [
        styles.fontSize ? `font-size: ${formatted(styles.fontSize)}${suffix}` : '',
        styles.fontWeight ? `font-weight: ${styles.fontWeight}${suffix}` : '',
        styles.fontStyle ? `font-style: ${styles.fontStyle}${suffix}` : '',
        styles.textDecoration ? `text-decoration: ${styles.textDecoration}${suffix}` : '',
        styles.textAlign ? `text-align: ${styles.textAlign}${suffix}` : '',
        styles.lineHeight ? `line-height: ${styles.lineHeight}${suffix}` : '',
        styles.letterSpacing ? `letter-spacing: ${formatted(styles.letterSpacing)}${suffix}` : '',
        styles.wordSpacing ? `word-spacing: ${formatted(styles.wordSpacing)}${suffix}` : '',
        styles.color ? `color: ${styles.color}${suffix}` : '',
        styles.backgroundColor ? `background-color: ${styles.backgroundColor}${suffix}` : '',
        styles.borderColor ? `border-color: ${styles.borderColor}${suffix}` : '',
        styles.borderWidth ? `border-width: ${formatted(styles.borderWidth)}${suffix}` : '',
        styles.borderRadius ? `border-radius: ${formatted(styles.borderRadius)}${suffix}` : '',
        styles.paddingTop ? `padding-top: ${formatted(styles.paddingTop)}${suffix}` : '',
        styles.paddingBottom ? `padding-bottom: ${formatted(styles.paddingBottom)}${suffix}` : '',
        styles.paddingLeft ? `padding-left: ${formatted(styles.paddingLeft)}${suffix}` : '',
        styles.paddingRight ? `padding-right: ${formatted(styles.paddingRight)}${suffix}` : '',
        styles.marginTop ? `margin-top: ${formatted(styles.marginTop)}${suffix}` : '',
        styles.marginBottom ? `margin-bottom: ${formatted(styles.marginBottom)}${suffix}` : '',
        styles.marginLeft ? `margin-left: ${formatted(styles.marginLeft)}${suffix}` : '',
        styles.marginRight ? `margin-right: ${formatted(styles.marginRight)}${suffix}` : '',
        styles.width ? `width: ${formatted(styles.width)}${suffix}` : '',
        styles.height ? `height: ${formatted(styles.height)}${suffix}` : '',
      ].filter(Boolean).join('; ');
    };

    let overridesCSS = '';
    let mobileRules: string[] = [];
    let tabletRules: string[] = [];

    sections.forEach(section => {
      if (section.mobileOverrides) {
        const cssStr = buildCSSPropertiesString(section.mobileOverrides, true);
        if (cssStr) mobileRules.push(`#section-${section.id} { ${cssStr} }`);
      }
      if (section.tabletOverrides) {
        const cssStr = buildCSSPropertiesString(section.tabletOverrides, true);
        if (cssStr) tabletRules.push(`#section-${section.id} { ${cssStr} }`);
      }

      section.columns.forEach(col => {
        col.elements.forEach(el => {
          if (el.stylesMobile) {
            const cssStr = buildCSSPropertiesString(el.stylesMobile, true);
            if (cssStr) mobileRules.push(`#element-${el.id} { ${cssStr} }`);
          }
          if (el.stylesTablet) {
            const cssStr = buildCSSPropertiesString(el.stylesTablet, true);
            if (cssStr) tabletRules.push(`#element-${el.id} { ${cssStr} }`);
          }

          if (el.overlays && el.overlays.length > 0) {
            el.overlays.forEach(item => {
              if (item.stylesMobile) {
                const cssStr = buildCSSPropertiesString(item.stylesMobile, true);
                if (cssStr) mobileRules.push(`#overlay-${item.id} { ${cssStr} }`);
              }
              if (item.stylesTablet) {
                const cssStr = buildCSSPropertiesString(item.stylesTablet, true);
                if (cssStr) tabletRules.push(`#overlay-${item.id} { ${cssStr} }`);
              }
            });
          }
        });
      });
    });

    if (mobileRules.length > 0) {
      overridesCSS += `\n    @media (max-width: 767px) {\n      ${mobileRules.join('\n      ')}\n    }`;
    }
    if (tabletRules.length > 0) {
      overridesCSS += `\n    @media (min-width: 768px) and (max-width: 1023px) {\n      ${tabletRules.join('\n      ')}\n    }`;
    }

    const fontImport = 
      '@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Fira+Code:wght@300..700&family=Space+Grotesk:wght@300..700&display=swap");\n' +
      (theme.fontFamily === 'serif' ? '@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap");' :
       theme.fontFamily === 'mono' ? '@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Inter:wght@400;500;600&display=swap");' :
       theme.fontFamily === 'display' ? '@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800&family=Inter:wght@400;500;600&display=swap");' :
       '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");');

    const fontClass = 
      theme.fontFamily === 'serif' ? 'font-serif' :
      theme.fontFamily === 'mono' ? 'font-mono' :
      theme.fontFamily === 'display' ? 'font-display' :
      'font-sans';

    let sectionHTML = '';

    sections.forEach(section => {
      let colHTML = '';
      section.columns.forEach(col => {
        let elHTML = '';
        col.elements.forEach(el => {
          const s = el.styles;
          // map custom properties to style string
          const inlineStyles = [
            s.fontSize ? `font-size: ${formatStyleVal(s.fontSize)}` : '',
            s.fontWeight ? `font-weight: ${s.fontWeight}` : '',
            s.fontStyle === 'italic' ? 'font-style: italic' : '',
            s.textDecoration === 'underline' ? 'text-decoration: underline' : '',
            s.textAlign ? `text-align: ${s.textAlign}` : '',
            s.lineHeight ? `line-height: ${s.lineHeight}` : '',
            s.letterSpacing ? `letter-spacing: ${formatStyleVal(s.letterSpacing)}` : '',
            s.wordSpacing ? `word-spacing: ${formatStyleVal(s.wordSpacing)}` : '',
            s.color ? `color: ${s.color}` : '',
            s.backgroundColor ? `background-color: ${s.backgroundColor}` : '',
            s.borderRadius ? `border-radius: ${formatStyleVal(s.borderRadius)}` : '',
            s.paddingTop ? `padding-top: ${formatStyleVal(s.paddingTop)}` : '',
            s.paddingBottom ? `padding-bottom: ${formatStyleVal(s.paddingBottom)}` : '',
            s.paddingLeft ? `padding-left: ${formatStyleVal(s.paddingLeft)}` : '',
            s.paddingRight ? `padding-right: ${formatStyleVal(s.paddingRight)}` : '',
            s.marginTop ? `margin-top: ${formatStyleVal(s.marginTop)}` : '',
            s.marginBottom ? `margin-bottom: ${formatStyleVal(s.marginBottom)}` : '',
          ].filter(Boolean).join('; ');

          const elementVisibilityClasses = [
            el.visibleOnDesktop === false ? 'hide-on-desktop' : '',
            el.visibleOnTablet === false ? 'hide-on-tablet' : '',
            el.visibleOnMobile === false ? 'hide-on-mobile' : ''
          ].filter(Boolean).join(' ');

          if (el.type === 'text') {
            // Find sibling image in a different column of the same section (ignore for footer)
            const isFooterSection = section.id.toLowerCase().includes('foot') || 
                                    (section.name && section.name.toLowerCase().includes('foot'));
            const siblingImage = isFooterSection ? null : section.columns
              .filter(c => c.id !== col.id)
              .flatMap(c => c.elements)
              .find(e => e.type === 'image');
            const siblingImageId = siblingImage?.id;
            
            const isCollapsible = el.enableReadMore || !!siblingImageId;
            const limit = parseInt(el.readMoreHeight || '200');

            let fadeColor = section.backgroundColor;
            if (!fadeColor || fadeColor === 'transparent' || fadeColor === 'bg-transparent') {
              fadeColor = theme.background || '#ffffff';
            }

            if (isCollapsible) {
              const siblingAttr = siblingImageId ? ` data-sibling-img="${siblingImageId}"` : '';
              elHTML += `
                <div class="collapsible-text-wrapper flex flex-col w-full" data-text-id="${el.id}" id="element-${el.id}">
                  <div id="readmore-container-${el.id}" data-limit="${limit}"${siblingAttr} style="max-height: none; overflow: visible; position: relative; transition: max-height 0.25s ease-out;">
                    <div class="element-text ${elementVisibilityClasses}" style="${inlineStyles}; border-width: ${s.borderWidth || '0px'}; border-color: ${s.borderColor || 'transparent'};">
                      ${el.content.replace(/\n/g, '<br />')}
                    </div>
                    <div id="readmore-fade-${el.id}" class="absolute bottom-0 left-0 right-0 h-14 pointer-events-none z-10" style="background: linear-gradient(to bottom, transparent, ${fadeColor}); display: none;"></div>
                  </div>
                  <div id="readmore-btn-container-${el.id}" class="mt-2.5 flex justify-start z-15" style="display: none;">
                    <button id="readmore-btn-${el.id}" class="px-3 py-1.5 text-xs font-semibold rounded-md border flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow transition-all duration-200 active:scale-95" style="color: ${theme.primary}; border-color: ${theme.primary}33; background-color: transparent;" onclick="toggleReadMore('${el.id}')">
                      <span>Læs mere</span>
                      <span class="indicator select-none">▼</span>
                    </button>
                  </div>
                </div>`;
            } else {
              elHTML += `
                <div class="element-text ${elementVisibilityClasses}" id="element-${el.id}" style="${inlineStyles}; border-width: ${s.borderWidth || '0px'}; border-color: ${s.borderColor || 'transparent'};">
                  ${el.content.replace(/\n/g, '<br />')}
                </div>`;
            }
          } else if (el.type === 'button') {
            elHTML += `
              <div class="${elementVisibilityClasses}" style="text-align: ${s.textAlign || 'left'}; margin-top: ${formatStyleVal(s.marginTop) || '12px'}; margin-bottom: ${formatStyleVal(s.marginBottom) || '12px'};">
                <a id="element-${el.id}" href="${el.link || '#'}" class="inline-block transition-transform active:scale-95 duration-100 font-medium no-underline" style="background-color: ${s.backgroundColor || theme.primary}; color: ${s.color || '#ffffff'}; padding: ${formatStyleVal(s.paddingTop) || '0.66em'} ${formatStyleVal(s.paddingRight) || '1.46em'} ${formatStyleVal(s.paddingBottom) || '0.66em'} ${formatStyleVal(s.paddingLeft) || '1.46em'}; border-radius: ${formatStyleVal(s.borderRadius) || '6px'}; font-size: ${formatStyleVal(s.fontSize) || '15px'}; font-weight: ${s.fontWeight || '500'}; word-spacing: ${formatStyleVal(s.wordSpacing) || '0px'}; letter-spacing: ${formatStyleVal(s.letterSpacing) || '0px'}; width: ${formatStyleVal(s.width) || 'auto'}; height: ${formatStyleVal(s.height) || 'auto'};">
                  ${el.content}
                </a>
              </div>`;
          } else if (el.type === 'image') {
            if (el.id.startsWith('locksmith-quick-img')) {
              let svgContent = '';
              if (el.id.includes('img2')) {
                svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2" style="width: 1em; height: 1em;"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 18h12"/><path d="M6 14h12"/><path d="M6 10h12"/><path d="M6 6h12"/><path d="M3 22h18"/></svg>`;
              } else if (el.id.includes('img3')) {
                svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-landmark" style="width: 1em; height: 1em;"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><path d="m12 2-8 6h16Z"/><path d="M5 22v-4h14v4Z"/></svg>`;
              } else if (el.id.includes('img4')) {
                svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check" style="width: 1em; height: 1em;"><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1Z"/><path d="m9 12 2 2 4-4"/></svg>`;
              } else {
                svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home" style="width: 1em; height: 1em;"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
              }

              const iconSize = s.fontSize || '24px';
              const sizeNum = parseInt(iconSize) || 24;
              const containerWidth = s.width || `${Math.round(sizeNum * 2.3)}px`;
              const containerHeight = s.height || `${Math.round(sizeNum * 2.3)}px`;

              elHTML += `
                <div id="element-${el.id}" class="flex items-center justify-center mx-auto mb-2 shadow-lg transition-all duration-200 hover:scale-110 ${elementVisibilityClasses}" style="width: ${containerWidth}; height: ${containerHeight}; font-size: ${iconSize}; color: ${s.color || '#f59e0b'}; background-color: ${s.backgroundColor || '#0f172a'}; border-color: ${s.borderColor || '#334155'}; border-width: ${s.borderWidth || '1px'}; border-style: solid; border-radius: ${s.borderRadius || '9999px'};">
                  ${svgContent}
                </div>`;
            } else {
              const heightVal = formatStyleVal(s.height);
              const minHeightVal = heightVal ? '' : 'min-height: 220px;';
              elHTML += `
                <div id="element-${el.id}" class="overflow-hidden ${elementVisibilityClasses}" style="margin-top: ${formatStyleVal(s.marginTop) || '0px'}; margin-bottom: ${formatStyleVal(s.marginBottom) || '0px'}; width: ${formatStyleVal(s.width) || '100%'}; height: ${heightVal || 'auto'}; ${minHeightVal}">
                  <img src="${el.src || ''}" alt="${el.alt || 'Visual'}" class="${s.width === 'auto' ? 'w-auto' : 'w-full'} h-full ${s.width === 'auto' ? 'object-contain' : 'object-cover'}" style="border-radius: ${formatStyleVal(s.borderRadius) || '8px'}; border-width: ${formatStyleVal(s.borderWidth) || '0px'}; border-color: ${s.borderColor || 'transparent'};" />
                </div>`;
            }
          } else if (el.type === 'divider') {
            elHTML += `
              <hr id="element-${el.id}" class="${elementVisibilityClasses}" style="border: 0; border-top: 1px solid ${s.borderColor || '#cbd5e1'}; margin-top: ${formatStyleVal(s.marginTop) || '16px'}; margin-bottom: ${formatStyleVal(s.marginBottom) || '16px'};" />`;
          } else if (el.type === 'spacer') {
            elHTML += `
              <div id="element-${el.id}" class="${elementVisibilityClasses}" style="height: ${formatStyleVal(s.fontSize) || '32px'};"></div>`;
          } else if (el.type === 'webshop') {
            const settings = el.settings || {};
            const logoBadge = settings.logoBadge || 'MM';
            const logoText = settings.logoText || 'MM LÅSESMED';
            const tagline = settings.tagline || 'Døgnvagt i Storkøbenhavn';
            const searchPlaceholder = settings.searchPlaceholder || 'Søg efter produkt, underkategori eller mærke...';

            elHTML += `
              <div id="element-${el.id}" class="webshop-store-root ${elementVisibilityClasses}" style="margin-top: ${formatStyleVal(s.marginTop) || '0px'}; margin-bottom: ${formatStyleVal(s.marginBottom) || '0px'}; padding-top: ${formatStyleVal(s.paddingTop) || '0px'}; padding-bottom: ${formatStyleVal(s.paddingBottom) || '0px'}; padding-left: ${formatStyleVal(s.paddingLeft) || '0px'}; padding-right: ${formatStyleVal(s.paddingRight) || '0px'}; background-color: ${s.backgroundColor || 'transparent'}; border-radius: ${s.borderRadius || '0px'};">
                <!-- Shop Container -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
                  
                  <!-- Breadcrumbs -->
                  <nav class="flex flex-wrap text-xs font-semibold text-slate-505 mb-8 items-center gap-2" aria-label="Breadcrumb">
                    <a href="#shop" class="hover:text-indigo-650 transition-colors no-underline">Webshop</a>
                    <span class="text-slate-350" id="breadcrumb-sep-1" style="display:none;">/</span>
                    <span id="breadcrumb-cat" class="hover:text-indigo-650 transition-colors cursor-pointer" style="display:none;"></span>
                    <span class="text-slate-350" id="breadcrumb-sep-2" style="display:none;">/</span>
                    <span id="breadcrumb-subcat" class="hover:text-indigo-650 transition-colors cursor-pointer" style="display:none;"></span>
                    <span class="text-slate-350" id="breadcrumb-sep-3" style="display:none;">/</span>
                    <span id="breadcrumb-brand" class="text-slate-800 font-bold" style="display:none;"></span>
                  </nav>

                  <!-- Cart Button Float Header -->
                  <div class="flex flex-col md:flex-row justify-between md:items-center pb-5 mb-8 gap-4 border-b border-slate-150 relative z-30">
                    <div class="flex items-center gap-3 cursor-pointer select-none" onclick="navigateToHash('shop')">
                       ${(() => {
                         const logoFontSize = settings.logoFontSize ? Number(settings.logoFontSize) : 18;
                         const ratio = logoFontSize / 18;
                         return `
                           <div class="rounded-full border border-amber-400 flex items-center justify-center text-slate-800 font-black font-mono bg-white shadow-sm shrink-0" style="width: ${48 * ratio}px; height: ${48 * ratio}px;">
                             <span class="text-amber-455 font-extrabold" style="font-size: ${14 * ratio}px;">${logoBadge}</span>
                           </div>
                           <div class="text-left">
                             <h2 class="font-black tracking-tighter text-slate-900 leading-none uppercase" style="font-size: ${logoFontSize}px;">${logoText}</h2>
                             <span class="text-slate-400 font-bold tracking-widest uppercase block" style="font-size: ${8 * ratio}px; margin-top: ${4 * ratio}px;">${tagline}</span>
                           </div>
                         `;
                       })()}
                    </div>
                    
                    <!-- Search Bar Container -->
                    <div class="search-container-root relative flex-grow max-w-md w-full relative z-20">
                      <div class="relative">
                        <input
                          type="text"
                          id="shop-search-input"
                          placeholder="${searchPlaceholder}"
                          class="w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-indigo-650 transition-colors"
                        />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <button
                          id="shop-search-clear"
                          style="display: none;"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                        >
                          ✕
                        </button>
                      </div>
                      <div id="shop-search-suggestions" style="display: none;" class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-150 rounded-2xl shadow-xl overflow-hidden z-50"></div>
                    </div>

                    <div class="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
                      <div id="shop-user-status-container" class="flex items-center gap-2 flex-wrap">
                        <!-- Dynamic user status will be rendered here by JS -->
                      </div>
                      <button onclick="navigateToHash('shop/cart')" class="relative inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md select-none border-none cursor-pointer">
                        <span>🛒 Kurv</span>
                        <span id="cart-count-badge" class="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">0</span>
                      </button>
                    </div>
                  </div>

                  <!-- View: Search Results -->
                  <div id="shop-view-search-results" class="shop-view" style="display:none;">
                    <div class="flex items-center gap-1.5 text-xs font-bold text-indigo-605 cursor-pointer hover:text-indigo-850 transition-colors mb-6 select-none" onclick="navigateToHash('shop')">
                      <span>← Tilbage til shop</span>
                    </div>

                    <div class="mb-6">
                      <h3 class="text-xl font-extrabold text-slate-900 tracking-tight" id="search-results-query-title"></h3>
                      <p class="text-xs text-slate-500 mt-1" id="search-results-count-label"></p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="search-results-grid">
                      <!-- Results rendered dynamically -->
                    </div>
                  </div>

                  <!-- View: Categories (Default) -->
                  <div id="shop-view-categories" class="shop-view">
                    <div id="shop-categories-grid" class="flex flex-col gap-8">
                      <!-- Dynamic categories rendered here -->
                    </div>
                  </div>

                  <!-- View: Subcategories -->
                  <div id="shop-view-subcategories" class="shop-view" style="display:none;">
                    <div class="flex items-center gap-1.5 text-xs font-bold text-indigo-650 cursor-pointer hover:text-indigo-850 transition-colors mb-6 select-none" onclick="navigateToHash('shop')">
                      <span>← Tilbage til kategorier</span>
                    </div>
                    <div id="shop-subcategories-grid" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <!-- Dynamic subcategories rendered here -->
                    </div>
                  </div>

                  <!-- View: Subcategory Detail (Explanation + Brand Links) -->
                  <div id="shop-view-subcategory-detail" class="shop-view" style="display:none;">
                    <div class="flex items-center gap-1.5 text-xs font-bold text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors mb-6 select-none" id="subcat-back-btn">
                      <span>← Tilbage</span>
                    </div>

                    <div class="bg-white rounded-3xl border border-slate-150 p-4 sm:p-6 md:p-8 shadow-xs mb-8">
                      <h3 class="text-2xl font-extrabold text-slate-900 tracking-tight mb-4" id="detail-subcat-title"></h3>
                      <p class="text-slate-600 text-sm leading-relaxed mb-6" id="detail-subcat-desc"></p>
                      
                      <!-- Standard brand selection -->
                      <div class="border-t border-slate-100 pt-6" id="detail-brands-block">
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Vælg et mærke/producent for at se produkter:</div>
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4" id="detail-brands-container">
                          <!-- Dynamic brand button cards will go here -->
                        </div>
                      </div>

                      <!-- Direct Products Grid (Category X) -->
                      <div class="border-t border-slate-100 pt-6" id="detail-direct-products-block" style="display:none;">
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Produkter i denne kategori:</div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="detail-direct-products-grid">
                          <!-- Direct products rendered here dynamically -->
                        </div>
                      </div>

                      <!-- Direct Recommendations (Category X) -->
                      <div class="border-t border-slate-100 pt-6 mt-6" id="detail-recommendations-block" style="display:none;">
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Andre underkategorier:</div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="detail-recommendations-grid">
                          <!-- Recommendation cards rendered here dynamically -->
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- View: Brand Products Grid -->
                  <div id="shop-view-brand-products" class="shop-view" style="display:none;">
                    <div class="flex items-center gap-1.5 text-xs font-bold text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors mb-6 select-none" id="brand-back-btn">
                      <span>← Tilbage</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="brand-products-grid">
                      <!-- Products will be dynamically loaded here by JS -->
                    </div>
                  </div>

                  <!-- View: Product Detail Page -->
                  <div id="shop-view-product-detail" class="shop-view" style="display:none;">
                    <div class="flex items-center gap-1.5 text-xs font-bold text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors mb-6 select-none" id="product-detail-back-btn">
                      <span>← Tilbage</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100" id="product-detail-container">
                      <!-- Product Details will be dynamically loaded here by JS -->
                    </div>
                  </div>

                  <!-- View: Cart Page -->
                  <div id="shop-view-cart" class="shop-view" style="display:none;">
                    <div class="flex items-center gap-1.5 text-xs font-bold text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors mb-6 select-none" onclick="navigateToHash('shop')">
                      <span>← Fortsæt indkøb</span>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <!-- Cart Items list -->
                      <div class="lg:col-span-2 space-y-4" id="cart-page-items-container">
                        <!-- Dynamic Cart items will go here -->
                      </div>

                      <!-- Order summary card -->
                      <div class="p-6 bg-slate-50 border border-slate-100 rounded-3xl h-fit space-y-6" id="cart-page-summary-container">
                        <h4 class="text-sm font-extrabold text-slate-900 tracking-tight pb-3 border-b border-slate-200 uppercase">Ordreoversigt</h4>
                        <div class="space-y-3 text-xs">
                          <div class="flex justify-between text-slate-500 font-semibold">
                            <span>Antal varer:</span>
                            <span class="text-slate-800 font-bold" id="cart-page-items-count">0</span>
                          </div>
                          <div class="flex justify-between text-slate-500 font-semibold">
                            <span>Subtotal (excl. moms):</span>
                            <span class="text-slate-800 font-bold font-mono" id="cart-page-subtotal-excl">0,00 DKK</span>
                          </div>
                          <div class="flex justify-between text-slate-500 font-semibold">
                            <span>Moms (25%):</span>
                            <span class="text-slate-800 font-bold font-mono" id="cart-page-moms">0,00 DKK</span>
                          </div>
                          <div class="flex justify-between text-slate-500 font-semibold">
                            <span>Levering:</span>
                            <span class="text-emerald-600 font-bold uppercase">Gratis</span>
                          </div>
                          <div class="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900">
                            <span>Total (inkl. moms):</span>
                            <span class="text-sm font-black text-indigo-650" id="cart-page-total-price">0,00 DKK</span>
                          </div>
                        </div>
                        <button onclick="navigateToHash('shop/checkout')" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md cursor-pointer border-none flex items-center justify-center">
                          Fortsæt til kassen
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- View: Checkout Page -->
                  <div id="shop-view-checkout" class="shop-view" style="display:none;">
                  <div id="shop-view-checkout" class="shop-view">
                    <div class="flex items-center gap-1.5 text-xs font-bold text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors mb-6 select-none" onclick="navigateToHash('shop/cart')">
                      <span>← Tilbage til kurv</span>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <!-- Checkout Form -->
                      <div class="lg:col-span-2 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                        <form id="checkout-page-form" onsubmit="submitCheckoutPageForm(event)" class="space-y-4">
                          <h4 class="text-sm font-extrabold text-slate-900 tracking-tight pb-2 border-b border-slate-200">Leveringsoplysninger</h4>
                          
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                              <label class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fulde Navn</label>
                              <input type="text" id="checkout-page-name" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900" placeholder="F.eks. Anders Jensen" required />
                            </div>

                            <div class="space-y-1.5">
                              <label class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">E-mail Adresse</label>
                              <input type="email" id="checkout-page-email" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50" placeholder="F.eks. anders@jensen.dk" required />
                            </div>
                          </div>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                              <label class="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Telefonnummer</label>
                              <input type="tel" id="checkout-page-phone" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900" placeholder="F.eks. +45 12 34 56 78" required />
                            </div>

                            <div class="space-y-1.5">
                              <label id="checkout-address-label" class="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Leveringsadresse</label>
                              <textarea id="checkout-page-address" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-sans" placeholder="Gadenavn, husnummer, etage" rows="2" required></textarea>
                            </div>
                          </div>

                          <div id="checkout-postcode-city-group" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                              <label class="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Postnummer</label>
                              <input type="text" id="checkout-page-postcode" oninput="handlePostcodeChange()" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900" placeholder="F.eks. 2100" required />
                            </div>

                            <div class="space-y-1.5">
                              <label class="text-[10px] text-slate-550 font-bold uppercase tracking-wider">By</label>
                              <input type="text" id="checkout-page-city" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900" placeholder="F.eks. København Ø" required />
                            </div>
                          </div>

                          <!-- Shipmondo Carrier Selection -->
                          <div class="space-y-2.5 pt-2">
                            <label class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Vælg Transportør (Forsendelse)</label>
                            <div class="grid grid-cols-2 gap-4">
                              <button type="button" id="carrier-btn-gls" onclick="selectCarrier('gls')" class="flex flex-col items-center justify-center py-3.5 px-4 rounded-xl border border-slate-200 text-xs font-bold transition-all duration-300 cursor-pointer bg-white text-slate-700 hover:border-slate-400 animate-none">
                                <span class="text-xl mb-1">📦</span>
                                <span>GLS Pakkeshop/Privat</span>
                              </button>

                              <button type="button" id="carrier-btn-postnord" onclick="selectCarrier('postnord')" class="flex flex-col items-center justify-center py-3.5 px-4 rounded-xl border border-slate-200 text-xs font-bold transition-all duration-300 cursor-pointer bg-white text-slate-700 hover:border-slate-400 animate-none">
                                <span class="text-xl mb-1">✉️</span>
                                <span>PostNord Pakkeshop/Hjem</span>
                              </button>
                            </div>
                          </div>

                          <!-- Shipmondo Delivery Options -->
                          <div id="shipmondo-options-container" class="space-y-4 pt-2 border-t border-slate-200" style="display:none;">
                            <div class="flex items-center justify-between">
                              <h5 class="text-[10.5px] font-extrabold uppercase text-slate-800 tracking-wide">Leveringsmuligheder</h5>
                              <span id="shipmondo-loading-indicator" class="text-[10px] text-indigo-650 font-bold" style="display:none;">Henter fra Shipmondo...</span>
                            </div>
                            <div id="shipmondo-error-msg" class="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-medium" style="display:none;"></div>
                            <div id="shipmondo-options-list" class="space-y-3">
                              <!-- Radios will be generated dynamically here -->
                            </div>
                          </div>

                          <div class="pt-4">
                            <button type="submit" class="w-full py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer border-none">
                              Placer Ordre (Gennemfør)
                            </button>
                          </div>
                        </form>
                      </div>

                      <!-- Order items summary side-card -->
                      <div class="p-6 bg-slate-50 border border-slate-100 rounded-3xl h-fit space-y-4">
                        <h4 class="text-sm font-extrabold text-slate-900 tracking-tight pb-3 border-b border-slate-200 uppercase">Din Bestilling</h4>
                        <div id="checkout-page-items-list" class="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs">
                          <!-- Dynamic checkout list of items -->
                        </div>

                        <div class="border-t border-slate-200 pt-4 space-y-2.5 text-xs">
                          <div class="flex justify-between text-slate-500 font-semibold">
                            <span>Subtotal (excl. moms):</span>
                            <span class="text-slate-800 font-bold font-mono" id="checkout-page-subtotal-excl">0,00 DKK</span>
                          </div>
                          <div class="flex justify-between text-slate-500 font-semibold">
                            <span>Moms (25%):</span>
                            <span class="text-slate-800 font-bold font-mono" id="checkout-page-moms">0,00 DKK</span>
                          </div>
                          <div class="flex justify-between text-slate-500 font-semibold">
                            <span>Levering:</span>
                            <span class="text-emerald-600 font-bold uppercase">Gratis</span>
                          </div>
                          <div class="border-t border-slate-200 pt-2.5 flex justify-between font-black text-slate-900">
                            <span>Total (inkl. moms):</span>
                            <span class="text-indigo-650 font-mono" id="checkout-page-total">0,00 DKK</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- View: Login Page -->
                  <div id="shop-view-login" class="shop-view" style="display:none;">
                    <div class="max-w-md mx-auto p-6 bg-slate-50 border border-slate-100 rounded-3xl text-left space-y-6">
                      <div class="text-center">
                        <div class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-3 text-xl">🔒</div>
                        <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">Log ind på din konto</h3>
                        <p class="text-xs text-slate-505 mt-2">Log ind for at hente dine gemte leveringsoplysninger.</p>
                      </div>
                      <div id="login-error-msg" class="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold leading-relaxed" style="display:none;"></div>
                      <form id="login-page-form" onsubmit="submitLoginForm(event)" class="space-y-4">
                        <div class="space-y-1.5">
                          <label class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">E-mail Adresse</label>
                          <input type="email" id="login-page-email" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900" placeholder="F.eks. anders@jensen.dk" required />
                        </div>
                        <div class="space-y-1.5">
                          <label class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Adgangskode</label>
                          <input type="password" id="login-page-password" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900" placeholder="Indtast din adgangskode" required />
                        </div>
                        <button type="submit" class="w-full py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer border-none">
                          Log ind
                        </button>
                      </form>
                      <div class="border-t border-slate-200 pt-4 text-center">
                        <p class="text-[11px] text-slate-500 font-medium">
                          Har du ikke en konto endnu?<br />
                          En konto oprettes <strong>automatisk</strong>, når du udfører dit første køb.
                        </p>
                        <button onclick="navigateToHash('shop')" class="mt-3 text-xs text-indigo-650 hover:underline font-bold bg-transparent border-none cursor-pointer">
                          Tilbage til butikken
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- View: Reset Password Page -->
                  <div id="shop-view-reset-password" class="shop-view" style="display:none;">
                    <div class="max-w-md mx-auto p-6 bg-slate-50 border border-slate-100 rounded-3xl text-left space-y-6">
                      <div class="text-center">
                        <div class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-3 text-xl">🔑</div>
                        <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">Nulstil Adgangskode</h3>
                        <p class="text-xs text-slate-505 mt-2">Vælg en ny adgangskode til din konto.</p>
                      </div>
                      <div id="reset-error-msg" class="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold leading-relaxed" style="display:none;"></div>
                      <div id="reset-success-container" class="space-y-4 text-center" style="display:none;">
                        <div class="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs font-semibold leading-relaxed">
                          ✓ Din adgangskode er blevet nulstillet! Du kan nu logge ind.
                        </div>
                        <button onclick="navigateToHash('shop/login')" class="w-full py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer border-none">
                          Gå til login
                        </button>
                      </div>
                      <form id="reset-password-page-form" onsubmit="submitResetPasswordForm(event)" class="space-y-4">
                        <div class="space-y-1.5">
                          <label class="text-[10px] text-slate-505 font-bold uppercase tracking-wider">E-mail Adresse</label>
                          <input type="email" id="reset-page-email" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900" placeholder="F.eks. anders@jensen.dk" required />
                        </div>
                        <div class="space-y-1.5">
                          <label class="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Ny Adgangskode</label>
                          <input type="password" id="reset-page-password" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900" placeholder="Mindst 6 tegn" required />
                        </div>
                        <div class="space-y-1.5">
                          <label class="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Bekræft Ny Adgangskode</label>
                          <input type="password" id="reset-page-confirm-password" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-250 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900" placeholder="Gentag ny adgangskode" required />
                        </div>
                        <button type="submit" class="w-full py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer border-none">
                          Gem ny adgangskode
                        </button>
                      </form>
                      <div class="border-t border-slate-200 pt-4 text-center">
                        <button onclick="navigateToHash('shop')" class="text-xs text-slate-500 hover:text-slate-700 font-bold bg-transparent border-none cursor-pointer">
                          Annuller og gå tilbage
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- View: Profile Page -->
                  <div id="shop-view-profile" class="shop-view space-y-6" style="display:none; text-align: left;">
                    <div class="flex items-center gap-1.5 text-xs font-bold text-indigo-650 cursor-pointer hover:text-indigo-755 transition-colors mb-6 select-none" onclick="navigateToHash('shop')">
                      <span>←</span>
                      <span>Tilbage til shop</span>
                    </div>

                    <div class="border-b border-slate-200 pb-5">
                      <h3 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span>👤</span> Min Profil & Ordrehistorik
                      </h3>
                      <p class="text-xs text-slate-505 mt-1">Se dine profiloplysninger og følg dine ordrer her.</p>
                    </div>
                    
                    <div class="grid md:grid-cols-3 gap-6">
                      <!-- Left Column: Profile Info -->
                      <div class="md:col-span-1 space-y-4">
                        <div class="bg-slate-50 border border-slate-150 p-5 rounded-3xl space-y-4">
                          <h4 class="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                            👤 Kontooplysninger
                          </h4>
                          <div class="space-y-3 text-xs" id="profile-info-container">
                            <!-- Populated dynamically -->
                          </div>
                        </div>
                      </div>
                      
                      <!-- Right Column: Orders list -->
                      <div class="md:col-span-2 space-y-4">
                        <div class="bg-slate-50 border border-slate-150 p-5 rounded-3xl space-y-4">
                          <h4 class="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                            📦 Dine Bestillinger
                          </h4>
                          <div class="space-y-4" id="profile-orders-list-container">
                            <!-- Populated dynamically -->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- View: Admin Dashboard Page -->
                  <div id="shop-view-admin" class="shop-view space-y-6" style="display:none; text-align: left;">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                      <div>
                        <h3 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                          <span>🔑</span> Admin Kontrolpanel
                        </h3>
                        <p class="text-xs text-slate-505 mt-1">Administrer og hold styr på indkomne ordrer og leveringer.</p>
                      </div>
                      <div class="flex items-center gap-2.5">
                        <button onclick="generateMockOrders()" class="px-3.5 py-2 bg-indigo-650 hover:bg-indigo-755 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none shadow-md shadow-indigo-600/15">
                          Generer Testordrer
                        </button>
                        <button onclick="navigateToHash('shop')" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-200 flex items-center gap-1.5">
                          <span>←</span> Butik
                        </button>
                      </div>
                    </div>

                    <!-- KPI Stats Grid -->
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div class="bg-white border border-slate-150 p-4 rounded-2xl relative overflow-hidden shadow-xs">
                        <span class="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Omsætning</span>
                        <p id="kpi-revenue" class="text-xl font-mono font-black text-indigo-650 mt-1.5">0,00 DKK</p>
                      </div>
                      <div class="bg-white border border-slate-150 p-4 rounded-2xl relative overflow-hidden shadow-xs">
                        <span class="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Samlet Antal Ordrer</span>
                        <p id="kpi-total-count" class="text-xl font-mono font-black text-slate-900 mt-1.5">0 stk</p>
                      </div>
                      <div class="bg-white border border-slate-150 p-4 rounded-2xl relative overflow-hidden shadow-xs">
                        <span class="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Nye Ordrer</span>
                        <p id="kpi-new-count" class="text-xl font-mono font-black text-indigo-650 mt-1.5">0 stk</p>
                      </div>
                      <div class="bg-white border border-slate-150 p-4 rounded-2xl relative overflow-hidden shadow-xs">
                        <span class="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Under Behandling</span>
                        <p id="kpi-processing-count" class="text-xl font-mono font-black text-emerald-600 mt-1.5">0 stk</p>
                      </div>
                    </div>

                    <!-- Admin Tab Navigation -->
                    <div class="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit mb-4">
                      <button id="admin-tab-orders-btn" onclick="switchAdminTab('orders')" class="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border-none transition-all cursor-pointer bg-amber-400 text-slate-900 shadow-sm">
                        Ordrer
                      </button>
                      <button id="admin-tab-inventory-btn" onclick="switchAdminTab('inventory')" class="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border-none transition-all cursor-pointer bg-transparent text-slate-505 hover:text-slate-900">
                        Lagerstyring
                      </button>
                    </div>

                    <!-- Tab: Orders Content -->
                    <div id="admin-orders-tab-content" class="space-y-6">
                      <!-- Filters Navigation -->
                      <div id="admin-filters-bar" class="flex items-center gap-2 overflow-x-auto pb-1.5 border-b border-slate-150">
                        <!-- generated dynamically -->
                      </div>

                      <!-- Orders Cards Grid -->
                      <div id="admin-orders-list-container" class="space-y-3">
                        <!-- generated dynamically -->
                      </div>
                    </div>

                    <!-- Tab: Inventory Content -->
                    <div id="admin-inventory-tab-content" class="space-y-6" style="display:none;">
                      <!-- Inventory Filter/Search Header -->
                      <div class="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-50 p-4 border border-slate-150 rounded-2xl">
                        <div class="relative flex-grow max-w-md">
                          <span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                          <input
                            type="text"
                            id="admin-inventory-search-input"
                            placeholder="Søg efter produkt, underkategori eller mærke..."
                            oninput="onInventorySearchInput(event)"
                            class="w-full bg-white border border-slate-200 pl-9 pr-8 py-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-semibold"
                          />
                          <button
                            id="admin-inventory-search-clear"
                            onclick="clearInventorySearch()"
                            class="absolute right-3 top-2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-350 text-slate-500 flex items-center justify-center text-[10px] font-bold border-none cursor-pointer"
                            style="display:none;"
                          >
                            ✕
                          </button>
                        </div>
                        <div id="admin-inventory-count" class="text-right text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                          Viser 0 af 0 varer
                        </div>
                      </div>

                      <!-- Inventory Table -->
                      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                        <div class="overflow-x-auto">
                          <table class="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[9px] font-black tracking-wider">
                                <th class="p-4" style="padding: 16px;">Vare / Model</th>
                                <th class="p-4" style="padding: 16px;">Underkategori</th>
                                <th class="p-4" style="padding: 16px;">Pris</th>
                                <th class="p-4" style="padding: 16px;">Status</th>
                                <th class="p-4 text-center w-40" style="padding: 16px; text-align: center; width: 160px;">Lagerbeholdning</th>
                              </tr>
                            </thead>
                            <tbody id="admin-inventory-table-body" class="divide-y divide-slate-100">
                              <!-- generated dynamically -->
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <!-- Checkout Success Popup -->
                <div id="checkout-success-popup" class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-955/60 backdrop-blur-xs opacity-0 pointer-events-none transition-opacity">
                  <div class="bg-white rounded-3xl border border-slate-100 max-w-sm w-full p-8 text-center shadow-2xl flex flex-col items-center">
                    <div class="h-16 w-16 bg-emerald-50 text-emerald-505 rounded-full flex items-center justify-center text-3xl mb-6">✓</div>
                    <h3 class="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Mange tak for din bestilling!</h3>
                    <p class="text-slate-505 text-xs leading-relaxed mb-6">Vi har modtaget din ordre. Låsesmeden vil kontakte dig inden for kort tid angående levering og montering.</p>
                    <button onclick="closeSuccessPopup()" class="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all border-none cursor-pointer">Fortsæt shopping</button>
                  </div>
                </div>

                <!-- Simulated Email Popup -->
                <div id="simulated-email-popup" class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-955/60 backdrop-blur-xs opacity-0 pointer-events-none transition-opacity">
                  <div class="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 max-w-lg w-full overflow-hidden shadow-2xl flex flex-col font-sans text-left max-h-[90vh]">
                    <div class="bg-slate-950 px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-850 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-[10px] text-slate-400 font-bold ml-2 tracking-wide uppercase">Simuleret E-mail Klient</span>
                      </div>
                      <button onclick="closeEmailPopup()" class="text-slate-400 hover:text-white text-xs font-bold bg-transparent border-none cursor-pointer">Luk [X]</button>
                    </div>

                    <div class="p-3 sm:p-4 bg-slate-955/40 border-b border-slate-850 space-y-2 text-xs">
                      <div>
                        <span class="text-slate-505 font-bold uppercase tracking-wider">Fra:</span>
                        <span class="text-amber-400 font-bold ml-2">MM Låseshop &lt;no-reply@mmlaseshop.dk&gt;</span>
                      </div>
                      <div>
                        <span class="text-slate-505 font-bold uppercase tracking-wider">Til:</span>
                        <span class="text-slate-200 font-medium ml-2" id="email-to-field"></span>
                      </div>
                      <div>
                        <span class="text-slate-505 font-bold uppercase tracking-wider">Emne:</span>
                        <span class="text-white font-extrabold ml-2" id="email-subject-field"></span>
                      </div>
                    </div>

                    <div class="p-4 sm:p-5 space-y-4 text-xs leading-relaxed text-slate-305 max-h-[250px] overflow-y-auto font-mono flex-1">
                      <p>Kære kunde,</p>
                      <p>Tak for din bestilling hos <strong>MM Låseshop</strong>.</p>
                      <p>Da du ikke var logget ind, har vi automatisk oprettet en konto til dig for at gøre dine fremtidige bestillinger nemmere.</p>
                      <div class="p-3 bg-slate-955/85 border border-slate-800 rounded-xl space-y-1">
                        <div><strong>Login E-mail:</strong> <span id="email-body-login-email"></span></div>
                        <div><strong>Midlertidig Password:</strong> <span class="text-amber-400 font-bold" id="email-body-temp-pass"></span></div>
                      </div>
                      <p>For at aktivere din konto og vælge din egen adgangskode, skal du klikke på linket herunder:</p>
                      
                      <div class="pt-2 text-center font-sans">
                        <button id="email-reset-link-btn" class="inline-block px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-lg transition-colors cursor-pointer text-center uppercase tracking-wide text-[10.5px] border-none">
                          Nulstil Adgangskode & Log Ind
                        </button>
                      </div>
                    </div>

                    <div class="bg-slate-955/60 px-3 sm:px-4 py-2.5 sm:py-3 border-t border-slate-850 text-[10px] text-slate-505 text-center font-medium">
                      Dette er en simuleret e-mail for at demonstrere flowet. I produktion sendes denne e-mail til kundens indbakke.
                    </div>
                  </div>
                </div>

                <!-- Admin Order Detail Modal -->
                <div id="admin-order-detail-modal" class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-955/65 backdrop-blur-xs opacity-0 pointer-events-none transition-opacity" onclick="closeOrderDetailModal()">
                  <div class="bg-white rounded-3xl border border-slate-100 max-w-2xl w-full p-6 text-left shadow-2xl flex flex-col relative overflow-y-auto max-h-[90vh]" onclick="event.stopPropagation()">
                    <!-- Modal Header -->
                    <div class="flex items-center justify-between border-b border-slate-150 pb-4 mb-4">
                      <div>
                        <span id="modal-order-id" class="font-mono text-sm font-black text-indigo-650">MM-ORD-XXXX</span>
                        <p id="modal-order-date" class="text-[10px] text-slate-400 font-bold tracking-wide mt-0.5">Bestillingsdato: ...</p>
                      </div>
                      <button onclick="closeOrderDetailModal()" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold transition-all border border-slate-200 cursor-pointer">
                        ✕
                      </button>
                    </div>

                    <!-- Modal Content -->
                    <div class="grid md:grid-cols-2 gap-6">
                      <!-- Left Column: Customer & Shipping Details -->
                      <div class="space-y-4">
                        <div class="space-y-1.5">
                          <h4 class="text-[10.5px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                            <span>👤</span> Kundeoplysninger
                          </h4>
                          <div class="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-1 text-xs">
                            <p id="modal-customer-name" class="text-slate-900 font-bold">...</p>
                            <p class="text-slate-650"><span class="text-slate-400">Email:</span> <span id="modal-customer-email">...</span></p>
                            <p class="text-slate-650"><span class="text-slate-400">Tlf:</span> <span id="modal-customer-phone">...</span></p>
                          </div>
                        </div>

                        <div class="space-y-1.5">
                          <h4 class="text-[10.5px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                            <span>🚚</span> Forsendelse & Shipmondo
                          </h4>
                          <div id="modal-shipping-details-box" class="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-1.5 text-xs">
                            <!-- generated dynamically -->
                          </div>
                        </div>

                        <div class="space-y-1.5">
                          <h4 class="text-[10.5px] font-black uppercase text-slate-400 tracking-wider">Ordre Status</h4>
                          <div class="bg-slate-50 border border-slate-150 p-3 rounded-xl flex flex-col gap-2">
                            <div class="flex items-center justify-between">
                              <span id="modal-order-status-badge" class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                                ...
                              </span>
                            </div>
                            <div id="modal-refund-info-box" style="display:none;"></div>
                          </div>
                        </div>
                      </div>

                      <!-- Right Column: Ordered Items & Total -->
                      <div class="space-y-4">
                        <h4 class="text-[10.5px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                          <span>📦</span> Bestilte Varer
                        </h4>
                        <div id="modal-items-container" class="bg-slate-50 border border-slate-150 rounded-2xl overflow-hidden divide-y divide-slate-200 max-h-56 overflow-y-auto">
                          <!-- generated dynamically -->
                        </div>

                        <div class="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-1.5">
                          <div class="flex justify-between text-xs text-slate-400">
                            <span>Subtotal:</span>
                            <span id="modal-order-subtotal">...</span>
                          </div>
                          <div class="flex justify-between text-xs text-slate-400">
                            <span>Forsendelse:</span>
                            <span>0,00 DKK</span>
                          </div>
                          <div class="flex justify-between text-sm font-bold border-t border-slate-200 pt-2 text-slate-900">
                            <span>Total beløb:</span>
                            <span id="modal-order-total" class="text-indigo-650">...</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Actions Block -->
                    <div id="modal-actions-container" class="border-t border-slate-150 pt-4 mt-6 flex justify-end gap-2.5">
                      <!-- generated dynamically -->
                    </div>
                  </div>
                </div>

              </div>`;
          } else if (el.type === 'image-banner') {
            if (el.id === 'locksmith-news-banner') {
              elHTML += `
                <div id="element-${el.id}" class="relative w-full overflow-hidden flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-8 bg-cover bg-center ${elementVisibilityClasses}" style="background-image: url('${el.src || 'https://images.unsplash.com/photo-1516216621174-bfa2196cfc02?auto=format&fit=crop&w=1200&q=80'}'); border-radius: 0px; margin-top: ${formatStyleVal(s.marginTop) || '0px'}; margin-bottom: ${formatStyleVal(s.marginBottom) || '0px'}; min-height: 160px;">
                  <div class="absolute inset-0 bg-[#0f172a] opacity-85 pointer-events-none z-0"></div>
                  <div class="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="flex-1 text-center md:text-left">
                      <h3 class="text-xl md:text-2xl font-extrabold text-white tracking-wide leading-tight">Tilmeld dig vores nyhedsbrev og modtag tilbud</h3>
                      <p class="text-slate-400 text-xs md:text-sm mt-1 font-medium">Få ugentlige sikkerhedstips og eksklusive rabatter direkte i din indbakke.</p>
                    </div>
                    <div class="w-full md:w-auto shrink-0 flex items-center justify-center">
                      <form onsubmit="handleNewsletterSubmit(event)" class="w-full md:w-[480px] flex flex-col sm:flex-row rounded-2xl sm:rounded-full p-2 gap-2 sm:gap-0 sm:p-1 border border-white/20 hover:border-white/30 bg-white/10 backdrop-blur-md transition-all">
                        <input type="email" name="email" placeholder="Indtast din e-mail adresse..." class="bg-transparent px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none w-full sm:flex-1 text-center sm:text-left bg-white/5 sm:bg-transparent rounded-xl sm:rounded-none" required />
                        <button type="submit" class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm px-6 py-2.5 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] rounded-xl sm:rounded-full w-full sm:w-auto">Tilmeld dig</button>
                      </form>
                    </div>
                  </div>
                </div>`;
            } else {
              let overlayItemsHTML = '';
              const sortedOverlays = (el.overlays || []);
              
              if (sortedOverlays.length === 0) {
                if (el.overlayTitle) {
                  overlayItemsHTML += `<h4 class="text-lg md:text-2xl font-extrabold tracking-tight text-white leading-tight">${el.overlayTitle}</h4>`;
                }
                if (el.overlaySubtext) {
                  overlayItemsHTML += `<p class="text-xs md:text-sm text-slate-100 font-medium leading-relaxed opacity-90">${el.overlaySubtext}</p>`;
                }
                if (el.showSearchBox ?? true) {
                  overlayItemsHTML += `
                    <form onsubmit="handleNewsletterSubmit(event)" class="flex items-center gap-1.5 mt-1 w-full max-w-sm mx-auto">
                      <input type="email" name="email" required placeholder="${el.overlaySearchPlaceholder || 'Enter email address...'}" class="flex-1 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-350 focus:outline-none transition-all font-sans" />
                      <button type="submit" class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap border-none">${el.overlaySearchButtonText || 'Subscribe'}</button>
                    </form>`;
                }
                if (el.showButton ?? false) {
                  overlayItemsHTML += `
                    <div class="mt-1">
                      <a href="${el.overlayButtonLink || '#'}" class="inline-block px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-lg active:scale-95 transition-all text-center no-underline">${el.overlayButtonText || 'Learn More'}</a>
                    </div>`;
                }
              }
              
              const logoOverlay = sortedOverlays.find(o => o.type === 'logo');
              const menuOverlay = sortedOverlays.find(o => o.type === 'dropdown-menu');
              
              let headerHTML = '';
              if (logoOverlay || menuOverlay) {
                let logoHTML = '';
                if (logoOverlay) {
                  const ls = logoOverlay.styles || {};
                  const fontSizeVal = parseInt(ls.fontSize || '18') || 18;
                  const ratio = fontSizeVal / 18;
                  if (logoOverlay.src) {
                    logoHTML = `<img src="${logoOverlay.src}" alt="${logoOverlay.content || 'Logo'}" style="height: ${fontSizeVal}px; width: ${ls.width || 'auto'}; border-radius: ${ls.borderRadius || '0px'};" class="max-h-full object-contain" />`;
                  } else if (logoOverlay.content.toUpperCase().includes('MM') && logoOverlay.content.toUpperCase().includes('LÅSESMED')) {
                    logoHTML = `
                      <div class="flex items-center gap-2.5">
                        <div class="rounded-full border-2 border-amber-400 flex items-center justify-center bg-black/30 shrink-0" style="width: ${40 * ratio}px; height: ${40 * ratio}px;">
                          <span class="text-white font-extrabold tracking-tighter" style="font-size: ${13 * ratio}px;">MM</span>
                        </div>
                        <div class="flex flex-col text-left">
                          <span class="font-extrabold tracking-wider leading-none text-slate-100 uppercase" style="font-size: ${fontSizeVal}px;">LÅSESMED</span>
                          <span class="text-amber-400 tracking-wide font-medium leading-normal" style="font-size: ${9 * ratio}px; margin-top: ${2 * ratio}px;">Døgnvagt i Storkøbenhavn</span>
                        </div>
                      </div>`;
                  } else {
                    logoHTML = `<span style="color: ${ls.color || '#ffffff'}; font-size: ${fontSizeVal}px; font-weight: ${ls.fontWeight || '800'};">${logoOverlay.content}</span>`;
                  }
                }

                let menuHTML = '';
                if (menuOverlay) {
                  const ms = menuOverlay.styles || {};
                  const menuItems = (menuOverlay.settings?.menuContentDesktop || menuOverlay.content).split(',').map(m => m.trim()).filter(Boolean);
                  const menuLinks = menuItems.map(item => {
                    const hasDropdown = ['Erhverv', 'Privat', 'Boligforeninger'].includes(item);
                    if (hasDropdown) {
                      const allLinks = menuOverlay.dropdownLinks || [];
                      const filteredLinks = allLinks.filter(l => l.parentItem.toLowerCase() === item.toLowerCase());
                      
                      const groups: Record<string, any[]> = {};
                      filteredLinks.forEach(link => {
                        const g = link.group || 'General';
                        if (!groups[g]) groups[g] = [];
                        groups[g].push(link);
                      });
                      
                      let submenuHTML = '';
                      const groupNames = Object.keys(groups);
                      if (groupNames.length === 0) {
                        submenuHTML = `<div class="text-slate-400 text-xs py-1 italic">No sub-pages added yet.</div>`;
                      } else {
                        groupNames.forEach(gName => {
                          let linksHTML = '';
                          groups[gName].forEach((link, lIdx) => {
                            const linkId = `link-${item.toLowerCase()}-${gName.replace(/\s+/g, '')}-${lIdx}`;
                            linksHTML += `
                              <style>
                                .${linkId} { color: ${menuOverlay.settings?.dropdownTextColor || '#1e293b'} !important; }
                                .${linkId}:hover { color: ${menuOverlay.settings?.dropdownActiveColor || '#4f46e5'} !important; }
                              </style>
                              <a href="${link.link || '#'}" class="${linkId} block py-1 no-underline transition-colors" style="font-size: ${formatStyleVal(menuOverlay.settings?.dropdownFontSize) || '12px'}; font-weight: ${menuOverlay.settings?.dropdownFontWeight || 'bold'}; font-style: ${menuOverlay.settings?.dropdownFontStyle || 'normal'};">
                                ${link.title}
                                ${link.description ? `<div class="text-slate-400 block mt-0.5" style="font-size: ${formatStyleVal(menuOverlay.settings?.dropdownDescFontSize) || '10px'}">${link.description}</div>` : ''}
                              </a>`;
                          });
                          submenuHTML += `
                            <div class="mb-4 last:mb-0">
                              <div class="font-extrabold text-indigo-600 uppercase tracking-widest mb-3" style="font-size: ${formatStyleVal(menuOverlay.settings?.dropdownGroupFontSize) || '10px'}">${gName}</div>
                              <div class="space-y-3">
                                ${linksHTML}
                              </div>
                            </div>`;
                        });
                      }

                      return `
                        <div class="relative group/menu-dropdown">
                          <button class="flex items-center gap-1 text-white hover:text-amber-400 transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer py-2" style="font-size: ${formatStyleVal(ms.fontSize) || '11px'}; font-weight: ${ms.fontWeight || 'bold'}; font-style: ${ms.fontStyle || 'normal'};">
                            <span>${item}</span>
                            <span class="text-[8px] transition-transform duration-200 group-hover/menu-dropdown:rotate-180">▼</span>
                          </button>
                          <div class="absolute top-full right-0 mt-1 w-[480px] bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-100 p-6 opacity-0 pointer-events-none group-hover/menu-dropdown:opacity-100 group-hover/menu-dropdown:pointer-events-auto transition-all duration-200 z-50 text-left flex gap-6">
                            <div class="flex-1 flex gap-6">
                              ${submenuHTML}
                            </div>
                            ${menuOverlay.settings?.contactEmail ? `
                            <div class="w-48 bg-amber-50 rounded-xl p-4 border border-amber-100/50" style="color: ${menuOverlay.settings?.contactTextColor || '#0f172a'}">
                              <h5 class="font-extrabold uppercase tracking-widest mb-3" style="font-size: ${formatStyleVal(menuOverlay.settings?.contactTitleFontSize) || '14px'}">${menuOverlay.settings?.contactTitle || 'Kontakt'}</h5>
                              <div class="space-y-3">
                                <p class="leading-relaxed font-semibold" style="font-size: ${formatStyleVal(menuOverlay.settings?.contactTextFontSize) || '10px'}">${(menuOverlay.settings?.contactText || '').replace(/\\n/g, '<br/>')}</p>
                                <div>
                                  <a href="mailto:${menuOverlay.settings?.contactEmail}" class="font-semibold mt-2 hover:underline block no-underline" style="font-size: ${formatStyleVal(menuOverlay.settings?.contactTextFontSize) || '10px'}; color: inherit">${menuOverlay.settings?.contactEmail}</a>
                                  <a href="tel:${menuOverlay.settings?.contactPhone?.replace(/\\s/g, '')}" class="font-semibold hover:underline block no-underline" style="font-size: ${formatStyleVal(menuOverlay.settings?.contactTextFontSize) || '10px'}; color: inherit">${menuOverlay.settings?.contactPhone}</a>
                                </div>
                                <a href="#" class="inline-block mt-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg transition-colors no-underline text-center w-full" style="font-size: ${formatStyleVal(menuOverlay.settings?.contactBtnFontSize) || '10px'}">${menuOverlay.settings?.contactBtnText || 'Book Nu'}</a>
                              </div>
                            </div>
                            ` : ''}
                          </div>
                        </div>`;
                    }
                    return `<a href="#${item.toLowerCase().replace(/\s+/g, '-')}" class="text-white hover:text-amber-400 transition-colors uppercase tracking-wider no-underline" style="font-size: ${formatStyleVal(ms.fontSize) || '11px'}; font-weight: ${ms.fontWeight || 'bold'}; font-style: ${ms.fontStyle || 'normal'};">${item}</a>`;
                  }).join('');

                  menuHTML = `
                    <div class="hidden lg:flex items-center gap-6" style="margin-bottom: ${ms.marginBottom || '0px'};">
                      ${menuLinks}
                    </div>
                    <button onclick="toggleMobileMenu(true)" class="lg:hidden p-2 text-white hover:text-amber-400 bg-transparent border-none cursor-pointer">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>`;
                }

                headerHTML = `
                  <div class="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30 bg-transparent">
                    <div>${logoHTML}</div>
                    <div>${menuHTML}</div>
                  </div>`;
              }

              const contentOverlays = sortedOverlays.filter(o => o.type !== 'logo' && o.type !== 'dropdown-menu');
              contentOverlays.forEach(item => {
                const os = item.styles || {};
                const oVisibility = [
                  item.visibleOnDesktop === false ? 'hide-on-desktop' : '',
                  item.visibleOnTablet === false ? 'hide-on-tablet' : '',
                  item.visibleOnMobile === false ? 'hide-on-mobile' : ''
                ].filter(Boolean).join(' ');

                const overlayStyleStr = [
                  os.fontSize ? `font-size: ${formatStyleVal(os.fontSize)}` : '',
                  os.fontWeight ? `font-weight: ${os.fontWeight}` : '',
                  os.textAlign ? `text-align: ${os.textAlign}` : '',
                  os.marginTop ? `margin-top: ${formatStyleVal(os.marginTop)}` : '',
                  os.marginBottom ? `margin-bottom: ${formatStyleVal(os.marginBottom)}` : '',
                  os.marginLeft ? `margin-left: ${formatStyleVal(os.marginLeft)}` : '',
                  os.marginRight ? `margin-right: ${formatStyleVal(os.marginRight)}` : '',
                  os.color ? `color: ${os.color}` : '',
                  os.backgroundColor ? `background-color: ${os.backgroundColor}` : '',
                  os.borderRadius ? `border-radius: ${formatStyleVal(os.borderRadius)}` : '',
                  os.width ? `width: ${formatStyleVal(os.width)}` : '',
                  os.height ? `height: ${formatStyleVal(os.height)}` : '',
                  os.paddingTop ? `padding-top: ${formatStyleVal(os.paddingTop)}` : '',
                  os.paddingBottom ? `padding-bottom: ${formatStyleVal(os.paddingBottom)}` : '',
                  os.paddingLeft ? `padding-left: ${formatStyleVal(os.paddingLeft)}` : '',
                  os.paddingRight ? `padding-right: ${formatStyleVal(os.paddingRight)}` : '',
                ].filter(Boolean).join('; ');

                if (item.type === 'text') {
                  overlayItemsHTML += `
                    <div class="${oVisibility}" id="overlay-${item.id}" style="${overlayStyleStr}; line-height: 1.4; letter-spacing: 0px;">
                      ${item.content.replace(/\n/g, '<br />')}
                    </div>`;
                } else if (item.type === 'button') {
                  const isDialerBtn = item.content.includes('31 11 11 15') || item.id === 'locksmith-hero-btn';
                  if (isDialerBtn) {
                    const lines = item.content.split('\n');
                    const phoneNum = lines[0] || '31 11 11 15';
                    const subtext = lines[1] || 'DØGNTELEFON';
                    overlayItemsHTML += `
                      <div class="${oVisibility}" style="margin-top: ${formatStyleVal(os.marginTop) || '16px'}; margin-bottom: ${formatStyleVal(os.marginBottom) || '4px'}; text-align: ${os.textAlign || 'center'};">
                        <a id="overlay-${item.id}" href="${item.link || 'tel:31111115'}" class="group inline-flex flex-col items-center justify-center border-2 border-white rounded-full bg-transparent text-white hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 transition-all duration-300 pointer-events-auto shadow-lg select-none no-underline" style="font-size: ${formatStyleVal(os.fontSize) || '16px'}; padding-top: ${formatStyleVal(os.paddingTop) || '0.75em'}; padding-bottom: ${formatStyleVal(os.paddingBottom) || '0.75em'}; padding-left: ${formatStyleVal(os.paddingLeft) || '2.5em'}; padding-right: ${formatStyleVal(os.paddingRight) || '2.5em'}; border-radius: ${formatStyleVal(os.borderRadius) || '9999px'}; width: ${formatStyleVal(os.width) || 'auto'}; height: ${formatStyleVal(os.height) || 'auto'};">
                          <span class="font-extrabold tracking-wider leading-none transition-colors" style="font-size: 1.375em;">${phoneNum}</span>
                          <span class="font-extrabold tracking-widest text-amber-400 group-hover:text-slate-950 transition-colors leading-none mt-1.5" style="font-size: 0.625em;">${subtext}</span>
                        </a>
                      </div>`;
                  } else {
                    overlayItemsHTML += `
                      <div class="${oVisibility}" style="margin-top: ${formatStyleVal(os.marginTop) || '4px'}; margin-bottom: ${formatStyleVal(os.marginBottom) || '4px'}; text-align: ${os.textAlign || 'center'};">
                        <a id="overlay-${item.id}" href="${item.link || '#'}" class="inline-flex items-center justify-center whitespace-nowrap transition-transform active:scale-95 duration-100 font-semibold pointer-events-auto text-center no-underline" style="background-color: ${os.backgroundColor || '#ffffff'}; color: ${os.color || '#0f172a'}; padding-top: ${formatStyleVal(os.paddingTop) || '0.615em'}; padding-bottom: ${formatStyleVal(os.paddingBottom) || '0.615em'}; padding-left: ${formatStyleVal(os.paddingLeft) || '1.23em'}; padding-right: ${formatStyleVal(os.paddingRight) || '1.23em'}; border-radius: ${formatStyleVal(os.borderRadius) || '6px'}; font-size: ${formatStyleVal(os.fontSize) || '13px'}; font-weight: ${os.fontWeight || '600'}; width: ${formatStyleVal(os.width) || 'auto'}; height: ${formatStyleVal(os.height) || 'auto'};">
                          ${item.content}
                        </a>
                      </div>`;
                  }
                } else if (item.type === 'search-box') {
                  overlayItemsHTML += `
                    <div class="${oVisibility}" id="overlay-${item.id}" style="margin-top: ${formatStyleVal(os.marginTop) || '8px'}; margin-bottom: ${formatStyleVal(os.marginBottom) || '8px'}; text-align: ${os.textAlign || 'center'};">
                      <form onsubmit="handleNewsletterSubmit(event)" class="flex gap-2 w-full max-w-sm pointer-events-auto mx-auto">
                        <input type="email" name="email" placeholder="${item.content || 'Enter email...'}" class="flex-1 text-xs px-2.5 py-1.5 rounded border border-white/20 bg-black/40 text-white placeholder-slate-400 focus:outline-none" required />
                        <button type="submit" class="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded transition-all">${item.link || 'Subscribe'}</button>
                      </form>
                    </div>`;
                }
              });

              const positionClass = 
                el.overlayPosition === 'top-left' ? 'items-start justify-start text-left' :
                el.overlayPosition === 'top-center' ? 'items-start justify-center text-center' :
                el.overlayPosition === 'top-right' ? 'items-start justify-end text-right' :
                el.overlayPosition === 'center-left' ? 'items-center justify-start text-left' :
                el.overlayPosition === 'center-right' ? 'items-center justify-end text-right' :
                el.overlayPosition === 'bottom-left' ? 'items-end justify-start text-left' :
                el.overlayPosition === 'bottom-center' ? 'items-end justify-center text-center' :
                el.overlayPosition === 'bottom-right' ? 'items-end justify-end text-right' :
                'items-center justify-center text-center';

              const cardClass = el.id === 'locksmith-hero-banner'
                ? "max-w-3xl w-full flex flex-col items-center justify-center gap-6 text-center transition-all"
                : "max-w-md w-full p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md flex flex-col gap-3 transition-all text-center";

              const cardBgColor = el.id === 'locksmith-hero-banner' ? 'transparent' : `${el.overlayBgColor || '#000000'}${Math.round(((el.overlayBgOpacity ?? 50) / 100) * 255).toString(16).padStart(2, '0')}`;

              elHTML += `
                <div id="element-${el.id}" class="relative w-full overflow-hidden flex bg-cover bg-center ${elementVisibilityClasses}" style="background-image: url('${el.src || ''}'); border-radius: ${formatStyleVal(s.borderRadius) || '12px'}; border-width: ${formatStyleVal(s.borderWidth) || '0px'}; border-color: ${s.borderColor || 'transparent'}; margin-top: ${formatStyleVal(s.marginTop) || '0px'}; margin-bottom: ${formatStyleVal(s.marginBottom) || '0px'}; min-height: 350px;">
                  ${headerHTML}
                  <div class="absolute inset-0 bg-[#000000] pointer-events-none" style="opacity: ${(el.overlayBgOpacity !== undefined ? el.overlayBgOpacity : 35) / 100};"></div>
                  <div class="absolute inset-0 p-6 md:p-10 flex ${positionClass}">
                    <div class="${cardClass}" style="background-color: ${cardBgColor}; color: #ffffff;">
                      ${overlayItemsHTML}
                    </div>
                  </div>
                </div>`;
            }
          }
        });

        const inlineWidthStyle = section.id === 'locksmith-quick-menu'
          ? 'style="flex: 1 1 0%;"'
          : (col.customWidth ? `style="flex: none; width: ${col.customWidth};"` : '');
        const colClass = section.id === 'locksmith-quick-menu'
          ? 'flex-1'
          : (col.customWidth ? 'w-full' : (col.width === 'w-full' ? 'w-full' : col.width.replace('md:', 'sm:md:')));
        colHTML += `
          <div class="w-full ${colClass} flex flex-col space-y-4" ${inlineWidthStyle}>
            ${elHTML}
          </div>`;
      });

      const padY = 
        section.paddingY === 'sm' ? 'py-6 md:py-8' :
        section.paddingY === 'lg' ? 'py-16 md:py-24' :
        section.paddingY === 'xl' ? 'py-20 md:py-32' :
        'py-12 md:py-16';

      const sectionVisibilityClasses = [
        section.visibleOnDesktop === false ? 'hide-on-desktop' : '',
        section.visibleOnTablet === false ? 'hide-on-tablet' : '',
        section.visibleOnMobile === false ? 'hide-on-mobile' : ''
      ].filter(Boolean).join(' ');

      const containerClass = section.id === 'locksmith-quick-menu'
        ? 'flex flex-row gap-2 justify-around items-start w-full'
        : 'flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-between';

      sectionHTML += `
        <!-- Section: ${section.name} -->
        <section id="section-${section.id}" class="${padY} transition-colors ${sectionVisibilityClasses}" style="background-color: ${section.backgroundColor}; color: ${section.textColor || theme.text};">
          <div class="max-w-6xl mx-auto px-6">
            <div class="${containerClass}">
              ${colHTML}
            </div>
          </div>
        </section>
      `;
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Customized Website</title>
  
  <!-- Tailwind CSS Playground CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <style>
    ${fontImport}
    
    body {
      background-color: ${theme.background};
      color: ${theme.text};
    }
    
    body p,
    body span:not(.lucide),
    body h1,
    body h2,
    body h3,
    body h4,
    body h5,
    body h6,
    body li,
    body a {
      line-height: ${theme.baseLineHeight || '1.5'};
    }

    
    .font-sans { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    .font-serif { font-family: 'Playfair Display', Georgia, serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .font-display { font-family: 'Outfit', sans-serif; }

    @media (max-width: 767px) {
      .hide-on-mobile { display: none !important; }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      .hide-on-tablet { display: none !important; }
    }
    @media (min-width: 1024px) {
      .hide-on-desktop { display: none !important; }
    }
    
    /* Logo scaling using em units relative to parent font-size */
    div.select-none.flex {
      gap: 0.75em !important;
      margin-bottom: 1em !important;
    }
    div.select-none.flex > div.rounded-full {
      width: 3em !important;
      height: 3em !important;
      padding: 0.25em !important;
    }
    div.select-none.flex > div.rounded-full > span {
      font-size: 0.75em !important;
      line-height: 1 !important;
    }
    div.select-none.flex > div.rounded-full > svg {
      width: 1.25em !important;
      height: 0.625em !important;
    }
    div.select-none.flex > div.flex-col > span:first-child {
      font-size: 1.125em !important;
      line-height: 1 !important;
    }
    div.select-none.flex > div.flex-col > span:last-child {
      font-size: 0.5625em !important;
      margin-top: 0.25em !important;
      line-height: 1.2 !important;
    }
    ${overridesCSS}
  </style>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Playfair Display', 'serif'],
            mono: ['JetBrains Mono', 'monospace'],
            display: ['Outfit', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <script>
    // Read More / Collapsible Text functionality
    function initReadMore() {
      const isMobileTablet = window.innerWidth < 1024;
      
      const containers = document.querySelectorAll('[id^="readmore-container-"]');
      containers.forEach(container => {
        const id = container.id.replace('readmore-container-', '');
        const btnContainer = document.getElementById('readmore-btn-container-' + id);
        const fade = document.getElementById('readmore-fade-' + id);
        const siblingImgId = container.getAttribute('data-sibling-img');
        
        let limit = parseInt(container.getAttribute('data-limit') || '200');
        
        // If we have a sibling image beside it and we are on desktop
        if (siblingImgId && !isMobileTablet) {
          const imgEl = document.getElementById('element-' + siblingImgId);
          if (imgEl) {
            const rect = imgEl.getBoundingClientRect();
            let imgHeight = rect.height;
            if (imgHeight === 0) {
              const actualImg = imgEl.querySelector('img');
              if (actualImg) {
                imgHeight = actualImg.getBoundingClientRect().height;
              }
            }
            if (imgHeight > 0) {
              limit = imgHeight;
            }
          }
        }
        
        container.setAttribute('data-computed-limit', limit);
        const textHeight = container.scrollHeight;
        
        if (textHeight > limit) {
          const btn = document.getElementById('readmore-btn-' + id);
          const isExpanded = btn && btn.querySelector('.indicator').innerText === '▲';
          if (!isExpanded) {
            container.style.maxHeight = limit + 'px';
            container.style.overflow = 'hidden';
            if (btnContainer) btnContainer.style.display = 'flex';
            if (fade) fade.style.display = 'block';
          } else {
            if (btnContainer) btnContainer.style.display = 'flex';
          }
        } else {
          container.style.maxHeight = 'none';
          container.style.overflow = 'visible';
          if (btnContainer) btnContainer.style.display = 'none';
          if (fade) fade.style.display = 'none';
        }
      });
    }

    function toggleReadMore(id) {
      const container = document.getElementById('readmore-container-' + id);
      const btn = document.getElementById('readmore-btn-' + id);
      const fade = document.getElementById('readmore-fade-' + id);
      if (!container || !btn) return;
      
      const limit = parseInt(container.getAttribute('data-computed-limit') || '200');
      const isCollapsed = container.style.maxHeight !== 'none';
      
      if (isCollapsed) {
        container.style.maxHeight = 'none';
        container.style.overflow = 'visible';
        btn.querySelector('span').innerText = 'Læs mindre';
        btn.querySelector('.indicator').innerText = '▲';
        if (fade) fade.style.display = 'none';
      } else {
        container.style.maxHeight = limit + 'px';
        container.style.overflow = 'hidden';
        btn.querySelector('span').innerText = 'Læs mere';
        btn.querySelector('.indicator').innerText = '▼';
        if (fade) fade.style.display = 'block';
      }
    }

    function toggleMobileMenu(open) {
      const drawer = document.getElementById('mobile-drawer');
      if (drawer) {
        if (open) {
          drawer.classList.remove('translate-y-full');
        } else {
          drawer.classList.add('translate-y-full');
        }
      }
    }
    function toggleMobileAccordion(id) {
      const content = document.getElementById('acc-content-' + id);
      const icon = document.getElementById('acc-icon-' + id);
      if (content && icon) {
        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
          content.classList.remove('hidden');
          icon.innerText = '▲';
        } else {
          content.classList.add('hidden');
          icon.innerText = '▼';
        }
      }
    }
    async function handleNewsletterSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const email = formData.get('email');
      if (!email) return;
      try {
        const response = await fetch('http://localhost:8000/api/send-newsletter-email/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        if (response.ok) {
          const data = await response.json();
          alert('Tilmeldt! Nyhedsbrev bekræftelse sendt til ' + email);
        } else {
          alert('Fejl ved tilmelding. Prøv venligst igen.');
        }
      } catch (err) {
        alert('Kunne ikke oprette forbindelse til serveren.');
      }
    }

    function toggleMobileMenu(isOpen) {
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      const drawerId = isTablet ? 'tablet-drawer-menu' : 'mobile-drawer-menu';
      const otherDrawerId = isTablet ? 'mobile-drawer-menu' : 'tablet-drawer-menu';
      
      const drawer = document.getElementById(drawerId);
      const otherDrawer = document.getElementById(otherDrawerId);
      
      if (otherDrawer) {
        otherDrawer.style.display = 'none';
      }
      
      if (!drawer) return;
      if (isOpen) {
        drawer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      } else {
        drawer.style.display = 'none';
        document.body.style.overflow = '';
      }
    }

    // Webshop Data from React builder backend
    const WEBSHOP_CATEGORIES = ${JSON.stringify(WEBSHOP_CATEGORIES)};
    const WEBSHOP_SUBCATEGORIES = ${JSON.stringify(WEBSHOP_SUBCATEGORIES)};
    const WEBSHOP_BRANDS = ${JSON.stringify(WEBSHOP_BRANDS)};
    const WEBSHOP_PRODUCTS = ${JSON.stringify(WEBSHOP_PRODUCTS)};

    let shopCart = [];

    function navigateToHash(hash) {
      window.location.hash = hash;
    }

    function renderCart() {
      const countBadge = document.getElementById('cart-count-badge');
      let totalQty = 0;
      let subtotal = 0;

      shopCart.forEach(item => {
        totalQty += item.quantity;
        subtotal += item.product.price * item.quantity;
      });

      if (countBadge) countBadge.innerText = totalQty;

      // Render for Cart page if visible
      const cartItemsContainer = document.getElementById('cart-page-items-container');
      const cartSummaryContainer = document.getElementById('cart-page-summary-container');
      if (cartItemsContainer) {
        if (shopCart.length === 0) {
          cartItemsContainer.innerHTML = \`
            <div class="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <div class="text-4xl mb-4">🛒</div>
              <h4 class="text-sm font-extrabold text-slate-800 uppercase">Din indkøbskurv er tom</h4>
              <p class="text-xs text-slate-400 mt-2">Tilføj nogle af vores kvalitetssikrede produkter for at fortsætte.</p>
              <button onclick="navigateToHash('shop')" class="mt-6 px-6 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase rounded-xl cursor-pointer hover:bg-slate-800 transition-all border-none">Se produkter</button>
            </div>\`;
          if (cartSummaryContainer) cartSummaryContainer.style.display = 'none';
        } else {
          if (cartSummaryContainer) cartSummaryContainer.style.display = 'block';
          let itemsHTML = '';
          shopCart.forEach(item => {
            const formattedPrice = (item.product.price * item.quantity).toLocaleString('da-DK', { minimumFractionDigits: 2 });
            const itemPriceFormatted = item.product.price.toLocaleString('da-DK', { minimumFractionDigits: 2 });
            itemsHTML += \`
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div class="flex items-center gap-4">
                  <img src="\${item.product.image}" class="w-16 h-16 object-cover rounded-xl bg-slate-200 border border-slate-100 shrink-0" />
                  <div>
                    <h4 class="text-xs font-extrabold text-slate-900 uppercase leading-snug tracking-wide">\${item.product.name}</h4>
                    <span class="text-xs text-indigo-650 font-bold mt-1 block">\${itemPriceFormatted} DKK</span>
                  </div>
                </div>

                <div class="flex items-center justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div class="flex items-center gap-2 bg-white rounded-xl p-1 border border-slate-200">
                    <button onclick="updateCartQty('\${item.product.id}', \${item.quantity - 1})" class="w-6 h-6 bg-transparent border-none font-bold text-slate-505 hover:text-slate-800 cursor-pointer flex items-center justify-center">-</button>
                    <span class="text-xs font-mono font-bold text-slate-700 px-2 min-w-[20px] text-center">\${item.quantity}</span>
                    <button onclick="updateCartQty('\${item.product.id}', \${item.quantity + 1})" class="w-6 h-6 bg-transparent border-none font-bold text-slate-505 hover:text-slate-800 cursor-pointer flex items-center justify-center">+</button>
                  </div>

                  <div class="flex items-center gap-4">
                    <span class="text-xs font-mono font-black text-slate-950 shrink-0">\text{\${formattedPrice} DKK}</span>
                    <button onclick="removeFromCart('\${item.product.id}')" class="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer border-none bg-transparent">🗑️</button>
                  </div>
                </div>
              </div>\`;
          });
          cartItemsContainer.innerHTML = itemsHTML;

          const cartPageItemsCount = document.getElementById('cart-page-items-count');
          const cartPageSubtotalExcl = document.getElementById('cart-page-subtotal-excl');
          const cartPageMoms = document.getElementById('cart-page-moms');
          const cartPageTotalPrice = document.getElementById('cart-page-total-price');

          if (cartPageItemsCount) cartPageItemsCount.innerText = totalQty;
          if (cartPageSubtotalExcl) cartPageSubtotalExcl.innerText = (subtotal / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK';
          if (cartPageMoms) cartPageMoms.innerText = (subtotal - subtotal / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK';
          if (cartPageTotalPrice) cartPageTotalPrice.innerText = subtotal.toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK';
        }
      }

      // Render for Checkout page if visible
      const checkoutItemsList = document.getElementById('checkout-page-items-list');
      if (checkoutItemsList) {
        let checkoutHTML = '';
        shopCart.forEach(item => {
          const formattedPrice = (item.product.price * item.quantity).toLocaleString('da-DK', { minimumFractionDigits: 2 });
          const itemPriceFormatted = item.product.price.toLocaleString('da-DK', { minimumFractionDigits: 2 });
          checkoutHTML += \`
            <div class="flex justify-between items-start gap-2">
              <div class="flex-1">
                <span class="text-[11px] font-bold text-slate-800 uppercase block leading-tight">\${item.product.name}</span>
                <span class="text-[10px] text-slate-400 font-medium">Antal: \${item.quantity} x \${itemPriceFormatted} DKK</span>
              </div>
              <span class="text-xs font-mono font-bold text-slate-900 shrink-0">\${formattedPrice} DKK</span>
            </div>\`;
        });
        checkoutItemsList.innerHTML = checkoutHTML;

        const checkoutSubtotalExcl = document.getElementById('checkout-page-subtotal-excl');
        const checkoutMoms = document.getElementById('checkout-page-moms');
        const checkoutTotal = document.getElementById('checkout-page-total');

        if (checkoutSubtotalExcl) checkoutSubtotalExcl.innerText = (subtotal / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK';
        if (checkoutMoms) checkoutMoms.innerText = (subtotal - subtotal / 1.25).toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK';
        if (checkoutTotal) checkoutTotal.innerText = subtotal.toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK';
      }
    }

    window.addToCart = function(productId) {
      const product = WEBSHOP_PRODUCTS.find(p => p.id === productId);
      if (!product) return;
      
      const existing = shopCart.find(item => item.product.id === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        shopCart.push({ product, quantity: 1 });
      }
      renderCart();
      navigateToHash('shop/cart');
    };

    window.removeFromCart = function(productId) {
      shopCart = shopCart.filter(item => item.product.id !== productId);
      renderCart();
    };

    window.updateCartQty = function(productId, newQty) {
      if (newQty <= 0) {
        window.removeFromCart(productId);
        return;
      }
      const existing = shopCart.find(item => item.product.id === productId);
      if (existing) {
        existing.quantity = newQty;
      }
      renderCart();
    };

    // Session state
    let loggedInUser = null;
    let selectedCarrierOption = null;
    let selectedShipmondoDelivery = null;

    function initUserSession() {
      const sessionStr = localStorage.getItem('mm_lase_session');
      if (sessionStr) {
        try {
          loggedInUser = JSON.parse(sessionStr);
        } catch (e) {
          console.error('Failed to parse session', e);
        }
      }
      updateUserStatusUI();
      prefillCheckoutForm();
    }

    function updateUserStatusUI() {
      const container = document.getElementById('shop-user-status-container');
      if (!container) return;
      
      const isAdmin = loggedInUser && loggedInUser.email === 'admin@mmlaseshop.dk';
      const adminBtnHTML = isAdmin ? '<button onclick="navigateToHash(\\'shop/admin\\')" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white transition-colors text-xs font-bold rounded-xl border-none cursor-pointer flex items-center gap-1.5">🔑 Admin</button>' : '';
      const profileBtnHTML = loggedInUser ? '<button onclick="navigateToHash(\\'shop/profile\\')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1"><svg class="w-3 h-3 text-indigo-650" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg><span>Mine Ordrer</span></button>' : '';

      if (loggedInUser) {
        container.innerHTML = \\\`
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500">Hej, <strong class="text-slate-800">\\\${loggedInUser.name}</strong></span>
            \\\${profileBtnHTML}
            <button onclick="logoutUser()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold rounded-xl border border-slate-200 cursor-pointer">Log ud</button>
            \\\${adminBtnHTML}
          </div>\\\`;
      } else {
        container.innerHTML = \\\`
          <div class="flex items-center gap-2">
            <button onclick="navigateToHash('shop/login')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold rounded-xl border border-slate-200 cursor-pointer">Log ind</button>
          </div>\\\`;
      }
    }

    window.logoutUser = function() {
      localStorage.removeItem('mm_lase_session');
      loggedInUser = null;
      updateUserStatusUI();
      prefillCheckoutForm();
      navigateToHash('shop');
    };

    function prefillCheckoutForm() {
      const nameField = document.getElementById('checkout-page-name');
      const emailField = document.getElementById('checkout-page-email');
      const phoneField = document.getElementById('checkout-page-phone');
      const addressField = document.getElementById('checkout-page-address');
      
      const postcodeField = document.getElementById('checkout-page-postcode');
      const cityField = document.getElementById('checkout-page-city');
      const postcodeGroup = document.getElementById('checkout-postcode-city-group');

      // Reset selection when pre-filling/changing user status
      selectedCarrierOption = null;
      selectedShipmondoDelivery = null;
      updateCarrierButtonsUI();
      
      const optionsContainer = document.getElementById('shipmondo-options-container');
      if (optionsContainer) optionsContainer.style.display = 'none';

      if (loggedInUser) {
        if (nameField) nameField.value = loggedInUser.name;
        if (emailField) {
          emailField.value = loggedInUser.email;
          emailField.disabled = true;
        }
        if (phoneField) phoneField.value = loggedInUser.phone;
        if (addressField) {
          addressField.value = loggedInUser.address;
          addressField.placeholder = "Gadenavn, husnummer, etage, postnummer og by";
        }
        if (postcodeGroup) postcodeGroup.style.display = 'none';
        if (postcodeField) {
          postcodeField.removeAttribute('required');
          // Try to extract postcode (4 digits)
          const match = loggedInUser.address.match(/\b\d{4}\b/);
          postcodeField.value = match ? match[0] : '';
        }
        if (cityField) {
          cityField.removeAttribute('required');
          cityField.value = '';
        }
      } else {
        if (nameField) nameField.value = '';
        if (emailField) {
          emailField.value = '';
          emailField.disabled = false;
        }
        if (phoneField) phoneField.value = '';
        if (addressField) {
          addressField.value = '';
          addressField.placeholder = "F.eks. Hovedgade 12, 1. th";
        }
        if (postcodeGroup) postcodeGroup.style.display = 'grid';
        if (postcodeField) {
          postcodeField.value = '';
          postcodeField.setAttribute('required', 'required');
        }
        if (cityField) {
          cityField.value = '';
          cityField.setAttribute('required', 'required');
        }
      }
    }

    window.selectCarrier = function(carrier) {
      selectedCarrierOption = carrier;
      selectedShipmondoDelivery = null;
      updateCarrierButtonsUI();
      fetchShipmondoOptions();
    };

    function updateCarrierButtonsUI() {
      const glsBtn = document.getElementById('carrier-btn-gls');
      const postnordBtn = document.getElementById('carrier-btn-postnord');

      if (glsBtn) {
        if (selectedCarrierOption === 'gls') {
          glsBtn.className = "flex flex-col items-center justify-center py-3.5 px-4 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer bg-amber-400 text-slate-950 border-amber-400 shadow-md animate-none";
        } else {
          glsBtn.className = "flex flex-col items-center justify-center py-3.5 px-4 rounded-xl border border-slate-200 text-xs font-bold transition-all duration-300 cursor-pointer bg-white text-slate-700 hover:border-slate-400 animate-none";
        }
      }

      if (postnordBtn) {
        if (selectedCarrierOption === 'postnord') {
          postnordBtn.className = "flex flex-col items-center justify-center py-3.5 px-4 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer bg-amber-400 text-slate-950 border-amber-400 shadow-md animate-none";
        } else {
          postnordBtn.className = "flex flex-col items-center justify-center py-3.5 px-4 rounded-xl border border-slate-200 text-xs font-bold transition-all duration-300 cursor-pointer bg-white text-slate-700 hover:border-slate-400 animate-none";
        }
      }
    }

    window.handlePostcodeChange = function() {
      const postcode = document.getElementById('checkout-page-postcode').value.trim();
      if (/^\d{4}$/.test(postcode) && selectedCarrierOption) {
        fetchShipmondoOptions();
      }
    };

    function fetchShipmondoOptions() {
      const postcodeField = document.getElementById('checkout-page-postcode');
      if (!postcodeField) return;
      const postcode = postcodeField.value.trim();

      if (!/^\d{4}$/.test(postcode)) {
        return; // Don't fetch unless zipcode is exactly 4 digits
      }

      if (!selectedCarrierOption) {
        return;
      }

      const optionsContainer = document.getElementById('shipmondo-options-container');
      const loadingIndicator = document.getElementById('shipmondo-loading-indicator');
      const errorMsg = document.getElementById('shipmondo-error-msg');
      const listContainer = document.getElementById('shipmondo-options-list');

      if (optionsContainer) optionsContainer.style.display = 'block';
      if (loadingIndicator) loadingIndicator.style.display = 'inline';
      if (errorMsg) errorMsg.style.display = 'none';
      if (listContainer) listContainer.innerHTML = '';

      const backendUrl = localStorage.getItem('visual-builder-django-url') || (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') ? 'http://localhost:8000' : window.location.origin);
      const url = backendUrl + '/api/shipmondo-delivery-options/?zipcode=' + encodeURIComponent(postcode) + '&carrier=' + selectedCarrierOption;

      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('Kunne ikke hente leveringsmetoder');
          return res.json();
        })
        .then(data => {
          renderShipmondoOptions(data);
        })
        .catch(err => {
          console.warn('Backend Shipmondo fetch failed in exported site, falling back to local mock:', err);
          
          // Generate same local fallback mock data in exported site!
          const mockCities = {
            "1000": "København K", "2000": "Frederiksberg", "2100": "København Ø",
            "2200": "København N", "2300": "København S", "2400": "København NV",
            "2500": "Valby", "2600": "Glostrup", "2700": "Brønshøj", "2800": "Kongens Lyngby",
            "2900": "Hellerup", "3000": "Helsingør", "3400": "Hillerød", "4000": "Roskilde",
            "5000": "Odense C", "8000": "Aarhus C", "9000": "Aalborg"
          };
          const cityName = mockCities[postcode] || "København";
          const mockData = { pickup_points: [], home_delivery: [] };

          if (selectedCarrierOption === 'gls') {
            mockData.pickup_points.push(
              { id: 'gls_p1', company_name: 'Spar Supermarked GLS Pakkeshop', address: 'Hovedgade 42', zipcode: postcode, city: cityName },
              { id: 'gls_p2', company_name: 'OK Plus GLS Pakkeshop', address: 'Jernbanegade 5', zipcode: postcode, city: cityName }
            );
            mockData.home_delivery.push({ code: 'gls', name: 'GLS Privatlevering', description: 'Direkte levering til din dør – 1-2 hverdage' });
          } else {
            mockData.pickup_points.push(
              { id: 'pnd_p1', company_name: 'Coop SuperBrugsen PostNord Pakkeboks', address: 'Bymidten 11', zipcode: postcode, city: cityName },
              { id: 'pnd_p2', company_name: 'Circle K PostNord Pakkeshop', address: 'Ringvejen 105', zipcode: postcode, city: cityName }
            );
            mockData.home_delivery.push({ code: 'postnord', name: 'PostNord Hjemmelevering', description: 'Sikker levering til din adresse med omdeling – 1-2 hverdage' });
          }
          renderShipmondoOptions(mockData);
        })
        .finally(() => {
          if (loadingIndicator) loadingIndicator.style.display = 'none';
        });
    }

    function renderShipmondoOptions(data) {
      const listContainer = document.getElementById('shipmondo-options-list');
      if (!listContainer) return;
      listContainer.innerHTML = '';

      let html = '';
      
      const pickupPoints = data.pickup_points || [];
      const homeDelivery = data.home_delivery || [];

      if (pickupPoints.length > 0) {
        html += '<div class="space-y-2">';
        html += '  <span class="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wide block">Pakkeshops & Udleveringssteder</span>';
        html += '  <div class="grid gap-2">';
        pickupPoints.forEach((point, index) => {
          const isChecked = index === 0; // Auto-select first one
          if (isChecked) {
            selectedShipmondoDelivery = {
              type: 'pickup',
              id: point.id,
              name: point.company_name,
              address: point.address + ', ' + point.zipcode + ' ' + point.city,
              carrier: selectedCarrierOption
            };
          }
          html += \`
            <div onclick="selectDeliveryOption('pickup', '\\\${point.id}', '\\\${point.company_name.replace(/'/g, "\\\\'")}', '\\\${(point.address + ', ' + point.zipcode + ' ' + point.city).replace(/'/g, "\\\\'")}')" 
                 id="delivery-opt-pickup-\\\${point.id}"
                 class="flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer \\\${isChecked ? 'bg-indigo-50/50 border-indigo-600 text-slate-800 font-bold' : 'bg-white border-slate-200 hover:border-slate-350 text-slate-600'}">
              <input type="radio" name="delivery_point_radio" \\\${isChecked ? 'checked' : ''} class="mt-0.5 accent-indigo-600 cursor-pointer" />
              <div>
                <p class="text-xs font-bold text-slate-800 leading-tight">\\\${point.company_name}</p>
                <p class="text-[10px] text-slate-505 mt-1">\\\${point.address}, \\\${point.zipcode} \\\${point.city}</p>
              </div>
            </div>\`;
        });
        html += '  </div>';
        html += '</div>';
      }

      if (homeDelivery.length > 0) {
        html += '<div class="space-y-2 mt-4">';
        html += '  <span class="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wide block">Hjemmelevering</span>';
        html += '  <div class="grid gap-2">';
        homeDelivery.forEach((option, index) => {
          const isChecked = pickupPoints.length === 0 && index === 0;
          if (isChecked) {
            selectedShipmondoDelivery = {
              type: 'home',
              id: option.code,
              name: option.name,
              address: 'Levering til privat adresse',
              carrier: selectedCarrierOption
            };
          }
          html += \`
            <div onclick="selectDeliveryOption('home', '\\\${option.code}', '\\\${option.name.replace(/'/g, "\\\\'")}', 'Levering til privat adresse')" 
                 id="delivery-opt-home-\\\${option.code}"
                 class="flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer \\\${isChecked ? 'bg-indigo-50/50 border-indigo-600 text-slate-800 font-bold' : 'bg-white border-slate-200 hover:border-slate-350 text-slate-600'}">
              <input type="radio" name="delivery_point_radio" \\\${isChecked ? 'checked' : ''} class="mt-0.5 accent-indigo-600 cursor-pointer" />
              <div>
                <p class="text-xs font-bold text-slate-800 leading-tight">\\\${option.name}</p>
                <p class="text-[10px] text-slate-505 mt-1">\\\${option.description}</p>
              </div>
            </div>\`;
        });
        html += '  </div>';
        html += '</div>';
      }

      if (pickupPoints.length === 0 && homeDelivery.length === 0) {
        html = '<p class="text-xs text-slate-500 italic">Ingen leveringsmetoder tilgængelige for dette postnummer.</p>';
      }

      listContainer.innerHTML = html;
    }

    window.selectDeliveryOption = function(type, id, name, address) {
      selectedShipmondoDelivery = {
        type: type,
        id: id,
        name: name,
        address: address,
        carrier: selectedCarrierOption
      };

      // Reset active styles of all options
      const options = document.querySelectorAll('[id^="delivery-opt-"]');
      options.forEach(opt => {
        opt.className = "flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer bg-white border-slate-200 hover:border-slate-350 text-slate-600";
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = false;
      });

      // Highlight selected one
      const selectedId = 'delivery-opt-' + type + '-' + id;
      const selectedDiv = document.getElementById(selectedId);
      if (selectedDiv) {
        selectedDiv.className = "flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer bg-indigo-50/50 border-indigo-600 text-slate-800 font-bold";
        const radio = selectedDiv.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      }
    };

    window.submitLoginForm = function(event) {
      event.preventDefault();
      const email = document.getElementById('login-page-email').value.trim();
      const password = document.getElementById('login-page-password').value.trim();
      const errorMsg = document.getElementById('login-error-msg');

      if (errorMsg) errorMsg.style.display = 'none';

      const isLocalAdmin = (email.toLowerCase() === 'admin' || email.toLowerCase() === 'admin@mmlaseshop.dk') && password === 'admin';
      if (isLocalAdmin) {
        const adminUser = {
          email: 'admin@mmlaseshop.dk',
          name: 'Admin',
          phone: '12345678',
          address: 'Admin Center, DK'
        };
        localStorage.setItem('mm_lase_session', JSON.stringify(adminUser));
        loggedInUser = adminUser;
        updateUserStatusUI();
        prefillCheckoutForm();
        
        document.getElementById('login-page-email').value = '';
        document.getElementById('login-page-password').value = '';
        navigateToHash('shop/admin');
        return;
      }

      const accountsStr = localStorage.getItem('mm_lase_accounts') || '[]';
      const accounts = JSON.parse(accountsStr);
      const user = accounts.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);

      if (user) {
        localStorage.setItem('mm_lase_session', JSON.stringify(user));
        loggedInUser = user;
        updateUserStatusUI();
        prefillCheckoutForm();
        
        document.getElementById('login-page-email').value = '';
        document.getElementById('login-page-password').value = '';
        navigateToHash('shop');
      } else {
        if (errorMsg) {
          errorMsg.innerText = '⚠️ Ugyldig e-mail eller adgangskode. Prøv venligst igen.';
          errorMsg.style.display = 'block';
        }
      }
    };

    window.submitResetPasswordForm = function(event) {
      event.preventDefault();
      const email = document.getElementById('reset-page-email').value.trim();
      const password = document.getElementById('reset-page-password').value.trim();
      const confirmPassword = document.getElementById('reset-page-confirm-password').value.trim();
      
      const errorMsg = document.getElementById('reset-error-msg');
      const successContainer = document.getElementById('reset-success-container');
      const form = document.getElementById('reset-password-page-form');

      if (errorMsg) errorMsg.style.display = 'none';

      if (password !== confirmPassword) {
        if (errorMsg) {
          errorMsg.innerText = '⚠️ Adgangskoderne er ikke ens.';
          errorMsg.style.display = 'block';
        }
        return;
      }

      if (password.length < 6) {
        if (errorMsg) {
          errorMsg.innerText = '⚠️ Adgangskoden skal være mindst 6 tegn lang.';
          errorMsg.style.display = 'block';
        }
        return;
      }

      const accountsStr = localStorage.getItem('mm_lase_accounts') || '[]';
      const accounts = JSON.parse(accountsStr);
      const userIdx = accounts.findIndex(a => a.email.toLowerCase() === email.toLowerCase());

      if (userIdx !== -1) {
        accounts[userIdx].password = password;
        localStorage.setItem('mm_lase_accounts', JSON.stringify(accounts));

        if (form) form.style.display = 'none';
        if (successContainer) successContainer.style.display = 'block';

        const sessionStr = localStorage.getItem('mm_lase_session');
        if (sessionStr) {
          const sessionUser = JSON.parse(sessionStr);
          if (sessionUser.email.toLowerCase() === email.toLowerCase()) {
            sessionUser.password = password;
            localStorage.setItem('mm_lase_session', JSON.stringify(sessionUser));
            loggedInUser = sessionUser;
          }
        }
      }
    };

    window.submitCheckoutPageForm = function(event) {
      event.preventDefault();
      const name = document.getElementById('checkout-page-name').value.trim();
      const email = document.getElementById('checkout-page-email').value.trim();
      const phone = document.getElementById('checkout-page-phone').value.trim();
      
      const street = document.getElementById('checkout-page-address').value.trim();
      const postcodeField = document.getElementById('checkout-page-postcode');
      const cityField = document.getElementById('checkout-page-city');
      const postcode = postcodeField ? postcodeField.value.trim() : '';
      const city = cityField ? cityField.value.trim() : '';

      if (!name || !email || !phone || !street) {
        alert('Udfyld venligst alle personlige oplysninger.');
        return;
      }

      const finalAddress = loggedInUser ? street : \`\${street}, \${postcode} \${city}\`;
      if (!finalAddress || finalAddress.replace(/,/g, '').trim() === '') {
        alert('Udfyld venligst din leveringsadresse.');
        return;
      }

      if (selectedCarrierOption && !selectedShipmondoDelivery) {
        alert('Vælg venligst en leveringsmetode (Pakkeshop eller Hjemmelevering).');
        return;
      }

      let deliveryDetails = '';
      if (selectedShipmondoDelivery) {
        deliveryDetails = \`\n\nForsendelse: \${selectedShipmondoDelivery.carrier.toUpperCase()} - \${selectedShipmondoDelivery.name}\nLeveringsadresse: \${selectedShipmondoDelivery.address}\`;
      }

      let showEmailPopup = false;
      let tempPassVal = '';

      if (!loggedInUser) {
        const accountsStr = localStorage.getItem('mm_lase_accounts') || '[]';
        const accounts = JSON.parse(accountsStr);
        const exists = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());

        if (!exists) {
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          tempPassVal = 'MM-' + randomNum;
          
          const newAccount = {
            email: email.toLowerCase(),
            name: name,
            phone: phone,
            address: finalAddress,
            password: tempPassVal
          };
          
          accounts.push(newAccount);
          localStorage.setItem('mm_lase_accounts', JSON.stringify(accounts));
          showEmailPopup = true;
        }
      }

      // Construct Order Object
      const orderSubtotal = shopCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const orderIdSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderId = 'MM-ORD-' + orderIdSuffix;
      const orderDate = new Date().toLocaleString('da-DK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const newOrder = {
        id: orderId,
        date: orderDate,
        customer: {
          name: name,
          email: email,
          phone: phone,
          address: finalAddress
        },
        items: JSON.parse(JSON.stringify(shopCart)),
        subtotal: orderSubtotal,
        shipping: selectedCarrierOption && selectedShipmondoDelivery ? {
          carrier: selectedCarrierOption,
          type: selectedShipmondoDelivery.type,
          id: selectedShipmondoDelivery.id,
          name: selectedShipmondoDelivery.name,
          address: selectedShipmondoDelivery.address
        } : null,
        total: orderSubtotal,
        status: 'modtaget'
      };

      const currentOrdersStr = localStorage.getItem('mm_lase_orders') || '[]';
      try {
        const currentOrders = JSON.parse(currentOrdersStr);
        currentOrders.unshift(newOrder);
        localStorage.setItem('mm_lase_orders', JSON.stringify(currentOrders));
      } catch (err) {
        console.error('Failed to save order to localStorage', err);
      }

      shopCart = [];
      renderCart();

      if (showEmailPopup) {
        const emailPopup = document.getElementById('simulated-email-popup');
        const emailTo = document.getElementById('email-to-field');
        const emailSub = document.getElementById('email-subject-field');
        const emailBodyEmail = document.getElementById('email-body-login-email');
        const emailBodyPass = document.getElementById('email-body-temp-pass');
        const resetBtn = document.getElementById('email-reset-link-btn');

        if (emailTo) emailTo.innerText = email;
        if (emailSub) emailSub.innerText = 'Velkommen til MM Låseshop - Din konto er oprettet!';
        if (emailBodyEmail) emailBodyEmail.innerText = email;
        if (emailBodyPass) emailBodyPass.innerText = tempPassVal;
        
        // Append delivery details to body
        const emailBodyPre = document.querySelector('#simulated-email-popup font-mono');
        if (emailBodyPre) {
          // If there's an element displaying the body text, we can update it
          // Or since the body text is constructed dynamically in react, we can let it be
        }

        if (resetBtn) {
          resetBtn.onclick = function() {
            closeEmailPopup();
            navigateToHash('shop/reset-password?email=' + encodeURIComponent(email));
          };
        }

        if (emailPopup) {
          emailPopup.classList.remove('opacity-0', 'pointer-events-none');
        }
      } else {
        const popup = document.getElementById('checkout-success-popup');
        if (popup) {
          popup.classList.remove('opacity-0', 'pointer-events-none');
        }
      }

      if (!loggedInUser) {
        document.getElementById('checkout-page-name').value = '';
        document.getElementById('checkout-page-email').value = '';
        document.getElementById('checkout-page-address').value = '';
        document.getElementById('checkout-page-phone').value = '';
        if (postcodeField) postcodeField.value = '';
        if (cityField) cityField.value = '';
      }
      
      // Reset shipmondo options in export UI
      selectedCarrierOption = null;
      selectedShipmondoDelivery = null;
      updateCarrierButtonsUI();
      const optionsContainer = document.getElementById('shipmondo-options-container');
      if (optionsContainer) optionsContainer.style.display = 'none';
    };

    window.closeSuccessPopup = function() {
      const popup = document.getElementById('checkout-success-popup');
      if (popup) {
        popup.classList.add('opacity-0', 'pointer-events-none');
      }
      navigateToHash('shop');
    };

    window.closeEmailPopup = function() {
      const emailPopup = document.getElementById('simulated-email-popup');
      if (emailPopup) {
        emailPopup.classList.add('opacity-0', 'pointer-events-none');
      }
      const popup = document.getElementById('checkout-success-popup');
      if (popup) {
        popup.classList.remove('opacity-0', 'pointer-events-none');
      }
    };

    window.toggleCartDrawer = function() { navigateToHash('shop/cart'); };
    window.navigateToHash = navigateToHash;

    function renderShop() {
      const hash = window.location.hash || '';
      
      const views = document.querySelectorAll('.shop-view');
      views.forEach(v => v.style.display = 'none');

      const titleEl = document.getElementById('shop-view-title');
      
      const sep1 = document.getElementById('breadcrumb-sep-1');
      const breadCat = document.getElementById('breadcrumb-cat');
      const sep2 = document.getElementById('breadcrumb-sep-2');
      const breadSubcat = document.getElementById('breadcrumb-subcat');
      const sep3 = document.getElementById('breadcrumb-sep-3');
      const breadBrand = document.getElementById('breadcrumb-brand');

      if (sep1) sep1.style.display = 'none';
      if (breadCat) breadCat.style.display = 'none';
      if (sep2) sep2.style.display = 'none';
      if (breadSubcat) breadSubcat.style.display = 'none';
      if (sep3) sep3.style.display = 'none';
      if (breadBrand) breadBrand.style.display = 'none';

      if (titleEl) titleEl.innerText = 'Låse & Sikring Butik';

      if (!hash.startsWith('#shop') || hash === '#shop') {
        const categoriesView = document.getElementById('shop-view-categories');
        if (categoriesView) categoriesView.style.display = 'block';

        const categoriesGrid = document.getElementById('shop-categories-grid');
        if (categoriesGrid) {
          let catsHTML = '';
          WEBSHOP_CATEGORIES.forEach((cat, index) => {
            const icon = cat.icon || '📦';
            const imgUrl = cat.image || 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80';
            const isEven = index % 2 === 0;
            if (isEven) {
              catsHTML += \`
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden p-6 md:p-8 items-center text-left hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-center bg-white rounded-2xl p-4 border border-slate-150 h-56">
                    <img src="\${imgUrl}" alt="\${cat.name}" class="max-h-full max-w-full object-contain rounded-xl" />
                  </div>
                  <div class="space-y-4">
                    <div class="flex items-center gap-2">
                      <span class="text-2xl">\${icon}</span>
                      <h4 class="text-2xl font-extrabold text-slate-900 leading-tight uppercase tracking-tight">\${cat.name}</h4>
                    </div>
                    <p class="text-slate-500 text-xs font-semibold leading-relaxed">\${cat.description || ''}</p>
                    <button onclick="navigateToHash('shop/cat/\${cat.id}')" class="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors border-none cursor-pointer">
                      Se produkter
                    </button>
                  </div>
                </div>\`;
            } else {
              catsHTML += \`
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden p-6 md:p-8 items-center text-left hover:shadow-md transition-shadow">
                  <div class="space-y-4 order-2 md:order-1">
                    <div class="flex items-center gap-2">
                      <span class="text-2xl">\${icon}</span>
                      <h4 class="text-2xl font-extrabold text-slate-900 leading-tight uppercase tracking-tight">\${cat.name}</h4>
                    </div>
                    <p class="text-slate-500 text-xs font-semibold leading-relaxed">\${cat.description || ''}</p>
                    <button onclick="navigateToHash('shop/cat/\${cat.id}')" class="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors border-none cursor-pointer">
                      Se produkter
                    </button>
                  </div>
                  <div class="flex items-center justify-center bg-white rounded-2xl p-4 border border-slate-150 h-56 order-1 md:order-2">
                    <img src="\${imgUrl}" alt="\${cat.name}" class="max-h-full max-w-full object-contain rounded-xl" />
                  </div>
                </div>\`;
            }
          });
          categoriesGrid.innerHTML = catsHTML;
        }
      } else if (hash.startsWith('#shop/cat/')) {
        const catId = hash.replace('#shop/cat/', '');
        const cat = WEBSHOP_CATEGORIES.find(c => c.id === catId);
        
        if (cat) {
          if (titleEl) titleEl.innerText = cat.name;
          
          if (sep1) sep1.style.display = 'inline';
          if (breadCat) {
            breadCat.innerText = cat.name;
            breadCat.style.display = 'inline';
            breadCat.onclick = () => navigateToHash('shop/cat/' + catId);
          }
        }

        const subcatsView = document.getElementById('shop-view-subcategories');
        if (subcatsView) subcatsView.style.display = 'block';

        const subcatsGrid = document.getElementById('shop-subcategories-grid');
        if (subcatsGrid) {
          const filteredSubcats = WEBSHOP_SUBCATEGORIES.filter(s => s.categoryId === catId);
          let subcatsHTML = '';
          if (filteredSubcats.length === 0) {
            subcatsHTML = '<div class="col-span-full text-center py-12 text-slate-400 text-xs">Ingen underkategorier fundet i denne kategori.</div>';
          } else {
            filteredSubcats.forEach(sub => {
              subcatsHTML += \`
                <div onclick="navigateToHash('shop/subcat/\${sub.id}')" class="group bg-white rounded-2xl border border-slate-150 p-4 sm:p-6 shadow-xs hover:shadow-lg transition-all cursor-pointer text-left flex flex-col justify-between">
                  <div>
                    <div class="text-2xl mb-4">📂</div>
                    <h4 class="text-base font-extrabold text-slate-900 group-hover:text-indigo-650 transition-colors">\${sub.name}</h4>
                    <p class="text-slate-555 text-xs mt-2 leading-relaxed line-clamp-2">\${sub.description || ''}</p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-[9px] font-bold text-slate-400 uppercase">Se mærker</span>
                    <span class="text-indigo-605 text-xs font-black">&rarr;</span>
                  </div>
                </div>\`;
            });
          }
          subcatsGrid.innerHTML = subcatsHTML;
        }

      } else if (hash.startsWith('#shop/subcat/')) {
        const subcatId = hash.replace('#shop/subcat/', '');
        const subcat = WEBSHOP_SUBCATEGORIES.find(s => s.id === subcatId);

        if (subcat) {
          const parentCat = WEBSHOP_CATEGORIES.find(c => c.id === subcat.categoryId);
          if (titleEl) titleEl.innerText = subcat.name;

          if (parentCat) {
            if (sep1) sep1.style.display = 'inline';
            if (breadCat) {
              breadCat.innerText = parentCat.name;
              breadCat.style.display = 'inline';
              breadCat.onclick = () => navigateToHash('shop/cat/' + parentCat.id);
            }
          }
          if (sep2) sep2.style.display = 'inline';
          if (breadSubcat) {
            breadSubcat.innerText = subcat.name;
            breadSubcat.style.display = 'inline';
            breadSubcat.onclick = () => navigateToHash('shop/subcat/' + subcatId);
          }

          const title = document.getElementById('detail-subcat-title');
          const desc = document.getElementById('detail-subcat-desc');
          if (title) title.innerText = subcat.name;
          if (desc) desc.innerText = subcat.description;

          const backBtn = document.getElementById('subcat-back-btn');
          if (backBtn && parentCat) {
            backBtn.onclick = () => navigateToHash('shop/cat/' + parentCat.id);
          }

          const brandsBlock = document.getElementById('detail-brands-block');
          const directBlock = document.getElementById('detail-direct-products-block');
          const recBlock = document.getElementById('detail-recommendations-block');

          if (!subcat.brandIds || subcat.brandIds.length === 0) {
            if (brandsBlock) brandsBlock.style.display = 'none';
            if (directBlock) directBlock.style.display = 'block';
            if (recBlock) recBlock.style.display = 'block';

            const directProductsGrid = document.getElementById('detail-direct-products-grid');
            if (directProductsGrid) {
              const filteredProducts = WEBSHOP_PRODUCTS.filter(p => p.subcategoryId === subcatId);
              let productsHTML = '';
              if (filteredProducts.length === 0) {
                productsHTML = '<div class="col-span-full text-center py-12 text-slate-400 text-xs">Der blev ikke fundet nogen produkter i denne kategori.</div>';
              } else {
                filteredProducts.forEach(p => {
                  const brand = WEBSHOP_BRANDS.find(b => b.id === p.brandId);
                  const brandName = brand ? brand.name : '';
                  const badgeHTML = p.badge ? '<span class="absolute top-3 left-3 bg-[#0f172a] text-[#FFC502] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full z-10">' + p.badge + '</span>' : (p.badges && p.badges.length > 0 ? '<span class="absolute top-3 left-3 bg-[#0f172a] text-[#FFC502] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full z-10">' + p.badges[0] + '</span>' : '');
                  productsHTML += \`
                    <div class="group relative bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                      \${badgeHTML}
                      <div onclick="navigateToHash('shop/product/\${p.id}')" class="relative w-full aspect-square bg-slate-50 overflow-hidden cursor-pointer">
                        <img src="\${p.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div class="p-6 flex-1 flex flex-col justify-between">
                        <div onclick="navigateToHash('shop/product/\${p.id}')" class="cursor-pointer">
                          <div class="text-[10px] text-indigo-650 font-bold uppercase tracking-wider mb-1">\${brandName}</div>
                          <h4 class="text-base font-extrabold text-slate-900 leading-snug tracking-tight mb-2 truncate group-hover:text-indigo-600 transition-colors">\${p.name}</h4>
                          <p class="text-xs text-slate-555 leading-relaxed line-clamp-3 mb-4">\${p.description}</p>
                        </div>
                        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
                          <div class="flex flex-col">
                            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pris</span>
                            <span class="text-base font-black text-slate-950 mt-1 leading-none">\${p.price.toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                          </div>
                          <button onclick="navigateToHash('shop/product/\${p.id}')" class="bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-none flex items-center gap-1.5 select-none shrink-0">
                            <span>Se Produkt</span>
                          </button>
                        </div>
                      </div>
                    </div>\`;
                });
              }
              directProductsGrid.innerHTML = productsHTML;
            }

            const recGrid = document.getElementById('detail-recommendations-grid');
            if (recGrid) {
              const otherSubcats = WEBSHOP_SUBCATEGORIES.filter(s => s.categoryId === subcat.categoryId && s.id !== subcatId);
              let recsHTML = '';
              otherSubcats.forEach(s => {
                let icon = '🗄️';
                if (s.id === 'vaerdiskabe') icon = '🏢';
                if (s.id === 'brandskabe') icon = '🔥';
                if (s.id === 'noegleskabe') icon = '🔑';

                recsHTML += \`
                  <div onclick="navigateToHash('shop/subcat/\${s.id}')" class="group flex items-center gap-4 p-4 rounded-2xl border border-slate-150 bg-slate-50 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                    <div class="text-2xl">\${icon}</div>
                    <div class="flex-1 min-w-0">
                      <h4 class="text-sm font-extrabold text-slate-900 group-hover:text-indigo-650 transition-colors truncate">\${s.name}</h4>
                      <p class="text-slate-505 text-[11px] truncate">\${s.description}</p>
                    </div>
                    <span class="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>\`;
              });
              recGrid.innerHTML = recsHTML;
            }
          } else {
            if (brandsBlock) brandsBlock.style.display = 'block';
            if (directBlock) directBlock.style.display = 'none';
            if (recBlock) recBlock.style.display = 'none';

            const brandsContainer = document.getElementById('detail-brands-container');
            if (brandsContainer) {
              const linkedBrands = WEBSHOP_BRANDS.filter(b => subcat.brandIds.includes(b.id));
              let brandsHTML = '';
              linkedBrands.forEach(b => {
                brandsHTML += \`
                  <div onclick="navigateToHash('shop/brand/\${subcatId}/\${b.id}')" class="group flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-150 bg-slate-50 hover:bg-white hover:shadow-md transition-all cursor-pointer text-center">
                    <span class="text-xs font-black text-slate-800 group-hover:text-indigo-650 transition-colors uppercase tracking-wider">\${b.name}</span>
                    <span class="text-[9px] text-slate-400 mt-1 font-semibold">Vis produkter</span>
                  </div>\`;
              });
              brandsContainer.innerHTML = brandsHTML;
            }
          }
        }

        const detailView = document.getElementById('shop-view-subcategory-detail');
        if (detailView) detailView.style.display = 'block';

      } else if (hash.startsWith('#shop/brand/')) {
        const parts = hash.replace('#shop/brand/', '').split('/');
        const subcatId = parts[0];
        const brandId = parts[1];

        const subcat = WEBSHOP_SUBCATEGORIES.find(s => s.id === subcatId);
        const brand = WEBSHOP_BRANDS.find(b => b.id === brandId);

        if (subcat && brand) {
          const parentCat = WEBSHOP_CATEGORIES.find(c => c.id === subcat.categoryId);
          if (titleEl) titleEl.innerText = brand.name + ' - ' + subcat.name;

          if (parentCat) {
            if (sep1) sep1.style.display = 'inline';
            if (breadCat) {
              breadCat.innerText = parentCat.name;
              breadCat.style.display = 'inline';
              breadCat.onclick = () => navigateToHash('shop/cat/' + parentCat.id);
            }
          }
          if (sep2) sep2.style.display = 'inline';
          if (breadSubcat) {
            breadSubcat.innerText = subcat.name;
            breadSubcat.style.display = 'inline';
            breadSubcat.onclick = () => navigateToHash('shop/subcat/' + subcatId);
          }
          if (sep3) sep3.style.display = 'inline';
          if (breadBrand) {
            breadBrand.innerText = brand.name;
            breadBrand.style.display = 'inline';
          }

          const backBtn = document.getElementById('brand-back-btn');
          if (backBtn) {
            backBtn.onclick = () => navigateToHash('shop/subcat/' + subcatId);
          }

          const productsGrid = document.getElementById('brand-products-grid');
          if (productsGrid) {
            const filteredProducts = WEBSHOP_PRODUCTS.filter(p => p.subcategoryId === subcatId && p.brandId === brandId);
            let productsHTML = '';
            
            if (filteredProducts.length === 0) {
              productsHTML = \`<div class="col-span-full text-center py-12 text-slate-400 text-xs">Der blev ikke fundet nogen produkter for dette mærke under denne kategori.</div>\`;
            } else {
              filteredProducts.forEach(p => {
                const badgeHTML = p.badge ? \`<span class="absolute top-3 left-3 bg-[#0f172a] text-[#FFC502] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full z-10">\${p.badge}</span>\` : '';
                productsHTML += \`
                  <div class="group relative bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                    \${badgeHTML}
                    <div onclick="navigateToHash('shop/product/\${p.id}')" class="relative w-full aspect-square bg-slate-50 overflow-hidden cursor-pointer">
                      <img src="\${p.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                      <div onclick="navigateToHash('shop/product/\${p.id}')" class="cursor-pointer">
                        <div class="text-[10px] text-indigo-650 font-bold uppercase tracking-wider mb-1">\${brand.name}</div>
                        <h4 class="text-base font-extrabold text-slate-900 leading-snug tracking-tight mb-2 truncate group-hover:text-indigo-600 transition-colors">\${p.name}</h4>
                        <p class="text-xs text-slate-555 leading-relaxed line-clamp-3 mb-4">\${p.description}</p>
                      </div>
                      <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
                        <div class="flex flex-col">
                          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pris</span>
                          <span class="text-base font-black text-slate-950 mt-1 leading-none">\${p.price.toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                        </div>
                        <button onclick="navigateToHash('shop/product/\${p.id}')" class="bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-none flex items-center gap-1.5 select-none shrink-0">
                          <span>Se Produkt</span>
                        </button>
                      </div>
                    </div>
                  </div>\`;
              });
            }
            productsGrid.innerHTML = productsHTML;
          }
        }

        const brandView = document.getElementById('shop-view-brand-products');
        if (brandView) brandView.style.display = 'block';

      } else if (hash.startsWith('#shop/product/')) {
        const productId = hash.replace('#shop/product/', '');
        const product = shopProducts.find(p => p.id === productId) || WEBSHOP_PRODUCTS.find(p => p.id === productId);
        if (product) {
          const brand = WEBSHOP_BRANDS.find(b => b.id === product.brandId);
          if (titleEl) titleEl.innerText = product.name;

          const subcat = WEBSHOP_SUBCATEGORIES.find(s => s.id === product.subcategoryId);
          if (subcat) {
            const parentCat = WEBSHOP_CATEGORIES.find(c => c.id === subcat.categoryId);
            if (parentCat) {
              if (sep1) sep1.style.display = 'inline';
              if (breadCat) {
                breadCat.innerText = parentCat.name;
                breadCat.style.display = 'inline';
                breadCat.onclick = () => navigateToHash('shop/cat/' + parentCat.id);
              }
            }
            if (sep2) sep2.style.display = 'inline';
            if (breadSubcat) {
              breadSubcat.innerText = subcat.name;
              breadSubcat.style.display = 'inline';
              breadSubcat.onclick = () => navigateToHash('shop/subcat/' + subcat.id);
            }
          }
          if (brand && (!subcat || subcat.categoryId !== 'pengeskabe')) {
            if (sep3) sep3.style.display = 'inline';
            if (breadBrand) {
              breadBrand.innerText = brand.name;
              breadBrand.style.display = 'inline';
              breadBrand.onclick = () => navigateToHash('shop/brand/' + product.subcategoryId + '/' + brand.id);
            }
          } else {
            if (sep3) sep3.style.display = 'none';
            if (breadBrand) breadBrand.style.display = 'none';
          }

          const backBtn = document.getElementById('product-detail-back-btn');
          if (backBtn) {
            if (subcat && subcat.categoryId === 'pengeskabe') {
              backBtn.onclick = () => navigateToHash('shop/subcat/' + product.subcategoryId);
            } else if (brand) {
              backBtn.onclick = () => navigateToHash('shop/brand/' + product.subcategoryId + '/' + brand.id);
            }
          }

          const container = document.getElementById('product-detail-container');
          if (container) {
            const formattedPrice = product.price.toLocaleString('da-DK', { minimumFractionDigits: 2 });
            const badgesHTML = product.badges ? product.badges.map(b => \`<span class="px-2.5 py-1 text-[9px] font-bold bg-amber-400 text-slate-955 uppercase rounded-md shadow-md">\${b}</span>\`).join(' ') : '';
            container.innerHTML = \`
              <!-- Product Image -->
              <div class="relative rounded-2xl overflow-hidden bg-white border border-slate-150">
                <img src="\${product.image}" class="w-full h-auto object-cover max-h-[400px]" />
                <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  \${badgesHTML}
                </div>
              </div>

              <!-- Product Info & Purchase -->
              <div class="flex flex-col justify-between space-y-6">
                <div class="space-y-4">
                  <div>
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Låsesystem & Sikring</span>
                    <h2 class="text-2xl font-extrabold text-slate-900 uppercase mt-1 leading-tight">\${product.name}</h2>
                  </div>

                  <div class="flex items-baseline gap-2">
                    <span class="text-3xl font-black text-indigo-650 font-mono">\${formattedPrice} DKK</span>
                    <span class="text-xs text-slate-400 font-bold uppercase tracking-wider">inkl. moms</span>
                  </div>

                  <p class="text-sm text-slate-600 leading-relaxed font-medium">
                    \${product.description}
                  </p>

                  <div class="border-t border-slate-150 pt-4 space-y-2 text-left">
                    <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-900">Specifikationer</h4>
                    <ul class="text-xs text-slate-505 space-y-1.5 list-none p-0">
                      <li class="flex items-center gap-2">
                        <span class="text-emerald-500">✓</span>
                        <span>Sikringsklasse: Højeste godkendte standard</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <span class="text-emerald-500">✓</span>
                        <span>Inkl. nøglekort og kopisikring</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <span class="text-emerald-500">✓</span>
                        <span>Mulighed for montering af autoriseret låsesmed</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button onclick="addToCart('\${product.id}')" class="w-full py-3.5 rounded-2xl bg-indigo-650 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 active:scale-98 transition-all shadow-lg border-none cursor-pointer">
                  <span>Tilføj til kurv</span>
                </button>
              </div>\`;
          }
        }

        const productDetailView = document.getElementById('shop-view-product-detail');
        if (productDetailView) productDetailView.style.display = 'block';

      } else if (hash === '#shop/cart') {
        if (titleEl) titleEl.innerText = 'Din Indkøbskurv';
        
        const cartView = document.getElementById('shop-view-cart');
        if (cartView) cartView.style.display = 'block';
        renderCart();

      } else if (hash === '#shop/checkout') {
        if (titleEl) titleEl.innerText = 'Gennemfør Bestilling';

        const checkoutView = document.getElementById('shop-view-checkout');
        if (checkoutView) checkoutView.style.display = 'block';
        renderCart();

      } else if (hash === '#shop/login') {
        if (titleEl) titleEl.innerText = 'Log Ind';
        
        const loginView = document.getElementById('shop-view-login');
        if (loginView) loginView.style.display = 'block';
        
        const loginErrorMsg = document.getElementById('login-error-msg');
        if (loginErrorMsg) loginErrorMsg.style.display = 'none';

      } else if (hash.startsWith('#shop/reset-password')) {
        if (titleEl) titleEl.innerText = 'Nulstil Adgangskode';
        
        const resetView = document.getElementById('shop-view-reset-password');
        if (resetView) resetView.style.display = 'block';

        const resetErrorMsg = document.getElementById('reset-error-msg');
        if (resetErrorMsg) resetErrorMsg.style.display = 'none';
        
        const resetSuccessContainer = document.getElementById('reset-success-container');
        if (resetSuccessContainer) resetSuccessContainer.style.display = 'none';
        
        const resetForm = document.getElementById('reset-password-page-form');
        if (resetForm) resetForm.style.display = 'block';

        const emailParam = new URLSearchParams(hash.split('?')[1] || '').get('email');
        const resetEmailField = document.getElementById('reset-page-email');
        if (resetEmailField) {
          resetEmailField.value = emailParam || '';
        }
      } else if (hash === '#shop/admin') {
        const isAdmin = loggedInUser && loggedInUser.email === 'admin@mmlaseshop.dk';
        if (!isAdmin) {
          navigateToHash('shop');
          return;
        }
        if (titleEl) titleEl.innerText = 'Admin Kontrolpanel';
        const adminView = document.getElementById('shop-view-admin');
        if (adminView) adminView.style.display = 'block';
        renderAdminDashboard();
      } else if (hash === '#shop/profile') {
        if (!loggedInUser) {
          navigateToHash('shop/login');
          return;
        }
        if (titleEl) titleEl.innerText = 'Min Profil';
        const profileView = document.getElementById('shop-view-profile');
        if (profileView) profileView.style.display = 'block';
        renderUserProfile();
      } else if (hash.startsWith('#shop/search/')) {
        const query = decodeURIComponent(hash.replace('#shop/search/', ''));
        if (titleEl) titleEl.innerText = 'Søgning: ' + query;
        
        const searchView = document.getElementById('shop-view-search-results');
        if (searchView) searchView.style.display = 'block';
        
        const queryTitle = document.getElementById('search-results-query-title');
        if (queryTitle) queryTitle.innerText = 'Søgeresultater for "' + query + '"';

        const searchInput = document.getElementById('shop-search-input');
        if (searchInput) searchInput.value = query;
        
        const filtered = WEBSHOP_PRODUCTS.filter(p => {
          const q = query.toLowerCase().trim();
          if (!q) return false;
          if (p.name.toLowerCase().includes(q)) return true;
          if (p.description.toLowerCase().includes(q)) return true;
          if (p.color && p.color.toLowerCase().includes(q)) return true;
          if (p.shape && p.shape.toLowerCase().includes(q)) return true;
          if (p.size && p.size.toLowerCase().includes(q)) return true;
          if (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) return true;
          
          const brand = WEBSHOP_BRANDS.find(b => b.id === p.brandId);
          if (brand && brand.name.toLowerCase().includes(q)) return true;
          
          const subcat = WEBSHOP_SUBCATEGORIES.find(s => s.id === p.subcategoryId);
          if (subcat) {
            if (subcat.name.toLowerCase().includes(q)) return true;
            const cat = WEBSHOP_CATEGORIES.find(c => c.id === subcat.categoryId);
            if (cat && cat.name.toLowerCase().includes(q)) return true;
          }
          return false;
        });

        const countLabel = document.getElementById('search-results-count-label');
        if (countLabel) countLabel.innerText = 'Fundet ' + filtered.length + ' produkter';

        const grid = document.getElementById('search-results-grid');
        if (grid) {
          let gridHTML = '';
          if (filtered.length === 0) {
            gridHTML = '<div class="col-span-full text-center py-12 text-slate-400 text-xs">Ingen produkter matcher din søgning.<br/><span class="text-slate-500 text-[10px] mt-1 block">Prøv med andre søgeord (f.eks. cylinder, hængelås, sølv, rund, kube).</span></div>';
          } else {
            filtered.forEach(p => {
              const brand = WEBSHOP_BRANDS.find(b => b.id === p.brandId);
              const brandName = brand ? brand.name : '';
              const badgeHTML = p.badge ? \`<span class="absolute top-3 left-3 bg-[#0f172a] text-[#FFC502] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full z-10">\${p.badge}</span>\` : (p.badges && p.badges.length > 0 ? \`<span class="absolute top-3 left-3 bg-[#0f172a] text-[#FFC502] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full z-10">\${p.badges[0]}</span>\` : '');
              
              gridHTML += \`
                <div class="group relative bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  \${badgeHTML}
                  <div onclick="navigateToHash('shop/product/\${p.id}')" class="relative w-full aspect-square bg-slate-50 overflow-hidden cursor-pointer">
                    <img src="\${p.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div class="p-6 flex-1 flex flex-col justify-between">
                    <div onclick="navigateToHash('shop/product/\${p.id}')" class="cursor-pointer">
                      <div class="text-[10px] text-indigo-650 font-bold uppercase tracking-wider mb-1">\${brandName}</div>
                      <h4 class="text-base font-extrabold text-slate-900 leading-snug tracking-tight mb-2 truncate group-hover:text-indigo-600 transition-colors">\${p.name}</h4>
                      <p class="text-xs text-slate-555 leading-relaxed line-clamp-3 mb-4">\${p.description}</p>
                    </div>
                    <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
                      <div class="flex flex-col">
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pris</span>
                        <span class="text-base font-black text-slate-950 mt-1 leading-none">\${p.price.toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                      </div>
                      <button onclick="navigateToHash('shop/product/\${p.id}')" class="bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-none flex items-center gap-1.5 select-none shrink-0">
                        <span>Se Produkt</span>
                      </button>
                    </div>
                  </div>
                </div>\`;
            });
          }
          grid.innerHTML = gridHTML;
        }

        if (sep1) {
          sep1.style.display = 'inline';
          if (breadCat) {
            breadCat.innerText = 'Søgning: ' + query;
            breadCat.style.display = 'inline';
            breadCat.onclick = null;
          }
        }
      }
    }

    function renderUserProfile() {
      const infoContainer = document.getElementById('profile-info-container');
      const ordersContainer = document.getElementById('profile-orders-list-container');
      if (!infoContainer || !ordersContainer || !loggedInUser) return;

      // Render profile info
      infoContainer.innerHTML = '<div>' +
        '<span class="text-[10px] text-slate-400 uppercase font-bold block">Navn</span>' +
        '<span class="text-slate-800 font-semibold text-sm">' + loggedInUser.name + '</span>' +
      '</div>' +
      '<div>' +
        '<span class="text-[10px] text-slate-400 uppercase font-bold block">E-mail</span>' +
        '<span class="text-slate-800 font-semibold">' + loggedInUser.email + '</span>' +
      '</div>' +
      '<div>' +
        '<span class="text-[10px] text-slate-400 uppercase font-bold block">Telefon</span>' +
        '<span class="text-slate-800 font-semibold">' + (loggedInUser.phone || 'Ikke angivet') + '</span>' +
      '</div>' +
      '<div>' +
        '<span class="text-[10px] text-slate-400 uppercase font-bold block">Standardadresse</span>' +
        '<span class="text-slate-800 font-semibold leading-relaxed block">' + (loggedInUser.address || 'Ikke angivet') + '</span>' +
      '</div>';

      // Load orders list
      const ordersStr = localStorage.getItem('mm_lase_orders') || '[]';
      let ordersList = [];
      try {
        ordersList = JSON.parse(ordersStr);
      } catch (e) {
        console.error(e);
      }
      const userOrders = ordersList.filter(o => o.customer.email.toLowerCase() === loggedInUser.email.toLowerCase());

      if (userOrders.length === 0) {
        ordersContainer.innerHTML = '<div class="py-8 text-center text-slate-400 text-xs">Du har endnu ikke foretaget nogen ordrer hos os.</div>';
      } else {
        let html = '';
        userOrders.forEach(o => {
          const isRefunded = o.status === 'annulleret' || o.refundRequested;
          
          let itemsHTML = '';
          o.items.forEach(item => {
            const itemPrice = item.product.price * item.quantity;
            itemsHTML += '<div class="flex justify-between items-center text-xs text-slate-650">' +
              '<span>' + item.quantity + 'x ' + item.product.name + '</span>' +
              '<span class="font-mono text-slate-500">' + itemPrice.toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK</span>' +
            '</div>';
          });

          let badgeColor = '';
          let badgeText = '';
          if (o.status === 'modtaget') {
            badgeColor = 'bg-indigo-50 text-indigo-600 border border-indigo-100';
            badgeText = 'Modtaget';
          } else if (o.status === 'godkendt') {
            badgeColor = 'bg-amber-50 text-amber-600 border border-amber-100';
            badgeText = 'Godkendt';
          } else if (o.status === 'afsendt') {
            badgeColor = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
            badgeText = 'Afsendt';
          } else {
            badgeColor = 'bg-rose-50 text-rose-600 border border-rose-100';
            badgeText = 'Annulleret';
          }

          const refundBadge = o.refundRequested ? '<span class="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100 text-[8px] font-black uppercase tracking-wider">Refundering Anmodet</span>' : '';
          const refundButton = !isRefunded ? '<button onclick="requestRefundStatic(\\\'' + o.id + '\\\')" class="px-3 py-1.5 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-500 hover:border-rose-200 border border-slate-200 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer">Anmod om refundering</button>' : '';
          const refundReasonHTML = (o.refundRequested && o.refundReason) ? '<div class="p-2 bg-rose-50/50 border border-rose-100 text-[11px] rounded-lg text-slate-500 leading-normal mt-2"><span class="font-bold text-rose-500 uppercase text-[9px] tracking-wider block mb-0.5">Din refunderingsårsag</span>"' + o.refundReason + '"</div>' : '';

          html += '<div class="border border-slate-150 bg-white rounded-2xl p-4 space-y-3">' +
            '<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">' +
              '<div>' +
                '<span class="font-mono text-xs font-black text-slate-800">' + o.id + '</span>' +
                '<span class="text-[10px] text-slate-400 block">' + o.date + '</span>' +
              '</div>' +
              '<div class="flex items-center gap-2">' +
                '<span class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ' + badgeColor + '">' + badgeText + '</span>' +
                refundBadge +
              '</div>' +
            '</div>' +
            '<div class="space-y-1.5">' + itemsHTML + '</div>' +
            '<div class="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100">' +
              '<div>' +
                '<span class="text-[10px] text-slate-400 uppercase font-bold block">Total Beløb</span>' +
                '<span class="text-sm font-black text-slate-800 font-mono">' + o.subtotal.toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK</span>' +
              '</div>' +
              refundButton +
            '</div>' +
            refundReasonHTML +
          '</div>';
        });
        ordersContainer.innerHTML = html;
      }
    }

    window.requestRefundStatic = function(orderId) {
      const reason = prompt('Indtast venligst årsagen til din refunderingsanmodning:');
      if (reason !== null) {
        const ordersStr = localStorage.getItem('mm_lase_orders') || '[]';
        try {
          const ordersList = JSON.parse(ordersStr);
          const updated = ordersList.map(o => {
            if (o.id === orderId) {
              return Object.assign({}, o, { refundRequested: true, refundReason: reason || 'Kunden anmodede om refundering.' });
            }
            return o;
          });
          localStorage.setItem('mm_lase_orders', JSON.stringify(updated));
          renderUserProfile();
        } catch (e) {
          console.error(e);
        }
      }
    };

    let activeAdminFilter = 'all';

    function renderAdminDashboard() {
      const ordersStr = localStorage.getItem('mm_lase_orders') || '[]';
      let ordersList = [];
      try {
        ordersList = JSON.parse(ordersStr);
      } catch (e) {
        console.error(e);
      }

      const totalRevenue = ordersList
        .filter(o => o.status !== 'annulleret')
        .reduce((sum, o) => sum + o.total, 0);
      
      const newOrdersCount = ordersList.filter(o => o.status === 'modtaget').length;
      const processingCount = ordersList.filter(o => o.status === 'godkendt').length;

      const kpiRev = document.getElementById('kpi-revenue');
      const kpiTot = document.getElementById('kpi-total-count');
      const kpiNew = document.getElementById('kpi-new-count');
      const kpiProc = document.getElementById('kpi-processing-count');

      if (kpiRev) kpiRev.innerText = totalRevenue.toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK';
      if (kpiTot) kpiTot.innerText = ordersList.length + ' stk';
      if (kpiNew) kpiNew.innerText = newOrdersCount + ' stk';
      if (kpiProc) kpiProc.innerText = processingCount + ' stk';

      const filtersBar = document.getElementById('admin-filters-bar');
      if (filtersBar) {
        const filters = [
          { code: 'all', label: 'Alle Ordrer', count: ordersList.length },
          { code: 'modtaget', label: 'Nye (Modtaget)', count: ordersList.filter(o => o.status === 'modtaget').length },
          { code: 'godkendt', label: 'Godkendte', count: ordersList.filter(o => o.status === 'godkendt').length },
          { code: 'afsendt', label: 'Afsendte', count: ordersList.filter(o => o.status === 'afsendt').length },
          { code: 'annulleret', label: 'Annullerede', count: ordersList.filter(o => o.status === 'annulleret').length }
        ];

        let filtersHTML = '';
        filters.forEach(f => {
          const isActive = activeAdminFilter === f.code;
          const activeClass = isActive 
            ? 'bg-indigo-650 text-white border-indigo-650 shadow-md' 
            : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700';
          filtersHTML += \`
            <button onclick="setAdminFilter('\\\${f.code}')" class="px-3 py-1.5 rounded-xl border text-[11px] font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer \\\${activeClass}">
              \\\${f.label} (\\\${f.count})
            </button>\`;
        });
        filtersBar.innerHTML = filtersHTML;
      }

      const listContainer = document.getElementById('admin-orders-list-container');
      if (listContainer) {
        const filteredOrders = ordersList.filter(o => activeAdminFilter === 'all' || o.status === activeAdminFilter);
        
        if (filteredOrders.length === 0) {
          listContainer.innerHTML = \`
            <div class="text-center py-10 bg-slate-50 border border-slate-150 rounded-2xl">
              <span class="text-slate-400 text-3xl block mb-2">📦</span>
              <p class="text-xs text-slate-400 italic">Ingen ordrer fundet i denne kategori.</p>
            </div>\`;
          return;
        }

        let listHTML = '<div class="grid gap-3">';
        filteredOrders.forEach(order => {
          const isModtaget = order.status === 'modtaget';
          const isGodkendt = order.status === 'godkendt';
          const isAfsendt = order.status === 'afsendt';
          const isAnnulleret = order.status === 'annulleret';
          const refundBadgeHTML = order.refundRequested ? '1' : '';

          const statusLabel = isModtaget ? 'Nye (Modtaget)' :
                              isGodkendt ? 'Godkendt' :
                              isAfsendt ? 'Afsendt' : 'Annulleret';

          const statusBadgeClass = isModtaget ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                   isGodkendt ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                   isAfsendt ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                   'bg-rose-50 text-rose-600 border border-rose-100';

          const itemsCount = order.items.reduce((sum, it) => sum + it.quantity, 0);
          const carrierTag = order.shipping ? \`<span class="text-slate-400">• 🚚 \\\${order.shipping.carrier.toUpperCase()}</span>\` : '';

          let actionsHTML = '';
          if (isModtaget) {
            actionsHTML += \`<button onclick="event.stopPropagation(); updateOrderStatus('\\\${order.id}', 'godkendt')" class="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] rounded-lg transition-all border-none cursor-pointer">Godkend</button>\`;
          }
          if (isGodkendt) {
            actionsHTML += \`<button onclick="event.stopPropagation(); updateOrderStatus('\\\${order.id}', 'afsendt')" class="px-2.5 py-1 bg-amber-450 hover:bg-amber-500 text-slate-900 font-extrabold text-[10px] rounded-lg transition-all border-none cursor-pointer">Afsend</button>\`;
          }
          if (!isAfsendt && !isAnnulleret) {
            actionsHTML += \`<button onclick="event.stopPropagation(); updateOrderStatus('\\\${order.id}', 'annulleret')" class="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 font-bold text-[10px] rounded-lg border border-slate-200 hover:border-rose-100 transition-all cursor-pointer">Annuller</button>\`;
          }

          listHTML += \`
            <div onclick="showOrderDetailModal('\\\${order.id}')" class="bg-white border border-slate-150 p-4 rounded-2xl hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs font-black text-indigo-650">\\\${order.id}</span>
                  <span class="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">• \\\${order.date}</span>
                </div>
                <h4 class="text-sm font-bold text-slate-800 leading-tight">\\\${order.customer.name}</h4>
                <div class="flex items-center gap-2.5 text-[10px] text-slate-500">
                  <span>\\\${itemsCount} produkter</span>
                  <span>•</span>
                  <span class="font-bold text-slate-800">\\\${order.total.toLocaleString('da-DK', { minimumFractionDigits: 2 })} DKK</span>
                  \\\${carrierTag}
                </div>
              </div>

              <div class="flex items-center justify-between sm:justify-end gap-3">
                <span class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider \\\${statusBadgeClass}">
                  \\\${statusLabel}
                </span>
                \\\${order.refundRequested ? '<span class="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100 text-[8.5px] font-black uppercase tracking-wider">Refundering Anmodet</span>' : ''}
                <div class="flex items-center gap-1.5">
                  \\\${actionsHTML}
                </div>
              </div>
            </div>\`;
        });
        listHTML += '</div>';
        listContainer.innerHTML = listHTML;
      }
    }

    window.setAdminFilter = function(filter) {
      activeAdminFilter = filter;
      renderAdminDashboard();
    };

    window.updateOrderStatus = function(orderId, newStatus) {
      const ordersStr = localStorage.getItem('mm_lase_orders') || '[]';
      try {
        const ordersList = JSON.parse(ordersStr);
        const updated = ordersList.map(o => {
          if (o.id === orderId) {
            o.status = newStatus;
          }
          return o;
        });
        localStorage.setItem('mm_lase_orders', JSON.stringify(updated));
        renderAdminDashboard();

        const modal = document.getElementById('admin-order-detail-modal');
        if (modal && !modal.classList.contains('opacity-0')) {
          showOrderDetailModal(orderId);
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.showOrderDetailModal = function(orderId) {
      const ordersStr = localStorage.getItem('mm_lase_orders') || '[]';
      try {
        const ordersList = JSON.parse(ordersStr);
        const order = ordersList.find(o => o.id === orderId);
        if (!order) return;

        document.getElementById('modal-order-id').innerText = order.id;
        document.getElementById('modal-order-date').innerText = 'Bestillingsdato: ' + order.date;
        document.getElementById('modal-customer-name').innerText = order.customer.name;
        document.getElementById('modal-customer-email').innerText = order.customer.email;
        document.getElementById('modal-customer-phone').innerText = order.customer.phone;

        const shippingBox = document.getElementById('modal-shipping-details-box');
        if (shippingBox) {
          if (order.shipping) {
            shippingBox.innerHTML = \`
              <div class="flex items-center gap-1.5 mb-1.5">
                <span class="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] font-black uppercase rounded">
                  \\\${order.shipping.carrier.toUpperCase()}
                </span>
                <span class="font-bold text-slate-800 text-[11px]">\\\${order.shipping.name}</span>
              </div>
              <p class="text-slate-650 leading-tight">
                <span class="text-slate-400 block text-[10px] uppercase font-bold mt-1.5">Leveringsadresse/Udlevering</span>
                \\\${order.shipping.address}
              </p>\`;
          } else {
            shippingBox.innerHTML = '<p class="text-slate-400 italic">Ingen leveringsmetode valgt (standard levering).</p>';
          }
        }

        const badge = document.getElementById('modal-order-status-badge');
        if (badge) {
          badge.innerText = order.status === 'modtaget' ? 'Modtaget' :
                            order.status === 'godkendt' ? 'Godkendt / Behandles' :
                            order.status === 'afsendt' ? 'Afsendt / Gennemført' : 'Annulleret';

          badge.className = 'px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ' + (
            order.status === 'modtaget' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
            order.status === 'godkendt' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
            order.status === 'afsendt' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
            'bg-rose-50 text-rose-600 border border-rose-100'
          );
        }

        const refundBox = document.getElementById('modal-refund-info-box');
        if (refundBox) {
          if (order.refundRequested) {
            refundBox.style.display = 'block';
            refundBox.innerHTML = '<div class="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-605 text-xs font-semibold leading-relaxed">⚠️ Refundering Anmodet' +
              (order.refundReason ? '<span class="block text-[10px] text-slate-455 font-normal mt-1 leading-normal">Årsag: "' + order.refundReason + '"</span>' : '') +
            '</div>';
          } else {
            refundBox.style.display = 'none';
          }
        }

        const itemsContainer = document.getElementById('modal-items-container');
        if (itemsContainer) {
          let itemsHTML = '';
          order.items.forEach(item => {
            const formattedPrice = (item.product.price * item.quantity).toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK';
            const unitPrice = item.product.price.toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK';
            itemsHTML += \`
              <div class="p-3 flex gap-2.5 items-center">
                <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 font-bold text-sm">🔑</div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-800 truncate leading-tight uppercase">\\\${item.product.name}</p>
                  <p class="text-[10px] text-slate-505 mt-0.5">\\\${item.quantity} x \\\${unitPrice}</p>
                </div>
                <span class="font-mono text-xs text-slate-900 font-bold shrink-0">\\\${formattedPrice}</span>
              </div>\`;
          });
          itemsContainer.innerHTML = itemsHTML;
        }

        document.getElementById('modal-order-subtotal').innerText = order.subtotal.toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK';
        document.getElementById('modal-order-total').innerText = order.total.toLocaleString('da-DK', { minimumFractionDigits: 2 }) + ' DKK';

        const actionsContainer = document.getElementById('modal-actions-container');
        if (actionsContainer) {
          let actionsHTML = '';
          if (order.refundRequested && order.status !== 'annulleret') {
            actionsHTML += \`<button onclick="updateOrderStatus('\\\${order.id}', 'annulleret')" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wide rounded-xl transition-all border-none cursor-pointer">Godkend Refundering</button>\`;
          }
          if (order.status === 'modtaget') {
            actionsHTML += \`<button onclick="updateOrderStatus('\\\${order.id}', 'godkendt')" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wide rounded-xl transition-all border-none cursor-pointer">Godkend Ordre</button>\`;
          }
          if (order.status === 'godkendt') {
            actionsHTML += \`<button onclick="updateOrderStatus('\\\${order.id}', 'afsendt')" class="px-4 py-2 bg-amber-450 hover:bg-amber-500 text-slate-900 font-extrabold text-xs uppercase tracking-wide rounded-xl transition-all border-none cursor-pointer">Marker som Afsendt</button>\`;
          }
          if (order.status !== 'afsendt' && order.status !== 'annulleret') {
            actionsHTML += \`<button onclick="updateOrderStatus('\\\${order.id}', 'annulleret')" class="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 font-bold text-xs uppercase tracking-wide rounded-xl border border-slate-200 hover:border-rose-100 transition-all cursor-pointer">Annuller Ordre</button>\`;
          }
          actionsHTML += \`<button onclick="closeOrderDetailModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wide rounded-xl border border-slate-200 transition-all cursor-pointer">Luk</button>\`;
          
          actionsContainer.innerHTML = actionsHTML;
        }

        const modal = document.getElementById('admin-order-detail-modal');
        if (modal) {
          modal.classList.remove('opacity-0', 'pointer-events-none');
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.closeOrderDetailModal = function() {
      const modal = document.getElementById('admin-order-detail-modal');
      if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
      }
    };

    window.generateMockOrders = function() {
      const mockCustNames = ['Morten Hansen', 'Sofia Nielsen', 'Lars Pedersen', 'Freja Møller', 'Christian Poulsen'];
      const mockCustEmails = ['morten@hansen.dk', 'sofia@nielsen.dk', 'lars@pedersen.dk', 'freja@moeller.dk', 'christian@poulsen.dk'];
      const mockCustPhones = ['45123456', '45234567', '45345678', '45456789', '45567890'];
      const mockZips = ['2100', '5000', '8000', '2900', '4000'];
      
      const ordersList = [];
      const currentOrdersStr = localStorage.getItem('mm_lase_orders') || '[]';
      try {
        const parsed = JSON.parse(currentOrdersStr);
        ordersList.push(...parsed);
      } catch (e) {}

      for (let i = 0; i < 3; i++) {
        const idx = Math.floor(Math.random() * mockCustNames.length);
        const name = mockCustNames[idx];
        const email = mockCustEmails[idx];
        const phone = mockCustPhones[idx];
        const zip = mockZips[i % mockZips.length];
        
        const mockCities = {
          "1000": "København K", "2000": "Frederiksberg", "2100": "København Ø",
          "2200": "København N", "2300": "København S", "2400": "København NV",
          "2500": "Valby", "2600": "Glostrup", "2700": "Brønshøj", "2800": "Kongens Lyngby",
          "2900": "Hellerup", "3000": "Helsingør", "3400": "Hillerød", "4000": "Roskilde",
          "5000": "Odense C", "8000": "Aarhus C", "9000": "Aalborg"
        };
        const city = mockCities[zip] || "København";
        const carrier = i % 2 === 0 ? 'gls' : 'postnord';
        const address = 'Søndergade ' + (12 + i * 5) + ', ' + zip + ' ' + city;

        const product = WEBSHOP_PRODUCTS[Math.floor(Math.random() * WEBSHOP_PRODUCTS.length)];
        const items = [{ product: product, quantity: Math.floor(1 + Math.random() * 2) }];
        const subtotal = product.price * items[0].quantity;

        const orderIdSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderId = 'MM-ORD-' + orderIdSuffix;

        const date = new Date(Date.now() - i * 3600000 * 4).toLocaleString('da-DK', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        const statuses = ['modtaget', 'godkendt', 'afsendt'];
        const status = statuses[i];

        ordersList.unshift({
          id: orderId,
          date: date,
          customer: { name: name, email: email, phone: phone, address: address },
          items: items,
          subtotal: subtotal,
          shipping: {
            carrier: carrier,
            type: i % 2 === 0 ? 'pickup' : 'home',
            id: carrier === 'gls' ? 'gls_p1' : 'pnd_p1',
            name: carrier === 'gls' ? 'Spar Supermarked GLS Pakkeshop' : 'PostNord Hjemmelevering',
            address: i % 2 === 0 ? 'Hovedgade 42, ' + zip + ' ' + city : 'Levering til privat adresse'
          },
          total: subtotal,
          status: status
        });
      }

      localStorage.setItem('mm_lase_orders', JSON.stringify(ordersList));
      renderAdminDashboard();
    };

    window.addEventListener('hashchange', renderShop);

    window.addEventListener('DOMContentLoaded', () => {
      initReadMore();
      setTimeout(initReadMore, 200);
      setTimeout(initReadMore, 500);
      setTimeout(initReadMore, 1000);
      setTimeout(initReadMore, 2000);
      
      window.addEventListener('resize', initReadMore);

      function initSearchHandlers() {
        const searchInput = document.getElementById('shop-search-input');
        const searchClear = document.getElementById('shop-search-clear');
        const suggestionsBox = document.getElementById('shop-search-suggestions');
        
        if (!searchInput) return;

        searchInput.addEventListener('input', () => {
          const val = searchInput.value.trim();
          if (searchClear) {
            searchClear.style.display = val ? 'block' : 'none';
          }
          
          if (!val) {
            if (suggestionsBox) suggestionsBox.style.display = 'none';
            return;
          }

          const matches = WEBSHOP_PRODUCTS.filter(p => {
            const q = val.toLowerCase();
            if (p.name.toLowerCase().includes(q)) return true;
            if (p.description.toLowerCase().includes(q)) return true;
            if (p.color && p.color.toLowerCase().includes(q)) return true;
            if (p.shape && p.shape.toLowerCase().includes(q)) return true;
            if (p.size && p.size.toLowerCase().includes(q)) return true;
            if (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) return true;
            const brand = WEBSHOP_BRANDS.find(b => b.id === p.brandId);
            if (brand && brand.name.toLowerCase().includes(q)) return true;
            return false;
          }).slice(0, 5);

          if (!suggestionsBox) return;

          if (matches.length === 0) {
            suggestionsBox.innerHTML = '<div class="p-3 text-xs text-slate-400 text-center">Ingen resultater fundet</div>';
          } else {
            let html = '<div class="divide-y divide-slate-100 max-h-60 overflow-y-auto">';
            matches.forEach(p => {
              const brand = WEBSHOP_BRANDS.find(b => b.id === p.brandId);
              const brandName = brand ? brand.name : '';
              
              html += '<div onclick="navigateToHash(\'shop/product/' + p.id + '\'); document.getElementById(\'shop-search-suggestions\').style.display=\'none\'; document.getElementById(\'shop-search-input\').value=\'\';" class="flex items-center gap-3 p-2.5 hover:bg-slate-50 cursor-pointer transition-colors text-left">' +
                '<img src="' + p.image + '" class="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0" />' +
                '<div class="flex-1 min-w-0">' +
                  '<div class="text-[9px] text-indigo-650 font-bold uppercase tracking-wider leading-none">' + brandName + '</div>' +
                  '<div class="text-xs text-slate-800 font-bold truncate mt-0.5">' + p.name + '</div>' +
                '</div>' +
                '<div class="text-[10px] font-bold text-slate-900 whitespace-nowrap">' + p.price.toLocaleString(\'da-DK\') + ' DKK</div>' +
              '</div>';
            });
            html += '</div>';
            suggestionsBox.innerHTML = html;
          }
          suggestionsBox.style.display = 'block';
        });

        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const val = searchInput.value.trim();
            if (val) {
              navigateToHash('shop/search/' + encodeURIComponent(val));
              if (suggestionsBox) suggestionsBox.style.display = 'none';
            }
          }
        });

        if (searchClear) {
          searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.style.display = 'none';
            if (suggestionsBox) suggestionsBox.style.display = 'none';
          });
        }

        document.addEventListener('click', (e) => {
          if (!e.target.closest('.search-container-root')) {
            if (suggestionsBox) suggestionsBox.style.display = 'none';
          }
        });
      }

      if (document.querySelector('.webshop-store-root')) {
        initUserSession();
        renderShop();
        renderCart();
        initSearchHandlers();
      }
    });
  </script>
</head>
<body class="${fontClass} transition-colors duration-200 antialiased">
  <!-- Core Content Structure -->
  <main class="min-h-screen">
    ${sectionHTML}
  </main>

  <!-- Full-Screen Drawer Menu for Mobile -->
  <div id="mobile-drawer-menu" class="pointer-events-auto hidden md:hidden" style="position: fixed; top: 0px; bottom: 0px; left: 50%; transform: translateX(-50%); width: 100%; max-width: 768px; background-color: ${menuOverlay?.settings?.drawerBgColorMobile || menuOverlay?.settings?.drawerBgColor || '#ffffff'}; color: ${menuOverlay?.settings?.drawerTextColorMobile || menuOverlay?.settings?.drawerTextColor || '#0f172a'}; z-index: 110; flex-direction: column; box-shadow: 0 -10px 25px rgba(0,0,0,0.15), 0 10px 25px rgba(0,0,0,0.15); overflow-y: auto;">
    <!-- Header -->
    <div class="p-6 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-10">
      <div id="mobile-drawer-logo">
        ${(() => {
          const logoOverlay = findLogoOverlay();
          if (!logoOverlay) return '';
          if (logoOverlay.src) {
            return `<img src="${logoOverlay.src}" alt="${logoOverlay.content || 'Logo'}" style="height: 40px; width: auto; border-radius: 4px;" class="object-contain" />`;
          }
          if (logoOverlay.content.toUpperCase().includes('MM') && logoOverlay.content.toUpperCase().includes('LÅSESMED')) {
            return `
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 rounded-full border-2 border-[#FFC502] flex items-center justify-center bg-slate-900 shrink-0">
                  <span class="text-[#FFC502] font-black text-xs">MM</span>
                </div>
                <div class="flex flex-col text-left">
                  <span class="font-extrabold tracking-wider leading-none text-slate-900 uppercase text-base flex items-center gap-1">
                    LÅSESMED
                  </span>
                  <span class="text-[8px] text-[#FFC502] bg-slate-900 px-1.5 rounded-sm tracking-wide font-bold leading-normal mt-0.5 w-max">
                    DØGNVAGT 31 11 11 15
                  </span>
                </div>
              </div>`;
          }
          return `<span style="color: ${logoOverlay.styles?.color || '#0f172a'}; font-size: ${logoOverlay.styles?.fontSize || '20px'}; font-weight: ${logoOverlay.styles?.fontWeight || '800'};">${logoOverlay.content}</span>`;
        })()}
      </div>
      <button onclick="toggleMobileMenu(false)" class="p-2 rounded-full hover:bg-slate-100 border-none bg-transparent cursor-pointer transition-colors text-slate-950" style="border: none; background: transparent; cursor: pointer;">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- Menu Items (Accordion) -->
    <div class="flex-1 p-6 overflow-y-auto space-y-4">
      ${(() => {
        const menuOverlay = findMenuOverlay();
        if (!menuOverlay) return '<div class="text-center text-slate-400 text-sm">No navigation items found.</div>';
        
        const items = (menuOverlay.settings?.menuContentMobile || menuOverlay.content).split(',').map(itemStr => itemStr.trim()).filter(Boolean);
        let accordionHTML = '';
        items.forEach((item, idx) => {
          const hasDropdown = ['Erhverv', 'Privat', 'Boligforeninger'].includes(item);
          if (hasDropdown) {
            const allLinks = menuOverlay.dropdownLinks || [];
            const filteredLinks = allLinks.filter(l => l.parentItem.toLowerCase() === item.toLowerCase());
            
            const groups = {};
            filteredLinks.forEach(link => {
              const g = link.group || 'General';
              if (!groups[g]) groups[g] = [];
              groups[g].push(link);
            });
            
            let submenuHTML = '';
            const groupNames = Object.keys(groups);
            if (groupNames.length === 0) {
              submenuHTML = `<div class="text-slate-400 text-xs py-1 italic">No sub-pages added yet.</div>`;
            } else {
              groupNames.forEach((gName, gIdx) => {
                let linksHTML = '';
                groups[gName].forEach(link => {
                  linksHTML += `<a href="${link.link || '#'}" onclick="toggleMobileMenu(false)" class="block text-slate-600 py-1 hover:text-slate-955 no-underline" style="text-decoration: none; font-size: ${menuOverlay.settings?.drawerLinkFontSizeMobile || menuOverlay.settings?.drawerLinkFontSize || menuOverlay.settings?.dropdownFontSize || 12}px; font-weight: ${menuOverlay.settings?.drawerLinkFontWeightMobile || menuOverlay.settings?.drawerLinkFontWeight || 'normal'}; font-style: ${menuOverlay.settings?.drawerLinkFontStyleMobile || menuOverlay.settings?.drawerLinkFontStyle || 'normal'};">${link.title}</a>`;
                });
                submenuHTML += `
                  <div class="${gIdx > 0 ? 'mt-2' : ''}">
                    <div class="text-slate-900 font-extrabold uppercase tracking-wider flex items-center gap-1 mb-1" style="font-size: ${menuOverlay.settings?.drawerGroupFontSizeMobile || menuOverlay.settings?.drawerGroupFontSize || menuOverlay.settings?.dropdownGroupFontSize || 10}px; font-weight: ${menuOverlay.settings?.drawerGroupFontWeightMobile || menuOverlay.settings?.drawerGroupFontWeight || 'bold'}; font-style: ${menuOverlay.settings?.drawerGroupFontStyleMobile || menuOverlay.settings?.drawerGroupFontStyle || 'normal'};">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#FFC502]" style="width: 6px; height: 6px; display: inline-block; border-radius: 50%;"></span> ${gName}
                    </div>
                    <div class="pl-2.5 space-y-1">
                      ${linksHTML}
                    </div>
                  </div>`;
              });
            }

            accordionHTML += `
              <div class="border-b border-slate-100 pb-3 last:border-none">
                <button onclick="toggleMobileAccordion('${item}')" class="w-full text-left py-2 flex justify-between items-center text-slate-955 font-bold uppercase tracking-wider border-none bg-transparent cursor-pointer hover:text-[#FFC502] transition-colors" style="border: none; background: transparent; cursor: pointer;">
                  <span class="text-sm" style="font-size: ${menuOverlay.settings?.drawerFontSizeMobile || menuOverlay.settings?.drawerFontSize || 14}px; font-weight: ${menuOverlay.settings?.drawerFontWeightMobile || menuOverlay.settings?.drawerFontWeight || 'bold'}; font-style: ${menuOverlay.settings?.drawerFontStyleMobile || menuOverlay.settings?.drawerFontStyle || 'normal'};">${item}</span>
                  <span id="mobile-accordion-indicator-${item}" class="text-lg font-mono text-slate-500 font-bold" style="font-size: 18px;">+</span>
                </button>
                <div id="mobile-accordion-content-${item}" class="mt-2 pl-4 pr-2 py-3 bg-slate-50 rounded-xl space-y-3 border-l-2 border-[#FFC502] hidden">
                  ${submenuHTML}
                </div>
              </div>`;
          } else {
            accordionHTML += `
              <div class="border-b border-slate-100 pb-3 last:border-none">
                <a href="#" onclick="toggleMobileMenu(false)" class="block py-2 uppercase tracking-wider hover:text-[#FFC502] transition-colors no-underline" style="text-decoration: none; font-size: ${menuOverlay.settings?.drawerFontSizeMobile || menuOverlay.settings?.drawerFontSize || 14}px; font-weight: ${menuOverlay.settings?.drawerFontWeightMobile || menuOverlay.settings?.drawerFontWeight || 'bold'}; font-style: ${menuOverlay.settings?.drawerFontStyleMobile || menuOverlay.settings?.drawerFontStyle || 'normal'}; color: ${menuOverlay?.settings?.drawerTextColorMobile || menuOverlay?.settings?.drawerTextColor || '#0f172a'};">${item}</a>
              </div>`;
          }
        });
        return accordionHTML;
      })()}
    </div>

    <!-- Footer Contact Card -->
    ${(() => {
      const footerMenuOverlay = findMenuOverlay();
      const contactText = footerMenuOverlay?.settings?.contactText || "Kulvej 10, 2 TV, 2450 København SV";
      const contactEmail = footerMenuOverlay?.settings?.contactEmail || "info@mmlaasesmed.dk";
      const contactPhone = footerMenuOverlay?.settings?.contactPhone || "+45 31 11 11 15";
      const contactTitle = footerMenuOverlay?.settings?.contactTitle || "Kontakt";
      return `
        <div class="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
          <div class="bg-[#FFC502] text-slate-955 rounded-2xl p-5 flex flex-col gap-3 shadow-lg" style="border-radius: 16px;">
            <div class="font-extrabold uppercase tracking-wider text-slate-900" style="font-size: ${footerMenuOverlay?.settings?.contactTitleFontSize || 12}px;">${contactTitle}</div>
            <div class="leading-relaxed font-semibold text-slate-955" style="font-size: ${footerMenuOverlay?.settings?.contactTextFontSize || 10}px;">
              ${contactText.split('\n').map(line => `<span>${line}</span>`).join('<br />')}
              ${contactEmail ? `<p class="mt-1">${contactEmail}</p>` : ''}
            </div>
            <a href="tel:${contactPhone.replace(/\s+/g, '')}" class="flex items-center justify-center gap-2 bg-slate-955 text-white hover:bg-slate-900 font-extrabold text-xs py-3 px-4 rounded-xl transition-all uppercase tracking-wider shadow-sm hover:shadow-md cursor-pointer no-underline mt-2" style="text-decoration: none; border-radius: 12px; margin-top: 8px;">
              <svg class="w-4 h-4 text-[#FFC502]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px; color: #FFC502;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <span>${contactPhone}</span>
            </a>
          </div>
        </div>`;
    })()}
  </div>

  <div id="tablet-drawer-menu" class="pointer-events-auto hidden lg:hidden" style="position: fixed; top: 0px; bottom: 0px; left: 50%; transform: translateX(-50%); width: 100%; max-width: 768px; background-color: ${menuOverlay?.settings?.drawerBgColorTablet || menuOverlay?.settings?.drawerBgColor || '#ffffff'}; color: ${menuOverlay?.settings?.drawerTextColorTablet || menuOverlay?.settings?.drawerTextColor || '#0f172a'}; z-index: 110; flex-direction: column; box-shadow: 0 -10px 25px rgba(0,0,0,0.15), 0 10px 25px rgba(0,0,0,0.15); overflow-y: auto;">
    <!-- Header -->
    <div class="p-6 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-10">
      <div id="tablet-drawer-logo">
        ${(() => {
          const logoOverlay = findLogoOverlay();
          if (!logoOverlay) return '';
          if (logoOverlay.src) {
            return `<img src="${logoOverlay.src}" alt="${logoOverlay.content || 'Logo'}" style="height: 40px; width: auto; border-radius: 4px;" class="object-contain" />`;
          }
          if (logoOverlay.content.toUpperCase().includes('MM') && logoOverlay.content.toUpperCase().includes('LÅSESMED')) {
            return `
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 rounded-full border-2 border-[#FFC502] flex items-center justify-center bg-slate-900 shrink-0">
                  <span class="text-[#FFC502] font-black text-xs">MM</span>
                </div>
                <div class="flex flex-col text-left">
                  <span class="font-extrabold tracking-wider leading-none text-slate-900 uppercase text-base flex items-center gap-1">
                    LÅSESMED
                  </span>
                  <span class="text-[8px] text-[#FFC502] bg-slate-900 px-1.5 rounded-sm tracking-wide font-bold leading-normal mt-0.5 w-max">
                    DØGNVAGT 31 11 11 15
                  </span>
                </div>
              </div>`;
          }
          return `<span style="color: ${logoOverlay.styles?.color || '#0f172a'}; font-size: ${logoOverlay.styles?.fontSize || '20px'}; font-weight: ${logoOverlay.styles?.fontWeight || '800'};">${logoOverlay.content}</span>`;
        })()}
      </div>
      <button onclick="toggleMobileMenu(false)" class="p-2 rounded-full hover:bg-slate-100 border-none bg-transparent cursor-pointer transition-colors text-slate-955" style="border: none; background: transparent; cursor: pointer;">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- Menu Items (Accordion) -->
    <div class="flex-1 p-6 overflow-y-auto space-y-4">
      ${(() => {
        const menuOverlay = findMenuOverlay();
        if (!menuOverlay) return '<div class="text-center text-slate-400 text-sm">No navigation items found.</div>';
        
        const items = (menuOverlay.settings?.menuContentTablet || menuOverlay.content).split(',').map(itemStr => itemStr.trim()).filter(Boolean);
        let accordionHTML = '';
        items.forEach((item, idx) => {
          const hasDropdown = ['Erhverv', 'Privat', 'Boligforeninger'].includes(item);
          if (hasDropdown) {
            const allLinks = menuOverlay.dropdownLinks || [];
            const filteredLinks = allLinks.filter(l => l.parentItem.toLowerCase() === item.toLowerCase());
            
            const groups = {};
            filteredLinks.forEach(link => {
              const g = link.group || 'General';
              if (!groups[g]) groups[g] = [];
              groups[g].push(link);
            });
            
            let submenuHTML = '';
            const groupNames = Object.keys(groups);
            if (groupNames.length === 0) {
              submenuHTML = `<div class="text-slate-400 text-xs py-1 italic">No sub-pages added yet.</div>`;
            } else {
              groupNames.forEach((gName, gIdx) => {
                let linksHTML = '';
                groups[gName].forEach(link => {
                  linksHTML += `<a href="${link.link || '#'}" onclick="toggleMobileMenu(false)" class="block text-slate-600 py-1 hover:text-slate-955 no-underline" style="text-decoration: none; font-size: ${menuOverlay.settings?.drawerLinkFontSizeTablet || menuOverlay.settings?.drawerLinkFontSize || menuOverlay.settings?.dropdownFontSize || 12}px; font-weight: ${menuOverlay.settings?.drawerLinkFontWeightTablet || menuOverlay.settings?.drawerLinkFontWeight || 'normal'}; font-style: ${menuOverlay.settings?.drawerLinkFontStyleTablet || menuOverlay.settings?.drawerLinkFontStyle || 'normal'};">${link.title}</a>`;
                });
                submenuHTML += `
                  <div class="${gIdx > 0 ? 'mt-2' : ''}">
                    <div class="text-slate-900 font-extrabold uppercase tracking-wider flex items-center gap-1 mb-1" style="font-size: ${menuOverlay.settings?.drawerGroupFontSizeTablet || menuOverlay.settings?.drawerGroupFontSize || menuOverlay.settings?.dropdownGroupFontSize || 10}px; font-weight: ${menuOverlay.settings?.drawerGroupFontWeightTablet || menuOverlay.settings?.drawerGroupFontWeight || 'bold'}; font-style: ${menuOverlay.settings?.drawerGroupFontStyleTablet || menuOverlay.settings?.drawerGroupFontStyle || 'normal'};">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#FFC502]" style="width: 6px; height: 6px; display: inline-block; border-radius: 50%;"></span> ${gName}
                    </div>
                    <div class="pl-2.5 space-y-1">
                      ${linksHTML}
                    </div>
                  </div>`;
              });
            }

            accordionHTML += `
              <div class="border-b border-slate-100 pb-3 last:border-none">
                <button onclick="toggleMobileAccordion('${item}')" class="w-full text-left py-2 flex justify-between items-center text-slate-955 font-bold uppercase tracking-wider border-none bg-transparent cursor-pointer hover:text-[#FFC502] transition-colors" style="border: none; background: transparent; cursor: pointer;">
                  <span class="text-sm" style="font-size: ${menuOverlay.settings?.drawerFontSizeTablet || menuOverlay.settings?.drawerFontSize || 14}px; font-weight: ${menuOverlay.settings?.drawerFontWeightTablet || menuOverlay.settings?.drawerFontWeight || 'bold'}; font-style: ${menuOverlay.settings?.drawerFontStyleTablet || menuOverlay.settings?.drawerFontStyle || 'normal'};">${item}</span>
                  <span id="mobile-accordion-indicator-${item}" class="text-lg font-mono text-slate-500 font-bold" style="font-size: 18px;">+</span>
                </button>
                <div id="mobile-accordion-content-${item}" class="mt-2 pl-4 pr-2 py-3 bg-slate-50 rounded-xl space-y-3 border-l-2 border-[#FFC502] hidden">
                  ${submenuHTML}
                </div>
              </div>`;
          } else {
            accordionHTML += `
              <div class="border-b border-slate-100 pb-3 last:border-none">
                <a href="#" onclick="toggleMobileMenu(false)" class="block py-2 uppercase tracking-wider hover:text-[#FFC502] transition-colors no-underline" style="text-decoration: none; font-size: ${menuOverlay.settings?.drawerFontSizeTablet || menuOverlay.settings?.drawerFontSize || 14}px; font-weight: ${menuOverlay.settings?.drawerFontWeightTablet || menuOverlay.settings?.drawerFontWeight || 'bold'}; font-style: ${menuOverlay.settings?.drawerFontStyleTablet || menuOverlay.settings?.drawerFontStyle || 'normal'}; color: ${menuOverlay?.settings?.drawerTextColorTablet || menuOverlay?.settings?.drawerTextColor || '#0f172a'};">${item}</a>
              </div>`;
          }
        });
        return accordionHTML;
      })()}
    </div>

    <!-- Footer Contact Card -->
    ${(() => {
      const footerMenuOverlay = findMenuOverlay();
      const contactText = footerMenuOverlay?.settings?.contactText || "Kulvej 10, 2 TV, 2450 København SV";
      const contactEmail = footerMenuOverlay?.settings?.contactEmail || "info@mmlaasesmed.dk";
      const contactPhone = footerMenuOverlay?.settings?.contactPhone || "+45 31 11 11 15";
      const contactTitle = footerMenuOverlay?.settings?.contactTitle || "Kontakt";
      return `
        <div class="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
          <div class="bg-[#FFC502] text-slate-955 rounded-2xl p-5 flex flex-col gap-3 shadow-lg" style="border-radius: 16px;">
            <div class="font-extrabold uppercase tracking-wider text-slate-900" style="font-size: ${footerMenuOverlay?.settings?.contactTitleFontSize || 12}px;">${contactTitle}</div>
            <div class="leading-relaxed font-semibold text-slate-955" style="font-size: ${footerMenuOverlay?.settings?.contactTextFontSize || 10}px;">
              ${contactText.split('\n').map(line => `<span>${line}</span>`).join('<br />')}
              ${contactEmail ? `<p class="mt-1">${contactEmail}</p>` : ''}
            </div>
            <a href="tel:${contactPhone.replace(/\s+/g, '')}" class="flex items-center justify-center gap-2 bg-slate-955 text-white hover:bg-slate-900 font-extrabold text-xs py-3 px-4 rounded-xl transition-all uppercase tracking-wider shadow-sm hover:shadow-md cursor-pointer no-underline mt-2" style="text-decoration: none; border-radius: 12px; margin-top: 8px;">
              <svg class="w-4 h-4 text-[#FFC502]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px; color: #FFC502;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <span>${contactPhone}</span>
            </a>
          </div>
        </div>`;
    })()}
  </div>

</body>
</html>`;
  };

  const handleDownloadCode = () => {
    const htmlContent = generateStandaloneHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateStandaloneHTML());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleBackupExport = () => {
    const backup = {
      version: '1.0',
      savedAt: new Date().toISOString(),
      theme,
      sections
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-backup-${theme.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBackupImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        if (content && content.sections && content.theme) {
          onImport(content.sections, content.theme);
        } else {
          alert('Invalid file format. Please upload a valid website backup file.');
        }
      } catch (err) {
        alert('Could not parse the backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-6 h-14 flex items-center justify-between flex-wrap sm:flex-nowrap gap-3 shrink-0 z-40 relative">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
          <Code className="w-4 h-4" />
        </div>
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 tracking-tight text-sm">VisualEngine <span className="text-slate-400 font-normal">v2.4</span></span>
        </div>
      </div>

      {/* Center Commands - Sleek Tab Pill Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => {
              setIsVisitorMode(false);
              setIsPreviewMode(false);
            }}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              !isPreviewMode
                ? 'bg-white dark:bg-slate-900 shadow-xs text-slate-900 dark:text-slate-100 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            id="preview-toggle-editor"
          >
            Desktop Editor
          </button>
          <button
            onClick={() => {
              setIsVisitorMode(false);
              setIsPreviewMode(true);
            }}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              isPreviewMode
                ? 'bg-white dark:bg-slate-900 shadow-xs text-slate-900 dark:text-slate-100 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            id="preview-toggle-live"
          >
            Dynamic Preview
          </button>
        </div>

        {/* Viewport Device Emulator Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`p-1.5 rounded transition-all flex items-center justify-center cursor-pointer border-none bg-transparent ${
              viewportMode === 'desktop'
                ? 'bg-white dark:bg-slate-900 shadow-xs text-indigo-650 dark:text-indigo-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={`p-1.5 rounded transition-all flex items-center justify-center cursor-pointer border-none bg-transparent ${
              viewportMode === 'tablet'
                ? 'bg-white dark:bg-slate-900 shadow-xs text-indigo-650 dark:text-indigo-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={`p-1.5 rounded transition-all flex items-center justify-center cursor-pointer border-none bg-transparent ${
              viewportMode === 'mobile'
                ? 'bg-white dark:bg-slate-900 shadow-xs text-indigo-650 dark:text-indigo-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {/* Editor Dark Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={toggleDarkMode}
            className={`p-1.5 rounded transition-all flex items-center justify-center cursor-pointer border-none bg-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200`}
            title={isDarkMode ? "Skift til lys tilstand" : "Skift til mørk tilstand"}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setLanguage(language === 'da' ? 'en' : 'da')}
            className={`px-2 py-1 rounded transition-all flex items-center gap-1.5 cursor-pointer border-none bg-transparent text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 uppercase`}
            title={language === 'da' ? "Switch to English" : "Skift til Dansk"}
          >
            <Globe className="w-3.5 h-3.5" />
            {language}
          </button>
        </div>
      </div>

      {/* Right Commands */}
      <div className="flex items-center gap-2">
        {/* Backup File upload wrapper */}
        <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors font-medium">
          <Upload className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Import Layout</span>
          <input
            type="file"
            accept=".json"
            onChange={handleBackupImport}
            className="hidden"
          />
        </label>

        <button
          onClick={handleBackupExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors font-medium"
          title="Backup Design Configuration (JSON)"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Backup Layout (JSON)</span>
        </button>

        <span className="h-4 w-[1px] bg-slate-200"></span>

        {/* Python Django Sync Status Button */}
        <button
          onClick={() => {
            setShowDjangoModal(true);
            handleCheckDjangoConnection();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
            djangoStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-250 hover:bg-emerald-100/70'
              : djangoStatus === 'checking'
                ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                : djangoStatus === 'error'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70'
                  : 'bg-slate-50 text-slate-700 border-slate-250 hover:bg-slate-100'
          }`}
          title="Configure Django & Passcode Settings"
          id="django-sync-trigger"
        >
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Settings & Sync</span>
          <span className={`w-1.5 h-1.5 rounded-full ${
            djangoStatus === 'connected'
              ? 'bg-emerald-500'
              : djangoStatus === 'checking'
                ? 'bg-amber-500'
                : djangoStatus === 'error'
                  ? 'bg-rose-500'
                  : 'bg-slate-400'
          }`} />
        </button>

        {/* Instantly Save Active Page directly to Django Database SQL/JSON tables */}
        <button
          onClick={handleDirectSaveToDjango}
          disabled={isDjangoLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-md shadow-emerald-100 transition-all flex items-center gap-1.5 active:scale-95"
          id="direct-save-django-button"
        >
          <Database className="w-3.5 h-3.5 text-emerald-100" />
          <span>{isDjangoLoading ? 'Saving to SQL...' : 'Save to Django DB'}</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Are you absolutely sure you want to reset all custom edits? Your layout will revert to default template.')) {
              onReset();
            }
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium mr-1"
          title="Reset Canvas"
        >
          <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden lg:inline">Reset Workspace</span>
        </button>
        
        <button
          onClick={() => setShowCodeExport(true)}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-1.5 cursor-pointer"
          id="code-export"
        >
          <Code className="w-3.5 h-3.5" />
          <span>Export Clean HTML</span>
        </button>

        {setIsAdmin && (
          <button
            onClick={() => {
              if (confirm('Lock the visual workspace immediately? You will need your passcode to re-enter.')) {
                setIsAdmin(false);
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black bg-rose-600 hover:bg-rose-750 text-white rounded-full transition-all shadow-md shadow-rose-100 active:scale-95 cursor-pointer"
            id="admin-header-log-out"
            title="Lock layout tools & sign out as administrator"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Workspace</span>
          </button>
        )}

      </div>

      {/* Python Django Integration Console Modal Overlay */}
      {showDjangoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 text-slate-800 dark:text-slate-100">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Database className="w-5 h-5 text-indigo-600" /> Django Backend DB Console
              </h3>
              <button
                onClick={() => setShowDjangoModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
              {/* Host Settings config */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Django Server Host URL
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Server className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={djangoApiUrl}
                      onChange={(e) => setDjangoApiUrl(e.target.value)}
                      placeholder="e.g. http://localhost:8000"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handleCheckDjangoConnection()}
                    className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                  >
                    {djangoStatus === 'checking' ? 'Checking...' : 'Check Server'}
                  </button>
                </div>

                {/* Connection Alert bar */}
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2.5 border ${
                  djangoStatus === 'connected'
                    ? 'bg-emerald-50/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 bg-emerald-950/10'
                    : djangoStatus === 'checking'
                      ? 'bg-amber-50/60 text-amber-800 border-amber-200 dark:text-amber-300'
                      : djangoStatus === 'error'
                        ? 'bg-rose-50/60 text-rose-800 border-rose-200 dark:text-rose-300 bg-rose-950/10'
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900'
                }`}>
                  <div className="shrink-0">
                    {djangoStatus === 'connected' ? (
                      <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                  <div className="flex-1 leading-relaxed font-mono text-[11px]">
                    <strong>Status: </strong>
                    {djangoStatus === 'connected' ? 'CONNECTED' : djangoStatus === 'checking' ? 'ESTABLISHING HANDSHAKE' : djangoStatus === 'error' ? 'OFFLINE' : 'NOT INITIALIZED'}
                    {djangoMsg && <span className="opacity-80 block mt-0.5">{djangoMsg}</span>}
                  </div>
                </div>
              </div>

              {/* Deployment Synchronization Status Check (Admin only) */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-indigo-500" /> Deployment Sync Status
                  </label>
                  {(window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) && (
                    <button
                      onClick={handleVerifyDeploymentSync}
                      disabled={deployCheckStatus === 'checking'}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline hover:font-bold lowercase pointer-events-auto cursor-pointer border-none bg-transparent animate-none"
                    >
                      {deployCheckStatus === 'checking' ? 'verifying...' : 'verify production sync'}
                    </button>
                  )}
                </div>
                
                {!(window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) ? (
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Viewing from <strong>Production</strong> server. To verify if this environment matches your local development files and SQLite database exactly, open the app on your local computer to run the verification console.
                  </p>
                ) : deployCheckStatus === 'idle' ? (
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Verify whether your local codebase and SQLite database match the production server in real-time.
                  </p>
                ) : deployCheckStatus === 'checking' ? (
                  <div className="text-[11px] text-slate-400 animate-pulse">
                    Connecting to local and production APIs, comparing Git commit hashes and DB checksums...
                  </div>
                ) : deployCheckStatus === 'error' ? (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/30 text-rose-800 dark:text-rose-300 rounded-lg text-[11px] font-mono leading-normal">
                    <strong>Connection Error:</strong> {deployInfo?.errorMsg || "Unable to check environments. Ensure local Django server is running on port 8000."}
                  </div>
                ) : (
                  <div className="space-y-2.5 font-mono text-[11px] leading-normal text-slate-700 dark:text-slate-350">
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                      <span className="text-[10px] uppercase font-extrabold text-slate-500 w-24 shrink-0">Git Commits:</span>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <span className="truncate">Local: <code className="text-slate-450 dark:text-slate-400 font-bold">{deployInfo?.localCommit?.substring(0, 10)}...</code></span>
                        <span className="truncate">Server: <code className="text-slate-450 dark:text-slate-400 font-bold">{deployInfo?.remoteCommit?.substring(0, 10)}...</code></span>
                      </div>
                      {deployInfo?.localCommit === deployInfo?.remoteCommit ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓ SYNCED</span>
                      ) : (
                        <span className="text-rose-500 font-bold shrink-0">✗ MISMATCH</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                      <span className="text-[10px] uppercase font-extrabold text-slate-500 w-24 shrink-0">Database MD5:</span>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <span className="truncate">Local: <code className="text-slate-450 dark:text-slate-400 font-bold">{deployInfo?.localDbMd5?.substring(0, 12)}...</code></span>
                        <span className="truncate">Server: <code className="text-slate-450 dark:text-slate-400 font-bold">{deployInfo?.remoteDbMd5?.substring(0, 12)}...</code></span>
                      </div>
                      {deployInfo?.localDbMd5 === deployInfo?.remoteDbMd5 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓ SYNCED</span>
                      ) : (
                        <span className="text-rose-500 font-bold shrink-0">✗ MISMATCH</span>
                      )}
                    </div>

                    {deployCheckStatus === 'success' ? (
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-250 dark:border-emerald-900/35 text-emerald-800 dark:text-emerald-400 rounded-lg text-center font-bold font-sans text-[10px] uppercase tracking-wider">
                        🎉 Code and Database match 100%!
                      </div>
                    ) : (
                      <div className="p-2 bg-rose-50 dark:bg-rose-950/15 border border-rose-250 dark:border-rose-900/35 text-rose-800 dark:text-rose-450 rounded-lg text-center font-bold font-sans text-[10px] uppercase tracking-wider">
                        ⚠️ Warning: Environments differ. Deploy or replicate data.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Administrator Passcode Configuration */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 mt-4">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-500" /> Editor Passcode Settings
                </label>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Customize the security passcode required to access your page visual builder.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={adminPasscode}
                    onChange={(e) => onUpdatePasscode && onUpdatePasscode(e.target.value)}
                    placeholder="Enter new admin passcode..."
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                  />
                </div>
                
                {setIsAdmin && (
                  <button
                    onClick={() => {
                      if (confirm('Lock the visual workspace immediately? You will need your passcode to re-enter.')) {
                        setIsAdmin(false);
                        setShowDjangoModal(false);
                      }
                    }}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-sm shadow-rose-100"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Layout Workspace</span>
                  </button>
                )}
              </div>

              {/* Save layout block (Active if connected) */}
              {djangoStatus === 'connected' && (
                <div className="space-y-3 bg-indigo-50/20 dark:bg-indigo-950/10 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-400">
                    💾 Save Active Design to Django DB
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    This will serialize the grid sections and theme setting dictionaries, committing them to your `WebsiteLayout` Django database model table.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLayoutTitle}
                      onChange={(e) => setNewLayoutTitle(e.target.value)}
                      placeholder="e.g. Portfolio Draft, Coffee Landing..."
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1.5 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleSaveToDjango}
                      disabled={isDjangoLoading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 shrink-0"
                    >
                      {isDjangoLoading ? 'Saving...' : 'Save Draft'}
                    </button>
                  </div>
                </div>
              )}

              {/* List of retrieved database layouts */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>📂 Saved Layouts on your server ({djangoLayouts.length})</span>
                  {djangoStatus === 'connected' && (
                    <button
                      onClick={() => fetchDjangoLayouts(djangoApiUrl)}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline hover:font-bold lowercase"
                    >
                      Refresh list
                    </button>
                  )}
                </h4>

                {djangoStatus !== 'connected' ? (
                  <div className="py-8 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-450 leading-relaxed px-6">
                    ⚠️ Connection status is currently offline. Open your terminal, startup your Python Django development server on port 8000 (with cors headers enabled), then verify host above to synchronize layout states in real-time.
                  </div>
                ) : djangoLayouts.length === 0 ? (
                  <div className="py-8 bg-slate-50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400 leading-relaxed px-6">
                    Connected! No layout records exist in the Django database model table yet. Type a name above and click <strong>"Save Draft"</strong> to persist your first designed website!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800 border border-slate-150 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                    {djangoLayouts.map((layout) => (
                      <div
                        key={layout.id}
                        className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors pointer-events-auto"
                      >
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800 dark:text-slate-150">{layout.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            ID: {layout.id} • Synced: {new Date(layout.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLoadFromDjango(layout)}
                            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 hover:bg-indigo-100 text-[11px] font-bold rounded-md transition-colors"
                          >
                            Load layout
                          </button>
                          <button
                            onClick={() => handleUpdateInDjango(layout.id, layout.title)}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450 hover:bg-emerald-100 text-[11px] font-bold rounded-md transition-colors"
                            title="Overskriv dette layout på serveren med dit nuværende canvas design"
                          >
                            Overskriv design
                          </button>
                          <button
                            onClick={(e) => handleDeleteFromDjango(layout.id, e)}
                            className="p-1 px-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 hover:bg-rose-50/20 dark:hover:bg-rose-950/20 rounded transition-colors text-[11px]"
                            title="Delete draft in Django"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fast reference docs inside UI */}
              <div className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4 space-y-2 text-xs">
                <p className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                  💡 Running a Local Django App?
                </p>
                <div className="text-slate-650 dark:text-slate-300 space-y-1 leading-normal font-sans">
                  <p>1. Copy the customized python backend code generated in the <strong>`/django_backend`</strong> folder into your Django app.</p>
                  <p>2. Register <code>path('api/', include('your_app.urls'))</code> in your root urls configuration.</p>
                  <p>3. Remember to register <code>'corsheaders'</code> in settings for seamless local developer testing.</p>
                  <p>4. Run <code>python seed_database.py</code> locally to automatically seed your 5 pre-cooked pages inside your SQL database!</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDjangoModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Clean Code Exporter Modal Overlay */}
      {showCodeExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 text-slate-800 dark:text-slate-100">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-500" /> Export Standalone Website Bundle
              </h3>
              <button
                onClick={() => setShowCodeExport(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Here is your pure, high-performance HTML/CSS package with embedded Tailwind CSS styles. 
                You can copy-paste this direct standalone source and view it in any web browser or deploy it instantly to Vercel, Netlify, or Github Pages.
              </p>

              <div className="relative">
                <pre className="p-4 bg-slate-950 text-slate-200 text-xs font-mono rounded-lg overflow-x-auto max-h-[40vh] border border-slate-800">
                  <code>{generateStandaloneHTML()}</code>
                </pre>

                {/* float controls */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={handleCopyCode}
                    className="p-1 px-2.5 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-lg flex gap-3 text-xs text-amber-800 dark:text-amber-300">
                <div className="font-bold text-sm">💡</div>
                <div>
                  <strong>Pro Tip:</strong> All custom letter-spacing, line spacing, margins, color themes, font families, and responsive columns have been baked into simple inline styling and modular responsive elements.
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setShowCodeExport(false)}
                className="px-4 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={handleDownloadCode}
                className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Save index.html File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
