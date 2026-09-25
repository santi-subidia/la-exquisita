import React from 'react';
import { ShoppingBag, Clock, Phone, Utensils } from 'lucide-react';

interface HeaderProps {
  itemCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ itemCount, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-30 bg-amber-500 text-slate-900 border-b-4 border-slate-900 shadow-retro">
      {/* Top Banner / Horarios & Contacto */}
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
            href="tel:+5492664193004"
            className="flex items-center gap-1 hover:text-amber-300 transition-colors text-xs sm:text-sm"
            title="Llamar a La Exquisita"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400 inline" />
            <span>266 419-3004</span>
          </a>
          <span className="hidden sm:inline-block text-slate-500">|</span>
          <span className="hidden sm:inline-block text-amber-300 font-semibold tracking-wide">
            📍 San Luis, Argentina
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <a href="#inicio" className="flex items-center gap-2.5 group focus:outline-none">
          <div className="w-11 h-11 sm:w-13 sm:h-13 bg-red-600 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-retro-sm group-hover:scale-105 transition-transform">
            <Utensils className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase font-serif drop-shadow-sm">
                La Exquisita
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-red-800 -mt-1">
              Rotisería • Pizzería • Bodegón
            </p>
          </div>
        </a>

        {/* Right CTA: Cart Trigger */}
        <button
          onClick={onOpenCart}
          type="button"
          aria-label={`Ver carrito con ${itemCount} productos`}
          className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border-2 border-slate-900 shadow-retro active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="hidden sm:inline text-sm font-extrabold tracking-wide uppercase">
            Mi Pedido
          </span>
          {itemCount > 0 && (
            <span className="bg-amber-400 text-slate-950 text-xs sm:text-sm font-black w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-retro-sm animate-bounce">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
