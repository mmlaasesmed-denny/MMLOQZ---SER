import React, { useState } from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';

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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete the Danish Brand Content section?")) {
      setIsDeleted(true);
      if (onDelete) onDelete();
    }
  };

  if (isDeleted) return null;

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-slate-50 relative group/brand">
      {/* Delete Section Button Badge */}
      {editable && (
        <div className="absolute top-4 right-4 z-30 opacity-80 group-hover/brand:opacity-100 transition-opacity">
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

          {/* Right Product Collage Image Column */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-lg">
              <div className="p-4 bg-white rounded-3xl shadow-xl border border-slate-200/80">
                <img
                  src="https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/MMloqz%20products%20image.webp"
                  alt="MMLoqz Digital Locks and Smart Components Showcase"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
