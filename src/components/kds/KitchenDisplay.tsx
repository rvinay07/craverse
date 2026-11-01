import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatTimeElapsed, getFoodTypeBadge } from '../../utils/format';
import { playSound } from '../../utils/audio';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Flame,
  Volume2,
  VolumeX,
  Sparkles,
  Ban,
  X,
  AlertTriangle
} from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const { orders, updateOrderStatus, cancelOrder } = useApp();
  const [stationFilter, setStationFilter] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Out of ingredients');

  // Active tickets for the kitchen
  const activeOrders = orders.filter((o) => {
    if (showCompleted) {
      return o.status === 'ready' || o.status === 'served' || o.status === 'completed' || o.status === 'cancelled';
    }
    return o.status === 'placed' || o.status === 'accepted' || o.status === 'preparing';
  });

  // Calculate elapsed time in minutes for urgency badge
  const getElapsedMinutes = (placedAtIso: string): number => {
    const diffMs = Date.now() - new Date(placedAtIso).getTime();
    return Math.floor(diffMs / (1000 * 60));
  };

  const handleNextStatus = (order: Order) => {
    let next: OrderStatus = 'accepted';
    if (order.status === 'placed') next = 'accepted';
    else if (order.status === 'accepted') next = 'preparing';
    else if (order.status === 'preparing') next = 'ready';
    else if (order.status === 'ready') next = 'served';

    updateOrderStatus(order.id, next, `Kitchen moved ticket to ${next}`);
    if (soundEnabled) {
      if (next === 'ready') playSound('status_ready');
      else playSound('kitchen_new');
    }
  };

  const handleConfirmCancel = () => {
    if (!cancellingOrder) return;
    cancelOrder(cancellingOrder.id, `Kitchen: ${cancelReason}`);
    setCancellingOrder(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* KDS Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-14 sm:top-14 z-30 shadow-lg">
        <div className="flex items-center space-x-3">
          <img
            src="/craverse-logo.jpg"
            alt="Craverse"
            className="w-10 h-10 rounded-xl object-cover border border-orange-500/40 bg-black shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-lg text-white tracking-wide">
                Kitchen Display System (KDS)
              </h1>
              <span className="flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Live Feed</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Craverse • Active tickets: {activeOrders.length} • 100% Pure Veg
            </p>
          </div>
        </div>

        {/* Controls: Station filters, Sound toggle, Completed toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Station Filter */}
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs overflow-x-auto no-scrollbar max-w-full">
            {['all', 'snacks', 'pizza', 'rice', 'beverages'].map((station) => (
              <button
                key={station}
                onClick={() => setStationFilter(station)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors ${
                  stationFilter === station
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {station}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-slate-800 text-orange-400 border-slate-700'
                : 'bg-slate-800/40 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Mute Kitchen Chime' : 'Unmute Kitchen Chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Toggle between Active & Past Ready */}
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              showCompleted
                ? 'bg-orange-600/20 text-orange-300 border-orange-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {showCompleted ? 'Active Queue' : 'Completed / Cancelled'}
          </button>
        </div>
      </header>

      {/* Ticket Grid */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {activeOrders.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="font-bold text-white text-lg">Kitchen Queue All Clear</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              {showCompleted
                ? 'No past completed or cancelled tickets right now.'
                : 'All orders have been prepared and served. Waiting for new customer orders.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeOrders.map((order) => {
              const elapsedMins = getElapsedMinutes(order.placedAt);
              const isUrgent = elapsedMins >= 15;
              const isWarning = elapsedMins >= 10 && elapsedMins < 15;
              const isCancelled = order.status === 'cancelled';

              return (
                <div
                  key={order.id}
                  className={`flex flex-col justify-between rounded-2xl bg-slate-900 border-2 overflow-hidden shadow-xl transition-all ${
                    isCancelled
                      ? 'border-red-800/80 bg-red-950/20 opacity-80'
                      : order.status === 'placed'
                      ? 'border-amber-500/60 ring-2 ring-amber-500/20'
                      : order.status === 'preparing'
                      ? 'border-orange-500'
                      : order.status === 'ready'
                      ? 'border-emerald-500/60'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-3.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-lg text-white">
                          Table {order.tableNumber}
                        </span>
                        <span className="text-xs font-mono font-bold text-orange-400">
                          {order.orderNumber}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                        <span>{order.customerName || 'Dine-in Guest'}</span>
                        {order.customerPhone && (
                          <span className="text-orange-400/90 font-mono text-[10px]">({order.customerPhone})</span>
                        )}
                      </div>
                    </div>

                    {/* Timer Badge or Cancelled Badge */}
                    {isCancelled ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                        CANCELLED
                      </span>
                    ) : (
                      <div
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                          isUrgent
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                            : isWarning
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{elapsedMins}m ago</span>
                      </div>
                    )}
                  </div>

                  {/* Cooking Note if any */}
                  {order.notes && (
                    <div className="mx-3.5 mt-3 p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-medium">
                      ⚠️ Note: "{order.notes}"
                    </div>
                  )}

                  {/* Items list */}
                  <div className="p-3.5 flex-1 space-y-3 overflow-y-auto max-h-72">
                    {order.items.map((item) => {
                      const badge = getFoodTypeBadge(item.foodType);
                      return (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/80 space-y-1"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2">
                              <span
                                className={`mt-0.5 w-3.5 h-3.5 border-2 ${badge.borderClass} flex items-center justify-center rounded-[3px] bg-slate-900 shrink-0`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                              </span>
                              <div>
                                <div className="font-bold text-white text-sm">
                                  <span className="text-orange-400 font-extrabold mr-1.5">
                                    {item.quantity}x
                                  </span>
                                  {item.productName}
                                </div>
                                {item.variantName && (
                                  <div className="text-[11px] font-semibold text-slate-300">
                                    Portion: {item.variantName}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Customizations */}
                          {item.customizationDetails.length > 0 && (
                            <div className="pl-6 text-[11px] text-slate-400 space-y-0.5">
                              {item.customizationDetails.map((c, i) => (
                                <div key={i} className="text-slate-300 font-mono">
                                  • {c}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Item Cooking Note */}
                          {item.specialInstructions && (
                            <div className="pl-6 text-[11px] text-amber-400 italic">
                              "{item.specialInstructions}"
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="p-3 bg-slate-800/60 border-t border-slate-800 flex items-center gap-2">
                    {!isCancelled && order.status !== 'served' && (
                      <button
                        onClick={() => setCancellingOrder(order)}
                        className="py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-bold transition-all"
                        title="Cancel / Reject Ticket"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}

                    <div className="flex-1">
                      {order.status === 'placed' && (
                        <button
                          onClick={() => handleNextStatus(order)}
                          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
                        >
                          Accept Ticket
                        </button>
                      )}

                      {order.status === 'accepted' && (
                        <button
                          onClick={() => handleNextStatus(order)}
                          className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center space-x-1.5"
                        >
                          <Flame className="w-4 h-4" />
                          <span>Start Preparation</span>
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleNextStatus(order)}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Ready to Serve</span>
                        </button>
                      )}

                      {order.status === 'ready' && (
                        <button
                          onClick={() => handleNextStatus(order)}
                          className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center space-x-1.5"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Mark Delivered to Table</span>
                        </button>
                      )}

                      {order.status === 'served' && (
                        <div className="text-center text-xs text-teal-400 font-bold py-1">
                          Delivered to Table {order.tableNumber}
                        </div>
                      )}

                      {isCancelled && (
                        <div className="text-center text-xs text-red-400 font-bold py-1">
                          Ticket Cancelled
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cancel Order Confirmation Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-slate-100">
            <div className="flex items-center space-x-2 text-red-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-white">Cancel Kitchen Ticket?</h3>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Cancel ticket for <strong>Table {cancellingOrder.tableNumber}</strong> ({cancellingOrder.orderNumber}).
            </p>

            <label className="block text-xs font-bold text-slate-400 mb-2">
              Reason for Cancellation:
            </label>
            <div className="space-y-1.5 mb-5">
              {[
                'Out of ingredients / item 86',
                'Customer requested cancellation',
                'Kitchen peak rush overload',
                'Accidental / duplicate ticket'
              ].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setCancelReason(reason)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    cancelReason === reason
                      ? 'bg-red-500/20 border-red-500 text-red-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-600/30"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
