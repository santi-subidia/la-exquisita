import React, { useRef, useEffect } from 'react';
import { CATEGORIES } from '../data/catalog';
import { CategoryCode } from '../domain/models';
import { CategoryFilterSelection } from '../hooks/useCatalogFilter';

interface CategoryTabsProps {
  selectedCategory: CategoryFilterSelection;
  onSelectCategory: (cat: CategoryFilterSelection) => void;
  categoryCounts: Partial<Record<CategoryCode, number>>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active tab into view horizontally
  useEffect(() => {
    if (!containerRef.current) return;
    const activeButton = containerRef.current.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedCategory]);

  return (
    <nav
      aria-label="Categorías del menú"
      className="sticky top-[104px] sm:top-[112px] z-20 bg-amber-100/95 backdrop-blur-sm border-b-3 border-slate-900 shadow-sm py-2 px-3 sm:px-4"
    >
      <div
        ref={containerRef}
        className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Tab "Todas" optional or direct categories */}
        <button
          type="button"
          data-active={selectedCategory === 'ALL'}
          onClick={() => onSelectCategory('ALL')}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black border-2 border-slate-900 transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-red-600 text-white shadow-retro scale-105'
              : 'bg-amber-200 hover:bg-amber-300 text-slate-900 shadow-retro-sm hover:scale-[1.02]'
          }`}
        >
          <span>🔥 Todo el Menú</span>
        </button>

        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.code;
          const count = categoryCounts[category.code] ?? 0;

          return (
            <button
              key={category.code}
              type="button"
              data-active={isSelected}
              onClick={() => onSelectCategory(category.code)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black border-2 border-slate-900 transition-all ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 shadow-retro scale-105'
                  : 'bg-white hover:bg-amber-50 text-slate-800 shadow-retro-sm hover:scale-[1.02]'
              }`}
            >
              <span>{category.name}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-full border border-slate-900 ${
                    isSelected ? 'bg-red-600 text-white' : 'bg-amber-200 text-slate-900'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
