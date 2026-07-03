import { useState } from 'react';
import { X, Image as ImageIcon, Link2, Upload } from 'lucide-react';
import { STOCK_IMAGES } from '../templates';

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
}

export default function ImageSelectorModal({
  isOpen,
  onClose,
  onSelect,
  currentUrl = ''
}: ImageSelectorModalProps) {
  const [customUrl, setCustomUrl] = useState(currentUrl);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Technology & Work', 'Food & Dining', 'Minimal & Architecture', 'Abstract & Art'];

  const filteredImages = activeCategory === 'All'
    ? STOCK_IMAGES
    : STOCK_IMAGES.filter(img => img.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" id="image-modal-overlay">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200 dark:border-slate-800 animate-in fade-in duration-200"
        id="image-modal-container"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Configure Image Asset</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            id="close-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Custom URL Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5" /> Direct Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://images.unsplash.com/your-image-url..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="image-url-input"
              />
              <button
                onClick={() => {
                  if (customUrl.trim()) {
                    onSelect(customUrl.trim());
                    onClose();
                  }
                }}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                id="apply-url-btn"
              >
                Apply
              </button>
            </div>
            <p className="text-[11px] text-slate-400">Pasted links will apply in real-time on your canvas.</p>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Upload className="w-3.5 h-3.5 text-indigo-500" /> Upload from Device
            </span>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-4 pb-4">
                  <Upload className="w-6 h-6 mb-2 text-slate-400" />
                  <p className="mb-1 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Click to upload image
                  </p>
                  <p className="text-[10px] text-slate-400">Supports PNG, JPG, GIF</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          onSelect(event.target.result as string);
                          onClose();
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Or Choose from Stock Presets
            </span>

            {/* Categories */}
            <div className="flex flex-wrap gap-1.5" id="stock-categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                    activeCategory === cat
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 ring-1 ring-indigo-500/10'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-hidden" id="stock-images-grid">
              {filteredImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelect(img.url);
                    onClose();
                  }}
                  className="group relative h-28 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-left"
                >
                  <img
                    src={img.url}
                    alt={img.description}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[10px] font-medium text-white line-clamp-1">{img.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            id="close-modal-footer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
