import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  UtensilsCrossed,
  ChefHat,
  BellRing,
  CreditCard,
  LayoutDashboard,
  Building2,
  RefreshCw,
  QrCode,
  Volume2,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    restaurant,
    currentTable,
    tables,
    setCurrentTableByNumber,
    orders,
    serviceRequests,
    resetToDefaultData,
    theme,
    toggleTheme
  } = useApp();

  const [showTableModal, setShowTableModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // If customer is browsing the menu, do NOT show the heavy backend navigation bar!
  if (currentRole === 'customer') {
    return null;
  }

  const activeKdsCount = orders.filter((o) => o.status === 'placed' || o.status === 'accepted' || o.status === 'preparing').length;
  const activeWaiterCalls = serviceRequests.filter((r) => r.status === 'pending').length;
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;

  const backendPortals: { role: Role; label: string; icon: React.ReactNode; badge?: number }[] = [
    { role: 'kitchen', label: 'Kitchen KDS', icon: <ChefHat className="w-4 h-4" />, badge: activeKdsCount },
    { role: 'owner', label: 'Admin & Multi-Tenant', icon: <LayoutDashboard className="w-4 h-4" /> },
    { role: 'waiter', label: 'Waiter Hub', icon: <BellRing className="w-4 h-4" />, badge: activeWaiterCalls },
    { role: 'cashier', label: 'Cashier POS', icon: <CreditCard className="w-4 h-4" />, badge: occupiedTables }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left: Back to Customer Menu & Brand */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentRole('customer')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Customer Menu</span>
              </button>

              <div className="hidden sm:flex items-center space-x-2">
                <img
                  src={restaurant.logo || '/craverse-logo.jpg'}
                  alt="Craverse"
                  className="w-7 h-7 rounded-lg object-cover border border-slate-700 bg-black shadow-xs"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-sm text-slate-200">
                      {restaurant.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-orange-400 px-1.5 py-0.2 rounded bg-orange-500/20 border border-orange-500/30">
                      Staff Console
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 hidden lg:inline">
                    {restaurant.tagline || 'Your Universe of Flavours.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Backend Portal Pills */}
            <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
              {backendPortals.map((item) => {
                const isActive = currentRole === item.role || (item.role === 'owner' && (currentRole === 'manager' || currentRole === 'owner'));
                return (
                  <button
                    key={item.role}
                    onClick={() => setCurrentRole(item.role)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-sm ring-1 ring-orange-500 border-b-2 border-orange-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="hidden md:inline">{item.label}</span>
                    {Boolean(item.badge && item.badge > 0) && (
                      <span className="flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold rounded-full bg-red-600 text-white ml-0.5 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Theme Toggle, Audio Chime & Demo Reset */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
              >
                {theme === 'light' ? <Moon className="w-4 h-4 text-slate-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>

              <button
                onClick={() => playSound('kitchen_new')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                title="Test Audio Chime"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-orange-400 hover:bg-slate-800"
                title="Reset to Fresh Demo Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-slate-900">
            <h3 className="font-bold text-slate-900 text-base mb-2">Reset to Demo Data?</h3>
            <p className="text-xs text-slate-600 mb-5">
              This will re-initialize all 100% Pure Veg menus, snacks, pizzas, rice bowls, drinks, tables, and active orders.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs"
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
