import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, getFoodTypeBadge } from '../../utils/format';
import { generateUpiQrDataUrl } from '../../utils/qr';
import { PaymentMethod } from '../../types';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  CheckCircle2,
  Receipt,
  UtensilsCrossed,
  Sparkles,
  QrCode,
  Banknote,
  ShieldCheck,
  User,
  Phone,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlacedSuccess: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderPlacedSuccess
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartTotals,
    restaurant,
    currentTable,
    placeOrder,
    settleTableBill
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [customerName, setCustomerName] = useState(() => {
    return localStorage.getItem('craverse_guest_name') || '';
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    return localStorage.getItem('craverse_guest_phone') || '';
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Integrated Payment state
  const [paymentChoice, setPaymentChoice] = useState<'pay_upi_now' | 'pay_at_table'>('pay_upi_now');
  const [upiQrUrl, setUpiQrUrl] = useState<string>('');

  useEffect(() => {
    if (cartTotals.totalAmount > 0) {
      generateUpiQrDataUrl(
        restaurant.upiVpa,
        restaurant.name,
        cartTotals.totalAmount,
        `Table-${currentTable?.tableNumber || '16'}`
      ).then(setUpiQrUrl);
    }
  }, [cartTotals.totalAmount, restaurant, currentTable]);

  if (!isOpen) return null;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code) return;
    const res = applyCoupon(code);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const validateCustomerDetails = () => {
    let isValid = true;
    const trimmedName = customerName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setNameError('Full name is required (minimum 2 characters)');
      isValid = false;
    } else {
      setNameError('');
    }

    const cleanDigits = customerPhone.replace(/\D/g, '');
    if (!cleanDigits) {
      setPhoneError('Mobile number is required for order and table billing');
      isValid = false;
    } else if (cleanDigits.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number (e.g. 9876543210)');
      isValid = false;
    } else {
      setPhoneError('');
    }

    return isValid;
  };

  const handleConfirmAndPay = () => {
    if (cart.length === 0) return;

    if (!validateCustomerDetails()) {
      return;
    }

    const trimmedName = customerName.trim();
    const cleanPhone = customerPhone.replace(/\D/g, '');

    // Persist for smooth subsequent orders from this device
    localStorage.setItem('craverse_guest_name', trimmedName);
    localStorage.setItem('craverse_guest_phone', cleanPhone);

    setIsSubmitting(true);

    try {
      const created = placeOrder(trimmedName, cleanPhone, orderNotes.trim() || undefined);
      if (created) {
        if (paymentChoice === 'pay_upi_now' && currentTable) {
          // Immediately settle the payment via UPI
          settleTableBill(currentTable.id, 'upi', `TXN_UPI_${Date.now()}`);
        }

        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }

        clearCart();
        onClose();
        onOrderPlacedSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAnyTaxes =
    restaurant.taxRates.cgstPercent > 0 ||
    restaurant.taxRates.sgstPercent > 0 ||
    restaurant.taxRates.serviceChargePercent > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Your Order Cart
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Table {currentTable?.tableNumber || '16'} • 100% Pure Veg
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-slate-800 flex items-center justify-center text-orange-400 dark:text-orange-300 mb-3">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Your cart is empty</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                Add some tasty pizzas, snacks, or iced lattes from our 100% pure veg menu.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        <span className="w-3.5 h-3.5 border-2 border-emerald-600 rounded-[3px] flex items-center justify-center bg-white dark:bg-slate-900 shrink-0 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-snug">
                            {item.product.name}
                          </h4>
                          {item.selectedVariant && (
                            <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                              Portion: {item.selectedVariant.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="font-black text-slate-900 dark:text-white text-sm shrink-0">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>

                    {item.selectedCustomizations.length > 0 && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-5 space-y-0.5">
                        {item.selectedCustomizations.map((c, i) => (
                          <div key={i} className="flex justify-between">
                            <span>• {c.optionName}</span>
                            {c.priceDelta > 0 && <span>+{formatCurrency(c.priceDelta)}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded italic pl-5">
                        Note: "{item.specialInstructions}"
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-700/60 pl-5">
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-slate-400 hover:text-red-500 text-xs flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>

                      <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700/80 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, -1)}
                          className="p-1 hover:text-orange-600 dark:hover:text-orange-400 font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-slate-900 dark:text-white min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, 1)}
                          className="p-1 hover:text-orange-600 dark:hover:text-orange-400 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mandatory Guest Contact Details */}
              <div className="border border-orange-200 dark:border-orange-800/60 rounded-2xl p-4 bg-orange-50/50 dark:bg-slate-800/80 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                        Guest Contact Details <span className="text-red-500 font-bold">*</span>
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Required for kitchen tickets & table service
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60">
                    Required *
                  </span>
                </div>

                {/* Full Name Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                    <span>Full Name</span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (nameError && e.target.value.trim().length >= 2) {
                          setNameError('');
                        }
                      }}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                        nameError
                          ? 'border-red-500 focus:ring-red-400 bg-red-50/20'
                          : 'border-slate-200 dark:border-slate-700 focus:ring-orange-500/40 focus:border-orange-500'
                      }`}
                    />
                  </div>
                  {nameError && (
                    <div className="flex items-center space-x-1 text-[11px] text-red-600 dark:text-red-400 font-semibold pt-0.5 animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{nameError}</span>
                    </div>
                  )}
                </div>

                {/* Mobile Phone Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                    <span>Phone Number</span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative flex rounded-xl shadow-xs">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold font-mono">
                      <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={customerPhone}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setCustomerPhone(digitsOnly);
                        if (phoneError && digitsOnly.length === 10) {
                          setPhoneError('');
                        }
                      }}
                      placeholder="9876543210"
                      className={`w-full rounded-r-xl border px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 font-mono tracking-wider focus:outline-none focus:ring-2 ${
                        phoneError
                          ? 'border-red-500 focus:ring-red-400 bg-red-50/20'
                          : 'border-slate-200 dark:border-slate-700 focus:ring-orange-500/40 focus:border-orange-500'
                      }`}
                    />
                  </div>
                  {phoneError && (
                    <div className="flex items-center space-x-1 text-[11px] text-red-600 dark:text-red-400 font-semibold pt-0.5 animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{phoneError}</span>
                    </div>
                  )}
                </div>

                {/* Cooking Instructions (Optional) */}
                <div className="space-y-1 pt-1 border-t border-orange-100 dark:border-slate-700/60">
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center space-x-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>Special Cooking Note for Kitchen (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Less spicy, extra napkins, serve coffee first..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Coupons Section */}
              <div className="border border-slate-100 dark:border-slate-700 rounded-2xl p-3 bg-slate-50/70 dark:bg-slate-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    <span>Coupons & Offers</span>
                  </span>
                  {appliedCoupon && (
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] text-red-600 dark:text-red-400 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>'{appliedCoupon.code}' Applied!</span>
                    </div>
                    <span className="font-bold">
                      -{formatCurrency(cartTotals.discountAmount)}
                    </span>
                  </div>
                ) : (
                  <div className="flex space-x-1.5">
                    {['WELCOME10', 'PIZZA20', 'FLAT30'].map((code) => (
                      <button
                        key={code}
                        onClick={() => handleApplyCoupon(code)}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-100/70 dark:bg-orange-950/60 hover:bg-orange-200 dark:hover:bg-orange-900 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 transition-colors"
                      >
                        ⚡ {code}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Integrated Payment Options directly inside user checkout */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 bg-white dark:bg-slate-800/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <QrCode className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span>Payment Method</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-bold">
                    Zero Waiting
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('pay_upi_now')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentChoice === 'pay_upi_now'
                        ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 ring-2 ring-orange-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <QrCode className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">UPI Scan & Pay</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      GPay • PhonePe • Paytm
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChoice('pay_at_table')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentChoice === 'pay_at_table'
                        ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 ring-2 ring-orange-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Pay at Table</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Cash or Card after meal
                    </span>
                  </button>
                </div>

                {/* Live UPI QR Preview if user chooses UPI */}
                {paymentChoice === 'pay_upi_now' && upiQrUrl && (
                  <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-slate-900/80 border border-orange-200/80 dark:border-orange-800/40 flex flex-col items-center text-center space-y-2 animate-fadeIn">
                    <div className="p-1.5 bg-white rounded-lg shadow-xs border border-orange-100">
                      <img src={upiQrUrl} alt="UPI QR" className="w-28 h-28" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      Scan with any UPI App • {formatCurrency(cartTotals.totalAmount)}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      VPA: {restaurant.upiVpa}
                    </div>
                  </div>
                )}
              </div>

              {/* Bill Details breakdown */}
              <div className="border border-slate-100 dark:border-slate-700 rounded-2xl p-3.5 bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">Bill Summary</div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotals.subtotal)}</span>
                </div>
                {cartTotals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(cartTotals.discountAmount)}</span>
                  </div>
                )}

                {/* GST & Service Charge Section */}
                {hasAnyTaxes ? (
                  <>
                    {restaurant.taxRates.cgstPercent > 0 && (
                      <div className="flex justify-between">
                        <span>CGST ({restaurant.taxRates.cgstPercent}%)</span>
                        <span>{formatCurrency(cartTotals.cgstAmount)}</span>
                      </div>
                    )}
                    {restaurant.taxRates.sgstPercent > 0 && (
                      <div className="flex justify-between">
                        <span>SGST ({restaurant.taxRates.sgstPercent}%)</span>
                        <span>{formatCurrency(cartTotals.sgstAmount)}</span>
                      </div>
                    )}
                    {restaurant.taxRates.serviceChargePercent > 0 && (
                      <div className="flex justify-between">
                        <span>Service Charge ({restaurant.taxRates.serviceChargePercent}%)</span>
                        <span>{formatCurrency(cartTotals.serviceChargeAmount)}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                    <span className="flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>GST & Taxes:</span>
                    </span>
                    <span>₹0 (Zero GST • No extra charges)</span>
                  </div>
                )}

                <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 flex justify-between font-black text-slate-900 dark:text-white text-sm">
                  <span>Total Amount</span>
                  <span className="text-orange-600 dark:text-orange-400 font-black">
                    {formatCurrency(cartTotals.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer: Confirm & Pay */}
          {cart.length > 0 && (
            <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <button
                onClick={handleConfirmAndPay}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-xl shadow-orange-600/30 transition-all disabled:opacity-50"
              >
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-orange-200">
                    {paymentChoice === 'pay_upi_now' ? 'Instant Pay & Order' : 'Order Now • Pay Later'}
                  </div>
                  <div className="text-base font-black">
                    {formatCurrency(cartTotals.totalAmount)}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 font-bold">
                  <span>{paymentChoice === 'pay_upi_now' ? 'Confirm & Settle via UPI' : 'Send to Kitchen'}</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
