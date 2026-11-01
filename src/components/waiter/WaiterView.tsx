import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Table, Order } from '../../types';
import { formatCurrency, formatTimeElapsed } from '../../utils/format';
import {
  BellRing,
  UtensilsCrossed,
  CheckCircle2,
  Clock,
  Sparkles,
  Receipt,
  User,
  Coffee,
  Check
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const WaiterView: React.FC = () => {
  const {
    tables,
    floors,
    orders,
    serviceRequests,
    resolveServiceRequest,
    updateTable,
    updateOrderStatus,
    setCurrentTableByNumber,
    setCurrentRole
  } = useApp();

  const [selectedFloorId, setSelectedFloorId] = useState<string>('all');
  const [selectedTableForDetails, setSelectedTableForDetails] = useState<Table | null>(null);

  // Active assistance requests
  const pendingRequests = serviceRequests.filter((r) => r.status === 'pending');

  const filteredTables = tables.filter((t) => {
    if (selectedFloorId !== 'all' && t.floorId !== selectedFloorId) return false;
    return true;
  });

  const getTableOrders = (tableId: string): Order[] => {
    return orders.filter(
      (o) => o.tableId === tableId && o.status !== 'completed' && o.status !== 'cancelled'
    );
  };

  const handleResolveRequest = (reqId: string, tableId: string) => {
    resolveServiceRequest(reqId);
    // Clear waiter call flag on table if no more pending
    updateTable(tableId, { waiterCallActive: false });
    playSound('success');
  };

  const handleMarkServed = (orderId: string) => {
    updateOrderStatus(orderId, 'served', 'Waiter served order to guests');
    playSound('success');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pb-12 transition-colors">
      {/* Waiter Hub Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 sticky top-14 sm:top-14 z-30 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <img
            src="/craverse-logo.jpg"
            alt="Craverse"
            className="w-10 h-10 rounded-xl object-cover border border-orange-500/30 bg-black shadow-xs shrink-0"
          />
          <div>
            <h1 className="font-extrabold text-slate-900 dark:text-white text-lg">Waiter Floor Hub</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Craverse • Assigned Floor: All Sections • {pendingRequests.length} Active Call(s)
            </p>
          </div>
        </div>

        {/* Floor Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedFloorId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFloorId === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Floors
          </button>
          {floors.map((floor) => (
            <button
              key={floor.id}
              onClick={() => setSelectedFloorId(floor.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFloorId === floor.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {floor.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        {/* Urgent Service Call Banner (if active) */}
        {pendingRequests.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 shadow-md">
            <div className="flex items-center space-x-2 text-amber-900 font-black text-sm mb-3">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <span>Table Assistance Requests ({pendingRequests.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-base font-black text-slate-900">
                        Table {req.tableNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                        {req.type.replace('_', ' ')}
                      </span>
                    </div>
                    {req.details && (
                      <p className="text-xs text-slate-600 mt-0.5">"{req.details}"</p>
                    )}
                    <span className="text-[10px] text-slate-400">
                      {formatTimeElapsed(req.requestedAt)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleResolveRequest(req.id, req.tableId)}
                    className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floor Table Matrix */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-slate-900 text-base">
              Floor Tables Overview ({filteredTables.length})
            </h2>
            <div className="flex items-center space-x-3 text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Vacant</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Occupied</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filteredTables.map((table) => {
              const tableOrders = getTableOrders(table.id);
              const isOccupied = table.status === 'occupied';
              const hasReadyToServe = tableOrders.some((o) => o.status === 'ready');
              const hasActiveCall = table.waiterCallActive;

              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedTableForDetails(table)}
                  className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between shadow-sm hover:shadow-md ${
                    hasActiveCall
                      ? 'border-red-500 bg-red-50/50 ring-2 ring-red-300'
                      : hasReadyToServe
                      ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-300'
                      : isOccupied
                      ? 'border-amber-400 bg-amber-50/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400 font-semibold">{table.floorName}</span>
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          isOccupied
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {table.status}
                      </span>
                    </div>

                    <div className="text-center py-2">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        {table.tableNumber}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Capacity: {table.capacity} guests
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 mt-2 space-y-1">
                    {hasActiveCall && (
                      <div className="flex items-center justify-center space-x-1 text-[11px] font-bold text-red-600 animate-pulse">
                        <BellRing className="w-3.5 h-3.5" />
                        <span>Assistance Needed</span>
                      </div>
                    )}

                    {hasReadyToServe && (
                      <div className="flex items-center justify-center space-x-1 text-[11px] font-bold text-emerald-700">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Food Ready to Serve!</span>
                      </div>
                    )}

                    {isOccupied && !hasReadyToServe && !hasActiveCall && (
                      <div className="text-[11px] font-bold text-slate-600 text-center">
                        {tableOrders.length} order batch(es) active
                      </div>
                    )}

                    {!isOccupied && (
                      <div className="text-[11px] text-slate-400 text-center">
                        Available for seating
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Table Detail Drawer Modal */}
      {selectedTableForDetails && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full sm:max-w-md h-full flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-extrabold text-base">
                  Table {selectedTableForDetails.tableNumber} Management
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedTableForDetails.floorName} • Capacity: {selectedTableForDetails.capacity}
                </p>
              </div>
              <button
                onClick={() => setSelectedTableForDetails(null)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Quick Waiter Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setCurrentTableByNumber(selectedTableForDetails.tableNumber);
                    setCurrentRole('customer');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 flex items-center justify-center space-x-1.5"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Punch Order for Table</span>
                </button>

                <button
                  onClick={() => {
                    updateTable(selectedTableForDetails.id, {
                      status: selectedTableForDetails.status === 'occupied' ? 'vacant' : 'occupied'
                    });
                    setSelectedTableForDetails(null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200"
                >
                  Toggle {selectedTableForDetails.status === 'occupied' ? 'Vacant' : 'Occupied'}
                </button>
              </div>

              {/* Table Orders */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  Active Orders ({getTableOrders(selectedTableForDetails.id).length})
                </h4>

                {getTableOrders(selectedTableForDetails.id).length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No active orders</p>
                ) : (
                  getTableOrders(selectedTableForDetails.id).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-black text-slate-900">{ord.orderNumber}</span>
                          {ord.customerName && (
                            <div className="text-[11px] text-slate-500">
                              Guest: <span className="font-semibold text-slate-700">{ord.customerName}</span>
                              {ord.customerPhone && <span className="font-mono text-orange-600"> ({ord.customerPhone})</span>}
                            </div>
                          )}
                        </div>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full uppercase text-[10px] ${
                            ord.status === 'ready'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {ord.items.map((it) => (
                          <div key={it.id} className="flex justify-between text-slate-700">
                            <span>
                              {it.quantity}x {it.productName}
                            </span>
                            <span>{formatCurrency(it.totalPrice)}</span>
                          </div>
                        ))}
                      </div>

                      {ord.status === 'ready' && (
                        <button
                          onClick={() => handleMarkServed(ord.id)}
                          className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Food Delivered & Served</span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

