import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import { generateUpiQrDataUrl } from '../../utils/qr';
import {
  X,
  Receipt,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  Sparkles,
  Printer,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BillSummaryModalProps {
  onClose: () => void;
  onOpenReceipt: () => void;
}

export const BillSummaryModal: React.FC<BillSummaryModalProps> = ({ onClose, onOpenReceipt }) => {
  const {
    currentTable,
    restaurant,
    getActiveTableBill,
    settleTableBill,
    createServiceRequest
  } = useApp();

  const bill = currentTable ? getActiveTableBill(currentTable.id) : null;
  const [upiQrUrl, setUpiQrUrl] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (bill && bill.total > 0) {
      generateUpiQrDataUrl(
        restaurant.upiVpa,
        restaurant.name,
        bill.total,
        `Table-${currentTable?.tableNumber || '16'}`
      ).then(setUpiQrUrl);
    }
  }, [bill, restaurant, currentTable]);

  if (!bill || bill.orders.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 dark:border-slate-800">
          <Receipt className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">No Active Bill</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
            Table {currentTable?.tableNumber || '16'} has no open orders. Place an order from the menu first.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (currentTable) {
        settleTableBill(currentTable.id, selectedMethod, `TXN_SANDBOX_${Date.now()}`);
        setPaymentSuccess(true);
        setIsProcessing(false);
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        } catch {
          // ignore
        }
      }
    }, 1200);
  };

  const handleRequestCashier = () => {
    createServiceRequest('request_bill', `Cashier requested for ${selectedMethod} payment at Table ${currentTable?.tableNumber}`);
    alert(`A cashier has been notified to collect ${selectedMethod.toUpperCase()} payment at Table ${currentTable?.tableNumber}!`);
    onClose();
  };

  const hasAnyTaxes =
    restaurant.taxRates.cgstPercent > 0 ||
    restaurant.taxRates.sgstPercent > 0 ||
    restaurant.taxRates.serviceChargePercent > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Table Bill & Payment</h3>
              <span className="text-[11px] text-slate-400">
                Table {currentTable?.tableNumber} • Session Bill
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Payment Received!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Amount of {formatCurrency(bill.total)} successfully settled via {selectedMethod.toUpperCase()}.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-left text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Table:</span>
                <span className="font-bold">{currentTable?.tableNumber}</span>
              </div>
              {bill.orders[0]?.customerName && (
                <div className="flex justify-between">
                  <span>Guest:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {bill.orders[0].customerName} {bill.orders[0].customerPhone ? `(${bill.orders[0].customerPhone})` : ''}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Auth Code:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">AUTH_{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenReceipt();
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Printer className="w-4 h-4" />
                <span>View Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {/* Bill items summary */}
            <div className="border border-slate-200/80 dark:border-slate-700 rounded-2xl p-3.5 bg-slate-50/70 dark:bg-slate-800/60 space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-700 pb-2">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Table Order Summary</span>
                  {bill.orders[0]?.customerName && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Guest: <span className="font-semibold text-slate-700 dark:text-slate-300">{bill.orders[0].customerName}</span>
                      {bill.orders[0].customerPhone && <span className="font-mono text-orange-600 dark:text-orange-400"> ({bill.orders[0].customerPhone})</span>}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {bill.orders.reduce((sum, o) => sum + o.items.length, 0)} items across {bill.orders.length} order batch(es)
                </span>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 border-b border-slate-200/60 dark:border-slate-700 pb-2">
                {bill.orders.map((ord) =>
                  ord.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-slate-700 dark:text-slate-300">
                      <span className="truncate max-w-[220px]">
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-300 pt-1">
                <span>Subtotal</span>
                <span>{formatCurrency(bill.subtotal)}</span>
              </div>
              {bill.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discounts Applied</span>
                  <span>-{formatCurrency(bill.discount)}</span>
                </div>
              )}

              {hasAnyTaxes ? (
                <>
                  {restaurant.taxRates.cgstPercent > 0 && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>CGST ({restaurant.taxRates.cgstPercent}%)</span>
                      <span>{formatCurrency(bill.cgst)}</span>
                    </div>
                  )}
                  {restaurant.taxRates.sgstPercent > 0 && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>SGST ({restaurant.taxRates.sgstPercent}%)</span>
                      <span>{formatCurrency(bill.sgst)}</span>
                    </div>
                  )}
                  {restaurant.taxRates.serviceChargePercent > 0 && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Service Charge ({restaurant.taxRates.serviceChargePercent}%)</span>
                      <span>{formatCurrency(bill.serviceCharge)}</span>
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

              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-black text-slate-900 dark:text-white text-base">
                <span>Total Amount</span>
                <span className="text-orange-600 dark:text-orange-400 font-black">
                  {formatCurrency(bill.total)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Choose Settlement Method:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center space-y-1.5 transition-all ${
                    selectedMethod === 'upi'
                      ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 ring-2 ring-orange-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-xs font-bold">UPI QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center space-y-1.5 transition-all ${
                    selectedMethod === 'card'
                      ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 ring-2 ring-orange-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold">Card POS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('cash')}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center space-y-1.5 transition-all ${
                    selectedMethod === 'cash'
                      ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 ring-2 ring-orange-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold">Cash</span>
                </button>
              </div>
            </div>

            {/* UPI QR Display if UPI is chosen */}
            {selectedMethod === 'upi' ? (
              <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-slate-800/90 border border-orange-200 dark:border-slate-700 flex flex-col items-center text-center space-y-2">
                {upiQrUrl ? (
                  <div className="p-2 bg-white rounded-xl shadow-xs border border-orange-100">
                    <img src={upiQrUrl} alt="UPI QR Code" className="w-36 h-36 mx-auto" />
                  </div>
                ) : (
                  <div className="w-36 h-36 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">
                    Loading QR...
                  </div>
                )}
                <div className="text-xs font-black text-slate-900 dark:text-white">
                  Scan & Pay {formatCurrency(bill.total)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {restaurant.upiVpa}
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Instant Automatic Verification</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  A staff member will arrive at Table <strong>{currentTable?.tableNumber}</strong> with the{' '}
                  {selectedMethod === 'card' ? 'wireless card POS machine' : 'cash receipt & change binder'}.
                </p>
                <button
                  type="button"
                  onClick={handleRequestCashier}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
                >
                  Call Server to Table
                </button>
              </div>
            )}

            {/* Settle Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-orange-600/30 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Verifying Payment...</span>
                ) : (
                  <>
                    <span>Confirm & Settle {formatCurrency(bill.total)}</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
