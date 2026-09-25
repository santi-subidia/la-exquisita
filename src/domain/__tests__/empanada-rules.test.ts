import { describe, it, expect } from 'vitest';
import {
  getTotalEmpanadasCount,
  getRemainingQuota,
  canAddEmpanada,
  validateEmpanadaQuota,
  incrementFlavor,
  decrementFlavor,
  formatFlavorSummary,
} from '../empanada-rules';
import { FlavorSelection } from '../models';

describe('Empanada Rules (Dominio Puro)', () => {
  describe('Cálculo de Totales y Cupos Restantes', () => {
    it('debe contar 0 cuando no hay selección', () => {
      expect(getTotalEmpanadasCount(undefined)).toBe(0);
      expect(getTotalEmpanadasCount({})).toBe(0);
    });

    it('debe sumar correctamente la cantidad de empanadas seleccionadas', () => {
      const selection: FlavorSelection = {
        CARNE: 4,
        POLLO: 3,
        HUMITA: 2,
      };
      expect(getTotalEmpanadasCount(selection)).toBe(9);
      expect(getRemainingQuota(selection, 12)).toBe(3);
      expect(canAddEmpanada(selection, 12)).toBe(true);
    });

    it('debe indicar que no se pueden agregar más empanadas al alcanzar el cupo', () => {
      const selection: FlavorSelection = {
        CARNE: 6,
        ARABES: 6,
      };
      expect(getTotalEmpanadasCount(selection)).toBe(12);
      expect(getRemainingQuota(selection, 12)).toBe(0);
      expect(canAddEmpanada(selection, 12)).toBe(false);
    });
  });

  describe('Validación de Cuotas (Docena y Media Docena)', () => {
    it('debe fallar si faltan empanadas para la docena (ej. 4 de 12)', () => {
      const selection: FlavorSelection = {
        CARNE: 4,
      };
      const result = validateEmpanadaQuota(selection, 12);
      expect(result.isValid).toBe(false);
      expect(result.missing).toBe(8);
      expect(result.message).toContain('Faltan 8 empanadas');
    });

    it('debe aprobar con exactamente 12 empanadas distribuidas', () => {
      const selection: FlavorSelection = {
        CARNE: 6,
        ARABES: 4,
        JAMON_Y_QUESO: 2,
      };
      const result = validateEmpanadaQuota(selection, 12);
      expect(result.isValid).toBe(true);
      expect(result.missing).toBe(0);
      expect(result.message).toContain('¡Docena completa!');
    });

    it('debe advertir cuota incompleta para media docena (ej. 3 Humita + 1 Verdura = 4 de 6)', () => {
      const selection: FlavorSelection = {
        HUMITA: 3,
        VERDURA: 1,
      };
      const result = validateEmpanadaQuota(selection, 6);
      expect(result.isValid).toBe(false);
      expect(result.missing).toBe(2);
      expect(result.message).toContain('Elegí 2 empanadas más para completar la media docena');
    });

    it('debe aprobar con exactamente 6 empanadas para media docena', () => {
      const selection: FlavorSelection = {
        HUMITA: 3,
        VERDURA: 3,
      };
      const result = validateEmpanadaQuota(selection, 6);
      expect(result.isValid).toBe(true);
      expect(result.missing).toBe(0);
      expect(result.message).toContain('¡Media docena completa!');
    });
  });

  describe('Incremento y Decremento Inmutable', () => {
    it('debe incrementar un sabor respetando el cupo máximo', () => {
      let selection: FlavorSelection = {};
      selection = incrementFlavor(selection, 'CARNE', 6);
      expect(selection.CARNE).toBe(1);

      selection = incrementFlavor(selection, 'CARNE', 6);
      expect(selection.CARNE).toBe(2);

      // Llenamos hasta 6
      selection = { CARNE: 5, POLLO: 1 };
      // Intento agregar una 7ma
      const blocked = incrementFlavor(selection, 'ARABES', 6);
      expect(blocked.ARABES).toBeUndefined();
      expect(getTotalEmpanadasCount(blocked)).toBe(6);
    });

    it('debe decrementar un sabor y eliminarlo cuando llega a 0', () => {
      const initial: FlavorSelection = { CARNE: 2, POLLO: 1 };
      const afterDecCarne = decrementFlavor(initial, 'CARNE');
      expect(afterDecCarne.CARNE).toBe(1);

      const afterDecPollo = decrementFlavor(afterDecCarne, 'POLLO');
      expect(afterDecPollo.POLLO).toBeUndefined();
    });
  });

  describe('Formateo de Resumen de Sabores', () => {
    it('debe generar texto legible con los nombres oficiales y cantidades', () => {
      const selection: FlavorSelection = {
        CARNE: 6,
        ARABES: 4,
        JAMON_Y_QUESO: 2,
      };
      const summary = formatFlavorSummary(selection);
      expect(summary).toBe('Carne Criolla (6), Árabes (Sfijas) (4), Jamón y Queso (2)');
    });

    it('debe retornar cadena vacía si no hay selección', () => {
      expect(formatFlavorSummary(undefined)).toBe('');
      expect(formatFlavorSummary({})).toBe('');
    });
  });
});
