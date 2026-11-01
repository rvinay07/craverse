import React from 'react';
import { Category } from '../../types';
import {
  Flame,
  Utensils,
  Soup,
  Coffee,
  Sparkles
} from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  categoryItemCounts: Record<string, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  categoryItemCounts
}) => {
  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-3.5 h-3.5" />;
      case 'Soup':
        return <Soup className="w-3.5 h-3.5" />;
      case 'Coffee':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'Utensils':
        return <Utensils className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <nav aria-label="Menu Categories" className="sticky top-[108px] sm:top-[116px] z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/60 dark:border-slate-800 shadow-xs transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-1.5 py-2.5 overflow-x-auto no-scrollbar">
          {/* 'All' option */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedCategoryId === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Items
          </button>

          {categories
            .filter((c) => c.isActive)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              const count = categoryItemCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className={isSelected ? 'text-orange-200' : 'text-slate-500 dark:text-slate-400'}>
                    {getCategoryIcon(cat.icon)}
                  </span>
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                      isSelected
                        ? 'bg-orange-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </nav>
  );
};
