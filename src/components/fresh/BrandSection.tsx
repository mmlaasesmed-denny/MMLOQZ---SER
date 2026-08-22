import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Trash2, Upload, Sliders, Image as ImageIcon, RotateCcw, Check, X } from 'lucide-react';

interface BrandSectionProps {
  editable?: boolean;
  onDelete?: () => void;
}

const BULLETS = [
  'Always have access to the door or make it possible to invite new users to the door. This can even be done remotely.',
  'Have total control over who has access to the doors and can change this using our simple APP.',
  'No limits on the number of APP users in our APP.',
  'Resellers who can support them.'
];

export default function BrandSection({ editable = true, onDelete }: BrandSectionProps) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [showImageControls, setShowImageControls] = useState(false);

  // Image State with LocalStorage Persistence
  const [imageSrc, setImageSrc] = useState<string>(() => {
    return localStorage.getItem('mmloqz-brand-section-img-src') || 'https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/MMloqz%20products%20image.webp';
  });

  const [imageWidth, setImageWidth] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-brand-section-img-width');
    return saved ? parseInt(saved, 10) : 512;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('mmloqz-brand-section-img-src', imageSrc);
  }, [imageSrc]);

  useEffect(() => {
    localStorage.setItem('mmloqz-brand-section-img-width', imageWidth.toString());
  }, [imageWidth]);

  // Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImageSrc(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setImageSrc('https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/MMloqz%20products%20image.webp');
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
      {/* Action Toolbar Badges (Delete & Change Image) */}
      {editable && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
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

          {/* 1. Upload Custom Image */}
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

          {/* 2. Resize Image Width */}
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

          {/* Footer Actions */}
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
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              High quality digital locks and components
            </h2>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              MMLoqz is a Danish company that manufacture a series of quality digital locks and products that interacts with our digital locks. We ensure that safety goes hand in hand with making life easier and ensure only the right people have access to the door. At the same time we focus to make high quality digital locks and components available to everyone, at fixed low prices without subscription fees for the standard use of the locks.
            </p>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              Therefore you will find our products being sold online from our resellers but with an option for having the installation done by a professional services engineer onsite or via a video installation. At MMLoqz.com we also make installation guides available online, so that it is simple for our endusers to install battery driven digital locks. Our enduser:
            </p>

            {/* 4 Bullet Points */}
            <div className="space-y-3 pt-2">
              {BULLETS.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="text-slate-800 font-medium text-sm sm:text-base leading-snug">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-emerald-800 font-bold text-base sm:text-lg">
                MMLoqz makes digital locks easy to use and to install!
              </p>
            </div>
          </div>

          {/* Right Product Image Column (with Upload & Change Image option) */}
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

                {/* Quick Change Image Overlay Button on Hover */}
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
