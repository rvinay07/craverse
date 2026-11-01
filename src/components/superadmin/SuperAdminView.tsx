import React from 'react';
import { TenantsTab } from '../admin/tabs/TenantsTab';

export const SuperAdminView: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <TenantsTab />
    </div>
  );
};
