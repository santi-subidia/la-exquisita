import { describe, it, expect } from 'vitest';
import { PRODUCTS } from '../../data/catalog';

describe('Catalog Filtering & Search Logic', () => {
  it('correctly filters products by category code', () => {
    const pizzas = PRODUCTS.filter((p) => p.category === 'PIZZAS');
    expect(pizzas.length).toBe(23);

    const promos = PRODUCTS.filter((p) => p.category === 'PROMOS_COMBOS');
    expect(promos.length).toBe(15);

    const especialidades = PRODUCTS.filter((p) => p.category === 'ESPECIALIDADES');
    expect(especialidades.length).toBe(6);

    const sandwichs = PRODUCTS.filter((p) => p.category === 'SANDWICHS');
    expect(sandwichs.length).toBe(6);

    const hamburguesas = PRODUCTS.filter((p) => p.category === 'HAMBURGUESAS');
    expect(hamburguesas.length).toBe(3);
  });

  it('performs case-insensitive and accent-insensitive search', () => {
    function searchMatch(query: string, text: string): boolean {
      const normQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
      const normText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
      return normText.includes(normQuery);
    }

    // Searching "sandwich" without accent matches "Sándwich"
    const resultsSandwich = PRODUCTS.filter((p) => searchMatch('sandwich', p.name));
    expect(resultsSandwich.length).toBeGreaterThan(0);

    // Searching "muzza" matches pizzas with muzzarella
    const resultsMuzza = PRODUCTS.filter(
      (p) => searchMatch('muzza', p.name) || searchMatch('muzza', p.description)
    );
    expect(resultsMuzza.length).toBeGreaterThan(5);

    // Searching "lomopizza" matches Lomopizza
    const resultsLomoPizza = PRODUCTS.filter((p) => searchMatch('lomopizza', p.name));
    expect(resultsLomoPizza.length).toBe(1);
    expect(resultsLomoPizza[0].id).toBe('especialidad-lomopizza');
  });
});
