import React from 'react';
import { Sparkles, Flame } from 'lucide-react';

export interface FilterState {
  bestsellersOnly: boolean;
  spicyOnly: boolean;
}

interface FilterPillsProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const FilterPills: React.FC<FilterPillsProps> = ({ filters, setFilters }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2">
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              bestsellersOnly: !prev.bestsellersOnly
            }))
          }
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all shrink-0 ${
            filters.bestsellersOnly
              ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/20'
              : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Bestsellers</span>
        </button>

        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              spicyOnly: !prev.spicyOnly
            }))
          }
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all shrink-0 ${
            filters.spicyOnly
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500/20'
              : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <Flame className="w-3 h-3 text-rose-500" />
          <span>Spicy</span>
        </button>

        <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-1 ml-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>100% Pure Veg Kitchen</span>
        </span>
      </div>
    </div>
  );
};
