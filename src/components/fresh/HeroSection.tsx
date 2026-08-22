import React from 'react';
import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#15803d] text-white py-16 sm:py-20 lg:py-24">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-transparent to-emerald-950/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-100 text-xs sm:text-sm font-medium border border-white/15">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Next Generation Digital Locks</span>
            </div>

            <div className="space-y-2">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide text-emerald-100">
                SOON WE ARE
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none text-white drop-shadow-sm">
                LAUNCHING
              </h1>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                OUR NEW BRAND SITE
              </h2>
            </div>
          </div>

          {/* Right Floating Cylinder Lock Image */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-4 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <img
                src="https://raw.githubusercontent.com/MMLoqz-ApS/MMLoqz/main/src/assets/images/Hero.webp"
                alt="MMLoqz Digital Cylinder Lock"
                className="relative z-10 w-4/5 sm:w-3/4 lg:w-full mx-auto object-contain transform rotate-[25deg] hover:rotate-[20deg] transition-transform duration-500 filter drop-shadow-(0_25px_35px_rgba(0,0,0,0.4))"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
