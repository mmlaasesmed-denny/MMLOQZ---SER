import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Upload, Sliders, RotateCcw, Check, X, Image as ImageIcon, MoveLeft, MoveRight, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { compressImage, safeSetItem } from '../../utils/imageCompressor';

interface HeroSectionProps {
  editable?: boolean;
  onDelete?: () => void;
}

export default function HeroSection({ editable = true, onDelete }: HeroSectionProps) {
  const [showControls, setShowControls] = useState(false);
  const [activeTab, setActiveTab] = useState<'bg' | 'right'>('bg');
  const [isDeleted, setIsDeleted] = useState(false);

  // Text States with LocalStorage Persistence
  const [heroLine1, setHeroLine1] = useState<string>(() => localStorage.getItem('mmloqz-hero-line1') || 'SOON WE ARE');
  const [heroLine2, setHeroLine2] = useState<string>(() => localStorage.getItem('mmloqz-hero-line2') || 'LAUNCHING');
  const [heroLine3, setHeroLine3] = useState<string>(() => localStorage.getItem('mmloqz-hero-line3') || 'OUR NEW BRAND SITE');

  // 1. Background Shaded Image State
  const [bgShadedSrc, setBgShadedSrc] = useState<string>(() => {
    return localStorage.getItem('mmloqz-hero-bg-shaded-src') || '/images/Hero.webp';
  });
  const [bgWidth, setBgWidth] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-hero-bg-width');
    return saved ? parseInt(saved, 10) : 320;
  });
  const [bgRotate, setBgRotate] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-hero-bg-rotate');
    return saved ? parseInt(saved, 10) : 30;
  });
  const [bgOpacity, setBgOpacity] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-hero-bg-opacity');
    return saved ? parseFloat(saved) : 0.22;
  });
  const [bgOffsetX, setBgOffsetX] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-hero-bg-offset-x');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [bgOffsetY, setBgOffsetY] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-hero-bg-offset-y');
    return saved ? parseInt(saved, 10) : 0;
  });

  // 2. Right Product Image State
  const [rightImgSrc, setRightImgSrc] = useState<string>(() => {
    return localStorage.getItem('mmloqz-hero-right-img-src') || '/images/Hero.webp';
  });
  const [rightImgWidth, setRightImgWidth] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-hero-right-img-width');
    return saved ? parseInt(saved, 10) : 340;
  });
  const [rightImgRotate, setRightImgRotate] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-hero-right-img-rotate');
    return saved ? parseInt(saved, 10) : 30;
  });
  const [rightImgOpacity, setRightImgOpacity] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-hero-right-img-opacity');
    return saved ? parseFloat(saved) : 1.0;
  });
  const [rightImgOffsetX, setRightImgOffsetX] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-hero-right-img-offset-x');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [rightImgOffsetY, setRightImgOffsetY] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-hero-right-img-offset-y');
    return saved ? parseInt(saved, 10) : 0;
  });

  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const rightFileInputRef = useRef<HTMLInputElement>(null);

  // Persistence Effects
  useEffect(() => { safeSetItem('mmloqz-hero-bg-shaded-src', bgShadedSrc); }, [bgShadedSrc]);
  useEffect(() => { safeSetItem('mmloqz-hero-bg-width', bgWidth.toString()); }, [bgWidth]);
  useEffect(() => { safeSetItem('mmloqz-hero-bg-rotate', bgRotate.toString()); }, [bgRotate]);
  useEffect(() => { safeSetItem('mmloqz-hero-bg-opacity', bgOpacity.toString()); }, [bgOpacity]);
  useEffect(() => { safeSetItem('mmloqz-hero-bg-offset-x', bgOffsetX.toString()); }, [bgOffsetX]);
  useEffect(() => { safeSetItem('mmloqz-hero-bg-offset-y', bgOffsetY.toString()); }, [bgOffsetY]);

  useEffect(() => { safeSetItem('mmloqz-hero-right-img-src', rightImgSrc); }, [rightImgSrc]);
  useEffect(() => { safeSetItem('mmloqz-hero-right-img-width', rightImgWidth.toString()); }, [rightImgWidth]);
  useEffect(() => { safeSetItem('mmloqz-hero-right-img-rotate', rightImgRotate.toString()); }, [rightImgRotate]);
  useEffect(() => { safeSetItem('mmloqz-hero-right-img-opacity', rightImgOpacity.toString()); }, [rightImgOpacity]);
  useEffect(() => { safeSetItem('mmloqz-hero-right-img-offset-x', rightImgOffsetX.toString()); }, [rightImgOffsetX]);
  useEffect(() => { safeSetItem('mmloqz-hero-right-img-offset-y', rightImgOffsetY.toString()); }, [rightImgOffsetY]);

  useEffect(() => {
    const handleFreshPageSync = (e: any) => {
      if (e.detail) {
        const d = e.detail;
        if (d['mmloqz-hero-line1']) setHeroLine1(d['mmloqz-hero-line1']);
        if (d['mmloqz-hero-line2']) setHeroLine2(d['mmloqz-hero-line2']);
        if (d['mmloqz-hero-line3']) setHeroLine3(d['mmloqz-hero-line3']);
        if (d['mmloqz-hero-bg-shaded-src']) setBgShadedSrc(d['mmloqz-hero-bg-shaded-src']);
        if (d['mmloqz-hero-bg-width']) setBgWidth(Number(d['mmloqz-hero-bg-width']));
        if (d['mmloqz-hero-bg-rotate']) setBgRotate(Number(d['mmloqz-hero-bg-rotate']));
        if (d['mmloqz-hero-bg-opacity']) setBgOpacity(Number(d['mmloqz-hero-bg-opacity']));
        if (d['mmloqz-hero-bg-offset-x'] !== undefined) setBgOffsetX(Number(d['mmloqz-hero-bg-offset-x']));
        if (d['mmloqz-hero-bg-offset-y'] !== undefined) setBgOffsetY(Number(d['mmloqz-hero-bg-offset-y']));
        if (d['mmloqz-hero-right-img-src']) setRightImgSrc(d['mmloqz-hero-right-img-src']);
        if (d['mmloqz-hero-right-img-width']) setRightImgWidth(Number(d['mmloqz-hero-right-img-width']));
        if (d['mmloqz-hero-right-img-rotate']) setRightImgRotate(Number(d['mmloqz-hero-right-img-rotate']));
        if (d['mmloqz-hero-right-img-opacity']) setRightImgOpacity(Number(d['mmloqz-hero-right-img-opacity']));
        if (d['mmloqz-hero-right-img-offset-x'] !== undefined) setRightImgOffsetX(Number(d['mmloqz-hero-right-img-offset-x']));
        if (d['mmloqz-hero-right-img-offset-y'] !== undefined) setRightImgOffsetY(Number(d['mmloqz-hero-right-img-offset-y']));
      }
    };
    window.addEventListener('mmloqz-fresh-page-updated', handleFreshPageSync);
    return () => window.removeEventListener('mmloqz-fresh-page-updated', handleFreshPageSync);
  }, []);

  // Upload Handlers
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        if (ev.target?.result) {
          const raw = ev.target.result as string;
          const compressed = await compressImage(raw, 1200, 0.8);
          setBgShadedSrc(compressed);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRightUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        if (ev.target?.result) {
          const raw = ev.target.result as string;
          const compressed = await compressImage(raw, 1200, 0.8);
          setRightImgSrc(compressed);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteSection = () => {
    if (window.confirm("Are you sure you want to delete the Green Hero Banner section?")) {
      setIsDeleted(true);
      if (onDelete) onDelete();
    }
  };

  const resetDefaults = () => {
    setHeroLine1('SOON WE ARE');
    setHeroLine2('LAUNCHING');
    setHeroLine3('OUR NEW BRAND SITE');
    localStorage.removeItem('mmloqz-hero-line1');
    localStorage.removeItem('mmloqz-hero-line2');
    localStorage.removeItem('mmloqz-hero-line3');

    setBgShadedSrc('/images/Hero.webp');
    setBgWidth(320);
    setBgRotate(30);
    setBgOpacity(0.22);
    setBgOffsetX(0);
    setBgOffsetY(0);

    setRightImgSrc('/images/Hero.webp');
    setRightImgWidth(340);
    setRightImgRotate(30);
    setRightImgOpacity(1.0);
    setRightImgOffsetX(0);
    setRightImgOffsetY(0);

    localStorage.removeItem('mmloqz-hero-bg-shaded-src');
    localStorage.removeItem('mmloqz-hero-bg-width');
    localStorage.removeItem('mmloqz-hero-bg-rotate');
    localStorage.removeItem('mmloqz-hero-bg-opacity');
    localStorage.removeItem('mmloqz-hero-bg-offset-x');
    localStorage.removeItem('mmloqz-hero-bg-offset-y');

    localStorage.removeItem('mmloqz-hero-right-img-src');
    localStorage.removeItem('mmloqz-hero-right-img-width');
    localStorage.removeItem('mmloqz-hero-right-img-rotate');
    localStorage.removeItem('mmloqz-hero-right-img-opacity');
    localStorage.removeItem('mmloqz-hero-right-img-offset-x');
    localStorage.removeItem('mmloqz-hero-right-img-offset-y');
  };

  if (isDeleted) return null;

  return (
    <section id="hero" className="relative overflow-hidden bg-[#15803d] text-white py-16 sm:py-20 lg:py-24 group/hero">
      {/* Background Subtle Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-transparent to-emerald-950/20 pointer-events-none" />

      {/* Floating Section Action Badges */}
      {editable && (
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
          <button
            onClick={() => setShowControls(!showControls)}
            className="px-3 py-1.5 bg-white text-emerald-900 rounded-xl text-xs font-bold shadow-lg hover:bg-emerald-50 transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-200"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>Customize Hero Images</span>
          </button>

          <button
            onClick={handleDeleteSection}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer border border-rose-500"
            title="Delete this Green Hero section"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Section</span>
          </button>
        </div>
      )}

      {/* Hero Control Drawer Popover */}
      {editable && showControls && (
        <div className="absolute top-16 right-4 z-50 w-96 bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 sticky top-0 bg-slate-900 z-10">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
              <ImageIcon className="w-4 h-4" />
              <span>Hero Images Customizer</span>
            </div>
            <button
              onClick={() => setShowControls(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl mb-4">
            <button
              onClick={() => setActiveTab('bg')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'bg' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Background Shaded Image
            </button>
            <button
              onClick={() => setActiveTab('right')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'right' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Right Product Image
            </button>
          </div>

          {/* Tab 1: Background Shaded Image Settings (Identical 6 Options) */}
          {activeTab === 'bg' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  1. Upload Custom Image:
                </label>
                <input
                  type="file"
                  ref={bgFileInputRef}
                  onChange={handleBgUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => bgFileInputRef.current?.click()}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Background Image</span>
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">2. Width (Size):</span>
                  <span className="text-emerald-400 font-mono">{bgWidth}px</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="600"
                  value={bgWidth}
                  onChange={(e) => setBgWidth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">3. Rotation Angle:</span>
                  <span className="text-emerald-400 font-mono">{bgRotate}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={bgRotate}
                  onChange={(e) => setBgRotate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">4. Shade Opacity:</span>
                  <span className="text-emerald-400 font-mono">{Math.round(bgOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.01"
                  value={bgOpacity}
                  onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">5. Move Left / Right (X):</span>
                  <span className="text-emerald-400 font-mono">{bgOffsetX}px</span>
                </div>
                <input
                  type="range"
                  min="-300"
                  max="300"
                  value={bgOffsetX}
                  onChange={(e) => setBgOffsetX(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">6. Move Up / Down (Y):</span>
                  <span className="text-emerald-400 font-mono">{bgOffsetY}px</span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={bgOffsetY}
                  onChange={(e) => setBgOffsetY(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-2">
                <button
                  onClick={() => setBgOffsetX(prev => prev - 20)}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <MoveLeft className="w-3 h-3" />
                  <span>Left</span>
                </button>
                <button
                  onClick={() => setBgOffsetX(prev => prev + 20)}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Right</span>
                  <MoveRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setBgOffsetY(prev => prev - 20)}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowUp className="w-3 h-3" />
                  <span>Up</span>
                </button>
                <button
                  onClick={() => setBgOffsetY(prev => prev + 20)}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowDown className="w-3 h-3" />
                  <span>Down</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Right Product Image Settings */}
          {activeTab === 'right' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  1. Upload Custom Image:
                </label>
                <input
                  type="file"
                  ref={rightFileInputRef}
                  onChange={handleRightUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => rightFileInputRef.current?.click()}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Product Image</span>
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">2. Width (Size):</span>
                  <span className="text-emerald-400 font-mono">{rightImgWidth}px</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="600"
                  value={rightImgWidth}
                  onChange={(e) => setRightImgWidth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">3. Rotation Angle:</span>
                  <span className="text-emerald-400 font-mono">{rightImgRotate}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rightImgRotate}
                  onChange={(e) => setRightImgRotate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">4. Shade Opacity:</span>
                  <span className="text-emerald-400 font-mono">{Math.round(rightImgOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.01"
                  value={rightImgOpacity}
                  onChange={(e) => setRightImgOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">5. Move Left / Right (X):</span>
                  <span className="text-emerald-400 font-mono">{rightImgOffsetX}px</span>
                </div>
                <input
                  type="range"
                  min="-300"
                  max="300"
                  value={rightImgOffsetX}
                  onChange={(e) => setRightImgOffsetX(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">6. Move Up / Down (Y):</span>
                  <span className="text-emerald-400 font-mono">{rightImgOffsetY}px</span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={rightImgOffsetY}
                  onChange={(e) => setRightImgOffsetY(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-2">
                <button
                  onClick={() => setRightImgOffsetX(prev => prev - 20)}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <MoveLeft className="w-3 h-3" />
                  <span>Left</span>
                </button>
                <button
                  onClick={() => setRightImgOffsetX(prev => prev + 20)}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Right</span>
                  <MoveRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setRightImgOffsetY(prev => prev - 20)}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowUp className="w-3 h-3" />
                  <span>Up</span>
                </button>
                <button
                  onClick={() => setRightImgOffsetY(prev => prev + 20)}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowDown className="w-3 h-3" />
                  <span>Down</span>
                </button>
              </div>
            </div>
          )}

          {/* Control Footer Actions */}
          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between sticky bottom-0 bg-slate-900">
            <button
              onClick={resetDefaults}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={() => setShowControls(false)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Content with 100% Inline Editable Letters */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6 relative min-h-[220px] flex flex-col justify-center">
            {/* 1. Shaded Background Image directly behind text with X and Y movement */}
            {bgShadedSrc && (
              <img
                src={bgShadedSrc}
                alt="Shaded Background Lock"
                className="absolute left-6 sm:left-12 top-1/2 pointer-events-none transition-all duration-200 z-0"
                style={{
                  opacity: bgOpacity,
                  transform: `translate(${bgOffsetX}px, calc(-50% + ${bgOffsetY}px)) rotate(${bgRotate}deg)`,
                  width: `${bgWidth}px`,
                  maxWidth: '100%',
                  objectFit: 'contain'
                }}
              />
            )}

            {/* Headlines Text (100% Inline Editable letter by letter) */}
            <div className="relative z-10 space-y-2">
              <p
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  setHeroLine1(val);
                  localStorage.setItem('mmloqz-hero-line1', val);
                }}
                className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide text-white drop-shadow-sm outline-none focus:ring-2 focus:ring-emerald-300 rounded px-1"
                title="Click to edit text"
              >
                {heroLine1}
              </p>
              <h1
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  setHeroLine2(val);
                  localStorage.setItem('mmloqz-hero-line2', val);
                }}
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none text-white drop-shadow-md outline-none focus:ring-2 focus:ring-emerald-300 rounded px-1"
                title="Click to edit text"
              >
                {heroLine2}
              </h1>
              <h2
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  setHeroLine3(val);
                  localStorage.setItem('mmloqz-hero-line3', val);
                }}
                className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md outline-none focus:ring-2 focus:ring-emerald-300 rounded px-1"
                title="Click to edit text"
              >
                {heroLine3}
              </h2>
            </div>
          </div>

          {/* Right Floating Product Image with X and Y movement & Opacity */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md lg:max-w-none flex justify-center">
              <div className="absolute -inset-4 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              {rightImgSrc && (
                <img
                  src={rightImgSrc}
                  alt="MMLoqz Digital Cylinder Lock"
                  className="relative z-10 object-contain transition-all duration-200 filter drop-shadow-(0_25px_35px_rgba(0,0,0,0.4))"
                  style={{
                    width: `${rightImgWidth}px`,
                    opacity: rightImgOpacity,
                    transform: `translate(${rightImgOffsetX}px, ${rightImgOffsetY}px) rotate(${rightImgRotate}deg)`,
                    maxWidth: '100%'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
