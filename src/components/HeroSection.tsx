import React from 'react';
import { ArrowDown, Flame, Award, Heart, Scale, Utensils } from 'lucide-react';

interface HeroSectionProps {
  onScrollToMenu: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToMenu }) => {
  return (
    <section id="inicio" className="relative bg-gradient-to-b from-amber-400 via-amber-300 to-amber-100 border-b-4 border-slate-900 overflow-hidden py-8 sm:py-12 px-4">
      {/* Decorative background elements */}
      <div className="absolute top-2 left-4 text-amber-500/20 text-8xl font-black select-none pointer-events-none -rotate-12 hidden md:block">
        PIZZA
      </div>
      <div className="absolute bottom-2 right-4 text-amber-500/20 text-8xl font-black select-none pointer-events-none rotate-6 hidden md:block">
        LOMITO
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6">
          {/* Badge de Sabor Tradicional */}
          <div className="inline-flex items-center gap-2 bg-red-600 text-amber-100 px-3.5 py-1.5 rounded-full border-2 border-slate-900 shadow-retro-sm text-xs sm:text-sm font-black tracking-wide uppercase">
            <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Rotisería & Pizzería Tradicional • San Luis</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight uppercase font-serif drop-shadow-sm">
            Auténtica masa casera,{' '}
            <span className="text-red-600 underline decoration-amber-500 decoration-wavy">
              hecha por nosotras
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-800 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed bg-amber-200/60 p-3 sm:p-4 rounded-xl border border-amber-300/80">
            Amasamos diariamente nuestra propia masa casera para pizzas a la piedra crocantes, tartas y empanadas criollas.
            Disfrutá además de lomitos XL con papas fritas, hamburguesas y minutas con el sabor tradicional de San Luis.
          </p>

          {/* Highlights pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs sm:text-sm font-bold text-slate-900">
            <span className="bg-white/95 px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-retro-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" /> Masa 100% Casera
            </span>
            <span className="bg-white/95 px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-retro-sm flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" /> Comida por Peso en el Local
            </span>
            <span className="bg-white/95 px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-retro-sm flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-red-600" /> Menú del Día Rotativo
            </span>
            <span className="bg-white/95 px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-retro-sm flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-500" /> Porciones Abundantes
            </span>
          </div>

          {/* CTA Button & Mascot Speech Box */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <button
              onClick={onScrollToMenu}
              type="button"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 text-white text-base sm:text-lg font-black px-6 py-3.5 rounded-xl border-3 border-slate-900 shadow-retro active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all group"
            >
              <span>Pedir de la Carta Online</span>
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>

            {/* Mascot Callout */}
            <div className="flex items-center gap-2.5 bg-white/90 px-3 py-2 rounded-xl border-2 border-slate-900 shadow-retro-sm text-left">
              <img
                src="/assets/logo-pinup-transparent.png"
                alt="La Exquisita"
                className="w-9 h-9 object-contain shrink-0"
              />
              <span className="text-[11px] sm:text-xs text-slate-800 font-extrabold leading-tight">
                ¡Llega directo al cajero por WhatsApp! 📲
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Chroma-Key Cutout Tarta, Pinup Mascot & Rotating Badge */}
        <div className="lg:col-span-5 flex justify-center items-center relative py-4">
          <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex items-center justify-center">
            {/* Background warm halo */}
            <div className="absolute inset-4 rounded-full bg-amber-500/30 border-4 border-dashed border-amber-600/40 animate-spin-slow pointer-events-none" />

            {/* Rotating retro badge */}
            <div className="absolute -top-3 -right-2 sm:top-0 sm:right-0 z-20">
              <div className="relative animate-spin-slow">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-600 border-3 border-slate-900 shadow-retro flex flex-col items-center justify-center text-center p-2 text-white">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-tighter leading-tight text-amber-200">
                    ¡Masa Casera!
                  </span>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-white leading-tight">
                    La Exquisita
                  </span>
                  <span className="text-[9px] font-bold text-amber-300">★ Elaboración Propia ★</span>
                </div>
              </div>
            </div>

            {/* Pin-up mascot badge over bottom left */}
            <div className="absolute -bottom-2 -left-2 sm:bottom-2 sm:left-2 z-20 bg-white p-2 rounded-2xl border-3 border-slate-900 shadow-retro flex items-center gap-2 max-w-[200px]">
              <img
                src="/assets/logo-pinup-transparent.png"
                alt="La Exquisita al teléfono"
                className="w-12 h-12 object-contain shrink-0"
              />
              <div className="text-[11px] font-black leading-tight text-slate-900">
                ¡Hola! Tomamos tu pedido online
              </div>
            </div>

            {/* Floating Hero Tarta */}
            <div className="relative z-10 animate-float drop-shadow-[0_15px_15px_rgba(0,0,0,0.35)]">
              <img
                src="/assets/comida/tarta-hero-transparent.png"
                alt="Tarta con masa casera de La Exquisita"
                className="w-60 sm:w-72 md:w-80 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                title="Tarta con auténtica masa casera de La Exquisita"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
