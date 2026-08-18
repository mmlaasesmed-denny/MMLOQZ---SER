import React, { useState, useEffect } from 'react';
import { 
  Palette, Type, Sliders, Box, Layers, Image as ImageIcon, 
  Trash2, Plus, ChevronUp, ChevronDown, Copy, Link, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Sparkles, PlusCircle, Check, Monitor, Tablet, Smartphone, ShoppingBag,
  Save, Edit2, RotateCcw
} from 'lucide-react';
import { Section, PageElement, SiteTheme, ElementStyles, ElementType, OverlayItem, DropdownLink } from '../types';
import { COLOR_THEMES, TEMPLATES } from '../templates';
import { getDefaultDropdownLinks } from './Canvas';
import { useLanguage } from '../i18n';

interface SidebarProps {
  sections: Section[];
  theme: SiteTheme;
  selectedElement: PageElement | null;
  selectedSection: Section | null;
  onUpdateElement: (
    elementId: string, 
    updatedStyles: Partial<ElementStyles>, 
    updatedContent?: string, 
    updatedLink?: string, 
    updatedSrc?: string,
    updatedOverlayProps?: Partial<PageElement>
  ) => void;
  onUpdateSection: (sectionId: string, updatedSection: Partial<Section>) => void;
  onSelectTheme: (theme: SiteTheme) => void;
  onLoadTemplate: (sections: Section[], theme?: SiteTheme) => void;
  onAddElement: (sectionId: string, colId: string, type: ElementType) => void;
  onDeleteElement: (elementId: string) => void;
  onCloneElement: (elementId: string) => void;
  onAddSection: (layout: 'single-col' | 'two-col' | 'three-col' | 'footer') => void;
  onDeleteSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  onMoveElement: (elementId: string, direction: 'up' | 'down') => void;
  onGenerateAIContent: (elementId: string, context: string) => void;
  isGeneratingAI: boolean;
  onChangeImageClick: (elementId: string) => void;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  pages?: any[];
  activePageId?: string;
  onNavigatePage?: (pageId: string) => void;
  onChangeViewportMode?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

interface DropdownEditorProps {
  item: OverlayItem;
  selectedElement: PageElement;
  onUpdateElement: SidebarProps['onUpdateElement'];
  pages?: any[];
}

function DropdownOptionsEditor({ item, selectedElement, onUpdateElement, pages = [] }: DropdownEditorProps) {
  const categories = item.content.split(',').map(c => c.trim()).filter(Boolean);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  
  const [group, setGroup] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [pageSlug, setPageSlug] = useState('');

  const allLinks = item.dropdownLinks || getDefaultDropdownLinks();
  const currentCategoryLinks = allLinks.filter(l => l.parentItem.toLowerCase() === selectedCategory.toLowerCase());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    const currentLinksList = [...allLinks];

    if (editingLinkId) {
      const nextLinks = currentLinksList.map(l => 
        l.id === editingLinkId 
          ? { ...l, group: group.trim() || 'General', title: title.trim(), description: description.trim(), link: linkUrl.trim() || '#', pageSlug: pageSlug.trim() }
          : l
      );
      updateOverlays(nextLinks);
      setEditingLinkId(null);
    } else {
      const newLink: DropdownLink = {
        id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        parentItem: selectedCategory,
        group: group.trim() || 'General',
        title: title.trim(),
        description: description.trim(),
        link: linkUrl.trim() || '#',
        pageSlug: pageSlug.trim()
      };
      updateOverlays([...currentLinksList, newLink]);
    }

    setGroup('');
    setTitle('');
    setDescription('');
    setLinkUrl('');
    setPageSlug('');
  };

  const updateOverlays = (nextLinks: DropdownLink[]) => {
    const nextOverlays = (selectedElement.overlays || []).map(o => 
      o.id === item.id ? { ...o, dropdownLinks: nextLinks } : o
    );
    onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
  };

  const handleEditClick = (link: DropdownLink) => {
    setEditingLinkId(link.id);
    setGroup(link.group);
    setTitle(link.title);
    setDescription(link.description);
    setLinkUrl(link.link);
    setPageSlug(link.pageSlug || '');
  };

  const handleDeleteClick = (linkId: string) => {
    const nextLinks = allLinks.filter(l => l.id !== linkId);
    updateOverlays(nextLinks);
    if (editingLinkId === linkId) {
      setEditingLinkId(null);
      setGroup('');
      setTitle('');
      setDescription('');
      setLinkUrl('');
      setPageSlug('');
    }
  };

  const handleCancelEdit = () => {
    setEditingLinkId(null);
    setGroup('');
    setTitle('');
    setDescription('');
    setLinkUrl('');
    setPageSlug('');
  };

  const groupedLinks: { [key: string]: DropdownLink[] } = {};
  currentCategoryLinks.forEach(l => {
    const gName = l.group || 'General';
    if (!groupedLinks[gName]) groupedLinks[gName] = [];
    groupedLinks[gName].push(l);
  });

