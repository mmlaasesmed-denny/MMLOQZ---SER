import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Copy, Edit3, Image as ImageIcon, 
  HelpCircle, AlignCenter, Columns, Heading, Type, FileImage, Layers,
  Home, Building2, Landmark, ShieldCheck, Menu, X, ShoppingCart, Phone, Key,
  ChevronDown, ChevronUp, Link
} from 'lucide-react';
import { Section, PageElement, SiteTheme, ElementStyles, ElementType, OverlayItem, DropdownLink } from '../types';
import WebshopComponent from './WebshopComponent';

export const getDefaultDropdownLinks = (): DropdownLink[] => [
  // Erhverv
  {
    id: 'dl-e1',
    parentItem: 'Erhverv',
    group: 'Sikkerhed & Adgang',
    title: 'Adgangskontrol',
    description: 'Fleksible adgangsløsninger til alle typer erhverv.',
    link: '#adgangskontrol'
  },
  {
    id: 'dl-e2',
    parentItem: 'Erhverv',
    group: 'Sikkerhed & Adgang',
    title: 'Elektroniske dørgreb',
    description: 'Praktisk, trådløs adgangskontrol til indre døre.',
    link: '#doergreb'
  },
  {
    id: 'dl-e3',
    parentItem: 'Erhverv',
    group: 'Sikkerhed & Adgang',
    title: 'Dormakaba Exivo',
    description: 'Skybaseret adgangsadministration i realtid.',
    link: '#exivo'
  },
  {
    id: 'dl-e4',
    parentItem: 'Erhverv',
    group: 'Låse & Sikring',
    title: 'Indbrudssikring',
    description: 'Sikring af døre, vinduer, kontor og lager.',
    link: '#indbrud'
  },
  {
    id: 'dl-e5',
    parentItem: 'Erhverv',
    group: 'Låse & Sikring',
    title: 'Låsesystemer',
    description: 'Sikre patenterede systemer fra EVVA & Dormakaba.',
    link: '#laasesystemer'
  },

  // Privat
  {
    id: 'dl-p1',
    parentItem: 'Privat',
    group: 'Hjemmeservice',
    title: 'Låseservice',
    description: 'Akut oplukning og omkodning døgnet rundt.',
    link: '#laaseservice'
  },
  {
    id: 'dl-p2',
    parentItem: 'Privat',
    group: 'Hjemmeservice',
    title: 'Sikkerhedstjek',
    description: 'Gennemgang af dine låse for optimal tryghed.',
    link: '#sikkerhedstjek'
  },
  {
    id: 'dl-p3',
    parentItem: 'Privat',
    group: 'Hjemmeservice',
    title: 'Ruko / ASSA ABLOY',
    description: 'Montering af godkendte og sikre låsecylindre.',
    link: '#ruko'
  },
  {
    id: 'dl-p4',
    parentItem: 'Privat',
    group: 'Forebyggelse',
    title: 'Indbrudssikring',
    description: 'Sikring af vinduer og terrassedøre.',
    link: '#privat-indbrud'
  },
  {
    id: 'dl-p5',
    parentItem: 'Privat',
    group: 'Forebyggelse',
    title: 'Nøglekopiering',
    description: 'Hurtig kopiering af ekstra nøgler.',
    link: '#noeglekopiering'
  },

  // Boligforeninger
  {
    id: 'dl-b1',
    parentItem: 'Boligforeninger',
    group: 'Ejendomsservice',
    title: 'Systemlåse',
    description: 'Komplette låsesystemer til hele ejendommen.',
    link: '#systemlaase'
  },
  {
    id: 'dl-b2',
    parentItem: 'Boligforeninger',
    group: 'Ejendomsservice',
    title: 'Dørtelefoner',
    description: 'Moderne porttelefoner med eller uden video.',
    link: '#doertelefoner'
  },
  {
    id: 'dl-b3',
    parentItem: 'Boligforeninger',
    group: 'Ejendomsservice',
    title: 'Vedligeholdelse',
    description: 'Serviceaftaler for dørpumper og hængsler.',
    link: '#vedligeholdelse'
  },
  {
    id: 'dl-b4',
    parentItem: 'Boligforeninger',
    group: 'Administration',
    title: 'Nøglesystemer',
    description: 'Bestilling og administration af systemnøgler.',
    link: '#forening-noegler'
  },
  {
    id: 'dl-b5',
    parentItem: 'Boligforeninger',
    group: 'Administration',
    title: 'Postkasseanlæg',
    description: 'Levering og opsætning af godkendte postkasser.',
    link: '#postkasser'
  }
];

interface CanvasProps {
  sections: Section[];
  theme: SiteTheme;
  selectedElementId: string | null;
  selectedSectionId: string | null;
  isPreviewMode: boolean;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  onSelectElement: (elementId: string) => void;
  onSelectSection: (sectionId: string) => void;
  onUpdateElement: (
    elementId: string, 
    updatedStyles: Partial<ElementStyles>, 
    updatedContent?: string,
    updatedLink?: string,
    updatedSrc?: string,
    updatedFields?: Partial<PageElement>
  ) => void;
  onAddElement: (sectionId: string, colId: string, type: ElementType) => void;
  onDeleteElement: (elementId: string) => void;
  onCloneElement: (elementId: string) => void;
  onMoveElement: (elementId: string, direction: 'up' | 'down') => void;
  onChangeImageClick: (elementId: string) => void;
  onAddSectionBelow: (afterSectionId: string) => void;
  onAddSection: (layout: 'single-col' | 'two-col' | 'three-col') => void;
  pages?: any[];
  onNavigatePage?: (pageId: string) => void;
}

const renderListContent = (text: string, type: 'unordered' | 'ordered' | 'square' | 'checkmark', elCSS: React.CSSProperties) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  const cleanLine = (line: string) => {
    return line.replace(/^\s*([•\-\*✓✔]|\d+\.)\s*/, '');
  };

  const listItems = lines.map((line, index) => {
    const cleaned = cleanLine(line);
    if (type === 'checkmark') {
      return (
        <li key={index} className="flex items-start gap-2">
          <span className="text-emerald-500 font-bold select-none">✓</span>
          <span>{cleaned}</span>
        </li>
      );
    }
    return <li key={index}>{cleaned}</li>;
  });

  const styleClass = 
    type === 'unordered' ? 'list-disc pl-5 space-y-1' :
    type === 'ordered' ? 'list-decimal pl-5 space-y-1' :
    type === 'square' ? 'list-square pl-5 space-y-1' :
    'list-none space-y-1';

  if (type === 'ordered') {
    return <ol className={styleClass} style={elCSS}>{listItems}</ol>;
  }
  
  const customStyles: React.CSSProperties = { ...elCSS };
  if (type === 'square') {
    customStyles.listStyleType = 'square';
  }
  
  return <ul className={styleClass} style={customStyles}>{listItems}</ul>;
};

