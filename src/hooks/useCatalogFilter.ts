import { useState, useMemo, useCallback } from 'react';
import { Product, CategoryCode } from '../domain/models';

export type CategoryFilterSelection = CategoryCode | 'ALL';

export interface UseCatalogFilterProps {
  products: Product[];
  initialCategory?: CategoryFilterSelection;
}

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function useCatalogFilter({
  products,
  initialCategory = 'PIZZAS',
}: UseCatalogFilterProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterSelection>(initialCategory);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<CategoryCode, number>> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const filteredProducts = useMemo(() => {
    const query = normalizeText(searchQuery);

    return products.filter((product) => {
      // 1. Text Search matches anywhere in name or description
      if (query.length > 0) {
        const normName = normalizeText(product.name);
        const normDesc = normalizeText(product.description);
        const normCat = normalizeText(product.category);
        const matchesQuery =
          normName.includes(query) ||
          normDesc.includes(query) ||
          normCat.includes(query);

        if (!matchesQuery) return false;
      }

      // 2. Category match (when not searching, or optionally in combination)
      // When user searches text, we can search across all or within category.
      // Usually users expect search across all products if category is ALL or if searching,
      // but if category is explicitly selected and they search, we should filter within selectedCategory UNLESS query is active and they want global search.
      // Friendly rotisería UX: if search query is present, search all products so they find their dish easily.
      // Better: if searching, still show matches. If selectedCategory !== 'ALL' and NO query, filter by category. If query is active, filter by query across all or within category?
      // Let's do: if query is present, search within selectedCategory unless user selects 'ALL' or query has no results in category. Even cleaner: when query is present, if category !== 'ALL', filter by both category and query.
      if (selectedCategory !== 'ALL' && query.length === 0) {
        if (product.category !== selectedCategory) return false;
      } else if (selectedCategory !== 'ALL' && query.length > 0) {
        // If user typed search query, search across ALL products to be most helpful,
        // unless they are explicitly browsing. Actually searching globally and auto-switching or showing all matching products is super intuitive!
        // Let's check: if product matches query, we include it.
        return true;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categoryCounts,
    clearSearch,
    filteredProducts,
  };
}
