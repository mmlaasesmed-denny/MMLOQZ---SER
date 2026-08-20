import React, { useState } from 'react';
import { X, Code, Sparkles, Check, FileText, ArrowRight, Zap, Copy } from 'lucide-react';
import { Section, PageElement, Column } from '../types';

interface CodeImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLayout: (sections: Section[]) => void;
}

const PRESET_SNIPPETS = [
  {
    name: '💚 MMLoqz Green Launch Hero',
    code: `<section style="background-color: #15803d; padding: 48px 24px; color: #ffffff;">
  <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 32px;">
    <div style="flex: 1;">
      <p style="font-size: 28px; font-weight: 300; margin-bottom: 8px;">SOON WE ARE</p>
      <h1 style="font-size: 56px; font-weight: 800; line-height: 1.1; margin-bottom: 8px;">LAUNCHING</h1>
      <h2 style="font-size: 42px; font-weight: 800; line-height: 1.1;">OUR NEW BRAND SITE</h2>
    </div>
    <div style="flex: 1; text-align: center;">
      <img src="https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/Hero.webp" alt="MMLoqz Digital Lock Cylinder" style="width: 80%; max-width: 400px; transform: rotate(25deg);" />
    </div>
  </div>
</section>`
  },
  {
    name: '🚀 Modern SaaS Hero Banner',
    code: `<section style="background-color: #0f172a; padding: 64px 32px; color: #ffffff; text-align: center;">
  <div style="max-width: 800px; margin: 0 auto;">
    <p style="font-size: 14px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;">New Release v2.5</p>
    <h1 style="font-size: 48px; font-weight: 900; margin-bottom: 16px;">Build Beautiful Websites in Seconds</h1>
    <p style="font-size: 18px; color: #94a3b8; line-height: 1.6; margin-bottom: 32px;">Paste your code or drag elements to build high performance responsive web pages without coding headaches.</p>
    <button style="background-color: #3b82f6; color: #ffffff; padding: 14px 36px; border-radius: 8px; font-weight: 700; font-size: 16px;">Get Started Free</button>
  </div>
</section>`
  },
  {
    name: '⚡ 3-Column Features Grid',
    code: `<section style="padding: 48px 24px; background-color: #f8fafc;">
  <div style="max-width: 1200px; margin: 0 auto; display: flex; gap: 24px;">
    <div style="flex: 1; background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">📱 100% Responsive</h3>
      <p style="font-size: 14px; color: #64748b; line-height: 1.5;">Looks stunning on all screen sizes from smartphone to desktop.</p>
    </div>
    <div style="flex: 1; background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">✏️ Visual Builder</h3>
      <p style="font-size: 14px; color: #64748b; line-height: 1.5;">Edit text, colors, images, and section layouts directly on canvas.</p>
    </div>
    <div style="flex: 1; background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">🚀 Fast Performance</h3>
      <p style="font-size: 14px; color: #64748b; line-height: 1.5;">Built with modern Vite and React for ultra fast load times.</p>
    </div>
  </div>
</section>`
  }
];

