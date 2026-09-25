import { Product, ProductVariant, CartItem, CartTotals, DeliveryMethod, MoneyARS } from './models';

export interface LinePriceCalculation {
  unitPrice: MoneyARS;
  subtotal: MoneyARS;
  savings: MoneyARS;
}

/**
 * Calculates line price, applying promo 2x rules when applicable.
 * If product has promo2x and quantity >= 2:
 * pairs count = Math.floor(quantity / 2)
 * remainder = quantity % 2
 * subtotal = pairs * promo2xPrice + remainder * basePrice
 */
export function calculateLinePrice(
  product: Product,
  selectedVariant?: ProductVariant,
  quantity: number = 1
): LinePriceCalculation {
  const basePrice = selectedVariant ? selectedVariant.price : (product.basePrice ?? 0);

  if (quantity <= 0) {
    return { unitPrice: basePrice, subtotal: 0, savings: 0 };
  }

  // Check 2x promo
  const hasPromo2x = product.modifierRule?.hasPromo2x && product.modifierRule.promo2xPrice;
  if (hasPromo2x && quantity >= 2) {
    const promo2xPrice = product.modifierRule!.promo2xPrice!;
    const pairs = Math.floor(quantity / 2);
    const remainder = quantity % 2;
    const subtotal = pairs * promo2xPrice + remainder * basePrice;
    const normalPrice = quantity * basePrice;
    const savings = Math.max(0, normalPrice - subtotal);

    return {
      unitPrice: basePrice,
      subtotal,
      savings,
    };
  }

  return {
    unitPrice: basePrice,
    subtotal: basePrice * quantity,
    savings: 0,
  };
}

/**
 * Calculates entire cart totals including subtotals, item count, and delivery fee.
 */
export function calculateCartTotals(
  items: CartItem[],
  deliveryMethod: DeliveryMethod = 'DELIVERY',
  customDeliveryFee?: MoneyARS | 'A_COORDINAR'
): CartTotals {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of items) {
    subtotal += item.subtotal;
    itemCount += item.quantity;
  }

  let deliveryFee: MoneyARS | 'A_COORDINAR' = 0;
  if (deliveryMethod === 'DELIVERY') {
    deliveryFee = customDeliveryFee !== undefined ? customDeliveryFee : 'A_COORDINAR';
  } else {
    deliveryFee = 0;
  }

  const numericDeliveryFee = typeof deliveryFee === 'number' ? deliveryFee : 0;
  const total = subtotal + numericDeliveryFee;

  return {
    itemCount,
    subtotal,
    deliveryFee,
    total,
  };
}

/**
 * Formats a monetary amount in ARS currency (e.g. 16000 -> "16.000")
 */
export function formatMoneyARS(amount: number): string {
  return amount.toLocaleString('es-AR', {
    maximumFractionDigits: 0,
  });
}
