import React, { useState } from 'react';
import { Menu, X, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <img
            src="https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/logo.png"
            alt="MMLoqz Logo"
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-slate-700">
          <a href="#hero" className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors">
            Home
          </a>
          <a href="#features" className="hover:text-emerald-700 transition-colors">
            Features
          </a>
          <a href="#about" className="hover:text-emerald-700 transition-colors">
            About Us
          </a>
          <a href="#contact" className="hover:text-emerald-700 transition-colors">
            Contact us
          </a>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#contact"
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-emerald-700/20 transition-all flex items-center gap-1.5"
          >
            Get In Touch
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
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
            className="block text-base font-bold text-emerald-700 py-2 border-b border-slate-100"
          >
            Home
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-emerald-700 py-2 border-b border-slate-100"
          >
            Features
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-emerald-700 py-2 border-b border-slate-100"
          >
            About Us
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-emerald-700 py-2 border-b border-slate-100"
          >
            Contact us
          </a>
          <div className="pt-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-emerald-700 text-white rounded-xl font-bold text-center block shadow-md"
            >
              Get In Touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
