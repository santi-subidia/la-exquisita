import { EmpanadaFlavorCode, FlavorSelection } from './models';

export const FLAVOR_NAMES: Record<EmpanadaFlavorCode, string> = {
  CARNE: 'Carne Criolla',
  POLLO: 'Pollo al Verdeo',
  ARABES: 'Árabes (Sfijas)',
  CAPRESSE: 'Capresse',
  VERDURA: 'Verdura',
  HUMITA: 'Humita',
  JAMON_Y_QUESO: 'Jamón y Queso',
  TOMATE_CEBOLLA_QUESO: 'Tomate, Cebolla y Queso',
};

export interface QuotaValidationResult {
  isValid: boolean;
  currentTotal: number;
  expectedQuota: 6 | 12;
  missing: number;
  message: string;
}

/**
 * Counts the total number of selected empanadas across all flavors.
 */
export function getTotalEmpanadasCount(selection?: FlavorSelection): number {
  if (!selection) return 0;
  return Object.values(selection).reduce((acc, count) => acc + (count ?? 0), 0);
}

/**
 * Gets remaining empanadas needed to complete the quota.
 */
export function getRemainingQuota(selection: FlavorSelection | undefined, expectedQuota: 6 | 12): number {
  const current = getTotalEmpanadasCount(selection);
  return Math.max(0, expectedQuota - current);
}

/**
 * Checks if another empanada can be added without exceeding the quota.
 */
export function canAddEmpanada(selection: FlavorSelection | undefined, expectedQuota: 6 | 12): boolean {
  return getTotalEmpanadasCount(selection) < expectedQuota;
}

/**
 * Validates if the selected empanadas satisfy the required quota (6 or 12).
 */
export function validateEmpanadaQuota(
  selection: FlavorSelection | undefined,
  expectedQuota: 6 | 12
): QuotaValidationResult {
  const currentTotal = getTotalEmpanadasCount(selection);
  const missing = expectedQuota - currentTotal;

  if (currentTotal === expectedQuota) {
    return {
      isValid: true,
      currentTotal,
      expectedQuota,
      missing: 0,
      message: expectedQuota === 12 ? '¡Docena completa! (12/12)' : '¡Media docena completa! (6/6)',
    };
  }

  if (missing > 0) {
    const noun = expectedQuota === 12 ? 'la docena' : 'la media docena';
    return {
      isValid: false,
      currentTotal,
      expectedQuota,
      missing,
      message: expectedQuota === 12 
        ? `Faltan ${missing} empanadas para completar ${noun}` 
        : `Elegí ${missing} ${missing === 1 ? 'empanada más' : 'empanadas más'} para completar ${noun}`,
    };
  }

  return {
    isValid: false,
    currentTotal,
    expectedQuota,
    missing: 0,
    message: `Has superado el cupo permitido (${currentTotal}/${expectedQuota})`,
  };
}

/**
 * Pure function to safely increment the count of a flavor.
 * If quota is already met, returns unchanged selection.
 */
export function incrementFlavor(
  selection: FlavorSelection | undefined,
  flavor: EmpanadaFlavorCode,
  quota: 6 | 12
): FlavorSelection {
  const current = selection ?? {};
  if (!canAddEmpanada(current, quota)) {
    return current;
  }
  const currentFlavorCount = current[flavor] ?? 0;
  return {
    ...current,
    [flavor]: currentFlavorCount + 1,
  };
}

/**
 * Pure function to safely decrement the count of a flavor.
 * Does not allow count to go below 0.
 */
export function decrementFlavor(
  selection: FlavorSelection | undefined,
  flavor: EmpanadaFlavorCode
): FlavorSelection {
  if (!selection) return {};
  const currentFlavorCount = selection[flavor] ?? 0;
  if (currentFlavorCount <= 1) {
    const updated = { ...selection };
    delete updated[flavor];
    return updated;
  }
  return {
    ...selection,
    [flavor]: currentFlavorCount - 1,
  };
}

/**
 * Formats flavor distribution into human-readable text.
 * e.g. "Carne Criolla (6), Árabes (Sfijas) (4), Jamón y Queso (2)"
 */
export function formatFlavorSummary(selection?: FlavorSelection): string {
  if (!selection) return '';
  const entries = Object.entries(selection) as [EmpanadaFlavorCode, number][];
  const activeFlavors = entries.filter(([_, count]) => count && count > 0);

  if (activeFlavors.length === 0) return '';

  return activeFlavors
    .map(([code, count]) => `${FLAVOR_NAMES[code] ?? code} (${count})`)
    .join(', ');
}
