import React from 'react';
import { useApp } from '../../../context/AppContext';
import { formatCurrency, formatTimeElapsed, getOrderStatusBadge } from '../../../utils/format';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Percent,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Flame,
  ChefHat
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { orders, tables, inventory, products } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'completed' ? o.totalAmount : o.subtotal), 0);
  const totalOrdersCount = orders.length;
  const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  const occupiedTablesCount = tables.filter((t) => t.status === 'occupied').length;
  const occupancyPercent = tables.length > 0 ? Math.round((occupiedTablesCount / tables.length) * 100) : 0;

  const lowStockItems = inventory.filter((i) => i.currentStock <= i.minThreshold);
  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Gross Sales Today</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-bold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last Saturday</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Orders Placed</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalOrdersCount}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            {activeOrders.length} currently active in kitchen
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Avg Order Value (AOV)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {formatCurrency(aov)}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            Higher by ₹140 on digital QR orders
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Floor Occupancy</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {occupancyPercent}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {occupiedTablesCount} of {tables.length} tables seated
          </div>
        </div>
      </div>

      {/* Alerts and Activity Feed Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Kitchen Orders Feed */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-5 h-5 text-orange-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Live Order Activity</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Auto-refreshes in real time
            </span>
          </div>

          {activeOrders.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No pending orders in the kitchen.</p>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {activeOrders.map((ord) => {
                const badge = getOrderStatusBadge(ord.status);
                return (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-slate-900 text-sm">{ord.orderNumber}</span>
                        <span className="text-xs font-bold text-orange-600">Table {ord.tableNumber}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 truncate max-w-md">
                        {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {formatCurrency(ord.totalAmount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatTimeElapsed(ord.placedAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Low Stock Alerts & Quick Highlights */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-red-600 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Low Inventory Alerts ({lowStockItems.length})</span>
            </div>

            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-400">All pantry ingredients are well-stocked.</p>
            ) : (
              <div className="space-y-2">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-red-50/70 border border-red-200/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.category}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-red-700">
                        {item.currentStock} {item.unit}
                      </span>
                      <div className="text-[9px] text-red-500 font-medium">
                        Min: {item.minThreshold} {item.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-amber-600 p-5 rounded-3xl text-white shadow-md space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-xs uppercase tracking-wider text-orange-200">
              <Flame className="w-4 h-4" />
              <span>Menu Highlights</span>
            </div>
            <h4 className="font-black text-base">Top Bestseller Today</h4>
            <p className="text-xs text-orange-100 leading-relaxed">
              Angara Paneer Tikka & Nizami Dum Biryani account for 42% of table appetizer sales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

