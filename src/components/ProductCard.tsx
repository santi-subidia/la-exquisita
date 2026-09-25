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
    <article className="group bg-[#FFFBEB] rounded-2xl border-3 border-slate-900 shadow-retro hover:shadow-retro-lg transition-all flex flex-col justify-between overflow-hidden">
      <div>
        {/* Image / Header area */}
        <div className="relative h-44 sm:h-48 w-full bg-amber-200 overflow-hidden border-b-3 border-slate-900 flex items-center justify-center">
          {product.image && !imgError ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center select-none bg-gradient-to-br from-amber-200 to-amber-300 w-full h-full">
              <span className="text-5xl mb-1 filter drop-shadow">
                {getCategoryEmoji(product.category)}
              </span>
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                Receta de la Casa
              </span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
            {product.badge && (
              <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg border-2 border-slate-900 shadow-retro-sm uppercase tracking-wide">
                {product.badge}
              </span>
            )}
            {product.modifierRule?.hasPromo2x && product.modifierRule.promo2xPrice && (
              <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-lg border-2 border-slate-900 shadow-retro-sm flex items-center gap-1">
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
        <div className="p-4 sm:p-5">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase font-serif tracking-tight leading-snug group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer with Price and Action Button */}
      <div className="p-4 sm:p-5 pt-0 mt-2 flex items-center justify-between gap-2 border-t-2 border-amber-200/80 pt-3">
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase block -mb-0.5">
            Precio
          </span>
          <span className="text-lg sm:text-xl font-black text-slate-900">
            {priceDisplay}
          </span>
        </div>

        <button
          type="button"
          onClick={handleActionClick}
          className={`flex items-center gap-1.5 font-black text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border-2 border-slate-900 shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${
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
