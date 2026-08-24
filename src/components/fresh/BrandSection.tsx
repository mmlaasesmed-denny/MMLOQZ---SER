import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Trash2, Upload, Sliders, Image as ImageIcon, RotateCcw, Check, X, Type } from 'lucide-react';
import RichTextInspector from '../RichTextInspector';
import { compressImage, safeSetItem } from '../../utils/imageCompressor';

interface BrandSectionProps {
  editable?: boolean;
  onDelete?: () => void;
}

export default function BrandSection({ editable = true, onDelete }: BrandSectionProps) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [showImageControls, setShowImageControls] = useState(false);
  const [showTextInspector, setShowTextInspector] = useState(false);

  // Editable Text States with LocalStorage Persistence
  const [heading, setHeading] = useState(() => localStorage.getItem('mmloqz-brand-heading') || 'High quality digital locks and components');
  const [p1, setP1] = useState(() => localStorage.getItem('mmloqz-brand-p1') || 'MMLoqz is a Danish company that manufacture a series of quality digital locks and products that interacts with our digital locks. We ensure that safety goes hand in hand with making life easier and ensure only the right people have access to the door. At the same time we focus to make high quality digital locks and components available to everyone, at fixed low prices without subscription fees for the standard use of the locks.');
  const [p2, setP2] = useState(() => localStorage.getItem('mmloqz-brand-p2') || 'Therefore you will find our products being sold online from our resellers but with an option for having the installation done by a professional services engineer onsite or via a video installation. At MMLoqz.com we also make installation guides available online, so that it is simple for our endusers to install battery driven digital locks. Our enduser:');

  const [bullet1, setBullet1] = useState(() => localStorage.getItem('mmloqz-brand-bullet1') || 'Always have access to the door or make it possible to invite new users to the door. This can even be done remotely.');
  const [bullet2, setBullet2] = useState(() => localStorage.getItem('mmloqz-brand-bullet2') || 'Have total control over who has access to the doors and can change this using our simple APP.');
  const [bullet3, setBullet3] = useState(() => localStorage.getItem('mmloqz-brand-bullet3') || 'No limits on the number of APP users in our APP.');
  const [bullet4, setBullet4] = useState(() => localStorage.getItem('mmloqz-brand-bullet4') || 'Resellers who can support them.');

  const [bottomHighlight, setBottomHighlight] = useState(() => localStorage.getItem('mmloqz-brand-bottom-hl') || 'MMLoqz makes digital locks easy to use and to install!');

  // Rich Text Formatting Inspector state
  const [textColor, setTextColor] = useState(() => localStorage.getItem('mmloqz-brand-text-color') || '#1e293b');
  const [lineHeightVal, setLineHeightVal] = useState(() => localStorage.getItem('mmloqz-brand-line-height') || '1.6');
  const [letterSpacingVal, setLetterSpacingVal] = useState(() => localStorage.getItem('mmloqz-brand-letter-spacing') || '0px');
  const [listType, setListType] = useState<'disc' | 'decimal' | 'none'>(() => (localStorage.getItem('mmloqz-brand-list-type') as any) || 'disc');
  const [fontFamilyVal, setFontFamilyVal] = useState(() => localStorage.getItem('mmloqz-brand-font-family') || 'inherit');
  const [textAlignVal, setTextAlignVal] = useState(() => localStorage.getItem('mmloqz-brand-text-align') || 'left');

  // Image State
  const [imageSrc, setImageSrc] = useState<string>(() => {
    return localStorage.getItem('mmloqz-brand-section-img-src') || '/images/MMloqz%20products%20image.webp';
  });

  const [imageWidth, setImageWidth] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-brand-section-img-width');
    return saved ? parseInt(saved, 10) : 512;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { safeSetItem('mmloqz-brand-section-img-src', imageSrc); }, [imageSrc]);
  useEffect(() => { safeSetItem('mmloqz-brand-section-img-width', imageWidth.toString()); }, [imageWidth]);

  useEffect(() => { safeSetItem('mmloqz-brand-text-color', textColor); }, [textColor]);
  useEffect(() => { safeSetItem('mmloqz-brand-line-height', lineHeightVal); }, [lineHeightVal]);
  useEffect(() => { safeSetItem('mmloqz-brand-letter-spacing', letterSpacingVal); }, [letterSpacingVal]);
  useEffect(() => { safeSetItem('mmloqz-brand-list-type', listType); }, [listType]);
  useEffect(() => { safeSetItem('mmloqz-brand-font-family', fontFamilyVal); }, [fontFamilyVal]);
  useEffect(() => { safeSetItem('mmloqz-brand-text-align', textAlignVal); }, [textAlignVal]);

  useEffect(() => {
    const handleFreshPageSync = (e: any) => {
      if (e.detail) {
        const d = e.detail;
        if (d['mmloqz-brand-heading']) setHeading(d['mmloqz-brand-heading']);
        if (d['mmloqz-brand-p1']) setP1(d['mmloqz-brand-p1']);
        if (d['mmloqz-brand-p2']) setP2(d['mmloqz-brand-p2']);
        if (d['mmloqz-brand-bullet1']) setBullet1(d['mmloqz-brand-bullet1']);
        if (d['mmloqz-brand-bullet2']) setBullet2(d['mmloqz-brand-bullet2']);
        if (d['mmloqz-brand-bullet3']) setBullet3(d['mmloqz-brand-bullet3']);
        if (d['mmloqz-brand-bullet4']) setBullet4(d['mmloqz-brand-bullet4']);
        if (d['mmloqz-brand-bottom-hl']) setBottomHighlight(d['mmloqz-brand-bottom-hl']);
        if (d['mmloqz-brand-section-img-src']) setImageSrc(d['mmloqz-brand-section-img-src']);
        if (d['mmloqz-brand-section-img-width']) setImageWidth(Number(d['mmloqz-brand-section-img-width']));
        if (d['mmloqz-brand-text-color']) setTextColor(d['mmloqz-brand-text-color']);
        if (d['mmloqz-brand-line-height']) setLineHeightVal(d['mmloqz-brand-line-height']);
        if (d['mmloqz-brand-letter-spacing']) setLetterSpacingVal(d['mmloqz-brand-letter-spacing']);
        if (d['mmloqz-brand-list-type']) setListType(d['mmloqz-brand-list-type']);
        if (d['mmloqz-brand-font-family']) setFontFamilyVal(d['mmloqz-brand-font-family']);
        if (d['mmloqz-brand-text-align']) setTextAlignVal(d['mmloqz-brand-text-align']);
      }
    };
    window.addEventListener('mmloqz-fresh-page-updated', handleFreshPageSync);
    return () => window.removeEventListener('mmloqz-fresh-page-updated', handleFreshPageSync);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        if (ev.target?.result) {
          const raw = ev.target.result as string;
          const compressed = await compressImage(raw, 1200, 0.8);
          setImageSrc(compressed);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setImageSrc('/images/MMloqz%20products%20image.webp');
    setImageWidth(512);
    localStorage.removeItem('mmloqz-brand-section-img-src');
    localStorage.removeItem('mmloqz-brand-section-img-width');
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete the Danish Brand Content section?")) {
      setIsDeleted(true);
      if (onDelete) onDelete();
    }
  };

  if (isDeleted) return null;

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-slate-50 relative group/brand">
      {/* Action Toolbar Badges */}
      {editable && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={() => setShowTextInspector(!showTextInspector)}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-600"
            title="Inspect Text Formatting, Colors, Line Spacing & Bullet Points"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text & Inspector</span>
          </button>

          <button
            onClick={() => setShowImageControls(!showImageControls)}
            className="px-3 py-1.5 bg-white text-emerald-800 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-50 transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-200"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>Customize Image</span>
          </button>

          <button
            onClick={handleDelete}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-rose-500"
            title="Delete Brand Content section"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Section</span>
          </button>
        </div>
      )}

      {/* Floating Text Inspector Drawer */}
      {editable && showTextInspector && (
        <div className="absolute top-16 right-4 z-50">
          <RichTextInspector
            targetName="Brand Section Text"
            onClose={() => setShowTextInspector(false)}
            onApplyStyles={(styles) => {
              if (styles.color) setTextColor(styles.color);
              if (styles.lineHeight) setLineHeightVal(styles.lineHeight);
              if (styles.letterSpacing) setLetterSpacingVal(styles.letterSpacing);
              if (styles.listStyle) setListType(styles.listStyle);
              if (styles.fontFamily) setFontFamilyVal(styles.fontFamily);
              if (styles.textAlign) setTextAlignVal(styles.textAlign);
            }}
          />
        </div>
      )}

      {/* Image Controls Popover Drawer */}
      {editable && showImageControls && (
        <div className="absolute top-16 right-4 z-50 w-80 bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
              <ImageIcon className="w-4 h-4" />
              <span>Right Image Customizer</span>
            </div>
            <button
              onClick={() => setShowImageControls(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 mb-5">
            <label className="block text-xs font-semibold text-slate-300">
              Upload Custom Image:
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Image File</span>
            </button>
          </div>

          <div className="space-y-2 mb-5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Image Max Width:</span>
              <span className="text-emerald-400 font-mono">{imageWidth}px</span>
            </div>
            <input
              type="range"
              min="200"
              max="650"
              value={imageWidth}
              onChange={(e) => setImageWidth(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={resetImage}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
            <button
              onClick={() => setShowImageControls(false)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column with Rich Inspector Styles */}
          <div 
            className="lg:col-span-7 space-y-6"
            style={{
              color: textColor,
              lineHeight: lineHeightVal,
              letterSpacing: letterSpacingVal,
              fontFamily: fontFamilyVal,
              textAlign: textAlignVal as any
            }}
          >
            <h2
              contentEditable={editable}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                const val = e.currentTarget.innerText;
                setHeading(val);
                localStorage.setItem('mmloqz-brand-heading', val);
              }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
              title="Click to edit text"
            >
              {heading}
            </h2>

            <p
              contentEditable={editable}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                const val = e.currentTarget.innerText;
                setP1(val);
                localStorage.setItem('mmloqz-brand-p1', val);
              }}
              className="text-base sm:text-lg leading-relaxed font-normal outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
              title="Click to edit text"
            >
              {p1}
            </p>

            <p
              contentEditable={editable}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                const val = e.currentTarget.innerText;
                setP2(val);
                localStorage.setItem('mmloqz-brand-p2', val);
              }}
              className="text-base sm:text-lg leading-relaxed font-normal outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
              title="Click to edit text"
            >
              {p2}
            </p>

            {/* 4 Bullet / List Items (Convertible to disc, decimal, or none) */}
            {listType === 'none' ? (
              <div className="space-y-3 pt-2">
                <p
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const val = e.currentTarget.innerText;
                    setBullet1(val);
                    localStorage.setItem('mmloqz-brand-bullet1', val);
                  }}
                  className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                >
                  {bullet1}
                </p>
                <p
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const val = e.currentTarget.innerText;
                    setBullet2(val);
                    localStorage.setItem('mmloqz-brand-bullet2', val);
                  }}
                  className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                >
                  {bullet2}
                </p>
                <p
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const val = e.currentTarget.innerText;
                    setBullet3(val);
                    localStorage.setItem('mmloqz-brand-bullet3', val);
                  }}
                  className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                >
                  {bullet3}
                </p>
                <p
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const val = e.currentTarget.innerText;
                    setBullet4(val);
                    localStorage.setItem('mmloqz-brand-bullet4', val);
                  }}
                  className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                >
                  {bullet4}
                </p>
              </div>
            ) : (
              <ul className={`space-y-3 pt-2 pl-5 font-medium text-sm sm:text-base leading-relaxed ${
                listType === 'decimal' ? 'list-decimal' : 'list-disc'
              }`}>
                <li
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const val = e.currentTarget.innerText;
                    setBullet1(val);
                    localStorage.setItem('mmloqz-brand-bullet1', val);
                  }}
                  className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                  title="Click to edit text"
                >
                  {bullet1}
                </li>
                <li
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const val = e.currentTarget.innerText;
                    setBullet2(val);
                    localStorage.setItem('mmloqz-brand-bullet2', val);
                  }}
                  className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                  title="Click to edit text"
                >
                  {bullet2}
                </li>
                <li
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const val = e.currentTarget.innerText;
                    setBullet3(val);
                    localStorage.setItem('mmloqz-brand-bullet3', val);
                  }}
                  className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                  title="Click to edit text"
                >
                  {bullet3}
                </li>
                <li
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const val = e.currentTarget.innerText;
                    setBullet4(val);
                    localStorage.setItem('mmloqz-brand-bullet4', val);
                  }}
                  className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                  title="Click to edit text"
                >
                  {bullet4}
                </li>
              </ul>
            )}

            <div className="pt-4 border-t border-slate-200">
              <p
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  setBottomHighlight(val);
                  localStorage.setItem('mmloqz-brand-bottom-hl', val);
                }}
                className="text-emerald-800 font-bold text-base sm:text-lg outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                title="Click to edit text"
              >
                {bottomHighlight}
              </p>
            </div>
          </div>

          {/* Right Product Image Column */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div 
              className="relative w-full group/imgCard"
              style={{ maxWidth: `${imageWidth}px` }}
            >
              <div className="p-4 bg-white rounded-3xl shadow-xl border border-slate-200/80 relative overflow-hidden">
                <img
                  src={imageSrc}
                  alt="MMLoqz Showcase"
                  className="w-full h-auto object-contain rounded-2xl transition-all duration-300"
                />

                {editable && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs opacity-0 group-hover/imgCard:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-white">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Change Image</span>
                    </button>
                    <button
                      onClick={() => setShowImageControls(true)}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Adjust Size</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