export default function CodeImporterModal({ isOpen, onClose, onApplyLayout }: CodeImporterModalProps) {
  const [code, setCode] = useState(PRESET_SNIPPETS[0].code);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Convert HTML / JSX string into Editor Sections
  const parseCodeToSections = (inputCode: string): Section[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(inputCode, 'text/html');
    const sections: Section[] = [];

    // Look for top level sections or container divs
    let sectionElements = Array.from(doc.body.children);
    if (sectionElements.length === 0 && doc.body.innerHTML.trim().length > 0) {
      // Wrap bare text or tags into a virtual section container
      const wrapper = doc.createElement('section');
      wrapper.innerHTML = inputCode;
      sectionElements = [wrapper];
    }

    sectionElements.forEach((secEl, secIdx) => {
      const styleAttr = secEl.getAttribute('style') || '';
      const bgColorMatch = styleAttr.match(/background-color\s*:\s*([^;]+)/i) || styleAttr.match(/background\s*:\s*([^;]+)/i);
      const bgColor = bgColorMatch ? bgColorMatch[1].trim() : undefined;

      const sectionColumns: Column[] = [];
      const flexContainer = secEl.querySelector('div[style*="flex"]') || secEl;
      const childContainers = Array.from(flexContainer.children).filter(el => el.children.length > 0 || el.textContent?.trim());

      if (childContainers.length > 1 && (flexContainer.getAttribute('style')?.includes('flex') || flexContainer.tagName === 'DIV')) {
        // Multi-column flex layout
        childContainers.forEach((colEl, colIdx) => {
          const elements: PageElement[] = extractElementsFromNode(colEl, `${secIdx}-${colIdx}`);
          sectionColumns.push({
            id: `imported-col-${secIdx}-${colIdx}`,
            width: 'md:flex-1',
            elements: elements.length > 0 ? elements : [{
              id: `imported-el-fallback-${secIdx}-${colIdx}`,
              type: 'text',
              content: colEl.textContent || 'Column Content',
              style: parseInlineStyle(colEl.getAttribute('style') || '')
            }]
          });
        });
      } else {
        // Single column layout
        const elements: PageElement[] = extractElementsFromNode(secEl, `${secIdx}`);
        sectionColumns.push({
          id: `imported-col-${secIdx}-0`,
          width: 'md:flex-1',
          elements: elements.length > 0 ? elements : [{
            id: `imported-el-fallback-${secIdx}-0`,
            type: 'text',
            content: secEl.textContent || 'Section Content',
            style: parseInlineStyle(secEl.getAttribute('style') || '')
          }]
        });
      }

      sections.push({
        id: `imported-sec-${Date.now()}-${secIdx}`,
        name: `Imported Section ${secIdx + 1}`,
        fullWidth: true,
        paddingY: 'lg',
        bgColor: bgColor,
        columns: sectionColumns
      });
    });

    return sections.length > 0 ? sections : [
      {
        id: `imported-sec-default-${Date.now()}`,
        name: 'Imported Layout Section',
        fullWidth: true,
        paddingY: 'lg',
        columns: [
          {
            id: 'col-default',
            width: 'md:flex-1',
            elements: [
              {
                id: 'el-default-heading',
                type: 'heading',
                content: 'Imported Custom Layout',
                style: { fontSize: '32px', fontWeight: '800', color: '#0f172a' }
              }
            ]
          }
        ]
      }
    ];
  };

  // Helper: Extract PageElements from HTML Node tree
  const extractElementsFromNode = (parent: Element, prefix: string): PageElement[] => {
    const elements: PageElement[] = [];
    const walk = (node: Element) => {
      const tag = node.tagName.toLowerCase();
      const text = node.textContent?.trim() || '';
      const style = parseInlineStyle(node.getAttribute('style') || '');

      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
        elements.push({
          id: `imp-head-${prefix}-${elements.length}`,
          type: 'heading',
          content: text || 'Heading Text',
          style: { fontSize: tag === 'h1' ? '48px' : tag === 'h2' ? '36px' : '24px', fontWeight: '800', color: '#0f172a', ...style }
        });
      } else if (tag === 'img') {
        const src = node.getAttribute('src') || '';
        elements.push({
          id: `imp-img-${prefix}-${elements.length}`,
          type: 'image',
          content: src || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          style: { width: '100%', borderRadius: '12px', ...style }
        });
      } else if (tag === 'button' || (tag === 'a' && (node.getAttribute('class')?.includes('btn') || style.backgroundColor))) {
        elements.push({
          id: `imp-btn-${prefix}-${elements.length}`,
          type: 'button',
          content: text || 'Click Here',
          style: { backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontWeight: '700', ...style }
        });
      } else if (['p', 'span', 'li', 'label'].includes(tag) && text.length > 0) {
        elements.push({
          id: `imp-txt-${prefix}-${elements.length}`,
          type: 'text',
          content: text,
          style: { fontSize: '16px', color: '#334155', lineHeight: '1.6', ...style }
        });
      } else {
        // Walk child nodes
        Array.from(node.children).forEach(child => walk(child));
      }
    };

    walk(parent);
    return elements;
  };

  // Helper: Parse inline CSS string to React CSSProperties
  const parseInlineStyle = (styleStr: string): Record<string, string> => {
    const result: Record<string, string> = {};
    if (!styleStr) return result;
    styleStr.split(';').forEach(rule => {
      const [key, val] = rule.split(':');
      if (key && val) {
        const camelKey = key.trim().replace(/-([a-z])/g, (_, g) => g.toUpperCase());
        result[camelKey] = val.trim();
      }
    });
    return result;
  };

  const handleConvert = () => {
    if (!code.trim()) {
      setStatusMessage('⚠️ Please paste or enter HTML/JSX code before converting.');
      return;
    }

    try {
      const parsedSections = parseCodeToSections(code);
      onApplyLayout(parsedSections);
      setStatusMessage('✅ Layout converted and applied to Visual Editor canvas successfully!');
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 800);
    } catch (err) {
      console.error('Code parsing error:', err);
      setStatusMessage('⚠️ Error converting code. Make sure your HTML/JSX string is valid.');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Code to Layout Converter
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-full">
                  NEW FEATURE
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste HTML, JSX, or Tailwind code below to automatically convert it into an editable visual layout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
              Quick Code Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_SNIPPETS.map((snippet, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCode(snippet.code);
                    setStatusMessage(`Loaded preset: ${snippet.name}`);
                    setTimeout(() => setStatusMessage(null), 2000);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  {snippet.name}
                </button>
              ))}
            </div>
          </div>

          {/* Code Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Paste HTML / JSX Code
              </label>
              <button
                onClick={() => setCode('')}
                className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear Text
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="<section style='background: #15803d;'><h1>SOON WE ARE LAUNCHING</h1></section>"
              className="w-full h-64 p-4 font-mono text-xs bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-inner leading-relaxed resize-none"
            />
          </div>

          {/* Status Alert */}
          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.includes('✅')
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : statusMessage.includes('Loaded')
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Converts elements into editable canvas sections & columns
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConvert}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Convert & Apply to Visual Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