  return (
    <div className="space-y-4 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Dropdown Pages Setup
        </h4>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 block font-semibold">Select Top-Level Menu Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            handleCancelEdit();
          }}
          className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 font-sans"
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-slate-400 block font-semibold">
          Current Options in "{selectedCategory}"
        </label>
        {currentCategoryLinks.length === 0 ? (
          <div className="text-center py-4 bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 text-xs">
            No options. Add a new option below.
          </div>
        ) : (
          <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
            {Object.keys(groupedLinks).map((gName, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                <div className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/20 px-1.5 py-0.5 rounded w-max">
                  {gName}
                </div>
                <div className="space-y-1 pl-1">
                  {groupedLinks[gName].map((link) => (
                    <div 
                      key={link.id} 
                      className="flex items-start justify-between p-2 rounded bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-xs gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-755 dark:text-slate-200 truncate">{link.title}</div>
                        <div className="text-[10px] text-slate-400 truncate">{link.description || 'No description'}</div>
                        <div className="text-[9px] text-slate-400 truncate bg-slate-150 dark:bg-slate-800 px-1 py-0.5 rounded w-max mt-1 font-mono">
                          Link: {link.link} {link.pageSlug && `| Side-slug: /${link.pageSlug}`}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditClick(link)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-855 rounded text-slate-500 cursor-pointer border-none bg-transparent"
                          title="Edit"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(link.id)}
                          className="p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer border-none bg-transparent"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {editingLinkId ? '📝 Edit Dropdown Option' : '➕ Add Dropdown Option'}
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 block font-semibold">Option Group / Category</label>
          <input
            type="text"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            placeholder="e.g. Sikkerhed & Adgang"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 block font-semibold">Option Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            placeholder="e.g. Adgangskontrol"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 block font-semibold">Option Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            placeholder="e.g. Fleksible adgangsløsninger..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 block font-semibold">Page Link / Section ID</label>
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            placeholder="e.g. #adgangskontrol"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 block font-semibold">Page Slug Link / Side-slug (Valgfri)</label>
          <input
            type="text"
            value={pageSlug}
            onChange={(e) => setPageSlug(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-indigo-400 font-semibold"
            placeholder="e.g. bistro-menu"
            list="editor-pages-slug-list"
          />
          <datalist id="editor-pages-slug-list">
            {pages.map(p => (
              <option key={p.id} value={p.slug}>
                {p.name.replace(/^📄\s|^🛒\s|^🏠\s|^👥\s|^⚖️\s|^🥐\s|^☁️\s/, '')} (/{p.slug || 'home'})
              </option>
            ))}
          </datalist>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer border-none transition-colors"
          >
            {editingLinkId ? 'Save Changes' : 'Add Option'}
          </button>
          {editingLinkId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="py-1.5 px-3 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-650 dark:text-slate-300 cursor-pointer border-none transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const compressImage = (dataUrl: string, callback: (compressed: string) => void) => {
  const img = new Image();
  img.onload = () => {
    const maxDimension = 750;
    let width = img.width;
    let height = img.height;
    
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      callback(compressedDataUrl);
    } else {
      callback(dataUrl);
    }
  };
  img.onerror = () => {
    callback(dataUrl);
  };
  img.src = dataUrl;
};

export default function Sidebar({
  sections,
  theme,
  selectedElement,
  selectedSection,
  onUpdateElement,
  onUpdateSection,
  onSelectTheme,
  onLoadTemplate,
  onAddElement,
  onDeleteElement,
  onCloneElement,
  onAddSection,
  onDeleteSection,
  onMoveSection,
  onMoveElement,
  onGenerateAIContent,
  isGeneratingAI,
  onChangeImageClick,
  viewportMode,
  pages = [],
  activePageId,
  onNavigatePage
}: SidebarProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'content' | 'elements' | 'sections' | 'theme' | 'webshop' | 'ai'>('content');
  const [aiPrompt, setAiPrompt] = useState('');

  const [activeWebshopNode, setActiveWebshopNode] = useState<any>(null);

  useEffect(() => {
    const handleFocus = () => {
      setActiveWebshopNode((window as any).activeWebshopEditableNode);
    };
    window.addEventListener('webshopTextFocused', handleFocus);
    return () => window.removeEventListener('webshopTextFocused', handleFocus);
  }, []);

  // Automatically switch to Inspector tab when an element or section is selected
  useEffect(() => {
    if (selectedElement || selectedSection) {
      setActiveTab('content');
    }
  }, [selectedElement, selectedSection]);

  // Webshop Page Creator States
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designFileName, setDesignFileName] = useState('');

  // Reusable dynamic layout presets and custom templates manager state & handlers
  const [templatesList, setTemplatesList] = useState<any[]>(() => {
    const saved = localStorage.getItem('visual-builder-managed-templates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse templates list:", e);
      }
    }
    return TEMPLATES;
  });

  const handleSaveAsTemplate = () => {
    const name = prompt("Indtast et navn til din skabelon (f.eks. Mit Brand Layout):");
    if (!name || !name.trim()) return;

    // Create a new template object
    const newTmpl = {
      id: `custom-tmpl-${Date.now()}`,
      name: name.trim(),
      description: `Gemt skabelon oprettet den ${new Date().toLocaleDateString()}`,
      sections: JSON.parse(JSON.stringify(sections)), // Deep copy of sections prop
      theme: { ...theme }
    };

    const updated = [...templatesList, newTmpl];
    setTemplatesList(updated);
    localStorage.setItem('visual-builder-managed-templates', JSON.stringify(updated));
    alert(`🎉 Layoutet er gemt som skabelonen "${name}"!`);
  };

  const handleApplyCustomTemplate = (tmpl: any) => {
    if (confirm(`Vil du anvende skabelonen "${tmpl.name}" på denne side? Dette vil overskrive alt nuværende indhold på siden.`)) {
      onLoadTemplate(tmpl.sections, tmpl.theme);
    }
  };

  const handleRenameTemplate = (id: string, currentName: string, currentDesc: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = prompt("Indtast nyt navn til skabelonen:", currentName);
    if (newName === null) return;
    if (!newName.trim()) {
      alert("Navnet må ikke være tomt.");
      return;
    }
    const newDesc = prompt("Indtast ny beskrivelse til skabelonen:", currentDesc);
    const updated = templatesList.map(t => {
      if (t.id === id) {
        return {
          ...t,
          name: newName.trim(),
          description: newDesc !== null ? newDesc.trim() : t.description
        };
      }
      return t;
    });
    setTemplatesList(updated);
    localStorage.setItem('visual-builder-managed-templates', JSON.stringify(updated));
  };

  const handleUpdateTemplateDesign = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Vil du overskrive designet for skabelonen "${name}" med dit nuværende layout på canvas?`)) {
      const updated = templatesList.map(t => {
        if (t.id === id) {
          return {
            ...t,
            sections: JSON.parse(JSON.stringify(sections)),
            theme: { ...theme }
          };
        }
        return t;
      });
      setTemplatesList(updated);
      localStorage.setItem('visual-builder-managed-templates', JSON.stringify(updated));
      alert(`🎉 Designet for skabelonen "${name}" er blevet opdateret!`);
    }
  };

  const handleDeleteCustomTemplate = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Er du sikker på, at du vil slette skabelonen "${name}"?`)) {
      const updated = templatesList.filter(t => t.id !== id);
      setTemplatesList(updated);
      localStorage.setItem('visual-builder-managed-templates', JSON.stringify(updated));
    }
  };

  const handleRestoreDefaultTemplates = () => {
    if (confirm("Vil du gendanne standard-skabelonerne? Dine egne gemte skabeloner vil blive bevaret, men de slettede standard-skabeloner vil komme tilbage.")) {
      const updated = [...templatesList];
      TEMPLATES.forEach(tmpl => {
        if (!updated.some(t => t.id === tmpl.id)) {
          updated.push(tmpl);
        }
      });
      setTemplatesList(updated);
      localStorage.setItem('visual-builder-managed-templates', JSON.stringify(updated));
      alert("🎉 Standard-skabelonerne er blevet gendannet!");
    }
  };

  const handleApplyThemeGlobally = () => {
    if (confirm("Vil du anvende dette tema (skrifttyper, farver) på alle dine sider i webshoppen?")) {
      const customEvent = new CustomEvent('apply-theme-globally', {
        detail: { theme }
      });
      window.dispatchEvent(customEvent);
      alert("🎉 Temaet er anvendt på alle dine sider!");
    }
  };

  const handleCreateCustomWebshopPage = () => {
    if (!newTemplateTitle.trim()) {
      alert('Angiv venligst en titel til siden.');
      return;
    }
    
    if (!designFile) {
      const defaultSections: Section[] = [
        {
          id: `sec-${Date.now()}-1`,
          name: 'Hero Banner',
          layout: 'single-col',
          paddingY: 'lg',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a',
          columns: [{
            id: `col-${Date.now()}-1`,
            width: 'w-full',
            elements: [
              {
                id: `el-${Date.now()}-1`,
                type: 'text',
                content: `<h1 class="text-4xl font-extrabold text-slate-900 tracking-tight text-center">${newTemplateTitle}</h1><p class="mt-4 text-lg text-slate-500 text-center font-sans">Tilpas denne skabelon med billeder, knapper og tekstelementer fra biblioteket.</p>`,
                styles: { textAlign: 'center', marginBottom: '24px' }
              },
              {
                id: `el-${Date.now()}-2`,
                type: 'webshop',
                content: '',
                styles: { marginTop: '16px', marginBottom: '16px' },
                settings: {
                  logoBadge: 'MM',
                  logoText: 'MM LÅSESMED',
                  tagline: 'Døgnvagt i Storkøbenhavn',
                  searchPlaceholder: 'Søg efter produkt, underkategori eller mærke...',
                  productsTitle: 'Vores produkter'
                }
              }
            ]
          }]
        }
      ];
      const customEvent = new CustomEvent('create-webshop-page', {
        detail: { name: newTemplateTitle, sections: defaultSections, theme }
      });
      window.dispatchEvent(customEvent);
      setNewTemplateTitle('');
      setDesignFile(null);
      setDesignFileName('');
      alert('🎉 Din nye webshopsideskabelon er blevet oprettet uden designfil!');
      return;
    }

    const reader = new FileReader();
    if (designFile.name.endsWith('.json')) {
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          const customEvent = new CustomEvent('create-webshop-page', {
            detail: {
              name: newTemplateTitle,
              sections: content.sections || [],
              theme: content.theme || theme
            }
          });
          window.dispatchEvent(customEvent);
          setNewTemplateTitle('');
          setDesignFile(null);
          setDesignFileName('');
          alert(`🎉 Webshopsiden '${newTemplateTitle}' er oprettet baseret på JSON layout designfilen!`);
        } catch (err) {
          alert('Fejl ved parsing af JSON designfilen. Kontroller syntaksen.');
        }
      };
      reader.readAsText(designFile);
    } else if (designFile.type.startsWith('image/')) {
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        compressImage(rawDataUrl, (dataUrl) => {
          const imageSections: Section[] = [
            {
              id: `sec-${Date.now()}-img1`,
              name: 'Oversigt Banner',
              layout: 'single-col',
              paddingY: 'lg',
              backgroundColor: '#0f172a',
              textColor: '#ffffff',
              columns: [{
                id: `col-${Date.now()}-imgcol`,
                width: 'w-full',
                elements: [
                  {
                    id: `el-${Date.now()}-imgtitle`,
                    type: 'text',
                    content: `<h1 class="text-4xl font-extrabold text-white tracking-tight text-center">${newTemplateTitle}</h1><p class="mt-2 text-sm text-slate-350 text-center font-sans">Denne side er genereret ud fra dit uploadede designbillede.</p>`,
                    styles: { textAlign: 'center', marginBottom: '20px' }
                  }
                ]
              }]
            },
            {
              id: `sec-${Date.now()}-img2`,
              name: 'Design Mockup Visning',
              layout: 'two-col',
              paddingY: 'md',
              backgroundColor: '#ffffff',
              textColor: '#0f172a',
              columns: [
                {
                  id: `col-${Date.now()}-colleft`,
                  width: 'md:w-1/2',
                  elements: [
                    {
                      id: `el-${Date.now()}-mockupimg`,
                      type: 'image',
                      content: '',
                      src: dataUrl,
                      styles: { borderRadius: '16px', borderColor: '#e2e8f0', borderWidth: '1px', width: '100%' }
                    }
                  ]
                },
                {
                  id: `col-${Date.now()}-colright`,
                  width: 'md:w-1/2',
                  elements: [
                    {
                      id: `el-${Date.now()}-righttext`,
                      type: 'text',
                      content: `<h2 class="text-2xl font-bold text-slate-900 leading-tight">Uploadet Designbillede</h2><p class="mt-4 text-xs text-slate-550 leading-relaxed font-sans">Du har uploadet et designbillede for denne side. Du kan erstatte eller tilføje andre elementer (som knapper, overskrifter, produktvisninger) ved hjælp af elementer-tabben til venstre.</p>`,
                      styles: { marginBottom: '16px' }
                    },
                    {
                      id: `el-${Date.now()}-shopwidget`,
                      type: 'webshop',
                      content: '',
                      styles: { marginTop: '8px' },
                      settings: {
                        logoBadge: 'MM',
                        logoText: 'MM LÅSESMED',
                        tagline: 'Døgnvagt i Storkøbenhavn',
                        searchPlaceholder: 'Søg efter produkt, underkategori eller mærke...',
                        productsTitle: 'Vores produkter'
                      }
                    }
                  ]
                }
              ]
            }
          ];
          const customEvent = new CustomEvent('create-webshop-page', {
            detail: { name: newTemplateTitle, sections: imageSections, theme }
          });
          window.dispatchEvent(customEvent);
          setNewTemplateTitle('');
          setDesignFile(null);
          setDesignFileName('');
          alert(`🎉 Webshopsiden '${newTemplateTitle}' er oprettet med dit uploadede mockup-designbillede!`);
        });
      };
      reader.readAsDataURL(designFile);
    } else {
      alert('Ugyldig filtype. Upload venligst en .json layoutfil eller et designbillede (png, jpg).');
    }
  };

  const getResolvedElementStyles = (el: PageElement): ElementStyles => {
    const base = el.styles || {};
    if (viewportMode === 'mobile') {
      return {
        ...base,
        ...(el.stylesTablet || {}),
        ...(el.stylesMobile || {}),
      };
    } else if (viewportMode === 'tablet') {
      return {
        ...base,
        ...(el.stylesTablet || {}),
      };
    }
    return base;
  };

  const getResolvedSection = (sec: Section): Section => {
    if (viewportMode === 'mobile') {
      return {
        ...sec,
        ...(sec.tabletOverrides || {}),
        ...(sec.mobileOverrides || {}),
      };
    } else if (viewportMode === 'tablet') {
      return {
        ...sec,
        ...(sec.tabletOverrides || {}),
      };
    }
    return sec;
  };

  const getResolvedOverlayStyles = (item: OverlayItem): ElementStyles => {
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

  const updateOverlayStyles = (overlayId: string, updatedStyles: Partial<ElementStyles>) => {
    if (!selectedElement) return;
    const nextOverlays = (selectedElement.overlays || []).map(o => {
      if (o.id !== overlayId) return o;
      if (viewportMode === 'mobile') {
        return {
          ...o,
          stylesMobile: {
            ...(o.stylesMobile || {}),
            ...updatedStyles
          }
        };
      } else if (viewportMode === 'tablet') {
        return {
          ...o,
          stylesTablet: {
            ...(o.stylesTablet || {}),
            ...updatedStyles
          }
        };
      } else {
        return {
          ...o,
          styles: {
            ...o.styles,
            ...updatedStyles
          }
        };
      }
    });
    onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
  };

  const activeElementStyles = selectedElement ? getResolvedElementStyles(selectedElement) : {} as ElementStyles;
  const activeSection = selectedSection ? getResolvedSection(selectedSection) : null;

  // Sizing standard ranges for font weight options
  const WEIGHS: ('300' | '400' | '500' | '600' | '700' | '800')[] = ['300', '400', '500', '600', '700', '800']; 

  const activeFontFamilyGroup = 
    theme.fontFamily === 'serif' ? 'font-serif (Playfair Display & Inter)' :
    theme.fontFamily === 'mono' ? 'font-mono (JetBrains Mono & Inter)' :
    theme.fontFamily === 'display' ? 'font-display (Outfit & Inter)' :
    'font-sans (Inter)';

  return (
    <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full overflow-hidden text-slate-800 dark:text-slate-200 shadow-sm z-30" id="editor-sidebar">
      {/* Sidebar Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-1 gap-1" id="sidebar-tabs">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 flex flex-col items-center py-2 text-[11px] font-semibold rounded-md transition-all ${
            activeTab === 'content'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          title="Component Spacing & Style Inspector"
        >
          <Sliders className="w-4 h-4 mb-0.5" />
          <span>{t('Inspector')}</span>
        </button>

        <button
          onClick={() => setActiveTab('elements')}
          className={`flex-1 flex flex-col items-center py-2 text-[11px] font-semibold rounded-md transition-all ${
            activeTab === 'elements'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          title="Add Components Library"
        >
          <PlusCircle className="w-4 h-4 mb-0.5" />
          <span>{t('Elements')}</span>
        </button>

        <button
          onClick={() => setActiveTab('webshop')}
          className={`flex-1 flex flex-col items-center py-2 text-[11px] font-semibold rounded-md transition-all ${
            activeTab === 'webshop'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          title="Opret og administrer webshop layouts"
        >
          <ShoppingBag className="w-4 h-4 mb-0.5" />
          <span>{t('Webshop')}</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 flex flex-col items-center py-2 text-[11px] font-semibold rounded-md transition-all ${
            activeTab === 'sections'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          title="Manage Layout Sections"
        >
          <Layers className="w-4 h-4 mb-0.5" />
          <span>{t('Layout')}</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 flex flex-col items-center py-2 text-[11px] font-semibold rounded-md transition-all ${
            activeTab === 'theme'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          title="Change Fonts and Color Palettes"
        >
          <Palette className="w-4 h-4 mb-0.5" />
          <span>{t('Themes')}</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 flex flex-col items-center py-2 text-[11px] font-semibold rounded-md transition-all ${
            activeTab === 'ai'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-200'
          }`}
          title="Gemini Copywriting Assistant"
        >
          <Sparkles className="w-4 h-4 mb-0.5 text-amber-500" />
          <span>{t('AI Writer')}</span>
        </button>
      </div>

      {/* Sidebar Main Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" id="sidebar-panel-body">
        
        {/* =============== TAB: INSPECTOR (Selected Node Settings) =============== */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in duration-150" id="tab-inspector">
            
            {/* If NO element and NO section is selected */}
            {!selectedElement && !selectedSection && (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Box className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No component selected</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click any element, image, text block, or button directly on the canvas to configure its fonts, size, padding, spacing, and coloring.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-2 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 text-[10px] uppercase font-bold rounded-sm tracking-wider">
                    Double-Click text to type inline
                  </span>
                </div>
              </div>
            )}

            {/* ELEMENT INSPECTOR SECTIONS */}
            {selectedElement && (
              <div className="space-y-6">
                {/* Element Header */}
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/10 rounded-lg border border-indigo-100 dark:border-indigo-900/25">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                      Selected: Element ({selectedElement.type})
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onCloneElement(selectedElement.id)}
                        className="p-1 hover:bg-indigo-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300"
                        title="Clone Element"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteElement(selectedElement.id)}
                        className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600"
                        title="Delete Element"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Move element order within same column */}
                  <div className="mt-2.5 flex items-center justify-between border-t border-indigo-100/30 dark:border-indigo-900/10 pt-2 text-xs">
                    <span className="text-slate-400 text-[11px]">Reorder in section column</span>
                    <div className="flex gap-1 bg-white dark:bg-slate-800 rounded-md shadow-2xs border border-slate-200/55 p-0.5">
                      <button
                        onClick={() => onMoveElement(selectedElement.id, 'up')}
                        className="p-1 text-slate-600 hover:text-indigo-600 dark:text-slate-300 transition-colors"
                        title="Shift Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-[1px] bg-slate-100 dark:bg-slate-700"></span>
                      <button
                        onClick={() => onMoveElement(selectedElement.id, 'down')}
                        className="p-1 text-slate-600 hover:text-indigo-600 dark:text-slate-300 transition-colors"
                        title="Shift Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Specialized Logo Inspector or Standard Element Type Changer */}
                {(() => {
                  const isDirectLogo = selectedElement.id.toLowerCase().includes('logo');
                  const logoOverlay = selectedElement.overlays?.find(o => o.type === 'logo');
                  
                  if (!isDirectLogo && !logoOverlay) {
                    return (
                      <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-450 block">Element Type</span>
                        <select
                          value={selectedElement.type}
                          onChange={(e) => {
                            const nextType = e.target.value as ElementType;
                            let contentUpdate = selectedElement.content;
                            let srcUpdate = selectedElement.src;
                            
                            // Intelligently initialize content when converting type
                            if (nextType === 'text' && !selectedElement.content) {
                              contentUpdate = 'Ny tekstblok...';
                            } else if (nextType === 'image' && !selectedElement.src) {
                              srcUpdate = 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80';
                            }
                            
                            onUpdateElement(
                              selectedElement.id, 
                              {}, 
                              contentUpdate, 
                              undefined, 
                              srcUpdate, 
                              { type: nextType }
                            );
                          }}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-55 dark:bg-slate-955 text-slate-850 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-sans cursor-pointer"
                        >
                          <option value="text">Text / HTML Block</option>
                          <option value="image">Image / Graphic</option>
                          <option value="button">Button / Link Button</option>
                          <option value="divider">Horizontal Divider</option>
                          <option value="spacer">Blank Spacer</option>
                          <option value="search-box">Search Input Box</option>
                        </select>
                      </div>
                    );
                  }

                  const isImage = isDirectLogo ? selectedElement.type === 'image' : !!logoOverlay?.src;
                  const logoContent = isDirectLogo ? selectedElement.content : logoOverlay?.content;
                  const logoSrc = isDirectLogo ? selectedElement.src : logoOverlay?.src;
                  const logoHeight = isDirectLogo 
                    ? (selectedElement.styles?.height || '40px') 
                    : (logoOverlay?.styles?.fontSize || '40px');

                  return (
                    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-3 text-left">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-500">Logo Indstillinger (Logo Settings)</h5>
                      
                      {/* Logo Type Switcher */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logo Type</label>
                        <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              if (isDirectLogo) {
                                onUpdateElement(selectedElement.id, { height: undefined }, selectedElement.content || 'LOGO', undefined, undefined, { type: 'text' });
                              } else if (logoOverlay) {
                                const nextOverlays = selectedElement.overlays.map(o => o.id === logoOverlay.id ? { ...o, src: undefined, styles: { ...o.styles, fontSize: '22px' } } : o);
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                              }
                            }}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors border-none cursor-pointer ${
                              !isImage
                                ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-xs'
                                : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            Tekst / Skrifttype
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const defaultLogoUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80';
                              if (isDirectLogo) {
                                onUpdateElement(selectedElement.id, { height: '40px', width: 'auto' }, undefined, undefined, selectedElement.src || defaultLogoUrl, { type: 'image' });
                              } else if (logoOverlay) {
                                const nextOverlays = selectedElement.overlays.map(o => o.id === logoOverlay.id ? { ...o, src: logoOverlay.src || defaultLogoUrl, styles: { ...o.styles, fontSize: '32px' } } : o);
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                              }
                            }}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors border-none cursor-pointer ${
                              isImage
                                ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-xs'
                                : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            Billede / Grafisk
                          </button>
                        </div>
                      </div>

                      {/* Conditional Settings based on selected Logo Type */}
                      {!isImage ? (
                        <div className="space-y-2 animate-in fade-in duration-200">
                          <label className="text-[10px] font-semibold text-slate-500 block">Logo Tekst</label>
                          <input
                            type="text"
                            value={logoContent || ''}
                            onChange={(e) => {
                              if (isDirectLogo) {
                                onUpdateElement(selectedElement.id, {}, e.target.value);
                              } else if (logoOverlay) {
                                const nextOverlays = selectedElement.overlays.map(o => o.id === logoOverlay.id ? { ...o, content: e.target.value } : o);
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                              }
                            }}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Indtast logo tekst..."
                          />
                        </div>
                      ) : (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          <label className="text-[10px] font-semibold text-slate-500 block">Logo Billede URL / Fil</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={logoSrc || ''}
                              onChange={(e) => {
                                if (isDirectLogo) {
                                  onUpdateElement(selectedElement.id, {}, undefined, undefined, e.target.value);
                                } else if (logoOverlay) {
                                  const nextOverlays = selectedElement.overlays.map(o => o.id === logoOverlay.id ? { ...o, src: e.target.value } : o);
                                  onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                }
                              }}
                              className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-mono text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Indtast logo URL..."
                            />
                            <input
                              type="file"
                              id={`file-upload-${selectedElement.id}`}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const b64 = reader.result as string;
                                    if (isDirectLogo) {
                                      onUpdateElement(selectedElement.id, {}, undefined, undefined, b64);
                                    } else if (logoOverlay) {
                                      const nextOverlays = selectedElement.overlays.map(o => o.id === logoOverlay.id ? { ...o, src: b64 } : o);
                                      onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                document.getElementById(`file-upload-${selectedElement.id}`)?.click();
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                            >
                              Upload
                            </button>
                          </div>

                          {/* Height slider for Logo */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-550 uppercase">
                              <span>Logo Højde</span>
                              <span className="font-mono text-indigo-500">{logoHeight}</span>
                            </div>
                            <input
                              type="range"
                              min="15"
                              max="120"
                              value={parseInt(logoHeight) || 40}
                              onChange={(e) => {
                                if (isDirectLogo) {
                                  onUpdateElement(selectedElement.id, { height: `${e.target.value}px`, width: 'auto' });
                                } else if (logoOverlay) {
                                  const nextOverlays = selectedElement.overlays.map(o => o.id === logoOverlay.id ? { ...o, styles: { ...o.styles, fontSize: `${e.target.value}px` } } : o);
                                  onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                }
                              }}
                              className="w-full accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
                
                {/* Responsive Visibility Controls */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3" id="inspector-visibility">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Device Visibility</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const nextVal = selectedElement.visibleOnDesktop !== false ? false : true;
                        onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { visibleOnDesktop: nextVal });
                      }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedElement.visibleOnDesktop !== false
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-300'
                          : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>

                    <button
                      onClick={() => {
                        const nextVal = selectedElement.visibleOnTablet !== false ? false : true;
                        onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { visibleOnTablet: nextVal });
                      }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedElement.visibleOnTablet !== false
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-300'
                          : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                      }`}
                    >
                      <Tablet className="w-3.5 h-3.5" />
                      <span>Tablet</span>
                    </button>

                    <button
                      onClick={() => {
                        const nextVal = selectedElement.visibleOnMobile !== false ? false : true;
                        onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { visibleOnMobile: nextVal });
                      }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedElement.visibleOnMobile !== false
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-300'
                          : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Content Input (Only relevant for Text, Button, and Search Box) */}
                {(selectedElement.type === 'text' || selectedElement.type === 'button' || selectedElement.type === 'search-box') && (
                  <div className="space-y-1.5" id="inspector-content-block">
                    <label className="text-xs font-semibold text-slate-500">
                      {selectedElement.type === 'search-box' ? 'Edit Search Placeholder' : 'Edit Text Content'}
                    </label>
                    <textarea
                      value={selectedElement.content}
                      onChange={(e) => onUpdateElement(selectedElement.id, {}, e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                      rows={selectedElement.type === 'button' || selectedElement.type === 'search-box' ? 1 : 4}
                      placeholder="Type content..."
                      id="text-content-textarea"
                    />
                    <p className="text-[10px] text-slate-400">
                      {selectedElement.type === 'search-box' ? 'This sets the input placeholder text.' : 'You can also double-click on the page directly to edit!'}
                    </p>
                  </div>
                )}

                {selectedElement.type === 'webshop' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-wider">
                        <ShoppingBag className="w-4 h-4" />
                        <span>Webshop butik</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                        Rediger overskrifter, logoer og placeholders for din webshop nedenfor. Ændringer gemmes i databasen og vises på live webshoppen.
                      </p>
                      <button
                        onClick={() => {
                          window.location.hash = '#shop/admin';
                        }}
                        className="w-full mt-2.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        Åbn butiksadministration
                      </button>
                    </div>

                    {/* Interactive Webshop Text Editor Block */}
                    {activeWebshopNode && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3.5 space-y-4 shadow-sm animate-fade-in-up">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] uppercase tracking-wider">
                          <Type className="w-4 h-4" />
                          <span>Selected Text Formatting</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                          You have selected a text element in the Webshop. Use the scrollers below to adjust its styling.
                        </p>
                        
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-300 font-semibold">Line spacing (Height)</span>
                          </div>
                          <input
                            type="range"
                            min="1.0"
                            max="2.5"
                            step="0.1"
                            defaultValue="1.5"
                            onChange={(e) => {
                              if ((window as any).activeWebshopEditableNodeApplyStyle) {
                                (window as any).activeWebshopEditableNodeApplyStyle('line-height', e.target.value);
                              }
                            }}
                            className="w-full accent-indigo-600 cursor-pointer h-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 appearance-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-300 font-semibold">Font size (px)</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="60"
                            step="1"
                            defaultValue="16"
                            onChange={(e) => {
                              if ((window as any).activeWebshopEditableNodeApplyStyle) {
                                (window as any).activeWebshopEditableNodeApplyStyle('font-size', e.target.value + 'px');
                              }
                            }}
                            className="w-full accent-indigo-600 cursor-pointer h-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 appearance-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* Logo Type Selector for Webshop */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logo Type</label>
                        <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  logoType: 'text'
                                }
                              });
                            }}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors border-none cursor-pointer ${
                              selectedElement.settings?.logoType !== 'image'
                                ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-xs'
                                : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            Tekst / Badge
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  logoType: 'image'
                                }
                              });
                            }}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors border-none cursor-pointer ${
                              selectedElement.settings?.logoType === 'image'
                                ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-xs'
                                : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            Billede / Grafisk
                          </button>
                        </div>
                      </div>

                      {selectedElement.settings?.logoType === 'image' ? (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          {/* Logo Image URL / Upload */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Logo Billede URL / Fil</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={selectedElement.settings?.logoSrc || ''}
                                onChange={(e) => {
                                  onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                    settings: {
                                      ...(selectedElement.settings || {}),
                                      logoSrc: e.target.value
                                    }
                                  });
                                }}
                                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-mono text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Indtast logo URL..."
                              />
                              <input
                                type="file"
                                id={`file-upload-settings-${selectedElement.id}`}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const b64 = reader.result as string;
                                      onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                        settings: {
                                          ...(selectedElement.settings || {}),
                                          logoSrc: b64
                                        }
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  document.getElementById(`file-upload-settings-${selectedElement.id}`)?.click();
                                }}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                              >
                                Upload
                              </button>
                            </div>
                          </div>

                          {/* Logo Height Slider */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold text-slate-550 uppercase tracking-wider">
                              <span>Logo Højde</span>
                              <span className="font-mono text-indigo-500 font-bold">{(selectedElement.settings?.logoHeight || 40)}px</span>
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="120"
                              value={selectedElement.settings?.logoHeight || 40}
                              onChange={(e) => {
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                  settings: {
                                    ...(selectedElement.settings || {}),
                                    logoHeight: parseInt(e.target.value)
                                  }
                                });
                              }}
                              className="w-full accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          {/* Logo Badge */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-550 uppercase tracking-wider">Logo ikon tekst (Badge)</label>
                            <input
                              type="text"
                              value={selectedElement.settings?.logoBadge || 'MM'}
                              onChange={(e) => {
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                  settings: {
                                    ...(selectedElement.settings || {}),
                                    logoBadge: e.target.value
                                  }
                                });
                              }}
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-5-0 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          {/* Logo Text */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-550 uppercase tracking-wider">Logo tekst</label>
                            <input
                              type="text"
                              value={selectedElement.settings?.logoText || 'MM LÅSESMED'}
                              onChange={(e) => {
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                  settings: {
                                    ...(selectedElement.settings || {}),
                                    logoText: e.target.value
                                  }
                                });
                              }}
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-5-0 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          {/* Tagline */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-555 uppercase tracking-wider">Tagline / Undertekst</label>
                            <input
                              type="text"
                              value={selectedElement.settings?.tagline || 'Døgnvagt i Storkøbenhavn'}
                              onChange={(e) => {
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                  settings: {
                                    ...(selectedElement.settings || {}),
                                    tagline: e.target.value
                                  }
                                });
                              }}
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-5-0 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          {/* Forced Store View (eCommerce Page Sektion) */}
                      <div className="space-y-1.5 p-3.5 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                        <label className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">Editor Butiksvisning (eCommerce View)</label>
                        <p className="text-[9px] text-slate-500 leading-normal">
                          Styrer hvilken del af webshoppen der skal vises i editoren for dette element.
                        </p>
                        <select
                          value={selectedElement.settings?.forcedView || 'categories'}
                          onChange={(e) => {
                            onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                              settings: {
                                ...(selectedElement.settings || {}),
                                forcedView: e.target.value
                              }
                            });
                          }}
                          className="w-full mt-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                        >
                          <option value="categories">Butik Forside (Categories / Shop Home)</option>
                          <option value="product-detail">Produktdetaljer (Product Details Template)</option>
                          <option value="cart">Indkøbskurv (Cart Page)</option>
                          <option value="checkout">Kasse / Betaling (Checkout Page)</option>
                          <option value="login">Kunde Log ind / Profil (Account Page)</option>
                        </select>
                      </div>

                        </div>
                      )}
                      
                      {/* Logo Font Size Slider (Applies to both Text and Image now) */}
                      <div className="space-y-1 mt-6">
                        <div className="flex justify-between text-[11px] font-bold text-slate-550 uppercase tracking-wider">
                          <span>Logo Størrelse (Header Logo)</span>
                          <span className="font-mono text-indigo-500 font-bold">{(selectedElement.settings?.logoFontSize || 18)}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="10"
                            max="72"
                            value={selectedElement.settings?.logoFontSize || 18}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  logoFontSize: parseInt(e.target.value)
                                }
                              });
                            }}
                            className="flex-1 accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      {/* Favicon Settings */}
                      <div className="space-y-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Favicon / Site Ikon</span>
                          {selectedElement.settings?.faviconSrc && (
                            <img 
                              src={selectedElement.settings.faviconSrc} 
                              alt="Favicon Preview" 
                              className="w-5 h-5 object-contain rounded border border-slate-200 bg-white" 
                            />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Dette ikon vises i browserens faneblad ved siden af sidens titel.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={selectedElement.settings?.faviconSrc || ''}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  faviconSrc: e.target.value
                                }
                              });
                            }}
                            className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-mono text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Favicon URL..."
                          />
                          <input
                            type="file"
                            id="sidebar-favicon-upload"
                            className="hidden"
                            accept="image/x-icon,image/png,image/jpeg,image/svg+xml,image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (reader.result) {
                                    onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                      settings: {
                                        ...(selectedElement.settings || {}),
                                        faviconSrc: reader.result as string
                                      }
                                    });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <label
                            htmlFor="sidebar-favicon-upload"
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center shrink-0"
                          >
                            Upload
                          </label>
                        </div>
                      </div>
                      <div className="space-y-1 mt-4">
                        <div className="flex justify-between text-[11px] font-bold text-slate-550 uppercase tracking-wider">
                          <span>Footer Logo Størrelse</span>
                          <span className="font-mono text-indigo-500 font-bold">{(selectedElement.settings?.footerLogoFontSize || 14)}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="10"
                            max="72"
                            value={selectedElement.settings?.footerLogoFontSize || 14}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  footerLogoFontSize: parseInt(e.target.value)
                                }
                              });
                            }}
                            className="flex-1 accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      {/* Badge Size Slider */}
                      <div className="space-y-1 mt-4">
                        <div className="flex justify-between text-[11px] font-bold text-slate-550 uppercase tracking-wider">
                          <span>Trust Badges Størrelse (Ikoner)</span>
                          <span className="font-mono text-indigo-500 font-bold">{(selectedElement.settings?.badgeSize || 30)}px</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="4"
                            max="600"
                            value={selectedElement.settings?.badgeSize ? parseInt(String(selectedElement.settings.badgeSize).replace('px', '')) : 30}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  badgeSize: e.target.value
                                }
                              });
                            }}
                            className="flex-1 accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      {/* Badge Title Size Slider */}
                      <div className="space-y-1 mt-4">
                        <div className="flex justify-between text-[11px] font-bold text-slate-550 uppercase tracking-wider">
                          <span>Trust Badges Titel Størrelse</span>
                          <span className="font-mono text-indigo-500 font-bold">{(selectedElement.settings?.badgeTitleSize || 12)}px</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="8"
                            max="36"
                            value={selectedElement.settings?.badgeTitleSize || 12}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  badgeTitleSize: parseInt(e.target.value)
                                }
                              });
                            }}
                            className="flex-1 accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      {/* Badge Text Size Slider */}
                      <div className="space-y-1 mt-4">
                        <div className="flex justify-between text-[11px] font-bold text-slate-550 uppercase tracking-wider">
                          <span>Trust Badges Tekst Størrelse</span>
                          <span className="font-mono text-indigo-500 font-bold">{(selectedElement.settings?.badgeTextSize || 10)}px</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="8"
                            max="24"
                            value={selectedElement.settings?.badgeTextSize || 10}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  badgeTextSize: parseInt(e.target.value)
                                }
                              });
                            }}
                            className="flex-1 accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      {/* Nav Menu Settings */}
                      <div className="space-y-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Hovedmenu Indstillinger</h4>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-550 uppercase tracking-wider">
                            <span>Menu Tekst Størrelse</span>
                            <span className="font-mono text-indigo-500 font-bold">{(selectedElement.settings?.navMenuFontSize || 12)}px</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <input
                              type="range"
                              min="8"
                              max="32"
                              value={selectedElement.settings?.navMenuFontSize || 12}
                              onChange={(e) => {
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                  settings: {
                                    ...(selectedElement.settings || {}),
                                    navMenuFontSize: parseInt(e.target.value)
                                  }
                                });
                              }}
                              className="flex-1 accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                            />
                          </div>
                        </div>

                        <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded border border-slate-100 dark:border-slate-800">
                          <div className="flex justify-between text-[11px] font-bold text-slate-550 uppercase tracking-wider">
                            <span>Dropdown (Mega Menu) Styling</span>
                            <span className="font-mono text-indigo-500 font-bold">{(selectedElement.settings?.megaMenuFontSize || 12)}px</span>
                          </div>
                          
                          {/* Font Size */}
                          <div className="flex gap-2 items-center">
                            <input
                              type="range"
                              min="8"
                              max="32"
                              value={selectedElement.settings?.megaMenuFontSize || 12}
                              onChange={(e) => {
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                  settings: {
                                    ...(selectedElement.settings || {}),
                                    megaMenuFontSize: parseInt(e.target.value)
                                  }
                                });
                              }}
                              className="flex-1 accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                            />
                          </div>

                          {/* Font Style & Weight */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const currentWeight = selectedElement.settings?.megaMenuFontWeight || 'normal';
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                  settings: {
                                    ...(selectedElement.settings || {}),
                                    megaMenuFontWeight: currentWeight === 'bold' ? 'normal' : 'bold'
                                  }
                                });
                              }}
                              className={`flex-1 py-1 text-[10px] font-bold uppercase rounded border ${selectedElement.settings?.megaMenuFontWeight === 'bold' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            >
                              Bold
                            </button>
                            <button
                              onClick={() => {
                                const currentStyle = selectedElement.settings?.megaMenuFontStyle || 'normal';
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                  settings: {
                                    ...(selectedElement.settings || {}),
                                    megaMenuFontStyle: currentStyle === 'italic' ? 'normal' : 'italic'
                                  }
                                });
                              }}
                              className={`flex-1 py-1 text-[10px] italic font-bold uppercase rounded border ${selectedElement.settings?.megaMenuFontStyle === 'italic' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            >
                              Italic
                            </button>
                          </div>

                          {/* Colors */}
                          <div className="flex gap-2">
                            <div className="flex-1 space-y-1">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Text Color</span>
                              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-1.5 py-1">
                                <input
                                  type="color"
                                  value={selectedElement.settings?.megaMenuTextColor || '#475569'}
                                  onChange={(e) => {
                                    onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                      settings: {
                                        ...(selectedElement.settings || {}),
                                        megaMenuTextColor: e.target.value
                                      }
                                    });
                                  }}
                                  className="w-4 h-4 rounded-sm cursor-pointer border-0 p-0"
                                />
                                <span className="text-[10px] font-mono text-slate-500">{selectedElement.settings?.megaMenuTextColor || '#475569'}</span>
                              </div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Active Color</span>
                              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-1.5 py-1">
                                <input
                                  type="color"
                                  value={selectedElement.settings?.megaMenuActiveColor || '#f59e0b'}
                                  onChange={(e) => {
                                    onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                      settings: {
                                        ...(selectedElement.settings || {}),
                                        megaMenuActiveColor: e.target.value
                                      }
                                    });
                                  }}
                                  className="w-4 h-4 rounded-sm cursor-pointer border-0 p-0"
                                />
                                <span className="text-[10px] font-mono text-slate-500">{selectedElement.settings?.megaMenuActiveColor || '#f59e0b'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-550 uppercase tracking-wider block">Banner Font Family (Kategorier)</label>
                          <select
                            value={selectedElement.settings?.bannerFontFamily || ''}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  bannerFontFamily: e.target.value
                                }
                              });
                            }}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                          >
                            <option value="">Standard (System Sans)</option>
                            <option value="'Poppins', sans-serif">Poppins</option>
                            <option value="'Inter', sans-serif">Inter</option>
                            <option value="'Outfit', sans-serif">Outfit</option>
                            <option value="'Playfair Display', serif">Playfair Display</option>
                            <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
                            <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
                            <option value="'Fira Code', monospace">Fira Code</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-550 uppercase tracking-wider block">Banner Tekst Farve</label>
                          <input
                            type="color"
                            value={selectedElement.settings?.bannerTextColor || '#0f172a'}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  bannerTextColor: e.target.value
                                }
                              });
                            }}
                            className="w-full h-8 cursor-pointer rounded-lg border-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-550 uppercase tracking-wider block">Dropdown Tekst Farve</label>
                          <input
                            type="color"
                            value={selectedElement.settings?.megaMenuTextColor || '#475569'}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  megaMenuTextColor: e.target.value
                                }
                              });
                            }}
                            className="w-full h-8 cursor-pointer rounded-lg border-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-550 uppercase tracking-wider block">Dropdown Hover/Aktiv Farve</label>
                          <input
                            type="color"
                            value={selectedElement.settings?.megaMenuActiveColor || '#f59e0b'}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  megaMenuActiveColor: e.target.value
                                }
                              });
                            }}
                            className="w-full h-8 cursor-pointer rounded-lg border-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-550 uppercase tracking-wider block">Menu Link Farve (Standard)</label>
                          <input
                            type="color"
                            value={selectedElement.settings?.navMenuColor || '#cbd5e1'}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  navMenuColor: e.target.value
                                }
                              });
                            }}
                            className="w-full h-8 cursor-pointer rounded-lg border-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-550 uppercase tracking-wider block">Produkter Knap Baggrund</label>
                          <input
                            type="color"
                            value={selectedElement.settings?.produkterBgColor || '#fbbf24'}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  produkterBgColor: e.target.value
                                }
                              });
                            }}
                            className="w-full h-8 cursor-pointer rounded-lg border-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-550 uppercase tracking-wider block">Produkter Knap Tekst</label>
                          <input
                            type="color"
                            value={selectedElement.settings?.produkterTextColor || '#0f172a'}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  produkterTextColor: e.target.value
                                }
                              });
                            }}
                            className="w-full h-8 cursor-pointer rounded-lg border-none"
                          />
                        </div>
                      </div>

                      {/* Search Placeholder */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Søgefelt placeholder</label>
                        <input
                          type="text"
                          value={selectedElement.settings?.searchPlaceholder || 'Søg efter produkt, underkategori eller mærke...'}
                          onChange={(e) => {
                            onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                              settings: {
                                ...(selectedElement.settings || {}),
                                searchPlaceholder: e.target.value
                              }
                            });
                          }}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Products Title */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Produkter sektionstitel</label>
                        <input
                          type="text"
                          value={selectedElement.settings?.productsTitle || 'Vores produkter'}
                          onChange={(e) => {
                            onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                              settings: {
                                ...(selectedElement.settings || {}),
                                productsTitle: e.target.value
                              }
                            });
                          }}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Category Image Width Slider */}
                      <div className="space-y-1 mt-4">
                        <div className="flex justify-between text-[11px] font-bold text-slate-550 uppercase tracking-wider">
                          <span>Kategori Billede Bredde %</span>
                          <span className="font-mono text-indigo-500 font-bold">{(selectedElement.settings?.categoryImageWidth || 35)}%</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min="10"
                            max="90"
                            value={selectedElement.settings?.categoryImageWidth || 35}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  categoryImageWidth: parseInt(e.target.value)
                                }
                              });
                            }}
                            className="flex-1 accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      {/* Nyhedsbrev (Newsletter) Settings */}
                      <div className="pt-4 border-t border-slate-150 dark:border-slate-800 space-y-3">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Nyhedsbrev Indstillinger</span>
                        
                        {/* Left Item Width */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase">
                            <span>Tekst sektion Bredde</span>
                            <span className="font-mono text-indigo-500">{(selectedElement.settings?.newsletterLeftWidth || 512)}px</span>
                          </div>
                          <input
                            type="range"
                            min="200"
                            max="800"
                            value={selectedElement.settings?.newsletterLeftWidth || 512}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  newsletterLeftWidth: parseInt(e.target.value)
                                }
                              });
                            }}
                            className="w-full accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                          />
                        </div>

                        {/* Left Item Padding Left/Right */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-450 block font-semibold uppercase">Tekst Padding Venstre</label>
                            <input
                              type="number"
                              value={selectedElement.settings?.newsletterLeftPaddingLeft || 0}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                  settings: {
                                    ...(selectedElement.settings || {}),
                                    newsletterLeftPaddingLeft: val
                                  }
                                });
                              }}
                              className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-450 block font-semibold uppercase">Tekst Padding Højre</label>
                            <input
                              type="number"
                              value={selectedElement.settings?.newsletterLeftPaddingRight || 0}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                  settings: {
                                    ...(selectedElement.settings || {}),
                                    newsletterLeftPaddingRight: val
                                  }
                                });
                              }}
                              className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                            />
                          </div>
                        </div>

                        {/* Right Item Width */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase">
                            <span>Formular Sektion Bredde</span>
                            <span className="font-mono text-indigo-500">{(selectedElement.settings?.newsletterRightWidth || 300)}px</span>
                          </div>
                          <input
                            type="range"
                            min="200"
                            max="600"
                            value={selectedElement.settings?.newsletterRightWidth || 300}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  newsletterRightWidth: parseInt(e.target.value)
                                }
                              });
                            }}
                            className="w-full accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                          />
                        </div>

                        {/* Right Item Padding Left/Right */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-450 block font-semibold uppercase">Form Padding Venstre</label>
                            <input
                              type="number"
                              value={selectedElement.settings?.newsletterRightPaddingLeft || 0}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                  settings: {
                                    ...(selectedElement.settings || {}),
                                    newsletterRightPaddingLeft: val
                                  }
                                });
                              }}
                              className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-slate-800 dark:text-slate-100"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-450 block font-semibold uppercase">Form Padding Højre</label>
                            <input
                              type="number"
                              value={selectedElement.settings?.newsletterRightPaddingRight || 0}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                  settings: {
                                    ...(selectedElement.settings || {}),
                                    newsletterRightPaddingRight: val
                                  }
                                });
                              }}
                              className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-slate-800 dark:text-slate-100"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Upload Webshop Design File */}
                      <div className="pt-4 border-t border-slate-150 dark:border-slate-800 space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Upload Webshop Designfil</label>
                        <p className="text-[9px] text-slate-400 leading-normal font-sans">
                          Upload en `.json` designfil (backup/layout format) for at opdatere sidens layout og farvetemaer.
                        </p>
                        <div className="relative flex items-center justify-center border border-dashed border-slate-350 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-955 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer">
                          <input
                            type="file"
                            accept=".json"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                try {
                                  const content = JSON.parse(event.target?.result as string);
                                  if (content && content.sections && content.theme) {
                                    const customEvent = new CustomEvent('import-webshop-design', {
                                      detail: { sections: content.sections, theme: content.theme }
                                    });
                                    window.dispatchEvent(customEvent);
                                    alert('🎉 Webshop designfil indlæst succesfuldt! Layout og farvetema er opdateret.');
                                  } else {
                                    alert('Ugyldigt filformat. Sørg for, at filen indeholder både sektioner ("sections") og et tema ("theme").');
                                  }
                                } catch (err) {
                                  alert('Kunne ikke indlæse layout JSON-filen. Kontroller syntaksen.');
                                }
                              };
                              reader.readAsText(file);
                            }}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          />
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">📤 Vælg designfil (.json)</span>
                        </div>
                      </div>

                      {/* Apply Design Mappings */}
                      <div className="pt-4 border-t border-slate-150 dark:border-slate-800 space-y-3 font-sans text-left">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Anvend design på webshop-sider</label>
                        <p className="text-[9px] text-slate-400 leading-normal mb-1">
                          Vælg hvilken af dine oprettede sider der skal bruges som designskabelon (layout & tema) for webshoppens undersider.
                        </p>
                        
                        {/* 1. Shop Home */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Webshop Hjem (Shop Home)</label>
                          <select
                            value={selectedElement.settings?.webshopMappings?.shopHome || ''}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  webshopMappings: {
                                    ...(selectedElement.settings?.webshopMappings || {}),
                                    shopHome: e.target.value
                                  }
                                }
                              });
                            }}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                          >
                            <option value="">Standard layout</option>
                            {pages.map(p => {
                              const nameClean = p.name.replace('📄 ', '').replace('🛒 ', '');
                              return <option key={p.id} value={p.id}>{nameClean} (/{p.slug || 'home'})</option>;
                            })}
                          </select>
                        </div>

                        {/* 2. Product Detail */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Produkt Detaljeside</label>
                          <select
                            value={selectedElement.settings?.webshopMappings?.productDetail || ''}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  webshopMappings: {
                                    ...(selectedElement.settings?.webshopMappings || {}),
                                    productDetail: e.target.value
                                  }
                                }
                              });
                            }}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                          >
                            <option value="">Standard layout</option>
                            {pages.map(p => {
                              const nameClean = p.name.replace('📄 ', '').replace('🛒 ', '');
                              return <option key={p.id} value={p.id}>{nameClean} (/{p.slug || 'home'})</option>;
                            })}
                          </select>
                        </div>

                        {/* 3. Category Detail */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Kategori Detaljeside</label>
                          <select
                            value={selectedElement.settings?.webshopMappings?.categoryDetail || ''}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  webshopMappings: {
                                    ...(selectedElement.settings?.webshopMappings || {}),
                                    categoryDetail: e.target.value
                                  }
                                }
                              });
                            }}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                          >
                            <option value="">Standard layout</option>
                            {pages.map(p => {
                              const nameClean = p.name.replace('📄 ', '').replace('🛒 ', '');
                              return <option key={p.id} value={p.id}>{nameClean} (/{p.slug || 'home'})</option>;
                            })}
                          </select>
                        </div>

                        {/* 4. Search Results */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Søgeresultater Side</label>
                          <select
                            value={selectedElement.settings?.webshopMappings?.searchResults || ''}
                            onChange={(e) => {
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, {
                                settings: {
                                  ...(selectedElement.settings || {}),
                                  webshopMappings: {
                                    ...(selectedElement.settings?.webshopMappings || {}),
                                    searchResults: e.target.value
                                  }
                                }
                              });
                            }}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                          >
                            <option value="">Standard layout</option>
                            {pages.map(p => {
                              const nameClean = p.name.replace('📄 ', '').replace('🛒 ', '');
                              return <option key={p.id} value={p.id}>{nameClean} (/{p.slug || 'home'})</option>;
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedElement.type === 'search-box' && (
                  <div className="space-y-1.5" id="inspector-search-button-text">
                    <label className="text-xs font-semibold text-slate-500">Edit Button Label Text</label>
                    <input
                      type="text"
                      value={selectedElement.link || ''}
                      onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                      placeholder="e.g. Search"
                    />
                    <p className="text-[10px] text-slate-400">This sets the label text displayed inside the search button.</p>
                  </div>
                )}

                {/* Redirection Link Settings for Button, Search Box, and Text */}
                {(selectedElement.type === 'button' || selectedElement.type === 'search-box' || selectedElement.type === 'text') && (
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                    <span className="text-xs font-semibold text-slate-500 block">Element Action Behavior</span>
                    
                    {selectedElement.type !== 'text' && (
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-semibold">Action Type</label>
                        <select
                          value={selectedElement.actionType || 'link'}
                          onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { actionType: e.target.value as any })}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="link">Redirection Link</option>
                          <option value="submit">Submit to Backend API</option>
                        </select>
                      </div>
                    )}

                    {selectedElement.type !== 'text' && selectedElement.actionType === 'submit' ? (
                      <div className="space-y-2.5 pl-3 border-l-2 border-indigo-500/30">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold">Backend API URL</label>
                          <input
                            type="text"
                            value={selectedElement.backendUrl || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { backendUrl: e.target.value })}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="https://httpbin.org/post"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold">HTTP Method</label>
                          <select
                            value={selectedElement.backendMethod || 'POST'}
                            onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { backendMethod: e.target.value as any })}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="POST">POST (Recommended)</option>
                            <option value="GET">GET</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      (selectedElement.type === 'button' || selectedElement.type === 'text' || selectedElement.type === 'image' || selectedElement.type === 'image-banner' || selectedElement.type === 'video') && (
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold">Redirection Link URL</label>
                          <input
                            type="text"
                            value={selectedElement.link || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="#section-id or https://..."
                          />
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Spacing & Typography Section (Only for Text, Buttons, and Search Box) */}
                {(selectedElement.type === 'text' || selectedElement.type === 'button' || selectedElement.type === 'search-box' || selectedElement.type === 'image' || selectedElement.type === 'image-banner' || selectedElement.type === 'video') && (
                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4" id="inspector-typography-spacing">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Typography & Spacing</h5>

                    {/* Font Family Selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Skrifttype / Font Family</label>
                      <select
                        value={activeElementStyles.fontFamily || ''}
                        onChange={(e) => onUpdateElement(selectedElement.id, { fontFamily: e.target.value })}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                      >
                        <option value="">Standard (System Sans)</option>
                        <option value="'Poppins', sans-serif">Poppins (Modern Geometric Sans)</option>
                        <option value="'Inter', sans-serif">Inter (Sleek Modern Sans)</option>
                        <option value="'Outfit', sans-serif">Outfit (Elegant Geometric)</option>
                        <option value="'Playfair Display', serif">Playfair Display (Premium Serif)</option>
                        <option value="'Cormorant Garamond', serif">Cormorant Garamond (Classic Luxe Serif)</option>
                        <option value="'Space Grotesk', sans-serif">Space Grotesk (Edgy Display)</option>
                        <option value="'Fira Code', monospace">Fira Code (Developer Mono)</option>
                      </select>
                    </div>

                    {/* Font Size Selector */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Font size</span>
                        <span className="font-mono text-indigo-500 font-semibold">{activeElementStyles.fontSize || '16px'}</span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="80"
                        value={parseInt(activeElementStyles.fontSize || '16') || 16}
                        onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: `${e.target.value}px` })}
                        className="w-full accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-100 dark:bg-slate-800"
                      />
                    </div>

                    {/* Line height (Line Spacing) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Line spacing (Height)</span>
                        <span className="font-mono text-indigo-500 font-semibold">{activeElementStyles.lineHeight || '1.5'}</span>
                      </div>
                      <input
                        type="range"
                        min="0.9"
                        max="2.5"
                        step="0.1"
                        value={parseFloat(activeElementStyles.lineHeight || '1.5') || 1.5}
                        onChange={(e) => onUpdateElement(selectedElement.id, { lineHeight: e.target.value })}
                        className="w-full accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-100 dark:bg-slate-800"
                      />
                    </div>

                    {/* Word spacing */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Word spacing</span>
                        <span className="font-mono text-indigo-500 font-semibold">{activeElementStyles.wordSpacing || '0px'}</span>
                      </div>
                      <input
                        type="range"
                        min="-2"
                        max="16"
                        step="1"
                        value={parseInt(activeElementStyles.wordSpacing || '0') || 0}
                        onChange={(e) => onUpdateElement(selectedElement.id, { wordSpacing: `${e.target.value}px` })}
                        className="w-full accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-100 dark:bg-slate-800"
                      />
                    </div>

                    {/* Letter spacing */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Letter spacing</span>
                        <span className="font-mono text-indigo-500 font-semibold">{activeElementStyles.letterSpacing || '0px'}</span>
                      </div>
                      <input
                        type="range"
                        min="-1.5"
                        max="10"
                        step="0.5"
                        value={parseFloat(activeElementStyles.letterSpacing || '0') || 0}
                        onChange={(e) => onUpdateElement(selectedElement.id, { letterSpacing: `${e.target.value}px` })}
                        className="w-full accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-100 dark:bg-slate-800"
                      />
                    </div>

                    {/* Weight, Alignment, Decoration */}
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">Font Weight & Alignment</span>
                      
                      {/* Weight selects */}
                      <div className="grid grid-cols-3 gap-1">
                        {['300', '400', '500', '600', '700', '800'].map(w => (
                          <button
                            key={w}
                            onClick={() => onUpdateElement(selectedElement.id, { fontWeight: w as any })}
                            className={`px-1.5 py-1 text-[11px] font-semibold border rounded-sm transition-all ${
                              activeElementStyles.fontWeight === w
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            {w === '300' ? 'Light' : w === '400' ? 'Regular' : w === '500' ? 'Medium' : w === '600' ? 'Semibold' : w === '700' ? 'Bold' : 'Impact'}
                          </button>
                        ))}
                      </div>

                      {/* Alignments */}
                      <div className="flex border border-slate-250 dark:border-slate-800 rounded-md overflow-hidden bg-slate-50 dark:bg-slate-950 p-[3px] gap-[2px]">
                        {[
                          { id: 'left', icon: <AlignLeft className="w-3.5 h-3.5" /> },
                          { id: 'center', icon: <AlignCenter className="w-3.5 h-3.5" /> },
                          { id: 'right', icon: <AlignRight className="w-3.5 h-3.5" /> },
                          { id: 'justify', icon: <AlignJustify className="w-3.5 h-3.5" /> },
                        ].map(align => (
                          <button
                            key={align.id}
                            onClick={() => onUpdateElement(selectedElement.id, { textAlign: align.id as any })}
                            className={`flex-1 flex justify-center py-1 rounded transition-colors ${
                              activeElementStyles.textAlign === align.id
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-bold'
                                : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                            title={`Align ${align.id}`}
                          >
                            {align.icon}
                          </button>
                        ))}
                      </div>

                      {/* Style styles */}
                      <div className="flex gap-2 pt-1.5">
                        <button
                          onClick={() => onUpdateElement(selectedElement.id, { 
                            fontStyle: activeElementStyles.fontStyle === 'italic' ? 'normal' : 'italic' 
                          })}
                          className={`flex-1 py-1.5 border rounded-lg text-xs font-semibold ${
                            activeElementStyles.fontStyle === 'italic'
                              ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/20 dark:text-amber-400'
                              : 'bg-slate-50 hover:bg-slate-150 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                          }`}
                        >
                          Italics
                        </button>
                        <button
                          onClick={() => onUpdateElement(selectedElement.id, { 
                            textDecoration: activeElementStyles.textDecoration === 'underline' ? 'none' : 'underline' 
                          })}
                          className={`flex-1 py-1.5 border rounded-lg text-xs font-semibold ${
                            activeElementStyles.textDecoration === 'underline'
                              ? 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-950/20 dark:text-indigo-400'
                              : 'bg-slate-50 hover:bg-slate-150 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                          }`}
                        >
                          Underline
                        </button>
                      </div>

                      {/* List Style for Text Elements */}
                      {selectedElement.type === 'text' && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                          <span className="text-xs font-semibold text-slate-500 block">List Format</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { id: 'none', lbl: 'Plain Text' },
                              { id: 'unordered', lbl: '• Bulleted' },
                              { id: 'ordered', lbl: '1. Numbered' },
                              { id: 'square', lbl: '▪ Square' },
                              { id: 'checkmark', lbl: '✓ Checkmark' },
                            ].map(listFormat => (
                              <button
                                key={listFormat.id}
                                onClick={() => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { listType: listFormat.id as any })}
                                className={`py-1.5 px-2 text-[11px] font-semibold border rounded-lg transition-all text-left flex items-center justify-between cursor-pointer ${
                                  (selectedElement.listType || 'none') === listFormat.id
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold'
                                    : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-355 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                              >
                                <span>{listFormat.lbl}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Read More Settings for Text Elements */}
                      {selectedElement.type === 'text' && (
                        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 block">Enable Læs mere (Read More)</span>
                            <button
                              type="button"
                              onClick={() => {
                                const nextVal = !selectedElement.enableReadMore;
                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { enableReadMore: nextVal });
                              }}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer border-none flex items-center ${
                                selectedElement.enableReadMore ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full bg-white shadow-sm block" />
                            </button>
                          </div>

                          {selectedElement.enableReadMore && (
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                                <span>Collapsed Height Limit</span>
                                <span>{selectedElement.readMoreHeight || '200px'}</span>
                              </div>
                              <input
                                type="range"
                                min="100"
                                max="800"
                                step="20"
                                value={parseInt(selectedElement.readMoreHeight || '200') || 200}
                                onChange={(e) => {
                                  const nextHeight = `${e.target.value}px`;
                                  onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { readMoreHeight: nextHeight });
                                }}
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Color and Styles */}
                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4" id="inspector-colors-borders">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Coloring & Borders</h5>

                  {/* Text Color Input */}
                  {(selectedElement.type === 'text' || selectedElement.type === 'button' || selectedElement.type === 'search-box' || selectedElement.type === 'image' || selectedElement.type === 'image-banner' || selectedElement.type === 'video') && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Text Color (Hex)</span>
                        <span className="font-mono text-indigo-500 font-semibold">{activeElementStyles.color || '#000'}</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={activeElementStyles.color?.startsWith('#') ? activeElementStyles.color : '#000000'}
                          onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                          className="w-10 h-8 rounded-md border border-slate-200 cursor-pointer p-0.5 bg-slate-50"
                        />
                        <input
                          type="text"
                          value={activeElementStyles.color || '#000000'}
                          onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                          className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 uppercase"
                        />
                      </div>
                    </div>
                  )}

                  {/* Button / Image Background Color & borders & hover spacing */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Background Color</span>
                      <span className="font-mono text-indigo-500 text-[11px]">{activeElementStyles.backgroundColor || 'transparent'}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={activeElementStyles.backgroundColor?.startsWith('#') ? activeElementStyles.backgroundColor : '#ffffff'}
                        onChange={(e) => onUpdateElement(selectedElement.id, { backgroundColor: e.target.value })}
                        className="w-10 h-8 rounded-md border border-slate-200 cursor-pointer p-0.5 bg-slate-50"
                      />
                      <input
                        type="text"
                        value={activeElementStyles.backgroundColor || ''}
                        onChange={(e) => onUpdateElement(selectedElement.id, { backgroundColor: e.target.value })}
                        className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                        placeholder="hex or transparent"
                      />
                    </div>
                  </div>

                  {/* Image banner overlays configuration */}
                  {(selectedElement.type === 'image' || selectedElement.type === 'image-banner') && (
                    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4 animate-in fade-in duration-200">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Image Overlays (Newsletter Banner)</h5>
                      
                      {/* Title Overlay */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 block">Overlay Title</label>
                        <input
                          type="text"
                          value={selectedElement.overlayTitle || ''}
                          onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlayTitle: e.target.value })}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="e.g. Modern Architecture"
                        />
                      </div>

                      {/* Description Overlay */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 block">Overlay Description</label>
                        <textarea
                          value={selectedElement.overlaySubtext || ''}
                          onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlaySubtext: e.target.value })}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="e.g. Exploring minimal layout aesthetics..."
                          rows={2}
                        />
                      </div>

                      {/* Position Alignments */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 block">Overlay Positioning</label>
                        <select
                          value={selectedElement.overlayPosition || 'center'}
                          onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlayPosition: e.target.value as any })}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-center">Top Center</option>
                          <option value="top-right">Top Right</option>
                          <option value="center-left">Center Left</option>
                          <option value="center">Center</option>
                          <option value="center-right">Center Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-center">Bottom Center</option>
                          <option value="bottom-right">Bottom Right</option>
                        </select>
                      </div>

                      {/* Button toggle & values */}
                      <div className="space-y-2 pt-1 border-t border-slate-100/50 dark:border-slate-800/20">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="showOverlayButton"
                            checked={selectedElement.showOverlayButton || false}
                            onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { showOverlayButton: e.target.checked })}
                            className="rounded border-slate-350 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                          />
                          <label htmlFor="showOverlayButton" className="text-xs font-semibold text-slate-500 cursor-pointer select-none">Show Action Button</label>
                        </div>
                        {selectedElement.showOverlayButton && (
                          <div className="space-y-2 pl-3 border-l-2 border-indigo-500/30">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Button Text</label>
                              <input
                                type="text"
                                value={selectedElement.overlayButtonText || ''}
                                onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlayButtonText: e.target.value })}
                                className="w-full text-[11px] px-2 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100"
                                placeholder="Click Here"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Button Link</label>
                              <input
                                type="text"
                                value={selectedElement.overlayButtonLink || ''}
                                onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlayButtonLink: e.target.value })}
                                className="w-full text-[11px] px-2 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100"
                                placeholder="#section or URL"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Search / Newsletter signup Box */}
                      <div className="space-y-2 pt-1 border-t border-slate-100/50 dark:border-slate-800/20">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="showOverlaySearch"
                            checked={selectedElement.showOverlaySearch || false}
                            onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { showOverlaySearch: e.target.checked })}
                            className="rounded border-slate-350 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                          />
                          <label htmlFor="showOverlaySearch" className="text-xs font-semibold text-slate-500 cursor-pointer select-none">Show Search/Newsletter Input</label>
                        </div>
                        {selectedElement.showOverlaySearch && (
                          <div className="space-y-2 pl-3 border-l-2 border-indigo-500/30">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Input Placeholder</label>
                              <input
                                type="text"
                                value={selectedElement.overlaySearchPlaceholder || ''}
                                onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlaySearchPlaceholder: e.target.value })}
                                className="w-full text-[11px] px-2 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100"
                                placeholder="Enter email..."
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Button Label</label>
                              <input
                                type="text"
                                value={selectedElement.overlaySearchButtonText || ''}
                                onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlaySearchButtonText: e.target.value })}
                                className="w-full text-[11px] px-2 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100"
                                placeholder="Subscribe"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Dimming Background overlay tint */}
                      <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                        <label className="text-[11px] font-semibold text-slate-500 block">Overlay Background Tint & Dimming</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={selectedElement.overlayBgColor || '#000000'}
                            onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlayBgColor: e.target.value })}
                            className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5 bg-slate-50"
                          />
                          <input
                            type="text"
                            value={selectedElement.overlayBgColor || '#000000'}
                            onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlayBgColor: e.target.value })}
                            className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 uppercase"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">Tint Opacity</span>
                            <span className="font-mono text-indigo-500 font-bold">{selectedElement.overlayBgOpacity !== undefined ? selectedElement.overlayBgOpacity : 30}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={selectedElement.overlayBgOpacity !== undefined ? selectedElement.overlayBgOpacity : 30}
                            onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlayBgOpacity: parseInt(e.target.value) })}
                            className="w-full accent-indigo-600 cursor-pointer h-1 bg-slate-150 dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      {/* Height Slider for Banners */}
                      {(selectedElement.type === 'image-banner' || selectedElement.type === 'image') && (
                        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-semibold">Banner Section Height</span>
                            <span className="font-mono text-indigo-500 font-bold">{activeElementStyles.height || 'Auto'}</span>
                          </div>
                          <input
                            type="range"
                            min="150"
                            max="1000"
                            step="10"
                            value={parseInt(activeElementStyles.height || '550') || 550}
                            onChange={(e) => onUpdateElement(selectedElement.id, { height: `${e.target.value}px` })}
                            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-150 dark:bg-slate-800 rounded-lg"
                          />
                          <p className="text-[10px] text-slate-400">Drag to adjust the exact pixel height of the banner element container.</p>
                        </div>
                      )}

                      {/* Multiple Overlay Elements Section */}
                      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Multiple Overlay Elements</label>
                        
                        {/* List of current overlays */}
                        <div className="space-y-2">
                          {(selectedElement.overlays || []).map((rawItem, idx) => {
                            const item = { ...rawItem, styles: getResolvedOverlayStyles(rawItem) };
                            return (
                              <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-850 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                                    #{idx + 1}: {item.type}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {/* Move Up */}
                                    <button
                                      disabled={idx === 0}
                                      onClick={() => {
                                        const nextOverlays = [...(selectedElement.overlays || [])];
                                        const temp = nextOverlays[idx];
                                        nextOverlays[idx] = nextOverlays[idx - 1];
                                        nextOverlays[idx - 1] = temp;
                                        onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                      }}
                                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded disabled:opacity-30 text-slate-500 cursor-pointer border-none bg-transparent"
                                      title="Move Up"
                                    >
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    {/* Move Down */}
                                    <button
                                      disabled={idx === (selectedElement.overlays || []).length - 1}
                                      onClick={() => {
                                        const nextOverlays = [...(selectedElement.overlays || [])];
                                        const temp = nextOverlays[idx];
                                        nextOverlays[idx] = nextOverlays[idx + 1];
                                        nextOverlays[idx + 1] = temp;
                                        onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                      }}
                                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded disabled:opacity-30 text-slate-500 cursor-pointer border-none bg-transparent"
                                      title="Move Down"
                                    >
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                    {/* Delete */}
                                    <button
                                      onClick={() => {
                                        const nextOverlays = (selectedElement.overlays || []).filter(o => o.id !== item.id);
                                        onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                      }}
                                      className="p-1 hover:bg-rose-105 dark:hover:bg-rose-950/40 rounded text-rose-500 cursor-pointer border-none bg-transparent"
                                      title="Delete Overlay"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                 {/* Content input */}
                                 <div className="space-y-1">
                                   <label className="text-[10px] text-slate-400 block font-semibold">
                                     {item.type === 'text' ? 'Content Text' : item.type === 'button' ? 'Button Label' : item.type === 'logo' ? 'Logo Text' : item.type === 'dropdown-menu' ? 'Menu Items (comma-separated)' : 'Input Placeholder'}
                                   </label>
                                   {item.type === 'button' || item.type === 'text' ? (
                                     <textarea
                                       value={item.content}
                                       onChange={(e) => {
                                         const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, content: e.target.value } : o);
                                         onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                       }}
                                       className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans"
                                       placeholder="Enter content..."
                                       rows={2}
                                     />
                                   ) : (
                                     <input
                                       type="text"
                                       value={item.content}
                                       onChange={(e) => {
                                         const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, content: e.target.value } : o);
                                         onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                       }}
                                       className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                                       placeholder="Enter content..."
                                     />
                                   )}
                                 </div>

                                  {/* Dropdown Options Manager */}
                                  {item.type === 'dropdown-menu' && (
                                    <>
                                      <DropdownOptionsEditor 
                                        item={item} 
                                        selectedElement={selectedElement} 
                                        onUpdateElement={onUpdateElement} 
                                        pages={pages}
                                      />
                                      
                                      <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded border border-slate-100 dark:border-slate-800 mt-3">
                                        <div className="flex justify-between text-[11px] font-bold text-slate-550 uppercase tracking-wider">
                                          <span>Dropdown Styling</span>
                                          <span className="font-mono text-indigo-500 font-bold">{(item.settings?.dropdownFontSize || 12)}px</span>
                                        </div>
                                        
                                        {/* Font Size */}
                                        <div className="flex gap-2 items-center">
                                          <input
                                            type="range"
                                            min="8"
                                            max="32"
                                            value={item.settings?.dropdownFontSize || 12}
                                            onChange={(e) => {
                                              const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), dropdownFontSize: parseInt(e.target.value) } } : o);
                                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                            }}
                                            className="flex-1 accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                                          />
                                        </div>

                                        {/* Font Style & Weight */}
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => {
                                              const currentWeight = item.settings?.dropdownFontWeight || 'bold';
                                              const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), dropdownFontWeight: currentWeight === 'bold' ? 'normal' : 'bold' } } : o);
                                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                            }}
                                            className={`flex-1 py-1 text-[10px] font-bold uppercase rounded border ${item.settings?.dropdownFontWeight === 'bold' || !item.settings?.dropdownFontWeight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                          >
                                            Bold
                                          </button>
                                          <button
                                            onClick={() => {
                                              const currentStyle = item.settings?.dropdownFontStyle || 'normal';
                                              const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), dropdownFontStyle: currentStyle === 'italic' ? 'normal' : 'italic' } } : o);
                                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                            }}
                                            className={`flex-1 py-1 text-[10px] italic font-bold uppercase rounded border ${item.settings?.dropdownFontStyle === 'italic' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                          >
                                            Italic
                                          </button>
                                        </div>

                                        {/* Colors */}
                                        <div className="flex gap-2">
                                          <div className="flex-1 space-y-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Text Color</span>
                                            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-1.5 py-1">
                                              <input
                                                type="color"
                                                value={item.settings?.dropdownTextColor || '#1e293b'}
                                                onChange={(e) => {
                                                  const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), dropdownTextColor: e.target.value } } : o);
                                                  onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                                }}
                                                className="w-4 h-4 rounded-sm cursor-pointer border-0 p-0"
                                              />
                                              <span className="text-[10px] font-mono text-slate-500">{item.settings?.dropdownTextColor || '#1e293b'}</span>
                                            </div>
                                          </div>
                                          <div className="flex-1 space-y-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Active Color</span>
                                            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-1.5 py-1">
                                              <input
                                                type="color"
                                                value={item.settings?.dropdownActiveColor || '#4f46e5'}
                                                onChange={(e) => {
                                                  const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), dropdownActiveColor: e.target.value } } : o);
                                                  onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                                }}
                                                className="w-4 h-4 rounded-sm cursor-pointer border-0 p-0"
                                              />
                                              <span className="text-[10px] font-mono text-slate-500">{item.settings?.dropdownActiveColor || '#4f46e5'}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Dropdown Contact Settings */}
                                      <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded border border-slate-100 dark:border-slate-800 mt-3">
                                        <div className="text-[11px] font-bold text-slate-550 uppercase tracking-wider mb-2">
                                          Dropdown Contact Section
                                        </div>

                                        <div className="space-y-2">
                                          <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase">Title</label>
                                            <input
                                              type="text"
                                              value={item.settings?.contactTitle ?? 'Kontakt'}
                                              onChange={(e) => {
                                                const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), contactTitle: e.target.value } } : o);
                                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                              }}
                                              className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                                            />
                                          </div>
                                          <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase">Text / Address</label>
                                            <textarea
                                              value={item.settings?.contactText ?? 'Kulvej 10, 2 TV\n2450 København SV\nDenmark'}
                                              onChange={(e) => {
                                                const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), contactText: e.target.value } } : o);
                                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                              }}
                                              rows={3}
                                              className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-sans"
                                            />
                                          </div>
                                          <div className="flex gap-2">
                                            <div className="flex-1">
                                              <label className="text-[9px] font-bold text-slate-400 uppercase">Email</label>
                                              <input
                                                type="text"
                                                value={item.settings?.contactEmail ?? 'info@mmlaasesmed.dk'}
                                                onChange={(e) => {
                                                  const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), contactEmail: e.target.value } } : o);
                                                  onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                                }}
                                                className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                                              />
                                            </div>
                                            <div className="flex-1">
                                              <label className="text-[9px] font-bold text-slate-400 uppercase">Phone</label>
                                              <input
                                                type="text"
                                                value={item.settings?.contactPhone ?? '+45 31 11 11 15'}
                                                onChange={(e) => {
                                                  const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), contactPhone: e.target.value } } : o);
                                                  onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                                }}
                                                className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                                              />
                                            </div>
                                          </div>
                                          <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase">Button Text</label>
                                            <input
                                              type="text"
                                              value={item.settings?.contactBtnText ?? 'Book Nu'}
                                              onChange={(e) => {
                                                const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), contactBtnText: e.target.value } } : o);
                                                onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                              }}
                                              className="w-full text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                                            />
                                          </div>
                                          
                                          {/* Contact Styling */}
                                          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Text Color</label>
                                            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-1.5 py-1 w-1/2">
                                              <input
                                                type="color"
                                                value={item.settings?.contactTextColor || '#0f172a'}
                                                onChange={(e) => {
                                                  const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), contactTextColor: e.target.value } } : o);
                                                  onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                                }}
                                                className="w-4 h-4 rounded-sm cursor-pointer border-0 p-0"
                                              />
                                              <span className="text-[10px] font-mono text-slate-500">{item.settings?.contactTextColor || '#0f172a'}</span>
                                            </div>
                                          </div>
                                          
                                          <div className="flex gap-2">
                                            <div className="flex-1">
                                              <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Title Size ({(item.settings?.contactTitleFontSize || 14)}px)</label>
                                              <input
                                                type="range"
                                                min="10"
                                                max="32"
                                                value={item.settings?.contactTitleFontSize || 14}
                                                onChange={(e) => {
                                                  const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), contactTitleFontSize: parseInt(e.target.value) } } : o);
                                                  onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                                }}
                                                className="w-full accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200"
                                              />
                                            </div>
                                            <div className="flex-1">
                                              <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Text Size ({(item.settings?.contactTextFontSize || 10)}px)</label>
                                              <input
                                                type="range"
                                                min="8"
                                                max="24"
                                                value={item.settings?.contactTextFontSize || 10}
                                                onChange={(e) => {
                                                  const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, settings: { ...(o.settings || {}), contactTextFontSize: parseInt(e.target.value) } } : o);
                                                  onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                                }}
                                                className="w-full accent-indigo-650 cursor-pointer h-1 rounded-sm bg-slate-200"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                 {/* Logo Image Settings */}
                                 {item.type === 'logo' && (
                                   <div className="space-y-1.5 pt-1.5">
                                     <label className="text-[10px] text-slate-400 block font-semibold">Logo Image URL (Optional)</label>
                                     <div className="flex gap-2">
                                       <input
                                         type="text"
                                         value={item.src || ''}
                                         onChange={(e) => {
                                           const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, src: e.target.value || undefined } : o);
                                           onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                         }}
                                         className="flex-1 text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                                         placeholder="Paste logo image URL..."
                                       />
                                       <button
                                         onClick={() => {
                                           onChangeImageClick && onChangeImageClick(`${selectedElement.id}-overlay-${item.id}`);
                                         }}
                                         className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-semibold cursor-pointer"
                                         title="Choose photo"
                                       >
                                         Choose
                                       </button>
                                     </div>
                                   </div>
                                 )}

                                {/* Link input for button / button text for search-box */}
                                {item.type === 'button' && (
                                  <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 block font-semibold">Button Link</label>
                                    <input
                                      type="text"
                                      value={item.link || ''}
                                      onChange={(e) => {
                                        const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, link: e.target.value } : o);
                                        onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                      }}
                                      className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                                      placeholder="https://... or #section"
                                    />
                                  </div>
                                )}
                                {item.type === 'search-box' && (
                                  <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 block font-semibold">Button Label</label>
                                    <input
                                      type="text"
                                      value={item.link || ''}
                                      onChange={(e) => {
                                        const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, link: e.target.value } : o);
                                        onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                      }}
                                      className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                                      placeholder="Subscribe"
                                    />
                                  </div>
                                )}

                                {/* Style configurations */}
                                <div className="space-y-2 pt-1 border-t border-slate-150 dark:border-slate-800">
                                   {/* Font Family Selector */}
                                   <div className="space-y-1">
                                     <label className="text-[10px] text-slate-400 block font-semibold">Skrifttype / Font</label>
                                     <select
                                       value={item.styles.fontFamily || ''}
                                       onChange={(e) => updateOverlayStyles(item.id, { fontFamily: e.target.value })}
                                       className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                                     >
                                       <option value="">Standard (System Sans)</option>
                                       <option value="'Poppins', sans-serif">Poppins (Modern Geometric Sans)</option>
                                       <option value="'Inter', sans-serif">Inter (Sleek Modern Sans)</option>
                                       <option value="'Outfit', sans-serif">Outfit (Elegant Geometric)</option>
                                       <option value="'Playfair Display', serif">Playfair Display (Premium Serif)</option>
                                       <option value="'Cormorant Garamond', serif">Cormorant Garamond (Classic Luxe Serif)</option>
                                       <option value="'Space Grotesk', sans-serif">Space Grotesk (Edgy Display)</option>
                                       <option value="'Fira Code', monospace">Fira Code (Developer Mono)</option>
                                     </select>
                                   </div>
                                   
                                   {/* Font Size Selector */}
                                   <div className="space-y-1">
                                     <div className="flex justify-between text-[10px]">
                                       <span className="text-slate-400 font-semibold">Font size</span>
                                       <span className="font-mono text-indigo-500 font-bold">{item.styles.fontSize || '16px'}</span>
                                     </div>
                                     <div className="flex gap-2 items-center">
                                       <input
                                         type="range"
                                         min="4"
                                         max="80"
                                         value={parseInt(item.styles.fontSize || '16') || 16}
                                         onChange={(e) => {
                                            updateOverlayStyles(item.id, { fontSize: `${e.target.value}px` });
                                          }}
                                         className="flex-1 accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                                       />
                                       <input
                                         type="text"
                                         value={item.styles.fontSize || ''}
                                         onChange={(e) => {
                                           updateOverlayStyles(item.id, { fontSize: e.target.value || undefined });
                                         }}
                                         className="w-12 text-[10px] px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-sans text-center text-slate-800 dark:text-slate-200"
                                         placeholder="16px"
                                       />
                                     </div>
                                   </div>

                                   {/* Custom Margins for overlay items */}
                                   <div className="space-y-1 pt-1">
                                     <span className="text-[10px] text-slate-400 font-semibold block">Custom Margins</span>
                                     <div className="grid grid-cols-4 gap-1">
                                       <div>
                                         <label className="text-[8px] text-slate-500 block mb-0.5">Top</label>
                                         <input
                                           type="text"
                                           value={item.styles.marginTop || ''}
                                           onChange={(e) => {
                                             updateOverlayStyles(item.id, { marginTop: e.target.value || undefined });
                                           }}
                                           className="w-full text-[9px] px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded font-sans text-center text-slate-800 dark:text-slate-200"
                                           placeholder="0px"
                                         />
                                       </div>
                                       <div>
                                         <label className="text-[8px] text-slate-500 block mb-0.5">Bottom</label>
                                         <input
                                           type="text"
                                           value={item.styles.marginBottom || ''}
                                           onChange={(e) => {
                                             updateOverlayStyles(item.id, { marginBottom: e.target.value || undefined });
                                           }}
                                           className="w-full text-[9px] px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded font-sans text-center text-slate-800 dark:text-slate-200"
                                           placeholder="0px"
                                         />
                                       </div>
                                       <div>
                                         <label className="text-[8px] text-slate-500 block mb-0.5">Left</label>
                                         <input
                                           type="text"
                                           value={item.styles.marginLeft || ''}
                                           onChange={(e) => {
                                             updateOverlayStyles(item.id, { marginLeft: e.target.value || undefined });
                                           }}
                                           className="w-full text-[9px] px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded font-sans text-center text-slate-800 dark:text-slate-200"
                                           placeholder="0px"
                                         />
                                       </div>
                                       <div>
                                         <label className="text-[8px] text-slate-500 block mb-0.5">Right</label>
                                         <input
                                           type="text"
                                           value={item.styles.marginRight || ''}
                                           onChange={(e) => {
                                             updateOverlayStyles(item.id, { marginRight: e.target.value || undefined });
                                           }}
                                           className="w-full text-[9px] px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded font-sans text-center text-slate-800 dark:text-slate-200"
                                           placeholder="0px"
                                         />
                                       </div>
                                     </div>
                                     <div className="space-y-1 mt-1.5">
                                       <div className="flex justify-between text-[9px]">
                                         <span className="text-slate-550 dark:text-slate-400 font-semibold">Margin Bottom Slider</span>
                                         <span className="font-mono text-indigo-500 font-bold">{item.styles.marginBottom || '0px'}</span>
                                       </div>
                                       <input
                                         type="range"
                                         min="0"
                                         max="200"
                                         value={parseInt(item.styles.marginBottom || '0') || 0}
                                         onChange={(e) => {
                                            updateOverlayStyles(item.id, { marginBottom: `${e.target.value}px` });
                                          }}
                                         className="w-full accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                                       />
                                     </div>
                                   </div>

                                  {/* Alignment Selector */}
                                  <div className="space-y-1">
                                    <label className="text-[10px] text-slate-400 block font-semibold">Text Alignment</label>
                                    <div className="grid grid-cols-3 gap-1">
                                      {[
                                        { id: 'left', lbl: 'Left' },
                                        { id: 'center', lbl: 'Center' },
                                        { id: 'right', lbl: 'Right' }
                                      ].map((align) => (
                                        <button
                                          key={align.id}
                                          onClick={() => {
                                            updateOverlayStyles(item.id, { textAlign: align.id as any });
                                          }}
                                          className={`py-0.5 text-[10px] font-semibold border rounded transition-colors ${
                                            (item.styles.textAlign || 'center') === align.id
                                              ? 'bg-indigo-600 text-white border-indigo-600'
                                              : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                                          }`}
                                        >
                                          {align.lbl}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Colors for Text & Buttons */}
                                  <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                      <label className="text-[9px] text-slate-400 block font-semibold">Text Color</label>
                                      <div className="flex gap-1">
                                        <input
                                          type="color"
                                          value={item.styles.color || '#ffffff'}
                                          onChange={(e) => {
                                            updateOverlayStyles(item.id, { color: e.target.value });
                                          }}
                                          className="w-6 h-6 rounded border border-slate-200 dark:border-slate-700 p-0 cursor-pointer"
                                        />
                                        <input
                                          type="text"
                                          value={item.styles.color || ''}
                                          onChange={(e) => {
                                            updateOverlayStyles(item.id, { color: e.target.value });
                                          }}
                                          className="w-full text-[9px] px-1 py-0.5 rounded border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                                          placeholder="#ffffff"
                                        />
                                      </div>
                                    </div>

                                    {/* Overlay Item Visibility Controls */}
                                    <div className="space-y-1.5 pt-1.5 border-t border-slate-150 dark:border-slate-800">
                                      <span className="text-[10px] text-slate-400 font-semibold block">Device Visibility</span>
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => {
                                            const nextVal = item.visibleOnDesktop !== false ? false : true;
                                            const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, visibleOnDesktop: nextVal } : o);
                                            onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                          }}
                                          className={`flex-1 py-1 rounded text-[9px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                                            item.visibleOnDesktop !== false
                                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-300'
                                              : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                                          }`}
                                        >
                                          <Monitor className="w-3 h-3" />
                                          <span>Desktop</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            const nextVal = item.visibleOnTablet !== false ? false : true;
                                            const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, visibleOnTablet: nextVal } : o);
                                            onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                          }}
                                          className={`flex-1 py-1 rounded text-[9px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                                            item.visibleOnTablet !== false
                                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-300'
                                              : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                                          }`}
                                        >
                                          <Tablet className="w-3 h-3" />
                                          <span>Tablet</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            const nextVal = item.visibleOnMobile !== false ? false : true;
                                            const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, visibleOnMobile: nextVal } : o);
                                            onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                          }}
                                          className={`flex-1 py-1 rounded text-[9px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                                            item.visibleOnMobile !== false
                                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-300'
                                              : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                                          }`}
                                        >
                                          <Smartphone className="w-3 h-3" />
                                          <span>Mobile</span>
                                        </button>
                                      </div>
                                      
                                      {item.type === 'logo' && (
                                        <div className="space-y-1.5 pt-1.5">
                                          <label className="text-[10px] text-slate-400 block font-semibold">Logo Click Link / URL</label>
                                          <input
                                            type="text"
                                            value={item.link || ''}
                                            onChange={(e) => {
                                              const nextOverlays = (selectedElement.overlays || []).map(o => o.id === item.id ? { ...o, link: e.target.value } : o);
                                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                                            }}
                                            className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                                            placeholder="e.g. #welcome or index.html"
                                          />
                                        </div>
                                      )}
                                    </div>

                                    {item.type === 'button' && (
                                      <div className="flex-1 space-y-1">
                                        <label className="text-[9px] text-slate-400 block font-semibold">Button BG</label>
                                        <div className="flex gap-1">
                                          <input
                                            type="color"
                                            value={item.styles.backgroundColor || '#ffffff'}
                                            onChange={(e) => {
                                              updateOverlayStyles(item.id, { backgroundColor: e.target.value });
                                            }}
                                            className="w-6 h-6 rounded border border-slate-200 dark:border-slate-700 p-0 cursor-pointer"
                                          />
                                          <input
                                            type="text"
                                            value={item.styles.backgroundColor || ''}
                                            onChange={(e) => {
                                              updateOverlayStyles(item.id, { backgroundColor: e.target.value });
                                            }}
                                            className="w-full text-[9px] px-1 py-0.5 rounded border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                                            placeholder="#ffffff"
                                          />
                                        </div>
                                      </div>
                                    )}
                                    {/* Custom dimensions for overlay items */}
                                    {(item.type === 'button' || item.type === 'search-box' || item.type === 'text') && (
                                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                        <div>
                                          <label className="text-[9px] text-slate-400 block font-semibold mb-0.5">Width</label>
                                          <input
                                            type="text"
                                            value={item.styles.width || ''}
                                            onChange={(e) => {
                                              updateOverlayStyles(item.id, { width: e.target.value || undefined });
                                            }}
                                            className="w-full text-[10px] px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 font-sans"
                                            placeholder="e.g. 200px or 100%"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[9px] text-slate-400 block font-semibold mb-0.5">Height</label>
                                          <input
                                            type="text"
                                            value={item.styles.height || ''}
                                            onChange={(e) => {
                                              updateOverlayStyles(item.id, { height: e.target.value || undefined });
                                            }}
                                            className="w-full text-[10px] px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-800 dark:text-slate-200 font-sans"
                                            placeholder="e.g. 40px"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Custom paddings for overlay button / search-box */}
                                    {(item.type === 'button' || item.type === 'search-box') && (
                                      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/40 mt-1.5">
                                        <div className="space-y-1">
                                          <div className="flex justify-between text-[10px]">
                                            <span className="text-slate-400 font-semibold">Button Vertical Size (Padding)</span>
                                            <span className="font-mono text-indigo-500 font-bold">{item.styles.paddingTop || (item.id === 'locksmith-hero-btn' ? '0.75em' : '0.615em')}</span>
                                          </div>
                                          <div className="flex gap-2 items-center">
                                            <input
                                              type="range"
                                              min="0.1"
                                              max="3.0"
                                              step="0.05"
                                              value={(() => {
                                                const val = item.styles.paddingTop;
                                                if (!val) return item.id === 'locksmith-hero-btn' ? 0.75 : 0.615;
                                                const floatVal = parseFloat(val);
                                                if (val.includes('px')) return Math.round((floatVal / 16) * 100) / 100;
                                                return floatVal || 0.615;
                                              })()}
                                              onChange={(e) => {
                                                updateOverlayStyles(item.id, { paddingTop: `${e.target.value}em`, paddingBottom: `${e.target.value}em` });
                                              }}
                                              className="flex-1 accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                                            />
                                            <input
                                              type="text"
                                              value={item.styles.paddingTop || ''}
                                              onChange={(e) => {
                                                updateOverlayStyles(item.id, { paddingTop: e.target.value || undefined, paddingBottom: e.target.value || undefined });
                                              }}
                                              className="w-12 text-[10px] px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-sans text-center text-slate-800 dark:text-slate-200"
                                              placeholder="0.615em"
                                            />
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="flex justify-between text-[10px]">
                                            <span className="text-slate-400 font-semibold">Button Horizontal Size (Padding)</span>
                                            <span className="font-mono text-indigo-500 font-bold">{item.styles.paddingLeft || (item.id === 'locksmith-hero-btn' ? '2.5em' : '1.23em')}</span>
                                          </div>
                                          <div className="flex gap-2 items-center">
                                            <input
                                              type="range"
                                              min="0.5"
                                              max="5.0"
                                              step="0.1"
                                              value={(() => {
                                                const val = item.styles.paddingLeft;
                                                if (!val) return item.id === 'locksmith-hero-btn' ? 2.5 : 1.23;
                                                const floatVal = parseFloat(val);
                                                if (val.includes('px')) return Math.round((floatVal / 16) * 100) / 100;
                                                return floatVal || 1.23;
                                              })()}
                                              onChange={(e) => {
                                                updateOverlayStyles(item.id, { paddingLeft: `${e.target.value}em`, paddingRight: `${e.target.value}em` });
                                              }}
                                              className="flex-1 accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-200 dark:bg-slate-800"
                                            />
                                            <input
                                              type="text"
                                              value={item.styles.paddingLeft || ''}
                                              onChange={(e) => {
                                                updateOverlayStyles(item.id, { paddingLeft: e.target.value || undefined, paddingRight: e.target.value || undefined });
                                              }}
                                              className="w-12 text-[10px] px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-sans text-center text-slate-800 dark:text-slate-200"
                                              placeholder="1.23em"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Add overlay buttons */}
                        <div className="grid grid-cols-3 gap-1 pt-1">
                          <button
                            onClick={() => {
                              const newOverlay: OverlayItem = {
                                id: `ovl-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                                type: 'text',
                                content: 'New Overlay Text',
                                styles: { fontSize: '18px', color: '#ffffff', marginBottom: '8px', fontWeight: '500', textAlign: 'center' }
                              };
                              const nextOverlays = [...(selectedElement.overlays || []), newOverlay];
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                            }}
                            className="py-1 px-1 text-[10px] font-bold border border-slate-200 hover:bg-slate-100 dark:border-slate-850 dark:hover:bg-slate-900 rounded-lg text-slate-650 dark:text-slate-350 text-center cursor-pointer"
                          >
                            + Add Text
                          </button>
                          <button
                            onClick={() => {
                              const newOverlay: OverlayItem = {
                                id: `ovl-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                                type: 'button',
                                content: 'Click Here',
                                link: '#',
                                styles: { fontSize: '13px', color: '#0f172a', backgroundColor: '#ffffff', marginBottom: '8px', textAlign: 'center', paddingTop: '0.615em', paddingBottom: '0.615em', paddingLeft: '1.23em', paddingRight: '1.23em' }
                              };
                              const nextOverlays = [...(selectedElement.overlays || []), newOverlay];
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                            }}
                            className="py-1 px-1 text-[10px] font-bold border border-slate-200 hover:bg-slate-100 dark:border-slate-850 dark:hover:bg-slate-900 rounded-lg text-slate-650 dark:text-slate-350 text-center cursor-pointer"
                          >
                            + Add Button
                          </button>
                          <button
                            onClick={() => {
                              const newOverlay: OverlayItem = {
                                id: `ovl-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                                type: 'search-box',
                                content: 'Enter email...',
                                link: 'Subscribe',
                                styles: { fontSize: '12px', color: '#0f172a', backgroundColor: '#ffffff', marginBottom: '8px' }
                              };
                              const nextOverlays = [...(selectedElement.overlays || []), newOverlay];
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                            }}
                            className="py-1 px-1 text-[10px] font-bold border border-slate-200 hover:bg-slate-100 dark:border-slate-850 dark:hover:bg-slate-900 rounded-lg text-slate-650 dark:text-slate-350 text-center cursor-pointer"
                          >
                            + Add Search
                          </button>
                          <button
                            onClick={() => {
                              const newOverlay: OverlayItem = {
                                id: `ovl-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                                type: 'logo',
                                content: 'MM LÅSESMED',
                                styles: { fontSize: '20px', color: '#ffffff', marginBottom: '8px', fontWeight: '800' }
                              };
                              const nextOverlays = [...(selectedElement.overlays || []), newOverlay];
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                            }}
                            className="py-1 px-1 text-[10px] font-bold border border-slate-200 hover:bg-slate-100 dark:border-slate-850 dark:hover:bg-slate-900 rounded-lg text-slate-650 dark:text-slate-350 text-center cursor-pointer"
                          >
                            + Add Logo
                          </button>
                          <button
                            onClick={() => {
                              const newOverlay: OverlayItem = {
                                id: `ovl-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                                type: 'dropdown-menu',
                                content: 'Erhverv,Privat,Boligforeninger,Karriere,Om os',
                                styles: { fontSize: '13px', color: '#ffffff', marginBottom: '8px', fontWeight: '600' }
                              };
                              const nextOverlays = [...(selectedElement.overlays || []), newOverlay];
                              onUpdateElement(selectedElement.id, {}, undefined, undefined, undefined, { overlays: nextOverlays });
                            }}
                            className="py-1 px-1 text-[10px] font-bold border border-slate-200 hover:bg-slate-100 dark:border-slate-850 dark:hover:bg-slate-900 rounded-lg text-slate-650 dark:text-slate-350 text-center cursor-pointer col-span-2"
                          >
                            + Add Dropdowns
                          </button>
                        </div>
                      </div>

                                          </div>
                  )}

                  {/* Corner Radius (Rounded Corners) */}
                  {(selectedElement.type === 'button' || selectedElement.type === 'image' || selectedElement.type === 'image-banner' || selectedElement.type === 'video') && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Corner Roundedness</span>
                        <span className="font-mono text-indigo-500 text-xs">{activeElementStyles.borderRadius || '8px'}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { val: '0px', lbl: 'None' },
                          { val: '6px', lbl: 'Soft' },
                          { val: '14px', lbl: 'Round' },
                          { val: '9999px', lbl: 'Oval' },
                        ].map(radius => (
                          <button
                            key={radius.val}
                            onClick={() => onUpdateElement(selectedElement.id, { borderRadius: radius.val })}
                            className={`py-1 text-[10px] font-semibold border rounded transition-colors ${
                              activeElementStyles.borderRadius === radius.val
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {radius.lbl}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Element Custom Dimensions & Spacing */}
                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-slate-500 block">Custom Dimensions</span>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Custom Width</label>
                          <input
                            type="text"
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={activeElementStyles.width || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { width: e.target.value || undefined })}
                            placeholder="e.g. 250px or 100%"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Custom Height</label>
                          <input
                            type="text"
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={activeElementStyles.height || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { height: e.target.value || undefined })}
                            placeholder="e.g. 50px or 350px"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-1 border-t border-slate-100/50 dark:border-slate-800/30">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Custom Paddings</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">Top</label>
                          <input
                            type="text"
                            className="w-full text-[11px] px-1.5 py-1 rounded border border-slate-205 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                            value={activeElementStyles.paddingTop || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { paddingTop: e.target.value || undefined })}
                            placeholder="0px"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">Bottom</label>
                          <input
                            type="text"
                            className="w-full text-[11px] px-1.5 py-1 rounded border border-slate-205 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                            value={activeElementStyles.paddingBottom || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { paddingBottom: e.target.value || undefined })}
                            placeholder="0px"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">Left</label>
                          <input
                            type="text"
                            className="w-full text-[11px] px-1.5 py-1 rounded border border-slate-205 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                            value={activeElementStyles.paddingLeft || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { paddingLeft: e.target.value || undefined })}
                            placeholder="0px"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">Right</label>
                          <input
                            type="text"
                            className="w-full text-[11px] px-1.5 py-1 rounded border border-slate-205 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                            value={activeElementStyles.paddingRight || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { paddingRight: e.target.value || undefined })}
                            placeholder="0px"
                          />
                        </div>
                      </div>
                      
                      {selectedElement.type === 'button' && (
                        <div className="space-y-3 pt-2.5 border-t border-slate-150 dark:border-slate-800/40 mt-2">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-slate-500 font-semibold">Button Vertical Size (Padding)</span>
                              <span className="font-mono text-indigo-500 font-bold">{activeElementStyles.paddingTop || '0.66em'}</span>
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="3.0"
                              step="0.05"
                              value={(() => {
                                const val = activeElementStyles.paddingTop;
                                if (!val) return 0.66;
                                const floatVal = parseFloat(val);
                                if (val.includes('px')) return Math.round((floatVal / 16) * 100) / 100;
                                return floatVal || 0.66;
                              })()}
                              onChange={(e) => {
                                onUpdateElement(selectedElement.id, { paddingTop: `${e.target.value}em`, paddingBottom: `${e.target.value}em` });
                              }}
                              className="w-full accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-100 dark:bg-slate-800"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-slate-500 font-semibold">Button Horizontal Size (Padding)</span>
                              <span className="font-mono text-indigo-500 font-bold">{activeElementStyles.paddingLeft || '1.46em'}</span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="5.0"
                              step="0.1"
                              value={(() => {
                                const val = activeElementStyles.paddingLeft;
                                if (!val) return 1.46;
                                const floatVal = parseFloat(val);
                                if (val.includes('px')) return Math.round((floatVal / 16) * 100) / 100;
                                return floatVal || 1.46;
                              })()}
                              onChange={(e) => {
                                onUpdateElement(selectedElement.id, { paddingLeft: `${e.target.value}em`, paddingRight: `${e.target.value}em` });
                              }}
                              className="w-full accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-100 dark:bg-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-1 border-t border-slate-100/50 dark:border-slate-800/30">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Custom Margins</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">Top</label>
                          <input
                            type="text"
                            className="w-full text-[11px] px-1.5 py-1 rounded border border-slate-205 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                            value={activeElementStyles.marginTop || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { marginTop: e.target.value || undefined })}
                            placeholder="0px"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">Bottom</label>
                          <input
                            type="text"
                            className="w-full text-[11px] px-1.5 py-1 rounded border border-slate-205 bg-slate-50 dark:bg-slate-955 text-slate-800 dark:text-slate-100 focus:outline-none"
                            value={activeElementStyles.marginBottom || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { marginBottom: e.target.value || undefined })}
                            placeholder="0px"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">Left</label>
                          <input
                            type="text"
                            className="w-full text-[11px] px-1.5 py-1 rounded border border-slate-205 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                            value={activeElementStyles.marginLeft || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { marginLeft: e.target.value || undefined })}
                            placeholder="0px"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">Right</label>
                          <input
                            type="text"
                            className="w-full text-[11px] px-1.5 py-1 rounded border border-slate-205 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                            value={activeElementStyles.marginRight || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { marginRight: e.target.value || undefined })}
                            placeholder="0px"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 mt-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 font-semibold">Margin Bottom Slider</span>
                          <span className="font-mono text-indigo-500 font-semibold">{activeElementStyles.marginBottom || '0px'}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={parseInt(activeElementStyles.marginBottom || '0') || 0}
                          onChange={(e) => onUpdateElement(selectedElement.id, { marginBottom: `${e.target.value}px` })}
                          className="w-full accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-105 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Element Video Settings */}
                  {selectedElement.type === 'video' && (
                    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-500 block">Video Source (YouTube / Vimeo / MP4 File)</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={selectedElement.src || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, e.target.value || undefined)}
                            className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            placeholder="YouTube, Vimeo URL, or MP4..."
                          />
                          <button
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "video/mp4,video/webm,video/ogg,video/*";
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  if (file.size > 100 * 1024 * 1024) {
                                    alert("Videofilen er for stor (max 100MB). Vælg venligst en mindre fil eller brug et YouTube link.");
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = (evt) => {
                                    if (evt.target?.result) {
                                      onUpdateElement(selectedElement.id, {}, undefined, undefined, evt.target.result as string);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              };
                              input.click();
                            }}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1 shrink-0"
                            title="Upload MP4 videofil fra din computer"
                          >
                            Upload MP4
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                          Indtast et YouTube eller Vimeo link, eller klik 'Upload MP4' for at vælge en videofil fra din computer.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Element Image Settings */}
                  {(selectedElement.type === 'image' || selectedElement.type === 'image-banner') && (
                    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-500 block">Image Source Settings</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={selectedElement.src || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, undefined, e.target.value || undefined)}
                            className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                            placeholder="Paste image URL..."
                          />
                          <button
                            onClick={() => onChangeImageClick && onChangeImageClick(selectedElement.id)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 cursor-pointer"
                            title="Upload or choose photo"
                          >
                            Choose
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 bg-indigo-50/50 dark:bg-indigo-900/10 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                        <label className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-bold uppercase tracking-wider">Image Link URL</label>
                        <div className="flex items-center gap-2">
                          <Link className="w-4 h-4 text-indigo-500" />
                          <input
                            type="text"
                            value={selectedElement.link || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, {}, undefined, e.target.value)}
                            className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="#section-id or https://..."
                          />
                        </div>
                        <p className="text-[9px] text-slate-400 leading-tight">Gør billedet eller ikonet klikbart og videresend til en anden sektion eller URL.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION LEVEL INSPECTOR */}
            {selectedSection && !selectedElement && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                      Selected: Static Layout Block
                    </span>
                    <button
                      onClick={() => onDeleteSection(selectedSection.id)}
                      className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950 rounded text-rose-600"
                      title="Delete Layout Block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mt-1.5 text-sm">
                    {selectedSection.name}
                  </h4>

                  {/* Section Shifting Order */}
                  <div className="mt-3 flex items-center justify-between border-t border-amber-200/40 dark:border-amber-900/15 pt-2 text-xs">
                    <span className="text-slate-400 text-[11px]">Re-order block flow</span>
                    <div className="flex gap-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200/50 p-0.5">
                      <button
                        onClick={() => onMoveSection(selectedSection.id, 'up')}
                        className="p-1 text-slate-600 hover:text-amber-600 dark:text-slate-300"
                        title="Shift Section Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-[1px] bg-slate-100 dark:bg-slate-700"></span>
                      <button
                        onClick={() => onMoveSection(selectedSection.id, 'down')}
                        className="p-1 text-slate-600 hover:text-amber-600 dark:text-slate-300"
                        title="Shift Section Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section Custom name */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-500">Block Name</span>
                  <input
                    type="text"
                    value={selectedSection.name}
                    onChange={(e) => onUpdateSection(selectedSection.id, { name: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-55 dark:bg-slate-950"
                  />
                </div>

                {/* Footer Logo Type Selector */}
                {selectedSection.name.toLowerCase().includes('foot') && (
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3" id="footer-logo-type-selector">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Footer Logo Type</span>
                    {(() => {
                      const firstCol = selectedSection.columns?.[0];
                      const firstEl = firstCol?.elements?.[0];
                      if (!firstEl) {
                        return <p className="text-[10px] text-slate-400 italic">Tilføj et element i den første kolonne for at skifte logotype.</p>;
                      }
                      
                      const isFontLogo = firstEl.type === 'text';
                      
                      return (
                        <div className="space-y-1.5">
                          <div className="flex gap-1 bg-slate-50 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-205 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => {
                                // Toggle first element type to 'image'
                                const updatedCols = selectedSection.columns.map((col, cIdx) => {
                                  if (cIdx !== 0) return col;
                                  return {
                                    ...col,
                                    elements: col.elements.map((el, eIdx) => {
                                      if (eIdx !== 0) return el;
                                      return {
                                        ...el,
                                        type: 'image' as ElementType,
                                        src: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
                                        content: ''
                                      };
                                    })
                                  };
                                });
                                onUpdateSection(selectedSection.id, { columns: updatedCols });
                              }}
                              className={`flex-1 py-1 rounded-md text-[11px] font-semibold text-center cursor-pointer transition-all ${
                                firstEl.type === 'image'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                              }`}
                            >
                              Image Logo
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                // Toggle first element type to 'text'
                                const updatedCols = selectedSection.columns.map((col, cIdx) => {
                                  if (cIdx !== 0) return col;
                                  return {
                                    ...col,
                                    elements: col.elements.map((el, eIdx) => {
                                      if (eIdx !== 0) return el;
                                      return {
                                        ...el,
                                        type: 'text' as ElementType,
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
<p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Låsesystemer af høj kvalitet lavet af miljøvenlige materialer. Designet til moderne og minimalistiske lejligheder</p>`
                                      };
                                    })
                                  };
                                });
                                onUpdateSection(selectedSection.id, { columns: updatedCols });
                              }}
                              className={`flex-1 py-1 rounded-md text-[11px] font-semibold text-center cursor-pointer transition-all ${
                                firstEl.type === 'text'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-355'
                              }`}
                            >
                              Font (Text) Logo
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal">
                            Switching to <strong>Image Logo</strong> allows uploading a graphic file. Switching to <strong>Font Logo</strong> uses the HTML/text brand layout with dynamic font size controls.
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Section Visibility Controls */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3" id="inspector-section-visibility">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Device Visibility</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const nextVal = selectedSection.visibleOnDesktop !== false ? false : true;
                        onUpdateSection(selectedSection.id, { visibleOnDesktop: nextVal } as any);
                      }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedSection.visibleOnDesktop !== false
                          ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300'
                          : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>

                    <button
                      onClick={() => {
                        const nextVal = selectedSection.visibleOnTablet !== false ? false : true;
                        onUpdateSection(selectedSection.id, { visibleOnTablet: nextVal } as any);
                      }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedSection.visibleOnTablet !== false
                          ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300'
                          : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                      }`}
                    >
                      <Tablet className="w-3.5 h-3.5" />
                      <span>Tablet</span>
                    </button>

                    <button
                      onClick={() => {
                        const nextVal = selectedSection.visibleOnMobile !== false ? false : true;
                        onUpdateSection(selectedSection.id, { visibleOnMobile: nextVal } as any);
                      }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedSection.visibleOnMobile !== false
                          ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300'
                          : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Column Layout Trigger */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4" id="section-columns-toggle">
                  <span className="text-xs font-semibold text-slate-500 block">Column Configuration Grid</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'single-col', lbl: '1 Column' },
                      { id: 'two-col', lbl: '2 Columns' },
                      { id: 'three-col', lbl: '3 Columns' },
                    ].map(lay => (
                      <button
                        key={lay.id}
                        onClick={() => onUpdateSection(selectedSection.id, { layout: lay.id as any })}
                        className={`py-1.5 text-[11px] font-semibold border rounded-lg transition-colors ${
                          selectedSection.layout === lay.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100 text-slate-500'
                        }`}
                      >
                        {lay.lbl}
                      </button>
                    ))}
                  </div>

                  {/* Add/Remove Columns incrementer */}
                  <div className="flex gap-2 pt-1.5">
                    <button
                      onClick={() => {
                        const nextColIndex = selectedSection.columns.length + 1;
                        const newCol = {
                          id: `${selectedSection.id}-col-${nextColIndex}-${Math.random().toString(36).substring(2, 5)}`,
                          width: 'flex-1',
                          elements: []
                        };
                        const updatedCols = [...selectedSection.columns, newCol].map(col => ({
                          ...col,
                          width: 'flex-1'
                        }));
                        onUpdateSection(selectedSection.id, {
                          columns: updatedCols,
                          layout: 'custom'
                        });
                      }}
                      className="flex-1 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-350 rounded-lg text-xs font-semibold text-center cursor-pointer"
                    >
                      + Add Column
                    </button>
                    <button
                      onClick={() => {
                        if (selectedSection.columns.length > 1) {
                          const updatedCols = [...selectedSection.columns];
                          const lastCol = updatedCols.pop()!;
                          const prevColIndex = updatedCols.length - 1;
                          updatedCols[prevColIndex] = {
                            ...updatedCols[prevColIndex],
                            elements: [...updatedCols[prevColIndex].elements, ...lastCol.elements]
                          };
                          const finalCols = updatedCols.map(col => ({
                            ...col,
                            width: 'flex-1'
                          }));
                          onUpdateSection(selectedSection.id, {
                            columns: finalCols,
                            layout: 'custom'
                          });
                        } else {
                          alert('Must have at least 1 column.');
                        }
                      }}
                      className="flex-1 py-1.5 border border-slate-200 dark:border-slate-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold text-center cursor-pointer"
                    >
                      - Remove Column
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">Changing structural columns will rearrange the layout instantly. Custom columns adjust automatically.</p>
                </div>

                {/* Section Padding heights */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <span className="text-xs font-semibold text-slate-500 block">Vertical Gap (Padding Height)</span>
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { id: 'none', lbl: 'None' },
                      { id: 'sm', lbl: 'Slim' },
                      { id: 'md', lbl: 'Medium' },
                      { id: 'lg', lbl: 'Cozy' },
                      { id: 'xl', lbl: 'Spacious' },
                    ].map(pad => (
                      <button
                        key={pad.id}
                        onClick={() => onUpdateSection(selectedSection.id, { paddingY: pad.id as any })}
                        className={`py-1 text-[10px] font-semibold border rounded-md transition-colors ${
                          activeSection.paddingY === pad.id
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100 text-slate-500'
                        }`}
                      >
                        {pad.lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section Layout Width */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <span className="text-xs font-semibold text-slate-500 block">Layout Width</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onUpdateSection(selectedSection.id, { fullWidth: false })}
                      className={`py-1 text-[11px] font-semibold border rounded-md transition-colors ${
                        !activeSection.fullWidth
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100 text-slate-500'
                      }`}
                    >
                      Contained
                    </button>
                    <button
                      onClick={() => onUpdateSection(selectedSection.id, { fullWidth: true })}
                      className={`py-1 text-[11px] font-semibold border rounded-md transition-colors ${
                        activeSection.fullWidth
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100 text-slate-500'
                      }`}
                    >
                      Edge-to-Edge
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">Edge-to-edge layout removes side margins and spans the entire screen width.</p>
                </div>

                {/* Column Width Customization */}
                {activeSection.columns && activeSection.columns.length > 1 && (
                  <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4" id="column-width-inspector">
                    <span className="text-xs font-semibold text-slate-500 block">Kolonnebredder (Column Widths)</span>
                    <p className="text-[10px] text-slate-400 leading-normal mb-2">Juster bredden på hver kolonne (angiv f.eks. 25%, 50%, 300px eller lad stå tom for standard):</p>
                    <div className="space-y-2.5">
                      {activeSection.columns.map((col, idx) => (
                        <div key={col.id} className="space-y-1 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-150 dark:border-slate-850">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-450 uppercase">Kolonne #{idx + 1}</span>
                            <span className="font-mono text-indigo-500">{col.customWidth || col.width || 'standard'}</span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="range"
                              min="10"
                              max="90"
                              step="5"
                              value={parseInt(col.customWidth || '33') || 33}
                              onChange={(e) => {
                                const newWidth = `${e.target.value}%`;
                                const updatedCols = activeSection.columns.map(c => 
                                  c.id === col.id ? { ...c, customWidth: newWidth } : c
                                );
                                onUpdateSection(selectedSection.id, { columns: updatedCols });
                              }}
                              className="flex-1 accent-indigo-600 cursor-pointer h-1"
                            />
                            <input
                              type="text"
                              className="w-20 text-[11px] px-1.5 py-0.5 rounded border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                              value={col.customWidth || ''}
                              onChange={(e) => {
                                const updatedCols = activeSection.columns.map(c => 
                                  c.id === col.id ? { ...c, customWidth: e.target.value || undefined } : c
                                );
                                onUpdateSection(selectedSection.id, { columns: updatedCols });
                              }}
                              placeholder="F.eks. 33%"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section Custom Sizing */}
                <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <span className="text-xs font-semibold text-slate-500 block">Custom Section Sizing</span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Custom Width</label>
                      <input
                        type="text"
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={activeSection.customWidth || ''}
                        onChange={(e) => onUpdateSection(selectedSection.id, { customWidth: e.target.value || undefined })}
                        placeholder="e.g. 100% or 1200px"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Custom Height</label>
                      <input
                        type="text"
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-955 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={activeSection.customHeight || ''}
                        onChange={(e) => onUpdateSection(selectedSection.id, { customHeight: e.target.value || undefined })}
                        placeholder="e.g. 600px"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Min Height</label>
                      <input
                        type="text"
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-955 text-slate-800 dark:text-slate-100 focus:outline-none"
                        value={activeSection.minHeight || ''}
                        onChange={(e) => onUpdateSection(selectedSection.id, { minHeight: e.target.value || undefined })}
                        placeholder="e.g. 400px"
                      />
                    </div>
                    
                    <div className="col-span-2 pt-2 border-t border-slate-150/50 dark:border-slate-800/30">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-slate-400 font-semibold">Section Height (Slider)</span>
                        <span className="font-mono text-indigo-500 font-bold">{activeSection.customHeight || 'Auto'}</span>
                      </div>
                      <input
                        type="range"
                        min="150"
                        max="1200"
                        step="10"
                        value={parseInt(activeSection.customHeight || '600') || 600}
                        onChange={(e) => onUpdateSection(selectedSection.id, { customHeight: `${e.target.value}px` })}
                        className="w-full accent-indigo-600 cursor-pointer h-1 bg-slate-150 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1.5">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Custom Paddings</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5">Top</label>
                        <input
                          type="text"
                          className="w-full text-xs px-2 py-1 rounded-md border border-slate-200 bg-slate-50 dark:bg-slate-950 text-slate-850 focus:outline-hidden"
                          value={activeSection.customPaddingTop || ''}
                          onChange={(e) => onUpdateSection(selectedSection.id, { customPaddingTop: e.target.value || undefined })}
                          placeholder="0px"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5">Bottom</label>
                        <input
                          type="text"
                          className="w-full text-xs px-2 py-1 rounded-md border border-slate-200 bg-slate-50 dark:bg-slate-955 text-slate-850 focus:outline-hidden"
                          value={activeSection.customPaddingBottom || ''}
                          onChange={(e) => onUpdateSection(selectedSection.id, { customPaddingBottom: e.target.value || undefined })}
                          placeholder="0px"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5">Left</label>
                        <input
                          type="text"
                          className="w-full text-xs px-2 py-1 rounded-md border border-slate-200 bg-slate-50 dark:bg-slate-955 text-slate-855 focus:outline-hidden"
                          value={activeSection.customPaddingLeft || ''}
                          onChange={(e) => onUpdateSection(selectedSection.id, { customPaddingLeft: e.target.value || undefined })}
                          placeholder="0px"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5">Right</label>
                        <input
                          type="text"
                          className="w-full text-xs px-2 py-1 rounded-md border border-slate-200 bg-slate-50 dark:bg-slate-955 text-slate-855 focus:outline-hidden"
                          value={activeSection.customPaddingRight || ''}
                          onChange={(e) => onUpdateSection(selectedSection.id, { customPaddingRight: e.target.value || undefined })}
                          placeholder="0px"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1.5">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Custom Margins</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5">Top Margin</label>
                        <input
                          type="text"
                          className="w-full text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 dark:bg-slate-955 text-slate-850 focus:outline-hidden"
                          value={activeSection.customMarginTop || ''}
                          onChange={(e) => onUpdateSection(selectedSection.id, { customMarginTop: e.target.value || undefined })}
                          placeholder="e.g. 10px"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5">Bottom Margin</label>
                        <input
                          type="text"
                          className="w-full text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 dark:bg-slate-955 text-slate-850 focus:outline-hidden"
                          value={activeSection.customMarginBottom || ''}
                          onChange={(e) => onUpdateSection(selectedSection.id, { customMarginBottom: e.target.value || undefined })}
                          placeholder="e.g. 10px"
                        />
                      </div>
                    </div>
                    <div className="space-y-1 mt-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-semibold">Margin Bottom Slider</span>
                        <span className="font-mono text-indigo-500 font-semibold">{activeSection.customMarginBottom || '0px'}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={parseInt(activeSection.customMarginBottom || '0') || 0}
                        onChange={(e) => onUpdateSection(selectedSection.id, { customMarginBottom: `${e.target.value}px` })}
                        className="w-full accent-indigo-600 cursor-pointer h-1 rounded-sm bg-slate-100 dark:bg-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Section background settings */}
                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <span className="text-xs font-semibold text-slate-500 block">Section Background Settings</span>
                  
                  {/* Background Image */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 block font-semibold">Background Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={activeSection.backgroundImage || ''}
                        onChange={(e) => onUpdateSection(selectedSection.id, { backgroundImage: e.target.value || undefined })}
                        className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-slate-850 focus:outline-none"
                        placeholder="Paste image URL..."
                      />
                      <button
                        onClick={() => onChangeImageClick && onChangeImageClick(`section-${selectedSection.id}`)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 cursor-pointer"
                        title="Upload or choose photo"
                      >
                        Choose
                      </button>
                    </div>

                    {activeSection.backgroundImage && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Overlay Tint Dimming</span>
                          <span className="font-mono text-indigo-500 font-bold">{activeSection.bgOpacity !== undefined ? activeSection.bgOpacity : 40}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={activeSection.bgOpacity !== undefined ? activeSection.bgOpacity : 40}
                          onChange={(e) => onUpdateSection(selectedSection.id, { bgOpacity: parseInt(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer h-1 bg-slate-100 dark:bg-slate-800"
                        />
                        <button
                          onClick={() => onUpdateSection(selectedSection.id, { backgroundImage: undefined })}
                          className="text-[10px] text-red-500 hover:underline pt-1 block cursor-pointer border-none bg-transparent"
                        >
                          Remove Background Image
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Solid Background Color */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 block font-semibold">Solid Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={activeSection.backgroundColor?.startsWith('#') ? activeSection.backgroundColor : '#ffffff'}
                        onChange={(e) => onUpdateSection(selectedSection.id, { backgroundColor: e.target.value })}
                        className="w-10 h-8 rounded-md border border-slate-150 dark:border-slate-700 cursor-pointer p-0.5 bg-slate-50 dark:bg-slate-800"
                      />
                      <input
                        type="text"
                        className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none"
                        value={activeSection.backgroundColor}
                        onChange={(e) => onUpdateSection(selectedSection.id, { backgroundColor: e.target.value })}
                        placeholder="#FFF7ED etc"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1.5" id="section-palette-shorties">
                    <button
                      onClick={() => onUpdateSection(selectedSection.id, { backgroundColor: 'transparent' })}
                      className="px-2 py-1 text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200"
                    >
                      Transparent
                    </button>
                    <button
                      onClick={() => onUpdateSection(selectedSection.id, { backgroundColor: '#F8FAFC' })}
                      className="px-2 py-1 text-[9px] font-semibold border border-slate-250 bg-[#F8FAFC] rounded hover:bg-slate-100 text-slate-800"
                    >
                      Nordic Offwhite
                    </button>
                    <button
                      onClick={() => onUpdateSection(selectedSection.id, { backgroundColor: '#FFF7ED' })}
                      className="px-2 py-1 text-[9px] font-semibold border border-amber-200 bg-[#FFF7ED] rounded hover:bg-slate-100 text-amber-900"
                    >
                      Warm Terracotta
                    </button>
                    <button
                      onClick={() => onUpdateSection(selectedSection.id, { backgroundColor: '#FAF6F0' })}
                      className="px-2 py-1 text-[9px] font-semibold border border-[#E6DFD5] bg-[#FAF6F0] rounded hover:bg-slate-100 text-slate-800"
                    >
                      Editorial Cream
                    </button>
                    <button
                      onClick={() => onUpdateSection(selectedSection.id, { backgroundColor: '#0B0F0F' })}
                      className="px-2 py-1 text-[9px] font-semibold bg-[#0B0F0F] rounded text-white hover:bg-black"
                    >
                      Dark Terminal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =============== TAB: ELEMENTS (Add Components Library) =============== */}
        {activeTab === 'elements' && (
          <div className="space-y-6 animate-in fade-in duration-150" id="tab-elements">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Components Library</h4>
              <p className="text-xs text-slate-400">Select components to add to your section columns.</p>
            </div>

            {selectedSection ? (
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-250 dark:border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Target Section</span>
                  <p className="text-xs font-semibold text-slate-850 dark:text-slate-100">{selectedSection.name}</p>
                </div>

                {/* Target Column Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Target Column</label>
                  <select
                    id="element-target-column"
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                  >
                    {selectedSection.columns.map((col, index) => (
                      <option key={col.id} value={col.id}>
                        Column {index + 1} ({col.elements.length} items)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Components Grid */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-500 block">Available Elements</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'text', lbl: 'Text Box', desc: 'Heading or paragraph' },
                      { id: 'button', lbl: 'CTA Button', desc: 'Action redirection' },
                      { id: 'image', lbl: 'Image Block', desc: 'Photo / banner overlays' },
                      { id: 'search-box', lbl: 'Search Bar', desc: 'Inline search input' },
                      { id: 'webshop', lbl: 'Webshop Butik', desc: 'Den fulde webshopbutik' },
                      { id: 'divider', lbl: 'Line Divider', desc: 'Horizontal line' },
                      { id: 'spacer', lbl: 'Gap Spacer', desc: 'Vertical empty gap' },
                    ].map(widget => (
                      <button
                        key={widget.id}
                        onClick={() => {
                          const selectEl = document.getElementById('element-target-column') as HTMLSelectElement;
                          const targetColId = selectEl ? selectEl.value : selectedSection.columns[0]?.id;
                          if (targetColId) {
                            onAddElement(selectedSection.id, targetColId, widget.id as any);
                          }
                        }}
                        className="flex flex-col items-start p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 text-left transition-all group cursor-pointer"
                      >
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-350 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {widget.lbl}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{widget.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80">
                <p className="text-xs text-slate-400 leading-relaxed">Please select a section or element on the canvas first to choose where to add components.</p>
              </div>
            )}
          </div>
        )}

        {/* =============== TAB: ELEMENTS (Add Components Library) =============== */}
        {activeTab === 'elements' && (
          <div className="space-y-6 animate-in fade-in duration-150" id="tab-elements">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Komponenter & Elementer</h4>
              <p className="text-xs text-slate-400">Træk og slip elementer direkte over på skærmen, eller klik for at tilføje.</p>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              {selectedSection && (
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-250 dark:border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Valgt Sektion</span>
                  <p className="text-xs font-semibold text-slate-850 dark:text-slate-100">{selectedSection.name}</p>
                </div>
              )}

              {/* Target Column Selector */}
              {selectedSection && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Valgt Kolonne</label>
                  <select
                    id="element-target-column"
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                  >
                    {selectedSection.columns.map((col, index) => (
                      <option key={col.id} value={col.id}>
                        Kolonne {index + 1} ({col.elements.length} elementer)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Components Grid */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-500 block">Tilgængelige Elementer (Træk & Slip)</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'text', lbl: '📝 Tekstboks', desc: 'Overskrift eller afsnit' },
                    { id: 'image', lbl: '🖼️ Billedblok', desc: 'Foto, logo eller overlay' },
                    { id: 'button', lbl: '🔘 Knap (CTA)', desc: 'Handling eller link' },
                    { id: 'video', lbl: '📹 Videospiller', desc: 'YouTube / Vimeo embed' },
                    { id: 'search-box', lbl: '🔍 Søgefelt', desc: 'Søgefelt til produkter' },
                    { id: 'webshop', lbl: '🛍️ Webshop Butik', desc: 'Den fulde webshop' },
                    { id: 'divider', lbl: '➖ Linjedeler', desc: 'Vandret adskiller' },
                    { id: 'spacer', lbl: '↕️ Afstandsstykke', desc: 'Lodret tomrum' },
                  ].map(widget => (
                    <button
                      key={widget.id}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', widget.id);
                      }}
                      onClick={() => {
                        const targetSec = selectedSection || sections[0];
                        if (targetSec) {
                          const selectEl = document.getElementById('element-target-column') as HTMLSelectElement;
                          const targetColId = selectEl ? selectEl.value : targetSec.columns[0]?.id;
                          if (targetColId) {
                            onAddElement(targetSec.id, targetColId, widget.id as any);
                          }
                        }
                      }}
                      className="flex flex-col items-start p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 text-left transition-all group cursor-grab active:cursor-grabbing hover:bg-white dark:hover:bg-slate-900 shadow-2xs"
                      title="Træk og slip direkte over på kanvasset eller klik for at tilføje"
                    >
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {widget.lbl}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{widget.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============== TAB: LAYOUT / ADD SECTIONS =============== */}
        {activeTab === 'sections' && (
          <div className="space-y-6 animate-in fade-in duration-150" id="tab-layout">
            
            {/* Unified Dynamic Templates Library */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Skabeloner</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleRestoreDefaultTemplates}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 rounded-lg transition-colors border-none cursor-pointer flex items-center justify-center"
                    title="Gendan standard-skabeloner"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleSaveAsTemplate}
                    className="px-2.5 py-1 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors border-none cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Save className="w-3 h-3" /> Gem layout
                  </button>
                </div>
              </div>

              {templatesList.length === 0 ? (
                <div className="text-center py-6 px-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-[10px] text-slate-400 leading-relaxed m-0">Ingen skabeloner tilgængelige. Klik på "Gem layout" for at oprette en eller gendan standarder.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1" id="templates-preset-selector">
                  {templatesList.map(tmpl => (
                    <div
                      key={tmpl.id}
                      onClick={() => handleApplyCustomTemplate(tmpl)}
                      className="w-full text-left p-3 border border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all cursor-pointer flex justify-between items-center group relative animate-in slide-in-from-bottom-2 duration-100"
                    >
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">{tmpl.name}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5 leading-normal">{tmpl.description}</div>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bg-slate-50 dark:bg-slate-850 pl-2 rounded-lg py-1 shadow-xs">
                        <button
                          onClick={(e) => handleRenameTemplate(tmpl.id, tmpl.name, tmpl.description || '', e)}
                          className="p-1 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors border-none cursor-pointer"
                          title="Rediger skabelonnavn"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleUpdateTemplateDesign(tmpl.id, tmpl.name, e)}
                          className="p-1 bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-md transition-colors border-none cursor-pointer"
                          title="Overskriv skabelonens design med nuværende canvas layout"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteCustomTemplate(tmpl.id, tmpl.name, e)}
                          className="p-1 bg-transparent hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 rounded-md transition-colors border-none cursor-pointer"
                          title="Slet skabelon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Insertion Box */}
            <div className="space-y-3 border-t border-slate-150 dark:border-slate-850 pt-4" id="add-new-rows">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Append New Block Section</span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => onAddSection('single-col')}
                  className="flex items-center justify-between p-2.5 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-left"
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="w-3 h-3 bg-indigo-500 rounded-sm"></span> Full Width Area (1 Col)
                  </span>
                  <PlusCircle className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => onAddSection('two-col')}
                  className="flex items-center justify-between p-2.5 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-left"
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="w-1.5 h-3 bg-indigo-500 rounded-sm"></span><span className="w-1.5 h-3 bg-indigo-500 rounded-sm"></span> Split Screen Area (2 Cols)
                  </span>
                  <PlusCircle className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => onAddSection('three-col')}
                  className="flex items-center justify-between p-2.5 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-left"
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="w-1 h-3 bg-indigo-500 rounded-sm"></span><span className="w-1 h-3 bg-indigo-500 rounded-sm"></span><span className="w-1 h-3 bg-indigo-500 rounded-sm"></span> Grid Feature Row (3 Cols)
                  </span>
                  <PlusCircle className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => onAddSection('footer')}
                  className="flex items-center justify-between p-2.5 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-left"
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span><span className="w-1 h-3 bg-indigo-500 rounded-sm"></span><span className="w-1 h-3 bg-indigo-500 rounded-sm"></span><span className="w-1 h-3 bg-indigo-500 rounded-sm"></span> MM Låsesmed Footer (4 Cols)
                  </span>
                  <PlusCircle className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Layout summary list */}
            <div className="space-y-2 border-t border-slate-150 dark:border-slate-850 pt-4" id="active-layout-deck">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Site Layout Tree</span>
              <div className="space-y-1.5 max-h-[30vh] overflow-y-auto pr-1">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="flex items-center justify-between p-2 text-xs bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-100 dark:border-slate-800"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                      {idx + 1}. {sec.name}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onMoveSection(sec.id, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded disabled:opacity-20 text-slate-400 hover:text-slate-700"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onMoveSection(sec.id, 'down')}
                        disabled={idx === sections.length - 1}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded disabled:opacity-20 text-slate-400 hover:text-slate-700"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSection(sec.id)}
                        className="p-1 hover:bg-rose-100 text-rose-500 rounded"
                        title="Delete Section Block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =============== TAB: GLOBAL THEMES =============== */}
        {activeTab === 'theme' && (
          <div className="space-y-6 animate-in fade-in duration-150" id="tab-theme">
            
            {/* Font Pairings explanation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">Global Typography Settings</span>
                <button
                  onClick={handleApplyThemeGlobally}
                  className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1 shadow-xs font-sans"
                >
                  <Palette className="w-3 h-3 text-indigo-500" /> Anvend globalt på alle sider
                </button>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-indigo-500">Active Family</div>
                <div className="text-[13px] font-bold text-slate-800 dark:text-slate-200 capitalize font-mono leading-tight">
                  {theme.fontFamily} Setup
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Custom formatting options (Font pairings, weight properties, spacing variables) adjust globally to ensure a professional, consistent user experience.
                </p>
              </div>
            </div>

            {/* Global Typography Formatting */}
            <div className="space-y-4 border-t border-slate-150 dark:border-slate-850 pt-4" id="global-typography-editor">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Global Text Formatting</span>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Base Line Height</span>
                  <span className="font-mono text-indigo-500 text-xs font-semibold">{theme.baseLineHeight || '1.5'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.05"
                  value={parseFloat(theme.baseLineHeight || '1.5') || 1.5}
                  onChange={(e) => onSelectTheme({ ...theme, baseLineHeight: e.target.value })}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            {/* Colors Preset Picker */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">Squarespace / Wix Color Sets</span>
              <div className="grid grid-cols-1 gap-2" id="color-presets-palettes">
                {COLOR_THEMES.map(colTheme => (
                  <button
                    key={colTheme.id}
                    onClick={() => onSelectTheme(colTheme)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      theme.id === colTheme.id
                        ? 'border-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/20'
                        : 'border-slate-150 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-100">{colTheme.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 capitalize">Font Family: {colTheme.fontFamily}</div>
                    </div>

                    <div className="flex gap-1 bg-white p-1 rounded border border-slate-200/40">
                      <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: colTheme.background }} title="Background"></div>
                      <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: colTheme.primary }} title="Primary"></div>
                      <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: colTheme.accent }} title="Accent"></div>
                      <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: colTheme.text }} title="Text color"></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Individual Brand Palette */}
            <div className="space-y-4 border-t border-slate-150 dark:border-slate-850 pt-4" id="custom-palette-editor">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Fine-Tune Brand Colors</span>
              
              {/* Primary Color Picker */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Primary Color</span>
                  <span className="font-mono text-indigo-500 text-xs font-semibold">{theme.primary}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.primary}
                    onChange={(e) => onSelectTheme({ ...theme, primary: e.target.value })}
                    className="w-10 h-8 rounded-md border border-slate-200 cursor-pointer p-0.5 bg-slate-50"
                  />
                  <input
                    type="text"
                    value={theme.primary}
                    onChange={(e) => onSelectTheme({ ...theme, primary: e.target.value })}
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-55 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Secondary Color Picker */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Secondary Color</span>
                  <span className="font-mono text-indigo-500 text-xs font-semibold">{theme.secondary}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.secondary}
                    onChange={(e) => onSelectTheme({ ...theme, secondary: e.target.value })}
                    className="w-10 h-8 rounded-md border border-slate-200 cursor-pointer p-0.5 bg-slate-50"
                  />
                  <input
                    type="text"
                    value={theme.secondary}
                    onChange={(e) => onSelectTheme({ ...theme, secondary: e.target.value })}
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-55 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Background Color Picker */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Background Color</span>
                  <span className="font-mono text-indigo-500 text-xs font-semibold">{theme.background}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.background}
                    onChange={(e) => onSelectTheme({ ...theme, background: e.target.value })}
                    className="w-10 h-8 rounded-md border border-slate-200 cursor-pointer p-0.5 bg-slate-50"
                  />
                  <input
                    type="text"
                    value={theme.background}
                    onChange={(e) => onSelectTheme({ ...theme, background: e.target.value })}
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-55 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Text Color Picker */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Text Color</span>
                  <span className="font-mono text-indigo-500 text-xs font-semibold">{theme.text}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.text}
                    onChange={(e) => onSelectTheme({ ...theme, text: e.target.value })}
                    className="w-10 h-8 rounded-md border border-slate-200 cursor-pointer p-0.5 bg-slate-50"
                  />
                  <input
                    type="text"
                    value={theme.text}
                    onChange={(e) => onSelectTheme({ ...theme, text: e.target.value })}
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-55 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Accent Color Picker */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Accent Highlight</span>
                  <span className="font-mono text-indigo-500 text-xs font-semibold">{theme.accent}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.accent}
                    onChange={(e) => onSelectTheme({ ...theme, accent: e.target.value })}
                    className="w-10 h-8 rounded-md border border-slate-200 cursor-pointer p-0.5 bg-slate-50"
                  />
                  <input
                    type="text"
                    value={theme.accent}
                    onChange={(e) => onSelectTheme({ ...theme, accent: e.target.value })}
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-55 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============== TAB: WEBSHOP PAGE CREATOR =============== */}
        {activeTab === 'webshop' && (
          <div className="space-y-6 animate-in fade-in duration-150 text-left font-sans" id="tab-webshop-creator">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Webshop eCommerce Manager</h4>
              <p className="text-xs text-slate-400">Administrer og rediger layouts på alle undersider i din webshop som selvstændige sider.</p>
            </div>

            {/* Store Navigation Pages list */}
            <div className="space-y-3">
              <h5 className="text-[11px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider block">Webshop Butikssider (eCommerce Pages)</h5>
              <div className="grid gap-2">
                {pages.filter(p => p.id.startsWith('webshop-')).map(p => {
                  const isActive = p.id === activePageId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onNavigatePage && onNavigatePage(p.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isActive 
                          ? 'bg-indigo-600 border-indigo-650 text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-xs uppercase tracking-wider">{p.name.replace(/^🛒\s/, '')}</span>
                        <span className={`text-[10px] font-mono ${isActive ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}`}>
                          /{p.slug}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold opacity-60">Rediger →</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 mt-6">
              <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Opret ny Webshop Kampagneside</h5>
              
              {/* Page Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Sidens titel</label>
                <input
                  type="text"
                  placeholder="f.eks. Amager Butik, Vinter Udsalg"
                  value={newTemplateTitle}
                  onChange={(e) => setNewTemplateTitle(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Upload Design Layout / Image */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Designfil / Mockup-billede (.json, .png, .jpg)</label>
                <div className="relative flex flex-col items-center justify-center border border-dashed border-slate-350 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-955 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept=".json,image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setDesignFile(file);
                      setDesignFileName(file ? file.name : '');
                    }}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <span className="text-[20px] mb-1">📤</span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Vælg fil</span>
                  {designFileName && (
                    <span className="text-[9px] text-emerald-600 font-mono mt-1 text-center truncate w-full max-w-[200px]">
                      {designFileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleCreateCustomWebshopPage}
                className="w-full py-2.5 px-4 text-xs font-semibold bg-indigo-650 active:scale-95 hover:bg-indigo-700 text-white rounded-lg transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer animate-none"
              >
                <span>Opret side & Åben i editor</span>
              </button>
            </div>
          </div>
        )}
        
        {/* =============== TAB: AI WRITER CO-COPILOT =============== */}
        {activeTab === 'ai' && (
          <div className="space-y-4 animate-in fade-in duration-150" id="tab-ai-copilot">
            <div className="space-y-1 bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg border border-purple-100 dark:border-purple-900/30">
              <h4 className="text-xs font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Copywriting Co-author
              </h4>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 leading-normal">
                Select any text box or heading component on the canvas and describe your business tone. Gemini AI will write matching high-converting copy!
              </p>
            </div>

            {selectedElement && (selectedElement.type === 'text' || selectedElement.type === 'button') ? (
              <div className="space-y-3 pt-2">
                <div className="text-[11px] text-slate-500 uppercase tracking-wide font-semibold">
                  Writing for: {selectedElement.type === 'button' ? 'Button Element' : 'Text Block'}
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Write a catchy marketing heading for a cozy bakery shop in Paris. Use brief punchy tone."
                  rows={4}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id="ai-prompt-textbox"
                />
                
                <button
                  type="button"
                  disabled={isGeneratingAI || !aiPrompt.trim()}
                  onClick={() => {
                    onGenerateAIContent(selectedElement.id, aiPrompt);
                    setAiPrompt('');
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold bg-purple-600 active:scale-95 disabled:hover:bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                  id="run-ai-generation"
                >
                  {isGeneratingAI ? 'Generating Copy with Gemini...' : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Optimize Content with AI</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                Select a text or button block on the canvas first to trigger the copywriting helper.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Brand visual tags inside WordPress bottom */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>GRID: ACTIVE</span>
        <span>REVISION: V1.2</span>
      </div>
    </div>
  );
}
