import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Product,
  ProductVariant,
  CartItem,
  CartItemModifierSelection,
  CartTotals,
  DeliveryMethod,
  MoneyARS,
} from '../domain/models';
import { calculateLinePrice, calculateCartTotals } from '../domain/pricing';
import { StoragePort } from '../domain/ports/StoragePort';
import { localStorageAdapter } from '../adapters/localStorageAdapter';
import { PRODUCTS } from '../data/catalog';

export const CART_STORAGE_KEY = 'la_exquisita_cart_v1';

export function generateLineId(
  productId: string,
  variantId?: string,
  modifiers?: CartItemModifierSelection
): string {
  const parts: string[] = [productId];

  if (variantId) {
    parts.push(`var:${variantId}`);
  }

  if (modifiers?.sideDish) {
    parts.push(`side:${modifiers.sideDish}`);
  }

  if (modifiers?.empanadaFlavors) {
    const sortedEmpanadas = Object.entries(modifiers.empanadaFlavors)
      .filter(([_, count]) => count !== undefined && count > 0)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([flavor, count]) => `${flavor}:${count}`)
      .join(',');
    if (sortedEmpanadas) {
      parts.push(`emp:[${sortedEmpanadas}]`);
    }
  }

  if (modifiers?.comboEmpanadaFlavors) {
    const sortedCombo = Object.entries(modifiers.comboEmpanadaFlavors)
      .filter(([_, count]) => count !== undefined && count > 0)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([flavor, count]) => `${flavor}:${count}`)
      .join(',');
    if (sortedCombo) {
      parts.push(`combo:[${sortedCombo}]`);
    }
  }

  if (modifiers?.customNotes && modifiers.customNotes.trim()) {
    parts.push(`notes:${modifiers.customNotes.trim().toLowerCase()}`);
  }

  return parts.join('|');
}

export interface UseCartOptions {
  storage?: StoragePort;
  deliveryMethod?: DeliveryMethod;
  customDeliveryFee?: MoneyARS | 'A_COORDINAR';
}

export interface AddItemOptions {
  variant?: ProductVariant;
  modifiers?: CartItemModifierSelection;
  quantity?: number;
}

export function useCart(options: UseCartOptions = {}) {
  const storage = options.storage ?? localStorageAdapter;
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    try {
      const stored = storage.getItem<CartItem[]>(CART_STORAGE_KEY);
      if (Array.isArray(stored)) {
        setItems(stored);
      }
    } catch (err) {
      console.warn('[useCart] Failed to load cart from storage:', err);
    } finally {
      setIsLoaded(true);
    }
  }, [storage]);

  // Persist to storage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      storage.setItem(CART_STORAGE_KEY, items);
    } catch (err) {
      console.warn('[useCart] Failed to persist cart to storage:', err);
    }
  }, [items, isLoaded, storage]);

  const addItem = useCallback(
    (product: Product, itemOptions: AddItemOptions = {}) => {
      const quantityToAdd = Math.max(1, itemOptions.quantity ?? 1);
      const modifiers = itemOptions.modifiers ?? {};
      const lineId = generateLineId(product.id, itemOptions.variant?.id, modifiers);

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((it) => it.lineId === lineId);

        if (existingIndex >= 0) {
          const existing = prevItems[existingIndex];
          const newQuantity = existing.quantity + quantityToAdd;
          const priceCalc = calculateLinePrice(product, itemOptions.variant, newQuantity);

          const updated = [...prevItems];
          updated[existingIndex] = {
            ...existing,
            quantity: newQuantity,
            unitPrice: priceCalc.unitPrice,
            subtotal: priceCalc.subtotal,
          };
          return updated;
        } else {
          const priceCalc = calculateLinePrice(product, itemOptions.variant, quantityToAdd);
          const newItem: CartItem = {
            lineId,
            productId: product.id,
            productName: product.name,
            selectedVariant: itemOptions.variant,
            modifiers,
            unitPrice: priceCalc.unitPrice,
            quantity: quantityToAdd,
            subtotal: priceCalc.subtotal,
          };
          return [...prevItems, newItem];
        }
      });
    },
    []
  );

  const updateQuantity = useCallback((lineId: string, newQuantity: number) => {
    setItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((it) => it.lineId !== lineId);
      }

      return prevItems.map((item) => {
        if (item.lineId !== lineId) return item;

        const product = PRODUCTS.find((p) => p.id === item.productId);
        let subtotal = item.unitPrice * newQuantity;
        let unitPrice = item.unitPrice;

        if (product) {
          const priceCalc = calculateLinePrice(product, item.selectedVariant, newQuantity);
          subtotal = priceCalc.subtotal;
          unitPrice = priceCalc.unitPrice;
        }

        return {
          ...item,
          quantity: newQuantity,
          unitPrice,
          subtotal,
        };
      });
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prevItems) => prevItems.filter((it) => it.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      storage.removeItem(CART_STORAGE_KEY);
    } catch (err) {
      console.warn('[useCart] Failed to clear cart storage:', err);
    }
  }, [storage]);

  const totals: CartTotals = useMemo(() => {
    return calculateCartTotals(
      items,
      options.deliveryMethod ?? 'DELIVERY',
      options.customDeliveryFee ?? 'A_COORDINAR'
    );
  }, [items, options.deliveryMethod, options.customDeliveryFee]);

  return {
    items,
    totals,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    isLoaded,
  };
}
