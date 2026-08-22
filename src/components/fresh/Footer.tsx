import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Mail, Phone, ArrowUp, Trash2, Upload, Sliders, X, Check, Image as ImageIcon, RotateCcw } from 'lucide-react';

interface FooterProps {
  editable?: boolean;
  onDelete?: () => void;
}

export default function Footer({ editable = true, onDelete }: FooterProps) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [showLogoControls, setShowLogoControls] = useState(false);

  // Logo Customizer State
  const [footerLogoSrc, setFooterLogoSrc] = useState<string>(() => {
    return localStorage.getItem('mmloqz-footer-logo-src') || 'https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/logo.png';
  });
  const [footerLogoHeight, setFooterLogoHeight] = useState<number>(() => {
    const saved = localStorage.getItem('mmloqz-footer-logo-height');
    return saved ? parseInt(saved, 10) : 56;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('mmloqz-footer-logo-src', footerLogoSrc);
  }, [footerLogoSrc]);

  useEffect(() => {
    localStorage.setItem('mmloqz-footer-logo-height', footerLogoHeight.toString());
  }, [footerLogoHeight]);

  // Editable Text States with LocalStorage Persistence
  const [tagline1, setTagline1] = useState(() => localStorage.getItem('mmloqz-footer-tagline1') || 'MMLoqz High quality products');
  const [tagline2, setTagline2] = useState(() => localStorage.getItem('mmloqz-footer-tagline2') || 'Danish engineered keyless digital cylinder locks and security products.');

  const [addressTitle, setAddressTitle] = useState(() => localStorage.getItem('mmloqz-footer-addr-title') || 'Adresse');
  const [addrLine1, setAddrLine1] = useState(() => localStorage.getItem('mmloqz-footer-addr-l1') || 'Kulvej 10, 2 TV');
  const [addrLine2, setAddrLine2] = useState(() => localStorage.getItem('mmloqz-footer-addr-l2') || '2450 København');
  const [addrLine3, setAddrLine3] = useState(() => localStorage.getItem('mmloqz-footer-addr-l3') || 'Denmark');

  const [infoTitle, setInfoTitle] = useState(() => localStorage.getItem('mmloqz-footer-info-title') || 'Information');
  const [emailText, setEmailText] = useState(() => localStorage.getItem('mmloqz-footer-email') || 'info@mmlasesmed.dk');
  const [phoneText, setPhoneText] = useState(() => localStorage.getItem('mmloqz-footer-phone') || '+45 31 11 11 15');

  const [copyrightText, setCopyrightText] = useState(() => localStorage.getItem('mmloqz-footer-copy') || `© 2026 MMLoqz. All rights reserved.`);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setFooterLogoSrc(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetFooterLogo = () => {
    setFooterLogoSrc('https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/logo.png');
    setFooterLogoHeight(56);
    localStorage.removeItem('mmloqz-footer-logo-src');
    localStorage.removeItem('mmloqz-footer-logo-height');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete the Footer section?")) {
      setIsDeleted(true);
      if (onDelete) onDelete();
    }
  };

  if (isDeleted) return null;

  return (
    <footer id="contact" className="bg-white text-slate-900 pt-16 pb-12 border-t border-slate-200 relative group/footer">
      {/* Delete Section Button Badge */}
      {editable && (
        <div className="absolute top-4 right-4 z-30 opacity-80 group-hover/footer:opacity-100 transition-opacity">
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-rose-500"
            title="Delete Footer section"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Section</span>
          </button>
        </div>
      )}

      {/* Footer Logo Customizer Popover Drawer */}
      {editable && showLogoControls && (
        <div className="absolute top-16 left-8 z-50 w-80 bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
              <ImageIcon className="w-4 h-4" />
              <span>Footer Logo Customizer</span>
            </div>
            <button
              onClick={() => setShowLogoControls(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 mb-5">
            <label className="block text-xs font-semibold text-slate-300">
              Upload Custom Footer Logo:
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
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

          <div className="space-y-2 mb-5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Resize Logo Height:</span>
              <span className="text-emerald-400 font-mono">{footerLogoHeight}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="120"
              value={footerLogoHeight}
              onChange={(e) => setFooterLogoHeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={resetFooterLogo}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
            <button
              onClick={() => setShowLogoControls(false)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 pb-12 border-b border-slate-200">
          {/* Column 1: Brand & Logo (With Upload & Customize option) */}
          <div className="space-y-4 relative group/logoCard">
            <div className="inline-flex items-center gap-3 relative">
              <img
                src={footerLogoSrc}
                alt="MMLoqz Logo"
                style={{ height: `${footerLogoHeight}px`, width: 'auto' }}
                className="object-contain"
              />

              {editable && (
                <button
                  onClick={() => setShowLogoControls(!showLogoControls)}
                  className="ml-2 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold shadow-md opacity-80 group-hover/logoCard:opacity-100 transition-all flex items-center gap-1 cursor-pointer"
                  title="Customize Footer Logo"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Customize Logo</span>
                </button>
              )}
            </div>

            <p
              contentEditable={editable}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                const val = e.currentTarget.innerText;
                setTagline1(val);
                localStorage.setItem('mmloqz-footer-tagline1', val);
              }}
              className="text-slate-800 font-bold text-base pt-2 outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
              title="Click to edit text"
            >
              {tagline1}
            </p>
            <p
              contentEditable={editable}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                const val = e.currentTarget.innerText;
                setTagline2(val);
                localStorage.setItem('mmloqz-footer-tagline2', val);
              }}
              className="text-slate-600 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
              title="Click to edit text"
            >
              {tagline2}
            </p>
          </div>

          {/* Column 2: Address */}
          <div className="space-y-4">
            <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <span
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  setAddressTitle(val);
                  localStorage.setItem('mmloqz-footer-addr-title', val);
                }}
                className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                title="Click to edit text"
              >
                {addressTitle}
              </span>
            </h4>
            <div className="text-slate-700 text-sm leading-relaxed space-y-1 font-medium">
              <p
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  setAddrLine1(val);
                  localStorage.setItem('mmloqz-footer-addr-l1', val);
                }}
                className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                title="Click to edit text"
              >
                {addrLine1}
              </p>
              <p
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  setAddrLine2(val);
                  localStorage.setItem('mmloqz-footer-addr-l2', val);
                }}
                className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                title="Click to edit text"
              >
                {addrLine2}
              </p>
              <p
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  setAddrLine3(val);
                  localStorage.setItem('mmloqz-footer-addr-l3', val);
                }}
                className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                title="Click to edit text"
              >
                {addrLine3}
              </p>
            </div>
          </div>

          {/* Column 3: Contact & Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-700" />
              <span
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  setInfoTitle(val);
                  localStorage.setItem('mmloqz-footer-info-title', val);
                }}
                className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                title="Click to edit text"
              >
                {infoTitle}
              </span>
            </h4>
            <div className="text-slate-700 text-sm space-y-3 font-medium">
              <a
                href={`mailto:${emailText}`}
                className="flex items-center gap-2.5 text-emerald-700 hover:text-emerald-800 transition-colors font-semibold"
              >
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const val = e.currentTarget.innerText;
                    setEmailText(val);
                    localStorage.setItem('mmloqz-footer-email', val);
                  }}
                  className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                  title="Click to edit text"
                >
                  {emailText}
                </span>
              </a>
              <a
                href={`tel:${phoneText.replace(/\s+/g, '')}`}
                className="flex items-center gap-2.5 text-emerald-700 hover:text-emerald-800 transition-colors font-semibold"
              >
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <span
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const val = e.currentTarget.innerText;
                    setPhoneText(val);
                    localStorage.setItem('mmloqz-footer-phone', val);
                  }}
                  className="outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1"
                  title="Click to edit text"
                >
                  {phoneText}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Centered Copyright Line + Working Back to Top button */}
        <div className="pt-8 flex flex-col items-center justify-center text-center space-y-4">
          <p
            contentEditable={editable}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              const val = e.currentTarget.innerText;
              setCopyrightText(val);
              localStorage.setItem('mmloqz-footer-copy', val);
            }}
            className="text-slate-500 text-sm font-semibold text-center outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2"
            title="Click to edit text"
          >
            {copyrightText}
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl transition-all font-bold text-xs shadow-xs border border-slate-200 hover:border-emerald-300 cursor-pointer"
          >
            Back to Top
            <ArrowUp className="w-3.5 h-3.5 text-emerald-700" />
          </button>
        </div>
      </div>
    </footer>
  );
}
