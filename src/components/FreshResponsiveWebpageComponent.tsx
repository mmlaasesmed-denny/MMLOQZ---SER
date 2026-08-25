import React from 'react';
import Navbar from './fresh/Navbar';
import HeroSection from './fresh/HeroSection';
import FeaturesSection from './fresh/FeaturesSection';
import BrandSection from './fresh/BrandSection';
import Footer from './fresh/Footer';

interface FreshResponsiveWebpageComponentProps {
  editable?: boolean;
  pages?: any[];
  activePageId?: string;
  onNavigatePage?: (pageId: string) => void;
}

export default function FreshResponsiveWebpageComponent({ 
  editable = false,
  pages = [],
  activePageId,
  onNavigatePage
}: FreshResponsiveWebpageComponentProps) {
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-['Poppins',sans-serif] text-slate-900">
      <Navbar 
        editable={editable} 
        pages={pages} 
        activePageId={activePageId} 
        onNavigatePage={onNavigatePage} 
      />
      <main className="flex-1">
        <HeroSection editable={editable} />
        <BrandSection editable={editable} />
      </main>
      <Footer editable={editable} />
    </div>
  );
}
