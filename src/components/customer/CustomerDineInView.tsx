import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { CustomerHeader } from './CustomerHeader';
import { CategoryNav } from './CategoryNav';
import { FilterPills, FilterState } from './FilterPills';
import { ProductCard } from './ProductCard';
import { CustomizationModal } from './CustomizationModal';
import { CartDrawer } from './CartDrawer';
import { OrderTrackerModal } from './OrderTrackerModal';
import { ServiceRequestModal } from './ServiceRequestModal';
import { BillSummaryModal } from './BillSummaryModal';
import { ReceiptModal } from '../common/ReceiptModal';
import { PortalSwitcherModal } from '../common/PortalSwitcherModal';
import { formatCurrency } from '../../utils/format';
import { ShoppingBag, ArrowRight, Receipt, QrCode } from 'lucide-react';

export const CustomerDineInView: React.FC = () => {
  const { categories, products, cartTotals, restaurant, currentTable, getActiveTableBill } = useApp();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    bestsellersOnly: false,
    spicyOnly: false
  });

  // Modals state
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  // Active table bill for instant payment on page
  const activeTableBill = currentTable ? getActiveTableBill(currentTable.id) : null;

  // Compute category item counts
  const categoryItemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.id] = products.filter((p) => p.categoryId === cat.id).length;
    });
    return counts;
  }, [categories, products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategoryId !== 'all' && p.categoryId !== selectedCategoryId) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCat = p.categoryName.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      if (filters.bestsellersOnly && !p.isBestseller) return false;
      if (filters.spicyOnly && !p.isSpicy) return false;

      return true;
    });
  }, [products, selectedCategoryId, searchQuery, filters]);

  const isGroupedView = selectedCategoryId === 'all' && !searchQuery.trim();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-slate-50 to-amber-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 pb-36 relative overflow-x-hidden transition-colors duration-300">
      {/* Clean Minimal Header */}
      <CustomerHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenServiceModal={() => setIsServiceModalOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenBillModal={() => setIsBillModalOpen(true)}
        onOpenStaffPortal={() => setIsPortalModalOpen(true)}
      />

      {/* Horizontal Category Tabs */}
      <CategoryNav
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(id) => {
          setSelectedCategoryId(id);
          setSearchQuery('');
        }}
        categoryItemCounts={categoryItemCounts}
      />

      {/* Minimal Filter Pills */}
      <FilterPills filters={filters} setFilters={setFilters} />

      {/* Main 2-Grid / 3-Grid Layout Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 mt-3 sm:mt-4">
        {/* Craverse Brand Showcase Hero */}
        {selectedCategoryId === 'all' && !searchQuery.trim() && (
          <div className="mb-5 rounded-3xl overflow-hidden glass-card border border-orange-500/25 dark:border-orange-500/35 relative p-4 sm:p-5 shadow-sm bg-gradient-to-r from-orange-50/80 via-white/70 to-amber-50/60 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-orange-950/20 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5 sm:space-x-4 w-full sm:w-auto">
                <img
                  src="/craverse-logo.jpg"
                  alt="Craverse - Your Universe of Flavours"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-md shadow-orange-500/20 border-2 border-orange-500/30 shrink-0 bg-black"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      Craverse
                    </h2>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                      100% Pure Veg
                    </span>
                  </div>
                  <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-0.5">
                    Your Universe of Flavours.
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
                    Artisanal pizzas, sizzling snacks, rice bowls, and specialty coffees. No GST.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-end">
                <div className="px-3 py-1.5 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 text-orange-700 dark:text-orange-300 text-xs font-bold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Table {currentTable?.tableNumber || '16'} Dine-in</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Merged Inline Payment & Bill Banner directly on user page */}
        {activeTableBill && activeTableBill.total > 0 && (
          <div className="mb-6 p-4 rounded-3xl glass-card border border-orange-200/90 dark:border-orange-800/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-600/30 shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    Table {currentTable?.tableNumber} Active Bill: {formatCurrency(activeTableBill.total)}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                    Ready to Settle
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeTableBill.orders.reduce((sum, o) => sum + o.items.length, 0)} items ordered • Zero GST • Pay online with UPI / GPay / Card
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setIsBillModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-orange-600/25 transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Pay Now via UPI</span>
              </button>
            </div>
          </div>
        )}

        {/* 3x3 Grid of Glassmorphic Cards */}
        {filteredProducts.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 mt-4 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">No items found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try clearing your search or checking other categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId('all');
                setFilters({ bestsellersOnly: false, spicyOnly: false });
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md"
            >
              Reset Search
            </button>
          </div>
        ) : isGroupedView ? (
          <div className="space-y-10">
            {categories
              .filter((c) => c.isActive)
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((cat) => {
                const catProducts = filteredProducts.filter((p) => p.categoryId === cat.id);
                if (catProducts.length === 0) return null;
                return (
                  <section key={cat.id} id={`section-${cat.id}`} className="space-y-4 pt-2">
                    <div className="flex items-baseline justify-between border-b border-slate-200/70 dark:border-slate-800 pb-2">
                      <div>
                        <h2 className="font-black text-slate-900 dark:text-slate-100 text-lg sm:text-xl tracking-tight">
                          {cat.name}
                        </h2>
                        {cat.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cat.description}</p>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-300 bg-white/70 dark:bg-slate-800/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        {catProducts.length} items
                      </span>
                    </div>

                    {/* Medium 2-Grid on mobile, 3-Grid on desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
                      {catProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onOpenCustomizer={(prod) => setCustomizingProduct(prod)}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              Showing {filteredProducts.length} items
            </div>
            {/* Medium 2-Grid on mobile, 3-Grid on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenCustomizer={(prod) => setCustomizingProduct(prod)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Minimal Footer */}
        <footer className="mt-16 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2 pb-6 border-t border-slate-200/60 dark:border-slate-800 pt-8">
          <p className="font-semibold text-slate-600 dark:text-slate-300">
            {restaurant.name} • {restaurant.tagline || 'Your Universe of Flavours.'}
          </p>
          <p className="text-[11px]">
            FSSAI Lic: #{restaurant.fssaiNumber} • Zero GST (No extra taxes or hidden fees)
          </p>
          <div>
            <button
              onClick={() => setIsPortalModalOpen(true)}
              className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 underline"
            >
              Staff Portal Access (Kitchen KDS • Cashier • Admin)
            </button>
          </div>
        </footer>
      </main>

      {/* Floating Bottom Cart Bar */}
      {cartTotals.itemCount > 0 && (
        <aside aria-label="Cart Summary" className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-xl hover:bg-slate-900 dark:hover:bg-slate-800 text-white p-3.5 rounded-3xl shadow-2xl flex items-center justify-between border border-white/20 dark:border-slate-700 transition-all transform active:scale-98 animate-slide-up"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center font-bold text-white shadow-md shadow-orange-600/30">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-slate-300">
                    {cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'Item' : 'Items'} in Cart
                  </div>
                  <div className="text-base font-black text-white">
                    {formatCurrency(cartTotals.totalAmount)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 font-black text-xs bg-orange-600 px-4 py-2.5 rounded-2xl text-white shadow-md shadow-orange-600/25">
                <span>View Cart & Pay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </aside>
      )}

      {/* Modals */}
      {customizingProduct && (
        <CustomizationModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlacedSuccess={() => setIsOrderTrackerOpen(true)}
      />

      {isOrderTrackerOpen && (
        <OrderTrackerModal
          onClose={() => setIsOrderTrackerOpen(false)}
          onOrderMore={() => setIsOrderTrackerOpen(false)}
          onCallWaiter={() => setIsServiceModalOpen(true)}
          onRequestBill={() => setIsBillModalOpen(true)}
        />
      )}

      {isServiceModalOpen && (
        <ServiceRequestModal onClose={() => setIsServiceModalOpen(false)} />
      )}

      {isBillModalOpen && (
        <BillSummaryModal
          onClose={() => setIsBillModalOpen(false)}
          onOpenReceipt={() => setIsReceiptModalOpen(true)}
        />
      )}

      {isReceiptModalOpen && (
        <ReceiptModal onClose={() => setIsReceiptModalOpen(false)} />
      )}

      {/* Dedicated Portal Switcher Modal */}
      <PortalSwitcherModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
      />
    </div>
  );
};
