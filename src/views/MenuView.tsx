import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Product, CategoryCode } from '../domain/models';
import { CATEGORIES } from '../data/catalog';
import { CategoryFilterSelection } from '../hooks/useCatalogFilter';
import { CategoryTabs } from '../components/CategoryTabs';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';

export interface MenuViewProps {
  onNavigateToHome: () => void;
  selectedCategory: CategoryFilterSelection;
  onSelectCategory: (category: CategoryFilterSelection) => void;
  categoryCounts: Partial<Record<CategoryCode, number>>;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onClearSearch: () => void;
  filteredProducts: Product[];
  onOpenProductModal: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  onNavigateToHome,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  searchQuery,
  onSearchQueryChange,
  onClearSearch,
  filteredProducts,
  onOpenProductModal,
  onQuickAdd,
}) => {
  // Information of active category
  const currentCategoryInfo = CATEGORIES.find((c) => c.code === selectedCategory);

  return (
    <div className="flex flex-col w-full animate-fadeIn">
      {/* 1. Barra superior limpia: Botón volver y Badge Carta Digital */}
      <div className="bg-amber-100/80 border-b-2 border-slate-900/10 py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onNavigateToHome}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-800 hover:text-red-700 bg-white hover:bg-amber-50 px-3 py-1.5 rounded-xl border border-slate-900 shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Inicio / Info</span>
          </button>

          <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-xl border-2 border-slate-900 shadow-retro-sm uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-red-600 fill-red-600" />
            <span>Carta Digital</span>
          </span>
        </div>
      </div>

      {/* 2. CategoryTabs pegajoso (sticky) */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          onSelectCategory(cat);
          onClearSearch();
        }}
        categoryCounts={categoryCounts}
      />

      {/* 3. SearchBar compacto */}
      <div className="-mb-2">
        <SearchBar
          query={searchQuery}
          onQueryChange={onSearchQueryChange}
          onClear={onClearSearch}
          resultCount={filteredProducts.length}
          onViewAll={() => {
            onSelectCategory('ALL');
            onClearSearch();
          }}
        />
      </div>

      {/* 4. Lista/Grid de productos con título de categoría y conteo de platos */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pb-32 sm:pb-24">
        {/* Cabecera de Categoría / Búsqueda */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-3 border-slate-900 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">
                {selectedCategory === 'ALL'
                  ? '🔥'
                  : currentCategoryInfo?.badge
                  ? '⭐'
                  : '🍽️'}
              </span>
              <h2 className="text-xl sm:text-3xl font-black uppercase font-serif text-slate-900 tracking-tight">
                {searchQuery.trim().length > 0
                  ? `Resultados para "${searchQuery}"`
                  : selectedCategory === 'ALL'
                  ? 'Toda la Carta'
                  : currentCategoryInfo?.name || 'Menú'}
              </h2>
            </div>
            {currentCategoryInfo?.description && searchQuery.trim().length === 0 && (
              <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1">
                {currentCategoryInfo.description}
              </p>
            )}
          </div>

          <span className="text-xs sm:text-sm font-black text-slate-700 bg-amber-200 px-3 py-1 rounded-xl border border-slate-900 shrink-0 self-start sm:self-auto">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'plato disponible' : 'platos disponibles'}
          </span>
        </div>

        {/* Grid de productos optimizado */}
        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={onOpenProductModal}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
