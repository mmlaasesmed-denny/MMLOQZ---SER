import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, Upload, MoveLeft, MoveRight, Sliders, RotateCcw, Check, Image as ImageIcon } from 'lucide-react';

interface NavbarProps {
  editable?: boolean;
}

export default function Navbar({ editable = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoControls, setShowLogoControls] = useState(false);

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('mmloqz-custom-logo-src', logoSrc);
  }, [logoSrc]);

  useEffect(() => {
    localStorage.setItem('mmloqz-custom-logo-height', logoHeight.toString());
  }, [logoHeight]);

  useEffect(() => {
    localStorage.setItem('mmloqz-custom-logo-offset-x', logoOffsetX.toString());
  }, [logoOffsetX]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetLogo = () => {
    setLogoSrc('/images/logo.png');
    setLogoHeight(48);
    setLogoOffsetX(0);
    localStorage.removeItem('mmloqz-custom-logo-src');
    localStorage.removeItem('mmloqz-custom-logo-height');
    localStorage.removeItem('mmloqz-custom-logo-offset-x');
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
              className="ml-3 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-md opacity-80 group-hover/logo:opacity-100 transition-all flex items-center gap-1.5 cursor-pointer"
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
                  className="text-slate-400 hover:text-white p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Upload Logo */}
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
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File</span>
                  </button>
                </div>
              </div>

              {/* 2. Resize Height Slider */}
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

              {/* 3. Left / Right Position Slider & Buttons */}
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
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setLogoOffsetX(prev => Math.max(-100, prev - 20))}
                    className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MoveLeft className="w-3 h-3" />
                    <span>Move Left</span>
                  </button>
                  <button
                    onClick={() => setLogoOffsetX(0)}
                    className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 cursor-pointer"
                  >
                    Center
                  </button>
                  <button
                    onClick={() => setLogoOffsetX(prev => Math.min(200, prev + 20))}
                    className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Move Right</span>
                    <MoveRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 4. Reset Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={resetLogo}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
                <button
                  onClick={() => setShowLogoControls(false)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Nav Items (Home & Contact us aligned right) */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-slate-900 ml-auto">
          <a href="#hero" className="hover:text-emerald-700 transition-colors text-base">
            Home
          </a>
          <a href="#contact" className="hover:text-emerald-700 transition-colors text-base">
            Contact us
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors ml-auto"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Animated Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-xl">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-slate-900 hover:text-emerald-700 py-2 border-b border-slate-100"
          >
            Home
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-slate-900 hover:text-emerald-700 py-2"
          >
            Contact us
          </a>
        </div>
      )}
    </header>
  );
}
