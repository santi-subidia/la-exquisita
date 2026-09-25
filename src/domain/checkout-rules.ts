import { CheckoutForm, MoneyARS } from './models';

export interface CheckoutValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface CashChangeResult {
  change: MoneyARS;
  isExact: boolean;
  isInsufficient: boolean;
  isProvided: boolean;
  message: string;
}

/**
 * Validates Argentine phone numbers (minimum 8 digits, reasonable length).
 */
export function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
}

/**
 * Validates checkout form data strictly based on delivery and payment methods.
 */
export function validateCheckoutForm(
  form: CheckoutForm,
  orderTotal: MoneyARS
): CheckoutValidationResult {
  const errors: Record<string, string> = {};

  // Common customer fields
  const trimmedName = form.customerName ? form.customerName.trim() : '';
  if (!trimmedName || trimmedName.length < 3) {
    errors.customerName = 'Ingresá tu nombre completo (mínimo 3 caracteres)';
  }

  const trimmedPhone = form.customerPhone ? form.customerPhone.trim() : '';
  if (!trimmedPhone) {
    errors.customerPhone = 'Ingresá un número de teléfono de contacto';
  } else if (!isValidPhone(trimmedPhone)) {
    errors.customerPhone = 'Ingresá un número de teléfono válido (ej: 2664123456)';
  }

  // Delivery-specific validations
  if (form.deliveryMethod === 'DELIVERY') {
    const address = form.deliveryAddress;
    if (!address) {
      errors.deliveryAddress = 'La dirección de entrega es obligatoria para envíos a domicilio';
    } else {
      const street = address.street ? address.street.trim() : '';
      const number = address.number ? address.number.trim() : '';
      const betweenStreets = address.betweenStreets ? address.betweenStreets.trim() : '';

      if (!street) {
        errors.street = 'Ingresá el nombre de la calle';
      }
      if (!number) {
        errors.number = 'Ingresá la altura o numeración';
      }
      if (!betweenStreets) {
        errors.betweenStreets = 'Ingresá entre qué calles queda o referencias';
      }
    }
  }

  // Cash payment validation
  if (form.paymentMethod === 'EFECTIVO') {
    if (form.cashAmountPaid === undefined || form.cashAmountPaid === null || isNaN(form.cashAmountPaid)) {
      errors.cashAmountPaid = 'Indicá con cuánto vas a abonar para calcular tu cambio';
    } else if (form.cashAmountPaid < orderTotal) {
      errors.cashAmountPaid = `El monto a pagar ($${form.cashAmountPaid.toLocaleString('es-AR')}) no puede ser menor al total del pedido ($${orderTotal.toLocaleString('es-AR')})`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calculates change when paying in cash.
 */
export function calculateCashChange(
  cashAmountPaid: MoneyARS | undefined,
  total: MoneyARS
): CashChangeResult {
  if (cashAmountPaid === undefined || cashAmountPaid === null || isNaN(cashAmountPaid) || cashAmountPaid <= 0) {
    return {
      change: 0,
      isExact: false,
      isInsufficient: false,
      isProvided: false,
      message: 'Ingresá con cuánto abonás',
    };
  }

  if (cashAmountPaid < total) {
    const diff = total - cashAmountPaid;
    return {
      change: 0,
      isExact: false,
      isInsufficient: true,
      isProvided: true,
      message: `Faltan $${diff.toLocaleString('es-AR')} para cubrir el total`,
    };
  }

  const change = cashAmountPaid - total;
  const isExact = change === 0;

  return {
    change,
    isExact,
    isInsufficient: false,
    isProvided: true,
    message: isExact
      ? 'Pago exacto (sin vuelto)'
      : `Tu vuelto será de $${change.toLocaleString('es-AR')}`,
  };
}
