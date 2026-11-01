import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { CustomerDineInView } from './components/customer/CustomerDineInView';
import { KitchenDisplay } from './components/kds/KitchenDisplay';
import { WaiterView } from './components/waiter/WaiterView';
import { CashierBilling } from './components/cashier/CashierBilling';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SuperAdminView } from './components/superadmin/SuperAdminView';
import { Role } from './types';

export const MainAppContent: React.FC = () => {
  const { currentRole, setCurrentRole } = useApp();

  // Support direct portal query parameter, e.g. ?portal=kds or ?portal=admin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const portalParam = params.get('portal');
      if (portalParam) {
        const portalMap: Record<string, Role> = {
          kds: 'kitchen',
          kitchen: 'kitchen',
          admin: 'owner',
          owner: 'owner',
          manager: 'manager',
          superadmin: 'owner',
          super_admin: 'owner',
          waiter: 'waiter',
          cashier: 'cashier',
          customer: 'customer',
          menu: 'customer'
        };
        const targetRole = portalMap[portalParam.toLowerCase()];
        if (targetRole) {
          setCurrentRole(targetRole);
        }
      }
    }
  }, [setCurrentRole]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar: only shown for staff backend portals, hidden in customer dine-in */}
      <Navbar />

      <main className="flex-1">
        {currentRole === 'customer' && <CustomerDineInView />}
        {currentRole === 'kitchen' && <KitchenDisplay />}
        {currentRole === 'waiter' && <WaiterView />}
        {currentRole === 'cashier' && <CashierBilling />}
        {(currentRole === 'owner' || currentRole === 'manager' || currentRole === 'super_admin') && (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
};

export default MainAppContent;
