import React, { useEffect } from 'react';
import { CartItem, CartTotals } from '../domain/models';
import { formatMoneyARS } from '../domain/pricing';
import { formatFlavorSummary } from '../domain/empanada-rules';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totals: CartTotals;
  onUpdateQuantity: (lineId: string, newQty: number) => void;
  onRemoveItem: (lineId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  totals,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-[#FFFBEB] h-full flex flex-col border-l-4 border-slate-900 shadow-retro-xl animate-slideLeft">
        {/* Drawer Header */}
        <div className="bg-amber-400 p-4 border-b-3 border-slate-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center border-2 border-slate-900 shadow-retro-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 id="cart-drawer-title" className="text-xl font-black text-slate-900 uppercase font-serif">
                Mi Comanda
              </h2>
              <span className="text-xs font-bold text-red-800">
                {totals.itemCount} {totals.itemCount === 1 ? 'ítem cargado' : 'ítems cargados'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar comanda"
            className="p-1.5 rounded-xl bg-white hover:bg-red-600 hover:text-white text-slate-900 border-2 border-slate-900 shadow-retro-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content / Items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 select-none">
              <span className="text-6xl">🍕</span>
              <h3 className="text-lg font-black text-slate-900 uppercase font-serif">
                Tu comanda está vacía
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs font-medium">
                ¡No te quedes con las ganas! Agregá unas ricas pizzas a la piedra, empanadas caseras o unos lomazos al pan.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl border-2 border-slate-900 shadow-retro-sm text-xs sm:text-sm uppercase tracking-wide"
              >
                Volver al Menú
              </button>
            </div>
          ) : (
            items.map((item) => {
              const variantName = item.selectedVariant ? ` (${item.selectedVariant.name})` : '';
              const empanadaSummary = item.modifiers.empanadaFlavors
                ? formatFlavorSummary(item.modifiers.empanadaFlavors)
                : null;
              const comboEmpanadaSummary = item.modifiers.comboEmpanadaFlavors
                ? formatFlavorSummary(item.modifiers.comboEmpanadaFlavors)
                : null;

              return (
                <div
                  key={item.lineId}
                  className="bg-white rounded-xl border-2 border-slate-900 p-3.5 shadow-retro-sm space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-black text-sm sm:text-base text-slate-900 leading-tight">
                        {item.productName}
                        <span className="text-xs text-red-700 font-bold block sm:inline sm:ml-1">
                          {variantName}
                        </span>
                      </h4>

                      {/* Modifiers info */}
                      {item.modifiers.sideDish && (
                        <span className="inline-block text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md mt-1 border border-amber-300">
                          ↳ Guarnición: {item.modifiers.sideDish === 'PAPAS_FRITAS' ? 'Papas Fritas' : 'Ensalada'}
                        </span>
                      )}

                      {empanadaSummary && (
                        <p className="text-[11px] font-bold text-slate-700 mt-1 bg-amber-50 p-1.5 rounded-md border border-amber-200">
                          🥟 Sabores: {empanadaSummary}
                        </p>
                      )}

                      {comboEmpanadaSummary && (
                        <p className="text-[11px] font-bold text-slate-700 mt-1 bg-amber-50 p-1.5 rounded-md border border-amber-200">
                          🥟 Empanadas: {comboEmpanadaSummary}
                        </p>
                      )}

                      {item.modifiers.customNotes && (
                        <p className="text-[11px] italic text-slate-500 mt-1 break-words">
                          Nota: &ldquo;{item.modifiers.customNotes}&rdquo;
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.lineId)}
                      aria-label={`Eliminar ${item.productName}`}
                      className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                      title="Quitar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Price & Stepper row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="font-black text-sm sm:text-base text-slate-900 font-mono">
                      ${formatMoneyARS(item.subtotal)}
                    </span>

                    <div className="flex items-center gap-2 bg-amber-100 px-2 py-1 rounded-lg border border-slate-900">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.lineId, item.quantity - 1)}
                        aria-label="Restar 1"
                        className="w-6 h-6 rounded bg-white hover:bg-red-500 hover:text-white border border-slate-900 flex items-center justify-center font-black transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-6 text-center font-black text-xs sm:text-sm text-slate-900">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.lineId, item.quantity + 1)}
                        aria-label="Sumar 1"
                        className="w-6 h-6 rounded bg-amber-400 hover:bg-emerald-500 hover:text-white border border-slate-900 flex items-center justify-center font-black transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer / Subtotals & Proceed CTA */}
        {items.length > 0 && (
          <div className="bg-amber-200/90 p-4 border-t-3 border-slate-900 space-y-3">
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Subtotal Productos:</span>
                <span className="font-mono">${formatMoneyARS(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800">
                <span>Envío:</span>
                <span className="text-red-700 italic">
                  {typeof totals.deliveryFee === 'number'
                    ? `$${formatMoneyARS(totals.deliveryFee)}`
                    : 'A coordinar'}
                </span>
              </div>
              <div className="flex justify-between font-black text-base sm:text-lg text-slate-950 pt-2 border-t border-slate-900/30">
                <span>TOTAL ESTIMADO:</span>
                <span className="font-mono text-red-700">${formatMoneyARS(totals.total)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-xl border-2 border-slate-900 shadow-retro active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Avanzar al Checkout</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onClearCart}
                className="text-xs font-bold text-slate-600 hover:text-red-600 py-1 transition-colors text-center"
              >
                Vaciar comanda completa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
