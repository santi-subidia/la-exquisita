import { describe, it, expect } from 'vitest';
import { calculateLinePrice, calculateCartTotals, formatMoneyARS } from '../pricing';
import { CartItem } from '../models';
import { PRODUCTS } from '../../data/catalog';

describe('Pricing Engine (Dominio Puro)', () => {
  const lomoXl = PRODUCTS.find((p) => p.id === 'sandwich-lomo-xl')!;
  const pizzaEspecial = PRODUCTS.find((p) => p.id === 'pizza-especial')!;
  const papasClasicas = PRODUCTS.find((p) => p.id === 'papas-clasicas')!;

  describe('Cálculo de Precios Base y Variantes', () => {
    it('debe calcular el precio base de un plato sin variantes', () => {
      const lomopizza = PRODUCTS.find((p) => p.id === 'especialidad-lomopizza')!;
      const result = calculateLinePrice(lomopizza, undefined, 1);
      expect(result.unitPrice).toBe(36000);
      expect(result.subtotal).toBe(36000);
      expect(result.savings).toBe(0);
    });

    it('debe calcular el precio de Pizza Especial Entera ($16.000)', () => {
      const variantEntera = pizzaEspecial.variants?.find((v) => v.sizeCode === 'ENTERA');
      const result = calculateLinePrice(pizzaEspecial, variantEntera, 1);
      expect(result.unitPrice).toBe(16000);
      expect(result.subtotal).toBe(16000);
    });

    it('debe calcular el precio de Pizza Especial Media ($9.000)', () => {
      const variantMedia = pizzaEspecial.variants?.find((v) => v.sizeCode === 'MEDIA');
      const result = calculateLinePrice(pizzaEspecial, variantMedia, 1);
      expect(result.unitPrice).toBe(9000);
      expect(result.subtotal).toBe(9000);
    });

    it('debe calcular variantes de papas clásicas (Chica $7.000, Grande $9.000)', () => {
      const chica = papasClasicas.variants?.find((v) => v.sizeCode === 'CHICA');
      const grande = papasClasicas.variants?.find((v) => v.sizeCode === 'GRANDE');

      expect(calculateLinePrice(papasClasicas, chica, 1).subtotal).toBe(7000);
      expect(calculateLinePrice(papasClasicas, grande, 1).subtotal).toBe(9000);
    });
  });

  describe('Reglas de Promociones 2x por Volumen', () => {
    it('Lomo XL: 1 unidad cuesta precio base ($17.000)', () => {
      const result = calculateLinePrice(lomoXl, undefined, 1);
      expect(result.subtotal).toBe(17000);
      expect(result.savings).toBe(0);
    });

    it('Lomo XL: 2 unidades aplican promo 2x ($32.000 con ahorro de $2.000)', () => {
      const result = calculateLinePrice(lomoXl, undefined, 2);
      expect(result.subtotal).toBe(32000);
      expect(result.savings).toBe(2000); // 17.000 * 2 = 34.000 - 32.000
    });

    it('Lomo XL: 3 unidades aplican promo 2x para un par más una individual ($49.000)', () => {
      const result = calculateLinePrice(lomoXl, undefined, 3);
      expect(result.subtotal).toBe(49000); // 32.000 + 17.000
      expect(result.savings).toBe(2000);
    });

    it('Lomo XL: 4 unidades aplican promo 2x dos veces ($64.000)', () => {
      const result = calculateLinePrice(lomoXl, undefined, 4);
      expect(result.subtotal).toBe(64000); // 32.000 * 2
      expect(result.savings).toBe(4000);
    });

    it('Chorilomo: 2 unidades aplican promo 2x por $19.000 (precio regular $11.000 c/u)', () => {
      const chorilomo = PRODUCTS.find((p) => p.id === 'sandwich-chorilomo')!;
      const result = calculateLinePrice(chorilomo, undefined, 2);
      expect(result.subtotal).toBe(19000);
      expect(result.savings).toBe(3000); // 22.000 - 19.000
    });

    it('Hamburguesa Clásica: 2 unidades aplican promo 2x por $22.000 (regular $13.000 c/u)', () => {
      const burger = PRODUCTS.find((p) => p.id === 'burger-carne-clasica')!;
      const result = calculateLinePrice(burger, undefined, 2);
      expect(result.subtotal).toBe(22000);
      expect(result.savings).toBe(4000);
    });
  });

  describe('Cálculo de Totales del Carrito', () => {
    const mockItems: CartItem[] = [
      {
        lineId: 'line-1',
        productId: 'pizza-especial',
        productName: 'Pizza Especial',
        modifiers: {},
        unitPrice: 16000,
        quantity: 1,
        subtotal: 16000,
      },
      {
        lineId: 'line-2',
        productId: 'sandwich-lomo-xl',
        productName: 'Lomo XL',
        modifiers: {},
        unitPrice: 17000,
        quantity: 2,
        subtotal: 32000,
      },
    ];

    it('debe calcular subtotal y cantidad total de platos', () => {
      const totals = calculateCartTotals(mockItems, 'DELIVERY');
      expect(totals.itemCount).toBe(3);
      expect(totals.subtotal).toBe(48000); // 16.000 + 32.000
      expect(totals.deliveryFee).toBe('A_COORDINAR');
      expect(totals.total).toBe(48000);
    });

    it('debe reflejar costo de entrega 0 cuando es Retiro por el Local (PICKUP)', () => {
      const totals = calculateCartTotals(mockItems, 'PICKUP');
      expect(totals.deliveryFee).toBe(0);
      expect(totals.total).toBe(48000);
    });

    it('debe sumar tarifa de envío numérica si está definida', () => {
      const totals = calculateCartTotals(mockItems, 'DELIVERY', 2000);
      expect(totals.deliveryFee).toBe(2000);
      expect(totals.total).toBe(50000);
    });
  });

  describe('Formateo de Moneda', () => {
    it('debe formatear números con separador de miles', () => {
      const formatted = formatMoneyARS(16000);
      expect(formatted).toMatch(/16[.,]000/);
    });
  });
});