const renderQuickMenuIcon = (
  el: PageElement, 
  isPreviewMode?: boolean,
  onUpdateElement?: (id: string, updates: Partial<PageElement>, newStyles?: React.CSSProperties) => void
) => {
  const styles = el.styles || {};
  let IconComponent = Home;
  if (el.id.includes('img2')) IconComponent = Building2;
  if (el.id.includes('img3')) IconComponent = Landmark;
  if (el.id.includes('img4')) IconComponent = ShieldCheck;

  const iconSize = styles.fontSize || '24px';
  const sizeNum = parseInt(iconSize) || 24;
  const containerWidth = styles.width || `${Math.round(sizeNum * 2.3)}px`;
  const containerHeight = styles.height || `${Math.round(sizeNum * 2.3)}px`;
  const bgColor = styles.backgroundColor || '#0f172a';
  const borderColor = styles.borderColor || '#334155';
  const iconColor = styles.color || '#f59e0b';
  const borderRadius = styles.borderRadius || '9999px';

  return (
    <div className="relative group mx-auto mb-2">
      <div 
        className="flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-110"
        style={{
          width: containerWidth,
          height: containerHeight,
          fontSize: iconSize,
          color: iconColor,
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: styles.borderWidth || '1px',
          borderStyle: 'solid',
          borderRadius: borderRadius,
        }}
      >
        <IconComponent 
          size={parseInt(iconSize) || 24}
          style={{
            color: iconColor,
          }}
          className="transition-colors group-hover:text-amber-400"
        />
      </div>
      {!isPreviewMode && onUpdateElement && (
        <div className="absolute -bottom-4 right-0 md:-right-4 flex items-center gap-1 bg-indigo-600 border border-indigo-700 rounded-lg shadow-xl p-1 z-30">
          <button 
            type="button"
            onClick={(e) => { 
              e.stopPropagation(); 
              const newSize = Math.max(4, sizeNum - 10);
              onUpdateElement(el.id, {}, { ...styles, fontSize: `${newSize}px`, width: `${Math.round(newSize * 2.3)}px`, height: `${Math.round(newSize * 2.3)}px` });
            }}
            className="w-6 h-6 flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 rounded text-white font-bold text-lg leading-none cursor-pointer border-none"
            title="Gør mindre"
          >
            -
          </button>
          <button 
            type="button"
            onClick={(e) => { 
              e.stopPropagation(); 
              const newSize = Math.min(600, sizeNum + 10);
              onUpdateElement(el.id, {}, { ...styles, fontSize: `${newSize}px`, width: `${Math.round(newSize * 2.3)}px`, height: `${Math.round(newSize * 2.3)}px` });
            }}
            className="w-6 h-6 flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 rounded text-white font-bold text-lg leading-none cursor-pointer border-none"
            title="Gør større"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

interface CollapsibleTextContainerProps {
  elementId: string;
  enableReadMore?: boolean;
  readMoreHeight?: string;
  content: string;
  listType?: 'none' | 'unordered' | 'ordered' | 'square' | 'checkmark';
  elCSS: React.CSSProperties;
  theme: SiteTheme;
  sectionBg?: string;
  siblingImageId?: string;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  isPreviewMode: boolean;
}

const CollapsibleTextContainer = ({
  elementId,
  enableReadMore,
  readMoreHeight,
  content,
  listType,
  elCSS,
  theme,
  sectionBg,
  siblingImageId,
  viewportMode,
  isPreviewMode
}: CollapsibleTextContainerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [siblingImageHeight, setSiblingImageHeight] = useState<number | null>(null);
  const [textHeight, setTextHeight] = useState(0);

  const handleTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      if (!isPreviewMode) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
  };

  // Measure sibling image height in desktop viewport
  useEffect(() => {
    if (!siblingImageId || viewportMode !== 'desktop') {
      setSiblingImageHeight(null);
      return;
    }

    const measureImage = () => {
      const imgEl = document.getElementById(`element-${siblingImageId}`);
      if (imgEl) {
        const rect = imgEl.getBoundingClientRect();
        if (rect.height > 0) {
          setSiblingImageHeight(rect.height);
          return true;
        }
      }
      return false;
    };

    if (!measureImage()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (measureImage() || attempts > 20) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [siblingImageId, viewportMode, content]);

  // Handle window resizing to adjust sibling image height
  useEffect(() => {
    if (!siblingImageId || viewportMode !== 'desktop') return;

    const handleResize = () => {
      const imgEl = document.getElementById(`element-${siblingImageId}`);
      if (imgEl) {
        setSiblingImageHeight(imgEl.getBoundingClientRect().height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [siblingImageId, viewportMode]);

  // Measure the text content height
  useEffect(() => {
    if (containerRef.current) {
      // Temporarily clear inline max-height to measure full height
      const prevMaxHeight = containerRef.current.style.maxHeight;
      containerRef.current.style.maxHeight = 'none';
      setTextHeight(containerRef.current.scrollHeight);
      containerRef.current.style.maxHeight = prevMaxHeight;
    }
  }, [content, listType, elCSS, viewportMode, siblingImageHeight, isExpanded]);

  const limit = siblingImageHeight !== null ? siblingImageHeight : parseInt(readMoreHeight || '200');
  const isReadMoreEnabled = enableReadMore || siblingImageHeight !== null;
  const hasOverflow = textHeight > limit;
  const shouldCollapse = isReadMoreEnabled && hasOverflow;

  // Clean fixed height styles from user text settings to allow height to grow
  const cleanedElCSS = { ...elCSS };
  if (shouldCollapse) {
    delete cleanedElCSS.height;
    delete cleanedElCSS.maxHeight;
  }

  // Use pixel height for smooth transition instead of 'auto'
  const displayHeight = shouldCollapse
    ? (isExpanded ? `${textHeight + 40}px` : `${limit}px`)
    : 'auto';

  // Fade overlay background color
  let fadeColor = sectionBg;
  if (!fadeColor || fadeColor === 'transparent' || fadeColor === 'bg-transparent') {
    fadeColor = theme.background || '#ffffff';
  }

  return (
    <div className="flex flex-col w-full relative" onClick={handleTextClick}>
      <div
        ref={containerRef}
        style={{
          maxHeight: displayHeight,
          overflow: shouldCollapse && !isExpanded ? 'hidden' : 'visible',
          position: 'relative',
          transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {listType && listType !== 'none' ? (
          renderListContent(content, listType, cleanedElCSS)
        ) : (
          <div 
            className="whitespace-pre-wrap outline-hidden" 
            style={cleanedElCSS}
            dangerouslySetInnerHTML={{ __html: content || '<span class="italic text-slate-400">Dobbeltklik for at tilføje tekst her...</span>' }}
          />
        )}

        {/* Fade gradient overlay when collapsed */}
        {shouldCollapse && !isExpanded && (
          <div
            className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none z-10"
            style={{
              background: `linear-gradient(to bottom, transparent, ${fadeColor})`
            }}
          />
        )}
      </div>

      {/* Toggle button */}
      {shouldCollapse && (
        <div className="mt-2.5 flex justify-start z-15">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-md border transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow active:scale-95"
            style={{
              color: theme.primary,
              borderColor: `${theme.primary}33`,
              backgroundColor: 'transparent'
            }}
          >
            <span>{isExpanded ? 'Læs mindre' : 'Læs mere'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 animate-bounce" style={{ animationDuration: '2s' }} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

interface EditableTextProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
  isPreviewMode: boolean;
  onBlur: (newContent: string) => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  tagName?: string;
  isHTML?: boolean;
}

const EditableText = ({
  content,
  className,
  style,
  isPreviewMode,
  onBlur,
  onClick,
  tagName = 'div',
  isHTML = false
}: EditableTextProps) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      if (isHTML) {
        ref.current.innerHTML = content || '';
      } else {
        ref.current.innerText = content || '';
      }
    }
  }, [content, isHTML]);

  const Tag = tagName as any;

  const handleTagClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!isPreviewMode) {
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      contentEditable={!isPreviewMode}
      suppressContentEditableWarning
      onClick={handleTagClick}
      onBlur={(e: any) => {
        const val = isHTML ? e.target.innerHTML : e.target.innerText;
        onBlur(val);
      }}
    />
  );
};

export default function Canvas({
  sections,
  theme,
  selectedElementId,
  selectedSectionId,
  isPreviewMode,
  viewportMode,
  onSelectElement,
  onSelectSection,
  onUpdateElement,
  onAddElement,
  onDeleteElement,
  onCloneElement,
  onMoveElement,
  onChangeImageClick,
  onAddSectionBelow,
  onAddSection,
  pages = [],
  onNavigatePage
}: CanvasProps) {
  const isVisitorMode = !window.location.pathname.includes('admin-editor');
  // Local state for mobile menu responsiveness
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);

  // Local state to dynamically center fixed mobile elements relative to the mockup stage
  const [stageLeft, setStageLeft] = useState<number | null>(null);
  const [stageWidth, setStageWidth] = useState<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastLeft: number | null = null;
    let lastWidth: number | null = null;

    const updatePosition = () => {
      const stageEl = document.getElementById('builder-app-stage');
      if (stageEl) {
        const rect = stageEl.getBoundingClientRect();
        if (rect.left !== lastLeft || rect.width !== lastWidth) {
          lastLeft = rect.left;
          lastWidth = rect.width;
          setStageLeft(rect.left);
          setStageWidth(rect.width);
        }
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [viewportMode, isPreviewMode, sections]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string, pageSlug?: string) => {
    if (!isPreviewMode) {
      e.preventDefault();
      return;
    }

    // 1. If pageSlug is provided, navigate to that page first
    if (pageSlug) {
      const targetPage = pages.find(p => p.slug.toLowerCase() === pageSlug.trim().toLowerCase());
      if (targetPage && onNavigatePage) {
        e.preventDefault();
        onNavigatePage(targetPage.id);
        return;
      }
    }

    // 2. Fallback to normal url path slug check
    if (url && !url.startsWith('#')) {
      const cleanUrl = url.replace(/^\//, '').trim().toLowerCase();
      const targetPage = pages.find(p => p.slug.toLowerCase() === cleanUrl);
      if (targetPage && onNavigatePage) {
        e.preventDefault();
        onNavigatePage(targetPage.id);
        return;
      }
    }

    // 3. Fallback to section anchor links
    if (url && url.startsWith('#')) {
      e.preventDefault();
      const targetId = url.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      const targetSec = sections.find(s => 
        s.id.toLowerCase() === targetId.toLowerCase() || 
        s.name.toLowerCase().replace(/\s+/g, '-') === targetId.toLowerCase()
      );
      if (targetSec) {
        const secEl = document.getElementById(targetSec.id);
        if (secEl) {
          secEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const findLogoOverlay = (): OverlayItem | null => {
    for (const section of sections) {
      for (const col of section.columns) {
        for (const el of col.elements) {
          if (el.overlays) {
            const found = el.overlays.find(o => o.type === 'logo');
            if (found) return found;
          }
        }
      }
    }
    return null;
  };

  const findMenuOverlay = (): OverlayItem | null => {
    for (const section of sections) {
      for (const col of section.columns) {
        for (const el of col.elements) {
          if (el.overlays) {
            const found = el.overlays.find(o => o.type === 'dropdown-menu');
            if (found) return found;
          }
        }
      }
    }
    return null;
  };
  
  // Local state for inline direct text element updates
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [localTextVal, setLocalTextVal] = useState('');
  const editInputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleBackendSubmit = async (element: any, payload: any) => {
    const targetUrl = element.backendUrl || 'https://httpbin.org/post';
    const method = element.backendMethod || 'POST';
    
    try {
      alert(`Submitting data to backend API (${targetUrl})...\nPayload: ${JSON.stringify(payload, null, 2)}`);
      
      const options: RequestInit = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (method === 'POST') {
        options.body = JSON.stringify({
          submittedAt: new Date().toISOString(),
          elementId: element.id,
          payload: payload
        });
      }
      
      const response = await fetch(targetUrl, options);
      
      if (response.ok) {
        const data = await response.json();
        alert(`🎉 Successfully sent data to backend!\n\nResponse Echo from Server:\n${JSON.stringify(data, null, 2)}`);
      } else {
        alert(`❌ Backend submission failed. Status: ${response.status}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`❌ Error connecting to backend: ${err.message || err}`);
    }
  };

  const handleFormSubmit = async (el: any, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') || '';
    const query = formData.get('query') || '';
    
    if (email) {
      try {
        const backendBase = localStorage.getItem('visual-builder-django-url') || (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.5.1') || window.location.origin.includes('127.0.0.1') ? 'http://localhost:8000' : window.location.origin);
        const response = await fetch(`${backendBase}/api/send-newsletter-email/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        
        if (response.ok) {
          const data = await response.json();
          alert(`🎉 Tilmeldt! Nyhedsbrev bekræftelse sendt til ${email}.\n\nSvar fra server: ${data.message || 'Succes'}`);
        } else {
          const errData = await response.json().catch(() => ({}));
          alert(`❌ Kunne ikke tilmelde: ${errData.error || response.statusText || 'Server fejl'}`);
        }
      } catch (err: any) {
        console.error(err);
        alert(`❌ Fejl ved forbindelse til backend: ${err.message || err}`);
      }
    } else {
      const payload = { query };
      if (el.actionType === 'submit') {
        handleBackendSubmit(el, payload);
      } else {
        alert(`🎉 Form submitted locally!\nInput value: ${query}`);
      }
    }
  };

  useEffect(() => {
    if (editingElementId && editInputRef.current) {
      // Find the element and populate its HTML once
      const activeEl = sections.flatMap(s => s.columns.flatMap(c => c.elements)).find(e => e.id === editingElementId);
      if (activeEl) {
        editInputRef.current.innerHTML = activeEl.content;
      }

      editInputRef.current.focus();
      const el = editInputRef.current as any;
      if (el.tagName === 'DIV' || el.contentEditable === 'true') {
        try {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(el);
          range.collapse(false);
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
          }
        } catch (e) {
          console.error("Error setting cursor position on contentEditable:", e);
        }
      } else if (el.selectionStart !== undefined && el.value !== undefined) {
        el.selectionStart = el.value.length;
      }
    }
  }, [editingElementId]);

  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const [selectionRect, setSelectionRect] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (isPreviewMode) return;
    const handleDocumentSelectionChange = () => {
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : '';
      if (!sel || sel.rangeCount === 0 || text.length < 2) {
        setSelectionRange(null);
        setSelectionRect(null);
        return;
      }
      
      const range = sel.getRangeAt(0);
      let node: Node | null = range.startContainer;
      let isInsideEditable = false;
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).hasAttribute('contenteditable')) {
          isInsideEditable = true;
          break;
        }
        node = node.parentNode;
      }

      if (isInsideEditable) {
        const rect = range.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setSelectionRange(range.cloneRange());
          setSelectionRect({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width
          });
          return;
        }
      }
      setSelectionRange(null);
      setSelectionRect(null);
    };

    document.addEventListener('selectionchange', handleDocumentSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleDocumentSelectionChange);
    };
  }, [isPreviewMode]);

  const handleStartInlineEdit = (el: PageElement) => {
    if (isPreviewMode) return;
    setEditingElementId(el.id);
    setLocalTextVal(el.content);
  };

  const handleFinishInlineEdit = (elementId: string) => {
    onUpdateElement(elementId, {}, localTextVal);
    setEditingElementId(null);
  };

  const handleFinishInlineEditHTML = (elementId: string, htmlContent: string) => {
    onUpdateElement(elementId, {}, htmlContent);
    setEditingElementId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, elementId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFinishInlineEdit(elementId);
    }
  };

  const getResolvedStyles = <T extends { styles: ElementStyles; stylesTablet?: ElementStyles; stylesMobile?: ElementStyles }>(
    item: T
  ): ElementStyles => {
    const base = item.styles || {};
    if (viewportMode === 'mobile') {
      return {
        ...base,
        ...(item.stylesTablet || {}),
        ...(item.stylesMobile || {}),
      };
    } else if (viewportMode === 'tablet') {
      return {
        ...base,
        ...(item.stylesTablet || {}),
      };
    }
    return base;
  };

  const getResolvedSection = (section: Section): Section => {
    if (viewportMode === 'mobile') {
      return {
        ...section,
        ...(section.tabletOverrides || {}),
        ...(section.mobileOverrides || {}),
      };
    } else if (viewportMode === 'tablet') {
      return {
        ...section,
        ...(section.tabletOverrides || {}),
      };
    }
    return section;
  };

  const formatStyleVal = (val: string | undefined): string | undefined => {
    if (!val) return undefined;
    if (/^-?\d+(\.\d+)?$/.test(val.trim())) {
      return `${val.trim()}px`;
    }
    return val;
  };

  const safeFontSize = (val: any, defaultVal: string = '14px'): string => {
    if (val === undefined || val === null || val === '') return defaultVal;
    const str = String(val).trim();
    if (/^\d+$/.test(str)) return `${str}px`;
    return str;
  };

  // Convert styles to inline react CSS styles safely
  const buildInlineCSS = (s: ElementStyles): React.CSSProperties => {
    return {
      fontFamily: s.fontFamily,
      fontSize: formatStyleVal(s.fontSize),
      fontWeight: s.fontWeight,
      fontStyle: s.fontStyle,
      textDecoration: s.textDecoration,
      textAlign: s.textAlign,
      lineHeight: s.lineHeight,
      letterSpacing: formatStyleVal(s.letterSpacing),
      wordSpacing: formatStyleVal(s.wordSpacing),
      color: s.color,
      backgroundColor: s.backgroundColor,
      borderWidth: formatStyleVal(s.borderWidth),
      borderColor: s.borderColor,
      borderRadius: formatStyleVal(s.borderRadius),
      paddingTop: formatStyleVal(s.paddingTop),
      paddingBottom: formatStyleVal(s.paddingBottom),
      paddingLeft: formatStyleVal(s.paddingLeft),
      paddingRight: formatStyleVal(s.paddingRight),
      marginTop: formatStyleVal(s.marginTop),
      marginBottom: formatStyleVal(s.marginBottom),
      marginLeft: formatStyleVal(s.marginLeft),
      marginRight: formatStyleVal(s.marginRight),
      width: formatStyleVal(s.width),
      height: formatStyleVal(s.height),
    };
  };

  // Get font pairing stylesheet classes based on current theme configuration
  const fontClass = 
    theme.fontFamily === 'serif' ? 'font-serif' :
    theme.fontFamily === 'mono' ? 'font-mono' :
    theme.fontFamily === 'display' ? 'font-display' :
    'font-sans';

  return (
    <div 
      className={`flex-1 ${
        viewportMode === 'desktop' ? 'bg-slate-100 dark:bg-slate-950/40' : 'bg-transparent'
      } ${
        viewportMode === 'desktop' ? (isPreviewMode ? 'md:p-0' : 'md:p-8 p-4') : 'p-0'
      } ${fontClass} transition-all duration-300 flex items-start justify-center ${
        viewportMode === 'desktop' ? 'overflow-y-auto' : 'overflow-y-visible'
      }`} 
      id="builder-canvas-wrapper"
    >
      <div 
        className={`w-full bg-white dark:bg-slate-900 transition-all overflow-hidden ${
          viewportMode === 'desktop'
            ? (isPreviewMode 
                ? 'max-w-full rounded-none shadow-none min-h-[85vh]' 
                : 'max-w-5xl rounded-xl shadow-2xl border border-slate-200/60 dark:border-slate-800 min-h-[85vh]')
            : 'max-w-full rounded-none shadow-none min-h-0'
        }`}
        style={{ 
          backgroundColor: theme.background, 
          color: theme.text
        }}
        id="builder-app-stage"
      >
        <style>
          {`
            #builder-app-stage p,
            #builder-app-stage span:not(.lucide),
            #builder-app-stage h1,
            #builder-app-stage h2,
            #builder-app-stage h3,
            #builder-app-stage h4,
            #builder-app-stage h5,
            #builder-app-stage h6,
            #builder-app-stage li,
            #builder-app-stage a {
              line-height: ${theme.baseLineHeight || '1.5'};
            }
          `}
        </style>
        {sections.map((rawSection, sIdx) => {
          const section = getResolvedSection(rawSection);
          const isSectionSelected = selectedSectionId === section.id;
          const sectionPadY = 
            viewportMode === 'desktop' ? (
              section.paddingY === 'none' ? 'py-0' :
              section.paddingY === 'sm' ? 'py-6 md:py-8' :
              section.paddingY === 'lg' ? 'py-16 md:py-24' :
              section.paddingY === 'xl' ? 'py-20 md:py-32' :
              'py-12 md:py-16'
            ) : (
              section.paddingY === 'none' ? 'py-0' :
              section.paddingY === 'sm' ? (viewportMode === 'mobile' ? 'py-4' : 'py-6') :
              section.paddingY === 'lg' ? (viewportMode === 'mobile' ? 'py-10' : 'py-16') :
              section.paddingY === 'xl' ? (viewportMode === 'mobile' ? 'py-12' : 'py-20') :
              (viewportMode === 'mobile' ? 'py-8' : 'py-12')
            );

          const sectionPx = section.fullWidth 
            ? 'px-0' 
            : (viewportMode === 'desktop' 
                ? 'px-6 md:px-12' 
                : (viewportMode === 'mobile' ? 'px-4' : 'px-6'));

          const isSectionHiddenInViewport = 
            (viewportMode === 'mobile' && section.visibleOnMobile === false) ||
            (viewportMode === 'tablet' && section.visibleOnTablet === false) ||
            (viewportMode === 'desktop' && section.visibleOnDesktop === false);

          if (isPreviewMode && isSectionHiddenInViewport) {
            return null;
          }

          const sectionVisibilityClasses = [
            section.visibleOnDesktop === false ? 'hide-on-desktop' : '',
            section.visibleOnTablet === false ? 'hide-on-tablet' : '',
            section.visibleOnMobile === false ? 'hide-on-mobile' : ''
          ].filter(Boolean).join(' ');

          return (
            <div 
              key={section.id}
              onClick={(e) => {
                e.stopPropagation();
                if (!isPreviewMode) onSelectSection(section.id);
              }}
              className={`group/section relative transition-all border-y ${sectionVisibilityClasses} ${
                isPreviewMode 
                  ? 'border-transparent' 
                  : isSectionSelected
                    ? 'border-indigo-500 bg-indigo-50/5 ring-1 ring-indigo-500'
                    : 'border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700'
              }`}
              style={(!isPreviewMode && isSectionHiddenInViewport) ? { opacity: 0.35 } : undefined}
              id={`section-${section.id}`}
            >
              {!isPreviewMode && isSectionHiddenInViewport && (
                <div className="absolute top-3 left-3 z-30 bg-rose-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow pointer-events-none select-none uppercase">
                  Hidden on {viewportMode}
                </div>
              )}
              {/* Section Control Board Overlay (Hidden in Preview) */}
              {!isPreviewMode && (
                <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 opacity-0 group-hover/section:opacity-100 focus-within:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
                  <span className="text-[10px] font-mono font-bold text-slate-400 px-1">{section.name}</span>
                  <span className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700"></span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSection(section.id);
                    }}
                    className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 rounded"
                    title="Section Config Settings"
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSectionBelow(section.id);
                    }}
                    className="p-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 rounded"
                    title="Append New Section Below"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Core Content Container */}
              <div 
                className={`${sectionPadY} ${sectionPx} transition-colors relative overflow-hidden`} 
                style={{ 
                  backgroundColor: section.backgroundColor, 
                  color: section.textColor || theme.text,
                  backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: formatStyleVal(section.minHeight) || undefined,
                  paddingTop: formatStyleVal(section.customPaddingTop) || undefined,
                  paddingBottom: formatStyleVal(section.customPaddingBottom) || undefined,
                  width: viewportMode === 'desktop' ? (formatStyleVal(section.customWidth) || undefined) : '100%',
                  maxWidth: '100%',
                  height: formatStyleVal(section.customHeight) || undefined,
                  paddingLeft: formatStyleVal(section.customPaddingLeft) || undefined,
                  paddingRight: formatStyleVal(section.customPaddingRight) || undefined,
                  marginTop: formatStyleVal(section.customMarginTop) || undefined,
                  marginBottom: formatStyleVal(section.customMarginBottom) || undefined,
                }}
              >
                {/* Opacity Overlay if background image is present */}
                {section.backgroundImage && (
                  <div 
                    className="absolute inset-0 bg-black pointer-events-none" 
                    style={{ opacity: (section.bgOpacity !== undefined ? section.bgOpacity : 40) / 100, zIndex: 0 }}
                  />
                )}
                <div className={`${section.fullWidth ? 'max-w-none w-full' : 'max-w-6xl mx-auto'} relative z-10`} style={{ zIndex: 1 }}>
                  <div className={`flex items-start justify-between ${
                    section.id === 'locksmith-quick-menu'
                      ? 'flex-row gap-2 w-full justify-around'
                      : (viewportMode === 'desktop' 
                          ? 'flex-col md:flex-row gap-8 md:gap-12' 
                          : 'flex-col gap-6 w-full')
                  }`}>
                    {section.columns.map((col) => {
                      const colWidthClass = section.id === 'locksmith-quick-menu'
                        ? 'flex-1'
                        : (viewportMode === 'desktop'
                            ? (col.customWidth 
                                ? '' 
                                : ((col.width === 'flex-1' || col.width === 'md:flex-1' || !col.width || col.width === '') ? 'md:flex-1' : col.width))
                            : 'w-full');
                      
                      const colStyle = section.id === 'locksmith-quick-menu'
                        ? { flex: '1 1 0%' }
                        : (viewportMode === 'desktop'
                            ? (col.customWidth 
                                ? { flex: 'none', width: col.customWidth } 
                                : ((col.width === 'flex-1' || col.width === 'md:flex-1' || !col.width || col.width === '') ? { flex: '1 1 0%' } : undefined))
                            : { flex: 'none', width: '100%' });

                      return (
                        <div 
                          key={col.id} 
                          className={`w-full ${colWidthClass} flex flex-col space-y-4 relative ${
                            !isPreviewMode ? 'p-2 border border-dashed border-slate-100 dark:border-slate-800/60 rounded-lg min-h-[140px]' : ''
                          }`}
                          style={colStyle}
                          id={`column-${col.id}`}
                        >
                        {/* Column Name label in Editor */}
                        {!isPreviewMode && col.elements.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-10 bg-slate-50/65 dark:bg-slate-900/65 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center group cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/10 transition-all">
                            <Plus className="w-5 h-5 mb-1.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400 group-hover:text-indigo-500 transition-colors">+ Drop Component</p>
                            <span className="text-[10px] text-slate-400 max-w-[150px] mt-1 leading-relaxed">Select an insertion utility below to add text, images or call-to-actions.</span>
                          </div>
                        )}

                        {/* Components Lists */}
                        {col.elements.map((rawEl) => {
                          const el = { ...rawEl, styles: getResolvedStyles(rawEl) };
                          const isElementSelected = selectedElementId === el.id;
                          const elCSS = buildInlineCSS(el.styles);

                          // Find sibling image in a different column of the same section (ignore for footer)
                          const isFooterSection = section.id.toLowerCase().includes('foot') || 
                                                  (section.name && section.name.toLowerCase().includes('foot'));
                          const siblingImage = isFooterSection ? null : section.columns
                            .filter(c => c.id !== col.id)
                            .flatMap(c => c.elements)
                            .find(e => e.type === 'image');
                          const siblingImageId = siblingImage?.id;

                          const isElementHiddenInViewport = 
                            (viewportMode === 'mobile' && el.visibleOnMobile === false) ||
                            (viewportMode === 'tablet' && el.visibleOnTablet === false) ||
                            (viewportMode === 'desktop' && el.visibleOnDesktop === false);

                          if (isPreviewMode && isElementHiddenInViewport) {
                            return null;
                          }

                          const elementVisibilityClasses = [
                            el.visibleOnDesktop === false ? 'hide-on-desktop' : '',
                            el.visibleOnTablet === false ? 'hide-on-tablet' : '',
                            el.visibleOnMobile === false ? 'hide-on-mobile' : ''
                          ].filter(Boolean).join(' ');

                          return (
                            <div
                              key={el.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isPreviewMode) {
                                  onSelectElement(el.id);
                                  if (el.type === 'text') handleStartInlineEdit(el);
                                }
                              }}
                              className={`group/el relative transition-all rounded ${elementVisibilityClasses} ${
                                isPreviewMode
                                  ? ''
                                  : isElementSelected
                                    ? 'ring-4 ring-indigo-500/10 border-2 border-indigo-500 p-2 -m-2 z-10'
                                    : 'hover:border-dashed hover:border hover:border-slate-350 dark:hover:border-slate-700 p-2 -m-2 cursor-pointer'
                              }`}
                              style={(!isPreviewMode && isElementHiddenInViewport) ? { opacity: 0.35 } : undefined}
                              id={`element-${el.id}`}
                            >
                              {!isPreviewMode && isElementHiddenInViewport && (
                                <div className="absolute top-1 left-1 z-20 bg-rose-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow pointer-events-none select-none uppercase">
                                  Hidden on {viewportMode}
                                </div>
                              )}
                              {/* Selected Component Quick toolbar helper - Sleek Dark Pill */}
                              {!isPreviewMode && isElementSelected && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-35 flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-white text-[11px] py-1 px-2.5 rounded-full shadow-xl animate-in fade-in zoom-in-95 duration-150 font-sans tracking-wide">
                                  <span className="font-semibold uppercase tracking-wider text-[9px] text-indigo-400 mr-1.5">{el.type}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onMoveElement(el.id, 'up');
                                    }}
                                    className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
                                    title="Move Element Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onMoveElement(el.id, 'down');
                                    }}
                                    className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
                                    title="Move Element Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="w-px h-3 bg-slate-800"></span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onCloneElement(el.id);
                                    }}
                                    className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
                                    title="Duplicate Component"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteElement(el.id);
                                    }}
                                    className="p-1 hover:bg-rose-950/40 rounded transition-colors text-rose-400"
                                    title="Delete Component"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}

                              {/* Render Content Specifics */}
                              {el.type === 'text' && (
                                <div>
                                  {editingElementId === el.id ? (
                                    <div className="relative w-full">
                                      {/* Floating rich text formatting toolbar */}
                                      <div className="absolute -top-12 left-0 z-50 flex items-center gap-1 bg-slate-900 text-white px-2.5 py-1.5 rounded-lg shadow-xl border border-slate-700 pointer-events-auto">
                                        <button 
                                          type="button"
                                          onMouseDown={(e) => e.preventDefault()}
                                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); document.execCommand('bold'); }}
                                          className="p-1 hover:bg-slate-800 rounded font-bold text-xs w-6 h-6 flex items-center justify-center cursor-pointer border-none bg-transparent text-white"
                                          title="Bold"
                                        >
                                          B
                                        </button>
                                        <button 
                                          type="button"
                                          onMouseDown={(e) => e.preventDefault()}
                                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); document.execCommand('italic'); }}
                                          className="p-1 hover:bg-slate-800 rounded italic text-xs w-6 h-6 flex items-center justify-center cursor-pointer border-none bg-transparent text-white"
                                          title="Italic"
                                        >
                                          I
                                        </button>
                                        <button 
                                          type="button"
                                          onMouseDown={(e) => e.preventDefault()}
                                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); document.execCommand('underline'); }}
                                          className="p-1 hover:bg-slate-800 rounded underline text-xs w-6 h-6 flex items-center justify-center cursor-pointer border-none bg-transparent text-white"
                                          title="Underline"
                                        >
                                          U
                                        </button>
                                        <span className="w-[1px] h-4 bg-slate-700 mx-1"></span>
                                        <button 
                                          type="button"
                                          onMouseDown={(e) => e.preventDefault()}
                                          onClick={(e) => { 
                                            e.preventDefault(); 
                                            e.stopPropagation(); 
                                            const url = prompt("Indtast link URL (f.eks. #shop eller /about eller https://google.com):");
                                            if (url) {
                                              document.execCommand('createLink', false, url);
                                            }
                                          }}
                                          className="p-1 hover:bg-slate-800 rounded text-xs flex items-center justify-center cursor-pointer border-none bg-transparent text-white gap-1"
                                          title="Add Link"
                                        >
                                          <Link className="w-3 h-3 text-indigo-400" /> Link
                                        </button>
                                        <span className="w-[1px] h-4 bg-slate-700 mx-1"></span>
                                        <select 
                                          className="bg-slate-800 text-white text-[10px] font-bold border border-slate-700 rounded px-1.5 py-1 cursor-pointer focus:outline-none hover:bg-slate-750"
                                          onChange={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (e.target.value) {
                                              document.execCommand('fontName', false, e.target.value);
                                              // Reset the select back to "Font..." so it can be used again easily
                                              e.target.value = "";
                                            }
                                          }}
                                        >
                                          <option value="">Font...</option>
                                          <option value="Inter">Inter</option>
                                          <option value="Poppins">Poppins</option>
                                          <option value="Montserrat">Montserrat</option>
                                          <option value="Roboto">Roboto</option>
                                          <option value="Outfit">Outfit</option>
                                          <option value="Arial">Arial</option>
                                          <option value="Georgia">Georgia</option>
                                        </select>
                                        <span className="w-[1px] h-4 bg-slate-700 mx-1"></span>
                                        <select 
                                          className="bg-slate-800 text-white text-[10px] font-bold border border-slate-700 rounded px-1.5 py-1 cursor-pointer focus:outline-none hover:bg-slate-750"
                                          onChange={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const size = e.target.value;
                                            if (size) {
                                              document.execCommand('fontSize', false, '7');
                                              const fonts = document.querySelectorAll('font[size="7"]');
                                              fonts.forEach(f => {
                                                f.removeAttribute('size');
                                                f.style.fontSize = `${size}px`;
                                              });
                                              e.target.value = "";
                                            }
                                          }}
                                        >
                                          <option value="">Size...</option>
                                          <option value="8">8px</option>
                                          <option value="10">10px</option>
                                          <option value="12">12px</option>
                                          <option value="14">14px</option>
                                          <option value="16">16px</option>
                                          <option value="18">18px</option>
                                          <option value="20">20px</option>
                                          <option value="24">24px</option>
                                          <option value="28">28px</option>
                                          <option value="32">32px</option>
                                          <option value="36">36px</option>
                                          <option value="40">40px</option>
                                          <option value="48">48px</option>
                                          <option value="56">56px</option>
                                          <option value="64">64px</option>
                                          <option value="72">72px</option>
                                          <option value="96">96px</option>
                                          <option value="120">120px</option>
                                        </select>
                                      </div>
                                      
                                      <div
                                        ref={editInputRef as any}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                          handleFinishInlineEditHTML(el.id, e.target.innerHTML);
                                        }}
                                        onClick={(e) => {
                                          const anchor = (e.target as HTMLElement).closest('a');
                                          if (anchor) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                          }
                                        }}
                                        className="w-full bg-slate-50 dark:bg-slate-850 border border-indigo-200 dark:border-indigo-900 rounded focus:outline-hidden p-2 text-slate-800 dark:text-slate-100 font-sans cursor-text min-h-[40px] pointer-events-auto"
                                        style={elCSS}
                                      />
                                    </div>
                                  ) : (
                                    (() => {
                                      const textContainer = (
                                        <CollapsibleTextContainer
                                          elementId={el.id}
                                          enableReadMore={el.enableReadMore}
                                          readMoreHeight={el.readMoreHeight}
                                          content={el.content}
                                          listType={el.listType}
                                          elCSS={elCSS}
                                          theme={theme}
                                          sectionBg={section.backgroundColor}
                                          siblingImageId={siblingImageId}
                                          viewportMode={viewportMode}
                                          isPreviewMode={isPreviewMode}
                                        />
                                      );

                                      if (isPreviewMode && el.link) {
                                        return (
                                          <a 
                                            href={el.link}
                                            onClick={(e) => {
                                              if (el.link.startsWith('#')) {
                                                handleLinkClick(e, el.link);
                                              }
                                            }}
                                            className="no-underline block hover:underline"
                                            style={{ color: 'inherit' }}
                                          >
                                            {textContainer}
                                          </a>
                                        );
                                      }
                                      return textContainer;
                                    })()
                                  )}
                                </div>
                              )}

                              {el.type === 'button' && (
                                <div style={{ textAlign: el.styles.textAlign || 'left', marginTop: formatStyleVal(el.styles.marginTop) || '0px', marginBottom: formatStyleVal(el.styles.marginBottom) || '0px' }}>
                                  <a
                                    href={el.link || '#'}
                                    onClick={(e) => {
                                      if (!isPreviewMode) {
                                        e.preventDefault(); // Disable navigation buttons in edit modes
                                      } else if (el.actionType === 'submit') {
                                        e.preventDefault();
                                        handleBackendSubmit(el, { clickedButtonId: el.id, content: el.content });
                                      }
                                    }}
                                    className="inline-flex items-center justify-center whitespace-nowrap transition-transform active:scale-95 duration-100 font-semibold text-center"
                                    style={{
                                      backgroundColor: el.styles.backgroundColor || theme.primary,
                                      color: el.styles.color || '#ffffff',
                                      paddingTop: formatStyleVal(el.styles.paddingTop) || '0.66em',
                                      paddingBottom: formatStyleVal(el.styles.paddingBottom) || '0.66em',
                                      paddingLeft: formatStyleVal(el.styles.paddingLeft) || '1.46em',
                                      paddingRight: formatStyleVal(el.styles.paddingRight) || '1.46em',
                                      borderRadius: formatStyleVal(el.styles.borderRadius) || '6px',
                                      fontSize: formatStyleVal(el.styles.fontSize) || '15px',
                                      fontWeight: el.styles.fontWeight || '500',
                                      wordSpacing: formatStyleVal(el.styles.wordSpacing) || '0px',
                                      letterSpacing: formatStyleVal(el.styles.letterSpacing) || '0px',
                                      width: formatStyleVal(el.styles.width) || undefined,
                                      height: formatStyleVal(el.styles.height) || undefined,
                                    }}
                                  >
                                    {el.content}
                                  </a>
                                </div>
                              )}

                              {el.type === 'image' && (
                                <div 
                                  className="relative group/img overflow-hidden animate-in fade-in duration-200" 
                                  style={{ 
                                    marginTop: formatStyleVal(el.styles.marginTop) || '0px', 
                                    marginBottom: formatStyleVal(el.styles.marginBottom) || '0px',
                                    width: formatStyleVal(el.styles.width) || '100%',
                                    height: formatStyleVal(el.styles.height) || undefined,
                                      minHeight: el.styles.minHeight !== undefined
                                      ? (el.styles.minHeight === 'none' ? undefined : formatStyleVal(el.styles.minHeight))
                                      : (el.styles.height || el.id.includes('foot') || el.id.includes('logo') || (section.name && section.name.toLowerCase().includes('foot')))
                                        ? undefined 
                                        : '220px',
                                  }}
                                >
                                  {el.id.startsWith('locksmith-quick-img') ? (
                                    renderQuickMenuIcon(el, isPreviewMode, onUpdateElement)
                                  ) : (
                                    <>
                                      <img
                                        src={el.src || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'}
                                        alt={el.alt || 'Visual Item'}
                                        referrerPolicy="no-referrer"
                                        className={`${el.styles.width === 'auto' ? 'w-auto' : 'w-full'} h-full transition-transform duration-300`}
                                        style={{ 
                                          borderRadius: formatStyleVal(el.styles.borderRadius) || '12px',
                                          borderWidth: formatStyleVal(el.styles.borderWidth) || '0px',
                                          borderColor: el.styles.borderColor || 'transparent',
                                          objectFit: el.styles.objectFit || (el.styles.width === 'auto' ? 'contain' : 'cover'),
                                        }}
                                      />
                                  
                                  {/* Background overlay tint for readability */}
                                  {((el.overlayTitle || el.overlaySubtext || el.showOverlayButton || el.showOverlaySearch) || (el.overlays && el.overlays.length > 0) || (!isPreviewMode && !el.id.includes('foot') && !el.id.includes('logo') && !(section.name && section.name.toLowerCase().includes('foot')) && (el.overlayTitle || el.overlaySubtext || el.showOverlayButton || el.showOverlaySearch))) && (
                                    <div 
                                      className="absolute inset-0 transition-opacity pointer-events-none"
                                      style={{
                                        backgroundColor: el.overlayBgColor || '#000000',
                                        opacity: (el.overlayBgOpacity !== undefined ? el.overlayBgOpacity : 30) / 100,
                                        borderRadius: el.styles.borderRadius || '12px',
                                      }}
                                    />
                                  )}

                                  {/* Overlay elements content wrapper */}
                                   {((el.overlayTitle || el.overlaySubtext || el.showOverlayButton || el.showOverlaySearch) || (el.overlays && el.overlays.length > 0) || (!isPreviewMode && !el.id.includes('foot') && !el.id.includes('logo') && !(section.name && section.name.toLowerCase().includes('foot')) && (el.overlayTitle || el.overlaySubtext || el.showOverlayButton || el.showOverlaySearch))) && (
                                    <div 
                                      className={`absolute inset-0 p-6 flex flex-col ${
                                        viewportMode === 'desktop' ? (
                                          el.overlayPosition === 'top-left' ? 'justify-start items-start text-left' :
                                          el.overlayPosition === 'top-center' ? 'justify-start items-center text-center' :
                                          el.overlayPosition === 'top-right' ? 'justify-start items-end text-right' :
                                          el.overlayPosition === 'center-left' ? 'justify-center items-start text-left' :
                                          el.overlayPosition === 'center-right' ? 'justify-center items-end text-right' :
                                          el.overlayPosition === 'bottom-left' ? 'justify-end items-start text-left' :
                                          el.overlayPosition === 'bottom-center' ? 'justify-end items-center text-center' :
                                          el.overlayPosition === 'bottom-right' ? 'justify-end items-end text-right' :
                                          'justify-center items-center text-center'
                                        ) : 'justify-center items-center text-center'
                                      } z-10`}
                                      style={{ borderRadius: el.styles.borderRadius || '12px' }}
                                    >
                                      {el.overlays && el.overlays.length > 0 ? (
                                        el.overlays.map((rawItem) => {
                                          const item = { ...rawItem, styles: getResolvedStyles(rawItem) };
                                          if (item.type === 'text') {
                                            const textItem = (
                                              <EditableText
                                                content={item.content}
                                                className="outline-hidden max-w-lg cursor-text focus:ring-1 focus:ring-indigo-500/30 p-1"
                                                style={{
                                                  color: item.styles.color || '#ffffff',
                                                  fontSize: formatStyleVal(item.styles.fontSize) || '16px',
                                                  fontWeight: item.styles.fontWeight || '500',
                                                  textAlign: viewportMode === 'desktop' ? (item.styles.textAlign || 'center') : 'center',
                                                  marginTop: formatStyleVal(item.styles.marginTop) || '0px',
                                                  marginBottom: formatStyleVal(item.styles.marginBottom) || '8px',
                                                  lineHeight: item.styles.lineHeight || '1.4',
                                                  letterSpacing: formatStyleVal(item.styles.letterSpacing) || '0px',
                                                  fontFamily: item.styles.fontFamily || el.styles.fontFamily,
                                                }}
                                                isPreviewMode={isPreviewMode}
                                                isHTML={true}
                                                onBlur={(newHTML) => {
                                                  const updatedOverlays = (el.overlays || []).map(o => o.id === item.id ? { ...o, content: newHTML } : o);
                                                  onUpdateElement(el.id, {}, undefined, undefined, undefined, { overlays: updatedOverlays });
                                                }}
                                                onClick={(e) => {
                                                  if (!isPreviewMode) {
                                                    onSelectElement(el.id);
                                                  }
                                                  e.stopPropagation();
                                                }}
                                              />
                                            );

                                            if (isPreviewMode && item.link) {
                                              return (
                                                <a 
                                                  key={item.id}
                                                  href={item.link}
                                                  onClick={(e) => {
                                                    if (item.link && item.link.startsWith('#')) {
                                                      handleLinkClick(e, item.link);
                                                    }
                                                  }}
                                                  className="no-underline block hover:underline pointer-events-auto"
                                                  style={{ color: 'inherit' }}
                                                >
                                                  {textItem}
                                                </a>
                                              );
                                            }
                                            return (
                                              <React.Fragment key={item.id}>
                                                {textItem}
                                              </React.Fragment>
                                            );
                                          }
                                          if (item.type === 'button') {
                                            return (
                                              <div 
                                                key={item.id}
                                                style={{ 
                                                  marginTop: formatStyleVal(item.styles.marginTop) || '4px', 
                                                  marginBottom: formatStyleVal(item.styles.marginBottom) || '4px',
                                                  textAlign: viewportMode === 'desktop' ? (item.styles.textAlign || 'center') : 'center'
                                                }}
                                              >
                                                <a
                                                  href={item.link || '#'}
                                                  onClick={(e) => {
                                                    if (!isPreviewMode) {
                                                      e.preventDefault();
                                                        onSelectElement(el.id);
                                                    } else if (item.actionType === 'submit') {
                                                      e.preventDefault();
                                                      handleBackendSubmit(item as any, { clickedOverlayButtonId: item.id, content: item.content });
                                                    }
                                                    e.stopPropagation();
                                                  }}
                                                  className="inline-flex items-center justify-center whitespace-nowrap transition-transform active:scale-95 duration-100 font-semibold pointer-events-auto text-center"
                                                  style={{
                                                    backgroundColor: item.styles.backgroundColor || '#ffffff',
                                                    color: item.styles.color || '#0f172a',
                                                    paddingTop: formatStyleVal(item.styles.paddingTop) || '0.615em',
                                                    paddingBottom: formatStyleVal(item.styles.paddingBottom) || '0.615em',
                                                    paddingLeft: formatStyleVal(item.styles.paddingLeft) || '1.23em',
                                                    paddingRight: formatStyleVal(item.styles.paddingRight) || '1.23em',
                                                    borderRadius: formatStyleVal(item.styles.borderRadius) || '6px',
                                                    fontSize: formatStyleVal(item.styles.fontSize) || '13px',
                                                    fontWeight: item.styles.fontWeight || '600',
                                                    width: formatStyleVal(item.styles.width) || undefined,
                                                    height: formatStyleVal(item.styles.height) || undefined,
                                                    fontFamily: item.styles.fontFamily || el.styles.fontFamily,
                                                  }}
                                                >
                                                  {item.content}
                                                </a>
                                              </div>
                                            );
                                          }
                                          if (item.type === 'search-box') {
                                            return (
                                              <form 
                                                key={item.id}
                                                onSubmit={(e) => {
                                                  e.preventDefault();
                                                  handleFormSubmit(item as any, e);
                                                }}
                                                className="flex gap-2 w-full max-w-sm pointer-events-auto shrink-0" 
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                  marginTop: formatStyleVal(item.styles.marginTop) || '8px',
                                                  marginBottom: formatStyleVal(item.styles.marginBottom) || '8px',
                                                }}
                                              >
                                                <input 
                                                  type="text" 
                                                  name="email"
                                                  required
                                                  placeholder={item.content || "Enter email..."}
                                                  className="flex-1 px-3 py-2 text-xs rounded bg-white/95 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-350 font-sans"
                                                  onClick={(e) => e.stopPropagation()}
                                                />
                                                <button 
                                                  type="submit"
                                                  className="hover:opacity-90 transition-colors shrink-0 border-none cursor-pointer"
                                                  onClick={(e) => e.stopPropagation()}
                                                  style={{
                                                    backgroundColor: item.styles.backgroundColor || '#4f46e5',
                                                    color: item.styles.color || '#ffffff',
                                                    fontSize: formatStyleVal(item.styles.fontSize) || '12px',
                                                    paddingTop: formatStyleVal(item.styles.paddingTop) || '0.66em',
                                                    paddingBottom: formatStyleVal(item.styles.paddingBottom) || '0.66em',
                                                    paddingLeft: formatStyleVal(item.styles.paddingLeft) || '1.33em',
                                                    paddingRight: formatStyleVal(item.styles.paddingRight) || '1.33em',
                                                    borderRadius: formatStyleVal(item.styles.borderRadius) || '4px',
                                                    fontWeight: item.styles.fontWeight || '700',
                                                  }}
                                                >
                                                  {item.link || "Subscribe"}
                                                </button>
                                              </form>
                                            );
                                          }
                                          return null;
                                        })
                                      ) : (
                                        <>
                                          {/* Overlay Title */}
                                          {(el.overlayTitle || !isPreviewMode) && (
                                            <h3 
                                              className={`text-white font-bold leading-tight mb-2 max-w-lg ${!el.overlayTitle ? 'italic opacity-40 text-xs font-normal' : 'text-xl md:text-2xl'}`}
                                              style={{ fontFamily: el.styles.fontFamily }}
                                            >
                                              {el.overlayTitle || (isPreviewMode ? '' : '[Edit Overlay Title in Inspector]')}
                                            </h3>
                                          )}
                                          
                                          {/* Overlay Subtext */}
                                          {(el.overlaySubtext || !isPreviewMode) && (
                                            <p 
                                              className={`text-slate-200 max-w-md mb-4 ${!el.overlaySubtext ? 'italic opacity-40 text-[10px]' : 'text-xs md:text-sm'}`}
                                              style={{ fontFamily: el.styles.fontFamily }}
                                            >
                                              {el.overlaySubtext || (isPreviewMode ? '' : '[Edit Overlay Subtext in Inspector]')}
                                            </p>
                                          )}

                                          {/* Newsletter Signup (Search Box style with input and button) */}
                                          {el.showOverlaySearch && (
                                            <form 
                                              onSubmit={(e) => {
                                                e.preventDefault();
                                                handleFormSubmit(el, e);
                                              }}
                                              className="flex gap-2 w-full max-w-sm mb-4 pointer-events-auto shrink-0" 
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <input 
                                                type="text" 
                                                name="email"
                                                required
                                                placeholder={el.overlaySearchPlaceholder || "Enter your email..."}
                                                className="flex-1 px-3 py-2 text-xs rounded bg-white/95 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-350 font-sans"
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ fontFamily: el.styles.fontFamily }}
                                              />
                                              <button 
                                                type="submit"
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-xs transition-colors shrink-0 border-none cursor-pointer"
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ fontFamily: el.styles.fontFamily }}
                                              >
                                                {el.overlaySearchButtonText || "Subscribe"}
                                              </button>
                                            </form>
                                          )}

                                          {/* Overlay Button */}
                                          {el.showOverlayButton && (
                                            <a 
                                              href={el.overlayButtonLink || "#"}
                                              className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded font-semibold text-xs transition-colors pointer-events-auto inline-block border border-slate-200 text-center"
                                              onClick={(e) => {
                                                if (!isPreviewMode) {
                                                  e.preventDefault();
                                                } else if (el.actionType === 'submit') {
                                                  e.preventDefault();
                                                  handleBackendSubmit(el, { clickedOverlayButtonId: el.id, content: el.overlayButtonText });
                                                }
                                                e.stopPropagation();
                                              }}
                                              style={{
                                                width: el.styles.width || undefined,
                                                height: el.styles.height || undefined,
                                                fontFamily: el.styles.fontFamily,
                                              }}
                                            >
                                              {el.overlayButtonText || "Click Here"}
                                            </a>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                    </>
                                  )}
                                  
                                  {/* Change Image Hover trigger inside editor */}
                                  {!isPreviewMode && !el.id.startsWith('locksmith-quick-img') && (
                                    <div 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onChangeImageClick(el.id);
                                      }}
                                      className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-white font-medium text-xs cursor-pointer rounded-lg z-20"
                                    >
                                      <ImageIcon className="w-5 h-5 mb-1 text-slate-100" />
                                      <span>Configure Image Link</span>
                                      <p className="text-[9px] text-slate-350 mt-1">Select preset or upload from device</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {el.type === 'image-banner' && (
                                el.id === 'locksmith-news-banner' ? (
                                  <div 
                                    className={`relative w-full overflow-hidden flex transition-all bg-cover bg-center ${
                                      viewportMode === 'desktop' 
                                        ? 'flex-row items-center justify-between px-6 md:px-12 py-8' 
                                        : 'flex-col items-stretch justify-start px-4 py-8'
                                    }`}
                                    style={{ 
                                      backgroundImage: `url(${el.src || 'https://images.unsplash.com/photo-1516216621174-bfa2196cfc02?auto=format&fit=crop&w=1200&q=80'})`,
                                      borderRadius: '0px',
                                      marginTop: formatStyleVal(el.styles.marginTop) || '0px',
                                      marginBottom: formatStyleVal(el.styles.marginBottom) || '0px',
                                      width: formatStyleVal(el.styles.width) || '100%',
                                      height: formatStyleVal(el.styles.height) || undefined,
                                      minHeight: el.styles.height ? undefined : '160px',
                                    }}
                                  >
                                    <div 
                                      className="absolute inset-0 transition-opacity pointer-events-none"
                                      style={{
                                        backgroundColor: el.overlayBgColor || 'transparent',
                                        opacity: el.overlayBgOpacity !== undefined ? el.overlayBgOpacity / 100 : 0
                                      }}
                                    />
                                    <div className={`relative z-10 w-full flex ${
                                      viewportMode === 'desktop' 
                                        ? 'flex-col md:flex-row md:items-center justify-between gap-6' 
                                        : 'flex-col items-center gap-4 text-center'
                                    }`}>
                                      <div className={`flex-1 ${viewportMode === 'desktop' ? 'text-left' : 'text-center'}`}>
                                        <EditableText
                                          tagName="h3"
                                          content={el.overlayTitle || 'Tilmeld dig vores nyhedsbrev og modtag tilbud'}
                                          className="text-xl md:text-2xl font-extrabold text-white tracking-wide leading-tight outline-hidden"
                                          style={{
                                            fontFamily: el.styles.fontFamily,
                                            fontSize: formatStyleVal(el.styles.fontSize) || undefined,
                                            fontWeight: el.styles.fontWeight || undefined,
                                            fontStyle: el.styles.fontStyle || undefined,
                                            color: el.styles.color || undefined
                                          }}
                                          isPreviewMode={isPreviewMode}
                                          onBlur={(newText) => {
                                            onUpdateElement(el.id, {}, undefined, undefined, undefined, { overlayTitle: newText });
                                          }}
                                          onClick={(e) => {
                                            if (!isPreviewMode) onSelectElement(el.id);
                                            e.stopPropagation();
                                          }}
                                        />
                                        <EditableText
                                          tagName="p"
                                          content={el.overlaySubtext || 'Få ugentlige sikkerhedstips og eksklusive rabatter direkte i din indbakke.'}
                                          className="text-slate-400 text-xs md:text-sm mt-1 font-medium outline-hidden"
                                          style={{
                                            fontFamily: el.styles.fontFamily,
                                            fontStyle: el.styles.fontStyle || undefined
                                          }}
                                          isPreviewMode={isPreviewMode}
                                          onBlur={(newText) => {
                                            onUpdateElement(el.id, {}, undefined, undefined, undefined, { overlaySubtext: newText });
                                          }}
                                          onClick={(e) => {
                                            if (!isPreviewMode) onSelectElement(el.id);
                                            e.stopPropagation();
                                          }}
                                        />
                                      </div>
                                      <div className={`w-full shrink-0 flex items-center ${viewportMode === 'desktop' ? 'md:w-auto' : 'justify-center'}`}>
                                        <form 
                                          onSubmit={(e) => handleFormSubmit(el, e)}
                                          className={`w-full border border-white/20 hover:border-white/30 backdrop-blur-md bg-white/10 transition-all pointer-events-auto ${
                                            viewportMode === 'desktop' 
                                              ? 'md:w-[480px] flex rounded-full p-1' 
                                              : (viewportMode === 'mobile' ? 'flex flex-col rounded-2xl p-2 gap-2 max-w-sm' : 'flex rounded-full p-1 max-w-md')
                                          }`}
                                        >
                                          <input 
                                            type="email" 
                                            name="email"
                                            placeholder="Indtast din e-mail adresse..."
                                            className={`bg-transparent px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none w-full ${
                                              viewportMode === 'mobile' ? 'text-center bg-white/5 rounded-xl' : 'flex-1'
                                            }`}
                                            disabled={!isPreviewMode}
                                            onClick={(e) => e.stopPropagation()}
                                            required
                                          />
                                          <button 
                                            type="submit"
                                            className={`bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm px-6 py-2.5 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] ${
                                              viewportMode === 'mobile' ? 'rounded-xl w-full' : 'rounded-full'
                                            }`}
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            Tilmeld dig
                                          </button>
                                        </form>
                                      </div>
                                    </div>
                                    {!isPreviewMode && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onChangeImageClick(el.id);
                                        }}
                                        className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-1 bg-slate-900/80 text-white rounded text-[9px] font-bold shadow-md hover:bg-indigo-600 transition-all cursor-pointer border-none"
                                      >
                                        <ImageIcon className="w-3 h-3" />
                                        <span>BG</span>
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <div 
                                    className="relative w-full overflow-hidden flex transition-all bg-cover bg-center"
                                    style={{ 
                                      backgroundImage: `url(${el.src || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'})`,
                                      borderRadius: formatStyleVal(el.styles.borderRadius) || '12px',
                                      borderWidth: formatStyleVal(el.styles.borderWidth) || '0px',
                                      borderColor: el.styles.borderColor || 'transparent',
                                      marginTop: formatStyleVal(el.styles.marginTop) || '0px',
                                      marginBottom: formatStyleVal(el.styles.marginBottom) || '0px',
                                      width: formatStyleVal(el.styles.width) || '100%',
                                      height: formatStyleVal(el.styles.height) || undefined,
                                      minHeight: el.styles.height ? undefined : '350px',
                                    }}
                                  >
                                    {/* Hover trigger inside editor to change background image */}
                                    {!isPreviewMode && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onChangeImageClick(el.id);
                                        }}
                                        className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1.5 bg-slate-900/85 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-bold shadow-md transition-all backdrop-blur-xs cursor-pointer border-none"
                                      >
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        <span>Change Background</span>
                                      </button>
                                    )}

                                    {/* Top Navigation Header Overlay */}
                                    {(() => {
                                      const logoOverlayRaw = el.overlays?.find(o => o.type === 'logo');
                                      const menuOverlayRaw = el.overlays?.find(o => o.type === 'dropdown-menu');
                                      const logoOverlay = logoOverlayRaw ? {
                                        ...logoOverlayRaw,
                                        styles: getResolvedStyles(logoOverlayRaw)
                                      } : undefined;
                                      const menuOverlay = menuOverlayRaw ? {
                                        ...menuOverlayRaw,
                                        styles: getResolvedStyles(menuOverlayRaw)
                                      } : undefined;
                                      if (!logoOverlay && !menuOverlay) return null;

                                      const isLogoHiddenInViewport = logoOverlay && (
                                        (viewportMode === 'mobile' && logoOverlay.visibleOnMobile === false) ||
                                        (viewportMode === 'tablet' && logoOverlay.visibleOnTablet === false) ||
                                        (viewportMode === 'desktop' && logoOverlay.visibleOnDesktop === false)
                                      );

                                      const isMenuHiddenInViewport = menuOverlay && (
                                        (viewportMode === 'mobile' && menuOverlay.visibleOnMobile === false) ||
                                        (viewportMode === 'tablet' && menuOverlay.visibleOnTablet === false) ||
                                        (viewportMode === 'desktop' && menuOverlay.visibleOnDesktop === false)
                                      );

                                      const isMobileViewport = viewportMode === 'mobile' || (viewportMode === 'desktop' && typeof window !== 'undefined' && window.innerWidth < 768);
                                       const isTabletViewport = viewportMode === 'tablet' || (viewportMode === 'desktop' && typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024);
                                       
                                       const dBgColor = isMobileViewport
                                         ? (menuOverlay?.settings?.drawerBgColorMobile || menuOverlay?.settings?.drawerBgColor || '#0f172a')
                                         : isTabletViewport
                                           ? (menuOverlay?.settings?.drawerBgColorTablet || menuOverlay?.settings?.drawerBgColor || '#0f172a')
                                           : (menuOverlay?.settings?.drawerBgColor || '#0f172a');
                                           
                                       const dTextColor = isMobileViewport
                                         ? (menuOverlay?.settings?.drawerTextColorMobile || menuOverlay?.settings?.drawerTextColor || '#ffffff')
                                         : isTabletViewport
                                           ? (menuOverlay?.settings?.drawerTextColorTablet || menuOverlay?.settings?.drawerTextColor || '#ffffff')
                                           : (menuOverlay?.settings?.drawerTextColor || '#ffffff');
                                           
                                       const dFontSize = isMobileViewport
                                         ? (menuOverlay?.settings?.drawerFontSizeMobile || menuOverlay?.settings?.drawerFontSize || 14)
                                         : isTabletViewport
                                           ? (menuOverlay?.settings?.drawerFontSizeTablet || menuOverlay?.settings?.drawerFontSize || 14)
                                           : (menuOverlay?.settings?.drawerFontSize || 14);

                                       const dFontWeight = isMobileViewport
                                         ? (menuOverlay?.settings?.drawerFontWeightMobile || menuOverlay?.settings?.drawerFontWeight || 'bold')
                                         : isTabletViewport
                                           ? (menuOverlay?.settings?.drawerFontWeightTablet || menuOverlay?.settings?.drawerFontWeight || 'bold')
                                           : (menuOverlay?.settings?.drawerFontWeight || 'bold');

                                       const dFontStyle = isMobileViewport
                                         ? (menuOverlay?.settings?.drawerFontStyleMobile || menuOverlay?.settings?.drawerFontStyle || 'normal')
                                         : isTabletViewport
                                           ? (menuOverlay?.settings?.drawerFontStyleTablet || menuOverlay?.settings?.drawerFontStyle || 'normal')
                                           : (menuOverlay?.settings?.drawerFontStyle || 'normal');

                                       const dLinkFontSize = isMobileViewport
                                         ? (menuOverlay?.settings?.drawerLinkFontSizeMobile || menuOverlay?.settings?.drawerLinkFontSize || 12)
                                         : isTabletViewport
                                           ? (menuOverlay?.settings?.drawerLinkFontSizeTablet || menuOverlay?.settings?.drawerLinkFontSize || 12)
                                           : (menuOverlay?.settings?.drawerLinkFontSize || 12);

                                       const dLinkFontWeight = isMobileViewport
                                         ? (menuOverlay?.settings?.drawerLinkFontWeightMobile || menuOverlay?.settings?.drawerLinkFontWeight || 'normal')
                                         : isTabletViewport
                                           ? (menuOverlay?.settings?.drawerLinkFontWeightTablet || menuOverlay?.settings?.drawerLinkFontWeight || 'normal')
                                           : (menuOverlay?.settings?.drawerLinkFontWeight || 'normal');

                                       const dLinkFontStyle = isMobileViewport
                                         ? (menuOverlay?.settings?.drawerLinkFontStyleMobile || menuOverlay?.settings?.drawerLinkFontStyle || 'normal')
                                         : isTabletViewport
                                           ? (menuOverlay?.settings?.drawerLinkFontStyleTablet || menuOverlay?.settings?.drawerLinkFontStyle || 'normal')
                                           : (menuOverlay?.settings?.drawerLinkFontStyle || 'normal');

                                       const dGroupFontSize = isMobileViewport
                                         ? (menuOverlay?.settings?.drawerGroupFontSizeMobile || menuOverlay?.settings?.drawerGroupFontSize || 10)
                                         : isTabletViewport
                                           ? (menuOverlay?.settings?.drawerGroupFontSizeTablet || menuOverlay?.settings?.drawerGroupFontSize || 10)
                                           : (menuOverlay?.settings?.drawerGroupFontSize || 10);

                                       const dGroupFontWeight = isMobileViewport
                                         ? (menuOverlay?.settings?.drawerGroupFontWeightMobile || menuOverlay?.settings?.drawerGroupFontWeight || 'bold')
                                         : isTabletViewport
                                           ? (menuOverlay?.settings?.drawerGroupFontWeightTablet || menuOverlay?.settings?.drawerGroupFontWeight || 'bold')
                                           : (menuOverlay?.settings?.drawerGroupFontWeight || 'bold');

                                       const dGroupFontStyle = isMobileViewport
                                         ? (menuOverlay?.settings?.drawerGroupFontStyleMobile || menuOverlay?.settings?.drawerGroupFontStyle || 'normal')
                                         : isTabletViewport
                                           ? (menuOverlay?.settings?.drawerGroupFontStyleTablet || menuOverlay?.settings?.drawerGroupFontStyle || 'normal')
                                           : (menuOverlay?.settings?.drawerGroupFontStyle || 'normal');
                                       
                                       const logoVisibilityClasses = logoOverlay ? [
                                        logoOverlay.visibleOnDesktop === false ? 'hide-on-desktop' : '',
                                        logoOverlay.visibleOnTablet === false ? 'hide-on-tablet' : '',
                                        logoOverlay.visibleOnMobile === false ? 'hide-on-mobile' : ''
                                      ].filter(Boolean).join(' ') : '';

                                      const menuVisibilityClasses = menuOverlay ? [
                                        menuOverlay.visibleOnDesktop === false ? 'hide-on-desktop' : '',
                                        menuOverlay.visibleOnTablet === false ? 'hide-on-tablet' : '',
                                        menuOverlay.visibleOnMobile === false ? 'hide-on-mobile' : ''
                                      ].filter(Boolean).join(' ') : '';

                                      // If both are hidden in preview mode, don't render header bar
                                      if (isPreviewMode && 
                                          (!logoOverlay || isLogoHiddenInViewport) && 
                                          (!menuOverlay || isMenuHiddenInViewport)) {
                                        return null;
                                      }

                                      return (
                                        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30 pointer-events-auto bg-transparent">
                                          {/* Logo Column */}
                                          {logoOverlay && (!isPreviewMode || !isLogoHiddenInViewport) ? (
                                            <div 
                                              key={logoOverlay.id}
                                              className={`flex items-center gap-3 select-none cursor-pointer text-left ${logoVisibilityClasses}`}
                                              style={{
                                                marginTop: formatStyleVal(logoOverlay.styles.marginTop) || undefined,
                                                marginBottom: formatStyleVal(logoOverlay.styles.marginBottom) || undefined,
                                                marginLeft: formatStyleVal(logoOverlay.styles.marginLeft) || undefined,
                                                marginRight: formatStyleVal(logoOverlay.styles.marginRight) || undefined,
                                                opacity: (!isPreviewMode && isLogoHiddenInViewport) ? 0.35 : undefined
                                              }}
                                              onClick={(e) => {
                                                if (!isPreviewMode) {
                                                  e.stopPropagation();
                                                  onSelectElement(el.id);
                                                } else if (logoOverlay.link) {
                                                  if (logoOverlay.link.startsWith('#')) {
                                                    handleLinkClick(e as any, logoOverlay.link);
                                                  } else {
                                                    window.location.href = logoOverlay.link;
                                                  }
                                                }
                                              }}
                                            >
                                               {logoOverlay.src ? (
                                                 <img 
                                                   src={logoOverlay.src} 
                                                   alt={logoOverlay.content || 'Logo'} 
                                                   style={{
                                                     height: formatStyleVal(logoOverlay.styles.fontSize) || '40px',
                                                     width: formatStyleVal(logoOverlay.styles.width) || 'auto',
                                                     borderRadius: formatStyleVal(logoOverlay.styles.borderRadius) || '0px'
                                                   }}
                                                   className="max-h-full object-contain pointer-events-auto"
                                                 />
                                               ) : logoOverlay.content.toUpperCase().includes('MM') && logoOverlay.content.toUpperCase().includes('LÅSESMED') ? (() => {
                                                  const fontSizeVal = parseInt(logoOverlay.styles.fontSize || '18') || 18;
                                                  const ratio = fontSizeVal / 18;
                                                  return (
                                                    <div className="flex items-center gap-2.5">
                                                      <div 
                                                        className="rounded-full border-2 flex items-center justify-center bg-black/30 shrink-0"
                                                        style={{ 
                                                          borderColor: logoOverlay.styles.color || '#f59e0b',
                                                          width: `${40 * ratio}px`,
                                                          height: `${40 * ratio}px`
                                                        }}
                                                      >
                                                        <span className="text-white font-extrabold tracking-tighter" style={{ fontSize: `${13 * ratio}px` }}>MM</span>
                                                      </div>
                                                      <div className="flex flex-col text-left">
                                                        <span 
                                                          className="leading-none uppercase"
                                                          style={{
                                                            color: logoOverlay.styles.color || '#ffffff',
                                                            fontSize: `${fontSizeVal}px`,
                                                            fontWeight: logoOverlay.styles.fontWeight || '800'
                                                          }}
                                                        >LÅSESMED</span>
                                                        <span 
                                                          className="text-amber-400 tracking-wide font-medium leading-normal"
                                                          style={{ fontSize: `${9 * ratio}px`, marginTop: `${2 * ratio}px` }}
                                                        >Døgnvagt i Storkøbenhavn</span>
                                                      </div>
                                                    </div>
                                                  );
                                                })() : (
                                                <EditableText
                                                  tagName="span"
                                                  content={logoOverlay.content}
                                                  style={{
                                                    color: logoOverlay.styles.color || '#ffffff',
                                                    fontSize: formatStyleVal(logoOverlay.styles.fontSize) || '20px',
                                                    fontWeight: logoOverlay.styles.fontWeight || '800',
                                                    display: 'inline-block'
                                                  }}
                                                  isPreviewMode={isPreviewMode}
                                                  onBlur={(newText) => {
                                                    const updatedOverlays = (el.overlays || []).map(o => o.id === logoOverlay.id ? { ...o, content: newText } : o);
                                                    onUpdateElement(el.id, {}, undefined, undefined, undefined, { overlays: updatedOverlays });
                                                  }}
                                                  onClick={(e) => {
                                                    if (!isPreviewMode) {
                                                      onSelectElement(el.id);
                                                    }
                                                    e.stopPropagation();
                                                  }}
                                                />
                                              )}
                                            </div>
                                          ) : <div />}

                                          {/* Dropdown Menu Column */}
                                          {menuOverlay && (!isPreviewMode || !isMenuHiddenInViewport) && (
                                            <div className="flex flex-col items-end">
                                              {/* Desktop Horizontal Menu */}
                                              <div 
                                                key={menuOverlay.id}
                                                className={`items-center gap-6 ${menuVisibilityClasses} ${
                                                  viewportMode !== 'desktop' ? 'hidden' : 'hidden md:flex'
                                                }`}
                                                onClick={(e) => {
                                                  if (!isPreviewMode) {
                                                    e.stopPropagation();
                                                    onSelectElement(el.id);
                                                  }
                                                }}
                                                style={{
                                                  marginBottom: formatStyleVal(menuOverlay.styles.marginBottom) || undefined,
                                                  marginTop: formatStyleVal(menuOverlay.styles.marginTop) || undefined,
                                                  marginLeft: formatStyleVal(menuOverlay.styles.marginLeft) || undefined,
                                                  marginRight: formatStyleVal(menuOverlay.styles.marginRight) || undefined,
                                                  opacity: (!isPreviewMode && isMenuHiddenInViewport) ? 0.35 : undefined
                                                }}
                                              >
                                                {(menuOverlay.settings?.menuContentDesktop || menuOverlay.content).split(',').map((itemStr, index) => {
                                                  const item = itemStr.trim();
                                                  const hasDropdown = ['Erhverv', 'Privat', 'Boligforeninger'].includes(item);
                                                  
                                                  return (
                                                    <div key={index} className="relative group/menu flex items-center h-full py-2">
                                                      {hasDropdown ? (
                                                        <button 
                                                          className="flex items-center gap-1.5 text-slate-100 hover:text-amber-400 transition-colors uppercase tracking-wider cursor-pointer border-none bg-transparent"
                                                          style={{
                                                            fontSize: formatStyleVal(menuOverlay.styles.fontSize) || '11px',
                                                            fontWeight: menuOverlay.styles.fontWeight || 'bold',
                                                            fontStyle: menuOverlay.styles.fontStyle || 'normal',
                                                          }}
                                                        >
                                                          {item} <span className="text-[9px] text-slate-400 group-hover/menu:text-amber-400 transition-colors">▼</span>
                                                        </button>
                                                      ) : (
                                                        <a 
                                                          href="#" 
                                                          className="text-slate-100 hover:text-amber-400 font-bold transition-colors uppercase tracking-wider decoration-none"
                                                          style={{
                                                            fontSize: formatStyleVal(menuOverlay.styles.fontSize) || '11px',
                                                          }}
                                                        >
                                                          {item}
                                                        </a>
                                                      )}

                                                      {/* Mega Menu Dropdown */}
                                                      {hasDropdown && (
                                                        <div className="absolute right-0 top-full mt-1.5 w-[700px] bg-white/98 backdrop-blur-md border border-slate-100 rounded-2xl shadow-2xl p-6 opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-all duration-200 z-50 flex gap-6 text-left">
                                                          {(() => {
                                                            const allLinks = menuOverlay.dropdownLinks || getDefaultDropdownLinks();
                                                            const filteredLinks = allLinks.filter(l => l.parentItem.toLowerCase() === item.toLowerCase());
                                                            
                                                            const groups: { [key: string]: DropdownLink[] } = {};
                                                            filteredLinks.forEach(link => {
                                                              const g = link.group || 'General';
                                                              if (!groups[g]) groups[g] = [];
                                                              groups[g].push(link);
                                                            });
                                                            
                                                            const groupNames = Object.keys(groups);
                                                            if (groupNames.length === 0) {
                                                              return (
                                                                <div className="flex-1 py-4 text-center text-slate-400 text-xs font-semibold">
                                                                  No pages added yet. Use sidebar settings to add sub-pages.
                                                                </div>
                                                              );
                                                            }
                                                            
                                                            return groupNames.map((gName, gIdx) => (
                                                              <div key={gIdx} className="flex-1 space-y-3.5">
                                                                <h5 className="font-extrabold text-indigo-600 uppercase tracking-widest" style={{ fontSize: safeFontSize(menuOverlay.settings?.dropdownGroupFontSize, '10px') }}>{gName}</h5>
                                                                <div className="space-y-3">
                                                                  {groups[gName].map((link, lIdx) => (
                                                                    <div key={link.id || lIdx}>
                                                                      <a 
                                                                        href={link.link || '#'} 
                                                                        onClick={(e) => handleLinkClick(e, link.link, link.pageSlug)}
                                                                        className="font-bold text-slate-800 hover:text-indigo-600 transition-colors block no-underline"
                                                                        style={{ fontFamily: menuOverlay.styles?.fontFamily, fontSize: safeFontSize(menuOverlay.settings?.dropdownFontSize, '12px') }}
                                                                      >
                                                                        {link.title}
                                                                      </a>
                                                                      {link.description && (
                                                                        <span className="text-slate-400 block mt-0.5" style={{ fontSize: safeFontSize(menuOverlay.settings?.dropdownDescFontSize, '10px') }}>{link.description}</span>
                                                                      )}
                                                                    </div>
                                                                  ))}
                                                                </div>
                                                              </div>
                                                            ));
                                                          })()}

                                                          {/* Yellow Highlight Contact Box (Mockup right col) */}
                                                          {(() => {
                                                            const contactTitle = menuOverlay.settings?.contactTitle || "Kontakt";
                                                            const contactText = menuOverlay.settings?.contactText || "Kulvej 10, 2 TV\n2450 København SV\nDenmark";
                                                            const contactEmail = menuOverlay.settings?.contactEmail || "info@mmlaasesmed.dk";
                                                            const contactPhone = menuOverlay.settings?.contactPhone || "+45 31 11 11 15";
                                                            
                                                            return (
                                                              <div className="w-[220px] bg-amber-400 text-slate-900 rounded-xl p-4 flex flex-col justify-between shrink-0 shadow-inner">
                                                                <div>
                                                                  <h6 
                                                                    className="font-extrabold uppercase tracking-wide border-b border-slate-900/15 pb-1.5 mb-2"
                                                                    style={{ fontSize: safeFontSize(menuOverlay.settings?.contactTitleFontSize, '14px') }}
                                                                  >
                                                                    {contactTitle}
                                                                  </h6>
                                                                  <p className="leading-relaxed font-semibold" style={{ fontSize: safeFontSize(menuOverlay.settings?.contactTextFontSize, '10px') }}>
                                                                    {contactText.split('\n').map((line, i) => (
                                                                      <React.Fragment key={i}>
                                                                        {line}
                                                                        <br />
                                                                      </React.Fragment>
                                                                    ))}
                                                                  </p>
                                                                  {contactEmail && (
                                                                    <p className="font-semibold mt-2 hover:underline" style={{ fontSize: safeFontSize(menuOverlay.settings?.contactTextFontSize, '10px') }}>
                                                                      {contactEmail}
                                                                    </p>
                                                                  )}
                                                                </div>
                                                                <a 
                                                                  href={`tel:${contactPhone.replace(/\s+/g, '')}`} 
                                                                  className="block text-center bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2 px-3 rounded-lg mt-4 transition-colors uppercase tracking-wider no-underline"
                                                                  style={{ fontSize: safeFontSize(menuOverlay.settings?.contactBtnFontSize, '10px') }}
                                                                >
                                                                  📞 {contactPhone}
                                                                </a>
                                                              </div>
                                                            );
                                                          })()}
                                                        </div>
                                                      )}
                                                    </div>
                                                  );
                                                })}
                                              </div>

                                              {/* Mobile Hamburger Button */}
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setIsMobileMenuOpen(!isMobileMenuOpen);
                                                }}
                                                className={`p-2 rounded-lg text-white hover:bg-white/10 transition-colors border-none bg-transparent cursor-pointer z-50 ${menuVisibilityClasses} ${
                                                  viewportMode === 'desktop' ? 'md:hidden' : 'hidden'
                                                }`}
                                                style={{
                                                  opacity: (!isPreviewMode && isMenuHiddenInViewport) ? 0.35 : undefined
                                                }}
                                              >
                                                {isMobileMenuOpen ? (
                                                  <X className="w-6 h-6" />
                                                ) : (
                                                  <Menu className="w-6 h-6" />
                                                )}
                                              </button>

                                              {/* Mobile Drawer Overlay */}
                                              {isMobileMenuOpen && (
                                                 <div 
                                                   className={`absolute left-0 right-0 top-full mx-6 mt-2 border border-slate-100/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-left z-50 ${menuVisibilityClasses} ${
                                                     viewportMode === 'desktop' ? 'md:hidden' : 'hidden'
                                                   }`}
                                                   style={{
                                                     backgroundColor: dBgColor,
                                                     color: dTextColor,
                                                     opacity: (!isPreviewMode && isMenuHiddenInViewport) ? 0.35 : undefined
                                                   }}
                                                 >
                                                   {(menuOverlay.settings?.menuContentMobile || menuOverlay.settings?.menuContentTablet || menuOverlay.settings?.menuContentDesktop || menuOverlay.content).split(',').map((itemStr, index) => {
                                                     const item = itemStr.trim();
                                                     const hasDropdown = ['Erhverv', 'Privat', 'Boligforeninger'].includes(item);
                                                     return (
                                                       <div key={index} className="border-b border-slate-100/10 pb-2 last:border-none last:pb-0">
                                                         <div 
                                                           className="uppercase tracking-wider py-1"
                                                           style={{
                                                             fontSize: safeFontSize(dFontSize, '14px'),
                                                             fontWeight: dFontWeight,
                                                             fontStyle: dFontStyle,
                                                             color: dTextColor
                                                           }}
                                                         >
                                                           {item}
                                                         </div>
                                                         {hasDropdown && (
                                                           <div className="pl-4 mt-2 space-y-2">
                                                             {(() => {
                                                               const allLinks = menuOverlay.dropdownLinks || getDefaultDropdownLinks();
                                                               const filteredLinks = allLinks.filter(l => l.parentItem.toLowerCase() === item.toLowerCase());
                                                               
                                                               const groups: { [key: string]: DropdownLink[] } = {};
                                                               filteredLinks.forEach(link => {
                                                                 const g = link.group || 'General';
                                                                 if (!groups[g]) groups[g] = [];
                                                                 groups[g].push(link);
                                                               });
                                                               
                                                               const groupNames = Object.keys(groups);
                                                               if (groupNames.length === 0) {
                                                                 return (
                                                                   <div className="text-slate-400 text-xs py-0.5 italic">
                                                                     No sub-pages added yet.
                                                                   </div>
                                                                 );
                                                               }
                                                               
                                                               return groupNames.map((gName, gIdx) => (
                                                                 <div key={gIdx} className={gIdx > 0 ? 'mt-2' : ''}>
                                                                   <div 
                                                                     className="uppercase tracking-wider flex items-center gap-1 mb-1"
                                                                     style={{
                                                                       fontSize: safeFontSize(dGroupFontSize, '10px'),
                                                                       fontWeight: dGroupFontWeight,
                                                                       fontStyle: dGroupFontStyle,
                                                                       color: dTextColor
                                                                     }}
                                                                   >
                                                                     <span className="w-1.5 h-1.5 rounded-full bg-[#FFC502]" /> {gName}
                                                                   </div>
                                                                   <div className="pl-2.5 space-y-1">
                                                                     {groups[gName].map((link, lIdx) => (
                                                                       <a 
                                                                         key={link.id || lIdx}
                                                                         href={link.link || '#'} 
                                                                         onClick={(e) => {
                                                                           handleLinkClick(e, link.link, link.pageSlug);
                                                                           setIsMobileMenuOpen(false);
                                                                         }} 
                                                                         className="block hover:text-white no-underline"
                                                                         style={{
                                                                           fontSize: safeFontSize(dLinkFontSize, '12px'),
                                                                           fontWeight: dLinkFontWeight,
                                                                           fontStyle: dLinkFontStyle,
                                                                           color: isMobileViewport
                                                                             ? (menuOverlay.settings?.drawerLinkColorMobile || '#94a3b8')
                                                                             : isTabletViewport
                                                                               ? (menuOverlay.settings?.drawerLinkColorTablet || '#94a3b8')
                                                                               : (menuOverlay.settings?.drawerLinkColor || '#94a3b8')
                                                                         }}
                                                                       >
                                                                         {link.title}
                                                                       </a>
                                                                     ))}
                                                                   </div>
                                                                 </div>
                                                               ));
                                                             })()}
                                                           </div>
                                                         )}
                                                       </div>
                                                     );
                                                   })}
                                                   {/* Mobile Contact Box */}
                                                   {(() => {
                                                     const contactTitle = menuOverlay.settings?.contactTitle || "Kontakt";
                                                     const contactText = menuOverlay.settings?.contactText || "Kulvej 10, 2 TV\\n2450 København SV\\nDenmark";
                                                     const contactEmail = menuOverlay.settings?.contactEmail || "info@mmlaasesmed.dk";
                                                     const contactPhone = menuOverlay.settings?.contactPhone || "+45 31 11 11 15";
                                                     
                                                     return (
                                                       <div className="bg-amber-400 text-slate-900 rounded-xl p-4 mt-2 flex flex-col gap-2">
                                                         <div 
                                                           className="font-extrabold uppercase tracking-wide"
                                                           style={{ fontSize: safeFontSize(menuOverlay.settings?.contactTitleFontSize, '12px') }}
                                                         >
                                                           {contactTitle}
                                                         </div>
                                                         <div 
                                                           className="leading-relaxed font-semibold"
                                                           style={{ fontSize: safeFontSize(menuOverlay.settings?.contactTextFontSize, '10px') }}
                                                         >
                                                           {contactText.split('\\n').map((line, i) => (
                                                             <React.Fragment key={i}>
                                                               {line}
                                                               <br />
                                                             </React.Fragment>
                                                           ))}
                                                           {contactEmail && (
                                                             <div className="mt-1 hover:underline">{contactEmail}</div>
                                                           )}
                                                         </div>
                                                         <a 
                                                           href={`tel:${contactPhone.replace(/\\s+/g, '')}`} 
                                                           className="block text-center bg-slate-900 text-white font-extrabold py-2 px-3 rounded-lg transition-colors uppercase tracking-wider no-underline"
                                                           style={{ fontSize: safeFontSize(menuOverlay.settings?.contactBtnFontSize, '10px') }}
                                                         >
                                                           📞 {contactPhone}
                                                         </a>
                                                       </div>
                                                     );
                                                   })()}
                                                 </div>
                                               )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })()}

                                    {/* Background overlay tint for readability */}
                                    {((el.overlayTitle || el.overlaySubtext || el.showButton || el.showSearchBox) || (el.overlays && el.overlays.length > 0) || !isPreviewMode) && (
                                      <div 
                                        className="absolute inset-0 transition-opacity pointer-events-none"
                                        style={{
                                          backgroundColor: el.overlayBgColor || '#000000',
                                          opacity: (el.overlayBgOpacity !== undefined ? el.overlayBgOpacity : 35) / 100,
                                        }}
                                      />
                                    )}

                                    {/* Position Wrapper mapping to overlayPosition */}
                                    <div 
                                      className={`absolute inset-0 p-6 md:p-10 flex ${
                                        viewportMode === 'desktop' ? (
                                          el.overlayPosition === 'top-left' ? 'items-start justify-start' :
                                          el.overlayPosition === 'top-center' ? 'items-start justify-center' :
                                          el.overlayPosition === 'top-right' ? 'items-start justify-end' :
                                          el.overlayPosition === 'center-left' ? 'items-center justify-start' :
                                          el.overlayPosition === 'center-right' ? 'items-center justify-end' :
                                          el.overlayPosition === 'bottom-left' ? 'items-end justify-start' :
                                          el.overlayPosition === 'bottom-center' ? 'items-end justify-center' :
                                          el.overlayPosition === 'bottom-right' ? 'items-end justify-end' :
                                          'items-center justify-center' // center
                                        ) : 'items-center justify-center'
                                      }`}
                                    >
                                      {/* Glassmorphic/Solid styled card container over the image */}
                                      <div 
                                        className={el.id === 'locksmith-hero-banner' 
                                          ? "max-w-3xl w-full flex flex-col items-center justify-center gap-6 text-center transition-all" 
                                          : `max-w-md w-full p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md flex flex-col gap-3 transition-all ${
                                              viewportMode === 'desktop' ? 'text-center md:text-left' : 'text-center'
                                            }`
                                        }
                                        style={el.id === 'locksmith-hero-banner' ? { color: '#ffffff' } : {
                                          backgroundColor: `${el.overlayBgColor || '#000000'}${Math.round(((el.overlayBgOpacity ?? 50) / 100) * 255).toString(16).padStart(2, '0')}`,
                                          color: '#ffffff'
                                        }}
                                      >
                                        {el.overlays && el.overlays.length > 0 ? (
                                          el.overlays.map((rawItem) => {
                                            const item = { ...rawItem, styles: getResolvedStyles(rawItem) };
                                            if (item.type === 'logo' || item.type === 'dropdown-menu') {
                                              return null;
                                            }

                                            const isOverlayItemHiddenInViewport = 
                                              (viewportMode === 'mobile' && item.visibleOnMobile === false) ||
                                              (viewportMode === 'tablet' && item.visibleOnTablet === false) ||
                                              (viewportMode === 'desktop' && item.visibleOnDesktop === false);

                                            if (isPreviewMode && isOverlayItemHiddenInViewport) {
                                              return null;
                                            }

                                            const overlayItemVisibilityClasses = [
                                              item.visibleOnDesktop === false ? 'hide-on-desktop' : '',
                                              item.visibleOnTablet === false ? 'hide-on-tablet' : '',
                                              item.visibleOnMobile === false ? 'hide-on-mobile' : ''
                                            ].filter(Boolean).join(' ');

                                            if (item.type === 'text') {
                                              const textItem = (
                                                <EditableText
                                                  content={item.content}
                                                  className="outline-hidden max-w-lg cursor-text focus:ring-1 focus:ring-indigo-500/30 p-1"
                                                  style={{
                                                    color: item.styles.color || '#ffffff',
                                                    fontSize: formatStyleVal(item.styles.fontSize) || '16px',
                                                    fontWeight: item.styles.fontWeight || '500',
                                                    textAlign: viewportMode === 'desktop' ? (item.styles.textAlign || 'center') : 'center',
                                                    marginTop: formatStyleVal(item.styles.marginTop) || '0px',
                                                    marginBottom: formatStyleVal(item.styles.marginBottom) || '8px',
                                                    lineHeight: item.styles.lineHeight || '1.4',
                                                    letterSpacing: formatStyleVal(item.styles.letterSpacing) || '0px',
                                                  }}
                                                  isPreviewMode={isPreviewMode}
                                                  isHTML={true}
                                                  onBlur={(newHTML) => {
                                                    const updatedOverlays = (el.overlays || []).map(o => o.id === item.id ? { ...o, content: newHTML } : o);
                                                    onUpdateElement(el.id, {}, undefined, undefined, undefined, { overlays: updatedOverlays });
                                                  }}
                                                  onClick={(e) => {
                                                    if (!isPreviewMode) {
                                                      onSelectElement(el.id);
                                                    }
                                                    e.stopPropagation();
                                                  }}
                                                />
                                              );

                                              if (isPreviewMode && item.link) {
                                                return (
                                                  <a 
                                                    key={item.id}
                                                    href={item.link}
                                                    onClick={(e) => {
                                                      if (item.link && item.link.startsWith('#')) {
                                                        handleLinkClick(e, item.link);
                                                      }
                                                    }}
                                                    className={`no-underline block hover:underline pointer-events-auto ${overlayItemVisibilityClasses}`}
                                                    style={{ color: 'inherit' }}
                                                  >
                                                    {textItem}
                                                  </a>
                                                );
                                              }
                                              return (
                                                <div key={item.id} className={overlayItemVisibilityClasses} style={{ opacity: (!isPreviewMode && isOverlayItemHiddenInViewport) ? 0.35 : undefined }}>
                                                  {textItem}
                                                </div>
                                              );
                                            }
                                            if (item.type === 'button') {
                                              const isDialerBtn = item.content.includes('31 11 11 15') || item.id === 'locksmith-hero-btn';
                                              if (isDialerBtn) {
                                                const lines = item.content.split('\n');
                                                const phoneNum = lines[0] || '31 11 11 15';
                                                const subtext = lines[1] || 'DØGNTELEFON';
                                                return (
                                                  <div 
                                                    key={item.id}
                                                    className={overlayItemVisibilityClasses}
                                                    style={{ 
                                                      marginTop: formatStyleVal(item.styles.marginTop) || '16px', 
                                                      marginBottom: formatStyleVal(item.styles.marginBottom) || '4px',
                                                      marginLeft: formatStyleVal(item.styles.marginLeft) || undefined,
                                                      marginRight: formatStyleVal(item.styles.marginRight) || undefined,
                                                      textAlign: viewportMode === 'desktop' ? (item.styles.textAlign || 'center') : 'center',
                                                      opacity: (!isPreviewMode && isOverlayItemHiddenInViewport) ? 0.35 : undefined,
                                                    }}
                                                  >
                                                    <a
                                                      href={item.link || 'tel:31111115'}
                                                      onClick={(e) => {
                                                        if (!isPreviewMode) {
                                                          e.preventDefault();
                                                          onSelectElement(el.id);
                                                        } else if (item.actionType === 'submit') {
                                                          e.preventDefault();
                                                          handleBackendSubmit(item as any, { clickedOverlayButtonId: item.id, content: item.content });
                                                        }
                                                        e.stopPropagation();
                                                      }}
                                                      className="group inline-flex flex-col items-center justify-center border-2 border-white rounded-full bg-transparent text-white hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 transition-all duration-300 pointer-events-auto shadow-lg select-none"
                                                      style={{
                                                        fontSize: formatStyleVal(item.styles.fontSize) || '16px',
                                                        paddingTop: formatStyleVal(item.styles.paddingTop) || '0.75em',
                                                        paddingBottom: formatStyleVal(item.styles.paddingBottom) || '0.75em',
                                                        paddingLeft: formatStyleVal(item.styles.paddingLeft) || '2.5em',
                                                        paddingRight: formatStyleVal(item.styles.paddingRight) || '2.5em',
                                                        width: formatStyleVal(item.styles.width) || undefined,
                                                        height: formatStyleVal(item.styles.height) || undefined,
                                                        borderRadius: formatStyleVal(item.styles.borderRadius) || '9999px',
                                                      }}
                                                    >
                                                      <span className="font-extrabold tracking-wider leading-none group-hover:text-slate-950 transition-colors" style={{ fontSize: '1.375em' }}>{phoneNum}</span>
                                                      <span className="font-extrabold tracking-widest text-amber-400 group-hover:text-slate-950 transition-colors leading-none mt-1.5" style={{ fontSize: '0.625em' }}>{subtext}</span>
                                                    </a>
                                                  </div>
                                                );
                                              }
                                              return (
                                                <div 
                                                  key={item.id}
                                                  className={overlayItemVisibilityClasses}
                                                  style={{ 
                                                    marginTop: formatStyleVal(item.styles.marginTop) || '4px', 
                                                    marginBottom: formatStyleVal(item.styles.marginBottom) || '4px',
                                                    marginLeft: formatStyleVal(item.styles.marginLeft) || undefined,
                                                    marginRight: formatStyleVal(item.styles.marginRight) || undefined,
                                                    textAlign: viewportMode === 'desktop' ? (item.styles.textAlign || 'center') : 'center',
                                                    opacity: (!isPreviewMode && isOverlayItemHiddenInViewport) ? 0.35 : undefined,
                                                  }}
                                                >
                                                  <a
                                                    href={item.link || '#'}
                                                    onClick={(e) => {
                                                      if (!isPreviewMode) {
                                                        e.preventDefault();
                                                        onSelectElement(el.id);
                                                      } else if (item.actionType === 'submit') {
                                                        e.preventDefault();
                                                        handleBackendSubmit(item as any, { clickedOverlayButtonId: item.id, content: item.content });
                                                      }
                                                      e.stopPropagation();
                                                    }}
                                                    className="inline-flex items-center justify-center whitespace-nowrap transition-transform active:scale-95 duration-100 font-semibold pointer-events-auto text-center"
                                                    style={{
                                                      backgroundColor: item.styles.backgroundColor || '#ffffff',
                                                      color: item.styles.color || '#0f172a',
                                                      paddingTop: formatStyleVal(item.styles.paddingTop) || '0.615em',
                                                      paddingBottom: formatStyleVal(item.styles.paddingBottom) || '0.615em',
                                                      paddingLeft: formatStyleVal(item.styles.paddingLeft) || '1.23em',
                                                      paddingRight: formatStyleVal(item.styles.paddingRight) || '1.23em',
                                                      borderRadius: formatStyleVal(item.styles.borderRadius) || '6px',
                                                      fontSize: formatStyleVal(item.styles.fontSize) || '13px',
                                                      fontWeight: item.styles.fontWeight || '600',
                                                      width: formatStyleVal(item.styles.width) || undefined,
                                                      height: formatStyleVal(item.styles.height) || undefined,
                                                    }}
                                                  >
                                                    {item.content}
                                                  </a>
                                                </div>
                                              );
                                            }
                                            if (item.type === 'search-box') {
                                              return (
                                                <form 
                                                  key={item.id}
                                                  onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleFormSubmit(item as any, e);
                                                  }}
                                                  className={`flex gap-2 w-full max-w-sm pointer-events-auto shrink-0 ${overlayItemVisibilityClasses}`} 
                                                  onClick={(e) => e.stopPropagation()}
                                                  style={{
                                                    marginTop: formatStyleVal(item.styles.marginTop) || '8px',
                                                    marginBottom: formatStyleVal(item.styles.marginBottom) || '8px',
                                                    width: formatStyleVal(item.styles.width) || undefined,
                                                    height: formatStyleVal(item.styles.height) || undefined,
                                                    opacity: (!isPreviewMode && isOverlayItemHiddenInViewport) ? 0.35 : undefined,
                                                  }}
                                                >
                                                  <input 
                                                    type="text" 
                                                    name="email"
                                                    required
                                                    placeholder={item.content || "Enter email..."}
                                                    className="flex-1 px-3 py-2 text-xs rounded bg-white/95 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-350 font-sans"
                                                    onClick={(e) => e.stopPropagation()}
                                                  />
                                                  <button 
                                                    type="submit"
                                                    className="hover:opacity-90 transition-colors shrink-0 border-none cursor-pointer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                      backgroundColor: item.styles.backgroundColor || '#4f46e5',
                                                      color: item.styles.color || '#ffffff',
                                                      fontSize: formatStyleVal(item.styles.fontSize) || '12px',
                                                      paddingTop: formatStyleVal(item.styles.paddingTop) || '0.66em',
                                                      paddingBottom: formatStyleVal(item.styles.paddingBottom) || '0.66em',
                                                      paddingLeft: formatStyleVal(item.styles.paddingLeft) || '1.33em',
                                                      paddingRight: formatStyleVal(item.styles.paddingRight) || '1.33em',
                                                      borderRadius: formatStyleVal(item.styles.borderRadius) || '4px',
                                                      fontWeight: item.styles.fontWeight || '700',
                                                    }}
                                                  >
                                                    {item.link || "Subscribe"}
                                                  </button>
                                                </form>
                                              );
                                            }
                                            return null;
                                          })
                                        ) : (
                                          <>
                                            {/* Overlay Title */}
                                            {el.overlayTitle && (
                                              <EditableText
                                                tagName="h4"
                                                content={el.overlayTitle}
                                                className="text-lg md:text-2xl font-extrabold tracking-tight text-white leading-tight cursor-text focus:outline-none"
                                                style={{ fontFamily: el.styles.fontFamily }}
                                                isPreviewMode={isPreviewMode}
                                                onBlur={(newText) => {
                                                  onUpdateElement(el.id, {}, undefined, undefined, undefined, { overlayTitle: newText });
                                                }}
                                              />
                                            )}

                                            {/* Subtext */}
                                            {el.overlaySubtext && (
                                              <EditableText
                                                tagName="p"
                                                content={el.overlaySubtext}
                                                className="text-xs md:text-sm text-slate-100 font-medium leading-relaxed opacity-90 cursor-text focus:outline-none"
                                                style={{ fontFamily: el.styles.fontFamily }}
                                                isPreviewMode={isPreviewMode}
                                                onBlur={(newText) => {
                                                  onUpdateElement(el.id, {}, undefined, undefined, undefined, { overlaySubtext: newText });
                                                }}
                                              />
                                            )}

                                            {/* Search Form Box (Newsletter Subscription form) */}
                                            {(el.showSearchBox ?? true) && (
                                              <form 
                                                onSubmit={(e) => {
                                                  e.preventDefault();
                                                  handleFormSubmit(el as any, e);
                                                }} 
                                                className="flex items-center gap-1.5 mt-1"
                                              >
                                                <input
                                                  type="email"
                                                  name="email"
                                                  required
                                                  onClick={(e) => e.stopPropagation()}
                                                  placeholder={el.overlaySearchPlaceholder || 'Enter email address...'}
                                                  className="flex-1 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all font-sans"
                                                  style={{ fontFamily: el.styles.fontFamily }}
                                                />
                                                <button
                                                  type="submit"
                                                  onClick={(e) => e.stopPropagation()}
                                                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap border-none"
                                                  style={{ fontFamily: el.styles.fontFamily }}
                                                >
                                                  {el.overlaySearchButtonText || 'Subscribe'}
                                                </button>
                                              </form>
                                            )}

                                            {/* Optional Action CTA Button */}
                                            {(el.showButton ?? false) && (
                                              <div className="mt-1">
                                                <a
                                                  href={el.overlayButtonLink || '#'}
                                                  onClick={(e) => {
                                                    if (!isPreviewMode) e.preventDefault();
                                                  }}
                                                  className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all text-center"
                                                  style={{ fontFamily: el.styles.fontFamily }}
                                                >
                                                  {el.overlayButtonText || 'Learn More'}
                                                </a>
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}

                              {el.type === 'divider' && (
                                <hr 
                                  className="border-t mx-auto" 
                                  style={{ 
                                    borderColor: el.styles.borderColor || '#cbd5e1',
                                    marginTop: formatStyleVal(el.styles.marginTop) || '16px',
                                    marginBottom: formatStyleVal(el.styles.marginBottom) || '16px',
                                    marginLeft: formatStyleVal(el.styles.marginLeft) || 'auto',
                                    marginRight: formatStyleVal(el.styles.marginRight) || 'auto',
                                    width: formatStyleVal(el.styles.width) || undefined,
                                    height: formatStyleVal(el.styles.height) || undefined,
                                    borderTopWidth: formatStyleVal(el.styles.borderWidth) || undefined,
                                    borderRadius: formatStyleVal(el.styles.borderRadius) || undefined,
                                  }} 
                                />
                              )}

                              {el.type === 'spacer' && (
                                <div style={{ height: formatStyleVal(el.styles.height) || formatStyleVal(el.styles.fontSize) || '32px', width: formatStyleVal(el.styles.width) || undefined, marginTop: formatStyleVal(el.styles.marginTop) || undefined, marginBottom: formatStyleVal(el.styles.marginBottom) || undefined }} className="w-full"></div>
                              )}

                              {el.type === 'search-box' && (
                                <div 
                                  className="w-full" 
                                  style={{ 
                                    marginTop: formatStyleVal(el.styles.marginTop) || '8px', 
                                    marginBottom: formatStyleVal(el.styles.marginBottom) || '8px',
                                    width: formatStyleVal(el.styles.width) || undefined,
                                    height: formatStyleVal(el.styles.height) || undefined
                                  }}
                                >
                                  <form 
                                    onSubmit={(e) => {
                                      handleFormSubmit(el, e);
                                    }} 
                                    className="flex items-center gap-2"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      type="text"
                                      name="query"
                                      placeholder={el.content || "Search..."}
                                      className="flex-1 px-3 py-2 text-xs rounded border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      disabled={!isPreviewMode}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                      type="submit"
                                      className="hover:opacity-90 transition-colors cursor-pointer border-none shrink-0"
                                      style={{
                                        backgroundColor: el.styles.backgroundColor || '#4f46e5',
                                        color: el.styles.color || '#ffffff',
                                        fontSize: formatStyleVal(el.styles.fontSize) || '12px',
                                        paddingTop: formatStyleVal(el.styles.paddingTop) || '0.66em',
                                        paddingBottom: formatStyleVal(el.styles.paddingBottom) || '0.66em',
                                        paddingLeft: formatStyleVal(el.styles.paddingLeft) || '1.33em',
                                        paddingRight: formatStyleVal(el.styles.paddingRight) || '1.33em',
                                        borderRadius: formatStyleVal(el.styles.borderRadius) || '4px',
                                        fontWeight: el.styles.fontWeight || '700',
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      {el.link || "Search"}
                                    </button>
                                  </form>
                                </div>
                              )}

                              {el.type === 'webshop' && (
                                <div 
                                  className="w-full transition-all"
                                  style={{
                                    fontFamily: el.styles?.fontFamily,
                                    marginTop: el.styles?.marginTop,
                                    marginBottom: el.styles?.marginBottom,
                                    paddingTop: el.styles?.paddingTop,
                                    paddingBottom: el.styles?.paddingBottom,
                                    paddingLeft: el.styles?.paddingLeft,
                                    paddingRight: el.styles?.paddingRight,
                                    backgroundColor: el.styles?.backgroundColor,
                                    borderRadius: el.styles?.borderRadius,
                                  }}
                                >
                                  <WebshopComponent 
                                    isPreviewMode={isPreviewMode} 
                                    theme={theme} 
                                    viewportMode={viewportMode} 
                                    el={el}
                                    onUpdateElement={onUpdateElement}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Add Widget link block (Empty State helper) */}
                        {!isPreviewMode && (
                          <div className="pt-2 border-t border-slate-100/50 dark:border-slate-800/10 flex items-center justify-center gap-1.5 flex-wrap" id="widget-toolbox-shortcut">
                            <span className="text-[9px] font-mono text-slate-350 dark:text-slate-600">ADD:</span>
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onAddElement(section.id, col.id, 'text');
                              }}
                              className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-50 border border-slate-150 hover:bg-white rounded text-slate-500 hover:text-indigo-600"
                              title="Append Text Node"
                            >
                              + Text
                            </button>
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onAddElement(section.id, col.id, 'button');
                              }}
                              className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-50 border border-slate-150 hover:bg-white rounded text-slate-500 hover:text-indigo-600"
                              title="Append CTA Button"
                            >
                              + Button
                            </button>
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onAddElement(section.id, col.id, 'image');
                              }}
                              className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-50 border border-slate-150 hover:bg-white rounded text-slate-500 hover:text-indigo-600"
                              title="Append Photo block"
                            >
                              + Image
                            </button>
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onAddElement(section.id, col.id, 'search-box');
                              }}
                              className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-50 border border-slate-150 hover:bg-white rounded text-slate-500 hover:text-indigo-600 text-[8px]"
                              title="Append Search Bar"
                            >
                              + Search
                            </button>
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onAddElement(section.id, col.id, 'image-banner');
                              }}
                              className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-50 border border-slate-150 hover:bg-white rounded text-slate-500 hover:text-indigo-600"
                              title="Append Image Banner with Overlay Content"
                            >
                              + Banner Overlay
                            </button>
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onAddElement(section.id, col.id, 'divider');
                              }}
                              className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-50 border border-slate-150 hover:bg-white rounded text-slate-500 hover:text-indigo-600 text-[8px]"
                              title="Append Line"
                            >
                              + Line
                            </button>
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onAddElement(section.id, col.id, 'spacer');
                              }}
                              className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-50 border border-slate-150 hover:bg-white rounded text-slate-500 hover:text-indigo-600 text-[8px]"
                              title="Append Block Spacer"
                            >
                              + Gap
                            </button>
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onAddElement(section.id, col.id, 'webshop');
                              }}
                              className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-50 border border-slate-150 hover:bg-white rounded text-slate-500 hover:text-indigo-600 text-[8px]"
                              title="Tilføj webshop butik"
                            >
                              + Webshop
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom Helper inside Wix empty board */}
        {!isPreviewMode && sections.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-full text-indigo-500">
              <Columns className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 dark:text-slate-300">Your visual stage is empty!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Begin designing your Squarespace page by clicking the layout panel on the left to load templates or add custom vertical columns.
              </p>
            </div>
            <button
              onClick={() => onAddSection('single-col')}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Row Section
            </button>
          </div>
        )}

        {/* Bottom spacer on mobile to prevent bottom bar from overlapping content */}
        {viewportMode !== 'desktop' && (
          <div className="h-24 w-full shrink-0" />
        )}
      </div>

      {/* Mobile-specific navigation components */}
      {viewportMode !== 'desktop' && (() => {
        const menuOverlay = findMenuOverlay();
        const isMobileViewport = viewportMode === 'mobile';
        
        // Bottom bar styling settings
        const bottomBarBgColor = isMobileViewport
          ? (menuOverlay?.settings?.bottomBarBgColorMobile || menuOverlay?.settings?.bottomBarBgColor || '#FFC502')
          : (menuOverlay?.settings?.bottomBarBgColorTablet || menuOverlay?.settings?.bottomBarBgColor || '#FFC502');
          
        const bottomBarTextColor = isMobileViewport
          ? (menuOverlay?.settings?.bottomBarTextColorMobile || menuOverlay?.settings?.bottomBarTextColor || '#0f172a')
          : (menuOverlay?.settings?.bottomBarTextColorTablet || menuOverlay?.settings?.bottomBarTextColor || '#0f172a');
          
        const bottomBarFontSize = isMobileViewport
          ? (menuOverlay?.settings?.bottomBarFontSizeMobile || menuOverlay?.settings?.bottomBarFontSize || 10)
          : (menuOverlay?.settings?.bottomBarFontSizeTablet || menuOverlay?.settings?.bottomBarFontSize || 10);
          
        const bottomBarFontWeight = isMobileViewport
          ? (menuOverlay?.settings?.bottomBarFontWeightMobile || menuOverlay?.settings?.bottomBarFontWeight || 'bold')
          : (menuOverlay?.settings?.bottomBarFontWeightTablet || menuOverlay?.settings?.bottomBarFontWeight || 'bold');
          
        const bottomBarFontStyle = isMobileViewport
          ? (menuOverlay?.settings?.bottomBarFontStyleMobile || menuOverlay?.settings?.bottomBarFontStyle || 'normal')
          : (menuOverlay?.settings?.bottomBarFontStyleTablet || menuOverlay?.settings?.bottomBarFontStyle || 'normal');
          
        const defaultItems = [
          { label: 'Hjem', link: '#', icon: 'home' },
          { label: 'Shop', link: '#shop', icon: 'shop' },
          { label: '31111115', link: 'tel:31111115', icon: 'phone' },
          { label: 'Menu', link: 'menu', icon: 'menu' }
        ];
        
        const bottomBarItems = isMobileViewport
          ? (menuOverlay?.settings?.bottomBarItemsMobile || menuOverlay?.settings?.bottomBarItems || defaultItems)
          : (menuOverlay?.settings?.bottomBarItemsTablet || menuOverlay?.settings?.bottomBarItems || defaultItems);
          
        const renderBottomBarIcon = (iconName: string, className: string = "w-5 h-5") => {
          switch (iconName) {
            case 'home': return <Home className={className} />;
            case 'shop': return <ShoppingCart className={className} />;
            case 'phone': return <Phone className={className} />;
            case 'menu': return <Menu className={className} />;
            default: return <HelpCircle className={className} />;
          }
        };

        const bottomBarFontFamily = isMobileViewport
          ? (menuOverlay?.settings?.bottomBarFontFamilyMobile || menuOverlay?.settings?.bottomBarFontFamily || menuOverlay?.styles?.fontFamily)
          : (menuOverlay?.settings?.bottomBarFontFamilyTablet || menuOverlay?.settings?.bottomBarFontFamily || menuOverlay?.styles?.fontFamily);
          
        const drawerFontFamily = isMobileViewport
          ? (menuOverlay?.settings?.drawerFontFamilyMobile || menuOverlay?.settings?.drawerFontFamily || menuOverlay?.styles?.fontFamily)
          : (menuOverlay?.settings?.drawerFontFamilyTablet || menuOverlay?.settings?.drawerFontFamily || menuOverlay?.styles?.fontFamily);

        const drawerBgColor = isMobileViewport
          ? (menuOverlay?.settings?.drawerBgColorMobile || menuOverlay?.settings?.drawerBgColor || '#ffffff')
          : (menuOverlay?.settings?.drawerBgColorTablet || menuOverlay?.settings?.drawerBgColor || '#ffffff');
        const drawerTextColor = isMobileViewport
          ? (menuOverlay?.settings?.drawerTextColorMobile || menuOverlay?.settings?.drawerTextColor || '#0f172a')
          : (menuOverlay?.settings?.drawerTextColorTablet || menuOverlay?.settings?.drawerTextColor || '#0f172a');
        const drawerFontSize = isMobileViewport
          ? (menuOverlay?.settings?.drawerFontSizeMobile || menuOverlay?.settings?.drawerFontSize || 14)
          : (menuOverlay?.settings?.drawerFontSizeTablet || menuOverlay?.settings?.drawerFontSize || 14);
        const drawerFontWeight = isMobileViewport
          ? (menuOverlay?.settings?.drawerFontWeightMobile || menuOverlay?.settings?.drawerFontWeight || 'bold')
          : (menuOverlay?.settings?.drawerFontWeightTablet || menuOverlay?.settings?.drawerFontWeight || 'bold');
        const drawerFontStyle = isMobileViewport
          ? (menuOverlay?.settings?.drawerFontStyleMobile || menuOverlay?.settings?.drawerFontStyle || 'normal')
          : (menuOverlay?.settings?.drawerFontStyleTablet || menuOverlay?.settings?.drawerFontStyle || 'normal');
        const drawerLinkFontSize = isMobileViewport
          ? (menuOverlay?.settings?.drawerLinkFontSizeMobile || menuOverlay?.settings?.drawerLinkFontSize || 12)
          : (menuOverlay?.settings?.drawerLinkFontSizeTablet || menuOverlay?.settings?.drawerLinkFontSize || 12);
        const drawerLinkFontWeight = isMobileViewport
          ? (menuOverlay?.settings?.drawerLinkFontWeightMobile || menuOverlay?.settings?.drawerLinkFontWeight || 'normal')
          : (menuOverlay?.settings?.drawerLinkFontWeightTablet || menuOverlay?.settings?.drawerLinkFontWeight || 'normal');
        const drawerLinkFontStyle = isMobileViewport
          ? (menuOverlay?.settings?.drawerLinkFontStyleMobile || menuOverlay?.settings?.drawerLinkFontStyle || 'normal')
          : (menuOverlay?.settings?.drawerLinkFontStyleTablet || menuOverlay?.settings?.drawerLinkFontStyle || 'normal');
        const drawerGroupFontSize = isMobileViewport
          ? (menuOverlay?.settings?.drawerGroupFontSizeMobile || menuOverlay?.settings?.drawerGroupFontSize || 10)
          : (menuOverlay?.settings?.drawerGroupFontSizeTablet || menuOverlay?.settings?.drawerGroupFontSize || 10);
        const drawerGroupFontWeight = isMobileViewport
          ? (menuOverlay?.settings?.drawerGroupFontWeightMobile || menuOverlay?.settings?.drawerGroupFontWeight || 'bold')
          : (menuOverlay?.settings?.drawerGroupFontWeightTablet || menuOverlay?.settings?.drawerGroupFontWeight || 'bold');
        const drawerGroupFontStyle = isMobileViewport
          ? (menuOverlay?.settings?.drawerGroupFontStyleMobile || menuOverlay?.settings?.drawerGroupFontStyle || 'normal')
          : (menuOverlay?.settings?.drawerGroupFontStyleTablet || menuOverlay?.settings?.drawerGroupFontStyle || 'normal');
        const drawerCategories = (isMobileViewport
          ? (menuOverlay?.settings?.menuContentMobile || menuOverlay?.content)
          : (menuOverlay?.settings?.menuContentTablet || menuOverlay?.content)) || '';
        
        const isWebshopPage = sections.some(s => s.columns.some(c => c.elements.some(e => e.type === 'webshop')));

        return (
          <>
            {/* Fixed Bottom Navigation Bar */}
            {!isWebshopPage && (
            <div 
              style={{
                position: 'fixed',
                bottom: '0px',
                left: isVisitorMode ? '50%' : (stageLeft !== null && stageWidth !== null ? `${stageLeft + stageWidth / 2}px` : (isPreviewMode ? '50%' : 'calc(50% + 160px)')),
                transform: 'translateX(-50%)',
                width: stageWidth !== null ? `${stageWidth}px` : (viewportMode === 'mobile' ? '375px' : '768px'),
                maxWidth: '100%',
                backgroundColor: bottomBarBgColor,
                color: bottomBarTextColor,
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.15)',
                zIndex: 100,
                borderTop: '1px solid rgba(15, 23, 42, 0.1)',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
              }}
              className="pointer-events-auto shadow-lg"
            >
              {bottomBarItems.map((btn: any, btnIdx: number) => {
                const styleObj = {
                  fontFamily: bottomBarFontFamily,
                  fontSize: safeFontSize(bottomBarFontSize, '10px'),
                  fontWeight: bottomBarFontWeight,
                  fontStyle: bottomBarFontStyle,
                  color: bottomBarTextColor
                };
                
                if (btn.link === 'menu') {
                  return (
                    <button 
                      key={btnIdx}
                      onClick={() => {
                        setIsMobileMenuOpen(true);
                      }}
                      style={styleObj}
                      className="flex flex-col items-center justify-center flex-1 py-2 border-none bg-transparent cursor-pointer hover:bg-black/5 rounded-xl transition-colors gap-0.5"
                    >
                      {renderBottomBarIcon(btn.icon, "w-5 h-5")}
                      <span className="font-bold" style={{ fontFamily: bottomBarFontFamily, fontSize: safeFontSize(bottomBarFontSize, "10px"), fontWeight: bottomBarFontWeight, fontStyle: bottomBarFontStyle }}>{btn.label}</span>
                    </button>
                  );
                }
                
                if (btn.link.startsWith('tel:')) {
                  return (
                    <a 
                      key={btnIdx}
                      href={btn.link}
                      style={styleObj}
                      className="flex flex-col items-center justify-center flex-1 py-2 border-none bg-transparent cursor-pointer hover:bg-black/5 rounded-xl transition-colors gap-0.5 no-underline animate-pulse"
                    >
                      {renderBottomBarIcon(btn.icon, "w-5 h-5")}
                      <span className="font-bold" style={{ fontFamily: bottomBarFontFamily, fontSize: safeFontSize(bottomBarFontSize, "10px"), fontWeight: bottomBarFontWeight, fontStyle: bottomBarFontStyle }}>{btn.label}</span>
                    </a>
                  );
                }
                
                return (
                  <a 
                    key={btnIdx}
                    href={btn.link || '#'}
                    onClick={(e) => {
                      handleLinkClick(e, btn.link);
                    }}
                    style={styleObj}
                    className="flex flex-col items-center justify-center flex-1 py-2 border-none bg-transparent cursor-pointer hover:bg-black/5 rounded-xl transition-colors gap-0.5 no-underline"
                  >
                    {renderBottomBarIcon(btn.icon, "w-5 h-5")}
                    <span className="font-bold" style={{ fontSize: safeFontSize(bottomBarFontSize, "10px"), fontWeight: bottomBarFontWeight, fontStyle: bottomBarFontStyle }}>{btn.label}</span>
                  </a>
                );
              })}
            </div>
            )}

            {/* Full-Screen Drawer Menu */}
            {isMobileMenuOpen && (
              <div 
                style={{
                  position: 'fixed',
                  top: '0px',
                  bottom: '0px',
                  left: isVisitorMode ? '50%' : (stageLeft !== null && stageWidth !== null ? `${stageLeft + stageWidth / 2}px` : (isPreviewMode ? '50%' : 'calc(50% + 160px)')),
                  transform: 'translateX(-50%)',
                  width: stageWidth !== null ? `${stageWidth}px` : (viewportMode === 'mobile' ? '375px' : '768px'),
                  maxWidth: '100%',
                  backgroundColor: drawerBgColor,
                  color: drawerTextColor,
                  zIndex: 110,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 -10px 25px rgba(0,0,0,0.15), 0 10px 25px rgba(0,0,0,0.15)',
                  overflowY: 'auto',
                }}
                className="pointer-events-auto"
              >
                {/* Header */}
                <div 
                  className="p-6 flex justify-between items-center border-b border-slate-100 sticky top-0 z-10"
                  style={{ backgroundColor: drawerBgColor, borderColor: 'rgba(15, 23, 42, 0.08)' }}
                >
                {/* Logo */}
                {(() => {
                  const logoOverlay = findLogoOverlay();
                  const handleClick = (e: React.MouseEvent) => {
                    if (!isPreviewMode) {
                      e.preventDefault();
                      return;
                    }
                    if (logoOverlay && logoOverlay.link) {
                      setIsMobileMenuOpen(false);
                      if (logoOverlay.link.startsWith('#')) {
                        handleLinkClick(e as any, logoOverlay.link);
                      } else {
                        window.location.href = logoOverlay.link;
                      }
                    }
                  };
                  
                  const logoContent = logoOverlay && logoOverlay.src ? (
                    <img 
                      src={logoOverlay.src} 
                      alt={logoOverlay.content || 'Logo'} 
                      style={{
                        height: '40px',
                        width: 'auto',
                        borderRadius: '4px'
                      }}
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full border-2 border-[#FFC502] flex items-center justify-center bg-slate-900 shrink-0">
                        <span className="text-[#FFC502] font-black text-xs">MM</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span 
                          className="font-extrabold tracking-wider leading-none uppercase text-base flex items-center gap-1"
                          style={{ color: drawerTextColor }}
                        >
                          LÅSESMED <Key className="w-3.5 h-3.5 text-[#FFC502] fill-[#FFC502]" />
                        </span>
                        <span className="text-[8px] text-[#FFC502] bg-slate-900 px-1.5 rounded-sm tracking-wide font-bold leading-normal mt-0.5 w-max">
                          DØGNVAGT 31 11 11 15
                        </span>
                      </div>
                    </div>
                  );
                  
                  if (logoOverlay && logoOverlay.link) {
                    return (
                      <div onClick={handleClick} className="cursor-pointer">
                        {logoContent}
                      </div>
                    );
                  }
                  return logoContent;
                })()}

                {/* Close button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 border-none bg-transparent cursor-pointer transition-colors"
                  style={{ color: drawerTextColor }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Items (Accordion) */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {(() => {
                  const menuOverlay = findMenuOverlay();
                  if (!menuOverlay) return <div className="text-center text-slate-400 text-sm">No navigation items found.</div>;
                  
                  const items = drawerCategories.split(',').map(itemStr => itemStr.trim()).filter(Boolean);
                  return items.map((item, idx) => {
                    const hasDropdown = ['Erhverv', 'Privat', 'Boligforeninger'].includes(item);
                    const isExpanded = activeMobileDropdown === item;
                    
                    return (
                      <div key={idx} className="border-b border-slate-100 pb-3 last:border-none">
                        {hasDropdown ? (
                          <button
                            onClick={() => setActiveMobileDropdown(isExpanded ? null : item)}
                            className="w-full text-left py-2 flex justify-between items-center font-bold uppercase tracking-wider border-none bg-transparent cursor-pointer hover:text-[#FFC502] transition-colors"
                            style={{
                              fontFamily: drawerFontFamily,
                              fontSize: safeFontSize(drawerFontSize, '14px'),
                              fontWeight: drawerFontWeight,
                              fontStyle: drawerFontStyle,
                              color: drawerTextColor
                            }}
                          >
                            <span>{item}</span>
                            <span className="text-lg font-mono text-slate-500">{isExpanded ? '−' : '+'}</span>
                          </button>
                        ) : (
                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}
                            className="block py-2 font-bold uppercase tracking-wider hover:text-[#FFC502] transition-colors no-underline"
                            style={{
                              fontFamily: drawerFontFamily,
                              fontSize: safeFontSize(drawerFontSize, '14px'),
                              fontWeight: drawerFontWeight,
                              fontStyle: drawerFontStyle,
                              color: drawerTextColor
                            }}
                          >
                            {item}
                          </a>
                        )}
                        
                        {/* Accordion Submenu */}
                        {hasDropdown && isExpanded && (
                          <div className="mt-2 pl-4 pr-2 py-3 bg-slate-50 rounded-xl space-y-3 border-l-2 border-[#FFC502] transition-all duration-300">
                            {(() => {
                              const allLinks = menuOverlay.dropdownLinks || getDefaultDropdownLinks();
                              const filteredLinks = allLinks.filter(l => l.parentItem.toLowerCase() === item.toLowerCase());
                              
                              const groups: { [key: string]: DropdownLink[] } = {};
                              filteredLinks.forEach(link => {
                                const g = link.group || 'General';
                                if (!groups[g]) groups[g] = [];
                                groups[g].push(link);
                              });
                              
                              const groupNames = Object.keys(groups);
                              if (groupNames.length === 0) {
                                return (
                                  <div className="text-slate-400 text-xs py-1 italic">
                                    No sub-pages added yet.
                                  </div>
                                );
                              }
                              
                              return groupNames.map((gName, gIdx) => (
                                <div key={gIdx} className={gIdx > 0 ? 'mt-2' : ''}>
                                  <div 
                                    className="uppercase tracking-wider flex items-center gap-1 mb-1"
                                    style={{
                                      fontFamily: drawerFontFamily,
                                      fontSize: safeFontSize(drawerGroupFontSize, '10px'),
                                      fontWeight: drawerGroupFontWeight,
                                      fontStyle: drawerGroupFontStyle,
                                      color: drawerTextColor
                                    }}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC502]" /> {gName}
                                  </div>
                                  <div className="pl-2.5 space-y-1">
                                    {groups[gName].map((link, lIdx) => (
                                      <a 
                                        key={link.id || lIdx}
                                        href={link.link || '#'} 
                                        onClick={(e) => {
                                          handleLinkClick(e, link.link, link.pageSlug);
                                          setIsMobileMenuOpen(false);
                                        }} 
                                        className="block hover:text-slate-950 no-underline"
                                        style={{
                                          fontSize: safeFontSize(drawerLinkFontSize, '12px'),
                                          fontWeight: drawerLinkFontWeight,
                                          fontStyle: drawerLinkFontStyle,
                                          color: isMobileViewport
                                            ? (menuOverlay?.settings?.drawerLinkColorMobile || '#475569')
                                            : (menuOverlay?.settings?.drawerLinkColorTablet || '#475569')
                                        }}
                                      >
                                        {link.title}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Footer Contact Card */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                <div className="bg-[#FFC502] text-slate-950 rounded-2xl p-5 flex flex-col gap-3 shadow-lg">
                  {(() => {
                    const menuOverlay = findMenuOverlay();
                    const contactText = menuOverlay?.settings?.contactText || "Kulvej 10, 2 TV\n2450 København SV\nDenmark";
                    const contactEmail = menuOverlay?.settings?.contactEmail || "info@mmlaasesmed.dk";
                    const contactPhone = menuOverlay?.settings?.contactPhone || "+45 31 11 11 15";
                    const contactTitle = menuOverlay?.settings?.contactTitle || "Kontakt";
                    return (
                      <>
                        <div className="font-extrabold uppercase tracking-wider text-slate-900" style={{ fontSize: `${menuOverlay?.settings?.contactTitleFontSize || 12}px` }}>{contactTitle}</div>
                        <div className="leading-relaxed font-semibold text-slate-900" style={{ fontSize: `${menuOverlay?.settings?.contactTextFontSize || 10}px` }}>
                          {contactText.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                          {contactEmail && <p className="mt-1">{contactEmail}</p>}
                        </div>
                        <a 
                          href={`tel:${contactPhone.replace(/\s+/g, '')}`} 
                          className="flex items-center justify-center gap-2 bg-slate-950 text-white hover:bg-slate-900 font-extrabold text-xs py-3 px-4 rounded-xl transition-all uppercase tracking-wider shadow-sm hover:shadow-md cursor-pointer no-underline mt-2"
                        >
                          <Phone className="w-4 h-4 text-[#FFC502]" />
                          <span>{contactPhone}</span>
                        </a>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
          </>
        );
      })()}

      {/* Floating Selection Tooltip for Inline Links & Formatting */}
      {selectionRect && (
        <div 
          className="fixed z-9999 flex items-center gap-1 bg-slate-950 text-white px-3 py-1.5 rounded-xl shadow-2xl border border-slate-800 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 font-sans select-none text-[11px] font-semibold"
          style={{
            top: `${selectionRect.top - window.scrollY - 48}px`,
            left: `${selectionRect.left + (selectionRect.width / 2)}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              document.execCommand('bold');
            }}
            className="p-1 hover:bg-slate-800 rounded font-bold text-xs w-6 h-6 flex items-center justify-center cursor-pointer border-none bg-transparent text-white"
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              document.execCommand('italic');
            }}
            className="p-1 hover:bg-slate-800 rounded italic text-xs w-6 h-6 flex items-center justify-center cursor-pointer border-none bg-transparent text-white"
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              document.execCommand('underline');
            }}
            className="p-1 hover:bg-slate-800 rounded underline text-xs w-6 h-6 flex items-center justify-center cursor-pointer border-none bg-transparent text-white"
            title="Underline"
          >
            U
          </button>
          <span className="w-[1px] h-3.5 bg-slate-850 mx-1"></span>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const url = prompt("Indtast link URL (f.eks. #shop eller /about eller https://google.com):");
              if (url) {
                const sel = window.getSelection();
                if (sel && selectionRange) {
                  sel.removeAllRanges();
                  sel.addRange(selectionRange);
                }
                document.execCommand('createLink', false, url);
              }
              setSelectionRange(null);
              setSelectionRect(null);
            }}
            className="p-1 hover:bg-slate-800 rounded text-xs flex items-center justify-center cursor-pointer border-none bg-transparent text-amber-400 gap-1 font-bold"
            title="Link"
          >
            <Link className="w-3 h-3" /> Link
          </button>
          <span className="w-[1px] h-3.5 bg-slate-850 mx-1"></span>
          <select 
            className="bg-slate-900 text-white text-[10px] font-bold border border-slate-750 rounded px-1.5 py-1 cursor-pointer focus:outline-none hover:bg-slate-800"
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.target.value) {
                const sel = window.getSelection();
                if (sel && selectionRange) {
                  sel.removeAllRanges();
                  sel.addRange(selectionRange);
                }
                document.execCommand('fontName', false, e.target.value);
                // Reset the select back to "Font..."
                e.target.value = "";
              }
              setSelectionRange(null);
              setSelectionRect(null);
            }}
          >
            <option value="">Font...</option>
            <option value="Inter">Inter</option>
            <option value="Poppins">Poppins</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Roboto">Roboto</option>
            <option value="Outfit">Outfit</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
          </select>
          <span className="w-[1px] h-3.5 bg-slate-850 mx-1"></span>
          <select 
            className="bg-slate-900 text-white text-[10px] font-bold border border-slate-750 rounded px-1.5 py-1 cursor-pointer focus:outline-none hover:bg-slate-800"
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const size = e.target.value;
              if (size) {
                const sel = window.getSelection();
                if (sel && selectionRange) {
                  sel.removeAllRanges();
                  sel.addRange(selectionRange);
                }
                
                document.execCommand('fontSize', false, '7');
                const fonts = document.querySelectorAll('font[size="7"]');
                fonts.forEach(f => {
                  f.removeAttribute('size');
                  f.style.fontSize = `${size}px`;
                });
                
                e.target.value = "";
              }
              setSelectionRange(null);
              setSelectionRect(null);
            }}
          >
            <option value="">Size...</option>
            <option value="8">8px</option>
            <option value="10">10px</option>
            <option value="12">12px</option>
            <option value="14">14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
            <option value="20">20px</option>
            <option value="24">24px</option>
            <option value="28">28px</option>
            <option value="32">32px</option>
            <option value="36">36px</option>
            <option value="40">40px</option>
            <option value="48">48px</option>
            <option value="56">56px</option>
            <option value="64">64px</option>
            <option value="72">72px</option>
            <option value="96">96px</option>
            <option value="120">120px</option>
          </select>
        </div>
      )}
    </div>
  );
}
