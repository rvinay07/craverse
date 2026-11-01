import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { Plus, Minus, Sparkles, Flame, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenCustomizer: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenCustomizer }) => {
  const { cart, addToCart, updateCartQuantity } = useApp();

  const hasCustomizations = Boolean(
    (product.variants && product.variants.length > 0) ||
    (product.customizationGroups && product.customizationGroups.length > 0)
  );

  const cartItemsForProduct = cart.filter((item) => item.productId === product.id);
  const totalQtyInCart = cartItemsForProduct.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddClick = () => {
    if (!product.isAvailable) return;

    if (hasCustomizations) {
      onOpenCustomizer(product);
    } else {
      addToCart(product, undefined, [], 1);
    }
  };

  const handleStepQuantity = (delta: number) => {
    if (cartItemsForProduct.length === 1 && !hasCustomizations) {
      updateCartQuantity(cartItemsForProduct[0].cartItemId, delta);
    } else {
      onOpenCustomizer(product);
    }
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between group relative">
      {/* Top: Delicious Dish Image with Glass Floating Badges */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('photo-1619535860434-ba1d8fa12536') && !target.src.includes('photo-1546069901-ba9599a7e63c')) {
              target.src = 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=600&h=400&q=80';
            }
          }}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !product.isAvailable ? 'grayscale opacity-60' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

        {/* Top-Left: Pure Veg Badge (Glassmorphic) */}
        <div className="absolute top-3 left-3 z-10">
          <div className="glass-badge px-2 py-1 rounded-full shadow-sm flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 border-2 border-emerald-600 rounded-[3px] flex items-center justify-center bg-white dark:bg-slate-900 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </span>
            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Veg</span>
          </div>
        </div>

        {/* Top-Right: Bestseller / Spicy Badge */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end space-y-1">
          {product.isBestseller && (
            <span className="bg-amber-500/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm flex items-center space-x-1 border border-white/30">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Bestseller</span>
            </span>
          )}
          {product.isSpicy && (
            <span className="bg-rose-500/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm flex items-center space-x-0.5 border border-white/30">
              <Flame className="w-2.5 h-2.5" />
              <span>Spicy</span>
            </span>
          )}
        </div>

        {/* Bottom-Right: Prep Time Pill */}
        <div className="absolute bottom-2.5 right-3 z-10">
          <span className="bg-black/55 backdrop-blur-md text-white/95 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-white/20">
            <Clock className="w-3 h-3 text-orange-400" />
            <span>{product.preparationTimeMinutes} mins</span>
          </span>
        </div>
      </div>

      {/* Bottom: Dish Info & Add to Cart Controls */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Dish Title */}
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {formatCurrency(product.discountedPrice ?? product.price)}
            </span>
            {product.discountedPrice && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-medium">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Action Row */}
        <div className="pt-3.5 border-t border-slate-100/80 dark:border-slate-800 mt-3.5 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {product.calories ? `${product.calories} kcal` : 'Freshly prepared'}
          </span>

          {/* ADD / Quantity Stepper Button */}
          <div className="shrink-0">
            {!product.isAvailable ? (
              <div className="px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs text-center">
                Sold Out
              </div>
            ) : totalQtyInCart > 0 ? (
              <div className="flex items-center space-x-2 bg-orange-600 text-white rounded-xl shadow-md px-2.5 py-1.5">
                <button
                  type="button"
                  onClick={() => handleStepQuantity(-1)}
                  className="p-0.5 hover:bg-orange-700 rounded transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-black min-w-3 text-center">{totalQtyInCart}</span>
                <button
                  type="button"
                  onClick={() => handleStepQuantity(1)}
                  className="p-0.5 hover:bg-orange-700 rounded transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddClick}
                className="px-4 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-extrabold text-xs uppercase tracking-wider border border-orange-500 dark:border-orange-500/80 shadow-sm transition-all active:scale-95 flex items-center space-x-1"
              >
                <span>ADD</span>
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}

            {hasCustomizations && product.isAvailable && totalQtyInCart === 0 && (
              <div className="text-[9px] text-center text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                customisable
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
