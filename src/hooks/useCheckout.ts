import { useState, useCallback } from 'react';
import {
  CheckoutForm,
  CartItem,
  CartTotals,
  OrderPayload,
  DeliveryMethod,
  PaymentMethod,
} from '../domain/models';
import {
  validateCheckoutForm,
  calculateCashChange,
  CashChangeResult,
} from '../domain/checkout-rules';
import {
  buildCanonicalTicket,
  generateWhatsAppUrl,
  generateTicketId,
  OFFICIAL_WHATSAPP_PHONE,
} from '../domain/whatsapp-compiler';
import { WhatsAppGatewayPort } from '../domain/ports/WhatsAppGatewayPort';
import { ClipboardPort } from '../domain/ports/ClipboardPort';
import { whatsAppGateway as defaultWhatsAppGateway } from '../adapters/whatsAppGateway';
import { clipboardAdapter as defaultClipboardAdapter } from '../adapters/clipboardAdapter';

export type CheckoutStatus =
  | 'IDLE'
  | 'VALIDATING'
  | 'SUBMITTING'
  | 'DISPATCHED_WHATSAPP'
  | 'DISPATCHED_FALLBACK'
  | 'ORDER_SUCCESS'
  | 'ERROR';

export interface UseCheckoutOptions {
  whatsAppGateway?: WhatsAppGatewayPort;
  clipboardPort?: ClipboardPort;
  targetPhone?: string;
  onSuccess?: (order: OrderPayload) => void;
}

const INITIAL_FORM: CheckoutForm = {
  customerName: '',
  customerPhone: '',
  deliveryMethod: 'DELIVERY',
  deliveryAddress: {
    street: '',
    number: '',
    floorOrApt: '',
    betweenStreets: '',
    referenceNotes: '',
  },
  pickupEstimatedTime: 'Lo antes posible (20-30 min)',
  paymentMethod: 'EFECTIVO',
  cashAmountPaid: undefined,
  generalNotes: '',
};

export function useCheckout(options: UseCheckoutOptions = {}) {
  const whatsAppGateway = options.whatsAppGateway ?? defaultWhatsAppGateway;
  const clipboardPort = options.clipboardPort ?? defaultClipboardAdapter;
  const targetPhone = options.targetPhone ?? OFFICIAL_WHATSAPP_PHONE;

  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [status, setStatus] = useState<CheckoutStatus>('IDLE');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastOrder, setLastOrder] = useState<OrderPayload | null>(null);

  const updateField = useCallback(<K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const updateAddressField = useCallback((field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      deliveryAddress: {
        ...(prev.deliveryAddress || { street: '', number: '' }),
        [field]: value,
      },
    }));
    setErrors((prev) => {
      if (!prev[field] && !prev.deliveryAddress) return prev;
      const next = { ...prev };
      delete next[field];
      delete next.deliveryAddress;
      return next;
    });
  }, []);

  const setDeliveryMethod = useCallback((method: DeliveryMethod) => {
    setForm((prev) => ({
      ...prev,
      deliveryMethod: method,
    }));
    setErrors({});
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setForm((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.cashAmountPaid;
      return next;
    });
  }, []);

  const getCashChange = useCallback(
    (total: number): CashChangeResult => {
      return calculateCashChange(form.cashAmountPaid, total);
    },
    [form.cashAmountPaid]
  );

  const validate = useCallback(
    (orderTotal: number): boolean => {
      const result = validateCheckoutForm(form, orderTotal);
      setErrors(result.errors);
      return result.isValid;
    },
    [form]
  );

  const createOrderPayload = useCallback(
    (items: CartItem[], totals: CartTotals): OrderPayload => {
      const ticketId = generateTicketId();
      const createdAt = new Date();
      const canonicalMessage = buildCanonicalTicket({
        ticketId,
        createdAt,
        customer: form,
        items,
        totals,
      });
      const whatsAppUrl = generateWhatsAppUrl(canonicalMessage, targetPhone);

      return {
        ticketId,
        createdAt,
        customer: { ...form },
        items: [...items],
        totals: { ...totals },
        canonicalMessage,
        whatsAppUrl,
      };
    },
    [form, targetPhone]
  );

  const submitWhatsApp = useCallback(
    async (items: CartItem[], totals: CartTotals): Promise<boolean> => {
      setStatus('VALIDATING');
      const isValid = validate(totals.total);
      if (!isValid) {
        setStatus('ERROR');
        return false;
      }

      setStatus('SUBMITTING');
      try {
        const order = createOrderPayload(items, totals);
        setLastOrder(order);

        const sent = whatsAppGateway.sendOrder(targetPhone, order.canonicalMessage);
        setStatus('DISPATCHED_WHATSAPP');
        setTimeout(() => {
          setStatus('ORDER_SUCCESS');
          options.onSuccess?.(order);
        }, 500);

        return sent;
      } catch (err) {
        console.error('[useCheckout] Error submitting to WhatsApp:', err);
        setStatus('ERROR');
        return false;
      }
    },
    [validate, createOrderPayload, whatsAppGateway, targetPhone, options]
  );

  const copyOrderToClipboard = useCallback(
    async (items: CartItem[], totals: CartTotals): Promise<boolean> => {
      try {
        const order = createOrderPayload(items, totals);
        setLastOrder(order);
        const copied = await clipboardPort.copyText(order.canonicalMessage);
        if (copied) {
          setStatus('DISPATCHED_FALLBACK');
        }
        return copied;
      } catch (err) {
        console.error('[useCheckout] Error copying order to clipboard:', err);
        return false;
      }
    },
    [createOrderPayload, clipboardPort]
  );

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStatus('IDLE');
    setLastOrder(null);
  }, []);

  return {
    form,
    status,
    errors,
    lastOrder,
    updateField,
    updateAddressField,
    setDeliveryMethod,
    setPaymentMethod,
    getCashChange,
    validate,
    submitWhatsApp,
    copyOrderToClipboard,
    resetForm,
    setStatus,
  };
}
