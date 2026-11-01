import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Product, Category, FoodType } from '../../../types';
import { formatCurrency, getFoodTypeBadge } from '../../../utils/format';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Sparkles,
  Flame,
  Clock,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export const MenuTab: React.FC = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string>('all');

  // Modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Category form state
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('Utensils');

  // Product form state
  const [prodName, setProdName] = useState('');
  const [prodCatId, setProdCatId] = useState('');
  const [prodFoodType, setProdFoodType] = useState<FoodType>('veg');
  const [prodPrice, setProdPrice] = useState<number>(299);
  const [prodDiscountedPrice, setProdDiscountedPrice] = useState<number | undefined>(undefined);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodPrepTime, setProdPrepTime] = useState<number>(15);
  const [prodCalories, setProdCalories] = useState<number>(350);
  const [prodBestseller, setProdBestseller] = useState(false);
  const [prodChefSpecial, setProdChefSpecial] = useState(false);
  const [prodSpicy, setProdSpicy] = useState(false);

  // Open add/edit category modal
  const openCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatDesc(cat.description || '');
      setCatIcon(cat.icon || 'Utensils');
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatDesc('');
      setCatIcon('Utensils');
    }
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catName,
        description: catDesc,
        icon: catIcon
      });
    } else {
      addCategory({
        restaurantId: 'rest_craverse_blr',
        name: catName,
        description: catDesc,
        icon: catIcon,
        displayOrder: categories.length + 1,
        isActive: true
      });
    }
    setShowCategoryModal(false);
  };

  // Open add/edit product modal
  const openProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setProdName(prod.name);
      setProdCatId(prod.categoryId);
      setProdFoodType(prod.foodType);
      setProdPrice(prod.price);
      setProdDiscountedPrice(prod.discountedPrice);
      setProdDesc(prod.description);
      setProdImage(prod.imageUrl);
      setProdPrepTime(prod.preparationTimeMinutes);
      setProdCalories(prod.calories || 300);
      setProdBestseller(Boolean(prod.isBestseller));
      setProdChefSpecial(Boolean(prod.isChefSpecial));
      setProdSpicy(Boolean(prod.isSpicy));
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdCatId(categories[0]?.id || '');
      setProdFoodType('veg');
      setProdPrice(320);
      setProdDiscountedPrice(undefined);
      setProdDesc('');
      setProdImage('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&h=400&q=80');
      setProdPrepTime(15);
      setProdCalories(350);
      setProdBestseller(false);
      setProdChefSpecial(false);
      setProdSpicy(false);
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const targetCategory = categories.find((c) => c.id === prodCatId) || categories[0];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName,
        categoryId: targetCategory.id,
        categoryName: targetCategory.name,
        foodType: prodFoodType,
        price: Number(prodPrice),
        discountedPrice: prodDiscountedPrice ? Number(prodDiscountedPrice) : undefined,
        description: prodDesc,
        imageUrl: prodImage,
        preparationTimeMinutes: Number(prodPrepTime),
        calories: Number(prodCalories),
        isBestseller: prodBestseller,
        isChefSpecial: prodChefSpecial,
        isSpicy: prodSpicy
      });
    } else {
      addProduct({
        restaurantId: 'rest_craverse_blr',
        name: prodName,
        categoryId: targetCategory.id,
        categoryName: targetCategory.name,
        foodType: prodFoodType,
        price: Number(prodPrice),
        discountedPrice: prodDiscountedPrice ? Number(prodDiscountedPrice) : undefined,
        description: prodDesc,
        imageUrl: prodImage,
        isAvailable: true,
        preparationTimeMinutes: Number(prodPrepTime),
        calories: Number(prodCalories),
        isBestseller: prodBestseller,
        isChefSpecial: prodChefSpecial,
        isSpicy: prodSpicy
      });
    }
    setShowProductModal(false);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCatId !== 'all' && p.categoryId !== selectedCatId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <select
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => openCategoryModal()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-1.5 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-orange-600" />
            <span>Manage Categories</span>
          </button>

          <button
            onClick={() => openProductModal()}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-orange-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Categories Pills Carousel */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 text-xs"
          >
            <span className="font-bold text-slate-800">{cat.name}</span>
            <span className="text-[10px] font-semibold text-slate-400">
              ({products.filter((p) => p.categoryId === cat.id).length})
            </span>
            <button
              onClick={() => openCategoryModal(cat)}
              className="text-slate-400 hover:text-orange-600 ml-1"
              title="Edit category"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Products Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((prod) => {
          const badge = getFoodTypeBadge(prod.foodType);
          return (
            <div
              key={prod.id}
              className={`p-4 rounded-3xl border bg-white shadow-xs flex flex-col justify-between transition-all ${
                !prod.isAvailable ? 'opacity-70 border-slate-200' : 'border-slate-200/90 hover:border-orange-200'
              }`}
            >
              <div>
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span
                        className={`w-3.5 h-3.5 border-2 ${badge.borderClass} flex items-center justify-center rounded-[3px] bg-white shrink-0`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {prod.categoryName}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">
                      {prod.name}
                    </h4>

                    <div className="flex items-baseline space-x-1.5 mt-1">
                      <span className="font-black text-slate-900 text-sm">
                        {formatCurrency(prod.discountedPrice ?? prod.price)}
                      </span>
                      {prod.discountedPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(prod.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2.5 line-clamp-2">
                  {prod.description}
                </p>
              </div>

              {/* Bottom controls: In-stock toggle, Edit, Delete */}
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prod.isAvailable}
                    onChange={() => toggleProductAvailability(prod.id)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600 relative"></div>
                  <span className="text-[11px] font-bold text-slate-600">
                    {prod.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                </label>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openProductModal(prod)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="Edit dish"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${prod.name}" from menu?`)) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Delete dish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleSaveCategory}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category Name</label>
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Starters, Tandoor Breads..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="Brief description of dishes in this section"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Icon Style</label>
              <select
                value={catIcon}
                onChange={(e) => setCatIcon(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              >
                <option value="Utensils">Utensils</option>
                <option value="Flame">Flame / Tandoor</option>
                <option value="Soup">Soup / Handi</option>
                <option value="Wheat">Wheat / Breads</option>
                <option value="Cake">Cake / Sweets</option>
                <option value="Coffee">Coffee / Mocktails</option>
              </select>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProduct ? 'Edit Dish' : 'Add New Dish to Menu'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Angara Paneer Tikka"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={prodCatId}
                  onChange={(e) => setProdCatId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Food Type</label>
                <select
                  value={prodFoodType}
                  onChange={(e) => setProdFoodType(e.target.value as FoodType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                >
                  <option value="veg">Pure Veg</option>
                  <option value="non_veg">Non-Veg</option>
                  <option value="egg">Contains Egg</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Base Price (₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discounted Price (₹, optional)</label>
                <input
                  type="number"
                  min={0}
                  value={prodDiscountedPrice || ''}
                  onChange={(e) => setProdDiscountedPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 299"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Ingredients, preparation technique, serving details..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Food Photography Image URL
                </label>
                <input
                  type="url"
                  required
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
                {prodImage && (
                  <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                    <img src={prodImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prep Time (Mins)</label>
                <input
                  type="number"
                  min={1}
                  value={prodPrepTime}
                  onChange={(e) => setProdPrepTime(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  min={1}
                  value={prodCalories}
                  onChange={(e) => setProdCalories(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div className="col-span-2 flex space-x-4 pt-1">
                <label className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodBestseller}
                    onChange={(e) => setProdBestseller(e.target.checked)}
                    className="rounded text-orange-600"
                  />
                  <span>Bestseller</span>
                </label>
                <label className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodChefSpecial}
                    onChange={(e) => setProdChefSpecial(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Chef's Special</span>
                </label>
                <label className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodSpicy}
                    onChange={(e) => setProdSpicy(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span>Spicy</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
              >
                Save Dish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

