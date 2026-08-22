import React, { useState } from 'react';
import { KeyRound, Smartphone, ShieldAlert, Trash2 } from 'lucide-react';

interface FeaturesSectionProps {
  editable?: boolean;
  onDelete?: () => void;
}

const FEATURES = [
  {
    icon: KeyRound,
    title: 'Keyless Remote Access',
    description: 'Always have instant access to your door or invite new users remotely without needing physical keys.'
  },
  {
    icon: Smartphone,
    title: 'Simple Mobile App',
    description: 'Total control over door permissions with unlimited users and real-time activity tracking in our mobile app.'
  },
  {
    icon: ShieldAlert,
    title: 'No Subscription Fees',
    description: 'Fixed low prices with zero mandatory monthly subscription fees for standard battery-driven digital lock usage.'
  }
];

export default function FeaturesSection({ editable = true, onDelete }: FeaturesSectionProps) {
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete the 3-Column Features Grid section?")) {
      setIsDeleted(true);
      if (onDelete) onDelete();
    }
  };

  if (isDeleted) return null;

  return (
    <section id="features" className="py-16 sm:py-20 bg-white border-b border-slate-100 relative group/sec">
      {/* Delete Section Button Badge */}
      {editable && (
        <div className="absolute top-4 right-4 z-30 opacity-80 group-hover/sec:opacity-100 transition-opacity">
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-rose-500"
            title="Delete 3-Column Features section"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Section</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 mb-3">
            Why Choose MMLoqz
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            High quality digital locks made simple
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500/40 hover:bg-emerald-50/20 transition-all duration-300 group hover:-translate-y-1 shadow-xs hover:shadow-md"
              >
                <div className="w-14 h-14 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-6 shadow-md group-hover:bg-emerald-800 transition-colors">
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-800 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
