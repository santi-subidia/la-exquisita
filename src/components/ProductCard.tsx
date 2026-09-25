import React, { useState } from 'react';
import { Product } from '../domain/models';
import { formatMoneyARS } from '../domain/pricing';
import { Plus, SlidersHorizontal, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenModal,
  onQuickAdd,
}) => {
  const [imgError, setImgError] = useState(false);

  // Check if product requires customization (variants, side dish, empanada selection, etc.)
  const hasVariants = product.variants && product.variants.length > 0;
  const requiresCustomization =
    hasVariants ||
    product.modifierRule?.requiresSideDish ||
    product.modifierRule?.isEmpanadaPack ||
    product.modifierRule?.isComboWithEmpanadas;

  // Determine displayed price
  let priceDisplay = '';
  if (hasVariants) {
    const minPrice = Math.min(...product.variants!.map((v) => v.price));
    priceDisplay = `Desde $${formatMoneyARS(minPrice)}`;
  } else if (product.basePrice !== undefined) {
    priceDisplay = `$${formatMoneyARS(product.basePrice)}`;
  }

  // Handle action click
  const handleActionClick = () => {
    if (requiresCustomization) {
      onOpenModal(product);
    } else {
      if (onQuickAdd) {
        onQuickAdd(product);
      } else {
        onOpenModal(product);
      }
    }
  };

  // Helper placeholder icon/category tag
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'PIZZAS': return '🍕';
      case 'PROMOS_COMBOS': return '🔥';
      case 'ESPECIALIDADES': return '⭐';
      case 'SANDWICHS': return '🥪';
      case 'HAMBURGUESAS': return '🍔';
      case 'EMPANADAS': return '🥟';
      case 'PAPAS_FRITAS': return '🍟';
      case 'MILANESAS': return '🥩';
      case 'MINUTAS_TARTAS': return '🥧';
      default: return '🍽️';
    }
  };

  return (
    <article className="group bg-[#FFFBEB] rounded-2xl border-3 border-slate-900 shadow-retro hover:shadow-retro-lg transition-all flex flex-col justify-between overflow-hidden p-3 sm:p-0">
      {/* Responsive layout: row on mobile (< sm), column on desktop (sm:) */}
      <div className="flex flex-row sm:flex-col gap-3 sm:gap-0 flex-1">
        {/* Image / Thumbnail Container: 80x80 on mobile, large full width on desktop */}
        <div className="relative w-20 h-20 sm:w-full sm:h-48 bg-amber-200 overflow-hidden rounded-xl sm:rounded-none sm:border-b-3 border-2 sm:border-0 border-slate-900 shrink-0 flex items-center justify-center">
          {product.image && !imgError ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover sm:group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-2 sm:p-4 text-center select-none bg-gradient-to-br from-amber-200 to-amber-300 w-full h-full">
              <span className="text-3xl sm:text-5xl filter drop-shadow">
                {getCategoryEmoji(product.category)}
              </span>
              <span className="hidden sm:inline text-xs font-black uppercase text-slate-800 tracking-wider mt-1">
                Receta de la Casa
              </span>
            </div>
          )}

          {/* Desktop Badges Overlay */}
          <div className="hidden sm:flex absolute top-2 left-2 flex-col gap-1.5 items-start">
            {product.badge && (
              <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg border-2 border-slate-900 shadow-retro-sm uppercase tracking-wide">
                {product.badge}
              </span>
            )}
            {product.modifierRule?.hasPromo2x && product.modifierRule.promo2xPrice && (
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-lg border-2 border-slate-900 shadow-retro-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-red-600 fill-red-600" />
                2x ${formatMoneyARS(product.modifierRule.promo2xPrice)}
              </span>
            )}
            {product.isFeatured && !product.badge && (
              <span className="bg-amber-400 text-slate-900 text-[11px] font-black px-2.5 py-1 rounded-lg border-2 border-slate-900 shadow-retro-sm uppercase tracking-wide">
                ⭐ Favorito
              </span>
            )}
          </div>
        </div>

        {/* Content details */}
        <div className="flex-1 min-w-0 sm:p-5 flex flex-col justify-between sm:justify-start">
          <div>
            {/* Mobile Badges */}
            <div className="flex sm:hidden flex-wrap gap-1 mb-1">
              {product.badge && (
                <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-slate-900 uppercase">
                  {product.badge}
                </span>
              )}
              {product.modifierRule?.hasPromo2x && product.modifierRule.promo2xPrice && (
                <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded border border-slate-900">
                  2x ${formatMoneyARS(product.modifierRule.promo2xPrice)}
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-xl font-black text-slate-900 uppercase font-serif tracking-tight leading-snug group-hover:text-red-600 transition-colors line-clamp-1 sm:line-clamp-none">
              {product.name}
            </h3>

            <p className="text-[11px] sm:text-sm text-slate-600 font-medium mt-0.5 sm:mt-1.5 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Mobile Price & Thumb-friendly action button */}
          <div className="flex sm:hidden items-center justify-between gap-2 mt-2 pt-1.5 border-t border-amber-200">
            <div>
              <span className="text-sm font-black text-slate-950 font-mono">
                {priceDisplay}
              </span>
            </div>
            <button
              type="button"
              onClick={handleActionClick}
              className={`flex items-center gap-1 font-black text-xs px-2.5 py-1.5 rounded-lg border-2 border-slate-900 shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                requiresCustomization
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {requiresCustomization ? (
                <>
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Personalizar</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Footer with Price and Action Button */}
      <div className="hidden sm:flex p-5 pt-0 mt-2 items-center justify-between gap-2 border-t-2 border-amber-200/80 pt-3">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase block -mb-0.5">
            Precio
          </span>
          <span className="text-xl font-black text-slate-900 font-mono">
            {priceDisplay}
          </span>
        </div>

        <button
          type="button"
          onClick={handleActionClick}
          className={`flex items-center gap-1.5 font-black text-sm px-3.5 py-2.5 rounded-xl border-2 border-slate-900 shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all ${
            requiresCustomization
              ? 'bg-amber-400 hover:bg-amber-500 text-slate-950'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {requiresCustomization ? (
            <>
              <SlidersHorizontal className="w-4 h-4" />
              <span>Personalizar</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
