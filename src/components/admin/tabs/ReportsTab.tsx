import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/format';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  Download,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  PieChart as PieIcon
} from 'lucide-react';

const REVENUE_DATA_WEEK = [
  { day: 'Mon', revenue: 24500, orders: 38 },
  { day: 'Tue', revenue: 28900, orders: 44 },
  { day: 'Wed', revenue: 31200, orders: 49 },
  { day: 'Thu', revenue: 36400, orders: 56 },
  { day: 'Fri', revenue: 58200, orders: 88 },
  { day: 'Sat', revenue: 74800, orders: 112 },
  { day: 'Sun', revenue: 68500, orders: 104 },
];

const PEAK_HOURS_DATA = [
  { hour: '12 PM', orders: 18 },
  { hour: '1 PM', orders: 42 },
  { hour: '2 PM', orders: 36 },
  { hour: '3 PM', orders: 12 },
  { hour: '4 PM', orders: 8 },
  { hour: '5 PM', orders: 14 },
  { hour: '6 PM', orders: 22 },
  { hour: '7 PM', orders: 48 },
  { hour: '8 PM', orders: 76 },
  { hour: '9 PM', orders: 84 },
  { hour: '10 PM', orders: 52 },
];

const CATEGORY_SHARE = [
  { name: 'Artisan Pizzas', value: 42, color: '#ea580c' },
  { name: 'Snacks & Starters', value: 28, color: '#f59e0b' },
  { name: 'Rice Bowls', value: 15, color: '#10b981' },
  { name: 'Coffees & Chai', value: 10, color: '#6366f1' },
  { name: 'Chilled Drinks', value: 5, color: '#ec4899' },
];

export const ReportsTab: React.FC = () => {
  const { orders, products } = useApp();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  const totalWeeklySales = REVENUE_DATA_WEEK.reduce((sum, d) => sum + d.revenue, 0);
  const totalWeeklyOrders = REVENUE_DATA_WEEK.reduce((sum, d) => sum + d.orders, 0);
  const weeklyAov = Math.round(totalWeeklySales / totalWeeklyOrders);

  // CSV Export
  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Order ID,Table,Date,Subtotal,Discount,Taxes,Total,Status,Payment']
        .concat(
          orders.map(
            (o) =>
              `${o.orderNumber},${o.tableNumber},${o.placedAt.slice(0, 10)},${o.subtotal},${o.discountAmount},${(o.cgstAmount + o.sgstAmount).toFixed(2)},${o.totalAmount},${o.status},${o.paymentStatus}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `craverse_sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {['today', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as 'today' | 'week' | 'month')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                timeRange === range
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'Today'}
            </button>
          ))}
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1.5 shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-orange-600" />
          <span>Export Sales CSV</span>
        </button>
      </div>

      {/* KPI Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Total Revenue ({timeRange})</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(totalWeeklySales)}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">
            +22.5% increase in diner turnover
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Total Diners Served</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalWeeklyOrders} tables
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Avg dining duration: 48 mins
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400">Average Check Value</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(weeklyAov)}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">
            +14% with digital addon upsells
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Revenue Trend Area Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Daily Revenue & Order Volume
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400">Mon - Sun</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA_WEEK} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Contribution Pie Chart */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <PieIcon className="w-5 h-5 text-orange-600" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Sales by Category
            </h3>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_SHARE}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_SHARE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {CATEGORY_SHARE.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-600 font-medium">{c.name}</span>
                </div>
                <span className="font-black text-slate-900">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Ordering Hours Bar Chart */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Clock className="w-5 h-5 text-orange-600" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Peak Dining & Kitchen Rush Hours
            </h3>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PEAK_HOURS_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  formatter={(val: number) => [`${val} orders`, 'Volume']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Bestselling Dishes */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-orange-600" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Top Selling Dishes
            </h3>
          </div>

          <div className="space-y-3">
            {products.slice(0, 5).map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 font-black flex items-center justify-center text-xs">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-[10px] text-slate-400">{p.categoryName}</div>
                  </div>
                </div>
                <span className="font-extrabold text-slate-800">
                  {formatCurrency(p.price * (18 - idx * 2))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

