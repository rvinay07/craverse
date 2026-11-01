import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { InventoryItem } from '../../../types';
import { formatCurrency } from '../../../utils/format';
import {
  Package,
  Plus,
  AlertTriangle,
  ArrowUpDown,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';

export const InventoryTab: React.FC = () => {
  const { inventory, updateInventoryStock, addInventoryItem } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [stockAdjustmentDelta, setStockAdjustmentDelta] = useState<number>(0);

  // Add Item form state
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('Dairy');
  const [itemStock, setItemStock] = useState<number>(10);
  const [itemMin, setItemMin] = useState<number>(5);
  const [itemUnit, setItemUnit] = useState('kg');
  const [itemCost, setItemCost] = useState<number>(200);
  const [itemSupplier, setItemSupplier] = useState('');

  const filteredItems = inventory.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.supplierName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    addInventoryItem({
      restaurantId: 'rest_craverse_blr',
      name: itemName.trim(),
      category: itemCategory,
      currentStock: Number(itemStock),
      minThreshold: Number(itemMin),
      unit: itemUnit,
      costPerUnit: Number(itemCost),
      supplierName: itemSupplier.trim() || 'Direct Market Wholesale'
    });

    setItemName('');
    setShowAddModal(false);
  };

  const handleConfirmStockAdjust = () => {
    if (!adjustingItem) return;
    const newStock = Math.max(0, adjustingItem.currentStock + stockAdjustmentDelta);
    updateInventoryStock(adjustingItem.id, newStock);
    setAdjustingItem(null);
    setStockAdjustmentDelta(0);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search raw materials, suppliers..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-orange-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Raw Material / Stock</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Ingredient / Material</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Current Stock</th>
                <th className="px-4 py-3.5">Min Threshold</th>
                <th className="px-4 py-3.5">Cost / Unit</th>
                <th className="px-4 py-3.5">Primary Supplier</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isLow = item.currentStock <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-400">Updated: {item.lastUpdated}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {item.category}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-black text-sm ${
                            isLow ? 'text-red-600' : 'text-slate-900'
                          }`}
                        >
                          {item.currentStock} {item.unit}
                        </span>
                        {isLow && (
                          <span className="flex items-center space-x-0.5 text-[9px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>Low</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 font-semibold">
                      {formatCurrency(item.costPerUnit)}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {item.supplierName}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setAdjustingItem(item);
                          setStockAdjustmentDelta(0);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-orange-500 hover:text-orange-600 text-slate-600 font-semibold text-xs flex items-center space-x-1 ml-auto"
                      >
                        <ArrowUpDown className="w-3 h-3" />
                        <span>Adjust Stock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Adjust Stock Level</h3>
                <p className="text-xs text-slate-500">{adjustingItem.name}</p>
              </div>
              <button
                onClick={() => setAdjustingItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl flex justify-between items-center text-xs">
              <span className="text-slate-500">Current on hand:</span>
              <span className="font-black text-slate-900 text-sm">
                {adjustingItem.currentStock} {adjustingItem.unit}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Stock Delta (+ Addition / - Deduction)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setStockAdjustmentDelta((d) => d - 5)}
                  className="px-2 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => setStockAdjustmentDelta((d) => d - 1)}
                  className="px-2 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700"
                >
                  -1
                </button>
                <input
                  type="number"
                  value={stockAdjustmentDelta}
                  onChange={(e) => setStockAdjustmentDelta(Number(e.target.value))}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-center font-black text-sm"
                />
                <button
                  type="button"
                  onClick={() => setStockAdjustmentDelta((d) => d + 1)}
                  className="px-2 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => setStockAdjustmentDelta((d) => d + 5)}
                  className="px-2 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700"
                >
                  +5
                </button>
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5 text-center">
                New resulting stock: <b>{Math.max(0, adjustingItem.currentStock + stockAdjustmentDelta)} {adjustingItem.unit}</b>
              </div>
            </div>

            <div className="flex space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStockAdjust}
                className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Inventory Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleSaveItem}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">New Raw Material</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Item Name</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Amul Fresh Cream"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                >
                  <option value="Dairy">Dairy</option>
                  <option value="Poultry">Poultry / Meat</option>
                  <option value="Grains">Grains & Rice</option>
                  <option value="Spices">Spices & Oils</option>
                  <option value="Produce">Fresh Produce</option>
                  <option value="Beverages">Beverages & Syrups</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Measuring Unit</label>
                <select
                  value={itemUnit}
                  onChange={(e) => setItemUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                >
                  <option value="kg">kg</option>
                  <option value="ltr">litres</option>
                  <option value="gms">grams</option>
                  <option value="pcs">pieces</option>
                  <option value="cans">cans</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Stock</label>
                <input
                  type="number"
                  min={0}
                  value={itemStock}
                  onChange={(e) => setItemStock(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Low Threshold</label>
                <input
                  type="number"
                  min={1}
                  value={itemMin}
                  onChange={(e) => setItemMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cost Per Unit (₹)</label>
                <input
                  type="number"
                  min={1}
                  value={itemCost}
                  onChange={(e) => setItemCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Supplier Name</label>
                <input
                  type="text"
                  value={itemSupplier}
                  onChange={(e) => setItemSupplier(e.target.value)}
                  placeholder="e.g. Metro Direct"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
              >
                Save Material
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

