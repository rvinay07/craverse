import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  ChefHat,
  LayoutDashboard,
  BellRing,
  CreditCard,
  UtensilsCrossed,
  X,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface PortalSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortalSwitcherModal: React.FC<PortalSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, setCurrentRole, orders, serviceRequests, tables } = useApp();

  if (!isOpen) return null;

  const activeKds = orders.filter((o) => o.status === 'placed' || o.status === 'accepted' || o.status === 'preparing').length;
  const activeWaiter = serviceRequests.filter((r) => r.status === 'pending').length;
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;

  const portals: {
    role: Role;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    badge?: number;
  }[] = [
    {
      role: 'customer',
      title: 'Customer Dine-in QR',
      description: 'Customer view for table ordering, menus, customisation & bill',
      icon: <UtensilsCrossed className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
      color: 'hover:border-orange-500 bg-orange-50/30 dark:bg-orange-950/20'
    },
    {
      role: 'kitchen',
      title: 'Kitchen Display System (KDS)',
      description: 'Dedicated screen for chefs: live tickets, timers & station filters',
      icon: <ChefHat className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      color: 'hover:border-amber-500 bg-amber-50/30 dark:bg-amber-950/20',
      badge: activeKds
    },
    {
      role: 'owner',
      title: 'Admin & Multi-Tenant Super Console',
      description: 'Merged administration: Menu, Analytics, Staff, Multi-Brand Tenants & System Settings',
      icon: <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      color: 'hover:border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
    },
    {
      role: 'waiter',
      title: 'Waiter Service Hub',
      description: 'Mobile tablet dashboard: table requests, water alerts & order statuses',
      icon: <BellRing className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'hover:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20',
      badge: activeWaiter
    },
    {
      role: 'cashier',
      title: 'Cashier & POS Terminal',
      description: 'Fast billing, counter payments, thermal receipt generator & settlement',
      icon: <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      color: 'hover:border-purple-500 bg-purple-50/30 dark:bg-purple-950/20',
      badge: occupiedTables
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <img
              src="/craverse-logo.jpg"
              alt="Craverse"
              className="w-9 h-9 rounded-xl object-cover border border-orange-500/30 bg-black shadow-xs shrink-0"
            />
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Craverse Portals</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Switch between Customer & Backend staff consoles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {portals.map((p) => {
            const isCurrent =
              currentRole === p.role ||
              (p.role === 'owner' && (currentRole === 'manager' || currentRole === 'owner'));

            return (
              <button
                key={p.role}
                onClick={() => {
                  setCurrentRole(p.role);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 ${p.color} ${
                  isCurrent ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700 shrink-0">
                    {p.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</span>
                      {isCurrent && (
                        <span className="text-[9px] uppercase font-black px-1.5 py-0.2 rounded bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300">
                          Active
                        </span>
                      )}
                      {Boolean(p.badge && p.badge > 0) && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-600 text-white animate-pulse">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
