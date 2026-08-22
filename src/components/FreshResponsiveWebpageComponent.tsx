import React from 'react';
import Navbar from './fresh/Navbar';
import HeroSection from './fresh/HeroSection';
import FeaturesSection from './fresh/FeaturesSection';
import BrandSection from './fresh/BrandSection';
import Footer from './fresh/Footer';

interface FreshResponsiveWebpageComponentProps {
  editable?: boolean;
}

export default function FreshResponsiveWebpageComponent({ editable = false }: FreshResponsiveWebpageComponentProps) {
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-['Poppins',sans-serif] text-slate-900">
      <Navbar editable={editable} />
      <main className="flex-1">
        <HeroSection editable={editable} />
        <BrandSection editable={editable} />
      </main>
      <Footer editable={editable} />
    </div>
  );
}
