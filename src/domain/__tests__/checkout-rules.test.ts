import { describe, it, expect } from 'vitest';
import { validateCheckoutForm, calculateCashChange, isValidPhone } from '../checkout-rules';
import { CheckoutForm } from '../models';

describe('Checkout Rules (Dominio Puro)', () => {
  describe('Validación de Teléfono Argentino', () => {
    it('debe validar números de teléfono válidos con o sin guiones o espacios', () => {
      expect(isValidPhone('2664193004')).toBe(true);
      expect(isValidPhone('+54 9 266 419-3004')).toBe(true);
      expect(isValidPhone('0266 4421234')).toBe(true);
    });

    it('debe rechazar números con menos de 8 dígitos o inválidos', () => {
      expect(isValidPhone('12345')).toBe(false);
      expect(isValidPhone('abc')).toBe(false);
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('Validación Estricta para Delivery (Envío a Domicilio)', () => {
    it('debe fallar si faltan campos de dirección o datos personales', () => {
      const form: CheckoutForm = {
        customerName: 'J', // menos de 3 caracteres
        customerPhone: '',
        deliveryMethod: 'DELIVERY',
        deliveryAddress: {
          street: '',
          number: '',
          betweenStreets: '',
        },
        paymentMethod: 'TRANSFERENCIA',
      };

      const result = validateCheckoutForm(form, 20000);
      expect(result.isValid).toBe(false);
      expect(result.errors.customerName).toBeDefined();
      expect(result.errors.customerPhone).toBeDefined();
      expect(result.errors.street).toBeDefined();
      expect(result.errors.number).toBeDefined();
      expect(result.errors.betweenStreets).toBeDefined();
    });

    it('debe aprobar si todos los datos obligatorios de Delivery están completos', () => {
      const form: CheckoutForm = {
        customerName: 'María Eugenia',
        customerPhone: '2664123456',
        deliveryMethod: 'DELIVERY',
        deliveryAddress: {
          street: 'San Martín',
          number: '650',
          floorOrApt: '2 B',
          betweenStreets: 'Belgrano y Pringles',
        },
        paymentMethod: 'TRANSFERENCIA',
      };

      const result = validateCheckoutForm(form, 20000);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });
  });

  describe('Validación para Retiro en Mostrador (PICKUP)', () => {
    it('no debe requerir datos de dirección de entrega', () => {
      const form: CheckoutForm = {
        customerName: 'Carlos López',
        customerPhone: '2664987654',
        deliveryMethod: 'PICKUP',
        paymentMethod: 'TRANSFERENCIA',
      };

      const result = validateCheckoutForm(form, 20000);
      expect(result.isValid).toBe(true);
      expect(result.errors.street).toBeUndefined();
    });

    it('debe fallar si falta el nombre en PICKUP', () => {
      const form: CheckoutForm = {
        customerName: '',
        customerPhone: '2664987654',
        deliveryMethod: 'PICKUP',
        paymentMethod: 'TRANSFERENCIA',
      };

      const result = validateCheckoutForm(form, 20000);
      expect(result.isValid).toBe(false);
      expect(result.errors.customerName).toBeDefined();
    });
  });

  describe('Validación de Pago en Efectivo y Cálculo de Vuelto', () => {
    it('debe exigir el monto a pagar en efectivo', () => {
      const form: CheckoutForm = {
        customerName: 'Juan Pérez',
        customerPhone: '2664123456',
        deliveryMethod: 'PICKUP',
        paymentMethod: 'EFECTIVO',
      };

      const result = validateCheckoutForm(form, 24000);
      expect(result.isValid).toBe(false);
      expect(result.errors.cashAmountPaid).toContain('Indicá con cuánto vas a abonar');
    });

    it('debe rechazar un monto en efectivo menor al total del pedido', () => {
      const form: CheckoutForm = {
        customerName: 'Juan Pérez',
        customerPhone: '2664123456',
        deliveryMethod: 'PICKUP',
        paymentMethod: 'EFECTIVO',
        cashAmountPaid: 20000,
      };

      const result = validateCheckoutForm(form, 24000);
      expect(result.isValid).toBe(false);
      expect(result.errors.cashAmountPaid).toContain('no puede ser menor al total');
    });

    it('debe aprobar si el efectivo cubre el total', () => {
      const form: CheckoutForm = {
        customerName: 'Juan Pérez',
        customerPhone: '2664123456',
        deliveryMethod: 'PICKUP',
        paymentMethod: 'EFECTIVO',
        cashAmountPaid: 30000,
      };

      const result = validateCheckoutForm(form, 24000);
      expect(result.isValid).toBe(true);
    });

    it('calculateCashChange: debe calcular el vuelto exacto ($6.000 con $30.000)', () => {
      const result = calculateCashChange(30000, 24000);
      expect(result.change).toBe(6000);
      expect(result.isExact).toBe(false);
      expect(result.isInsufficient).toBe(false);
      expect(result.message).toMatch(/vuelto será de \$6[.,]000/);
    });

    it('calculateCashChange: debe detectar pago exacto sin vuelto', () => {
      const result = calculateCashChange(24000, 24000);
      expect(result.change).toBe(0);
      expect(result.isExact).toBe(true);
      expect(result.message).toBe('Pago exacto (sin vuelto)');
    });

    it('calculateCashChange: debe señalar fondos insuficientes', () => {
      const result = calculateCashChange(20000, 24000);
      expect(result.isInsufficient).toBe(true);
      expect(result.message).toMatch(/Faltan \$4[.,]000/);
    });
  });
});
