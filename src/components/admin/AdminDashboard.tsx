import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OverviewTab } from './tabs/OverviewTab';
import { MenuTab } from './tabs/MenuTab';
import { TablesQrTab } from './tabs/TablesQrTab';
import { InventoryTab } from './tabs/InventoryTab';
import { StaffTab } from './tabs/StaffTab';
import { ReportsTab } from './tabs/ReportsTab';
import { TenantsTab } from './tabs/TenantsTab';
import { SettingsTab } from './tabs/SettingsTab';
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  Package,
  Users,
  BarChart3,
  Building2,
  Settings
} from 'lucide-react';

export type AdminTab = 'overview' | 'menu' | 'tables' | 'inventory' | 'staff' | 'reports' | 'tenants' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { restaurant } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const navigationItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu & Dishes', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'tables', label: 'Tables & QRs', icon: <QrCode className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory & Stock', icon: <Package className="w-4 h-4" /> },
    { id: 'staff', label: 'Staff & Roles', icon: <Users className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'tenants', label: 'Multi-Tenant & Branches', icon: <Building2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Taxes', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pb-16 transition-colors">
      {/* Sub-Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-14 sm:top-14 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-2">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={isActive ? 'text-orange-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'menu' && <MenuTab />}
        {activeTab === 'tables' && <TablesQrTab />}
        {activeTab === 'inventory' && <InventoryTab />}
        {activeTab === 'staff' && <StaffTab />}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'tenants' && <TenantsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};
