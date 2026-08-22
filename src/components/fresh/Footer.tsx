import React, { useState } from 'react';
import { MapPin, Mail, Phone, ArrowUp, Trash2 } from 'lucide-react';

interface FooterProps {
  editable?: boolean;
  onDelete?: () => void;
}

export default function Footer({ editable = true, onDelete }: FooterProps) {
  const [isDeleted, setIsDeleted] = useState(false);

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

  const [copyrightText, setCopyrightText] = useState(() => localStorage.getItem('mmloqz-footer-copy') || `© ${new Date().getFullYear()} MMLoqz. All rights reserved.`);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete the Footer section?")) {
      setIsDeleted(true);
      if (onDelete) onDelete();
    }
  };

  if (isDeleted) return null;

  return (
    <footer id="contact" className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800 relative group/footer">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Logo */}
          <div className="space-y-4">
            <img
              src="https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/logo.png"
              alt="MMLoqz Logo"
              className="h-14 w-auto object-contain bg-white/90 p-2 rounded-xl"
            />
            <p
              contentEditable={editable}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                const val = e.currentTarget.innerText;
                setTagline1(val);
                localStorage.setItem('mmloqz-footer-tagline1', val);
              }}
              className="text-slate-300 font-semibold text-base pt-2 outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
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
              className="text-slate-400 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
              title="Click to edit text"
            >
              {tagline2}
            </p>
          </div>

          {/* Column 2: Address */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  setAddressTitle(val);
                  localStorage.setItem('mmloqz-footer-addr-title', val);
                }}
                className="outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
                title="Click to edit text"
              >
                {addressTitle}
              </span>
            </h4>
            <div className="text-slate-300 text-sm leading-relaxed space-y-1 font-normal">
              <p
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  setAddrLine1(val);
                  localStorage.setItem('mmloqz-footer-addr-l1', val);
                }}
                className="outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
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
                className="outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
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
                className="outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
                title="Click to edit text"
              >
                {addrLine3}
              </p>
            </div>
          </div>

          {/* Column 3: Contact & Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              <span
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  setInfoTitle(val);
                  localStorage.setItem('mmloqz-footer-info-title', val);
                }}
                className="outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
                title="Click to edit text"
              >
                {infoTitle}
              </span>
            </h4>
            <div className="text-slate-300 text-sm space-y-3 font-normal">
              <a
                href={`mailto:${emailText}`}
                className="flex items-center gap-2.5 text-emerald-300 hover:text-emerald-200 transition-colors font-medium"
              >
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const val = e.currentTarget.innerText;
                    setEmailText(val);
                    localStorage.setItem('mmloqz-footer-email', val);
                  }}
                  className="outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
                  title="Click to edit text"
                >
                  {emailText}
                </span>
              </a>
              <a
                href={`tel:${phoneText.replace(/\s+/g, '')}`}
                className="flex items-center gap-2.5 text-emerald-300 hover:text-emerald-200 transition-colors font-medium"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const val = e.currentTarget.innerText;
                    setPhoneText(val);
                    localStorage.setItem('mmloqz-footer-phone', val);
                  }}
                  className="outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
                  title="Click to edit text"
                >
                  {phoneText}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p
            contentEditable={editable}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              const val = e.currentTarget.innerText;
              setCopyrightText(val);
              localStorage.setItem('mmloqz-footer-copy', val);
            }}
            className="outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
            title="Click to edit text"
          >
            {copyrightText}
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all font-medium cursor-pointer"
          >
            Back to Top
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>
    </footer>
  );
}
