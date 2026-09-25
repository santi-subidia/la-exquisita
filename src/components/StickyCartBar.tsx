import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartTotals } from '../domain/models';
import { formatMoneyARS } from '../domain/pricing';

interface StickyCartBarProps {
  totals: CartTotals;
  onOpenCart: () => void;
}

export const StickyCartBar: React.FC<StickyCartBarProps> = ({ totals, onOpenCart }) => {
  if (totals.itemCount <= 0) return null;

  return (
    <aside
      aria-label="Resumen rápido del pedido"
      className="fixed bottom-16 sm:bottom-4 left-0 right-0 z-40 p-3 sm:p-4 pointer-events-none animate-fadeIn"
    >
      <div className="max-w-xl mx-auto pointer-events-auto">
        <button
          type="button"
          onClick={onOpenCart}
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl border-3 border-slate-900 shadow-retro-xl p-3 sm:p-4 flex items-center justify-between gap-3 active:translate-x-0.5 active:translate-y-0.5 active:shadow-retro transition-all group"
        >
          {/* Left: Counter & Label */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-left">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center font-black text-sm sm:text-base shadow-retro-sm">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs uppercase font-black text-amber-200 block tracking-wider">
                {totals.itemCount} {totals.itemCount === 1 ? 'producto' : 'productos'} en comanda
              </span>
              <span className="text-sm sm:text-lg font-black text-white">
                Ver mi Pedido
              </span>
            </div>
          </div>

          {/* Right: Subtotal & Arrow CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="text-right">
              <span className="text-[9px] sm:text-xs text-amber-200 block uppercase font-bold">
                Subtotal
              </span>
              <span className="text-base sm:text-xl font-black text-white font-mono">
                ${formatMoneyARS(totals.subtotal)}
              </span>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white text-slate-900 border-2 border-slate-900 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 font-black" />
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
};
