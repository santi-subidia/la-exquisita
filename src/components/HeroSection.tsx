import React from 'react';
import { ArrowDown, Flame, Award, Heart } from 'lucide-react';

interface HeroSectionProps {
  onScrollToMenu: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToMenu }) => {
  return (
    <section id="inicio" className="relative bg-gradient-to-b from-amber-400 via-amber-300 to-amber-100 border-b-4 border-slate-900 overflow-hidden py-8 sm:py-14 px-4">
      {/* Decorative Bodegón background elements */}
      <div className="absolute top-2 left-4 text-amber-500/20 text-8xl font-black select-none pointer-events-none -rotate-12 hidden md:block">
        PIZZA
      </div>
      <div className="absolute bottom-2 right-4 text-amber-500/20 text-8xl font-black select-none pointer-events-none rotate-6 hidden md:block">
        LOMITO
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Traditional Bodegón Copy & CTAs */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6">
          {/* Badge de Sabor Tradicional */}
          <div className="inline-flex items-center gap-2 bg-red-600 text-amber-100 px-3.5 py-1.5 rounded-full border-2 border-slate-900 shadow-retro-sm text-xs sm:text-sm font-black tracking-wide uppercase">
            <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Rotisería & Pizzería Tradicional de San Luis</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight uppercase font-serif drop-shadow-sm">
            El verdadero sabor de barrio,{' '}
            <span className="text-red-600 underline decoration-amber-500 decoration-wavy">
              directo a tu mesa
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-800 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed bg-amber-200/60 p-3 sm:p-4 rounded-xl border border-amber-300/80">
            Platos abundantes, masa artesanal amasada todos los días, lomitos XL con papas fritas y las empanadas criollas más jugosas de la ciudad.
            Pedí online en minutos y envialo directo a nuestro WhatsApp sin vueltas.
          </p>

          {/* Highlights pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-xs sm:text-sm font-bold text-slate-900">
            <span className="bg-white/90 px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-retro-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Masa 100% Casera
            </span>
            <span className="bg-white/90 px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-retro-sm flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-red-500" /> Cocción al Horno Criollo
            </span>
            <span className="bg-white/90 px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-retro-sm flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-500" /> Porciones Bodegón
            </span>
          </div>

          {/* CTA Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <button
              onClick={onScrollToMenu}
              type="button"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 text-white text-base sm:text-lg font-black px-6 py-3.5 rounded-xl border-3 border-slate-900 shadow-retro active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all group"
            >
              <span>Explorar el Menú Completo</span>
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
            <span className="text-xs sm:text-sm text-slate-700 font-semibold italic">
              ⚡ Armá tu pedido sin registrarte
            </span>
          </div>
        </div>

        {/* Right Column: Floating Chroma-Key Cutout Tarta & Rotating Badge */}
        <div className="lg:col-span-5 flex justify-center items-center relative py-4">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Background warm halo / plate effect */}
            <div className="absolute inset-4 rounded-full bg-amber-500/30 border-4 border-dashed border-amber-600/40 animate-spin-slow pointer-events-none" />

            {/* Rotating retro serrated badge */}
            <div className="absolute -top-2 -right-2 sm:top-2 sm:right-2 z-20">
              <div className="relative animate-spin-slow">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-600 border-3 border-slate-900 shadow-retro flex flex-col items-center justify-center text-center p-2 text-white">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-tighter leading-tight text-amber-200">
                    ¡Masa Casera!
                  </span>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-white leading-tight">
                    La Exquisita
                  </span>
                  <span className="text-[9px] font-bold text-amber-300">★ 100% Artesanal ★</span>
                </div>
              </div>
            </div>

            {/* Floating Hero Tarta with float animation */}
            <div className="relative z-10 animate-float drop-shadow-[0_15px_15px_rgba(0,0,0,0.35)]">
              <img
                src="/assets/comida/tarta-hero-transparent.png"
                alt="Tarta Casera Especial La Exquisita - Masa casera de rotisería"
                className="w-56 sm:w-72 md:w-80 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={onScrollToMenu}
                onError={(e) => {
                  // Fallback to the root assets path if nested fails
                  const target = e.currentTarget;
                  if (target.src !== '/assets/tarta-hero-transparent.png') {
                    target.src = '/assets/tarta-hero-transparent.png';
                  }
                }}
              />
            </div>

            {/* Price / Quality stamp under image */}
            <div className="absolute -bottom-3 sm:bottom-0 bg-amber-100 text-slate-900 border-2 border-slate-900 px-4 py-1.5 rounded-lg shadow-retro-sm text-xs sm:text-sm font-black z-20 flex items-center gap-1.5">
              <span>🥧 ¡Probá nuestras Tartas y Minutas!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
