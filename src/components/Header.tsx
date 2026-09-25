import React from 'react';
import { ShoppingBag, Clock, Phone, MapPin, Instagram } from 'lucide-react';

export interface HeaderProps {
  itemCount: number;
  onOpenCart: () => void;
  currentView: 'home' | 'menu';
  onNavigate: (view: 'home' | 'menu') => void;
}

export const Header: React.FC<HeaderProps> = ({
  itemCount,
  onOpenCart,
  currentView,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-amber-500 text-slate-900 border-b-4 border-slate-900 shadow-retro">
      {/* Top Banner / Horarios & Redes */}
      <div className="bg-slate-900 text-amber-100 text-xs sm:text-sm font-bold py-1.5 px-3 flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400 inline" />
            Abierto de 20:00 a 00:30 hs
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://maps.app.goo.gl/pj1xdjjb5M7FxLtZ7"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-amber-300 transition-colors text-xs"
            title="Ver ubicación en Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 text-red-500 inline" />
            <span className="hidden sm:inline">Entre Ríos, San Luis</span>
          </a>

          <span className="text-slate-600">|</span>

          <a
            href="https://www.instagram.com/la.exquisitasl/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-pink-300 transition-colors text-xs"
            title="Instagram @la.exquisitasl"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400 inline" />
            <span className="hidden sm:inline">@la.exquisitasl</span>
          </a>

          <span className="hidden sm:inline-block text-slate-600">|</span>

          <a
            href="tel:+5492664193004"
            className="flex items-center gap-1 hover:text-emerald-300 transition-colors text-xs"
            title="Llamar o WhatsApp"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400 inline" />
            <span>266 419-3004</span>
          </a>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none"
        >
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-200 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-retro-sm group-hover:scale-105 transition-transform overflow-hidden p-0.5 shrink-0">
            <img
              src="/assets/logo-pinup-transparent.png"
              alt="Logo La Exquisita"
              className="w-full h-full object-contain -rotate-3"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase font-serif drop-shadow-sm">
                La Exquisita
              </span>
            </div>
            <p className="hidden sm:block text-[11px] sm:text-xs font-black tracking-wider uppercase text-red-800 -mt-1">
              Rotisería • Pizzería • Masa Casera
            </p>
          </div>
        </a>

        {/* View Switcher: Inicio / Carta con indicador visual activo */}
        <div className="flex items-center bg-amber-600/25 p-1 rounded-2xl border-2 border-slate-900 shadow-retro-sm">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              currentView === 'home'
                ? 'bg-slate-900 text-amber-300 shadow-retro-sm'
                : 'text-slate-950 hover:bg-amber-400/50'
            }`}
          >
            <span>🏠</span>
            <span className="inline">Inicio</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              currentView === 'menu'
                ? 'bg-slate-900 text-amber-300 shadow-retro-sm'
                : 'text-slate-950 hover:bg-amber-400/50'
            }`}
          >
            <span>📋</span>
            <span className="inline">Carta</span>
          </button>
        </div>

        {/* Right CTA: Cart Trigger */}
        <button
          onClick={onOpenCart}
          type="button"
          aria-label={`Ver carrito con ${itemCount} productos`}
          className="relative flex items-center gap-1.5 sm:gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl border-2 border-slate-900 shadow-retro active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0"
        >
          <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6" />
          <span className="hidden md:inline text-sm font-extrabold tracking-wide uppercase">
            Mi Pedido
          </span>
          {itemCount > 0 && (
            <span className="bg-amber-400 text-slate-950 text-xs sm:text-sm font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-retro-sm animate-bounce">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
