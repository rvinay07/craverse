import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  BellRing,
  Receipt,
  FileText,
  Lock,
  Sun,
  Moon
} from 'lucide-react';

interface CustomerHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenServiceModal: () => void;
  onOpenOrderTracker: () => void;
  onOpenBillModal: () => void;
  onOpenStaffPortal: () => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenServiceModal,
  onOpenOrderTracker,
  onOpenBillModal,
  onOpenStaffPortal
}) => {
  const { restaurant, currentTable, orders, theme, toggleTheme } = useApp();

  const activeOrders = currentTable
    ? orders.filter(
        (o) =>
          o.tableId === currentTable.id &&
          o.status !== 'completed' &&
          o.status !== 'cancelled'
      )
    : [];

  return (
    <header className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-white/70 dark:border-slate-800/80 sticky top-0 z-30 shadow-xs transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5">
        {/* Top Minimal Restaurant Details Bar */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand info */}
          <div className="flex items-center space-x-3">
            {/* Craverse Brand Logo */}
            <div className="relative group shrink-0">
              <img
                src={restaurant.logo || '/craverse-logo.jpg'}
                alt="Craverse Logo"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover shadow-md shadow-orange-500/15 border border-orange-500/30 dark:border-orange-500/50 bg-black"
              />
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 border-2 border-emerald-600 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 shadow-xs"
                title="100% Pure Vegetarian"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight">
                  {restaurant.name}
                </h1>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Pure Veg
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-none font-medium">
                {restaurant.tagline || 'Your Universe of Flavours.'}
              </p>
            </div>
          </div>

          {/* Right side: Light/Dark toggle, Table badge & Staff Portal icon */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center space-x-1"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-[10px] font-bold hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-bold hidden sm:inline text-slate-200">Light</span>
                </>
              )}
            </button>

            {/* Table Badge */}
            <div className="px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs font-black">
              Table {currentTable?.tableNumber || '16'}
            </div>

            {/* Discreet Staff Portal link */}
            <button
              onClick={onOpenStaffPortal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Staff Portals (KDS, Cashier, Admin)"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Action Pills: Call Waiter, Active Orders, Bill */}
        <div className="flex items-center space-x-2 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onOpenServiceModal}
            className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <BellRing className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>Call Waiter</span>
          </button>

          {activeOrders.length > 0 && (
            <button
              onClick={onOpenOrderTracker}
              className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Track Order ({activeOrders.length})</span>
            </button>
          )}

          <button
            onClick={onOpenBillModal}
            className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>View Bill</span>
          </button>
        </div>

        {/* Minimal Search Bar */}
        <div className="mt-2.5 relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pizza, snacks, cold coffee, latte..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
