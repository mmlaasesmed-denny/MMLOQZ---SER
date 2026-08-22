import React from 'react';
import Navbar from './fresh/Navbar';
import HeroSection from './fresh/HeroSection';
import FeaturesSection from './fresh/FeaturesSection';
import BrandSection from './fresh/BrandSection';
import Footer from './fresh/Footer';

export default function FreshResponsiveWebpageComponent() {
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-['Poppins',sans-serif] text-slate-900">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <BrandSection />
      </main>
      <Footer />
    </div>
  );
}
