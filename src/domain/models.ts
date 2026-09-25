export type CategoryCode = 
  | 'PIZZAS'
  | 'PROMOS_COMBOS'
  | 'ESPECIALIDADES'
  | 'SANDWICHS'
  | 'HAMBURGUESAS'
  | 'EMPANADAS'
  | 'PAPAS_FRITAS'
  | 'MILANESAS'
  | 'MINUTAS_TARTAS';

export type SizeVariantCode = 'ENTERA' | 'MEDIA' | 'CHICA' | 'GRANDE';
export type SideDishOption = 'PAPAS_FRITAS' | 'ENSALADA';

export type EmpanadaFlavorCode = 
  | 'CARNE'
  | 'POLLO'
  | 'ARABES'
  | 'CAPRESSE'
  | 'VERDURA'
  | 'HUMITA'
  | 'JAMON_Y_QUESO'
  | 'TOMATE_CEBOLLA_QUESO';

export type DeliveryMethod = 'DELIVERY' | 'PICKUP';
export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA' | 'MERCADOPAGO';
export type MoneyARS = number;

export interface Category {
  code: CategoryCode;
  name: string;
  badge?: string;
  description?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sizeCode: SizeVariantCode;
  price: MoneyARS;
  description?: string;
}

export interface ModifierRule {
  requiresSideDish?: boolean;
  isEmpanadaPack?: boolean;
  empanadaQuota?: 6 | 12;
  isComboWithEmpanadas?: boolean;
  comboEmpanadasQuota?: 6 | 12;
  hasPromo2x?: boolean;
  promo2xPrice?: MoneyARS;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: CategoryCode;
  description: string;
  basePrice?: MoneyARS;
  variants?: ProductVariant[];
  modifierRule?: ModifierRule;
  image?: string;
  isFeatured?: boolean;
  badge?: string;
}

export type FlavorSelection = Partial<Record<EmpanadaFlavorCode, number>>;

export interface CartItemModifierSelection {
  sideDish?: SideDishOption;
  empanadaFlavors?: FlavorSelection;
  comboEmpanadaFlavors?: FlavorSelection;
  customNotes?: string;
}

export interface CartItem {
  lineId: string;
  productId: string;
  productName: string;
  selectedVariant?: ProductVariant;
  modifiers: CartItemModifierSelection;
  unitPrice: MoneyARS;
  quantity: number;
  subtotal: MoneyARS;
}

export interface CartTotals {
  itemCount: number;
  subtotal: MoneyARS;
  deliveryFee: MoneyARS | 'A_COORDINAR';
  total: MoneyARS;
  savings?: MoneyARS;
}

export interface DeliveryAddress {
  street: string;
  number: string;
  floorOrApt?: string;
  betweenStreets?: string;
  referenceNotes?: string;
}

export interface CheckoutForm {
  customerName: string;
  customerPhone: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: DeliveryAddress;
  pickupEstimatedTime?: string;
  paymentMethod: PaymentMethod;
  cashAmountPaid?: MoneyARS;
  generalNotes?: string;
}

export interface OrderPayload {
  ticketId: string;
  createdAt: Date;
  customer: CheckoutForm;
  items: CartItem[];
  totals: CartTotals;
  canonicalMessage: string;
  whatsAppUrl: string;
}
