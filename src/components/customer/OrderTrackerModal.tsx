import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import { formatCurrency, formatTimeElapsed } from '../../utils/format';
import {
  X,
  CheckCircle2,
  Clock,
  ChefHat,
  UtensilsCrossed,
  Sparkles,
  BellRing,
  Receipt,
  Plus,
  Ban,
  AlertTriangle
} from 'lucide-react';

interface OrderTrackerModalProps {
  onClose: () => void;
  onOrderMore: () => void;
  onCallWaiter: () => void;
  onRequestBill: () => void;
}

const STEPS: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'placed', label: 'Order Placed', icon: <Clock className="w-4 h-4" /> },
  { status: 'accepted', label: 'Confirmed', icon: <CheckCircle2 className="w-4 h-4" /> },
  { status: 'preparing', label: 'Preparing', icon: <ChefHat className="w-4 h-4" /> },
  { status: 'ready', label: 'Ready to Serve', icon: <Sparkles className="w-4 h-4" /> },
  { status: 'served', label: 'Served', icon: <UtensilsCrossed className="w-4 h-4" /> },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  onClose,
  onOrderMore,
  onCallWaiter,
  onRequestBill
}) => {
  const { currentTable, orders, cancelOrder } = useApp();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');
  const [justCancelled, setJustCancelled] = useState(false);

  // Find all active orders for this table
  const tableOrders = currentTable
    ? orders.filter(
        (o) =>
          o.tableId === currentTable.id &&
          o.status !== 'completed' &&
          o.status !== 'cancelled'
      )
    : [];

  const primaryOrder = tableOrders[0];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'accepted':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
        return 3;
      case 'served':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = primaryOrder ? getStepIndex(primaryOrder.status) : 0;

  const handleCancelOrder = () => {
    if (!primaryOrder) return;
    cancelOrder(primaryOrder.id, `Customer: ${cancelReason}`);
    setShowCancelConfirm(false);
    setJustCancelled(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base">Live Kitchen Status</h2>
              <p className="text-[11px] text-slate-400">
                Table {currentTable?.tableNumber} • {primaryOrder ? primaryOrder.orderNumber : 'No active order'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {justCancelled ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Order Cancelled</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Your order has been cancelled and the kitchen was notified. You can browse our pure veg menu and place a fresh order whenever you like.
              </p>
              <button
                onClick={() => {
                  setJustCancelled(false);
                  onClose();
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20"
              >
                Back to Menu
              </button>
            </div>
          ) : !primaryOrder ? (
            <div className="text-center py-8">
              <UtensilsCrossed className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No active orders right now</p>
              <p className="text-xs text-slate-400 mt-1">Browse our menu and place your table order!</p>
            </div>
          ) : (
            <>
              {/* Progress Stepper */}
              <div className="bg-orange-50/50 dark:bg-slate-800/60 rounded-2xl p-4 border border-orange-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-orange-950 dark:text-orange-300 uppercase tracking-wider">
                    Preparation Progress
                  </span>
                  <span className="text-xs font-semibold text-orange-700 dark:text-orange-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est: {primaryOrder.estimatedPrepTimeMinutes} mins</span>
                  </span>
                </div>

                <div className="relative flex justify-between items-center">
                  {/* Connecting Line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-700 z-0">
                    <div
                      className="h-full bg-orange-600 transition-all duration-500"
                      style={{ width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%` }}
                    />
                  </div>

                  {STEPS.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={step.status} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                            isCurrent
                              ? 'bg-orange-600 text-white ring-4 ring-orange-200 dark:ring-orange-950 animate-pulse'
                              : isDone
                              ? 'bg-orange-600 text-white'
                              : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-400'
                          }`}
                        >
                          {isDone ? step.icon : idx + 1}
                        </div>
                        <span
                          className={`mt-2 text-[10px] sm:text-[11px] font-bold text-center max-w-[65px] leading-tight ${
                            isCurrent
                              ? 'text-orange-700 dark:text-orange-400'
                              : isDone
                              ? 'text-slate-800 dark:text-slate-200'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Batch Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Items in this Session ({tableOrders.reduce((sum, o) => sum + o.items.length, 0)})
                    </h3>
                    {primaryOrder.customerName && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Guest: <span className="font-semibold text-slate-700 dark:text-slate-300">{primaryOrder.customerName}</span>
                        {primaryOrder.customerPhone && <span className="font-mono text-orange-600 dark:text-orange-400"> ({primaryOrder.customerPhone})</span>}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {formatTimeElapsed(primaryOrder.placedAt)}
                  </span>
                </div>

                <div className="space-y-2">
                  {tableOrders.map((ord) =>
                    ord.items.map((item) => {
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className="w-3.5 h-3.5 border-2 border-emerald-600 rounded-[3px] flex items-center justify-center bg-white dark:bg-slate-900 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            </span>
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                                {item.quantity}x {item.productName}
                              </h4>
                              {item.variantName && (
                                <span className="text-[10px] text-slate-400">
                                  {item.variantName}
                                </span>
                              )}
                              {item.customizationDetails && item.customizationDetails.length > 0 && (
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {item.customizationDetails.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {formatCurrency(item.totalPrice)}
                            </span>
                            <div className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400">
                              {item.status}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Quick Actions at Table */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onCallWaiter();
                  }}
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <BellRing className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>Call Waiter</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onRequestBill();
                  }}
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Receipt className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>View & Pay Bill</span>
                </button>
              </div>

              {/* Customer Cancel Order Action */}
              {primaryOrder.status !== 'served' && (
                <div className="pt-1">
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full py-2.5 px-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/70 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel This Order</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!justCancelled && (
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex space-x-3">
            <button
              onClick={() => {
                onClose();
                onOrderMore();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md shadow-orange-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Order More Dishes & Coffee</span>
            </button>
          </div>
        )}
      </div>

      {/* Cancel Order Confirmation Dialog */}
      {showCancelConfirm && primaryOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-slate-900 dark:text-slate-100 animate-slide-up">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-extrabold text-base">Cancel Order?</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Are you sure you want to cancel Order <strong>{primaryOrder.orderNumber}</strong>?
            </p>

            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Reason for cancellation:
            </label>
            <div className="space-y-1.5 mb-5">
              {[
                'Ordered by mistake',
                'Change of mind',
                'Wait time is longer than expected',
                'Need to leave table'
              ].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setCancelReason(reason)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    cancelReason === reason
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-300 ring-1 ring-red-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
