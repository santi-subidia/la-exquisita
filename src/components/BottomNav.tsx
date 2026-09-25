import React from 'react';
import { Home, Utensils, ShoppingBag } from 'lucide-react';

interface BottomNavProps {
  currentView: 'home' | 'menu';
  onNavigate: (view: 'home' | 'menu') => void;
  itemCount: number;
  onOpenCart: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  itemCount,
  onOpenCart,
}) => {
  return (
    <nav
      aria-label="Navegación inferior móvil"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t-3 border-slate-950 shadow-retro-lg px-2 py-1.5 flex items-center justify-around"
    >
      {/* Botón 1: Inicio */}
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all active:scale-95 ${
          currentView === 'home'
            ? 'text-amber-400 font-black'
            : 'text-slate-400 hover:text-slate-200 font-bold'
        }`}
      >
        <Home className={`w-5 h-5 ${currentView === 'home' ? 'text-amber-400 stroke-[2.5]' : 'text-slate-400'}`} />
        <span className="text-[11px] mt-0.5 tracking-tight uppercase">Inicio</span>
      </button>

      {/* Botón 2: Carta */}
      <button
        type="button"
        onClick={() => onNavigate('menu')}
        className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all active:scale-95 ${
          currentView === 'menu'
            ? 'text-amber-400 font-black'
            : 'text-slate-400 hover:text-slate-200 font-bold'
        }`}
      >
        <Utensils className={`w-5 h-5 ${currentView === 'menu' ? 'text-amber-400 stroke-[2.5]' : 'text-slate-400'}`} />
        <span className="text-[11px] mt-0.5 tracking-tight uppercase">Carta</span>
      </button>

      {/* Botón 3: Mi Pedido */}
      <button
        type="button"
        onClick={onOpenCart}
        className="flex-1 relative flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-300 hover:text-amber-400 font-bold transition-all active:scale-95"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-amber-400" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full border border-slate-900 flex items-center justify-center shadow-retro-sm animate-bounce">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight uppercase">Mi Pedido</span>
      </button>
    </nav>
  );
};
