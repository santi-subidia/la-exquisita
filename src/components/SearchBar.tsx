import React from 'react';
import { Search, X, UtensilsCrossed } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  resultCount: number;
  onViewAll: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onClear,
  resultCount,
  onViewAll,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 my-6">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-500 pointer-events-none">
          <Search className="w-5 h-5 text-slate-700" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscá por plato o ingrediente (ej: napolitana, lomo, roquefort...)"
          className="w-full bg-white text-slate-900 placeholder:text-slate-400 font-bold text-sm sm:text-base pl-11 pr-10 py-3 rounded-2xl border-3 border-slate-900 shadow-retro focus:outline-none focus:ring-4 focus:ring-amber-400/50 transition-all"
        />

        {query.trim().length > 0 && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 p-1 rounded-full bg-slate-200 hover:bg-red-500 hover:text-white text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Humorous Argentine Empty State when search returns 0 results */}
      {query.trim().length > 0 && resultCount === 0 && (
        <div className="mt-8 bg-amber-100 border-3 border-dashed border-red-600 rounded-2xl p-6 text-center shadow-retro animate-fadeIn">
          <div className="text-4xl mb-2">🥟🚫🍣</div>
          <h3 className="text-xl font-black text-slate-900 uppercase font-serif">
            ¡Acá no tenemos sushi, che!
          </h3>
          <p className="text-sm sm:text-base text-slate-700 font-medium max-w-md mx-auto mt-2">
            No encontramos nada con &ldquo;<strong className="text-red-700">{query}</strong>&rdquo;. Pero tranquilo, que en La Exquisita nos sobran pizzas a la piedra, lomazos XL y empanadas bien calientes.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2 rounded-xl border-2 border-slate-900 shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs sm:text-sm"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-300" />
              <span>Ver toda la carta</span>
            </button>
            <button
              type="button"
              onClick={onClear}
              className="bg-white hover:bg-amber-200 text-slate-900 font-black px-4 py-2 rounded-xl border-2 border-slate-900 shadow-retro-sm transition-all text-xs sm:text-sm"
            >
              Borrar Búsqueda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
