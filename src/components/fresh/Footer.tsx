import React, { useState } from 'react';
import { MapPin, Mail, Phone, ArrowUp, Trash2 } from 'lucide-react';

interface FooterProps {
  editable?: boolean;
  onDelete?: () => void;
}

export default function Footer({ editable = true, onDelete }: FooterProps) {
  const [isDeleted, setIsDeleted] = useState(false);

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
            <p className="text-slate-300 font-semibold text-base pt-2">
              MMLoqz High quality products
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Danish engineered keyless digital cylinder locks and security products.
            </p>
          </div>

          {/* Column 2: Address */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Adresse
            </h4>
            <div className="text-slate-300 text-sm leading-relaxed space-y-1 font-normal">
              <p>Kulvej 10, 2 TV</p>
              <p>2450 København</p>
              <p>Denmark</p>
            </div>
          </div>

          {/* Column 3: Contact & Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              Information
            </h4>
            <div className="text-slate-300 text-sm space-y-3 font-normal">
              <a
                href="mailto:info@mmlasesmed.dk"
                className="flex items-center gap-2.5 text-emerald-300 hover:text-emerald-200 transition-colors font-medium"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                info@mmlasesmed.dk
              </a>
              <a
                href="tel:+4531111115"
                className="flex items-center gap-2.5 text-emerald-300 hover:text-emerald-200 transition-colors font-medium"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                +45 31 11 11 15
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MMLoqz. All rights reserved.</p>
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
