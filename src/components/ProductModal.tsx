import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Product,
  ProductVariant,
  SideDishOption,
  FlavorSelection,
  EmpanadaFlavorCode,
} from '../domain/models';
import { EMPANADA_FLAVORS } from '../data/catalog';
import {
  getTotalEmpanadasCount,
  getRemainingQuota,
  canAddEmpanada,
  validateEmpanadaQuota,
  incrementFlavor,
  decrementFlavor,
} from '../domain/empanada-rules';
import { calculateLinePrice, formatMoneyARS } from '../domain/pricing';
import { X, Plus, Minus, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import { AddItemOptions } from '../hooks/useCart';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, options: AddItemOptions) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Form states
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedSideDish, setSelectedSideDish] = useState<SideDishOption | undefined>(undefined);
  const [empanadaFlavors, setEmpanadaFlavors] = useState<FlavorSelection>({});
  const [customNotes, setCustomNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Determine required quotas
  const empanadaQuota = useMemo(() => {
    if (!product?.modifierRule) return 0;
    if (product.modifierRule.isEmpanadaPack && product.modifierRule.empanadaQuota) {
      return product.modifierRule.empanadaQuota;
    }
    if (product.modifierRule.isComboWithEmpanadas && product.modifierRule.comboEmpanadasQuota) {
      return product.modifierRule.comboEmpanadasQuota;
    }
    return 0;
  }, [product]);

  const requiresSideDish = Boolean(product?.modifierRule?.requiresSideDish);

  // Initialize or reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
      setSelectedSideDish(undefined);
      setEmpanadaFlavors({});
      setCustomNotes('');
      setQuantity(1);
      setValidationError(null);
    }
  }, [product, requiresSideDish]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
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

  // Calculate live prices
  const linePriceCalc = useMemo(() => {
    if (!product) return { unitPrice: 0, subtotal: 0, savings: 0 };
    return calculateLinePrice(product, selectedVariant, quantity);
  }, [product, selectedVariant, quantity]);

  // Empanadas quota tracking
  const currentEmpanadasCount = useMemo(() => {
    return getTotalEmpanadasCount(empanadaFlavors);
  }, [empanadaFlavors]);

  const remainingEmpanadas = useMemo(() => {
    if (empanadaQuota === 0) return 0;
    return getRemainingQuota(empanadaFlavors, empanadaQuota);
  }, [empanadaFlavors, empanadaQuota]);

  // Flavor handlers
  const handleAddFlavor = (code: EmpanadaFlavorCode) => {
    if (empanadaQuota === 0 || !canAddEmpanada(empanadaFlavors, empanadaQuota)) return;
    setEmpanadaFlavors((prev) => incrementFlavor(prev, code, empanadaQuota));
    setValidationError(null);
  };

  const handleRemoveFlavor = (code: EmpanadaFlavorCode) => {
    setEmpanadaFlavors((prev) => decrementFlavor(prev, code));
    setValidationError(null);
  };

  // Submit to cart
  const handleAddToCart = () => {
    if (!product) return;

    // Validate side dish if required
    if (requiresSideDish && !selectedSideDish) {
      setValidationError('Por favor seleccioná una guarnición (Papas Fritas o Ensalada)');
      return;
    }

    // Validate empanadas quota
    if (empanadaQuota > 0) {
      const quotaCheck = validateEmpanadaQuota(empanadaFlavors, empanadaQuota as 6 | 12);
      if (!quotaCheck.isValid) {
        setValidationError(quotaCheck.message);
        return;
      }
    }

    // Prepare modifiers payload
    const isCombo = Boolean(product.modifierRule?.isComboWithEmpanadas);
    onAddToCart(product, {
      variant: selectedVariant,
      modifiers: {
        sideDish: selectedSideDish,
        empanadaFlavors: !isCombo && empanadaQuota > 0 ? empanadaFlavors : undefined,
        comboEmpanadaFlavors: isCombo && empanadaQuota > 0 ? empanadaFlavors : undefined,
        customNotes: customNotes.trim() || undefined,
      },
      quantity,
    });

    onClose();
  };

  if (!isOpen || !product) return null;

  const isEmpanadaComplete = empanadaQuota === 0 || remainingEmpanadas === 0;
  const isSideDishComplete = !requiresSideDish || Boolean(selectedSideDish);
  const canAddToCart = isEmpanadaComplete && isSideDishComplete;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-[#FFFBEB] w-full max-w-xl rounded-2xl border-4 border-slate-900 shadow-retro-xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-amber-400 p-4 border-b-3 border-slate-900 flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-red-800">
              Personalizá tu pedido
            </span>
            <h2
              id="modal-product-title"
              className="text-xl sm:text-2xl font-black text-slate-900 uppercase font-serif"
            >
              {product.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 font-medium mt-0.5">
              {product.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-xl bg-white hover:bg-red-600 hover:text-white text-slate-900 border-2 border-slate-900 shadow-retro-sm transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable configuration options */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* 1. Size Variants (Entera / Media / Chica / Grande) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-xs sm:text-sm font-black uppercase text-slate-900 tracking-wide">
                Elegí el Tamaño:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((v) => {
                  const isChecked = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-xl border-2 border-slate-900 text-left transition-all ${
                        isChecked
                          ? 'bg-amber-400 text-slate-950 shadow-retro font-black scale-[1.02]'
                          : 'bg-white hover:bg-amber-50 text-slate-800 font-bold shadow-retro-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base font-black uppercase">{v.name}</span>
                        {isChecked && <Check className="w-4 h-4 text-slate-900" />}
                      </div>
                      <div className="text-xs sm:text-sm font-black text-red-700 mt-1">
                        ${formatMoneyARS(v.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Side Dish Selector (Obligatorio para Milanesas y Minutas) */}
          {requiresSideDish && (
            <div className="space-y-2.5 bg-amber-200/60 p-4 rounded-xl border-2 border-slate-900">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-black uppercase text-slate-900 tracking-wide">
                  Guarnición Incluida (Obligatoria):
                </label>
                <span className="text-[10px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded-full">
                  Elegí 1
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSideDish('PAPAS_FRITAS');
                    setValidationError(null);
                  }}
                  className={`p-3 rounded-xl border-2 border-slate-900 text-center transition-all ${
                    selectedSideDish === 'PAPAS_FRITAS'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-retro scale-[1.02]'
                      : 'bg-white hover:bg-amber-50 text-slate-800 font-bold shadow-retro-sm'
                  }`}
                >
                  <span className="text-xl block mb-1">🍟</span>
                  <span className="text-xs sm:text-sm">Papas Fritas</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSideDish('ENSALADA');
                    setValidationError(null);
                  }}
                  className={`p-3 rounded-xl border-2 border-slate-900 text-center transition-all ${
                    selectedSideDish === 'ENSALADA'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-retro scale-[1.02]'
                      : 'bg-white hover:bg-amber-50 text-slate-800 font-bold shadow-retro-sm'
                  }`}
                >
                  <span className="text-xl block mb-1">🥗</span>
                  <span className="text-xs sm:text-sm">Ensalada Mixta</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. Empanada Flavors Quota Selector */}
          {empanadaQuota > 0 && (
            <div className="space-y-3 bg-amber-100 p-4 rounded-2xl border-2 border-slate-900 shadow-retro-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase text-slate-900 tracking-wide">
                    Selección de Sabores al Horno
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-700 font-semibold">
                    Completá exactamente {empanadaQuota} empanadas a elección
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-xl border-2 border-slate-900 text-xs font-black shadow-retro-sm ${
                    isEmpanadaComplete ? 'bg-emerald-400 text-slate-950' : 'bg-red-500 text-white'
                  }`}
                >
                  {currentEmpanadasCount} / {empanadaQuota}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-amber-200 h-3 rounded-full border-2 border-slate-900 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isEmpanadaComplete ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, (currentEmpanadasCount / empanadaQuota) * 100)}%` }}
                />
              </div>

              {/* Flavors list with steppers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {EMPANADA_FLAVORS.map((flavor) => {
                  const currentCount = empanadaFlavors[flavor.code] || 0;
                  const canAdd = empanadaQuota > 0 && canAddEmpanada(empanadaFlavors, empanadaQuota as 6 | 12);

                  return (
                    <div
                      key={flavor.code}
                      className={`p-2.5 rounded-xl border-2 border-slate-900 flex items-center justify-between transition-colors ${
                        currentCount > 0 ? 'bg-amber-300/80 shadow-retro-sm' : 'bg-white'
                      }`}
                    >
                      <div className="pr-2">
                        <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                          {flavor.name}
                        </span>
                        <span className="text-[10px] text-slate-600 block line-clamp-1">
                          {flavor.description}
                        </span>
                      </div>

                      {/* Stepper buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveFlavor(flavor.code)}
                          disabled={currentCount === 0}
                          aria-label={`Quitar ${flavor.name}`}
                          className="w-7 h-7 rounded-lg bg-amber-200 hover:bg-red-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none border border-slate-900 flex items-center justify-center font-black transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="w-6 text-center text-xs sm:text-sm font-black text-slate-900">
                          {currentCount}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleAddFlavor(flavor.code)}
                          disabled={!canAdd}
                          aria-label={`Agregar ${flavor.name}`}
                          className="w-7 h-7 rounded-lg bg-amber-400 hover:bg-emerald-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none border border-slate-900 flex items-center justify-center font-black transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!isEmpanadaComplete && (
                <p className="text-xs font-bold text-red-600 text-center animate-pulse">
                  ⚠️ Faltan {remainingEmpanadas} empanadas para completar la cuota.
                </p>
              )}
            </div>
          )}

          {/* 4. Customer Custom Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-black uppercase text-slate-900 tracking-wide">
              Aclaraciones para la cocina (Opcional):
            </label>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Ej: Sin orégano, bien doradita, salsa aparte, etc..."
              rows={2}
              maxLength={200}
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 font-medium text-xs sm:text-sm p-3 rounded-xl border-2 border-slate-900 shadow-retro-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="bg-red-100 border-2 border-red-600 text-red-800 p-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-bold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Modal Footer / Quantity Stepper & Add CTA */}
        <div className="bg-amber-200 p-4 border-t-3 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quantity stepper */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-slate-900 shadow-retro-sm w-full sm:w-auto justify-center">
            <span className="text-xs font-bold uppercase text-slate-700 mr-1">Cantidad:</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Disminuir cantidad"
              className="w-7 h-7 rounded-lg bg-amber-200 hover:bg-amber-300 disabled:opacity-40 border border-slate-900 flex items-center justify-center font-black"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center font-black text-sm text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Aumentar cantidad"
              className="w-7 h-7 rounded-lg bg-amber-200 hover:bg-amber-300 border border-slate-900 flex items-center justify-center font-black"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-black text-sm sm:text-base px-5 py-3 rounded-xl border-2 border-slate-900 shadow-retro active:translate-x-0.5 active:translate-y-0.5 disabled:shadow-none disabled:pointer-events-none transition-all"
          >
            <ShoppingBag className="w-5 h-5 text-amber-200" />
            <span>
              {!isSideDishComplete
                ? 'Elegí la Guarnición (Fritas o Ensalada)'
                : !isEmpanadaComplete
                ? `Faltan ${remainingEmpanadas} empanadas`
                : `Agregar al Pedido • $${formatMoneyARS(linePriceCalc.subtotal)}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
