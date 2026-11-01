import React, { useState, useMemo } from 'react';
import { Product, ProductVariant, SelectedCustomization } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency, getFoodTypeBadge } from '../../utils/format';
import { X, Check, Plus, Minus, Info } from 'lucide-react';

interface CustomizationModalProps {
  product: Product;
  onClose: () => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({ product, onClose }) => {
  const { addToCart } = useApp();

  // Selected variant (defaults to default variant or first variant)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(() => {
    if (!product.variants || product.variants.length === 0) return undefined;
    return product.variants.find((v) => v.isDefault) || product.variants[0];
  });

  // Selected customizations: map groupId -> array of options
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, { id: string; name: string; priceDelta: number }[]>>(() => {
    const initial: Record<string, { id: string; name: string; priceDelta: number }[]> = {};
    if (product.customizationGroups) {
      product.customizationGroups.forEach((group) => {
        const defaults = group.options.filter((opt) => opt.isDefault);
        if (defaults.length > 0) {
          initial[group.id] = defaults.map((d) => ({
            id: d.id,
            name: d.name,
            priceDelta: d.priceDelta
          }));
        } else if (group.minSelections > 0 && group.options.length > 0) {
          // If mandatory and no default specified, pre-select first option for smooth user experience
          initial[group.id] = [
            {
              id: group.options[0].id,
              name: group.options[0].name,
              priceDelta: group.options[0].priceDelta
            }
          ];
        } else {
          initial[group.id] = [];
        }
      });
    }
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Compute unit price including selected variant and options
  const unitPrice = useMemo(() => {
    const base = selectedVariant ? selectedVariant.price : (product.discountedPrice ?? product.price);
    let addons = 0;
    Object.values(selectedOptionsMap).forEach((options) => {
      options.forEach((opt) => {
        addons += opt.priceDelta;
      });
    });
    return base + addons;
  }, [product, selectedVariant, selectedOptionsMap]);

  const totalPrice = unitPrice * quantity;

  const handleToggleOption = (
    groupId: string,
    option: { id: string; name: string; priceDelta: number },
    minSelections: number,
    maxSelections: number
  ) => {
    setValidationError(null);
    setSelectedOptionsMap((prev) => {
      const current = prev[groupId] || [];
      const exists = current.some((o) => o.id === option.id);

      if (maxSelections === 1) {
        // Single selection (Radio behavior)
        return {
          ...prev,
          [groupId]: [option]
        };
      }

      // Multi-selection (Checkbox behavior)
      if (exists) {
        // Do not uncheck if required and already at minimum
        if (current.length <= minSelections) {
          return prev;
        }
        return {
          ...prev,
          [groupId]: current.filter((o) => o.id !== option.id)
        };
      } else {
        if (maxSelections && current.length >= maxSelections) {
          setValidationError(`You can select at most ${maxSelections} options`);
          return prev;
        }
        return {
          ...prev,
          [groupId]: [...current, option]
        };
      }
    });
  };

  const handleAddToCart = () => {
    // Validate all mandatory groups
    if (product.customizationGroups) {
      for (const group of product.customizationGroups) {
        const selections = selectedOptionsMap[group.id] || [];
        if (selections.length < group.minSelections) {
          setValidationError(`Please select at least ${group.minSelections} option in "${group.title}"`);
          return;
        }
      }
    }

    // Transform map to SelectedCustomization array
    const customizationsList: SelectedCustomization[] = [];
    if (product.customizationGroups) {
      product.customizationGroups.forEach((group) => {
        const selected = selectedOptionsMap[group.id] || [];
        selected.forEach((opt) => {
          customizationsList.push({
            groupId: group.id,
            groupTitle: group.title,
            optionId: opt.id,
            optionName: opt.name,
            priceDelta: opt.priceDelta
          });
        });
      });
    }

    addToCart(product, selectedVariant, customizationsList, quantity, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="relative p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-start space-x-3">
            <span className="w-4 h-4 border-2 border-emerald-600 rounded-[3px] flex items-center justify-center bg-white dark:bg-slate-900 shrink-0 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            </span>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Customise according to your taste</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Customisation Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Variants / Portion Sizes (if present) */}
          {product.variants && product.variants.length > 0 && (
            <div className="border border-slate-100 dark:border-slate-700/80 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-900 dark:text-white text-sm">Select Portion / Size</span>
                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                  Required
                </span>
              </div>
              <div className="space-y-2">
                {product.variants.map((v) => {
                  const isChecked = selectedVariant?.id === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-1 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isChecked ? 'border-orange-600 bg-orange-600' : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {v.name}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {formatCurrency(v.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customization Groups */}
          {product.customizationGroups && product.customizationGroups.map((group) => {
            const currentSelected = selectedOptionsMap[group.id] || [];
            const isRadio = group.maxSelections === 1;

            return (
              <div key={group.id} className="border border-slate-100 dark:border-slate-700/80 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {group.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {group.minSelections > 0
                        ? `Select at least ${group.minSelections}${group.maxSelections ? ` (up to ${group.maxSelections})` : ''}`
                        : `Optional (up to ${group.maxSelections || 'unlimited'})`}
                    </p>
                  </div>
                  {group.minSelections > 0 && (
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                      Required
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {group.options.map((option) => {
                    const isChecked = currentSelected.some((o) => o.id === option.id);
                    return (
                      <div
                        key={option.id}
                        onClick={() =>
                          handleToggleOption(
                            group.id,
                            option,
                            group.minSelections,
                            group.maxSelections
                          )
                        }
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-1 ring-orange-500/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                              isRadio ? 'rounded-full' : 'rounded-[4px]'
                            } ${
                              isChecked
                                ? 'border-orange-600 bg-orange-600 text-white'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isChecked && (
                              isRadio ? <div className="w-1.5 h-1.5 rounded-full bg-white" /> : <Check className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {option.name}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                          {option.priceDelta > 0 ? `+${formatCurrency(option.priceDelta)}` : 'Free'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Chef Cooking Instructions Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Special Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less spicy, extra crispy, less sugar in coffee..."
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs font-semibold">
              <Info className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Modal Footer: Quantity Stepper & Add to Cart Button */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-black text-slate-900 dark:text-white w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-black text-sm flex items-center justify-between shadow-lg shadow-orange-600/30 transition-all"
          >
            <span>Add Item</span>
            <span className="bg-orange-700/60 px-2.5 py-1 rounded-lg">
              {formatCurrency(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
