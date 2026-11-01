import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Table, PaymentMethod } from '../../types';
import { formatCurrency } from '../../utils/format';
import {
  CreditCard,
  Banknote,
  QrCode,
  Printer,
  CheckCircle2,
  Receipt,
  Search,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ReceiptModal } from '../common/ReceiptModal';
import confetti from 'canvas-confetti';

export const CashierBilling: React.FC = () => {
  const { tables, getActiveTableBill, settleTableBill, restaurant } = useApp();
  const [selectedTableId, setSelectedTableId] = useState<string>(() => {
    const occupied = tables.find((t) => t.status === 'occupied');
    return occupied ? occupied.id : tables[0]?.id || '';
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const activeBill = selectedTable ? getActiveTableBill(selectedTable.id) : null;

  const handleSettle = () => {
    if (!selectedTable || !activeBill || activeBill.total === 0) return;

    settleTableBill(selectedTable.id, paymentMethod, `TXN_${Date.now()}`);
    setPaymentSuccessMsg(`Table ${selectedTable.tableNumber} bill settled successfully via ${paymentMethod.toUpperCase()}!`);
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pb-12 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sticky top-14 sm:top-14 z-30 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="/craverse-logo.jpg"
            alt="Craverse"
            className="w-10 h-10 rounded-xl object-cover border border-orange-500/30 bg-black shadow-xs shrink-0"
          />
          <div>
            <h1 className="font-extrabold text-slate-900 dark:text-white text-lg">Cashier POS & Billing</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Craverse • Instant settlement, UPI QR, cash drawer, and thermal invoice printing
            </p>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tables with Open Bills */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-bold text-slate-800 text-sm">Select Table to Bill</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tables.map((t) => {
              const bill = getActiveTableBill(t.id);
              const isSelected = selectedTableId === t.id;
              const hasBalance = bill.total > 0;

              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTableId(t.id);
                    setPaymentSuccessMsg(null);
                  }}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                      : hasBalance
                      ? 'border-amber-300 bg-white hover:border-amber-400'
                      : 'border-slate-200 bg-white opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400 font-bold">T-{t.tableNumber}</span>
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        hasBalance ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {hasBalance ? 'Unbilled' : 'Vacant'}
                    </span>
                  </div>

                  <div className="text-base font-black text-slate-900 my-1">
                    {hasBalance ? formatCurrency(bill.total) : '₹0'}
                  </div>

                  <div className="text-[10px] text-slate-500 truncate">
                    {t.floorName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Bill & Settlement Controls */}
        <div className="lg:col-span-7">
          {paymentSuccessMsg && (
            <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{paymentSuccessMsg}</span>
              </div>
              <button
                onClick={() => setShowReceiptModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          )}

          {!selectedTable || !activeBill || activeBill.total === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-base">No Open Orders on this Table</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Table {selectedTable?.tableNumber || '--'} currently has zero balance or is vacant.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 sm:p-6 space-y-5">
              {/* Table Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">
                    Table {selectedTable.tableNumber} Bill
                  </h3>
                  <p className="text-xs text-slate-500">
                    Floor: {selectedTable.floorName} • Session: {selectedTable.currentSessionId || 'Active'}
                    {activeBill.orders[0]?.customerName && (
                      <span className="font-semibold text-slate-700 ml-1">
                        • Guest: {activeBill.orders[0].customerName}
                        {activeBill.orders[0].customerPhone && ` (${activeBill.orders[0].customerPhone})`}
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-bold block">Total Payable</span>
                  <span className="text-2xl font-black text-orange-600">
                    {formatCurrency(activeBill.total)}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {activeBill.orders.map((ord) => (
                  <div key={ord.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span>Order {ord.orderNumber}</span>
                        {ord.customerName && (
                          <span className="text-[11px] font-normal text-slate-500">
                            • {ord.customerName} {ord.customerPhone ? `(${ord.customerPhone})` : ''}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-slate-400">
                        {new Date(ord.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {ord.items.map((it) => (
                      <div key={it.id} className="flex justify-between text-xs text-slate-600 py-0.5">
                        <span className="truncate max-w-[260px]">
                          {it.quantity}x {it.productName} {it.variantName ? `(${it.variantName})` : ''}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {formatCurrency(it.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Calculations breakdown */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Item Subtotal:</span>
                  <span>{formatCurrency(activeBill.subtotal)}</span>
                </div>
                {activeBill.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatCurrency(activeBill.discount)}</span>
                  </div>
                )}
                {(restaurant.taxRates.cgstPercent > 0 || restaurant.taxRates.sgstPercent > 0 || restaurant.taxRates.serviceChargePercent > 0) ? (
                  <>
                    {restaurant.taxRates.cgstPercent > 0 && (
                      <div className="flex justify-between">
                        <span>CGST ({restaurant.taxRates.cgstPercent}%):</span>
                        <span>{formatCurrency(activeBill.cgst)}</span>
                      </div>
                    )}
                    {restaurant.taxRates.sgstPercent > 0 && (
                      <div className="flex justify-between">
                        <span>SGST ({restaurant.taxRates.sgstPercent}%):</span>
                        <span>{formatCurrency(activeBill.sgst)}</span>
                      </div>
                    )}
                    {restaurant.taxRates.serviceChargePercent > 0 && (
                      <div className="flex justify-between">
                        <span>Service Charge ({restaurant.taxRates.serviceChargePercent}%):</span>
                        <span>{formatCurrency(activeBill.serviceCharge)}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-between text-emerald-700 font-bold text-xs py-0.5">
                    <span>GST & Taxes:</span>
                    <span>₹0 (Zero GST Café)</span>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Settlement Method:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: <QrCode className="w-4 h-4 text-orange-600" /> },
                    { id: 'cash', label: 'Cash Tender', icon: <Banknote className="w-4 h-4 text-emerald-600" /> },
                    { id: 'card', label: 'Card Swipe', icon: <CreditCard className="w-4 h-4 text-blue-600" /> },
                    { id: 'gateway_sandbox', label: 'Sandbox PG', icon: <ShieldCheck className="w-4 h-4 text-purple-600" /> }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center space-y-1 transition-all ${
                        paymentMethod === m.id
                          ? 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-500/20 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {m.icon}
                      <span className="text-[11px]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settle Action Button */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 hover:bg-slate-50"
                >
                  <Printer className="w-4 h-4" />
                  <span>Preview Receipt</span>
                </button>

                <button
                  onClick={handleSettle}
                  className="flex-1 py-3 px-5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-orange-600/30 transition-all active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Settle Bill & Release Table</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Printable Receipt Modal */}
      {showReceiptModal && (
        <ReceiptModal onClose={() => setShowReceiptModal(false)} />
      )}
    </div>
  );
};

